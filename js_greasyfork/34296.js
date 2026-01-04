// ==UserScript==
// @name        NeoBoards Improved
// @namespace   NeoBoardsImproved
// @description Modernises the NeoBoards
// @include     *://www.neopets.com/neoboards/*
// @version     1.1
// @grant       none
// @require     https://greasyfork.org/scripts/34286-grant-none-shim/code/grant%20none%20shim.js?version=224672
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34296/NeoBoards%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/34296/NeoBoards%20Improved.meta.js
// ==/UserScript==

var originalPageTitle = "";
var isActive = false;
window.onfocus = function () {
  isActive = true;
}
window.onblur = function () {
  isActive = false;
}

// array of arrays
// each topic array contains
// topicID | hasReplied | previousPostCount
var visitedTopics;
var username;
var currentTopicID = -1;
var topicName = "";
var boardName = "";
var boardID = -1;
var autoPosting = false;

$(document).ready(function() {  
  //alert("-1");
  //GM_setValue("visitedTopics", "hello2");
  //GM_setValue("visitedTopics", "");
  //alert(GM_getValue("visitedTopics"));
  //GM_setValue('test', 'hello');
  //alert(GM_getValue('test'));
  //alert(GM_listValues());
  
  if (GM_getValue("awaitingPostSuccess") == "true") {
    //alert("awaiting post success..");
    if ($('.topicAuthor').length) {
      // post was successful
      //alert("posted successfully!");
      GM_setValue("currentPost", "");
      GM_setValue("lastPostTime", $.now());
    } else {
      //alert("post failed!");
    }
    GM_setValue("awaitingPostSuccess", "false");
  }
  
  // load all the visited topics from the saved local data
  getVisitedTopicsData();
  //visitedTopics.push(["15857177",1,9,"Here's a topic title","Newbies","4"]);
  //saveVisitedTopicsData();
  
  
  // get logged in username
  username = $('#header .user a[href^="/userlookup.phtml"]').text().trim();
  //alert(username);
  
  // if we're on the neoboards, we'll set a custom page title
  if (window.location.href.includes("/neoboards/boardlist.phtml")) {
    //alert("board list");
    boardName = $('.content > strong > a[href*=\'boardlist.phtml?board=\']').text().trim();
    //$(document).find("title").text('Board: ' + boardName);
    
    $(document).find("title").text(boardName + ' - NeoBoards');
    
    // do some stuff with the topic listings
    formatTopicListings();
    
  }
  
  // topic-page-specific functionality
  if (window.location.href.includes("/neoboards/topic.phtml")) {
    //alert("0");
    //setInterval(savePost, 2500);
    //alert("topic list");
    //alert($('.content > strong > a[href*=\'boardlist.phtml?board=\']', $.parseHTML(data)).text().trim());
    //$(document).find("title").text('NeoBoards - ' + $('.content > strong > a[href*=\'boardlist.phtml?board=\']').text().trim());
    //alert('topic: ' + $('.content').clone().children().remove().end().text().trim());
    
    var validTopic = false;
    //alert("1");
    if ($('.content > b> a[href*=\'boardlist.phtml?board=\']').length) {
      //alert("2");
      validTopic = true;
      topicName = $('.content:last-of-type').clone().children().remove().end().text().trim();
      boardName = $('.content > b > a[href*=\'boardlist.phtml?board=\']').text().trim();
      boardID = $('.content > b> a[href*=\'boardlist.phtml?board=\']').attr("href").split("board=")[1];
      //alert("boardID: " + boardID);
      //alert("boardName: " + boardName);
    }
    
    //alert(boardName);
    //$(document).find("title").text('Topic: ' + topicName);
    
    // gimme some credit
    /*var topicAuthors = document.getElementsByClassName('topicAuthor');
    for (var i = 0; i < topicAuthors.length; i++) {
      if ($('a[href^="/userlookup.phtml"]', topicAuthors[i]).text() == "leighwest") {
        $('table > tbody > tr:first-of-type > td:nth-of-type(2) > i', topicAuthors[i]).text("Neoboard Pro guy");
      }
    }*/
    //alert("current post: " + GM_getValue("currentPost"));
    // get current topic's ID
    var urlParams = location.search.substring(1).split("&");
    for (var i = 0; i < urlParams.length; i++) {
      if (urlParams[i].includes("topic=")) {
        //alert("our topic ID is in here: " + urlParams[i].substring(6))
        currentTopicID = urlParams[i].substring(6);
        break;
      }
    }
    
    if (validTopic == false) {
      //alert("3");
      //$(document).find("title").text("Board gone");
      //alert("currentTopicID: " + currentTopicID);
      formatDeletedPage();
      return;
    }
    
    $(document).find("title").text("'" + topicName + "' - " + boardName + ' - NeoBoards');
    //alert("hi");
    //alert(currentTopicID);
    //alert("boardName: " + boardName);
    addVisitedTopic();
    seeIfWeveReplied();
    seeIfWereOnTheLastPage();
    //saveTopicData();
    //alert("boo");
    var replyForm = $('form[action="process_topic.phtml"]');
    // do some stuff with message reply box
    var replyBox = $('form[action="process_topic.phtml"] textarea');
    var hiddenReplyBox = $("<textarea hidden='hidden' id='hiddenReplyBox'></textarea>").insertAfter('form[action="process_topic.phtml"] textarea');
    // disable default 'post your reply' function
    var replyButton = $('form[action="process_topic.phtml"] input[value="Post Your Reply"]');
    $(replyButton).after("<br><span id='autoPostStatus'></span>");
    replyBox.val(GM_getValue("currentPost"));
    //replyBox.after(GM_getValue("lastPostTime"));
    replyButton.click(function(event) {
      event.preventDefault();
      var lastPostTime = parseInt(GM_getValue("lastPostTime"));
      if (lastPostTime > $.now() - 30000) {
        //alert("Can't post yet! " + Math.round((((lastPostTime + 30000) - $.now()) / 1000)) + " seconds to go..");
        autoPosting = true;
        setInterval(autoPost, 1000);
      } else if (replyBox.val().trim() == "") {
        alert("Your post is empty! Saved post cleared.");
        GM_setValue("currentPost", "");
      } else {
        post();
      }
    });
  }
  // end of custom page title
  originalPageTitle = $(document).find("title").text();
});

