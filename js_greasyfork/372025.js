// ==UserScript==
// @name     GoNintendo Keyboard Navigation
// @description Enable easier navigation on GoNintendo with keyboard commands. Ctrl-left arrow for older stories, ctrl-right arrow for newer stories.
// @author   Fruzilla
// @include *://gonintendo.com
// @include *://gonintendo.com/
// @include *://gonintendo.com/?page*
// @grant none
// @version 1
// @run-at   document-start
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/372025/GoNintendo%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/372025/GoNintendo%20Keyboard%20Navigation.meta.js
// ==/UserScript==

//Script structure:
//add event listeners, define the two functions
//more functions to add if article scroll is implemented.
//

//page is stored in the url (ex: gonintendo.com/?page=2)
//check if the url contains "page", if it does then retrieve page, if not then set it to 1
function getPage(){
  var pageIndex = window.location.href.indexOf("page");
  if(pageIndex === -1){
    return 1;
  }
  else{
    return parseInt(window.location.href.substring(pageIndex+5));
  }
}

//goes a page ahead, to older stories
function olderStories(event){
  var page = getPage();  
  window.location.href = "https://gonintendo.com/?page=" + parseInt(page+1);
}

//goes a page back, to newer stories
//for page 2, we want to return to the main page instead of attempting to go to page 1 (looks nicer that way)
//if we're on the main page, we won't attempt to go up a page. (already at newest stories)
function newerStories(event){
  var page = getPage();
  if (page === 2){
    window.location.href = "https://gonintendo.com";
  }
  else if(page >= 2){
    window.location.href = "https://gonintendo.com/?page=" + parseInt(page-1);
  }
}

//main program: set up keypress event listener

//$(document).bind('keypress', function(event) {
document.addEventListener('keypress', function(event){
    if( event.keyCode === 37 && event.ctrlKey ) {
        olderStories(event);
    }
    else if( event.keyCode === 39 && event.ctrlKey){
      newerStories(event);
    }
});

//  left = 37
//  up = 38
//  right = 39
//  down = 40
