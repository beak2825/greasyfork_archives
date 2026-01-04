// ==UserScript==
// @name        TGchan ID Tracker
// @namespace   TGchanIDTracker
// @include     *//tgchan.org/kusaba/quest/res/*
// @include     *//tgchan.org/kusaba/questarch/res/*
// @include     *//tgchan.org/kusaba/questdis/res/*
// @include     *//tgchan.org/kusaba/graveyard/res/*
// @description Provides info about each poster and allows per-poster navigation.
// @version     10
// @run-at      document-start
// @grant       none
// @icon        data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVQokWNgoBOI2mJKpEomMvQgNAxRPUy4JGjjJJqoZoSrZmBgWOZzGlk/mlKILBMafxAAAE1pG/UEXzMMAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/33132/TGchan%20ID%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/33132/TGchan%20ID%20Tracker.meta.js
// ==/UserScript==
"use strict";

//enum
const PostType = { UPDATE: 0, AUTHORCOMMENT: 1, SUGGESTION: 2, COMMENT: 3 };

//UpdateAnalyzer class
//Input: document of the quest
//Output: a Map object with all the quest's posts, where keys are post IDs and values are post types. The post types are Update (0), AuthorComment (1), Suggestion (2), Comment (3); There's no comments... yet.
//Usage: var results = new UpdateAnalyzer().processQuest(document);
class UpdateAnalyzer {
  constructor(options) {
    this.regex = UpdateAnalyzer.getRegexes();
    if (options) {
      this.postCache = null; //Used to transfer posts cache to/from this class. Used for debugging purposes.
      this.useCache = options.useCache; //Used for debugging purposes.
      this.debug = options.debug;
      this.debugAfterDate = options.debugAfterDate;
    }
  }

  analyzeQuest(questDoc) {
    var posts = !this.postCache ? this.getPosts(questDoc) : JSON.parse(new TextDecoder().decode(this.postCache));
    var authorID = posts[0].userID; //authodID is the userID of the first post
    this.threadID = posts[0].postID; //threadID is the postID of the first post

    this.totalFiles = this.getTotalFileCount(posts);
    var questFixes = this.getFixes(this.threadID); //for quests where we can't correctly determine authors and updates, we use a built-in database of fixes
    if (this.debug && (questFixes.imageQuest !== undefined || Object.values(questFixes).some(fix => Object.values(fix).length > 0))) { console.log(`Quest has manual fixes`); console.log(questFixes); }
    var graphData = this.getUserGraphData(posts, questFixes, authorID); //get user names as nodes and edges for building user graph
    var users = this.buildUserGraph(graphData.nodes, graphData.edges); //build a basic user graph... whatever that means!
    this.author = this.find(users[authorID]);
    this.getUserPostAndFileCounts(posts, users, questFixes); //count the amount of posts and files each user made
    this.imageQuest = this.isImageQuest(questFixes); //image quest is when the author posts files at least 50% of the time
    if (this.debug) console.log(`Image quest: ${this.imageQuest}`);
    if (this.imageQuest) { //in case this is an image quest, merge users a bit differently
      users = this.buildUserGraph(graphData.nodes, graphData.edges, graphData.strongNodes, authorID); //build the user graph again, but with some restrictions
      this.author = this.find(users[authorID]);
      this.processFilePosts(posts, users, questFixes); //analyze file names and merge users based on when one file name is predicted from another
      this.getUserPostAndFileCounts(posts, users, questFixes); //count the amount of posts and files each user posted
      this.mergeCommonFilePosters(posts, users, questFixes); //merge certain file-posting users with the quest author
      this.mergeMajorityFilePoster(posts, users, questFixes); //consider a user who posted 50%+ of the files in the thread as the author
    }
    console.log(users);
    var postUsers = this.setPostUsers(posts, users, questFixes); //do final user resolution
    var postTypes = this.getFinalPostTypes(posts, questFixes); //determine which posts are updates
    return { postTypes: postTypes, postUsers: postUsers };
  }

  getPosts(questDoc) {
    var defaultName = "Suggestion";
    var posts = new Map(); //dictionary => postID / post object; need to use Map so that the post order is preserved
    questDoc.body.querySelector(":scope > form").querySelectorAll(".postwidth").forEach(postHeaderElement => {
      var postID = postHeaderElement.firstElementChild.name;
      postID = parseInt(postID !== "s" ? postID : postHeaderElement.querySelector(`a[name]:not([name="s"])`).name);
      var uid, name, trip, subject, fileElement, fileExt, fileName = "", activeContent, contentElement, labelEl;

      var uidElement = postHeaderElement.querySelector(".uid");
      uid = uidElement.textContent.substring(4);
      labelEl = postHeaderElement.querySelector("label");
      subject = labelEl.querySelector(".filetitle");
      subject = subject ? subject.textContent.trim() : "";
      trip = labelEl.querySelector(".postertrip");
      if (trip) { //use tripcode instead of name if it exists
        name = trip.textContent;
      }
      else {
        name = labelEl.querySelector(".postername").textContent.trim();
        name = name == defaultName ? "" : name.toLowerCase();
      }
      fileElement = postHeaderElement.querySelector(".filesize");
      if (fileElement) { //try to get the original file name
        fileName = fileElement.querySelector("a").href;
        var match = fileName.match(this.regex.fileExtension);
        fileExt = match ? match[0] : ""; //don't need .toLowerCase()
        if (fileExt == ".png" || fileExt == ".gif" || fileExt == ".jpg" || fileExt == ".jpeg") {
          var fileInfo = fileElement.lastChild.textContent.split(", ");
          if (fileInfo.length >= 3) {
            fileName = fileInfo[2].split("\n")[0];
          }
        }
        else {
          fileName = fileName.substr(fileName.lastIndexOf("/") + 1); //couldn't find original file name, use file name from the server instead
        }
        fileName = fileName.replace(this.regex.fileExtension, ""); //ignore file's extension
      }
      contentElement = postHeaderElement.nextElementSibling;
      activeContent = contentElement.querySelector("img, iframe") ? true : false; //does a post contain icons
      var postData = { postID: postID, userID: uid, userName: name, fileName: fileName, activeContent: activeContent };
      if (this.useCache) {
        postData.textUpdate = this.regex.fraction.test(subject) || this.containsQuotes(contentElement);
      }
      else {
        postData.subject = subject;
        postData.contentElement = contentElement;
      }
      if (this.useCache || this.debug || this.debugAfterDate) {
        postData.date = Date.parse(postHeaderElement.querySelector("label").lastChild.nodeValue);
      }
      posts.set(postID, postData);
    });
    var postsArray = [...posts.values(posts)]; //convert to an array
    if (this.useCache) { //We stringify the object into JSON and then encode it into a Uint8Array to save space, otherwise the database would be too large
      this.postCache = new TextEncoder().encode(Object.toJSON ? Object.toJSON(postsArray) : JSON.stringify(postsArray)); //JSON.stringify stringifies twice when used on array. Another TGchan's protoaculous bug.
    }
    return postsArray;
  }

  getTotalFileCount(posts) {
    var totalFileCount = 0;
    posts.forEach(post => { if (post.fileName || post.activeContent) totalFileCount++; });
    return totalFileCount;
  }

  isImageQuest(questFixes, ignore) {
    if (questFixes.imageQuest !== undefined) {
      return questFixes.imageQuest;
    }
    else {
      return (this.author.fileCount / this.author.postCount) >= 0.5;
    }
  }

  getUserGraphData(posts, questFixes, authorID) {
    var graphData = { nodes: new Set(), strongNodes: new Set(), edges: {} };
    posts.forEach(post => {
      graphData.nodes.add(post.userID);
      if (post.userName) {
        graphData.nodes.add(post.userName);
        graphData.edges[`${post.userID}${post.userName}`] = { E1: post.userID, E2: post.userName };
      }
      if (post.fileName || post.activeContent) { //strong nodes are user IDs that posted files
        graphData.strongNodes.add(post.userID);
        if (post.userName) {
          graphData.strongNodes.add(post.userName);
        }
        if (post.fileName && post.activeContent && post.userID != authorID) { //users that made posts with both file and icons are most likely the author
          graphData.edges[`${authorID}${post.userID}`] = { E1: authorID, E2: post.userID, hint: "fileAndIcons" };
        }
      }
    });
    for (var missedID in questFixes.missedAuthors) { //add missing links to the author from manual fixes
      graphData.edges[`${authorID}${missedID}`] = { E1: authorID, E2: missedID, hint: "missedAuthors" };
      graphData.strongNodes.add(missedID);
    }
    graphData.edges = Object.values(graphData.edges);
    return graphData;
  }

  buildUserGraph(nodes, edges, strongNodes, authorID) {
    var users = {};
    var edgesSet = new Set(edges);
    nodes.forEach(node => {
      users[node] = this.makeSet(node);
    });
    if (!strongNodes) {
      edgesSet.forEach(edge => this.union(users[edge.E1], users[edge.E2]));
    }
    else {
      edgesSet.forEach(edge => { //merge strong with strong and weak with weak
        if ((strongNodes.has(edge.E1) && strongNodes.has(edge.E2)) || (!strongNodes.has(edge.E1) && !strongNodes.has(edge.E2))) {
          this.union(users[edge.E1], users[edge.E2]);
          edgesSet.delete(edge);
        }
      });
      var author = this.find(users[authorID]);
      edgesSet.forEach(edge => { //merge strong with weak, but only for users which aren't the author
        if (this.find(users[edge.E1]) != author && this.find(users[edge.E2]) != author) {
          this.union(users[edge.E1], users[edge.E2]);
        }
      });
    }
    return users;
  }

