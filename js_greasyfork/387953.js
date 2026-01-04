// ==UserScript==
// @name        Quest Reader
// @author      naileD
// @namespace   QuestReader
// @match       https://tgchan.org/kusaba/*
// @match       https://tezakia.net/kusaba/*
// @match       https://questden.org/kusaba/*
// @match       https://talehole.com/kusaba/*
// @match       https://thatquestsite.org/kusaba/*
// @description Makes it more convenient to read and author quests
// @run-at      document-start
// @version     2022.04.14
// @grant       none
// @license     Unlicense
// @icon        data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVQokWNgoBOI2mJKpEomMvQgNAxRPUy4JGjjJJqoZoSrZmBgWOZzGlk/mlKILBMafxAAAE1pG/UEXzMMAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/387953/Quest%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/387953/Quest%20Reader.meta.js
// ==/UserScript==
"use strict";
//entry point is more or less at the end of the script

//enums
const PostType = { UPDATE: 0, AUTHORCOMMENT: 1, SUGGESTION: 2, COMMENT: 3 };
const ThreadType = { QUEST: 0, DISCUSSION: 1, OTHER: 2 };
const BoardThreadTypes = { //board names and cooresponding types of threads they contain
  quest: ThreadType.QUEST,
  questarch: ThreadType.QUEST,
  graveyard: ThreadType.QUEST,
  questdis: ThreadType.DISCUSSION,
  meep: ThreadType.OTHER,
  moo: ThreadType.OTHER,
  draw: ThreadType.OTHER,
  tg: ThreadType.OTHER,
};
const BoardDefaultNames = {
  quest: "Suggestion",
  questarch: "Suggestion",
  graveyard: "Suggestion",
  questdis: "Anonymous",
  meep: "Bob",
  moo: "Anonymous",
  draw: "Anonymous",
  tg: "Anonymous",
};

//function that removes questden's prototype library's overrides of native functions where applicable
var restoreNative = (doc) => {
  var functionsToRemove = ["Function.bind", "Element.hasAttribute", "Element.getElementsByClassName", "Element.Methods.getElementsByClassName", "HTMLElement.prototype.getElementsByClassName",
                           "Element.scrollTo", "Element.Methods.scrollTo", "HTMLElement.prototype.scrollTo", "Element.remove", "Element.Methods.remove", "HTMLElement.prototype.remove", "Array.prototype.toJSON"];
  var functionsToRestore = ["Object.keys", "Object.values", "Array.prototype.find", "Array.prototype.reverse", "Array.prototype.indexOf", "Array.prototype.entries",
                            "Array.prototype.map", "Array.prototype.reduce", "Array.from", "String.prototype.endsWith", "String.prototype.sub", "String.prototype.startsWith"]; //restoring "Function.prototype.bind" causes "problems" in Firefox
  //restoration is done by creating a new window and copying over unmodified functions from that window
  var frame = doc.createElement("iframe");
  frame.style.display = "none";
  frame.style.visibility = "hidden";
  doc.documentElement.appendChild(frame);
  var safeWindow = frame.contentWindow;
  var getObjectAndMethod = (path, root) => {
    path = path.split(".");
    path.reverse();
    var methodName = path.shift();
    var object = path.reduceRight((obj, prop) => obj[prop], root);
    return { object: object, method: methodName };
  }
  functionsToRemove.forEach(path => {
    var unsafe = getObjectAndMethod(path, doc.defaultView);
    delete unsafe.object[unsafe.method];
  });
  functionsToRestore.forEach(path => {
    var unsafe = getObjectAndMethod(path, doc.defaultView);
    var safe = getObjectAndMethod(path, safeWindow);
    unsafe.object[unsafe.method] = safe.object[safe.method];
  });
  //sigh; there's some existing functions that rely on the broken functionality of this overriden method, so I can't outright remove the override
  doc.getElementsByClassName = function(selector) { return [...Object.getPrototypeOf(this).getElementsByClassName.call(this, selector)]; };
  doc._getElementsByXPath = () => { return []; }; //this slow function is now unnecessary since we restored getElementsByClassName
  frame.remove();
}

//UpdateAnalyzer class
//Input: document of the quest
//Output: a Map object with all the quest's posts, where keys are post IDs and values are post types. The post types are Update (0), AuthorComment (1), Suggestion (2), Comment (3); There's no comments... yet.
//Usage: var results = new UpdateAnalyzer().processQuest(document);
class UpdateAnalyzer {
  constructor(options = {}) {
    this.regex = UpdateAnalyzer.getRegexes();
    this.postCache = null; //Used to transfer posts cache to/from this class. Used for debugging purposes.
    this.useCache = options.useCache; //Used for debugging purposes.
    this.debug = options.debug;
    this.debugAfterDate = options.debugAfterDate;
    this.passive = options.passive; //passive mode; treat the thread as a text-quest and ignore any fixes
    this.defaultName = options.defaultName || "Suggestion";
  }

  analyzeQuest(questDoc) {
    var posts = !this.postCache ? this.getPosts(questDoc) : JSON.parse(this.postCache);
    var authorID = posts[0].userID; //authodID is the userID of the first post
    this.threadID = posts[0].postID; //threadID is the postID of the first post

    this.totalFiles = this.getTotalFileCount(posts);
    var questFixes = this.getFixes(this.passive ? 0 : this.threadID); //for quests where we can't correctly determine authors and updates, we use a built-in database of fixes
    if (this.debug && (questFixes.imageQuest !== undefined || Object.values(questFixes).some(fix => Object.values(fix).length > 0))) { console.log(`Quest has manual fixes`); console.log(questFixes); }
    var graphData = this.getUserGraphData(posts, questFixes, authorID); //get user names as nodes and edges for building user graph
    var users = this.buildUserGraph(graphData.nodes, graphData.edges); //build a basic user graph... whatever that means!
    this.author = this.find(users[authorID]);
    this.getUserPostAndFileCounts(posts, users, questFixes); //count the amount of posts and files each user made
    this.imageQuest = !this.passive && this.isImageQuest(questFixes); //image quest is when the author posts files at least 50% of the time; also, all collaborations are image quests
    if (this.debug) console.log(`Image quest: ${this.imageQuest}`);
    if (this.imageQuest) { //in case this is an image quest, merge users a bit differently
      users = this.buildUserGraph(graphData.nodes, graphData.edges, graphData.strongNodes, authorID); //build the user graph again, but with some restrictions
      this.author = this.find(users[authorID]);
      this.processFilePosts(posts, users, questFixes); //analyze file names and merge users based on when one file name is predicted from another
      this.getUserPostAndFileCounts(posts, users, questFixes); //count the amount of posts and files each user posted
      this.mergeMajorityFilePoster(posts, users, questFixes); //consider a user who posted 50%+ of the files in the thread as the author
      this.mergeCommonFilePosters(posts, users, questFixes); //merge certain file-posting users with the quest author
    }
    var postUsers = this.setPostUsers(posts, users, questFixes); //do final user resolution
    var postTypes = this.getFinalPostTypes(posts, questFixes); //determine which posts are updates
    return { postTypes: postTypes, postUsers: postUsers };
  }