function post() {
  var replyBox = $('form[action="process_topic.phtml"] textarea');
  var replyForm = $('form[action="process_topic.phtml"]');
  var hiddenReplyBox = $('#hiddenReplyBox');
  
  replyBox.removeAttr("name");
  hiddenReplyBox.attr("name", "message");
  hiddenReplyBox.val(formatReply(replyBox.val()));
  //alert(hiddenReplyBox.val());
  GM_setValue("currentPost", replyBox.val());
  GM_setValue("awaitingPostSuccess", "true");
  replyForm.submit();
}

function autoPost() {
  if (autoPosting == true) {
    var lastPostTime = parseInt(GM_getValue("lastPostTime"));
    if ($.now() > lastPostTime + 30000) {
      autoPosting = false;
      post();
    } else {
      $('#autoPostStatus').text("Auto-posting in " + parseInt(((lastPostTime + 30000 - $.now()) / 1000)) + " seconds..");
    }
  }
}

function formatDeletedPage() {
  //alert("r u actually doing anything");
  //alert("currentTopicID: " + currentTopicID);
  //alert("currentTopicID: " + getTopicIndexInArray(currentTopicID));
  //alert("some data: " + visitedTopics[visitedTopics.length - 1]);
  $(document).find("title").text("Board gone");
  var topicIndex = getTopicIndexInArray(currentTopicID);
  if (topicIndex >= 0) {
    //alert("we got a page for dat");
    var targetElement = $('.content:last-of-type');
    $(targetElement).html($(targetElement).html().substr(0, $(targetElement).html().indexOf("<strong>Oops!</strong>")));
    //alert("data: " + visitedTopics[topicIndex]);
    $(targetElement).append("<b>NeoBoard Index <span class='pointer'>»</span> <a href='boardlist.phtml?board=" + visitedTopics[topicIndex][5] + "'>" + visitedTopics[topicIndex][4] + "</a></b><br><br><strong>Current Topic:</strong> " + visitedTopics[topicIndex][3] + "<br><br><strong>Oops!</strong> This topic does not exist! Bummer, eh? ;)<br>This topic was deleted with <b>" + visitedTopics[topicIndex][2] + "</b> replies.");
    //alert($(targetElement).html().indexOf("<strong>"));
  }
}