  processFilePosts(posts, users, questFixes) {
    var last2Files = new Map();
    var filePosts = posts.filter(post => post.fileName && !questFixes.wrongImageUpdates[post.postID]);
    filePosts.forEach(post => {
      var postUser = this.find(users[post.userID]);
      var postFileName = post.fileName.match(this.regex.lastNumber) ? post.fileName : null; //no use processing files without numbers
      if (post.userName && this.find(users[post.userName]) == this.author) {
        postUser = this.author;
      }
      if (!last2Files.has(postUser)) {
        last2Files.set(postUser, [ null, null ]);
      }
      last2Files.get(postUser).shift();
      last2Files.get(postUser).push(postFileName);
      last2Files.forEach((last2, user) => {
        if (user == postUser) {
          return;
        }
        if ((last2[0] !== null && this.fileNamePredicts(last2[0], post.fileName)) || (last2[1] !== null && this.fileNamePredicts(last2[1], post.fileName))) {
          if (this.debug || (this.debugAfterDate && this.debugAfterDate < post.date)) {
            console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html#${post.postID} merged (file name) ${postUser.id} with ${user.id} (author: ${this.author.id})`);
          }
          var mergedUser = this.union(user, postUser);
          last2Files.delete(user.parent != user ? user : postUser);
          last2Files.get(mergedUser).shift();
          last2Files.get(mergedUser).push(postFileName);
          if (this.find(this.author) == mergedUser) {
            this.author = mergedUser;
          }
        }
      });
    });
    return true;
  }

  getUserPostAndFileCounts(posts, users, questFixes) {
    for (var userID in users) {
      users[userID].postCount = 0;
      users[userID].fileCount = 0;
    }
    posts.forEach(post => {
      var user = this.decidePostUser(post, users, questFixes);
      user.postCount++;
      if (post.fileName || post.activeContent) {
        user.fileCount++;
      }
    });
  }

  fileNamePredicts(fileName1, fileName2) {
    var match1 = fileName1.match(this.regex.lastNumber);
    var match2 = fileName2.match(this.regex.lastNumber);
    if (!match1 || !match2) {
      return false;
    }
    var indexDifference = match2.index - match1.index;
    if (indexDifference > 1 || indexDifference < -1) {
      return false;
    }
    var numberDifference = parseInt(match2[1]) - parseInt(match1[1]);
    if (numberDifference !== 2 && numberDifference !== 1) {
      return false;
    }
    var name1 = fileName1.replace(this.regex.lastNumber, "");
    var name2 = fileName2.replace(this.regex.lastNumber, "");
    return this.stringsAreSimilar(name1, name2);
  }

  stringsAreSimilar(string1, string2) {
    var lengthDiff = string1.length - string2.length;
    if (lengthDiff > 1 || lengthDiff < -1) {
      return false;
    }
    var s1 = lengthDiff > 0 ? string1 : string2;
    var s2 = lengthDiff > 0 ? string2 : string1;
    for (var i = 0, j = 0, diff = 0; i < s1.length; i++, j++) {
      if (s1[i] !== s2[j]) {
        diff++;
        if (diff === 2) {
          return false;
        }
        if (lengthDiff !== 0) {
          j--;
        }
      }
    }
    return true;
  }