  getPosts(questDoc) {
    var posts = new Map(); //dictionary => postID / post object; need to use Map so that the post order is preserved
    var headers = questDoc.body.querySelector(":scope > form").getElementsByClassName("postwidth");
    for (var i = 0; i < headers.length; i++) {
      var postHeaderElement = headers[i];
      var postID = postHeaderElement.firstElementChild.name;
      postID = parseInt(postID !== "s" ? postID : postHeaderElement.querySelector(`a[name]:not([name="s"])`).name);
      var uidElement = postHeaderElement.querySelector(".uid");
      var uid = uidElement.textContent.substring(4);
      var labelEl = postHeaderElement.querySelector("label");
      var subject = labelEl.querySelector(".filetitle");
      subject = subject ? subject.textContent.trim() : "";
      var trip = labelEl.querySelector(".postertrip");
      var name;
      if (trip) { //use tripcode instead of name if it exists
        name = trip.textContent;
      }
      else {
        name = labelEl.querySelector(".postername").textContent.trim();
        name = name == this.defaultName ? "" : name.toLowerCase();
      }
      var fileName = "";
      var fileElement = postHeaderElement.querySelector(".filesize");
      if (fileElement) { //try to get the original file name
        fileName = fileElement.querySelector("a").href;
        var match = fileName.match(this.regex.fileExtension);
        var fileExt = match ? match[0] : ""; //don't need .toLowerCase()
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
      var contentElement = postHeaderElement.nextElementSibling;
      var activeContent = !!contentElement.querySelector("img, iframe"); //does a post contain icons
      var postData = { postID: postID, userID: uid, userName: name, fileName: fileName, activeContent: activeContent };
      if (this.useCache) {
        postData.textUpdate = this.regex.fraction.test(subject) || this.containsQuotes(contentElement);
      }
      else {
        postData.subject = subject;
        postData.contentElement = contentElement;
      }
      if (this.useCache || this.debug || this.debugAfterDate) {
        postData.date = Date.parse(labelEl.lastChild.nodeValue);
      }
      posts.set(postID, postData);
    }
    var postsArray = [...posts.values(posts)]; //convert to an array
    if (this.useCache) { //We stringify the object into JSON and then encode it into a Uint8Array to save space, otherwise the database would be too large
      this.postCache = JSON.stringify(postsArray); //Removing Array.prototype.toJSON allows us to safely use JSON.stringify again \o/
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
      return questFixes.collaboration || (this.author.fileCount / this.author.postCount) >= 0.5;
    }
  }

  getUserGraphData(posts, questFixes, authorID) {
    var graphData = { nodes: new Set(), strongNodes: new Set(), edges: {} };
    posts.forEach(post => {
      graphData.nodes.add(post.userID);
      if (post.userName) {
        graphData.nodes.add(post.userName);
        graphData.edges[`${post.userID}${post.userName}`] = { E1: post.userName, E2: post.userID };
      }
      if (post.fileName || post.activeContent) { //strong nodes are user IDs that posted files
        graphData.strongNodes.add(post.userID);
        if (post.userName) {
          graphData.strongNodes.add(post.userName);
        }
        if (post.fileName && post.activeContent && post.userID != authorID && !questFixes.collaboration) { //users that made posts with both file and icons are most likely the author
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
    if (questFixes.collaboration) {
      return;
    }
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
            console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html#${post.postID} merged (file name) ${postUser.id} with ${user.id} (author: ${this.author.id})`);
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
    if (this.author.fileCount > this.totalFiles / 2 || questFixes.collaboration) {
      return;
    }
    for (var userID in users) {
      if (users[userID].fileCount >= this.totalFiles / 2 && users[userID] != this.author) {
        if (this.debug || (this.debugAfterDate && this.debugAfterDate < posts[posts.length - 1].date)) {
          console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html merged majority file poster ${users[userID].id} ${(100 * users[userID].fileCount / this.totalFiles).toFixed(1)}%`);
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
    if (questFixes.collaboration) {
      return;
    }
    var merged = [];
    var filteredUsers = Object.values(users).filter(user => user.parent == user && user.fileCount >= 3 && user.fileCount / user.postCount > 0.5 && user != this.author);
    if (filteredUsers.length === 0) {
      return;
    }
    var usersSet = new Set(filteredUsers);
    posts.forEach(post => {
      if ((post.fileName || post.activeContent) && !questFixes.wrongImageUpdates[post.postID] && this.isTextPostAnUpdate(post)) {
        for (var user of usersSet) {
          if (this.find(users[post.userID]) == user) {
            if (this.debug || (this.debugAfterDate && this.debugAfterDate < post.date)) {
              console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html new common poster ${user.id}`);
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
    //if a post has both a username and an ID, it's sometimes possible that the name belongs to one user, while the ID belongs to a different user...
    //in this case, the post's owner needs to be decided -> it should be the author, unless the username is ignored as per manual fixes
    if (post.userName) {
      if (questFixes.ignoreTextPosts[post.userName]) {
        if (user == this.author) {
          user = this.find(users[post.userName]);
        }
      }
      else if (this.find(users[post.userName]) == this.author) {
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
      }
      else if (questFixes.collaboration && (post.fileName || post.activeContent) && !questFixes.wrongImageUpdates[post.postID]) { //in collaborations, all image posts are updates
        postType = PostType.UPDATE;
      }
      if (questFixes.missedTextUpdates[post.postID]) {
        postType = PostType.UPDATE;
      }
      if (this.debugAfterDate && this.debugAfterDate < post.date) {
        if (postType == PostType.SUGGESTION && post.fileName) console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new non-update`);
        if (postType == PostType.AUTHORCOMMENT) console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new author comment`);
        if (postType == PostType.UPDATE && this.imageQuest && !post.fileName && !post.activeContent) console.log(`https://questden.org/kusaba/quest/res/${this.threadID}.html#${post.postID} new text update`);
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
      else if (Array.isArray(fixes[prop])) {
        fixes[prop] = fixes[prop].reduce((acc, el) => { if (!el.startsWith("!")) el = el.toLowerCase(); acc[el] = true; return acc; }, { });
      }
    }
    return fixes;
  }

  // Manual fixes. In some cases it's simply impossible (impractical) to automatically determine which posts are updates. So we fix those rare cases manually.
  // list last updated on:
  // 2022/04/14

  //missedAuthors: User IDs which should be linked to the author. Either because the automation failed, or the quest has guest authors / is a collaboration. Guest authors also usually need an entry under ignoreTextPosts.
  //ignoreTextPosts: User IDs of which text posts should not be set as author comments. It happens when a suggester shares an ID with the author and this suggester makes a text post. Or if the guest authors make suggestions.
  //(An empty ignoreTextPosts string matches posts with an empty/default poster name)
  //missedImageUpdates: Actually, no such fixes exist. All missed image update posts are added through adding author IDs to missedAuthors.
  //missedTextUpdates: Post IDs of text-only posts which are not author comments, but quest updates. It happens when authors make text updates in image quests. Or forget to attach an image to the update post.
  //wrongImageUpdates: Post IDs of image posts which are not quest updates. It happens when a suggester shares an ID with the author(s) and this suggester makes an image post. Or a guest author posts a non-update image post.
  //wrongTextUpdates: Post IDs of text-only posts which were misidentified as updates. It happens when an author comment contains a valid quote and the script accidentally thinks some dialogue is going on.
  //imageQuest: Forcefully set quest type. It happens when the automatically-determined quest type is incorrect. Either because of too many image updates in a text quest, or text updates in an image quest.
  //(Also, if most of the author's text posts in an image quest are updates, then it's sometimes simpler to set the quest as a text quest, rather than picking them out one by one.)
  //collaboration: Consider all image posts in this quest as updates. Useful if a quest has multiple authors. TODO: Check if it's possible to automatically detect if a quest is a collaboration
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
        37304: { collaboration: true, ignoreTextPosts: [ "", "Adept", "GREEN" ] },
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
        53585: { collaboration: true },
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
        146112: { imageQuest: true, missedAuthors: [ "//_emily" ], ignoreTextPosts: [ "f609ed" ] },
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
        217193: { collaboration: true },
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
        262574: { collaboration: true },
        263831: { imageQuest: false, wrongTextUpdates: [ "264063", "264716", "265111", "268733", "269012", "270598", "271254", "271852", "271855", "274776", "275128", "280425", "280812", "282417", "284354", "291231", "300074", "305150" ] },
        265656: { ignoreTextPosts: [ "Glaive17" ] },
        266542: { collaboration: true, wrongImageUpdates: [ "266587" ], ignoreTextPosts: [ "fa43b7", "Not Cirr" ] },
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
        288346: { collaboration: true, imageQuest: false },
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
        357723: { collaboration: true, wrongImageUpdates: [ "358563" ] },
        359879: { imageQuest: false},
        359931: { collaboration: true, wrongImageUpdates: [ "360933", "361338", "361425", "362100" ] },
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
        422052: { collaboration: true },
        422087: { ignoreTextPosts: [ "Caz" ] },
        422856: { ignoreTextPosts: [ "", "???" ] },
        424198: { collaboration: true },
        425677: { missedTextUpdates: [ "425893", "426741", "431953" ] },
        426019: { ignoreTextPosts: [ "Taskuhecate" ] },
        427135: { ignoreTextPosts: [ "!7BHo7QtR6I" ] },
        427676: { ignoreTextPosts: [ "FRACTAL" ] },
        428027: { collaboration: true, ignoreTextPosts: [ "Trout" ] },
        430036: { missedTextUpdates: [ "430062", "430182", "430416" ], ignoreTextPosts: [ "" ] },
        431445: { imageQuest: false, missedAuthors: [ "efbb86" ] },
        435947: { missedTextUpdates: [ "436059" ] },
        437675: { wrongTextUpdates: [ "445770", "449255", "480401" ] },
        437768: { missedTextUpdates: [ "446536" ] },
        438515: { ignoreTextPosts: [ "TK" ] },
        438670: { ignoreTextPosts: [ "" ] },
        441226: { collaboration: true, wrongImageUpdates: [ "441260" ] },
        441745: { missedTextUpdates: [ "443831" ] },
        447830: { imageQuest: false, missedAuthors: [ "fc985a", "f8b208" ], wrongTextUpdates: [ "448476", "450379", "452161" ] },
        448900: { missedAuthors: [ "0c2256" ] },
        449505: { wrongTextUpdates: [ "450499" ] },
        450563: { collaboration: true },
        452871: { missedAuthors: [ "General Q. Waterbuffalo", "!cZFAmericA" ], missedTextUpdates: [ "456083" ] },
        453480: { ignoreTextPosts: [ "TK" ], wrongImageUpdates: [ "474233" ] },
        453978: { missedTextUpdates: [ "453986" ] },
        454256: { missedTextUpdates: [ "474914", "474957" ] },
        456185: { ignoreTextPosts: [ "TK" ], wrongTextUpdates: [ "472446" ], wrongImageUpdates: [ "592622" ] },
        456798: { missedTextUpdates: [ "516303" ] },
        458432: { collaboration: true },
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
        508294: { missedAuthors: [ "Lisila" ], missedTextUpdates: [ "508618", "508406" ], wrongImageUpdates: [ "508331" ] },
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
        527753: { collaboration: true },
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
        564852: { collaboration: true },
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
        620830: { collaboration: true },
        623611: { ignoreTextPosts: [ "!5tTWT1eydY" ] },
        623897: { wrongTextUpdates: [ "625412" ] },
        625364: { missedTextUpdates: [ "635199" ] },
        625814: { collaboration: true, missedTextUpdates: [ "625990" ] },
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
        662196: { collaboration: true },
        662452: { ignoreTextPosts: [ "" ] },
        662661: { ignoreTextPosts: [ "" ] },
        663088: { collaboration: true, ignoreTextPosts: [ "Apollo" ] },
        663996: { missedTextUpdates: [ "673890" ] },
        668009: { missedTextUpdates: [ "668227" ] },
        668216: { imageQuest: false},
        669206: { imageQuest: true, missedAuthors: [ "75347e" ] },
        672060: { missedTextUpdates: [ "673216" ] },
        673444: { ignoreTextPosts: [ "" ] },
        673575: { collaboration: true },
        673811: { missedTextUpdates: [ "682275", "687221", "687395", "688995" ], ignoreTextPosts: [ "" ] },
        677271: { missedTextUpdates: [ "677384" ] },
        678114: { imageQuest: false},
        678608: { missedTextUpdates: [ "678789" ] },
        679357: { missedTextUpdates: [ "679359", "679983" ] },
        680125: { ignoreTextPosts: [ "", "BritishHat" ] },
        681620: { missedAuthors: [ "d9faec" ] },
        683261: { missedAuthors: [ "3/8 MPP, 4/4 MF" ] },
        686590: { imageQuest: false},
        688371: { missedTextUpdates: [ "696249", "696257" ], ignoreTextPosts: [ "", "Chaos", "Ariadne", "Melinoe", "\"F\"ingGenius" ] },
        691136: { missedTextUpdates: [ "697620" ], ignoreTextPosts: [ "" ], wrongImageUpdates: [ "706696" ] },
        691255: { ignoreTextPosts: [ "" ] },
        692093: { collaboration: true, ignoreTextPosts: [ "Boxdog" ] },
        692872: { missedTextUpdates: [ "717187" ] },
        693509: { missedAuthors: [ "640f86" ], ignoreTextPosts: [ "640f86" ] },
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
        718844: { collaboration: true, missedTextUpdates: [ "720240", "721242" ] },
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
        754415: { collaboration: true, ignoreTextPosts: [ "!5tTWT1eydY" ] },
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
        800605: { collaboration: true },
        802411: { missedTextUpdates: [ "805002" ] },
        807972: { wrongTextUpdates: [ "811969" ] },
        809039: { wrongImageUpdates: [ "817508", "817511" ] },
        811957: { ignoreTextPosts: [ "via Discord" ] },
        814448: { missedTextUpdates: [ "817938" ] },
        817541: { missedAuthors: [ "Raptie" ] },
        822552: { imageQuest: false},
        823831: { missedAuthors: [ "Retro-LOPIS" ] },
        827264: { ignoreTextPosts: [ "LD", "DogFace" ] },
        830006: { collaboration: true },
        835062: { ignoreTextPosts: [ "Curves" ] },
        835750: { missedTextUpdates: [ "836870" ] },
        836521: { wrongTextUpdates: [ "848748" ] },
        837514: { ignoreTextPosts: [ "LD" ] },
        839906: { missedTextUpdates: [ "845724" ] },
        840029: { missedTextUpdates: [ "840044", "840543" ] },
        841851: { ignoreTextPosts: [ "Serpens", "Joy" ] },
        842392: { missedTextUpdates: [ "842434", "842504", "842544" ] },
        844537: { missedTextUpdates: [ "847326" ] },
        845168: { ignoreTextPosts: [ "a48264" ] },
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
        892578: { ignoreTextPosts: [ "" ] },
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
        924496: { ignoreTextPosts: [ "Alyssa" ], wrongImageUpdates: [ "926049", "951786" ] },
        926927: { missedTextUpdates: [ "928194" ] },
        929115: { wrongTextUpdates: [ "959349" ] },
        929545: { missedTextUpdates: [ "929634" ] },
        930854: { missedTextUpdates: [ "932282" ] },
        934026: { missedTextUpdates: [ "934078", "934817" ] },
        935464: { missedTextUpdates: [ "935544", "935550", "935552", "935880" ] },
        934706: { missedAuthors: [ "Karma" ], wrongTextUpdates: [ "934721", "934985", "935521" ] },
        939572: { missedTextUpdates: [ "940402" ] },
        940835: { missedTextUpdates: [ "941005", "941067", "941137", "941226", "942383", "944236", "945435" ] },
        944938: { missedTextUpdates: [ "945119" ] },
        947959: { collaboration: true, wrongImageUpdates: [ "948044", "948045" ] },
        949128: { ignoreTextPosts: [ "Breven" ] },
        950800: { missedTextUpdates: [ "955309", "955582", "956789", "1020563" ] },
        951319: { missedTextUpdates: [ "951450" ] },
        954301: { wrongImageUpdates: [ "954628" ] },
        960828: { missedTextUpdates: [ "967578", "967607", "967611", "967616", "967619", "967628", "967636", "967642", "967646", "967776", "967778", "967785", "967789", "967803", "967809", "967813", "967899", "968112", "968119", "968224", "968230", "968238", "968242" ] },
        964608: { missedTextUpdates: [ "964674" ] },
        968549: { missedTextUpdates: [ "968841" ] },
        971193: { missedTextUpdates: [ "971938", "997943" ] },
        971801: { missedTextUpdates: [ "971804", "971825" ] },
        973331: { missedTextUpdates: [ "973726", "973764" ] },
        974578: { missedTextUpdates: [ "974901", "974902", "974903", "974906", "975511", "976295", "976296", "976297", "976298" ] },
        975434: { imageQuest: false },
        976580: { missedTextUpdates: [ "976604", "976657", "976669", "976841", "983554" ] },
        978557: { ignoreTextPosts: [ "" ] },
        982815: { missedTextUpdates: [ "992488" ] },
        989640: { missedTextUpdates: [ "989941" ] },
        991564: { missedTextUpdates: [ "991566" ] },
        994099: { collaboration: true },
        1001663: { collaboration: true, ignoreTextPosts: [ "" ] },
        1002454: { ignoreTextPosts: [ "" ] },
        1004042: { missedAuthors: [ "b35aa3", "Kiocoatl" ] },
        1010895: { missedTextUpdates: [ "1010926", "1011004", "1011011" ] },
        1013611: { wrongImageUpdates: [ "1014242" ], ignoreTextPosts: [ "tippler", "" ] },
        1014176: { ignoreTextPosts: [ "Edmango" ] },
        1014571: { missedTextUpdates: [ "1025238" ] },
        1015802: { ignoreTextPosts: [ "Edmango" ] },
        1023251: { imageQuest: false },
        1023844: { ignoreTextPosts: [ "good ol wife" ] },
        1028352: { wrongTextUpdates: [ "1028424", "1028426", "1028771", "1028772", "1028957", "1028958" ] },
        1028430: { ignoreTextPosts: [ "" ], wrongTextUpdates: [ "1028530" ] },
        2000012: { missedAuthors: [ "Happiness" ] },
      };
    }
    return this.allFixes;
  }
}

//More or less standard XMLHttpRequest wrapper
//Input: url
//Output: Promise that resolves into the XHR object (or a HTTP error code)
class Xhr {
  static get(url) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr);
          }
          else {
            reject(xhr.status);
          }
        }
      };
      xhr.ontimeout = function () {
        reject("timeout");
      };
      xhr.open("get", url, true);
      xhr.send();
    });
  }
}

//QuestReader class
//Input: none
//Output: none
//Usage: new QuestReader.init(settings);
//settings: a settings object obtained from the object's onSettingsChanged event, allowing you to store settings
class QuestReader {
  constructor(doc) {
    this.doc = doc;
    this.boardName = doc.location.pathname.match(new RegExp("/kusaba/([a-z]*)/res/"))[1];
    this.threadType = BoardThreadTypes[this.boardName];
    this.defaultName = BoardDefaultNames[this.boardName];
    this.hasTitle = false;
    this.updates = [];
    this.sequences = [];
    this.defaultSettings = this.getDefaultSettings();
    this.setSettings(this.defaultSettings);
    this.threadID = null;
    this.refClass = null;
    this.posts = null;
    this.firstPostElements = [];
    this.cloneCache = {};
    this.controls = {};
    this.total = { authorComments: 0, suggestions: 0};
    this.author = null;
    this.suggesters = null;
    this.scrollIntervalHandle = null;
    this.replyFormDraggable = null;
    this.dayNames = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    this.currentDateTime = null;
    this.relativeTime = null;
    //regular expressions
    this.reCanonID = new RegExp("^[0-9a-f]{6}$");
    //events
    this.onSettingsLoad = null;
    this.onSettingsChanged = null;
    this.onWikiDataLoad = null;
    this.onWikiDataChanged = null;
  }

  getDefaultSettings() {
    return {
      currentUpdateIndex: 0,
      viewMode: "all", //all, single, sequence
      showSuggestions: "all", //none, last, all
      showAuthorComments: "all", //none, last, all
      showReferences: this.threadType == ThreadType.QUEST ? "nonupdates" : "all", //none, nonupdates, all
      replyFormLocation: "float", //top, bottom, float
      expandImages: "none", //none, updates, all
      maxImageWidth: 100,
      maxImageHeight: 96,
      stretchImages: false,
      showUpdateInfo: false,
      timestampFormat: "server", //server, local, relative, auto, hide
      colorUsers: false,
      showUserPostCounts: false,
      showUserNav: false,
      showUserMultiPost: false,
      showReplyForm: false,
      moveToLast: false,
      wikiPages: [],
      wikiLastSearchTime: 0,
    };
  }