function savePost() {
  if (isActive == false) {
    return;
  }
  //alert($('form[action="process_topic.phtml"] textarea').val());
  var replyBox = $('form[action="process_topic.phtml"] textarea');
  if (replyBox.val() != "") {
    GM_setValue("currentPost", replyBox.val());
    //alert("post saved");
  }
}

function formatReply(reply) {
  var formattedReply = "";
  var arrayOfLines = reply.split('\n');
    $.each(arrayOfLines, function(index, item) {
      //alert(item);
      // greentext
      if (item.startsWith(">")) {
        item = "[fontc=#789922]" + item + "[/font]";
      }
      formattedReply += item;
      if (index < arrayOfLines.length - 1) {
        formattedReply += "\n";
      }
    });
  return formattedReply;
}

function seeIfWeveReplied() {
  // check to see if we've posted on this page in this topic
  var topicAuthors = document.getElementsByClassName('topicAuthor');
  for (var i = 0; i < topicAuthors.length; i++) {
    //alert("Author: " + $('a[href^="/userlookup.phtml"] > .medText', topicAuthors[i]).text());
    if ($('a[href^="/userlookup.phtml"] > .medText', topicAuthors[i]).text() == username) {
      //alert("MATCH!");
      setTopicReplied();
      break;
    }
  }
  //alert(topicAuthors.length + " authors");
}

function seeIfWereOnTheLastPage() {
  var lastPage = false;
  var pageNav = $('#boards_table > tbody > tr:first-of-type td[align="right"]').html();
  if (pageNav != "") {
    var pageNavSplit = pageNav.split("</span>");
    //alert(pageNavSplit[1]);
    if (pageNavSplit[1].includes('<a href="topic.phtml')) {
      //alert("not the last page");
      lastPage = false;
    } else {
      //alert("the last page");
      lastPage = true;
    }
  } else {
    //alert("no pages");
    lastPage = true;
  }
  if (lastPage == true) {
    setNumberOfReplies();
  }
  //alert("we're on the last page: " + lastPage);
}

function setNumberOfReplies() {
  var replies = 0;
  // get number of replies
  var urlParams = location.search.substring(1).split("&");
  for (var i = 0; i < urlParams.length; i++) {
    if (urlParams[i].includes("next=")) {
      //alert("our topic ID is in here: " + urlParams[i].substring(6))
      replies = Number(urlParams[i].substring(5));
      //alert(replies);
      break;
    }
  }
  //if (replies >= 0) {
    var repliesOnPage = $('#boards_table .topicAuthor').length;
    //alert("ok " + repliesOnPage);
    replies = Number(replies) + Number(repliesOnPage) - 1;
    var topicIndex = getTopicIndexInArray(currentTopicID);
    if (topicIndex >= 0) {
      visitedTopics[topicIndex][2] = replies;
      saveVisitedTopicsData();
    }
  //}
  //alert("number of replies: " + replies);
}

/*function saveTopicData(topicTitle, boardName, boardID) {
  
}*/

function setTopicReplied() {
  var topicIndex = getTopicIndexInArray(currentTopicID);
  if (topicIndex >= 0) {
    visitedTopics[topicIndex][1] = 1;
    saveVisitedTopicsData();
  }
}

function getTopicIndexInArray(topicID) {
  for (var i = 0; i < visitedTopics.length; i++) {
    if (visitedTopics[i][0] == topicID) {
      return i;
    }
  }
  return -1;
}

function getVisitedTopicsData() {
  if (!GM_getValue("visitedTopics")) {
    visitedTopics = [[0, 0, -1, ""]];
    GM_setValue("visitedTopics", JSON.stringify(visitedTopics));
  }
  //GM_setValue("visitedTopics", JSON.stringify(visitedTopics));
  //alert(GM_getValue("visitedTopics"));
  visitedTopics = JSON.parse(GM_getValue("visitedTopics"));
  //visitedTopics = JSON.parse('[1,"false",false]');
  
}

function saveVisitedTopicsData() {
  GM_setValue("visitedTopics", JSON.stringify(visitedTopics));
  //alert(GM_getValue("visitedTopics"));
}