  mergeMajorityFilePoster(posts, users, questFixes) {
    if (this.author.fileCount > this.totalFiles / 2) {
      return;
    }
    for (var userID in users) {
      if (users[userID].fileCount >= this.totalFiles / 2 && users[userID] != this.author) {
        if (this.debug || (this.debugAfterDate && this.debugAfterDate < posts[posts.length - 1].date)) {
          console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html merged majority file poster ${users[userID].id} ${(100 * users[userID].fileCount / this.totalFiles).toFixed(1)}%`);
        }
        var parent = this.union(this.author, users[userID]);
        var child = users[userID].parent != users[userID] ? users[userID] : this.author;
        parent.fileCount += child.fileCount;
        parent.postCount += child.postCount;
        this.author = parent;
        return;
      }
    }
  }

  mergeCommonFilePosters(posts, users, questFixes) {
    var merged = [];
    var filteredUsers = Object.values(users).filter(user => user.parent == user && user.fileCount >= 3 && user.fileCount / user.postCount > 0.5 && user != this.author);
    var usersSet = new Set(filteredUsers);
    posts.forEach(post => {
      if ((post.fileName || post.activeContent) && !questFixes.wrongImageUpdates[post.postID] && this.isTextPostAnUpdate(post)) {
        for (var user of usersSet) {
          if (this.find(users[post.userID]) == user) {
            if (this.debug || (this.debugAfterDate && this.debugAfterDate < post.date)) {
              console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html new common poster ${users[post.userID].id}`);
            }
            var parent = this.union(this.author, user);
            var child = user.parent != user ? user : this.author;
            parent.fileCount += child.fileCount;
            parent.postCount += child.postCount;
            this.author = parent;
            usersSet.delete(user);
            break;
          }
        }
      }
    });
  }

  setPostUsers(posts, users, questFixes) {
    var postUsers = new Map();
    posts.forEach(post => {
      post.user = this.decidePostUser(post, users, questFixes);
      postUsers.set(post.postID, post.user);
    });
    return postUsers;
  }

  decidePostUser(post, users, questFixes) {
    var user = this.find(users[post.userID]);
    if (post.userName) {
      if (questFixes.ignoreTextPosts[post.userName]) { //choose to the one that isn't the author
        if (user == this.author) {
          user = this.find(users[post.userName]);
        }
      }
      else if (this.find(users[post.userName]) == this.author) { //choose the one that is the author
        user = this.author;
      }
    }
    return user;
  }

  getFinalPostTypes(posts, questFixes) {
    // Updates are posts made by the author and, in case of image quests, author posts that contain files or icons
    var postTypes = new Map();
    posts.forEach(post => {
      var postType = PostType.SUGGESTION;
      if (post.user == this.author) {
        if (post.fileName || post.activeContent) { //image post
          if (!questFixes.wrongImageUpdates[post.postID]) {
            postType = PostType.UPDATE;
          }
          else if (!questFixes.ignoreTextPosts[post.userID] && !questFixes.ignoreTextPosts[post.userName]) {
            postType = PostType.AUTHORCOMMENT;
          }
        }
        else if (!questFixes.ignoreTextPosts[post.userID] && !questFixes.ignoreTextPosts[post.userName]) { //text post
          if (!questFixes.wrongTextUpdates[post.postID] && (!this.imageQuest || this.isTextPostAnUpdate(post))) {
            postType = PostType.UPDATE;
          }
          else {
            postType = PostType.AUTHORCOMMENT;
          }
        }
        if (questFixes.missedTextUpdates[post.postID]) {
          postType = PostType.UPDATE;
        }
      }
      if (this.debugAfterDate && this.debugAfterDate < post.date) {
        if (postType == PostType.SUGGESTION && post.fileName) console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new non-update`);
        if (postType == PostType.AUTHORCOMMENT) console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new author comment`);
        if (postType == PostType.UPDATE && this.imageQuest && !post.fileName && !post.activeContent) console.log(`https://tgchan.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new text update`);
      }
      postTypes.set(post.postID, postType);
    });
    return postTypes;
  }

  getPostUsers(posts) {
    var postUsers = new Map();
    posts.forEach(post => { postUsers.set(post.postID, post.user); });
    return postUsers;
  }

  isTextPostAnUpdate(post) {
    if (post.textUpdate === undefined) {
      post.textUpdate = this.regex.fraction.test(post.subject) || this.containsQuotes(post.contentElement);
    }
    return post.textUpdate;
  }

  containsQuotes(contentElement) {
    //extract post's text, but ignore text inside spoilers, links, dice rolls or any sort of brackets
    var filteredContentText = "";
    contentElement.childNodes.forEach(node => {
      if (node.className !== "spoiler" && node.nodeName != "A" && (node.nodeName != "B" || !this.regex.diceRoll.test(node.textContent))) {
        filteredContentText += node.textContent;
      }
    });
    filteredContentText = filteredContentText.replace(this.regex.bracketedTexts, "").trim();
    //if the post contains dialogue, then it's likely to be an update
    var quotedTexts = filteredContentText.match(this.regex.quotedTexts) || [];
    for (let q of quotedTexts) {
      if (this.regex.endsWithPunctuation.test(q)) {
        return true;
      }
    }
    return false;
  }

  makeSet(id) {
    var node = { id: id, children: [] };
    node.parent = node;
    return node;
  }

  find(node) { //find with path halving
    while (node.parent != node) {
      var curr = node;
      node = node.parent;
      curr.parent = node.parent;
    }
    return node;
  }

  union(node1, node2) {
    var node1root = this.find(node1);
    var node2root = this.find(node2);
    if (node1root == node2root) {
      return node1root;
    }
    node2root.parent = node1root;
    node1root.children.push(node2root); //having a list of children isn't a part of Union-Find, but it makes debugging much easier
    node2root.children.forEach(child => node1root.children.push(child));
    return node1root;
  }

  static getRegexes() {
    if (!this.regex) { //cache as a static class property
      this.regex = {
        fileExtension: new RegExp("[.][^.]+$"), //finds ".png" in "image.png"
        lastNumber: new RegExp("([0-9]+)(?=[^0-9]*$)"), //finds "50" in "image50.png"
        fraction: new RegExp("[0-9][ ]*/[ ]*[0-9]"), //finds "1/4" in "Update 1/4"
        diceRoll: new RegExp("^rolled [0-9].* = [0-9]+$"), //finds "rolled 10, 20 = 30"
        quotedTexts: new RegExp("[\"“”][^\"“”]*[\"“”]","gu"), //finds text inside quotes
        endsWithPunctuation: new RegExp("[.,!?][ ]*[\"“”]$"), //finds if a quote ends with a punctuation
        bracketedTexts: new RegExp("(\\([^)]*\\))|(\\[[^\\]]*\\])|(\\{[^}]*\\})|(<[^>]*>)", "gu"), //finds text within various kinds of brackets... looks funny
        canonID: new RegExp("^[0-9a-f]{6}$")
      };
    }
    return this.regex;
  }

  getFixes(threadID) {
    var fixes = UpdateAnalyzer.getAllFixes()[threadID] || {};
    //convert array values to lower case and then into object properties for faster access
    for (let prop of [ "missedAuthors", "missedTextUpdates", "wrongTextUpdates", "wrongImageUpdates", "ignoreTextPosts" ]) {
      if (!fixes[prop]) {
        fixes[prop] = { };
      }
      else if (Array.isArray(fixes[prop])) { //can't use Array.reduce() because tgchan's js library protoaculous destroyed it
        fixes[prop] = fixes[prop].reduceRight((acc, el) => { if (!el.startsWith("!")) el = el.toLowerCase(); acc[el] = true; return acc; }, { });
      }
    }
    return fixes;
  }

  // Manual fixes. In some cases it's simply impossible (impractical) to automatically determine which posts are updates. So we fix those rare cases manually.
  // list last updated on:
  // 2019/09/08

  //missedAuthors: User IDs which should be linked to the author. Either because the automation failed, or the quest has guest authors / is a collaboration. Guest authors also usually need an entry under ignoreTextPosts.
  //ignoreTextPosts: User IDs of which text posts should not be set as author comments. It happens when a suggester shares an ID with the author and this suggester makes a text post. Or if the guest authors make suggestions.
  //(An empty ignoreTextPosts string matches posts with an empty/default poster name)
  //missedImageUpdates: Actually, no such fixes exist. All missed image update posts are added through adding author IDs to missedAuthors.
  //missedTextUpdates: Post IDs of text-only posts which are not author comments, but quest updates. It happens when authors make text updates in image quests. Or forget to attach an image to the update post.
  //wrongImageUpdates: Post IDs of image posts which are not quest updates. It happens when a suggester shares an ID with the author(s) and this suggester makes an image post. Or a guest author posts a non-update image post.
  //wrongTextUpdates: Post IDs of text-only posts which were misidentified as updates. It happens when an author comment contains a valid quote and the script accidentally thinks some dialogue is going on.
  //imageQuest: Forcefully set quest type. It happens when the automatically-determined quest type is incorrect. Either because of too many image updates in a text quest, or text updates in an image quest.
  //(Also, if most of the author's text posts in an image quest are updates, then it's sometimes simpler to set the quest as a text quest, rather than picking them out one by one.)
  static getAllFixes() {
    if (!this.allFixes) {
      this.allFixes = { //cache as a static class property
        12: { missedAuthors: [ "!g9Qfmdqho2" ] },
        26: { ignoreTextPosts: [ "Coriell", "!DHEj4YTg6g" ] },
        101: { wrongTextUpdates: [ "442" ] },
        171: { wrongTextUpdates: [ "1402" ] },
        504: { missedTextUpdates: [ "515", "597", "654", "1139", "1163", "1180", "7994", "9951" ] },
        998: { ignoreTextPosts: [ "" ] },
        1292: { missedAuthors: [ "Chaptermaster II" ], missedTextUpdates: [ "1311", "1315", "1318" ], ignoreTextPosts: [ "" ] },
        1702: { wrongImageUpdates: [ "2829" ] },
        3090: { ignoreTextPosts: [ "", "!94Ud9yTfxQ", "Glaive" ], wrongImageUpdates: [ "3511", "3574", "3588", "3591", "3603", "3612" ] },
        4602: { missedTextUpdates: [ "4630", "6375" ] },
        7173: { missedTextUpdates: [ "8515", "10326" ] },
        8906: { missedTextUpdates: [ "9002", "9009" ] },
        9190: { missedAuthors: [ "!OeZ2B20kbk" ], missedTextUpdates: [ "26073" ] },
        13595: { wrongTextUpdates: [ "18058" ] },
        16114: { missedTextUpdates: [ "20647" ] },
        17833: { ignoreTextPosts: [ "!swQABHZA/E" ] },
        19308: { missedTextUpdates: [ "19425", "19600", "19912" ] },
        19622: { wrongImageUpdates: [ "30710", "30719", "30732", "30765" ] },
        19932: { missedTextUpdates: [ "20038", "20094", "20173", "20252" ] },
        20501: { ignoreTextPosts: [ "bd2eec" ] },
        21601: { missedTextUpdates: [ "21629", "21639" ] },
        21853: { missedTextUpdates: [ "21892", "21898", "21925", "22261", "22266", "22710", "23308", "23321", "23862", "23864", "23900", "24206", "25479", "25497", "25943", "26453", "26787", "26799",
                                     "26807", "26929", "27328", "27392", "27648", "27766", "27809", "29107", "29145" ] },
        22208: { missedAuthors: [ "fb5d8e" ] },
        24530: { wrongImageUpdates: [ "25023" ] },
        25354: { imageQuest: false},
        26933: { missedTextUpdates: [ "26935", "26955", "26962", "26967", "26987", "27015", "28998" ] },
        29636: { missedTextUpdates: [ "29696", "29914", "30025", "30911" ], wrongImageUpdates: [ "30973", "32955", "33107" ] },
        30350: { imageQuest: false, wrongTextUpdates: [ "30595", "32354", "33704" ] },
        30357: { missedTextUpdates: [ "30470", "30486", "30490", "30512", "33512" ] },
        33329: { wrongTextUpdates: [ "43894" ] },
        37304: { ignoreTextPosts: [ "", "GREEN", "!!x2ZmLjZmyu", "Adept", "Cruxador", "!ifOCf11HXk" ] },
        37954: { missedTextUpdates: [ "41649" ] },
        38276: { ignoreTextPosts: [ "!ifOCf11HXk" ] },
        41510: { missedTextUpdates: [ "41550", "41746" ] },
        44240: { missedTextUpdates: [ "44324", "45768", "45770", "48680", "48687" ] },
        45522: { missedTextUpdates: [ "55885" ] },
        45986: { missedTextUpdates: [ "45994", "46019" ] },
        49306: { missedTextUpdates: [ "54246" ] },
        49400: { ignoreTextPosts: [ "!!IzZTIxBQH1" ] },
        49937: { missedTextUpdates: [ "52386" ] },
        53129: { wrongTextUpdates: [ "53505" ] },
        53585: { missedAuthors: [ "b1e366", "aba0a3", "18212a", "6756f8", "f98e0b", "1c48f4", "f4963f", "45afb1", "b94893", "135d9a" ], ignoreTextPosts: [ "", "!7BHo7QtR6I", "Test Pattern", "Rowan", "Insomnia", "!!L1ZwWyZzZ5" ] },
        54766: { missedAuthors: [ "e16ca8" ], ignoreTextPosts: [ "!!IzZTIxBQH1" ] },
        55639: { wrongImageUpdates: [ "56711", "56345", "56379", "56637" ] },
        56194: { wrongTextUpdates: [ "61608" ] },
        59263: { missedTextUpdates: [ "64631" ] },
        62091: { imageQuest: true},
        65742: { missedTextUpdates: [ "66329", "66392", "67033", "67168" ] },
        67058: { missedTextUpdates: [ "67191", "67685" ] },
        68065: { missedAuthors: [ "7452df", "1d8589" ], ignoreTextPosts: [ "!!IzZTIxBQH1" ] },
        70887: { missedAuthors: [ "e53955", "7c9cdd", "2084ff", "064d19", "51efff", "d3c8d2" ], ignoreTextPosts: [ "!!IzZTIxBQH1" ] },
        72794: { wrongTextUpdates: [ "76740" ] },
        74474: { missedAuthors: [ "309964" ] },
        75425: { missedTextUpdates: [ "75450", "75463", "75464", "75472", "75490", "75505", "77245" ] },
        75763: { missedAuthors: [ "068b0e" ], ignoreTextPosts: [ "!!IzZTIxBQH1" ] },
        76892: { missedTextUpdates: [ "86875", "86884", "87047", "88315" ] },
        79146: { missedAuthors: [ "4a3269" ] },
        79654: { missedTextUpdates: [ "83463", "83529" ] },
        79782: { missedTextUpdates: [ "79975", "80045" ] },
        82970: { missedTextUpdates: [ "84734" ] },
        83325: { missedAuthors: [ "076064" ] },
        84134: { imageQuest: false},
        85235: { missedTextUpdates: [ "85257", "85282", "113215", "114739", "151976", "152022", "159250" ] },
        88264: { missedAuthors: [ "3fec76", "714b9c" ] },
        92605: { ignoreTextPosts: [ "" ] },
        94645: { missedTextUpdates: [ "97352" ] },
        95242: { missedTextUpdates: [ "95263" ] },
        96023: { missedTextUpdates: [ "96242" ] },
        96466: { ignoreTextPosts: [ "Reverie" ] },
        96481: { imageQuest: true},
        97014: { missedTextUpdates: [ "97061", "97404", "97915", "98124", "98283", "98344", "98371", "98974", "98976", "98978", "99040", "99674", "99684" ] },
        99095: { wrongImageUpdates: [ "111452" ] },
        99132: { ignoreTextPosts: [ "" ] },
        100346: { missedTextUpdates: [ "100626", "100690", "100743", "100747", "101143", "101199", "101235", "101239" ] },
        101388: { ignoreTextPosts: [ "Glaive" ] },
        102433: { missedTextUpdates: [ "102519", "102559", "102758" ] },
        102899: { missedTextUpdates: [ "102903" ] },
        103435: { missedTextUpdates: [ "104279", "105950" ] },
        103850: { ignoreTextPosts: [ "" ] },
        106656: { wrongTextUpdates: [ "115606" ] },
        107789: { missedTextUpdates: [ "107810", "107849", "107899" ] },
        108599: { wrongImageUpdates: [ "171382", "172922", "174091", "180752", "180758" ] },
        108805: { wrongImageUpdates: [ "110203" ] },
        109071: { missedTextUpdates: [ "109417" ] },
        112133: { missedTextUpdates: [ "134867" ] },
        112414: { missedTextUpdates: [ "112455" ] },
        113768: { missedAuthors: [ "e9a4f7" ] },
        114133: { ignoreTextPosts: [ "" ] },
        115831: { missedTextUpdates: [ "115862" ] },
        119431: { ignoreTextPosts: [ "" ] },
        120384: { missedAuthors: [ "233aab" ] },
        126204: { imageQuest: true, missedTextUpdates: [ "127069", "127089", "161046", "161060", "161563" ] },
        126248: { missedTextUpdates: [ "193064" ] },
        128706: { missedAuthors: [ "2e2f06", "21b50e", "e0478c", "9c87f6", "931351", "e294f1", "749d64", "f3254a" ] },
        131255: { missedTextUpdates: [ "151218" ] },
        137683: { missedTextUpdates: [ "137723" ] },
        139086: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        139513: { missedTextUpdates: [ "139560" ] },
        141257: { missedTextUpdates: [ "141263", "141290", "141513", "146287" ], ignoreTextPosts: [ "" ], wrongImageUpdates: [ "141265" ] },
        146112: { missedAuthors: [ "//_emily" ] },
        153225: { missedTextUpdates: [ "153615", "153875" ] },
        155665: { missedTextUpdates: [ "155670", "155684", "155740" ] },
        156257: { missedTextUpdates: [ "156956" ] },
        157277: { missedAuthors: [ "23c8f1", "8bb533" ] },
        161117: { missedTextUpdates: [ "167255", "168000" ] },
        162089: { missedTextUpdates: [ "167940" ] },
        164793: { missedAuthors: [ "e973f4" ], ignoreTextPosts: [ "!TEEDashxDA" ] },
        165537: { missedAuthors: [ "a9f6ce" ] },
        173621: { ignoreTextPosts: [ "" ] },
        174398: { missedAuthors: [ "bf0d4e", "158c5c" ] },
        176965: { missedTextUpdates: [ "177012" ] },
        177281: { missedTextUpdates: [ "178846" ] },
        181790: { ignoreTextPosts: [ "Mister Brush" ], wrongImageUpdates: [ "182280" ] },
        183194: { ignoreTextPosts: [ "!CRITTerXzI" ], wrongImageUpdates: [ "183207" ] },
        183637: { imageQuest: false, wrongTextUpdates: [ "183736" ] },
        185345: { wrongTextUpdates: [ "185347" ] },
        185579: { missedTextUpdates: [ "188091", "188697", "188731", "188748", "190868" ] },
        186709: { missedTextUpdates: [ "186735" ] },
        188253: { missedTextUpdates: [ "215980", "215984", "222136" ] },
        188571: { missedTextUpdates: [ "188633" ] },
        188970: { ignoreTextPosts: [ "" ] },
        191328: { missedAuthors: [ "f54a9c", "862cf6", "af7d90", "4c1052", "e75bed", "09e145" ] },
        191976: { missedAuthors: [ "20fc85" ] },
        192879: { missedTextUpdates: [ "193009" ] },
        193934: { missedTextUpdates: [ "212768" ] },
        196310: { missedTextUpdates: [ "196401" ] },
        196517: { missedTextUpdates: [ "196733" ] },
        198458: { missedTextUpdates: [ "198505", "198601", "199570" ] },
        200054: { missedAuthors: [ "a4b4e3" ] },
        201427: { missedTextUpdates: [ "201467", "201844" ] },
        203072: { missedTextUpdates: [ "203082", "203100", "206309", "207033", "208766" ] },
        206945: { missedTextUpdates: [ "206950" ] },
        207011: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        207296: { missedTextUpdates: [ "214551" ] },
        207756: { missedTextUpdates: [ "208926" ] },
        209334: { missedTextUpdates: [ "209941" ] },
        210613: { missedTextUpdates: [ "215711", "220853" ] },
        210928: { missedTextUpdates: [ "215900" ] },
        211320: { ignoreTextPosts: [ "Kindling", "Bahu" ], wrongImageUpdates: [ "211587", "215436" ] },
        212584: { missedAuthors: [ "40a8d3" ] },
        212915: { missedTextUpdates: [ "229550" ] },
        217193: { missedAuthors: [ "7f1ecd", "c00244", "7c97d9", "8c0848", "491db1", "c2c011", "e15f89",
                                  "e31d52", "3ce5b4", "c1f2ce", "5f0943", "1dc978", "d65652", "446ab5", "f906a7", "dad664", "231806" ] },
        217269: { imageQuest: false, wrongTextUpdates: [ "217860", "219314" ] },
        218385: { missedAuthors: [ "812dcf" ] },
        220049: { ignoreTextPosts: [ "Slinkoboy" ], wrongImageUpdates: [ "228035", "337790" ] },
        222777: { imageQuest: false},
        224095: { missedTextUpdates: [ "224196", "224300", "224620", "244476" ] },
        233213: { missedTextUpdates: [ "233498" ], ignoreTextPosts: [ "Bahu" ] },
        234437: { missedTextUpdates: [ "234657" ] },
        237125: { missedTextUpdates: [ "237192" ] },
        237665: { imageQuest: true, ignoreTextPosts: [ "" ] },
        238281: { ignoreTextPosts: [ "TK" ] },
        238993: { missedTextUpdates: [ "239018", "239028", "239094" ] },
        240824: { imageQuest: false},
        241467: { missedTextUpdates: [ "241709" ] },
        242200: { missedTextUpdates: [ "246465", "246473", "246513" ] },
        242657: { missedAuthors: [ "2563d4" ] },
        244225: { missedTextUpdates: [ "245099", "245195", "245201" ] },
        244557: { missedTextUpdates: [ "244561" ], ignoreTextPosts: [ "" ] },
        244830: { missedAuthors: [ "e33093" ] },
        247108: { ignoreTextPosts: [ "Bahu" ], wrongImageUpdates: [ "258883", "265446" ] },
        247714: { missedTextUpdates: [ "247852" ] },
        248067: { ignoreTextPosts: [ "" ] },
        248856: { ignoreTextPosts: [ "" ] },
        248880: { imageQuest: true, ignoreTextPosts: [ "", "!qkgg.NzvRY", "!!EyA2IwLwVl", "!I10GFLsZCw", "!k6uRjGDgAQ", "Seven01a19" ] },
        251909: { missedTextUpdates: [ "255400" ] },
        252195: { missedTextUpdates: [ "260890" ] },
        252944: { missedAuthors: [ "Rizzie" ], ignoreTextPosts: [ "", "!!EyA2IwLwVl", "Seven01a19" ] },
        256339: { missedTextUpdates: [ "256359", "256379", "256404", "256440" ] },
        257726: { missedAuthors: [ "917cac" ] },
        258304: { missedTextUpdates: [ "269087" ] },
        261572: { imageQuest: false},
        261837: { missedAuthors: [ "14149d" ] },
        262128: { missedTextUpdates: [ "262166", "262219", "262455", "262500" ] },
        262574: { missedAuthors: [ "b7798b", "0b5a64", "687829", "446f39", "cc1ccd", "9d3d72", "72d5e4", "932db9", "4d7cb4", "9f327a", "940ab2", "a660d0" ], ignoreTextPosts: [ "" ] },
        263831: { imageQuest: false, wrongTextUpdates: [ "264063", "264716", "265111", "268733", "269012", "270598", "271254", "271852", "271855", "274776", "275128", "280425", "280812", "282417", "284354", "291231", "300074", "305150" ] },
        265656: { ignoreTextPosts: [ "Glaive17" ] },
        266542: { missedAuthors: [ "MidKnight", "c2c011", "f5e4b4", "e973f4", "6547ec" ], ignoreTextPosts: [ "", "!TEEDashxDA", "Not Cirr", "Ñ" ] },
        267348: { ignoreTextPosts: [ "" ] },
        269735: { ignoreTextPosts: [ "---" ] },
        270556: { ignoreTextPosts: [ "Bahu" ], wrongImageUpdates: [ "276022" ] },
        273047: { missedAuthors: [ "db463d", "16f0be", "77df62", "b6733e", "d171a3", "3a95e1", "21d450" ] },
        274088: { missedAuthors: [ "4b0cf3" ], missedTextUpdates: [ "294418" ], ignoreTextPosts: [ "" ] },
        274466: { missedAuthors: [ "c9efe3" ] },
        276562: { missedTextUpdates: [ "277108" ] },
        277371: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        278168: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        280381: { ignoreTextPosts: [ "!7BHo7QtR6I" ] },
        280985: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        283246: { imageQuest: false},
        285210: { ignoreTextPosts: [ "", "Weaver" ] },
        287296: { ignoreTextPosts: [ "", "Asplosionz" ] },
        287815: { missedAuthors: [ "Ñ" ] },
        288346: { missedAuthors: [ "383006", "bf1e7e" ], ignoreTextPosts: [ "383006", "bf1e7e" ] },
        289254: { imageQuest: false},
        292033: { wrongTextUpdates: [ "295088" ] },
        293532: { ignoreTextPosts: [ "" ] },
        294351: { ignoreTextPosts: [ "Weaver" ] },
        295374: { ignoreTextPosts: [ "TK" ] },
        295832: { missedAuthors: [ "ac22cd", "7afbc4", "6f11ff" ], missedTextUpdates: [ "313940" ] },
        295949: { missedTextUpdates: [ "296256", "297926", "298549" ] },
        298133: { missedTextUpdates: [ "298187" ] },
        298860: { imageQuest: true, missedTextUpdates: [ "298871", "298877", "298880", "298908" ] },
        299352: { imageQuest: true, missedTextUpdates: [ "299375", "299627", "303689" ] },
        300694: { ignoreTextPosts: [ "TK" ] },
        300751: { missedTextUpdates: [ "316287" ] },
        303859: { ignoreTextPosts: [ "" ] },
        308257: { missedTextUpdates: [ "314653" ] },
        309753: { missedTextUpdates: [ "309864", "309963", "310292", "310944", "310987", "311202", "311219", "311548" ] },
        310586: { missedTextUpdates: [ "310945", "312747", "313144" ] },
        311021: { missedAuthors: [ "049dfa", "f2a6f9" ] },
        312418: { missedTextUpdates: [ "312786", "312790", "312792", "312984", "313185" ] },
        314825: { ignoreTextPosts: [ "TK" ] },
        314940: { missedTextUpdates: [ "314986", "315198", "329923" ] },
        318478: { ignoreTextPosts: [ "Toxoglossa" ] },
        319491: { ignoreTextPosts: [ "Bahu" ] },
        323481: { missedTextUpdates: [ "323843", "324125", "324574" ] },
        323589: { missedTextUpdates: [ "329499" ] },
        327468: { missedTextUpdates: [ "327480", "337008" ] },
        337661: { ignoreTextPosts: [ "", "hisgooddog" ] },
        338579: { ignoreTextPosts: [ "", "Zealo8", "Ñ" ] },
        343078: { wrongImageUpdates: [ "343219" ] },
        343668: { missedTextUpdates: [ "343671" ] },
        348635: { ignoreTextPosts: [ "" ] },
        351064: { missedTextUpdates: [ "351634", "353263", "355326", "356289" ] },
        351264: { missedTextUpdates: [ "353077" ] },
        354201: { imageQuest: true, missedTextUpdates: [ "354340" ] },
        355404: { ignoreTextPosts: [ "Bahu" ] },
        356715: { missedTextUpdates: [ "356722" ] },
        357723: { missedAuthors: [ "7bad01" ], ignoreTextPosts: [ "", "SoqWizard" ] },
        359879: { imageQuest: false},
        359931: { missedAuthors: [ "Dasaki", "Rynh", "Kinasa", "178c80" ], ignoreTextPosts: [ "", "Gnoll", "Lost Planet", "Dasaki", "Slinkoboy" ] },
        360617: { missedAuthors: [ "7a7217" ] },
        363529: { imageQuest: true, ignoreTextPosts: [ "Tenyoken" ] },
        365082: { missedTextUpdates: [ "381411", "382388" ] },
        366944: { missedTextUpdates: [ "367897" ] },
        367145: { wrongTextUpdates: [ "367887" ] },
        367824: { missedTextUpdates: [ "367841", "367858", "367948" ] },
        375293: { ignoreTextPosts: [ "Bahu" ] },
        382864: { ignoreTextPosts: [ "FlynnMerk" ] },
        387602: { ignoreTextPosts: [ "!a1..dIzWW2" ], wrongImageUpdates: [ "390207", "392018", "394748" ] },
        388264: { ignoreTextPosts: [ "" ] },
        392034: { missedAuthors: [ "046f13" ] },
        392868: { missedAuthors: [ "e1359e" ] },
        393082: { ignoreTextPosts: [ "" ] },
        395700: { missedTextUpdates: [ "395701", "395758" ] },
        395817: { ignoreTextPosts: [ "" ] },
        397819: { ignoreTextPosts: [ "Bahu", "K-Dogg" ], wrongImageUpdates: [ "398064" ] },
        400842: { missedAuthors: [ "b0d466" ], ignoreTextPosts: [ "", "!a1..dIzWW2" ], wrongImageUpdates: [ "412172", "412197" ] },
        403418: { missedAuthors: [ "02cbc6" ] },
        404177: { missedTextUpdates: [ "404633" ] },
        409356: { missedTextUpdates: [ "480664", "485493" ], wrongTextUpdates: [ "492824" ] },
        410618: { ignoreTextPosts: [ "kathryn" ], wrongImageUpdates: [ "417836" ] },
        412463: { ignoreTextPosts: [ "" ] },
        413494: { ignoreTextPosts: [ "Bahu" ] },
        420600: { imageQuest: false},
        421477: { imageQuest: false},
        422052: { missedAuthors: [ "!a1..dIzWW2" ] },
        422087: { ignoreTextPosts: [ "Caz" ] },
        422856: { ignoreTextPosts: [ "", "???" ] },
        424198: { missedAuthors: [ "067a04" ], ignoreTextPosts: [ "!a1..dIzWW2" ] },
        425677: { missedTextUpdates: [ "425893", "426741", "431953" ] },
        426019: { ignoreTextPosts: [ "Taskuhecate" ] },
        427135: { ignoreTextPosts: [ "!7BHo7QtR6I" ] },
        427676: { ignoreTextPosts: [ "FRACTAL" ] },
        428027: { ignoreTextPosts: [ "notrottel", "Bahu", "!a1..dIzWW2", "Trout", "Larro", "", "cuoqet" ], wrongImageUpdates: [ "428285", "498295" ] },
        430036: { missedTextUpdates: [ "430062", "430182", "430416" ], ignoreTextPosts: [ "" ] },
        431445: { imageQuest: false, missedAuthors: [ "efbb86" ] },
        435947: { missedTextUpdates: [ "436059" ] },
        437675: { wrongTextUpdates: [ "445770", "449255", "480401" ] },
        437768: { missedTextUpdates: [ "446536" ] },
        438515: { ignoreTextPosts: [ "TK" ] },
        438670: { ignoreTextPosts: [ "" ] },
        441226: { missedAuthors: [ "6a1ec2", "99090a", "7f2d33" ], wrongImageUpdates: [ "441260" ] },
        441745: { missedTextUpdates: [ "443831" ] },
        447830: { imageQuest: false, missedAuthors: [ "fc985a", "f8b208" ], wrongTextUpdates: [ "448476", "450379", "452161" ] },
        448900: { missedAuthors: [ "0c2256" ] },
        449505: { wrongTextUpdates: [ "450499" ] },
        450563: { missedAuthors: [ "!!AwZwHkBGWx", "Oregano" ], ignoreTextPosts: [ "", "chirps", "!!AwZwHkBGWx", "!!AwZwHkBGWx", "Ham" ] },
        452871: { missedAuthors: [ "General Q. Waterbuffalo", "!cZFAmericA" ], missedTextUpdates: [ "456083" ] },
        453480: { ignoreTextPosts: [ "TK" ], wrongImageUpdates: [ "474233" ] },
        453978: { missedTextUpdates: [ "453986" ] },
        454256: { missedTextUpdates: [ "474914", "474957" ] },
        456185: { ignoreTextPosts: [ "TK" ], wrongTextUpdates: [ "472446" ], wrongImageUpdates: [ "592622" ] },
        456798: { missedTextUpdates: [ "516303" ] },
        458432: { missedAuthors: [ "259cce", "34cbef" ] },
        463595: { missedTextUpdates: [ "463711", "465024", "465212", "465633", "467107", "467286" ], wrongTextUpdates: [ "463623" ] },
        464038: { missedAuthors: [ "df885d", "8474cd" ] },
        465919: { missedTextUpdates: [ "465921" ] },
        469321: { missedTextUpdates: [ "469332" ] },
        471304: { missedAuthors: [ "1766db" ] },
        471394: { missedAuthors: [ "Cirr" ] },
        476554: { ignoreTextPosts: [ "Fish is yum" ] },
        478624: { missedAuthors: [ "88c9b2" ] },
        479712: { ignoreTextPosts: [ "" ] },
        481277: { missedTextUpdates: [ "481301", "482210" ], ignoreTextPosts: [ "Santova" ] },
        481491: { missedTextUpdates: [ "481543", "481575", "484069" ], ignoreTextPosts: [ "Zach Leigh", "Santova", "Outaki Shiba" ] },
        482391: { missedTextUpdates: [ "482501", "482838" ] },
        482629: { missedTextUpdates: [ "484220", "484437" ], ignoreTextPosts: [ "Santova", "Tera Nospis" ] },
        483108: { missedAuthors: [ "2de44c" ], missedTextUpdates: [ "483418", "483658" ], ignoreTextPosts: [ "Santova" ] },
        484423: { missedTextUpdates: [ "484470", "486761", "488602" ], ignoreTextPosts: [ "Tera Nospis", "Zach Leigh" ] },
        484606: { missedTextUpdates: [ "486773" ], ignoreTextPosts: [ "Zach Leigh" ] },
        485964: { missedTextUpdates: [ "489145", "489760" ], ignoreTextPosts: [ "Tera Nospis", "Santova" ] },
        489488: { missedTextUpdates: [ "490389" ] },
        489694: { missedAuthors: [ "2c8bbe", "30a140", "8c4b01", "8fbeb2", "2b7d97", "17675d", "782175", "665fcd", "e91794", "52019c", "8ef0aa", "e493a6", "c847bc" ] },
        489830: { missedAuthors: [ "9ee824", "8817a0", "d81bd3", "704658" ] },
        490689: { ignoreTextPosts: [ "Santova" ] },
        491171: { ignoreTextPosts: [ "Santova", "Zach Leigh", "Zack Leigh", "The Creator" ] },
        491314: { missedTextUpdates: [ "491498" ], ignoreTextPosts: [ "" ] },
        492511: { missedAuthors: [ "???" ] },
        493099: { ignoreTextPosts: [ "Zach Leigh", "Santova" ] },
        494015: { ignoreTextPosts: [ "Coda", "drgruff" ] },
        496561: { ignoreTextPosts: [ "Santova", "DJ LaLonde", "Tera Nospis" ] },
        498874: { ignoreTextPosts: [ "Santova" ] },
        499607: { ignoreTextPosts: [ "Santova", "Tera Nospis" ] },
        499980: { ignoreTextPosts: [ "Santova", "Tera Nospis", "DJ LaLonde" ] },
        500015: { missedTextUpdates: [ "500020", "500029", "500274", "501462", "501464", "501809", "505421" ], ignoreTextPosts: [ "suggestion", "Chelz" ] },
        502751: { ignoreTextPosts: [ "suggestion" ] },
        503053: { missedAuthors: [ "!!WzMJSzZzWx", "Shopkeep", "CAI" ] },
        505072: { missedTextUpdates: [ "565461" ] },
        505569: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        505633: { missedTextUpdates: [ "505694", "529582" ] },
        505796: { ignoreTextPosts: [ "Mister-Saturn" ] },
        506555: { ignoreTextPosts: [ "Tera Nospis", "Santova" ] },
        507761: { ignoreTextPosts: [ "", "Rue" ] },
        508294: { missedAuthors: [ "Lisila" ], missedTextUpdates: [ "508618", "508406" ] },
        509510: { missedTextUpdates: [ "509810", "510805", "510812", "510943", "511042", "512430", "514731", "515963" ] },
        510067: { missedTextUpdates: [ "510081" ] },
        511816: { imageQuest: true, missedAuthors: [ "34cf7d" ], missedTextUpdates: [ "512608" ] },
        512417: { ignoreTextPosts: [ "Uplifted" ] },
        512501: { ignoreTextPosts: [ "" ] },
        512569: { wrongImageUpdates: [ "512810" ] },
        513727: { missedTextUpdates: [ "519251" ], ignoreTextPosts: [ "!mYSM8eo.ng" ] },
        514174: { missedTextUpdates: [ "747164" ] },
        515255: { ignoreTextPosts: [ "" ] },
        516595: { imageQuest: true},
        517144: { ignoreTextPosts: [ "" ] },
        518737: { wrongTextUpdates: [ "521408", "522150", "522185", "522231", "535521" ] },
        518843: { ignoreTextPosts: [ "" ] },
        519463: { imageQuest: false},
        521196: { missedTextUpdates: [ "524608" ] },
        526472: { missedTextUpdates: [ "526524", "559848" ] },
        527296: { ignoreTextPosts: [ "Zealo8" ] },
        527546: { ignoreTextPosts: [ "suggestion" ] },
        527753: { missedAuthors: [ "7672c3", "9d78a6", "cb43c1" ] },
        528891: { ignoreTextPosts: [ "drgruff" ] },
        530940: { missedAuthors: [ "2027bb", "feafa5", "0a3b00" ] },
        533990: { missedTextUpdates: [ "537577" ] },
        534197: { ignoreTextPosts: [ "Stella" ] },
        535302: { ignoreTextPosts: [ "mermaid" ] },
        535783: { ignoreTextPosts: [ "drgruff" ] },
        536268: { missedTextUpdates: [ "536296", "538173" ], ignoreTextPosts: [ "Archivemod" ], wrongImageUpdates: [ "537996" ] },
        537343: { missedTextUpdates: [ "539218" ] },
        537647: { missedTextUpdates: [ "537683" ] },
        537867: { missedAuthors: [ "369097" ] },
        539831: { ignoreTextPosts: [ "" ] },
        540147: { ignoreTextPosts: [ "drgruff" ] },
        541026: { imageQuest: false},
        543428: { missedTextUpdates: [ "545458" ] },
        545071: { missedTextUpdates: [ "545081" ] },
        545791: { ignoreTextPosts: [ "" ] },
        545842: { missedTextUpdates: [ "550972" ] },
        548052: { missedTextUpdates: [ "548172" ], ignoreTextPosts: [ "Lucid" ] },
        548899: { missedTextUpdates: [ "548968", "549003" ] },
        549394: { missedTextUpdates: [ "549403" ] },
        553434: { missedTextUpdates: [ "553610", "553635", "553668", "554166" ] },
        553711: { missedTextUpdates: [ "553722", "553728", "554190" ] },
        553760: { missedTextUpdates: [ "554994", "555829", "556570", "556792", "556803", "556804" ] },
        554694: { missedTextUpdates: [ "557011", "560544" ] },
        556435: { missedAuthors: [ "Azathoth" ], missedTextUpdates: [ "607163" ], wrongTextUpdates: [ "561150" ] },
        557051: { missedTextUpdates: [ "557246", "557260", "557599", "559586" ], wrongTextUpdates: [ "557517" ] },
        557633: { imageQuest: true},
        557854: { missedTextUpdates: [ "557910", "557915", "557972", "558082", "558447", "558501", "561834", "561836", "562289", "632102", "632481", "632509", "632471" ] },
        562193: { ignoreTextPosts: [ "" ] },
        563459: { missedTextUpdates: [ "563582" ] },
        564852: { ignoreTextPosts: [ "Trout" ] },
        564860: { missedTextUpdates: [ "565391" ] },
        565909: { ignoreTextPosts: [ "" ] },
        567119: { missedTextUpdates: [ "573494", "586375" ] },
        567138: { missedAuthors: [ "4cf1b6" ] },
        568248: { missedTextUpdates: [ "569818" ] },
        568370: { ignoreTextPosts: [ "" ] },
        568463: { missedTextUpdates: [ "568470", "568473" ] },
        569225: { missedTextUpdates: [ "569289" ] },
        573815: { wrongTextUpdates: [ "575792" ] },
        578213: { missedTextUpdates: [ "578575" ] },
        581741: { missedTextUpdates: [ "581746" ] },
        582268: { missedTextUpdates: [ "587221" ] },
        585201: { ignoreTextPosts: [ "", "Bahustard", "Siphon" ] },
        586024: { ignoreTextPosts: [ "" ] },
        587086: { missedTextUpdates: [ "587245", "587284", "587443", "587454" ] },
        587562: { ignoreTextPosts: [ "Zealo8" ] },
        588902: { missedTextUpdates: [ "589033" ] },
        589725: { imageQuest: false},
        590502: { ignoreTextPosts: [ "" ], wrongTextUpdates: [ "590506" ] },
        590761: { missedTextUpdates: [ "590799" ], ignoreTextPosts: [ "" ] },
        591527: { missedTextUpdates: [ "591547", "591845" ] },
        592273: { imageQuest: false},
        592625: { wrongTextUpdates: [ "730228" ] },
        593047: { missedTextUpdates: [ "593065", "593067", "593068" ] },
        593899: { ignoreTextPosts: [ "mermaid" ] },
        595081: { ignoreTextPosts: [ "", "VoidWitchery" ] },
        595265: { imageQuest: false, wrongTextUpdates: [ "596676", "596717", "621360", "621452", "621466", "621469", "621503" ] },
        596262: { missedTextUpdates: [ "596291", "596611", "597910", "598043", "598145", "600718", "603311" ] },
        596345: { ignoreTextPosts: [ "mermaid" ] },
        596539: { missedTextUpdates: [ "596960", "596972", "596998", "597414", "614375", "614379", "614407", "616640", "668835", "668844", "668906", "668907", "668937", "668941", "669049", "669050",
                                      "669126", "671651" ], ignoreTextPosts: [ "pugbutt" ] },
        598767: { ignoreTextPosts: [ "FRACTAL" ] },
        602894: { ignoreTextPosts: [ "" ] },
        604604: { missedTextUpdates: [ "605127", "606702" ] },
        609653: { missedTextUpdates: [ "610108", "610137" ] },
        611369: { wrongImageUpdates: [ "620890" ] },
        611997: { missedTextUpdates: [ "612102", "612109" ], wrongTextUpdates: [ "617447" ] },
        613977: { missedTextUpdates: [ "614036" ] },
        615246: { missedTextUpdates: [ "638243", "638245", "638246", "638248" ] },
        615752: { ignoreTextPosts: [ "Uplifted" ] },
        617061: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        617484: { missedTextUpdates: [ "617509", "617830" ] },
        618712: { missedTextUpdates: [ "619097", "619821", "620260" ] },
        620830: { missedAuthors: [ "913f0d" ], ignoreTextPosts: [ "", "Sky-jaws" ] },
        623611: { ignoreTextPosts: [ "!5tTWT1eydY" ] },
        623897: { wrongTextUpdates: [ "625412" ] },
        625364: { missedTextUpdates: [ "635199" ] },
        625814: { missedAuthors: [ "330ce5", "f79974", "53688c", "a19cd5", "defceb" ], missedTextUpdates: [ "625990" ], ignoreTextPosts: [ "" ] },
        627139: { ignoreTextPosts: [ "", "Seal" ] },
        628023: { missedTextUpdates: [ "628323", "629276", "629668" ] },
        628357: { ignoreTextPosts: [ "" ] },
        632345: { ignoreTextPosts: [ "!TEEDashxDA" ] },
        632823: { missedTextUpdates: [ "632860", "633225", "633632", "633649", "633723", "634118" ], ignoreTextPosts: [ "" ] },
        633187: { missedTextUpdates: [ "633407", "633444", "634031", "634192", "634462" ] },
        633487: { missedAuthors: [ "8b8b34", "fe7a48", "20ca72", "668d91" ] },
        634122: { ignoreTextPosts: [ "Apollo" ] },
        639549: { ignoreTextPosts: [ "Apollo" ] },
        641286: { missedTextUpdates: [ "641650" ] },
        642667: { missedTextUpdates: [ "643113" ] },
        642726: { missedTextUpdates: [ "648209", "651723" ] },
        643327: { ignoreTextPosts: [ "" ] },
        644179: { missedTextUpdates: [ "647317" ] },
        645426: { missedTextUpdates: [ "651214", "670665", "671751", "672911", "674718", "684082" ] },
        648109: { missedTextUpdates: [ "711809", "711811" ] },
        648646: { missedTextUpdates: [ "648681" ] },
        651220: { missedTextUpdates: [ "653791" ] },
        651382: { missedAuthors: [ "bbfc3d" ] },
        651540: { missedTextUpdates: [ "651629" ] },
        655158: { ignoreTextPosts: [ "" ] },
        662096: { ignoreTextPosts: [ "" ] },
        662196: { missedAuthors: [ "Penelope" ], ignoreTextPosts: [ "", "Brom", "Wire" ] },
        662452: { ignoreTextPosts: [ "" ] },
        662661: { ignoreTextPosts: [ "" ] },
        663088: { missedAuthors: [ "f68a09", "8177e7" ], ignoreTextPosts: [ "", "!5tTWT1eydY", "Wire", "Brom", "Apollo", "Arhra" ] },
        663996: { missedTextUpdates: [ "673890" ] },
        668009: { missedTextUpdates: [ "668227" ] },
        668216: { imageQuest: false},
        669206: { imageQuest: true, missedAuthors: [ "75347e" ] },
        672060: { missedTextUpdates: [ "673216" ] },
        673444: { ignoreTextPosts: [ "" ] },
        673575: { missedAuthors: [ "a6f913", "3bc92d" ], ignoreTextPosts: [ "!5tTWT1eydY" ] },
        673811: { missedTextUpdates: [ "682275", "687221", "687395", "688995" ], ignoreTextPosts: [ "" ] },
        677271: { missedTextUpdates: [ "677384" ] },
        678114: { imageQuest: false},
        678608: { missedTextUpdates: [ "678789" ] },
        679357: { missedTextUpdates: [ "679359", "679983" ] },
        680125: { ignoreTextPosts: [ "", "BritishHat" ] },
        680206: { missedAuthors: [ "Gnuk" ] },
        681620: { missedAuthors: [ "d9faec" ] },
        683261: { missedAuthors: [ "3/8 MPP, 4/4 MF" ] },
        686590: { imageQuest: false},
        688371: { missedTextUpdates: [ "696249", "696257" ], ignoreTextPosts: [ "", "Chaos", "Ariadne", "Melinoe", "\"F\"ingGenius" ] },
        691136: { missedTextUpdates: [ "697620" ], ignoreTextPosts: [ "" ], wrongImageUpdates: [ "706696" ] },
        691255: { ignoreTextPosts: [ "" ] },
        692093: { missedAuthors: [ "Bergeek" ], ignoreTextPosts: [ "Boxdog" ] },
        692872: { missedTextUpdates: [ "717187" ] },
        693509: { missedAuthors: [ "640f86" ] },
        693648: { missedTextUpdates: [ "694655" ] },
        694230: { ignoreTextPosts: [ "" ] },
        700573: { missedTextUpdates: [ "702352", "720330" ], ignoreTextPosts: [ "" ] },
        701456: { ignoreTextPosts: [ "" ] },
        702865: { ignoreTextPosts: [ "" ] },
        705639: { wrongTextUpdates: [ "794696" ] },
        706303: { missedAuthors: [ "5a8006" ] },
        706439: { missedTextUpdates: [ "714791" ] },
        706938: { ignoreTextPosts: [ "" ] },
        711320: { missedTextUpdates: [ "720646", "724022" ] },
        712179: { missedTextUpdates: [ "712255", "715182" ] },
        712785: { ignoreTextPosts: [ "" ] },
        713042: { missedTextUpdates: [ "713704" ] },
        714130: { imageQuest: true},
        714290: { missedTextUpdates: [ "714307", "714311" ] },
        714858: { ignoreTextPosts: [ "" ] },
        715796: { ignoreTextPosts: [ "" ] },
        717114: { missedTextUpdates: [ "717454", "717628" ] },
        718797: { missedAuthors: [ "FRACTAL on the go" ] },
        718844: { missedAuthors: [ "kome", "Vik", "Friptag" ], missedTextUpdates: [ "721242" ] },
        719505: { ignoreTextPosts: [ "" ] },
        719579: { imageQuest: false},
        722585: { wrongTextUpdates: [ "724938" ] },
        726944: { ignoreTextPosts: [ "" ] },
        727356: { ignoreTextPosts: [ "" ] },
        727581: { missedTextUpdates: [ "728169" ] },
        727677: { ignoreTextPosts: [ "Melinoe" ] },
        728411: { missedTextUpdates: [ "728928" ] },
        730993: { missedTextUpdates: [ "731061" ] },
        732214: { imageQuest: true, wrongTextUpdates: [ "732277" ] },
        734610: { ignoreTextPosts: [ "D3w" ] },
        736484: { ignoreTextPosts: [ "Roman" ], wrongImageUpdates: [ "750212", "750213", "750214" ] },
        741609: { missedTextUpdates: [ "754524" ] },
        743976: { ignoreTextPosts: [ "", "Typo" ] },
        745694: { ignoreTextPosts: [ "Crunchysaurus" ] },
        750281: { ignoreTextPosts: [ "Autozero" ] },
        752572: { missedTextUpdates: [ "752651", "752802", "767190" ] },
        754415: { missedAuthors: [ "Apollo", "riotmode", "!0iuTMXQYY." ], ignoreTextPosts: [ "", "!5tTWT1eydY", "!0iuTMXQYY.", "Indonesian Gentleman" ] },
        755378: { missedAuthors: [ "!Ykw7p6s1S." ] },
        758668: { ignoreTextPosts: [ "LD" ] },
        767346: { ignoreTextPosts: [ "" ] },
        768858: { ignoreTextPosts: [ "LD" ] },
        774368: { missedTextUpdates: [ "774500" ] },
        774930: { missedTextUpdates: [ "794040" ] },
        778045: { missedTextUpdates: [ "778427", "779363" ] },
        779564: { ignoreTextPosts: [ "" ] },
        784068: { wrongTextUpdates: [ "785618" ] },
        785044: { wrongTextUpdates: [ "801329" ] },
        789976: { missedTextUpdates: [ "790596", "793934", "800875", "832472" ] },
        794320: { wrongTextUpdates: [ "795183" ] },
        798380: { missedTextUpdates: [ "799784", "800444", "800774", "800817", "801212" ] },
        799546: { missedTextUpdates: [ "801103", "802351", "802753" ] },
        799612: { missedTextUpdates: [ "799968", "801579" ] },
        800605: { missedAuthors: [ "Boris Calija", "3373e2", "2016eb", "a80028" ], ignoreTextPosts: [ "", "Boris Calija" ] },
        802411: { missedTextUpdates: [ "805002" ] },
        807972: { wrongTextUpdates: [ "811969" ] },
        809039: { wrongImageUpdates: [ "817508", "817511" ] },
        811957: { ignoreTextPosts: [ "via Discord" ] },
        814448: { missedTextUpdates: [ "817938" ] },
        817541: { missedAuthors: [ "Raptie" ] },
        822552: { imageQuest: false},
        823831: { missedAuthors: [ "Retro-LOPIS" ] },
        827264: { ignoreTextPosts: [ "LD", "DogFace" ] },
        830006: { missedAuthors: [ "Amaranth" ] },
        835062: { ignoreTextPosts: [ "Curves" ] },
        835750: { missedTextUpdates: [ "836870" ] },
        836521: { wrongTextUpdates: [ "848748" ] },
        837514: { ignoreTextPosts: [ "LD" ] },
        839906: { missedTextUpdates: [ "845724" ] },
        840029: { missedTextUpdates: [ "840044", "840543" ] },
        841851: { ignoreTextPosts: [ "Serpens", "Joy" ] },
        842392: { missedTextUpdates: [ "842434", "842504", "842544" ] },
        844537: { missedTextUpdates: [ "847326" ] },
        848887: { imageQuest: true, wrongTextUpdates: [ "851878" ] },
        854088: { missedTextUpdates: [ "860219" ], ignoreTextPosts: [ "Ursula" ] },
        854203: { ignoreTextPosts: [ "Zenthis" ] },
        857294: { wrongTextUpdates: [ "857818" ] },
        858913: { imageQuest: false},
        863241: { missedTextUpdates: [ "863519" ] },
        865754: { missedTextUpdates: [ "875371" ], ignoreTextPosts: [ "???" ] },
        869242: { ignoreTextPosts: [ "" ] },
        871667: { missedTextUpdates: [ "884575" ] },
        876808: { imageQuest: false},
        879456: { missedTextUpdates: [ "881847" ] },
        881097: { missedTextUpdates: [ "881292", "882339" ] },
        881374: { ignoreTextPosts: [ "LD" ] },
        885481: { imageQuest: false, wrongTextUpdates: [ "886892" ] },
        890023: { missedAuthors: [ "595acb" ] },
        897318: { missedTextUpdates: [ "897321", "897624" ] },
        897846: { missedTextUpdates: [ "897854", "897866" ] },
        898917: { missedAuthors: [ "Cee (mobile)" ] },
        900852: { missedTextUpdates: [ "900864" ] },
        904316: { missedTextUpdates: [ "904356", "904491" ] },
        907309: { missedTextUpdates: [ "907310" ] },
        913803: { ignoreTextPosts: [ "Typo" ] },
        915945: { missedTextUpdates: [ "916021" ] },
        917513: { missedTextUpdates: [ "917515" ] },
        918806: { missedTextUpdates: [ "935207" ] },
        921083: { ignoreTextPosts: [ "LawyerDog" ] },
        923174: { ignoreTextPosts: [ "Marn", "MarnMobile" ] },
        924317: { ignoreTextPosts: [ "" ] },
        926927: { missedTextUpdates: [ "928194" ] },
        929545: { missedTextUpdates: [ "929634" ] },
        930854: { missedTextUpdates: [ "932282" ] },
        934026: { missedTextUpdates: [ "934078", "934817" ] },
        935464: { missedTextUpdates: [ "935544", "935550", "935552", "935880" ] },
        939572: { missedTextUpdates: [ "940402" ] },
        940835: { missedTextUpdates: [ "941005", "941067", "941137", "941226", "942383", "944236" ] },
        1000012: { missedAuthors: [ "Happiness" ] },
      };
    }
    return this.allFixes;
  }
}