  init(doc) {
    var results = new UpdateAnalyzer({ passive: this.threadType != ThreadType.QUEST, defaultName: this.defaultName, debug: true }).analyzeQuest(doc); //run UpdateAnalyzer to determine which posts are updates and what not
    this.threadID = results.postTypes.keys().next().value;
    this.refClass = `ref|${doc.body.querySelector(`input[name="board"]`).value}|${this.threadID}|`; //a variable used for finding and creating post reference links
    this.updates = this.getUpdatePostGroups(results.postTypes, results.postUsers); //organize posts into groups where each group has one update post and its trailing suggestions
    this.sequences = this.getUpdateSequences(); //a list of unique update sequences
    this.loadSettings(); //load settings; YouDontSay.jpg
    this.insertStyling(this.doc); //insert html elements for styling
    this.posts = this.buildPostInfo(this.doc, results.postTypes, results.postUsers); //cache post elements and other post data for faster access
    this.initCloneCache(this.doc); //cache some elements for faster insertion
    this.insertControls(this.doc); //insert html elements for controls
    this.insertEvents(this.doc); //insert our own button events plus some global events
    this.modifyLayout(this.doc); //change the default layout by moving elements around to make them fit better
    this.insertTooltips(); //add some explanations to our controls
    this.refresh({checkHash: "correct", smoothScroll: false}); //hide all posts and show only the relevant ones; enable/disable/update controls
    this.useWiki(); //get data from wiki and use them to set up wiki link, disthread link, and other thread links
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
        this.total.authorComments++;
      }
      else { //PostType.SUGGESTION
        currentPostGroup.suggestions.unshift(postTypesArray[i][0]);
        this.total.suggestions++;
      }
    }
    //create sequence groups
    var currentUpdateSequence = [];
    updatePostGroups.forEach(postGroup => {
      currentUpdateSequence.push(postGroup);
      postGroup.sequence = currentUpdateSequence;
      if (postGroup.suggestions.length > 0) {
        currentUpdateSequence = [];
      }
    });
    //set post suggesters
    var allSuggesters = new Set();
    updatePostGroups.forEach(postGroup => {
      postGroup.suggesters = postGroup.suggestions.reduce((suggesters, el) => {
        var suggester = postUsers.get(el);
        suggesters.add(suggester);
        allSuggesters.add(suggester);
        return suggesters;
      }, new Set());
      postGroup.suggesters = [...postGroup.suggesters];
    });
    this.author = postUsers.get(this.threadID);
    this.suggesters = [...allSuggesters];
    return updatePostGroups;
  }

  getUpdateSequences() {
    var sequences = [];
    this.updates.forEach(update => {
      if (update.sequence !== sequences[sequences.length - 1]) {
        sequences.push(update.sequence);
      }
    });
    return sequences;
  }

  currentUpdate() {
    return this.updates[this.currentUpdateIndex];
  }

  firstUpdate() {
    return this.updates[0];
  }

  lastUpdate() {
    return this.updates[this.updates.length - 1];
  }

  currentSequenceIndex() {
    return this.sequences.indexOf(this.currentUpdate().sequence);
  }

  buildPostInfo(doc, postTypes, postUsers) {
    var posts = new Map();

    doc.body.querySelector(":scope > form").querySelectorAll(".postwidth > a[name]").forEach(anchor => {
      if (anchor.name == "s") {
        return;
      }
      var header = anchor.parentElement;
      var inner = header.parentElement;
      var postID = parseInt(anchor.name);
      var outer = inner;
      var outerName = postID === this.threadID ? "FORM" : "TABLE";
      while (outer.nodeName != outerName) {
        outer = outer.parentElement;
      }
      posts.set(postID, {
        outer: outer, inner: inner, header: header, user: postUsers.get(postID), type: postTypes.get(postID), timestampFormat: "server", relativeTime: null, serverDateTimeString: "", utcTime: 0, references: null,
        suggesterIsNew: false, userPrevPost: null, userNextPost: null, insertedReferences: false, insertedUserColors: false, insertedUserNav: false, insertedUserMultiPost: false, expandedThumbnail: false,
        imgInfo: null,
      });
    });
    this.getFirstPostElements(posts);
    this.getPostImageInfo(posts);
    this.getPostReferences(posts);
    if (this.threadType === ThreadType.QUEST) {
      this.getUserMultiPostInfo(posts, postUsers);
    }
    this.getUserNavInfo(posts, postUsers);
    this.setUserPostCounts(posts);
    return posts;
  }

  getFirstPostElements(posts) {
    var child = posts.get(this.threadID).inner.firstElementChild;
    while (child && child.nodeName !== "TABLE") {
      if (child.className === "postwidth" || child.nodeName === "BLOCKQUOTE" || child.className === "pony" || child.className === "unicorn" || child.className === "de-refmap") {
        this.firstPostElements.push(child);
      }
      child = child.nextElementSibling;
    }
  }

  getPostImageInfo(posts) {
    var reExpandCode = new RegExp(`expandimg\\('([0-9]+)', '(.*)', '(.*)', '([0-9]+)', '([0-9]+)', '([0-9]+)', '([0-9]+)'\\);`);
    var fileLinks = document.querySelectorAll(".filesize a");
    fileLinks.forEach(fileLink => {
      var expandString = fileLink.getAttribute("onclick") || "";
      var matches = expandString.match(reExpandCode);
      if (matches) {
        var post = posts.get(+matches[1]);
        if (post) {
          post.imgInfo = { imgSrc: matches[2], thumbSrc: matches[3], imgWidth: matches[4], imgHeight: matches[5], thumbWidth: matches[6], thumbHeight: matches[7], };
          if (!post.imgInfo.imgSrc.startsWith("http")) {
            post.imgInfo.imgSrc = this.doc.location.origin + post.imgInfo.imgSrc;
            post.imgInfo.thumbSrc = this.doc.location.origin + post.imgInfo.thumbSrc;
          }
        }
      }
    });
  }

  getPostReferences(posts) {
    var postLinks = posts.get(this.threadID).outer.querySelectorAll(`blockquote a[class^="${this.refClass}"]`); //this is faster than traversing all posts
    postLinks.forEach(link => {
      var parent = link.parentElement;
      while (parent.nodeName !== "BLOCKQUOTE") {
        parent = parent.parentElement;
      }
      parent = parent.parentElement;
      var linkPostID = parent.id.startsWith("reply") ? parseInt(parent.id.substring(5)) : this.threadID;
      var targetID = parseInt(link.classList[0].substring(this.refClass.length));
      var targetInfo = posts.get(targetID);
      if (!targetInfo) {
        return;
      }
      if (!targetInfo.references) {
        targetInfo.references = [];
      }
      targetInfo.references.push(linkPostID);
    });
  }

  getUserMultiPostInfo(postsInfo, postUsers) {
    this.updates.forEach(update => {
      var suggesterPosts = new Map(); //dictionary <user, postIDs[]>; which suggester made which posts for the current update
      update.suggestions.forEach(postID => {
        var suggester = postUsers.get(postID);
        var posts = suggesterPosts.get(suggester) || [];
        posts.push(postID);
        suggesterPosts.set(suggester, posts);
      });
      suggesterPosts.forEach((posts, suggester) => {
        suggester.isNew = suggester.postCount === posts.length;
        for (var postIndex = 0; postIndex < posts.length; postIndex++) {
          var postInfo = postsInfo.get(posts[postIndex]);
          if (!postInfo) {
            continue;
          }
          postInfo.suggesterIsNew = suggester.postCount === posts.length;
          if (posts.length > 1) {
            postInfo.userMultiPostIndex = postIndex + 1;
            postInfo.userMultiPostLength = posts.length;
          }
        }
      });
    });
  }

  getUserNavInfo(posts, postUsers) {
    var usersPrevPost = new Map();
    posts.forEach((post, postID) => {
      var user = postUsers.get(postID);
      post.userPostCount = user.postCount;
      var prevPostID = usersPrevPost.get(user);
      if (prevPostID) {
        posts.get(prevPostID).userNextPost = postID;
        post.userPrevPost = prevPostID;
      }
      usersPrevPost.set(user, postID);
    });
    usersPrevPost.clear();
  }

  setUserPostCounts(posts, postUsers) {
    posts.forEach((post, postID) => {
      var uidEl = post.header.querySelector(".uid");
      uidEl.setAttribute("postcount", post.userPostCount);
      if (post.suggesterIsNew) {
        uidEl.classList.add("isNew");
      }
    });
  }

  initCloneCache(doc) {
    this.cloneCache.a = doc.createElement("a");
    this.cloneCache.div = doc.createElement("div");
    this.cloneCache.span = doc.createElement("span");
    var fragmentUp = doc.createRange().createContextualFragment(`<a class="qrUserNavDisabled"><svg class="qrNavIcon" viewBox="0 0 24 24"><path d="M3 21.5l9-9 9 9M3 12.5l9-9 9 9"/></svg></a>`);
    var fragmentDown = doc.createRange().createContextualFragment(`<a class="qrUserNavDisabled"><svg class="qrNavIcon" viewBox="0 0 24 24"><path d="M3 12.5l9 9 9-9M3 3.5l9 9 9-9"/></svg></a>`);
    this.cloneCache.upLink = fragmentUp.children[0];
    this.cloneCache.downLink = fragmentDown.children[0];
    this.cloneCache.userMultiPostElement = doc.createElement("span");
    this.cloneCache.userMultiPostElement.className = "qrUserMultiPost";
  }

  refresh(options = {}) {
    var checkHash = options.checkHash !== undefined ? options.checkHash : "false"; //checkHash: if true and the url has a hash, show the update that contains the post ID in the hash and scroll to this post
    var scroll = options.scroll !== undefined ? options.scroll : true; //scroll: if true (default), scroll to the current update
    var smoothScroll = options.smoothScroll !== undefined ? options.smoothScroll : true; //if true (default), use smooth scroll
    var scrollToPostID = null;
    if (this.moveToLast) {
      this.moveToLast = false;
      this.showLast(false);
    }
    if (checkHash !== "false") {
      var hashedPostID = parseInt(this.doc.location.hash.replace("#", ""));
      if (!isNaN(hashedPostID) && hashedPostID != this.threadID && this.posts.has(hashedPostID)) {
        //Clicking on a "new posts" link in the Watched Threads usually takes you to the wrong post in a thread, that it, one post before the actual new post.
        //This usually results in visiting a post before the update, which is wrong -> we should be showing the update instead
        scrollToPostID = hashedPostID;
        var hashedUpdateIndex = this.findUpdateIndex(hashedPostID);
        if (checkHash === "correct" && this.threadType == ThreadType.QUEST) {
          var hashedUpdate = this.updates[hashedUpdateIndex];
          var hashedUpdatePosts = hashedUpdate.authorComments.concat(hashedUpdate.suggestions).sort();
          var isLastPostInTheUpdate = hashedPostID == hashedUpdatePosts[hashedUpdatePosts.length - 1];
          //the correction should only work if it's the one post before the first update of the last sequence
          if (isLastPostInTheUpdate && hashedUpdateIndex >= 0 && hashedUpdateIndex >= this.updates.indexOf(this.lastUpdate().sequence[0]) - 1 && hashedUpdateIndex < this.updates.length - 1) {
            hashedUpdateIndex++;
            scrollToPostID = null;
          }
        }
        this.changeIndex(hashedUpdateIndex, false);
      }
    }
    if (!scrollToPostID && this.threadType == ThreadType.QUEST && this.viewMode == "all" && this.currentUpdate() != this.firstUpdate()) {
      scrollToPostID = this.currentUpdate().updatePostID;
    }
    this.currentDateTime = new Date();
    this.hideAll();
    this.showCurrentUpdates();
    if (checkHash !== "false" && scrollToPostID) {
      this.showPost(scrollToPostID); //in case we want to scroll to a hidden suggestion, we want to show it first
    }
    this.updateControls();
    if (scroll) {
      var scrollToElement = (scrollToPostID && this.posts.has(scrollToPostID)) ? this.posts.get(scrollToPostID).outer : this.controls.controlsTop;
      var scrollOptions = { behavior: smoothScroll ? "smooth" : "auto", block: "start", };
      var scrollFunction = () => { this.doc.defaultView.requestAnimationFrame(() => { scrollToElement.scrollIntoView(scrollOptions); }); };
      if (this.doc.readyState !== "complete") {
        this.doc.defaultView.addEventListener("load", scrollFunction, { once: true });
      }
      else {
        scrollFunction();
      }
    }
  }

  hideAll() {
    this.posts.forEach((post, postID) => {
      if (postID == this.threadID) {
        this.firstPostElements.forEach(el => { el.classList.add("veryhidden"); });
      }
      else {
        post.outer.classList.add("hidden");
      }
    });
  }

  findUpdateIndex(postID) {
    for (var i = 0; i < this.updates.length; i++) {
      if (this.updates[i].updatePostID == postID || this.updates[i].suggestions.indexOf(postID) != -1 || this.updates[i].authorComments.indexOf(postID) != -1) {
        return i;
      }
    }
    return -1;
  }

  showCurrentUpdates() {
    var updatesToShow = {
      single: [ this.currentUpdate() ],
      sequence: this.currentUpdate().sequence,
      all: this.updates,
    };
    var updatesToExpand = {};
    updatesToExpand.single = [this.updates[this.currentUpdateIndex - 1], this.currentUpdate(), this.updates[this.currentUpdateIndex + 1]].filter(el => !!el);
    updatesToExpand.sequence = [...this.sequences[this.currentSequenceIndex() - 1] || [], ...this.sequences[this.currentSequenceIndex()], ...this.sequences[this.currentSequenceIndex() + 1] || []];
    //expanding images on the fly when in full thread view is a bit janky when navigating up
    updatesToExpand.all = [this.currentUpdate(), this.updates[this.currentUpdateIndex + 1], this.updates[this.currentUpdateIndex + 2]].filter(el => !!el);
    //updatesToExpand.all = this.updates;

    updatesToShow[this.viewMode].forEach(update => this.showUpdate(update));
    updatesToExpand[this.viewMode].forEach(update => this.expandUpdateImages(update));
  }

  expandUpdateImages(update) {
    var postsToExpand = [ update.updatePostID ];
    if (this.expandImages != "updates") {
      postsToExpand = postsToExpand.concat(update.suggestions, update.authorComments);
    }
    postsToExpand.forEach(postID => {
      var post = this.posts.get(postID);
      if (!post || !post.imgInfo) {
        return;
      }
      var img = post.header.querySelector(`#thumb${postID} > img`);
      if (img.previousElementSibling && img.previousElementSibling.nodeName === "CANVAS") {
        img.previousElementSibling.remove(); //remove canvas covering the image
        img.style.removeProperty("display");
      }
      var expanded = this.viewMode == "all" ? img.style.backgroundImage === `url(${post.imgInfo.imgSrc})` : img.src == post.imgInfo.imgSrc;
      if (expanded !== (this.expandImages == "all" || (this.expandImages == "updates" && postID == update.updatePostID))) { //image should be expanded or contracted
        if (!expanded) {
          img.removeAttribute("onmouseover");
          img.removeAttribute("onmouseout");
          if (post.outer.classList.contains("hidden")) { //if it's a hidden post, we'd like to preload the image, but a bit later
            setTimeout(() => { new Image().src = post.imgInfo.imgSrc });
          }
          else if (this.viewMode == "all") {
            img.style.backgroundImage = `url(${post.imgInfo.imgSrc})`;
          }
          else {
            img.src = post.imgInfo.imgSrc;
          }
        }
        else {
          img.src = post.imgInfo.thumbSrc;
          img.width = post.imgInfo.thumbWidth;
          img.height = post.imgInfo.thumbHeight;
        }
      }
    });
  }

  showUpdate(update) {
    this.showPost(update.updatePostID);
    if (this.showSuggestions == "all" || this.showSuggestions == "last" && update == this.lastUpdate()) {
      update.suggestions.forEach(postID => this.showPost(postID));
    }
    if (this.showAuthorComments == "all" || this.showAuthorComments == "last" && update == this.lastUpdate()) {
      update.authorComments.forEach(postID => this.showPost(postID));
    }
  }

  showPost(postID) {
    this.insertPostElements(postID);
    if (postID == this.threadID) {
      this.firstPostElements.forEach(el => { el.classList.remove("veryhidden"); });
    }
    else {
      var post = this.posts.get(postID);
      if (post) {
        post.outer.classList.remove("hidden");
      }
    }
  }

  insertPostElements(postID) {
    var post = this.posts.get(postID);
    if (!post) {
      return;
    }
    if (!post.insertedReferences && (this.showReferences == "all" || (this.showReferences == "nonupdates" && post.type !== PostType.UPDATE))) {
      post.insertedReferences = true;
      if (post.references) {
        this.insertPostReferences(postID, post.references, post.inner);
      }
    }
    if (!post.insertedUserColors && this.colorUsers) {
      post.insertedUserColors = true;
      if (this.threadType !== ThreadType.QUEST || (post.user.id !== this.author.id && post.type !== PostType.UPDATE)) {
        this.insertUserColors(post);
      }
    }
    if (!post.insertedUserNav && this.showUserNav) {
      post.insertedUserNav = true;
      this.insertUserNav(post);
    }
    if (!post.insertedUserMultiPost && this.showUserMultiPost) {
      post.insertedUserMultiPost = true;
      if (post.userMultiPostIndex) {
        this.insertUserMultiPost(post);
      }
    }
    if (post.timestampFormat != this.timestampFormat || post.relativeTime !== this.relativeTime) {
      post.timestampFormat = this.timestampFormat;
      post.relativeTime = this.relativeTime;
      this.changePostTime(post);
    }
    if (this.viewMode == "all" && post.imgInfo && post.expandedThumbnail !== (this.expandImages === "all" || (this.expandImages == "updates" && post.type === PostType.UPDATE))) {
      post.expandedThumbnail = !post.expandedThumbnail;
      this.resizeThumbnail(post, post.expandedThumbnail);
    }
  }

  resizeThumbnail(post, expandThumbnail) {
    var imgElement = post.header.querySelector("img.thumb");
    if (expandThumbnail) {
      imgElement.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${post.imgInfo.imgWidth}px" height="${post.imgInfo.imgHeight}px"></svg>`;
      imgElement.style.backgroundImage = `url(${post.imgInfo.thumbSrc})`;
      imgElement.removeAttribute("onmouseover"); //it's possible these events trigger before expandUpdateImages and restore spoiler images, so gotta remove them here
      imgElement.removeAttribute("onmouseout");
    }
    else {
      imgElement.src = post.imgInfo.thumbSrc;
      imgElement.style.backgroundImage = "";
      imgElement.width = post.imgInfo.thumbWidth;
      imgElement.height = post.imgInfo.thumbHeight;
    }
  }

  insertPostReferences(postID, references, postElement) {
    var links = references.map(id => {
      var newLink = this.cloneCache.a.cloneNode("false");
      newLink.href = `#${id}`;
      newLink.className = `${this.refClass}${id}| qrReference`;
      newLink.textContent = `>>${id}`;
      return newLink;
    });
    var newDiv = this.cloneCache.div.cloneNode("false");
    newDiv.classList.add("qrReferences");
    newDiv.append(...links);
    postElement.querySelector("blockquote").insertAdjacentElement("afterEnd", newDiv);
    if (postID === this.threadID) {
      this.firstPostElements.push(newDiv);
    }
  }

  insertUserColors(post) {
    var uidEl = post.header.querySelector(".uid");
    var span = this.cloneCache.span.cloneNode(false);
    span.className = `qrColoredUid uid${this.getCanonID(post.user)}`;
    span.textContent = uidEl.firstChild.nodeValue.substring(4);
    uidEl.firstChild.nodeValue = "ID: ";
    uidEl.appendChild(span);
  }

  insertUserNav(post) {
    var uidEl = post.header.querySelector(".uid");
    var downLink = this.cloneCache.downLink.cloneNode(true);
    var upLink = this.cloneCache.upLink.cloneNode(true);
    if (post.userPrevPost) {
      upLink.href = `#${post.userPrevPost}`;
      upLink.className = "qrUserNavEnabled";
    }
    if (post.userNextPost) {
      downLink.href = `#${post.userNextPost}`;
      downLink.className = "qrUserNavEnabled";
    }
    uidEl.insertAdjacentElement("afterEnd", downLink);
    uidEl.insertAdjacentElement("afterEnd", upLink);
  }

  insertUserMultiPost(post) {
    var span = this.cloneCache.userMultiPostElement.cloneNode(false);
    span.textContent = `post ${post.userMultiPostIndex}/${post.userMultiPostLength}`;
    post.header.appendChild(span);
  }

  changePostTime(post) {
    var timeNode = post.header.querySelector("label").lastChild;
    if (post.timestampFormat == "hide") {
      post.serverDateTimeString = post.serverDateTimeString || ` ${timeNode.nodeValue.trim()}`;
      timeNode.nodeValue = "";
      return;
    }
    var utcTime = this.getUtcTime(post, timeNode);
    var difference = this.currentDateTime.getTime() - utcTime;
    if (post.relativeTime !== null ? post.relativeTime : post.timestampFormat == "relative" || (post.timestampFormat == "auto" && difference < 86400000)) {
      var date = new Date(utcTime);
      timeNode.nodeValue = `${this.getRelativeTimeString(difference, difference >= 86400000)} ago${difference >= 86400000 ? ` at ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}` : ""}`;
    }
    else {
      timeNode.nodeValue = post.timestampFormat == "server" ? post.serverDateTimeString : this.getAbsoluteDateTimeString(new Date(utcTime));
    }
  }

  getUtcTime(post, timeNode) {
    if (!post.utcTime) {
      post.serverDateTimeString = post.serverDateTimeString || ` ${timeNode.nodeValue.trim()}`;
      var d = post.serverDateTimeString;
      var serverTime = Date.UTC(d.substring(1, 5), d.substring(6, 8) - 1, d.substring(9, 11), d.substring(16, 18), d.substring(19));
      post.utcTime = serverTime - this.getServerTimeZoneOffset(new Date(serverTime));
    }
    return post.utcTime;
  }

  getServerTimeZoneOffset(dateTime) {
    var month = dateTime.getUTCMonth();
    var day = dateTime.getUTCDate();
    var dayOfWeek = dateTime.getUTCDay();
    var hour = dateTime.getUTCHours();
    var firstSunday = ((day + 7 - dayOfWeek) % 7) || 7;
    var after2ndSundayInMarch3am = month > 2 || (month == 2 && (day > firstSunday + 7 || ( day == firstSunday + 7 && hour >= 3)));
    var before1stSundayInNovember1am = month < 10 || (month == 10 && (day < firstSunday || ( day == firstSunday && hour < 1)));
    var isDST = after2ndSundayInMarch3am && before1stSundayInNovember1am;
    return (isDST ? -7 : -8) * 3600000;
  }

  getRelativeTimeString(difference, onlyDate) {
    //convert a difference between two dates into a string by finding and using the two most relevant date parts
    //writing this function was fun (read: hell); it's not perfect due to varying numbers of days in months and step years, but it should be good enough
    var names = onlyDate ? ["d", "mo", "y"] : ["min", "h", "d", "mo", "y"];
    var factors = onlyDate ? [30.4375, 12] : [60, 24, 30.4375, 12];
    var baseDifference = onlyDate ? difference / (60000 * 60 * 24) : difference / 60000;
    var diffs = factors.reduce((diffs, factor, index) => { diffs.push(diffs[index] / factor); return diffs; }, [ baseDifference ]);
    var i = diffs.length - 1;
    for (; i > 0 && diffs[i] < 1; i--) {} //find the most relevant date part -> the first one with a value greater than 1
    if (i > 0) { //truncate + round; 1.76h 105.6min -> 1h 46min
      diffs[i] = Math.trunc(diffs[i]);
      diffs[i - 1] = Math.round(diffs[i - 1] - diffs[i] * factors[i - 1]);
      if (diffs[i - 1] == factors[i - 1]) { //correct the parts if rounded to a factor number; 1h 60min -> 2h 0min
        diffs[i - 1] = 0;
        diffs[i]++;
      }
    }
    else {
      diffs[i] = onlyDate ? Math.trunc(diffs[i]) : Math.round(diffs[i]);
    }
    if (i < diffs.length - 1 && diffs[i] == factors[i]) { //correct the parts if rounding caused a transition; 60min -> 1h 0min
      diffs[i] = 0;
      i++;
      diffs[i] = 1;
    }
    return ` ${diffs[i]}${names[i]}${names[i - 1] ? ` ${diffs[i - 1]}${names[i - 1]}` : ""}`;
  }

  getAbsoluteDateTimeString(date) {
    return ` ${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}` +
      `(${this.dayNames[date.getDay()]})${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  showFirst() {
    var newUpdateIndex = 0;
    this.changeIndex(newUpdateIndex);
    if (this.doc.activeElement.disabled === true) { //Firefox bug: Keydown events don't trigger if focused input is disabled
      (event.target == this.controls.showFirstButtons[0] ? this.controls.showNextButtons[0] : this.controls.showNextButtons[1]).focus();
    }
  }

  showLast(refresh = true) {
    var newUpdateIndex = this.viewMode == "sequence" ? this.updates.indexOf(this.sequences[this.sequences.length - 1][0]) : this.updates.length - 1;
    this.changeIndex(newUpdateIndex, refresh);
    if (this.doc.activeElement.disabled === true) { //Firefox bug: Keydown events don't trigger if focused input is disabled
      (event.target == this.controls.showLastButtons[0] ? this.controls.showPrevButtons[0] : this.controls.showPrevButtons[1]).focus();
    }
  }

  showNext() {
    var newUpdateIndex = this.currentUpdateIndex + 1;
    if (this.viewMode == "sequence") { //move to the first update in the next sequence
      newUpdateIndex = this.currentSequenceIndex() < this.sequences.length - 1 ? this.updates.indexOf(this.sequences[this.currentSequenceIndex() + 1][0]) : this.updates.length;
    }
    this.changeIndex(newUpdateIndex);
  }

  showPrevious() {
    var newUpdateIndex = this.currentUpdateIndex - 1;
    if (this.viewMode == "sequence") {
      newUpdateIndex = this.currentSequenceIndex() > 0 ? this.updates.indexOf(this.sequences[this.currentSequenceIndex() - 1][0]) : -1;
    }
    this.changeIndex(newUpdateIndex);
  }

  changeIndex(newUpdateIndex, refresh = true) {
    if (newUpdateIndex === this.currentUpdateIndex || newUpdateIndex < 0 || newUpdateIndex > this.updates.length - 1) {
      return;
    }
    var difference = Math.abs(newUpdateIndex - this.currentUpdateIndex);
    if (this.viewMode == "sequence") {
      difference = Math.abs(this.sequences.indexOf(this.updates[newUpdateIndex].sequence) - this.currentUpdateSequence);
    }
    this.currentUpdateIndex = newUpdateIndex;
    if (refresh) {
      this.refresh({ smoothScroll: difference === 1 });
    }
    this.settingsChanged();
    //Firefox bug: Keydown events don't trigger if focused input is disabled (for instance, if clicked on the Last button) => change focus to some other button
    if (this.doc.activeElement.disabled === true) {
      var buttonToFocus = null;
      if (this.currentUpdateIndex === 0) {
        if ([...this.controls.showFirstButtons, ...this.controls.showPrevButtons].includes(event.target)) {
          buttonToFocus = this.controls.showNextButtons[0];
        }
      }
      else if (this.currentUpdateIndex === this.updates.length - 1 || (this.viewMode == "sequence" && this.currentSequenceIndex() === this.sequences.length - 1)) {
        if ([...this.controls.showLastButtons, ...this.controls.showNextButtons].includes(event.target)) {
          buttonToFocus = this.controls.showPrevButtons[0];
        }
      }
      if (buttonToFocus != null) {
        buttonToFocus.focus();
      }
    }
  }

  loadSettings() {
    if (this.onSettingsLoad) {
      var e = { threadID: this.threadID, threadType: this.threadType, boardName: this.boardName, settings: null };
      this.onSettingsLoad(e);
      if (e.settings) {
        this.setSettings(this.validateSettings(e.settings));
      }
    }
  }

  setSettings(settings) {
    if (settings) {
      for(var settingName in settings) {
        this[settingName] = settings[settingName];
      }
    }
  }

  validateSettings(settings) {
    if (!settings) {
      return settings;
    }
    if (settings.currentUpdateIndex < 0) settings.currentUpdateIndex = 0;
    if (settings.currentUpdateIndex >= this.updates.length) settings.currentUpdateIndex = this.updates.length - 1;
    for (var prop in settings) {
      if (this[prop] !== undefined && typeof(settings[prop]) !== typeof(this[prop])) {
        settings[prop] = this[prop];
      }
    }
    if (!settings.replyFormLocation) { //replyFormLocation == "float"
      settings.showReplyForm = false;
    }
    return settings;
  }

  settingsChanged() {
    if (this.onSettingsChanged) {
      var settings = {};
      for(var settingName in this.defaultSettings) {
        if (this[settingName] !== this.defaultSettings[settingName] || (Array.isArray(this[settingName]) && this[settingName].length > 0)) {
          settings[settingName] = this[settingName];
        }
      }
      this.onSettingsChanged({ threadID: this.threadID, threadType: this.threadType, boardName: this.boardName, settings: settings });
    }
  }

  toggleSettingsControls(e) {
    e.preventDefault(); //prevent scrolling to the top when clicking the link
    this.controls.settingsControls.classList.toggle("collapsedHeight");
    var label = e.target;
    label.text = this.controls.settingsControls.classList.contains("collapsedHeight") ? "Settings" : "Hide Settings";
  }

  showSettingsPage(e) {
    e.preventDefault();
    var linkContainer = e.target.parentElement;
    if (!linkContainer.classList.contains("qrSettingsNavItem")) {
      return;
    }
    this.controls.settingsControls.querySelector(".qrSettingsNavItemSelected").classList.remove("qrSettingsNavItemSelected");
    this.controls.settingsControls.querySelector(".qrCurrentPage").classList.remove("qrCurrentPage");
    linkContainer.classList.add("qrSettingsNavItemSelected");
    this.controls.settingsControls.querySelector(".qrSettingsPages").children[[...linkContainer.parentElement.children].indexOf(linkContainer)].classList.add("qrCurrentPage");
  }

  toggleReplyForm(e) {
    e.preventDefault();
    this.showReplyForm = !this.controls.replyForm.classList.toggle("hidden");
    this.controls.replyFormRestoreButton.classList.toggle("hidden", this.showReplyForm);
    if (this.replyFormLocation == "float" && !this.controls.replyForm.classList.contains("qrPopout")) {
      this.controls.replyFormPopoutButton.click();
    }
    if (this.showReplyForm) {
      this.controls.replyForm.querySelector(`[name="message"]`).focus();
    }
    this.settingsChanged();
  }

  popoutReplyForm(e) {
    e.preventDefault();
    var floating = this.controls.replyForm.classList.toggle("qrPopout");
    var svgPath;
    if (floating) {
      svgPath = "M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h5M15 14h-5v-5M10.5 13.5L20.2 3.8";
      this.controls.replyFormPopoutButton.title = "Stop floating the Reply form";
      if (!this.replyFormDraggable) {
        var rect = this.controls.replyForm.querySelector(".postform").getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        if (width === 0) { //some compatibility stuff
          var messageBox = this.controls.replyForm.querySelector(`[name="message"]`);
          if (messageBox.style.width) {
            width = Math.max(messageBox.style.width.replace("px", ""), messageBox.style.minWidth.replace("px", ""));
            height = Math.max(messageBox.style.height.replace("px", ""), messageBox.style.minHeight.replace("px", "")) + 150;
          }
        }
        this.controls.replyForm.style.left = `${this.doc.documentElement.clientWidth - width - 10}px`;
        this.controls.replyForm.style.top = `${(this.doc.defaultView.innerHeight - height) * 0.75}px`;
      }
      this.replyFormDraggable = new this.doc.defaultView.Draggable("postform", { handle: "qrReplyFormHeader" });
    }
    else {
      svgPath = "M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8";
      this.controls.replyFormPopoutButton.title = "Pop out the Reply form and have it float";
      this.replyFormDraggable.destroy();
    }
    this.controls.replyFormPopoutButton.firstElementChild.firstElementChild.firstElementChild.setAttribute("d", svgPath);
  }

  changeThread(e) {
    this.doc.location.href = e.target.value;
  }

  updateSettings() {
    this.viewMode = this.controls.viewModeDropdown.value;
    this.showSuggestions = this.controls.showSuggestionsDropdown.value;
    this.showAuthorComments = this.controls.showAuthorCommentsDropdown.value;
    this.expandImages = this.controls.expandImagesDropdown.value;
    this.showUpdateInfo = this.controls.showUpdateInfoCheckbox.checked;
    this.replyFormLocation = this.controls.replyFormLocationDropdown.value;
    this.refresh({scroll: false});
    this.settingsChanged();
  }

  changePostElementSettings(e) {
    if (e.target === this.controls.showReferencesDropdown) {
      this.showReferences = this.controls.showReferencesDropdown.value;
      this.doc.head.querySelector("#qrReferencesCss").innerHTML = this.getReferencesStyleRules();
    }
    else if (e.target === this.controls.colorUsersCheckbox) {
      this.colorUsers = this.controls.colorUsersCheckbox.checked;
      this.doc.head.querySelector("#qrUserColorsCss").innerHTML = this.getUserColorsStyleRules();
    }
    else if (e.target === this.controls.showUserPostCountsCheckbox) {
      this.showUserPostCounts = this.controls.showUserPostCountsCheckbox.checked;
      this.doc.head.querySelector("#qrUserPostCountsCss").innerHTML = this.getUserPostCountsStyleRules();
    }
    else if (e.target === this.controls.showUserNavCheckbox) {
      this.showUserNav = this.controls.showUserNavCheckbox.checked;
      this.doc.head.querySelector("#qrUserNavCss").innerHTML = this.getUserNavStyleRules();
    }
    else if (e.target === this.controls.showUserMultiPostCheckbox) {
      this.showUserMultiPost = this.controls.showUserMultiPostCheckbox.checked;
      this.doc.head.querySelector("#qrUserMultiPostCss").innerHTML = this.getUserMultiPostStyleRules();
    }
    else if (e.target === this.controls.timestampFormatDropdown) {
      this.timestampFormat = this.controls.timestampFormatDropdown.value;
      this.relativeTime = null;
    }
    this.refresh({scroll: false});
    this.settingsChanged();
  }

  changeImageSizeSettings(e) {
    var width = parseInt(this.controls.maxImageWidthTextbox.value);
    var height = parseInt(this.controls.maxImageHeightTextbox.value);
    if (isNaN(width) || width < 0 || width > 100) {
      width = this.maxImageWidth;
      this.controls.maxImageWidthTextbox.value = width;
    }
    if (isNaN(height) || height < 0 || height > 100) {
      height = this.maxImageHeight;
      this.controls.maxImageHeightTextbox.value = height;
    }
    this.maxImageWidth = width;
    this.maxImageHeight = height;
    this.stretchImages = this.controls.stretchImagesCheckbox.checked;
    this.controls.imageWidthLabel.textContent = this.stretchImages ? "Image container width" : "Max image width";
    this.controls.imageHeightLabel.textContent = this.stretchImages ? "Image container height" : "Max image height";
    this.doc.head.querySelector("#qrImageSizeCss").innerHTML = this.getImageSizesStyleRules();
    this.refresh({scroll: false});
    this.settingsChanged();
  }

  async useWiki() {
    if (this.threadType == ThreadType.OTHER) {
      return;
    }
    var wikiUrls = await this.findWikiUrls();
    if (!wikiUrls) {
      return;
    }
    var wikiDatas = [];
    for (let wikiUrl of wikiUrls) {
      var wikiPageName = wikiUrl.substring(wikiUrl.lastIndexOf("/") + 1);
      //cache wiki page names
      if (!this.wikiPages.includes(wikiPageName)) {
        this.wikiPages.push(wikiPageName);
        this.settingsChanged();
      }
      //try get wiki data from cache
      let wikiData = await this.getWikiData(wikiUrl);
      wikiDatas.push(wikiData);
      //cache wiki data
      if (this.onWikiDataChanged !== null) {
        //remember last visited quest thread
        if (this.threadType == ThreadType.QUEST) {
          wikiData.lastVisitedQuestUrl = this.doc.location.href.replace(new RegExp("#[0-9]+$"), ""); //don't want to remember the anchor
          wikiData.lastVisitedTime = Date.now();
        }
        let e = { threadID: this.threadID, threadType: this.threadType, boardName: this.boardName, wikiPageName: wikiPageName, wikiData: wikiData };
        this.onWikiDataChanged(e);
      }
    }
    //use wiki data
    //set up links to the quest wiki
    var wikiTarget = this.wikiPages.length > 1 ? `/w/index.php?search=${this.threadID}&fulltext=1&limit=500`: wikiUrls[0];
    this.controls.wikiLinks.forEach(link => { link.href = wikiTarget; link.style.removeProperty("color"); });
    //set up link to the discussion thread, or quest thread if currently in a discussion thread
    if (this.threadType == ThreadType.QUEST) {
      var disThreadGroup = wikiDatas[0].threadGroups.find(group => group.some(link => link.url.indexOf("/questdis/") >= 0));
      if (disThreadGroup) {
        this.controls.disLinks.forEach(link => { link.href = disThreadGroup[disThreadGroup.length - 1].url; link.parentElement.classList.remove("hidden"); });
      }
    }
    else if (this.threadType == ThreadType.DISCUSSION) {
      var visitedQuests = wikiDatas.filter(wikiData => wikiData.lastVisitedQuestUrl);
      if (visitedQuests.length > 0) {
        var lastVisitedUrl = visitedQuests.sort((a, b) => b.lastVisitedTime - a.lastVisitedTime)[0].lastVisitedQuestUrl;
        this.controls.questLinks.forEach(link => { link.href = lastVisitedUrl; link.parentElement.classList.remove("hidden"); });
      }
      else if (wikiDatas.length === 1) {
        var questUrls = [];
        wikiDatas[0].threadGroups.forEach(group => group.forEach(link => { if (link.url.indexOf("/quest/") >= 0) questUrls.push(link.url); }));
        if (questUrls.length > 0) {
          var lastNumberRegEx = new RegExp("([0-9]+)(?=[^0-9]*$)");
          var highestIdThread = questUrls.reduce((max, url) => { if (parseInt(url.match(lastNumberRegEx)[1]) > parseInt(max.match(lastNumberRegEx)[1])) max = url; return max; });
          this.controls.questLinks.forEach(link => { link.href = highestIdThread; link.parentElement.classList.remove("hidden"); });
        }
      }
    }
    //set up links to the quest threads; if in one of the quest threads, then only show links from the same group
    var currentThreadGroup = wikiDatas[0].threadGroups.find(group => group.some(link => link.url.indexOf(this.threadID) >= 0));
    if (currentThreadGroup) {
      var threadOptionsHtml;
      if (this.threadType == ThreadType.QUEST) {
        threadOptionsHtml = currentThreadGroup.reduce((optionsHtml, thread) => optionsHtml + `<option value="${thread.url}">${thread.name}</option>`, "");
      }
      else {
        var questsOptions = wikiDatas.map(wikiData => {
          var optionsGroups = wikiData.threadGroups.map(group => group.reduce((optionsHtml, thread) => optionsHtml + `<option value="${thread.url}">  ${thread.name}</option>`, ""));
          return `<option disabled>${wikiData.questTitle}</option>` + optionsGroups.join(`<option disabled>────────</option>`);
        });
        threadOptionsHtml = questsOptions.join(`<option disabled></option>`);
      }
      var currentThreadUrl = currentThreadGroup.find(thread => thread.url.indexOf(this.threadID) >= 0).url;
      this.controls.threadLinksDropdowns.forEach(dropdown => {
        dropdown.innerHTML = threadOptionsHtml;
        dropdown.value = currentThreadUrl;
      });
    }
    //update the thread / tab title with the title from wiki
    if (wikiDatas[0].questTitle) {
      if (this.threadType == ThreadType.DISCUSSION) {
        if (wikiDatas.length === 1) {
          this.doc.title = `${wikiDatas[0].questTitle} Discussion`;
          this.controls.logo.textContent = this.doc.title;
        }
      }
      else {
        this.doc.title = `${this.hasTitle ? this.doc.title : wikiDatas[0].questTitle}${wikiDatas[0].byAuthors}`;
        this.controls.logo.textContent = this.doc.title;
      }
    }
  }

  async findWikiUrls() {
    if (this.wikiPages.length > 0 && Date.now() - this.wikiLastSearchTime < 24 * 60 * 60000) { //flush the cache every 24 hours
      return this.wikiPages.map(name => `/wiki/${name}`);
    }
    try {
      this.wikiPages = [];
      var xhr = await Xhr.get(`/w/index.php?search=${this.threadID}&fulltext=1&limit=500`);
      this.wikiLastSearchTime = Date.now();
    }
    catch(e) {
      return;
    }
    //var threadID = xhr.responseURL.match(new RegExp("search=([0-9]+)"))[1];
    var doc = this.doc.implementation.createHTMLDocument(); //we create a HTML document, but don't load the images or scripts therein
    doc.documentElement.innerHTML = xhr.response;
    var results = [...doc.querySelectorAll(".searchmatch")].filter(el => el.textContent == this.threadID);
    if (results.length === 0) {
      return;
    }
    //filter wiki search results to the ones that have the threadID in the quest info box
    var theRightOnes = results.filter(el => {var p = el.previousSibling; return p && p.nodeType == Node.TEXT_NODE && p.textContent.match(new RegExp("[0-9]=$")); });
    if (theRightOnes.length === 0) {
      return;
    }
    return theRightOnes.map(el => el.parentElement.previousElementSibling.querySelector("a").href);
  }

  async getWikiData(wikiUrl) {
    var wikiPageName = wikiUrl.substring(wikiUrl.lastIndexOf("/") + 1);
    if (this.onWikiDataLoad !== null) {
      let e = { threadID: this.threadID, threadType: this.threadType, boardName: this.boardName, wikiPageName: wikiPageName, wikiData: null };
      this.onWikiDataLoad(e);
      if (e.wikiData && e.wikiData.retrieveTime && Date.now() - e.wikiData.retrieveTime < 24 * 60 * 60000) { //flush cache every 24 hours
        return e.wikiData;
      }
    }
    var wikiData = { retrieveTime: Date.now() };
    try {
      var xhr = await Xhr.get(wikiUrl);
    }
    catch(e) {
      this.wikiPages = this.wikiPages.filter(el => el !== wikiPageName);
      this.settingsChanged();
      return;
    }
    //parse quest wiki
    var doc = this.doc.implementation.createHTMLDocument();
    doc.documentElement.innerHTML = xhr.response;
    var links = [...doc.querySelectorAll(".infobox a")];
    links = links.filter(link => link.href.indexOf("image-for") < 0);
    var threadLinks = links.filter(l => l.href.indexOf("/quest/") >= 0 || l.href.indexOf("/questarch/") >= 0 || l.href.indexOf("/graveyard/") >= 0);
    var disThreadLinks = links.filter(l => l.href.indexOf("/questdis/") >= 0);
    //create thread groups, like they're in the wiki
    wikiData.threadGroups = [];
    var groups = new Map();
    [...threadLinks, ...disThreadLinks].forEach(link => {
      var key = link.parentElement.parentElement;
      var group = groups.get(key) || [];
      group.push({name: link.textContent, url: link.href});
      groups.set(key, group);
    });
    groups.forEach((links, key) => wikiData.threadGroups.push(links));
    wikiData.threadGroups.forEach(group => group.forEach(link => {
      if (link.name == "Thread" && group.length === 1) {
        link.name = "Thread 1";
      }
    }));
    //get quest author and title
    var infoboxHeader = doc.querySelector(".infobox big");
    if (infoboxHeader) {
      var children = [...infoboxHeader.childNodes];
      wikiData.questTitle = children.shift().textContent;
      wikiData.byAuthors = children.reduce((acc, el) => {acc += el.textContent; return acc;}, "");
    }
    return wikiData;
  }

  updateControls() {
    var leftDisabled = this.currentUpdate() == this.firstUpdate();
    var rightDisabled = this.currentUpdate() == this.lastUpdate();
    var current = this.currentUpdateIndex + 1;
    var last = this.updates.length;
    var infoUpdate = this.currentUpdate();
    if (this.viewMode == "sequence") {
      leftDisabled = this.currentUpdate().sequence == this.firstUpdate().sequence;
      rightDisabled = this.currentUpdate().sequence == this.lastUpdate().sequence;
      current = this.currentSequenceIndex() + 1;
      last = this.sequences.length;
      infoUpdate = this.currentUpdate().sequence[this.currentUpdate().sequence.length - 1];
    }
    // buttons
    [...this.controls.showFirstButtons, ...this.controls.showPrevButtons].forEach(button => { button.disabled = leftDisabled; });
    [...this.controls.showNextButtons, ...this.controls.showLastButtons].forEach(button => { button.disabled = rightDisabled; });
    // update info
    this.controls.currentPosLabels.forEach(label => { label.textContent = current; label.classList.toggle("qrLastIndex", current == last); });
    this.controls.totalPosLabels.forEach(label => { label.textContent = last; });
    this.controls.updateInfos.forEach(infoContainer => { infoContainer.classList.toggle("hidden", !this.showUpdateInfo); });
    if (this.showUpdateInfo) {
      this.controls.authorCommentsCountLabels[0].textContent = ` A:${this.viewMode !== "all" ? infoUpdate.authorComments.length : this.total.authorComments}`;
      this.controls.authorCommentsCountLabels[1].textContent = ` A:${infoUpdate.authorComments.length}`;
      this.controls.suggestionsCountLabels[0].textContent = ` S:${this.viewMode !== "all" ? infoUpdate.suggestions.length : this.total.suggestions}`;
      this.controls.suggestionsCountLabels[1].textContent = ` S:${infoUpdate.suggestions.length}`;
      this.updateSuggestersLabel(this.controls.suggestersCountLabels[0], this.viewMode === "all" ? this.suggesters : infoUpdate.suggesters);
      this.updateSuggestersLabel(this.controls.suggestersCountLabels[1], infoUpdate.suggesters);
    }
    // settings
    this.controls.viewModeDropdown.value = this.viewMode;
    this.controls.showSuggestionsDropdown.value = this.showSuggestions;
    this.controls.showAuthorCommentsDropdown.value = this.showAuthorComments;
    this.controls.showReferencesDropdown.value = this.showReferences;
    this.controls.replyFormLocationDropdown.value = this.replyFormLocation;
    this.controls.expandImagesDropdown.value = this.expandImages;
    this.controls.maxImageWidthTextbox.value = this.maxImageWidth;
    this.controls.maxImageHeightTextbox.value = this.maxImageHeight;
    this.controls.stretchImagesCheckbox.checked = this.stretchImages;
    this.controls.imageWidthLabel.textContent = this.stretchImages ? "Image container width" : "Max image width";
    this.controls.imageHeightLabel.textContent = this.stretchImages ? "Image container height" : "Max image height";
    this.controls.showUpdateInfoCheckbox.checked = this.showUpdateInfo;
    this.controls.timestampFormatDropdown.value = this.timestampFormat;
    this.controls.colorUsersCheckbox.checked = this.colorUsers;
    this.controls.showUserPostCountsCheckbox.checked = this.showUserPostCounts;
    this.controls.showUserNavCheckbox.checked = this.showUserNav;
    this.controls.showUserMultiPostCheckbox.checked = this.showUserMultiPost;
    // sticky controls when viewing whole thread (only in quest threads)
    if (this.threadType == ThreadType.QUEST) {
      this.controls.navControls[1].classList.toggle("stickyBottom", this.viewMode == "all");
      this.controls.navLinksContainers[1].classList.toggle("qrNavLinksBottom", this.viewMode == "all");
      var areLinksInGrid = this.controls.navLinksContainers[1].parentElement.classList.contains("qrNavControls");
      if (areLinksInGrid && this.viewMode == "all") { //move the links out of the grid so they don't appear in the floating nav controls
        this.controls.navControls[1].insertAdjacentElement("beforeBegin", this.controls.navLinksContainers[1]);
      }
      else if (!areLinksInGrid && this.viewMode != "all") { //move the links back into the grid
        this.controls.navControls[1].insertAdjacentElement("beforeEnd", this.controls.navLinksContainers[1]);
      }
    }

/*    // sentinels for full thread view
    var topOfCurrent = 0;
    var bottomOfCurrent = 0;
    if (this.viewMode == "all") {
      if (this.currentUpdate() != this.firstUpdate()) {
        topOfCurrent = this.posts.get(this.currentUpdate().updatePostID).outer.offsetTop;
      }
      if (this.currentUpdate() != this.lastUpdate()) {
        bottomOfCurrent = this.posts.get(this.updates[this.currentUpdateIndex + 1].updatePostID).outer.offsetTop;
      }
      this.sentinelPreviousEl.style.height = `${topOfCurrent}px`; //end of previous is top of current;
      this.sentinelCurrentEl.style.height = `${bottomOfCurrent}px`; //end of current is the top of next
    }
    this.sentinelPreviousEl.classList.toggle("hidden", this.viewMode != "all" || topOfCurrent === 0);
    this.sentinelCurrentEl.classList.toggle("hidden", this.viewMode != "all" || bottomOfCurrent === 0);
*/
    // reply form juggling
    var isReplyFormAtTop = (this.controls.replymode == this.controls.postarea.previousElementSibling);
    if (this.replyFormLocation != "top" && isReplyFormAtTop) { //move it down
      this.controls.postarea.remove();
      this.doc.body.insertBefore(this.controls.postarea, this.controls.navbar);
      this.controls.controlsTop.previousElementSibling.insertAdjacentHTML("beforeBegin", "<hr>");
    }
    else if (this.replyFormLocation == "top" && !isReplyFormAtTop) { //move it up
      this.controls.postarea.remove();
      this.controls.replymode.insertAdjacentElement("afterEnd", this.controls.postarea);
      this.controls.controlsTop.previousElementSibling.previousElementSibling.remove(); //remove <hr>
    }
    this.controls.replyForm.classList.toggle("hidden" , !this.showReplyForm);
    this.controls.replyFormRestoreButton.classList.toggle("hidden", this.showReplyForm);

    if (this.viewMode == "all" && !this.scrollIntervalHandle) {
      this.scrollIntervalHandle = setInterval(() => { if (this.viewMode == "all" && Date.now() - this.lastScrollTime < 250) { this.handleScroll(); } }, 50);
    }
    else if (this.viewMode != "all" && this.scrollIntervalHandle) {
      clearInterval(this.scrollIntervalHandle);
      this.scrollIntervalHandle = null;
    }
  }

  updateSuggestersLabel(label, suggesters) {
    var anons = suggesters.filter(el => el.children.length === 0);
        var newAnons = anons.filter(el => el.isNew);
        label.textContent = `U:${suggesters.length}`;
        label.title =
`# of unique suggesters for the visible updates. Of these there are:
${suggesters.length - anons.length} named suggesters
${anons.length - newAnons.length} unnamed suggesters (familiar)
${newAnons.length} unnamed suggesters (new)`;
  }

  insertControls(doc) {
    //cache existing top-level html elements based their class name or id for faster access
    [...doc.body.children].forEach(child => {
      var name = child.classList[0] || child.id;
      if (name) {
        this.controls[name] = child;
      }
    });
    this.controls.navControls = [];
    //top controls
    var delform = this.posts.get(this.threadID).outer;
    var fragment = doc.createRange().createContextualFragment(this.getTopControlsHtml());
    this.controls.controlsTop = fragment.firstElementChild;
    this.controls.navControls.push(this.controls.controlsTop.querySelector(".qrNavControls"));
    delform.parentElement.insertBefore(fragment, delform);
    //bottom nav controls
    fragment = doc.createRange().createContextualFragment(`${this.getNavControlsHtml()}<hr>`);
    this.controls.navControls.push(fragment.firstElementChild);
    delform.insertBefore(fragment, delform.lastElementChild);
    //make reply form collapsable
    this.controls.postarea.insertAdjacentHTML("afterBegin", `<div class="hidden">[<a href="#" id="qrReplyFormRestoreButton">Reply</a>]</div>`);
    this.controls.replyFormRestoreButton = this.controls.postarea.firstElementChild;
    //reply form header
    this.controls.replyForm = doc.querySelector("#postform");
    this.controls.replyForm.querySelector(".postform").insertAdjacentHTML("afterBegin", this.getReplyFormHeaderHtml()); //note that we can't create a <thead> element in a fragment without table
    this.controls.replyFormMinimizeButton = this.controls.replyForm.querySelector("#qrReplyFormMinimizeButton");
    this.controls.replyFormPopoutButton = this.controls.replyForm.querySelector("#qrReplyFormPopoutButton");

    //when viewing full thread, we want to detect and remember where we are; something something IntersectionObserver
    /*doc.body.insertAdjacentHTML("afterBegin", `<div class="sentinel hidden"></div><div class="sentinel hidden"></div>`);
    this.sentinelPreviousEl = doc.body.firstChild;
    this.sentinelCurrentEl = doc.body.firstChild.nextSibling;
    this.sentinelPrevious = new IntersectionObserver((entries, observer) => { this.handleSentinel(entries, observer); }, { rootMargin: "2px" } ); //need to pass the callback like this to keep the context
    this.sentinelCurrent = new IntersectionObserver((entries, observer) => { this.handleSentinel(entries, observer); }, { rootMargin: "2px" } );
    this.sentinelPrevious.observe(this.sentinelPreviousEl);
    this.sentinelCurrent.observe(this.sentinelCurrentEl);*/

    //cache control elements for faster access
    var queries = [".qrNavLinksContainer", ".qrShowFirstButton", ".qrShowPrevButton", ".qrShowNextButton", ".qrShowLastButton", ".qrWikiLink", ".qrQuestLink", ".qrDisLink", ".qrThreadLinksDropdown",
                   ".qrNavPosition", ".qrCurrentPosLabel", ".qrTotalPosLabel", ".qrUpdateInfo", ".qrAuthorCommentsCountLabel", ".qrSuggestionsCountLabel", ".qrSuggestersCountLabel", ];
    queries.forEach((query) => {
      var controlGroupName = `${query[3].toLowerCase()}${query.substring(4)}s`;
      this.controls[controlGroupName] = [ this.controls.navControls[0].querySelector(query), this.controls.navControls[1].querySelector(query)];
    });
    this.controls.settingsControls = this.controls.controlsTop.querySelector(".qrSettingsControls");
    this.controls.controlsTop.querySelectorAll("[id]").forEach(el => {
      this.controls[`${el.id[2].toLowerCase()}${el.id.substring(3)}`] = el;
    });
    if (this.threadType !== ThreadType.QUEST) { //hide controls which aren't relevant in non-quest threads
      var controlsToHide = [...this.controls.showFirstButtons, ...this.controls.showPrevButtons, ...this.controls.showNextButtons, ...this.controls.showLastButtons, ...this.controls.navPositions];
      controlsToHide.forEach(el => el.classList.add("transparent"));
      var settingsToHide = [this.controls.viewModeLabel, this.controls.viewModeDropdown,
                            this.controls.showSuggestionsLabel, this.controls.showSuggestionsDropdown,
                            this.controls.showAuthorCommentsLabel, this.controls.showAuthorCommentsDropdown,
                            this.controls.showUpdateInfoLabel, this.controls.showUpdateInfoCheckbox,
                            this.controls.showUserMultiPostLabel, this.controls.showUserMultiPostCheckbox,
                            this.controls.keyboardShortcutsLabel, this.controls.keyboardShortcutsLabel.nextElementSibling];
      settingsToHide.forEach(el => el.classList.add("hidden"));
      this.controls.showReferencesDropdown.options[1].remove();
      this.controls.expandImagesDropdown.options[1].remove();
    }
    if (this.threadType === ThreadType.OTHER) {
      this.controls.wikiLinks.forEach(el => el.parentElement.classList.add("hidden"));
      this.controls.threadLinksDropdowns.forEach(el => el.classList.add("hidden"));
    }
  }

  /*handleSentinel(entries, observer) {
    console.log(entries[0]);
    var newUpdateIndex = this.currentUpdateIndex;
    if (observer == this.sentinelPrevious && entries[0].isIntersecting) {
      newUpdateIndex--;
    }
    else if (observer == this.sentinelCurrent && !entries[0].isIntersecting) {
      newUpdateIndex++;
    }
    if (newUpdateIndex != this.currentUpdateIndex && newUpdateIndex >= 0 && newUpdateIndex < this.updates.length) {
      this.currentUpdateIndex = newUpdateIndex;
      this.updateControls();
      this.settingsChanged();
    }
  }*/

  insertStyling(doc) {
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrMainCss">${this.getMainStyleRules(doc)}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrImageSizeCss">${this.getImageSizesStyleRules()}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrReferencesCss">${this.getReferencesStyleRules()}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrUserColorsCss">${this.getUserColorsStyleRules()}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrUserPostCountsCss">${this.getUserPostCountsStyleRules()}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrUserNavCss">${this.getUserNavStyleRules()}</style>`);
    doc.head.insertAdjacentHTML("beforeEnd", `<style id="qrUserMultiPostCss">${this.getUserMultiPostStyleRules()}</style>`);
  }

  insertEvents(doc) {
    //events for our controls
    this.controls.settingsToggleButton.addEventListener("click", e => this.toggleSettingsControls(e));
    this.controls.settingsPageNav.addEventListener("click", e => this.showSettingsPage(e));
    this.controls.viewModeDropdown.addEventListener("change", e => this.updateSettings(e));
    this.controls.showSuggestionsDropdown.addEventListener("change", e => this.updateSettings(e));
    this.controls.showAuthorCommentsDropdown.addEventListener("change", e => this.updateSettings(e));
    this.controls.replyFormLocationDropdown.addEventListener("change", e => this.updateSettings(e));
    this.controls.showReferencesDropdown.addEventListener("change", e => this.changePostElementSettings(e));
    this.controls.expandImagesDropdown.addEventListener("change", e => this.updateSettings(e));
    this.controls.maxImageWidthTextbox.addEventListener("change", e => this.changeImageSizeSettings(e));
    this.controls.maxImageHeightTextbox.addEventListener("change", e => this.changeImageSizeSettings(e));
    this.controls.stretchImagesCheckbox.addEventListener("click", e => this.changeImageSizeSettings(e));
    this.controls.showUpdateInfoCheckbox.addEventListener("click", e => this.updateSettings(e));
    this.controls.timestampFormatDropdown.addEventListener("change", e => this.changePostElementSettings(e));
    this.controls.colorUsersCheckbox.addEventListener("click", e => this.changePostElementSettings(e));
    this.controls.showUserPostCountsCheckbox.addEventListener("click", e => this.changePostElementSettings(e));
    this.controls.showUserNavCheckbox.addEventListener("click", e => this.changePostElementSettings(e));
    this.controls.showUserMultiPostCheckbox.addEventListener("click", e => this.changePostElementSettings(e));
    this.controls.replyFormMinimizeButton.addEventListener("click", e => this.toggleReplyForm(e));
    this.controls.replyFormRestoreButton.addEventListener("click", e => this.toggleReplyForm(e));
    this.controls.replyFormPopoutButton.addEventListener("click", e => this.popoutReplyForm(e));
    this.controls.showFirstButtons.forEach(el => el.addEventListener("click", e => this.showFirst(e)));
    this.controls.showPrevButtons.forEach(el => el.addEventListener("click", e => this.showPrevious(e)));
    this.controls.showNextButtons.forEach(el => el.addEventListener("click", e => this.showNext(e)));
    this.controls.showLastButtons.forEach(el => el.addEventListener("click", e => this.showLast(e)));
    this.controls.threadLinksDropdowns.forEach(el => el.addEventListener("change", e => this.changeThread(e)));

    //events for other controls
    this.controls.replyForm.querySelector(`input[type="submit"][value="Reply"]`).addEventListener("click", (e) => {
      var userName = this.controls.replyForm.querySelector(`input[name="name"]`).value.trim().toLowerCase();
      if(this.author.id === userName || this.author.children.some(child => child.id === userName)) {
        this.moveToLast = true;
        this.settingsChanged();
      }
    });

    //global events
    doc.defaultView.addEventListener("hashchange", (e) => { //if the #hash at the end of url changes, it means the user clicked a post link and we need to show him the update that contains that post
      var oldPostID = parseInt(new URL(e.oldURL).hash.replace("#", ""));
      var newPostID = parseInt(new URL(e.newURL).hash.replace("#", ""));
      if (!isNaN(oldPostID) && oldPostID !== this.threadID && this.posts.has(oldPostID)) {
        this.posts.get(oldPostID).inner.classList.remove("highlight");
        this.posts.get(oldPostID).inner.classList.add("reply");
      }
      if (!isNaN(newPostID) && newPostID !== this.threadID && this.posts.has(newPostID)) {
        this.posts.get(newPostID).inner.classList.add("highlight");
        this.refresh({checkHash: "true"});
      }
    });

    this.lastScrollTime = 0;
    doc.defaultView.addEventListener("wheel", (e) => { //after the wheeling has finished, check if the user
      this.lastScrollTime = Date.now();
    });

    doc.addEventListener("keydown", (e) => {
      if (this.threadType !== ThreadType.QUEST) {
        return;
      }
      var inputTypes = ["text", "password", "number", "email", "tel", "url", "search", "date", "datetime", "datetime-local", "time", "month", "week"];
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT" || (e.target.tagName === "INPUT" && inputTypes.indexOf(e.target.type) >= 0)) {
        return; //prevent our keyboard shortcuts when focused on a text input field
      }
      if (e.altKey || e.shiftKey || e.ctrlKey) { //alt+left arrow, or alt+right arrow, for the obvious reasons we don't want to handle those, or any other combination for that matter
        return;
      }
      if (e.key == "ArrowRight") {
        e.preventDefault();
        this.showNext();
      }
      else if (e.key == "ArrowLeft") {
        e.preventDefault();
        this.showPrevious();
      }
      var scrollKeys = ["ArrowUp", "ArrowDown", " ", "PageUp", "PageDown", "Home", "End"]; //it turns out that scrolling the page is possible with stuff other than mouse wheel
      if (scrollKeys.indexOf(e.key) >= 0) {
        this.lastScrollTime = Date.now();
      }
    });
    doc.addEventListener("click", (e) => {
      //clicking on a reflink in post header should show the Reply form and THEN insert text and focus it
      var node = e.target;
      if (node.nodeType === Node.TEXT_NODE) {
        return;
      }
      if (node.nodeName === "A") {
        if (node.parentElement.classList.contains("reflink") && node.parentElement.lastElementChild == node) {
          e.preventDefault();
          if (!this.showReplyForm) {
            this.controls.replyFormRestoreButton.click();
            if (this.replyFormLocation == "float" && !this.controls.replyForm.classList.contains("qrPopout")) {
              this.controls.replyFormPopoutButton.click();
            }
          }
          return doc.defaultView.insert(`>>${node.textContent}\n`);
        }
      }
      //clicking on the post timestamp in the post header should change the time format
      else if (node.nodeName == "LABEL" && node.parentElement.classList.contains("postwidth")) {
        var posterEl = node.querySelector(".postername");
        if (e.offsetX <= posterEl.offsetLeft + posterEl.offsetWidth) {
          return;
        }
        e.preventDefault();
        if (this.relativeTime === null ) {
          var post = this.posts.get(parseInt(node.parentElement.firstElementChild.name));
          var currentDateTime = new Date();
          this.relativeTime = this.timestampFormat == "auto" ? (currentDateTime.getTime() - this.getUtcTime(post, node.lastChild)) >= 86400000 : this.timestampFormat != "relative" && this.timestampFormat != "relativeUpd";
        }
        else {
          this.relativeTime = !this.relativeTime;
        }
        this.refresh({scroll: false});
        this.settingsChanged();
      }
    });
    //should also remove the unnecessary click events;
    this.posts.forEach(post => {
      post.header.querySelector(".reflink").lastElementChild.onclick = null;
    });
    //clicking on style links should rebuild our style
    this.controls.adminbar.querySelectorAll("a").forEach(el => {
      if (!el.title && !el.target) {
        el.addEventListener("click", (e) => {
          doc.head.querySelector("#qrMainCss").innerHTML = this.getMainStyleRules(doc);
        });
      }
    });
    //The site's highlight() function is slow and buggy. In fact, it should be bound to the hashchange event... actually a css pseudo selector :target should've been used for the effect
    //Of course, currently it won't work because the anchors with the IDs are inside headers instead of the elements themselves being anchors
    doc.defaultView.highlight = new Function();
    doc.defaultView.checkhighlight = () => {
      var hashedPostID = parseInt(doc.location.hash.replace("#", ""));
      if (!isNaN(hashedPostID) && hashedPostID != this.threadID && this.posts.has(hashedPostID)) {
        this.posts.get(hashedPostID).inner.classList.add("highlight");
      }
    }
    //similarily the addpreviewevents function is doing it wrong; we should insert only 2 events for the document and use the bubbling instead of inserting hundreds of events
    doc.defaultView.addpreviewevents = new Function();
    doc.addEventListener("mouseover", function(e) {
      if (e.target.nodeName === "A" && e.target.className.startsWith("ref|")) {
        e.view.addreflinkpreview(e);
      }
    });
    doc.addEventListener("mouseout", function(e) {
      if (e.target.nodeName === "A" && e.target.className.startsWith("ref|")) {
        e.view.delreflinkpreview(e);
      }
    });
  }

  handleScroll() {
    //check if the user scrolled to a different update on screen -> mark and save the position (only in whole thread view)
    var indexes = this.getVisibleUpdateIndexes();
    if (indexes == null) {
      return;
    }
    if (this.currentUpdateIndex != indexes[0]) {
      this.currentUpdateIndex = indexes[0];
      this.updateControls();
      this.settingsChanged();
    }
    var updatesToExpand = indexes.map(index => this.updates[index]);
    if (this.updates.length > indexes[indexes.length - 1] + 1) {
      updatesToExpand.push(this.updates[indexes[indexes.length - 1] + 1]);
    }
    updatesToExpand.forEach(update => this.expandUpdateImages(update));
  }

  getVisibleUpdateIndexes() {
    var currentUpdatePost = this.posts.get(this.currentUpdate().updatePostID);
    var currentUpdateIsAboveViewPort = !currentUpdatePost || currentUpdatePost.outer.offsetTop <= this.doc.defaultView.scrollY;
    var topmostVisibleUpdateIndex = this.currentUpdateIndex;
    var el;
    if (currentUpdateIsAboveViewPort) { //search down
      for (; topmostVisibleUpdateIndex < this.updates.length - 1; topmostVisibleUpdateIndex++) {
        el = this.posts.get(this.updates[topmostVisibleUpdateIndex + 1].updatePostID);
        if (!el) {
          continue;
        }
        if (el.outer.offsetTop > this.doc.defaultView.scrollY) {
          break;
        }
      }
    }
    else { //search up
      for (; topmostVisibleUpdateIndex > 0; topmostVisibleUpdateIndex--) {
        el = this.posts.get(this.updates[topmostVisibleUpdateIndex - 1].updatePostID);
        if (!el || el.outer.offsetTop < this.doc.defaultView.scrollY) {
          topmostVisibleUpdateIndex--;
          break;
        }
      }
    }
    var indexes = [ topmostVisibleUpdateIndex ];
    //var bottommostVisibleUpdateIndex = topmostVisibleUpdateIndex;
    var windowOffsetBottom = this.doc.defaultView.scrollY + this.doc.documentElement.clientHeight;
    for (; topmostVisibleUpdateIndex < this.updates.length - 1; topmostVisibleUpdateIndex++) {
      el = this.posts.get(this.updates[topmostVisibleUpdateIndex + 1].updatePostID);
      if (!el || el.outer.offsetTop > windowOffsetBottom) {
        break;
      }
      indexes.push(topmostVisibleUpdateIndex + 1);
    }
    return indexes;
  }

  modifyLayout(doc) {
    //change tab title to quest's title
    var op = this.posts.get(this.threadID);
    var label = op.header.querySelector("label");
    this.hasTitle = !!label.querySelector(".filetitle");
    var title = label.querySelector(".filetitle") || label.querySelector(".postername");
    title = title.textContent.trim();
    doc.title = title !== this.defaultName ? title : "Untitled Quest";
    this.controls.logo.textContent = doc.title;
    //extend vertical size to prevent screen jumping when navigating updates
    this.controls.controlsTop.insertAdjacentHTML("beforeBegin", `<div class="haveOneScreenOfSpaceBelowHereSoItIsPossibleToScroll" />`);
    //extend vertical size so it's possible to scroll to the last update in full thread view
    var lastUpdatePost = this.posts.get(this.lastUpdate().updatePostID);
    if (lastUpdatePost) {
      lastUpdatePost.outer.insertAdjacentHTML("afterBegin", `<div class="haveOneScreenOfSpaceBelowHereSoItIsPossibleToScroll" />`);
    }
    //prevent wrapping posts around the OP; setting clear:left on the 2nd post doesn't work because that element might be hidden
    op.inner.querySelector("blockquote").insertAdjacentHTML("afterEnd", `<div style="clear: left;"></div>`);
    //prevent wrapping text underneath update images by setting update post width to 100%
    this.updates.forEach(update => { //need to be careful to not set the OP (form) to 100% width because it would override BLICK's dumb width settings
      var updatePost = this.posts.get(update.updatePostID);
      if (updatePost) {
        updatePost.inner.classList.add(update === this.firstUpdate() ? "updateOp" : "update");
      }
    });
    //Fix OP header so that the image wraps underneath it, like the other posts
    while(op.header.firstChild.name != this.threadID) {
      op.header.appendChild(op.header.firstChild);
    }
    //hide "Expand all images" link; The link isn't always present
    var expandLink = op.inner.querySelector(`a[href="#top"]`);
    if (expandLink) {
      expandLink.classList.add("hidden");
    }
    //remove the "Report completed threads!" message from the top
    var message = (doc.body.querySelector("center") || doc.createElement("center")).querySelector(".filetitle");
    if (message) {
      message.classList.add("hidden");
    }
    var replyForm = this.controls.replyForm;
    //remove the (Reply to #) text since it's obvious that we're replying to the thread that we're viewing, plus other text in the line
    var replyToPostEl = replyForm.querySelector("#posttypeindicator");
    if (replyToPostEl) {
      [...replyToPostEl.parentElement.childNodes].filter(el => el && el.nodeType == HTMLElement.TEXT_NODE).forEach(el => el.remove());
      replyToPostEl.remove();
    }
    [...replyForm.querySelector(`input[name="name"]`).parentElement.childNodes].forEach(el => { if (el.nodeType == HTMLElement.TEXT_NODE) el.remove(); });
    [...replyForm.querySelector(`input[name="em"]`).parentElement.childNodes].forEach(el => { if (el.nodeType == HTMLElement.TEXT_NODE) el.remove(); });
    [...replyForm.querySelector(`input[name="subject"]`).parentElement.childNodes].forEach(el => { if (el.nodeType == HTMLElement.TEXT_NODE) el.remove(); });
    //move the upload file limitations info into a tooltip
    var filetd = replyForm.querySelector(`input[type="file"]`);
    var fileRulesEl = replyForm.querySelector("td.rules");
    fileRulesEl.classList.add("hidden");
    var fileRules = [...fileRulesEl.querySelectorAll("li")].splice(1, 2);
    fileRules = fileRules.map(el => el.textContent.replace(new RegExp("[ \n]+", "g"), " ").trim()).join("\n");
    filetd.insertAdjacentHTML("afterEnd", `&nbsp<span class="qrTooltip" title="${fileRules}">*</span>`);
    //move the password help line into a tooltip
    var postPasswordEl = replyForm.querySelector(`input[name="postpassword"]`);
    postPasswordEl.nextSibling.remove();
    postPasswordEl.insertAdjacentHTML("afterEnd", `&nbsp<span class="qrTooltip" title="Password for post and file deletion">?</span>`);
    //reply form input placeholders
    (replyForm.querySelector(`[name="name"]`) || {}).placeholder = `Name (leave empty for ${this.defaultName})`;
    (replyForm.querySelector(`[name="em"]`) || {}).placeholder = "Options";
    (replyForm.querySelector(`[name="em"]`) || {}).title = "sage | dice 1d6";
    (replyForm.querySelector(`[name="subject"]`) || {}).placeholder = "Subject";
    (replyForm.querySelector(`[name="message"]`) || {}).placeholder = "Message";
    var embed = replyForm.querySelector(`[name="embed"]`);
    if (embed) {
      embed.parentElement.parentElement.style.display = "none";
    }
    //remove that annoying red strip
    this.controls.replymode.classList.add("hidden");
  }

  insertTooltips() {
    var c = this.controls;
    c.settingsToggleButton.title = `Show/Hide Quest Reader settings`;
    c.settingsPageNav.children[0].title = `General settings`;
    c.settingsPageNav.children[1].title = `Image settings`;
    c.settingsPageNav.children[2].title = `Analytics settings`;
    c.viewModeLabel.title = `Control whether to view the thread as a comic (a set of pages) or not.
Whole thread: Show the thread at it originally is, with all the update posts visible
Paged per update: Turn the thread into pages, with a single update post per page
Paged per sequence: Turn the thread into pages, with a set of sequential update posts per page`;
    c.showSuggestionsLabel.title = `Show quest suggestions. Quest suggestions are non-author posts containing directions for the quest or its characters.`;
    c.showAuthorCommentsLabel.title = `Show author comments. Author comments are author posts which aren't updates.`;
    c.showReferencesLabel.title = `Show links to references underneath each post or not. (References are >>links pointing to the post)`;
    c.timestampFormatLabel.title = `Control the time and format of post timestamps.
Server time: Show when the post was made in server's timezone.
Local time: Show when the post was made in local timezone.
Relative to now: Show how much time has passed since the post was made to right now.
Auto: Show relative time if the post was made less than a day ago, otherwise show local time.
Hidden: Hide post timestamps.`;
    c.replyFormLocationLabel.title = `Control the location and the way in which the Reply form is shown.
At top: The Reply form is located at the top of the page
At bottom: The Reply form is located at the bottom of the page
Auto-float: Show a floating Reply form when clicking on any of the post ID links, or the "Reply" link at the bottom`;
    c.expandImagesLabel.title = `Automatically expand images only when they appear on screen`;
    c.stretchImagesLabel.title = `Allow expanding the images beyond their intrinsic resolution to fit an image container.
The size of the image container is defined by the "Image container width" and "Image container height" settings.`;
    c.showUpdateInfoLabel.title = `Show some info about the update next to the navigation controls.
The info contains three numbers: The amount of [A]uthor comments, the amount of [S]uggestions, and the amount of [U]nique suggesters for the update.`;
    c.colorUsersLabel.title = `Colorize the poster ID of every suggestion post`;
    c.showUserPostCountsLabel.title = `Show user's post count to the right of every poster ID; if the number is red, it means the user only made posts within one update.`;
    c.showUserNavLabel.title = `Show buttons to the right of every user ID which allow navigating to the user's previous and next post`;
    c.showUserMultiPostLabel.title = `Show a red indication next to posts where the suggester has made more than one suggestion for the update`;
    c.authorCommentsCountLabels.forEach(el => { el.title = `# of author comment posts for the visible updates`; });
    c.suggestionsCountLabels.forEach(el => { el.title = `# of suggestion posts for the visible updates`; });
    c.suggestersCountLabels.forEach(el => { el.title = `# of unique suggesters for the visible updates`; });
    c.wikiLinks.forEach(el => { el.title = `Link to the quest's wiki page`; });
    c.disLinks.forEach(el => { el.title = `Link to the quest's latest discussion thread`; });
    c.questLinks.forEach(el => { el.title = `Link to the quest's last visited or last created quest thread`; });
    c.threadLinksDropdowns.forEach(el => { el.title = `Current quest thread`; });
    c.replyFormMinimizeButton.title = `Hide the Reply form`;
    c.replyFormPopoutButton.title = `Pop out the Reply form and have it float`;
  }

  getTopControlsHtml() {
    return `
<div class="qrControlsTop">
  <div class="qrSettingsToggle">[<a href="#" id="qrSettingsToggleButton">Settings</a>]</div>
  ${this.getNavControlsHtml()}
  ${this.getSettingsControlsHtml()}
  <hr>
</div>`;
  }

  getSettingsControlsHtml() {
    return `
<div class="qrSettingsControls collapsedHeight">
  <span id="qrSettingsPageNav">
    <div class="qrSettingsNavItem qrSettingsNavItemSelected">[<a href="#">General</a>]</div>
    <div class="qrSettingsNavItem">[<a href="#">Images</a>]</div>
    <div class="qrSettingsNavItem">[<a href="#">Analytics</a>]</div>
  </span>
  <div class="qrSettingsPages">
    <div class="qrSettingsPage qrCurrentPage">
      <div id="qrViewModeLabel">Viewing mode</div>
      <select id="qrViewModeDropdown" class="qrSettingsControl"><option value="all">Whole thread</option><option value="single">Paged per update</option><option value="sequence">Paged per sequence</option></select>
      <div id="qrShowReferencesLabel">Show post references</div>
      <select id="qrShowReferencesDropdown" class="qrSettingsControl"><option value="none">Never</option><option value="nonupdates">For non-update posts</option><option value="all">For all</option></select>
      <div id="qrShowSuggestionsLabel">Show suggestions</div>
      <select id="qrShowSuggestionsDropdown" class="qrSettingsControl"><option value="none">Never</option><option value="last">Last update only</option><option value="all">Always</option></select>
      <div id="qrTimestampFormatLabel">Timestamp format</div>
      <select id="qrTimestampFormatDropdown" class="qrSettingsControl">
        <option value="server">Server time</option>
        <option value="local">Local time</option>
        <option value="relative">Relative to now</option>
        <option value="auto">Auto</option>
        <option value="hide">Hidden</option>
      </select>
      <div id="qrShowAuthorCommentsLabel">Show author comments</div>
      <select id="qrShowAuthorCommentsDropdown" class="qrSettingsControl"><option value="none">Never</option><option value="last">Last update only</option><option value="all">Always</option></select>
      <div id="qrReplyFormLocationLabel">Reply form</div>
      <select id="qrReplyFormLocationDropdown" class="qrSettingsControl"><option value="top">At top</option><option value="bottom">At bottom</option><option value="float">Auto-float</option></select>
      <div id="qrKeyboardShortcutsLabel">Keyboard shortcuts</div>
      <div class="qrSettingsControl qrTooltip">?<span class="qrTooltiptext">Left and Right arrow keys will <br>navigate between updates</span></div>
    </div>
    <div class="qrSettingsPage">
      <div id="qrExpandImagesLabel">Expand images</div>
      <select id="qrExpandImagesDropdown" class="qrSettingsControl"><option value="none">Do not</option><option value="updates">For updates</option><option value="all">For all</option></select>
      <div id="qrImageWidthLabel">Max image width</div>
      <div><input type="number" id="qrMaxImageWidthTextbox" class="qrSettingsControl" min=0 max=100 value=100> %</div>
      <div id="qrStretchImagesLabel">Force fit images</div>
      <input type="checkbox" id="qrStretchImagesCheckbox" class="qrSettingsControl">
      <div id="qrImageHeightLabel">Max image height</div>
      <div><input type="number" id="qrMaxImageHeightTextbox" class="qrSettingsControl" min=0 max=100 value=100> %</div>
    </div>
    <div class="qrSettingsPage">
      <div id="qrShowUpdateInfoLabel">Show update info</div>
      <input id="qrShowUpdateInfoCheckbox" type="checkbox" class="qrSettingsControl">
      <div></div>
      <div></div>
      <div id="qrColorUsersLabel">Color ${this.threadType == ThreadType.QUEST ? "suggester" : "user"} IDs</div>
      <input id="qrColorUsersCheckbox" type="checkbox" class="qrSettingsControl">
      <div id="qrShowUserPostCountsLabel">Show user post counts</div>
      <input id="qrShowUserPostCountsCheckbox" type="checkbox" class="qrSettingsControl">
      <div id="qrShowUserNavLabel">Show per-user nav</div>
      <input id="qrShowUserNavCheckbox" type="checkbox" class="qrSettingsControl">
      <div id="qrShowUserMultiPostLabel">Show multi-posts</div>
      <input id="qrShowUserMultiPostCheckbox" type="checkbox" class="qrSettingsControl">
    </div>
  </div>
</div>`;
  }

  getNavControlsHtml() {
    return `
<div class="qrNavControls">
  <span></span>
  <span class="qrNavControl"><button class="qrShowFirstButton" type="button">First</button></span>
  <span class="qrNavControl"><button class="qrShowPrevButton" type="button">Prev</button></span>
  <span class="qrNavPosition qrOutline" title="Index of the currently shown update slash the total number of updates">
    <label class="qrCurrentPosLabel">0</label> / <label class="qrTotalPosLabel">0</label>
  </span>
  <span class="qrNavControl"><button class="qrShowNextButton" type="button">Next</button></span>
  <span class="qrNavControl"><button class="qrShowLastButton" type="button">Last</button></span>
  <span>
    <span class="qrUpdateInfo qrOutline">
      <label class="qrAuthorCommentsCountLabel">A: 0</label>
      <label class="qrSuggestionsCountLabel">S: 0</label>
      <label class="qrSuggestersCountLabel">U: 0</label>
    </span>
  </span>
  <span class="qrNavLinksContainer">${this.getLinksHtml()}</span>
</div>`;
  }

  getLinksHtml() {
    return `
<span>[<a class="qrWikiLink" style="color: inherit">Wiki</a>]</span>
<span class="hidden">[<a class="qrQuestLink">Quest</a>]</span>
<span class="hidden">[<a class="qrDisLink">Discuss</a>]</span>
<span class="qrThreadsLinks">
  <select class="qrThreadLinksDropdown">
    <option value="thread1">Thread not found in wiki</option>
  </select>
</span>`;
  }

  getReplyFormHeaderHtml() {
     return `
<thead id="qrReplyFormHeader">
  <tr>
    <th class="postblock">Reply form</th>
    <th class="qrReplyFormButtons">
      <span><a id="qrReplyFormPopoutButton" href="#"><svg
        xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs">
          <g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g>
        </svg></a>
      </span>
      <span><a id="qrReplyFormMinimizeButton" href="#"><svg
        xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs">
          <line x1="5" y1="19" x2="19" y2="5"></line><line x1="5" y1="5" x2="19" y2="19"></line>
        </svg></a>
      </span>
    </th>
  </tr>
</thead>`;
  }

  getMainStyleRules(doc) {
    /*var currentSheetRules = doc.head.querySelector(`link[rel*="stylesheet"][title]:not([disabled])`).sheet.cssRules;
    var bodyStyle = [...currentSheetRules].find(rule => rule.selectorText == "html, body");
    var bgc = bodyStyle.style.backgroundColor;
    var fgc = bodyStyle.style.color;*/
    var bgc = doc.defaultView.getComputedStyle(doc.body)["background-color"]; //this is needed for compatibility with BLICK
    var fgc = doc.defaultView.getComputedStyle(doc.body).color;
    return `
.hidden { display: none; }
.veryhidden { display: none !important; }
.transparent { opacity: 0; }
.qrShowFirstButton, .qrShowLastButton { width: 50px; }
.qrShowPrevButton, .qrShowNextButton { width: 100px; }
.qrSettingsToggle { position: absolute; left: 8px; padding-top: 2px; }
.qrControlsTop { }
.qrNavControls { display: grid; grid-template-columns: 1fr auto auto auto auto auto auto 1fr; grid-gap: 3px; color: ${fgc}; pointer-events: none; }
.qrNavControls > * { margin: auto 0px; pointer-events: all; }
.qrOutline { text-shadow: 2px 2px 2px ${bgc}, 2px 0px 2px ${bgc}, 2px -2px 2px ${bgc}, 0px -2px 2px ${bgc}, -2px -2px 2px ${bgc}, -2px 0px 2px ${bgc}, -2px 2px 2px ${bgc}, 0px 2px 2px ${bgc}, 0px 0px 2px ${bgc}; }
.qrNavLinksContainer { white-space: nowrap; text-align: right; color: ${fgc}; }
.qrNavLinksBottom { float: right; clear: both; }
.qrNavPosition { font-weight: bold; white-space: nowrap; }
.qrLastIndex { color: crimson; }
.qrUpdateInfo { white-space: nowrap; }
.qrSettingsControls { height: 100px;  overflow: hidden; transition: all 0.3s; display: grid; grid-template-columns: auto 1fr; }
#qrSettingsPageNav { display: inline-flex; flex-direction: column; justify-content: space-evenly; }
.qrSettingsNavItemSelected > a { color: inherit; text-decoration: none; }
.qrSettingsNavItemSelected::before { content: ">"; }
.qrSettingsNavItemSelected::after { content: "<"; }
.qrSettingsPages { position: relative; margin-top: 8px; }
.qrSettingsPage { display: grid; grid-template-columns: 1fr auto auto 1fr auto auto 1fr; grid-gap: 2px 4px; justify-items: start; align-items: center; align-content: center;
                  white-space: nowrap; transition: all 0.3s; opacity: 0; position: absolute; left: 0; right: 0; top: 0; pointer-events: none; }
.qrCurrentPage { opacity: 1; z-index: 1; pointer-events: initial; }
.qrSettingsPage > :nth-child(4n+1) { grid-column-start: 2; cursor: default; }
.qrSettingsPage > :nth-child(4n+3) { grid-column-start: 5; cursor: default; }
.qrSettingsControl { margin: 0px; }
select.qrSettingsControl { width: 150px; height: 22px; }
input.qrSettingsControl[type="number"] { width: 40px; }
.qrThreadLinksDropdown { max-width: 100px; }
.collapsedHeight { height: 0px; }
.qrTooltip { position: relative; border-bottom: 1px dotted; cursor: pointer; }
.qrTooltip:hover .qrTooltiptext { visibility: visible; }
.qrTooltip .qrTooltiptext { visibility: hidden; width: max-content; padding: 4px 4px 4px 10px; left: 15px; top: -35px;
position: absolute; border: dotted 1px; z-index: 1; background-color: ${bgc}; }
.haveOneScreenOfSpaceBelowHereSoItIsPossibleToScroll { position:absolute; height: 100vh; width: 1px; }
#qrReplyFormHeader { text-align: center; }
.postform td:first-child { display: none; }
.qrReplyFormButtons { position: absolute; right: 0px; }
.qrReplyFormButtons svg { width: 17px; vertical-align: bottom; }
.qrPopout { position: fixed; opacity: 0.2 !important; transition: opacity 0.3s; background-color: ${bgc}; border: 1px solid rgba(0, 0, 0, 0.10) !important; }
.qrPopout:hover { opacity: 1 !important; }
.qrPopout:focus-within { opacity: 1 !important; }
.qrPopout #qrReplyFormHeader { cursor: move; }
.qrReferences { margin: 0.5em 4px 0px 4px; }
.qrReferences::before { content: "Replies:"; font-size: 0.75em; }
.qrReference { font-size: 0.75em; margin-left: 4px; text-decoration: none; }
.stickyBottom { position: sticky; bottom: 0px; padding: 3px 0px; clear: both; }
.uid[postcount]::after { content: " (" attr(postcount) ")"; }
.isNew::after { color: crimson; }
.qrUserNavDisabled { color: grey; pointer-events: none; }
.qrUserNavEnabled { color: inherit; }
.qrNavIcon { width: 14px; height: 17px; stroke-width: 2px; fill: none; stroke: currentColor; vertical-align: text-bottom; padding-left: 2px; }
.qrNavIcon:hover { stroke-width: 3px; }
.qrUserMultiPost { color: crimson; white-space: nowrap; }
.update { width: 100%; }

.postwidth > label { cursor: pointer; }
.postwidth > label > * { cursor: default; }
.userdelete { position: relative; }
.userdelete tbody { position: absolute; right: 0px; top: -3px; text-align: right; }
body { position: relative; ${this.viewMode !== "all" ? "overflow-anchor: none" : ""} }
thead span > a { color: inherit; } /* Specificity hack to override the color of the reply form header links, but not overried the hover color */
#watchedthreadlist { display: grid; grid-template-columns: auto auto 3fr auto 1fr auto auto 0px; color: transparent; }
#watchedthreadlist > a[href$=".html"] { grid-column-start: 1; }
#watchedthreadlist > a[href*="html#"] { max-width: 40px; }
#watchedthreadlist > * { margin: auto 0px; }
#watchedthreadlist > span { overflow: hidden; white-space: nowrap; }
#watchedthreadlist > .postername { grid-column-start: 5; }
div#watchedthreadsbuttons { top: 0px; right: 0px; left: unset; bottom: unset; }
.reflinkpreview { z-index: 1; }
blockquote { margin-right: 1em; clear: unset; }
#spoiler { vertical-align: text-top; }
.postform { position: relative; border-spacing: 0px; }
.postform :optional { box-sizing: border-box; }
.postform input[name="name"], .postform input[name="em"], .postform input[name="subject"] { width: 100% !important; }
.postform input[name="message"] { margin: 0px }
.postform input[type="submit"] { position: absolute; right: 1px; bottom: 3px; }
.postform [name="imagefile"] { width: 220px; }
.postform td:first-child { display: none; }
.postform tr:nth-child(3) td:last-child { display: grid; grid-template-columns: 1fr auto; }
#BLICKpreviewbut { margin-right: 57px; }`;
/*
Rotating highlight border
.highlight { border: unset;
  background-image: linear-gradient(90deg, currentColor 50%, transparent 50%), linear-gradient(90deg, currentColor 50%, transparent 50%),
  linear-gradient(0deg, currentColor 50%, transparent 50%), linear-gradient(0deg, currentColor 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y; background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px; background-position: left top, right bottom, left bottom, right top; animation: rotating-border 1s infinite linear;
}
@keyframes rotating-border {
  0% { background-position: left top, right bottom, left bottom, right top; }
  100% { background-position: left 15px top, right 15px bottom , left bottom 15px , right   top 15px; }
}
.logo { clear: unset; }
blockquote { clear: unset; }
.sentinel { position: absolute; left: 0px; top: 0px; width: 400px; pointer-events: none; background-color:white; opacity: 0.3; }
*/
  }

  getImageSizesStyleRules() {
    var rules;
    if (this.stretchImages) {
      rules = `width: calc(${this.maxImageWidth}% - 40px); height: unset; max-height: calc(${this.maxImageHeight}vh - 50px); object-fit: contain;`;
    }
    else {
      rules = `width: unset; height: unset; max-width: calc(${this.maxImageWidth}% - 40px); max-height: calc(${this.maxImageHeight}vh - 40px);`;
    }
    return `.thumb[src*="svg+xml"], .thumb[src*="/src/"] { background-size: contain; background-position: center; background-repeat: no-repeat; ${rules} }`;
  }

  getReferencesStyleRules() {
    //none => hide all; nonupdates => hide for updates; all => don't hide anything
    if (this.showReferences == "all") {
      return ``;
    }
    var selector = this.showReferences == "nonupdates" ? ".update > .qrReferences, .updateOp > .qrReferences" : ".qrReferences";
    return `${selector} { display: none; }`;
  }

  getUserPostCountsStyleRules() {
    return this.showUserPostCounts ? "" : `.uid::after { display: none; }`;
  }

  getUserNavStyleRules() {
    return this.showUserNav ? "" : `.qrUserNavDisabled { display: none; } .qrUserNavEnabled { display: none; }`;
  }

  getUserMultiPostStyleRules() {
    return this.showUserMultiPost ? "" : `.qrUserMultiPost { display: none; }`;
  }

  getUserColorsStyleRules() {
    if (!this.colorUsers) {
      return "";
    }
    var colors = [];
    [this.author, ...this.suggesters].forEach(user => {
      var canonID = this.getCanonID(user);
      colors.push(`.uid${canonID} { ${this.getColors(canonID)} }`);
    });
    return `.qrColoredUid { border-style: solid; padding: 0 5px; border-radius: 6px; border-width: 0px 6px; background-clip: padding-box; }
${colors.join("\n")}`;
  }

  getCanonID(user) {
    if (this.reCanonID.test(user.id)) {
      return user.id;
    }
    for (let i = 0; i < user.children.length; i++) {
      if (this.reCanonID.test(user.children[i].id)) {
        return user.children[i].id;
      }
    }
    var id = ""; //generate canonID from any string;
    for (let i = 0; id.length < 6; i = ++i % user.id.length) {
      id += user.id.charCodeAt(i).toString(16);
    }
    return id.substring(0, 6);
  }

  getColors(id) {
    id = parseInt(id, 16);
    var hue = ((id & 0xFF) * 390) / 255;
    var saturation = hue <= 360 ? 1 : 0; // 1/12 of the IDs will be grayscale, altho gravitate away from grey
    var lightness1 = ((id >> 8) & 0xFF) / 255;
    var lightness2 = (((id >> 16) & 0xFF) / 255) * 0.75 + 0.125; //between 12.5% and 87.5%
    var textColor = lightness1 > 0.5 ? "black" : "white";
    if (saturation === 1) {
      lightness1 = lightness1 * 0.5 + 0.25; //between 25% and 75%
      //convert to rgb and then to rec601 luma to be able to calculate whether the text should be black or white
      var a = saturation * Math.min(lightness1, 1 - lightness1);
      var rgbFunc = (n, k = (n + hue / 30) % 12) => lightness1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      textColor = rgbFunc(0) * 0.299 + rgbFunc(8) * 0.587 + rgbFunc(4) * 0.114 > 0.5 ? "black" : "white";
    }
    else { //do basic math; if it's light, make it lighter, if it's dark, make it darker
      lightness1 = lightness1 >= 0.5 ? (Math.pow((lightness1 - 0.5) * 2, 1/2)) / 2 + 0.5 : Math.pow(lightness1 * 2, 2) / 2;
    }
    return `background-color: hsl(${hue}, ${saturation * 100}%, ${lightness1 * 100}%); color: ${textColor}; border-color: hsl(${hue}, ${saturation * 100}%, ${lightness2 * 100}%);`;
  }
}