function addVisitedTopic() {
  if (currentTopicID == -1) {
    return;
  }
  //alert("beep0");
  //alert("boardName: " + boardName);
  // check to see if this topic is already saved
  //alert("Existing topicData: " + JSON.stringify(visitedTopics[getTopicIndexInArray(topicID)]));
  var topicExists = false;
  for (var i = 0; i < visitedTopics.length; i++) {
    //alert("Comparing '" + visitedTopics[i][0] + "' with '" + currentTopicID);
    if (visitedTopics[i][0] == currentTopicID) {
      //alert("beep1: " + visitedTopics[i].length);
      topicExists = true;
      if (visitedTopics[i].length <= 3) {
        //alert("beep2");
        visitedTopics[i] = [visitedTopics[i][0], visitedTopics[i][1], visitedTopics[i][2], topicName, boardName, boardID];
        //alert("beep3");
        //alert("Added data to topicData: " + JSON.stringify(visitedTopics[i]));
      } else {
        //alert("Existing topicData: " + JSON.stringify(visitedTopics[i]));
      }
      break;
    }
  }
  if (topicExists == false) {
    //alert("beep4");
    //alert(topicName);
    //alert(boardName);
    //alert(boardID);
    visitedTopics.push([currentTopicID, 0, -1, topicName, boardName, boardID]);
    //alert("beep5");
    //alert("Data added!! " + JSON.stringify(visitedTopics[visitedTopics.length - 1]));
    saveVisitedTopicsData();
  }
}

function formatTopicListings() {
  
  var allTopicElements = $('div[align="center"] > table[style="border-top: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000;"] > tbody > tr > .blistSmall:first-of-type');
  
  for (var i = 0; i < allTopicElements.length; i++) {
    
    allTopicElements[i] = $(allTopicElements[i]).parent();
    
    // set the blank grey bit so it's ready for some text
    $('.blistSmall:first-of-type > div', allTopicElements[i]).html("<div style='float: left;' id='NBP-tags'></div><div>" + $('.blistSmall:first-of-type > div', allTopicElements[i]).html() + "</div>");
    var tagTextElement = $('#NBP-tags', allTopicElements[i]);
    var tagText = "";
    var topicTitleElement = $('.blistSmall > .blistTopic', allTopicElements[i]);
    var topicTitle = $(topicTitleElement).html();
    
    var topicID = $(topicTitleElement).attr("href").substring(18);
    var topicRepliesElement = $('.blistSmall[align="center"]', allTopicElements[i]);
    var topicReplies = $(topicRepliesElement).text();
    
    //alert(topicReplies);
    var topicIndex = getTopicIndexInArray(topicID);
    
    if (topicIndex >= 0) {
      var newReplies = 0;
      // we've read it and have some data on it
      if (Number(visitedTopics[topicIndex][2]) >= 0) {
        //alert("hi");
        //alert(Number(topicReplies) + " | " + Number(visitedTopics[topicIndex][2]));
        //$(topicRepliesElement).html(topicReplies + " | " + visitedTopics[topicIndex][2]);
        if (Number(topicReplies) > Number(visitedTopics[topicIndex][2])) {
          //alert("hi");
          //alert(GM_getValue("visitedTopics"));
          newReplies = (Number(topicReplies) - Number(visitedTopics[topicIndex][2]));
          tagText += "[" + newReplies + " new " + (newReplies == 1 ? "reply" : "replies") + "]";
          $(topicRepliesElement).html(topicReplies + "</br><abbr title='Number of new replies since last visit'>(+" + newReplies + ")</abbr>");
        }
      }
      if (visitedTopics[topicIndex][1] == "1") {
        //$(topicTitleElement).html("[REPLIED] " + topicTitle);
        tagText = "[Replied] " + tagText;
        if (newReplies > 0) {
          tagText = "<b>" + tagText + "</b>";
        }
        
      }
      $(tagTextElement).html(tagText);
    } else {
      $('span', topicTitleElement).attr("style", "font-weight: bold;");
    }
    //alert($('.blistSmall[href*="randomfriend"]', allTopicElements[i]).text().trim());
    if ($('.blistSmall[href*="randomfriend"]', allTopicElements[i]).text().trim() == username) {
      $('span', topicTitleElement).attr("style", "font-weight: bold; color: #B25BDE;");
    }
    //$(topicTitleElement).text(topicID);
    //alert(topicID);
    //alert("hi");
  }
  //alert(allTopicElements.length);
  //alert(GM_getValue("visitedTopics"));
}