class IdTracker {
  constructor() {
    this.cloneCache = { }
    this.refClass = null;
    this.threadID = null;
  }

  init(doc) {
    var results = new UpdateAnalyzer().analyzeQuest(doc); //run UpdateAnalyzer to determine which posts are updates and what not
    this.threadID = results.postTypes.keys().next().value;
    this.refClass = `ref|${doc.body.querySelector(`input[name="board"]`).value}|${this.threadID}|`; //a variable used for finding and creating post reference links
    this.initCache(doc);
    this.insertCss(doc);
    var uidElements = this.getUidElements(doc);
    var updates = this.getUpdatePostGroups(results.postTypes, results.postUsers);
    this.setPostMetadata(uidElements, updates, results.postUsers);
  }

  initCache(doc) {
    //using svg <use> elements is a bad idea; slower and uses more RAM
    var fragmentUp = doc.createRange().createContextualFragment(
      `<a class="navDisabled"><svg class="navIcon" viewBox="0 0 24 24"><path d="M3 21.5l9-9 9 9M3 12.5l9-9 9 9"/></svg></a>`);
    var fragmentDown = doc.createRange().createContextualFragment(
      `<a class="navDisabled"><svg class="navIcon" viewBox="0 0 24 24"><path d="M3 12.5l9 9 9-9M3 3.5l9 9 9-9"/></svg></a>`);
    this.cloneCache.upLink = fragmentUp.children[0];
    this.cloneCache.downLink = fragmentDown.children[0];
    this.cloneCache.multiPostElement = doc.createElement("span");
    this.cloneCache.multiPostElement.className = "multipost";
  }

