// ==UserScript==
// @name           Hide releases (categories/users) on ABB
// @description    Hide releases in specific categories or by specific users on ABB
// @version        0.47
// @author         mseitz
// @namespace      https://greasyfork.org/en/scripts/443140-hide-releases-on-abb
// @license        MIT
// @require        https://code.jquery.com/jquery-3.6.4.slim.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @match          *://audiobookbay.lu/*
// @match          *://audiobookbay.se/*
// @icon           https://audiobookbay.lu/favicon-32x32.png
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/443140/Hide%20releases%20%28categoriesusers%29%20on%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/443140/Hide%20releases%20%28categoriesusers%29%20on%20ABB.meta.js
// ==/UserScript==


//Explanation of user values
//
// --blocklistCategory/blocklistUser/blocklistUserComment--
// Contains ABB categories/usernames to block. The categories/usernames are case sensitive, must be comma seperated, and must not have leading or trailing withe-space.
// The whole string must be in double quotation marks.
// Example: "user1,User2,USER3" or "Some Category, Category2,Some other category"
//
// --placeholderUser/placeholderCategory/placeholderUserComment--
// Determines if postings are removed completely, or if a placeholder is shown instead. Possible values (without quotation marks) are:
//  0  removes postings completely
//  1  shows a placeholder "(Posting/Comment removed by "Hide releases on ABB")"
//  2  shows a placeholder "(Posting/Comment by user XYZ removed)" or (Posting of category "Category" removed; only first matched category shown)
//
// --removeTrackerInfo--
// Hides the tracker information from the audiobook release table, which can become bloated when a torrent uses many trackers. Possible values (without quotation marks) are:
//  0  changes nothing
//  1  hides the tracker information


//Check for GM_set/get API
var isGMapi;
try {
  if (typeof(GM_setValue)!="undefined") {
    GM_setValue('test',1);
    if (GM_getValue('test')==1) {
      isGMapi=1;
    } else {
      isGMapi=0;
    }
  } else {
    isGMapi=0;
  }
}
catch (e) {
  unsafeWindow.console.error(e);
  isGMapi=0;
}


//Check if user settings were set, and either set default values or read settings
var blockedUserArr;
var showRemovalUser;
var blockedCategoryArr;
var showRemovalCategory;
var blockedUserCommentArr;
var showRemovalUserComment;
var removeTrackerInfo
var blockedLangArr;
var showRemovalLang;


if (GM_getValue('blocklistUser') == null ) {
  GM_setValue('blocklistUser',"Replace this text with usernames you want to block, separated by a comma");
} else {
  try{
    blockedUserArr = GM_getValue('blocklistUser').split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistUser\" must be of format \"user1,user2,user3\".");
  }
}

if (GM_getValue('placeholderUser') == null ) {
  GM_setValue('placeholderUser',2);
} else {
  try{
    showRemovalUser = GM_getValue('placeholderUser');
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderUser\" must be 0, 1, or 2.");
  }
}

if (GM_getValue('blocklistCategory') == null ) {
  GM_setValue('blocklistCategory',"Replace this text with a category you want to block, separated by a comma");
} else {
  try{
    blockedCategoryArr = GM_getValue('blocklistCategory').split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistCategory\" must be of format \"some category, category 2,some other category\".");
  }
}

if (GM_getValue('placeholderCategory') == null ) {
  GM_setValue('placeholderCategory',2);
} else {
  try{
    showRemovalCategory = GM_getValue('placeholderCategory');
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderCategory\" must be 0, 1, or 2.");
  }
}

if (GM_getValue('blocklistUserComment') == null ) {
  GM_setValue('blocklistUserComment',"Replace this text with usernames whose comments you want to block, separated by a comma");
} else {
  try{
    blockedUserCommentArr = GM_getValue('blocklistUserComment').split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistUserComment\" must be of format \"user1,user2,user3\".");
  }
}

if (GM_getValue('placeholderUserComment') == null ) {
  GM_setValue('placeholderUserComment',2);
} else {
  try{
    showRemovalUserComment = GM_getValue('placeholderUserComment');
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderUserComment\" must be 0, 1, or 2.");
  }
}

if (GM_getValue('blocklistLanguage') == null ) {
  GM_setValue('blocklistLanguage',"Replace this text with languages (as seen on ABB) you want to block, separated by a comma");
} else {
  try{
    blockedLangArr = GM_getValue('blocklistLanguage').split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistLanguage\" must be of format \"Language1,Language2,Language3\".");
  }
}

if (GM_getValue('showRemovalLang') == null ) {
  GM_setValue('showRemovalLang',2);
} else {
  try{
    showRemovalUserComment = GM_getValue('showRemovalLang');
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalLang\" must be 0, 1, or 2.");
  }
}


if (GM_getValue('removeTrackerInfo') == null ) {
  GM_setValue('removeTrackerInfo',"Replace this text with the number 0 or 1 to show or hide torrent tracker info");
} else {
  try{
    removeTrackerInfo = GM_getValue('removeTrackerInfo');
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"removeTrackerInfo\" must be 0 or 1.");
  }
}