var main = async () => {
  //first, let's undo some of the damage that prototype.js did by restoring native functions
  restoreNative(document);
  if (fullDocument !== document) {
    let doc = document.implementation.createHTMLDocument();
    doc.documentElement.innerHTML = (await fullDocument).response;
    fullDocument = doc;
  }
  setTimeout(() => {
    var timeStart = Date.now();
    try {
      if (!document.head.querySelector("#qrMainCss")) { //sanity check; don't run the script if it already ran; happens sometimes in Firefox on refresh?
        var qr = new QuestReader(document);
        document.defaultView.QR = qr;
        qr.onSettingsLoad = (e) => {
          var settingsKeys = {};
          settingsKeys[ThreadType.QUEST] = `qrSettings${e.threadID}`;
          settingsKeys[ThreadType.DISCUSSION] = `qrSettingsDis${e.threadID}`;
          settingsKeys[ThreadType.OTHER] = `qrSettingsBoardThread.${e.boardName}`;
          // get settings from localStorage
          e.settings = document.defaultView.localStorage.getItem(settingsKeys[e.threadType]);
          if (!e.settings) {
            var lastThreadKeys = {};
            lastThreadKeys[ThreadType.QUEST] = `qrLastThreadID`;
            lastThreadKeys[ThreadType.DISCUSSION] = `qrLastDisThreadID`;
            var lastThreadID = document.defaultView.localStorage.getItem(lastThreadKeys[e.threadType]);
            if (lastThreadID) {
              settingsKeys[ThreadType.QUEST] = `qrSettings${lastThreadID}`;
              settingsKeys[ThreadType.DISCUSSION] = `qrSettingsDis${lastThreadID}`;
              e.settings = document.defaultView.localStorage.getItem(settingsKeys[e.threadType]);
              if (e.settings) {
                e.settings = JSON.parse(e.settings);
                delete e.settings.currentUpdateIndex;
                delete e.settings.wikiPages;
              }
            }
          }
          else {
            e.settings = JSON.parse(e.settings);
          }
        };
        qr.onSettingsChanged = (e) => { //on settings changed, save settings to localStorage
          var settingsKeys = {};
          settingsKeys[ThreadType.QUEST] = `qrSettings${e.threadID}`;
          settingsKeys[ThreadType.DISCUSSION] = `qrSettingsDis${e.threadID}`;
          settingsKeys[ThreadType.OTHER] = `qrSettingsBoardThread.${e.boardName}`;
          if (e.threadType !== ThreadType.OTHER) {
            var lastThreadKeys = {};
            lastThreadKeys[ThreadType.QUEST] = `qrLastThreadID`;
            lastThreadKeys[ThreadType.DISCUSSION] = `qrLastDisThreadID`;
            //if there is no data on the last thread, or if the current thread has no settings (newly visited quest), update last visited thread ID
            if (!lastThreadKeys[e.threadType] || !document.defaultView.localStorage.getItem(settingsKeys[e.threadType])) {
              document.defaultView.localStorage.setItem(lastThreadKeys[e.threadType], e.threadID);
            }
          }
          //save settings
          document.defaultView.localStorage.setItem(settingsKeys[e.threadType], JSON.stringify(e.settings));
        };
        qr.onWikiDataLoad = (e) => { //before retrieving quest wiki, check localStorage for cached data and pass it to the class if it exists
          e.wikiData = JSON.parse(document.defaultView.localStorage.getItem(`qrWikiData.${e.wikiPageName}`));
        }
        qr.onWikiDataChanged = (e) => { //after quest wiki is retrieved, cache the data in localStorage
          if (e.wikiData) {
            document.defaultView.localStorage.setItem(`qrWikiData.${e.wikiPageName}`, JSON.stringify(e.wikiData));
          }
        }
        qr.init(fullDocument);
      }
    }
    finally {
      var hideUntilLoaded = document.querySelector("#hideUntilLoaded");
      if (hideUntilLoaded) {
        hideUntilLoaded.remove();
      }
    }
    console.log(`Quest Reader run time = ${Date.now() - timeStart}ms`);
  });
}