  insertCss(doc) {
    doc.head.insertAdjacentHTML("beforeEnd", this.getStyleHtml());
  }

  getUpdatePostGroups(postTypes, postUsers) {
    var updatePostGroups = [];
    var currentPostGroup = { updatePostID: 0, suggestions: [], authorComments: [] };
    var postTypesArray = [...postTypes];
    //create post groups
    for (let i = postTypesArray.length - 1; i >= 0; i--) {
      if (postTypesArray[i][1] == PostType.UPDATE) {
        currentPostGroup.updatePostID = postTypesArray[i][0];
        updatePostGroups.unshift(currentPostGroup);
        currentPostGroup = { updatePostID: 0, suggestions: [], authorComments: [] };
      }
      else if (postTypesArray[i][1] == PostType.AUTHORCOMMENT) {
        currentPostGroup.authorComments.unshift(postTypesArray[i][0]);
      }
      else { //PostType.SUGGESTION
        currentPostGroup.suggestions.unshift(postTypesArray[i][0]);
      }
    }
    return updatePostGroups;
  }

  getUidElements(doc) {
    var uidElements = new Map();
    doc.body.querySelector(":scope > form").querySelectorAll(".postwidth > a[name]").forEach(anchor => {
      if (anchor.name != "s") {
        uidElements.set(parseInt(anchor.name), anchor.parentElement.querySelector(".uid"))
      }
    });
    return uidElements;
  }