if ( window.location.pathname.substring(1) && ! window.location.pathname.match(/\/page\/[0-9]+/) && ! window.location.pathname.match("forum") ) {

  //Block user comment - read blocklist into array and remove or modify respective li
  for (var i = 0; i < blockedUserCommentArr.length; i++) {
    if (showRemovalUserComment == 0) {
      $('span.commentAuthor:contains(' + blockedUserCommentArr[i] + ')').closest('li').remove();
    } else if (showRemovalUserComment == 1) {
      $('span.commentAuthor:contains(' + blockedUserCommentArr[i] + ')').closest('li').replaceWith("<li class='alt'><div class='reviewBody'><div itemprop='reviewBody'><p><span style='color:#0000FF'>(Comment removed by 'Hide releases on ABB')</span></p></div></div></li>");
    } else if (showRemovalUserComment == 2) {
      $('span.commentAuthor:contains(' + blockedUserCommentArr[i] + ')').closest('li').replaceWith("<li class='alt'><div class='reviewBody'><div itemprop='reviewBody'><p><span style='color:#0000FF'>(Comment by user </span><span style='color:#FF0000'>" + blockedUserCommentArr[i] + "</span><span style='color:#0000FF'> removed)</span></p></div></div></li>");
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalUserComment\" must be null, 0, 1, or 2.");
    }
  }

  //Remove tracker information from the torrent_info table
  if (removeTrackerInfo == 1) {
    $('tr:contains("Tracker:")').remove();
    $('td:contains(".mp3"), td:contains(".m4a"), td:contains(".m4b"), td:contains(".wma"), td:contains(".jpg"), td:contains(".jpeg")').closest('tr').remove();
    //$('td[colspan="2"]').closest('tr').remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"removeTrackerInfo\" must be null, 0 or 1.");
    }

} else {

  //Block category - read blocklist into array and remove or modify respective div
  for (var j = 0; j < blockedCategoryArr.length; j++) {
    if (showRemovalCategory == 0) {
      $('div.postInfo:contains(' + blockedCategoryArr[j] + ')').parent('div').remove();
    } else if (showRemovalCategory == 1) {
      $('div.postInfo:contains(' + blockedCategoryArr[j] + ')').parent('div').replaceWith("<div class='postInfo'>(Posting removed by 'Hide releases on ABB')<br><br></div>");
    } else if (showRemovalCategory == 2) {
      $("div.postInfo:contains(" + blockedCategoryArr[j] + ")").parent().find("h2").find("a").clone().appendTo("div#content").before("<br>").append(" <span style='color:#0000FF'>(Release of category </span><span style='color:#FF0000'>" + blockedCategoryArr[j] + "</span><span style='color:#0000FF'> removed)</span><br>").wrap("<div class='blocked' style='font-size: 10px'></div>");
      $("div.postInfo:contains(" + blockedCategoryArr[j] + ")").parent('div').remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderCategory\" must be null, 0, 1, or 2.");
    }
  }

  //Block user - read blocklist into array and remove or modify respective div
  for (var k = 0; k < blockedUserArr.length; k++) {
    if (showRemovalUser == 0) {
      $('div.postContent:contains(' + blockedUserArr[k] + ')').parent('div').remove();
    } else if (showRemovalUser == 1) {
      $('div.postContent:contains(' + blockedUserArr[k] + ')').parent('div').replaceWith("<div class='postInfo'>(Posting removed by 'Hide releases on ABB')<br><br></div>");
    } else if (showRemovalUser == 2) {
      $('div.postContent:contains(' + blockedUserArr[k] + ')').parent().find("h2").find("a").clone().appendTo('div#content').before('<br>').append(" <span style='color:#0000FF'>(Release by user </span><span style='color:#FF0000'>" + blockedUserArr[k] + "</span><span style='color:#0000FF'> removed)</span><br>").wrap("<div class='blocked' style='font-size: 10px'></div>");
      $('div.postContent:contains(' + blockedUserArr[k] + ')').parent('div').remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalUser\" must be null, 0, 1, or 2.");
    }
  }

  //Block language - read blocklist into array and remove or modify respective div
  for (var k = 0; k < blockedLangArr.length; k++) {
    if (showRemovalLang == 0) {
      $('div.postInfo:contains(' + 'Language: ' + blockedLangArr[k] + ')').parent('div').remove();
    } else if (showRemovalUser == 1) {
      $('div.postInfo:contains(' + 'Language: ' + blockedLangArr[k] + ')').parent('div').replaceWith("<div class='postInfo'>(Posting removed by 'Hide releases on ABB')<br><br></div>");
    } else if (showRemovalUser == 2) {
      $('div.postInfo:contains(' + 'Language: ' + blockedLangArr[k] + ')').parent().find("h2").find("a").clone().appendTo('div#content').before('<br>').append(" <span style='color:#0000FF'>(Release in language </span><span style='color:#FF0000'>" + blockedLangArr[k] + "</span><span style='color:#0000FF'> removed)</span><br>").wrap("<div class='blocked' style='font-size: 10px'></div>");
      $('div.postInfo:contains(' + 'Language: ' + blockedLangArr[k] + ')').parent('div').remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalLang\" must be null, 0, 1, or 2.");
    }
  }

}



//The end