// START is here
var path = document.defaultView.location.pathname;
var pathMatch = path.match(new RegExp("/kusaba/([a-z]*)/res/"));
if (!pathMatch || BoardThreadTypes[pathMatch[1]] === undefined) {
  return; //don't run the script when viewing non-board URLs
}
var partial = path.endsWith("+50.html") || path.endsWith("+100.html");
var fullDocument = !partial ? document : Xhr.get(path.replace(new RegExp("\\+(50|100)\\.html$"), ".html"));
if (document.readyState == "loading") {
  //speed up loading by hiding the whole document until the extension is done processing the page; this prevents reflows and unnecessary rendering of stuff that we may change or hide
  var styleHtml = `<style id="hideUntilLoaded">body { display: none; }</style>`;
  var el = document.head || document.documentElement;
  if (el) {
    el.insertAdjacentHTML("beforeEnd", styleHtml);
  }
  else { //Chrome: It's possible the script gets executed even before the HTML element is added to the document, so we need to wait until it gets added and THEN hide the document
    new MutationObserver((mutations, observer) => { mutations.forEach(mutation => { (mutation.addedNodes || []).forEach(addedNode => {
      if (addedNode.tagName === "HTML") {
        addedNode.insertAdjacentHTML("beforeEnd", styleHtml);
        observer.disconnect();
      }
    }); }); }).observe(document, { attributes: false, childList: true, subtree: false });
  }
  document.addEventListener("DOMContentLoaded", main, { once: true }); //when parsing the HTML document is done, run the extension
}
else {
  main();
}
