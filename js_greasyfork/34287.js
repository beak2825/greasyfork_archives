// ==UserScript==
// @name        Neoboard User Tagger
// @namespace   neotagger
// @description Local user tags for the neoboards
// @include     *://www.neopets.com/neoboards/*
// @version     1.1
// @grant       none
// @require https://greasyfork.org/scripts/34286-grant-none-shim/code/grant%20none%20shim.js?version=224672
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34287/Neoboard%20User%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/34287/Neoboard%20User%20Tagger.meta.js
// ==/UserScript==

var usersOnPage = [];
var savedTags = []; // [["username","tag"],["username","tag"]]

$(document).ready(function(){
  addStyle();
  loadSavedData();
  usersOnPage = $.merge($('a[href*="randomfriend.phtml?user="] > b').parent(), $('a[href*="userlookup.phtml?user="] > strong').parent());
  createTags();
});

function addStyle() {
  $("body").prepend("<style>.neotag{border: 1px solid; padding: 0px 3px 1px; border-radius: 3px; background: #FFFFFF; color: #4D4D4D; display: inline-block; cursor: pointer;} .neotag:hover{background: #C4DEFF;}</style>");
}

function loadSavedData() {
  if(GM_getValue("savedTags")){
    savedTags = JSON.parse(GM_getValue("savedTags"));
  }
}

function saveData() {
  GM_setValue("savedTags", JSON.stringify(savedTags));
}

function createTags() {
  // remove any existing tags so we can
  // add them with updated information
  $('.neotag').remove();
  for (var i = 0; i < usersOnPage.length; i++) {
    var tagText = "-";
    for (var j = 0; j < savedTags.length; j++) {
      if (savedTags[j][0] == getUsernameFromElement($(usersOnPage[i]))) {
        tagText = savedTags[j][1];
      }
    }
    $(usersOnPage[i]).after(" <div class='neotag' data-username='" + getUsernameFromElement($(usersOnPage[i])) + "'>" + tagText + "</div>");
  }
  $('.neotag').click(function(){setTag(this);});
}

function getUsernameFromElement(element) {
  return $(element).attr("href").split("?user=")[1];
}

function setTag(tag) {
  var setTagUsername = $(tag).attr("data-username");
  var currentTag = "";
  for (var i = 0; i < savedTags.length; i++) {
    if (savedTags[i][0] == setTagUsername) {
      currentTag = savedTags[i][1];
      break;
    }
  }
  var newTag = prompt("Enter a tag for " + setTagUsername, currentTag);
  if (newTag.trim() == "") {
    for (var i = savedTags.length - 1; i > 0; i--) {
      if (savedTags[i][0] == setTagUsername) {
        savedTags.splice(i, 1);
      }
    }
  } else {
    var foundName = false;
    for (var i = 0; i < savedTags.length; i++) {
      if (savedTags[i][0] == setTagUsername) {
        foundName = true;
        savedTags[i][1] = newTag;
        break;
      }
    }
    if (foundName != true) {
      savedTags.push([setTagUsername,newTag]);
    }
  }
  saveData();
  createTags();
}