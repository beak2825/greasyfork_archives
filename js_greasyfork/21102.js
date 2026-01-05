// ==UserScript==
// @name        Remove youtube topbar on theater mode
// @description Removes the youtube topbar when theater mode is on
// @namespace   nah
// @include     https://www.youtube.com/watch?*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/21102/Remove%20youtube%20topbar%20on%20theater%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/21102/Remove%20youtube%20topbar%20on%20theater%20mode.meta.js
// ==/UserScript==

var mainPage = document.getElementById("page");
var stageModeButton = document.getElementsByClassName("ytp-size-button ytp-button")[0];
var topBar = document.getElementById("masthead-positioner");
var topBarHeightOffest = document.getElementById("masthead-positioner-height-offset");

function isStageMode() {
  return mainPage.classList.contains("watch-stage-mode");
}
function toggleMe(element, show){
  if(element){
    if(show)
      element.style.visibility = "visible";
    else
      element.style.visibility = "collapse";
  }
}
function refreshTopBar(show){
  toggleMe(topBar, show);
  toggleMe(topBarHeightOffest, show);
  if(show)
    topBarHeightOffest.style.height = "50px";
  else
    topBarHeightOffest.style.height = "0px";
}

document.getElementsByClassName("ytp-size-button ytp-button")[0].onclick = function(){
  refreshTopBar(isStageMode());
}
refreshTopBar(!isStageMode());