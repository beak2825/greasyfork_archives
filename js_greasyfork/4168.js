// ==UserScript==
// @name        YouTube - whitelist channels in Adblock Plus
// @namespace   http://forums.mozillazine.org/memberlist.php?mode=viewprofile&u=261941
// @author      Gingerbread Man
// @credits     Eyeo GmbH, Gantt, rimmington
// @description Helps whitelist YouTube channels in Adblock Plus
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @version     1.7
// @grant       none
// @license     http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL  https://adblockplus.org/forum/viewtopic.php?f=1&t=23697
// @downloadURL https://update.greasyfork.org/scripts/4168/YouTube%20-%20whitelist%20channels%20in%20Adblock%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/4168/YouTube%20-%20whitelist%20channels%20in%20Adblock%20Plus.meta.js
// ==/UserScript==

var updateHref = function (url) {
  window.history.replaceState(history.state, "", url);
};

var activate = function () {
  if (location.href.search("&user=") != -1) return;
  
  var uo = document.querySelector('#watch7-content link[href*="/user/"]');
  var uv = document.querySelector('.yt-user-info > a[href*="/channel/"]');
  var channelName = (uo && uo.href.slice(uo.href.lastIndexOf("/")+1)) || (uv && uv.textContent);

  if (channelName) {
    addMenu(channelName);
    updateHref(location.href+"&user="+channelName);
  }
}

// For static pages
activate();

// For dynamic content changes, like when clicking a video on the main page.
// This bit is based on Gantt's excellent Download YouTube Videos As MP4 script:
// https://github.com/gantt/downloadyoutube
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes !== null) {
      for (i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].id == "watch7-main-container") {
          activate();
          break;
        }
      }
    }
  });
});
observer.observe(document.body, {childList: true, subtree: true});

// Add the context menu to the user name below the video
// Only works in Firefox
function addMenu(channelName) {

  var uh = document.getElementById("watch7-user-header");
  var menu = document.createElement("menu");
  menu.setAttribute("id", "abpfilter");
  menu.setAttribute("type", "context");
  var mione = document.createElement("menuitem");
  // Adblock Plus is a registered trademark of Eyeo GmbH.
  mione.setAttribute("label", "Adblock Plus: toggle whitelist filter"); 
  mione.setAttribute("icon","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhlQTFRFKaFfJ6BdsOnR////3vbtnlUNvHAVq+fOnuLFjty66fnzM6prKqNhPbN2iEAGgtexftaufCgCj927b8+j9/37neLE0/Pm+/37YsmYqFoPSbqCbFoMw4IWrWoRkpxSrXwZxXkX1fHhjJlMXYk3d14SWHouV1cMr2IRR1INq1wPkU4JaU4LcXUW5PbtvnAVbFUMqmkQb1oO4vXrklQKkr6B0fLklUcKq3wYbFcOkmAQsGURsGEStGcSm1AMo8uWxeC49fz5zn4albBoo1kPl0wKnVQNiV0Qvm8U5vfvrWsRsG0RlWkSVXkt0enOo6dYjkcHVHUtgFUNzOXIjnMZTnIq/f38VGcZc6lfsnARcZdDo6dXVHUri3IXtGkTVXYtotOkqFkPT3MqfzEFsmsSkUwJXkAIgDoFosiRncePYciXxYQX4PTow3QWaGkcaWwfVHQrVXMkVGUVVGARY0cKlVcN+/36+fz5WH8vqs2YkkUKfGURgD0FVcKNcFoOlVwRdKVYVnoniF4PxePCjFcNaZdJ0/Dfo3EWsN67lFUKmE4LfmURlEkK7/ftR7qBYYcylJ5Sq20QVMGMom0WjkcIfzQFoKRSznwaflIMyn0ZjEIHnqRTlVQKiZlNbaFajHIXtWkSW4U2o2QOtOC+a5tSnVINi6tfr2YRynsZaX8yo2UOflAKmMePwd23lUwKeWURkUcIj30YsmoSAAAA7psQygAAALN0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAPKb/oAAABCElEQVR42mLYtGkTOxMUsAM5DJs2iXJEGchGeHlO8OMQBQkIcc5aZiPjrpc132oqp9AmBn4BuY1sOcsdp81QYEvuF+BnEFZS9+6aJB8zz7ytap3lHGEGCUnrpcxOG5hL7YuYxe0CMxlqNGPTeyqCmSPL+phbQvMmMkgl1DVlBOmIrPENE6l3yO1l4HVWMSrXLeQyyW7g8lg9nZeB23YFSyuLMkuB4gIWteYl3Aw8lXPbFy8KFzON1xCTdjXjYWDwSS0u0bcwrHVr1F41W5WBgZEhwLjbZSEr68rOtR1xQO4mRoZ8vpmTtVLW+/NFMzCCPMfIECKYNiWpWjARyAcJAEWgAMjfBBBgAJM4T1pkCARcAAAAAElFTkSuQmCC");
  menu.appendChild(mione);
  document.body.appendChild(menu);
  uh.setAttribute("contextmenu","abpfilter");

  function abpShowFilter() {
    var fpo = "@@||youtube.com/*&user=";
    var fpt = "$document";
    var ffl = fpo+channelName+fpt;
    var wh = document.getElementById("watch8-action-buttons");
    var wlf = wh.parentNode.querySelector("#whitelistfilter");
    if (!wlf && ffl) {
      var div = document.createElement("div");
      div.setAttribute("id","whitelistfilter");
      div.innerHTML = "Add the following filter to Adblock Plus:";
      var textarea = document.createElement("textarea");
      textarea.setAttribute("style", "display: block; font-family: monospace");
      textarea.setAttribute("spellcheck","false");
      textarea.setAttribute("rows","1");
      textarea.setAttribute("cols",ffl.length);
      textarea.innerHTML = ffl;
      div.appendChild(textarea);
      wh.parentNode.appendChild(div);
      textarea.focus();
    }
    else wh.parentNode.removeChild(wlf);
  }

  mione.addEventListener("click",abpShowFilter,false);

}