  setPostMetadata(uidElements, updates, postUsers) {
    updates.forEach(update => {
      var suggesterPosts = new Map(); //dictionary <user, postIDs[]>; which suggester made which posts for the current update
      update.suggestions.forEach(postID => {
        var suggester = postUsers.get(postID);
        var posts = suggesterPosts.get(suggester) || [];
        posts.push(postID);
        suggesterPosts.set(suggester, posts);
      });
      suggesterPosts.forEach((posts, suggester) => {
        suggester.isNew = suggester.postCount === posts.length;
        if (posts.length > 1) {
          for (var postIndex = 0; postIndex < posts.length; postIndex++) {
            uidElements.get(posts[postIndex]).insertAdjacentElement("afterEnd", this.getMultiPostElement(postIndex + 1, posts.length));
          }
        }
      });
    });
    var previousUserLinks = new Map();
    uidElements.forEach((uidEl, postID) => {
      var user = postUsers.get(postID);
      uidEl.setAttribute("postcount", user.postCount);
      if (user.isNew) {
        uidEl.classList.add("crimsonCount");
      }
      var downLink = this.cloneCache.downLink.cloneNode(true);
      var upLink = this.cloneCache.upLink.cloneNode(true);
      var prevDownLink = previousUserLinks.get(user);
      if (prevDownLink) {
        this.setupLink(prevDownLink[0], postID);
        this.setupLink(upLink, prevDownLink[1]);
        upLink
      }
      if (this.multipost) {
        var multiPostEl = this.cloneCache.multiPost.cloneNode(false);
        multiPostEl.textContent = ` post ${this.multipost.count}/${this.multipost.total}`;
        uidEl.insertAdjacentElement("afterEnd", multiPostEl);
      }
      uidEl.insertAdjacentElement("afterEnd", downLink);
      uidEl.insertAdjacentElement("afterEnd", upLink);
      previousUserLinks.set(user, [downLink, postID]);
    });
    previousUserLinks.clear();
  }

  setupLink(link, postID) {
    link.href = `#${postID}`;
    link.className = "navEnabled";
  }

  getMultiPostElement(multiPostIndex, multiPostCount) {
    var span = this.cloneCache.multiPostElement.cloneNode(false);
    span.textContent = ` post ${multiPostIndex}/${multiPostCount}`;
    return span;
  }

  getStyleHtml() {
    return `
<style id="itCss">
.multipost { color: crimson; white-space: nowrap; }
.navDisabled { color: grey; pointer-events: none; }
.navEnabled { color: inherit; }
.navIcon { width: 14px; height: 17px; stroke-width: 2px; fill: none; stroke: currentColor; vertical-align: text-bottom; padding: 0 1px; }
.navIcon:hover { stroke-width: 3px; }
.uid::after { content: " (" attr(postcount) ")"; margin-right: 2px; }
.crimsonCount::after { color: crimson; }
</style>`;
  }
}

var main = () => {
  var timeStart = Date.now();
  new IdTracker().init(document);
  console.log(`ID Tracker run time = ${Date.now() - timeStart}ms`);
}

// START
if (document.head && document.head.querySelector("#itCss")) { //sanity check; don't run the script if it already ran
  return;
}
if (document.defaultView.location.href.endsWith("+50.html") || document.defaultView.location.href.endsWith("+100.html")) {
  return; //don't run the script when viewing partial thread
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", main);
}
else {
  main();
}