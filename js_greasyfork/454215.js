// ==UserScript==
// @name        Bring back Youtube channel playlists
// @name:es        Bring back Youtube channel playlists
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/c/*
// @match       https://www.youtube.com/channel/*
// @match       https://www.youtube.com/user/*
// @match       https://www.youtube.com/@*
// @grant       none
// @run-at      document-start
// @version     0.5
// @author      The_Loko
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @description Adds a "Play All" button redirecting to the channel's uploaded videos playlist on the "Videos" tab.
// @description:es Añade un botón para reproducir todo ("Play All") en la pestaña "Vídeos" que redirige a una lista de reproducción con todos los vídeos del canal.
// @downloadURL https://update.greasyfork.org/scripts/454215/Bring%20back%20Youtube%20channel%20playlists.user.js
// @updateURL https://update.greasyfork.org/scripts/454215/Bring%20back%20Youtube%20channel%20playlists.meta.js
// ==/UserScript==


(function() {

    function getPlayListID() {
          var metaEls = [...document.getElementsByTagName('meta')];
          var prop = metaEls.filter(x => x.getAttribute('itemprop') == 'identifier');
          var channelID = prop.shift()['content']

          return 'UU'+channelID.substring(2) ;
    }


    var btn = document.createElement("div")


    btn.textContent ="Play All";
    btn.style.backgroundColor = "var(--yt-spec-text-primary)";
    btn.style.borderRadius = "8px";
    btn.style.position = "absolute";
    btn.style.right = "20px";
    btn.style.color = "var(--yt-spec-text-primary-inverse)";
    btn.style.padding = "var(--ytd-margin-2x) var(--ytd-margin-3x)";
    btn.style.userSelect = "none";
    btn.style.fontSize = "var(--ytd-user-comment-font-size)";
    btn.style.fontWeight = "var(--ytd-user-comment-font-weight)";
    btn.style.letterSpacing = "var(--ytd-user-comment-letter-spacing)";
    btn.style.textTransform = "var(--ytd-user-comment-text-transform)";
    btn.style.cursor = "pointer";
    btn.class = "style-scope ytd-feed-filter-chip-bar-renderer iron-selected"


    btn.onmousedown = (e) => {
        if (e.which == 1) {
          window.location.replace("https://www.youtube.com/playlist?list="+getPlayListID());
        } else if (e.which == 2) {
          window.open("https://www.youtube.com/playlist?list="+getPlayListID());
        }
    }

  waitForKeyElements("#chips-wrapper", () => {
    document.querySelector("#chips-wrapper").appendChild(btn);
  });



})();


/*
   UNABLE TO INCLUDE SCRIPT WHEN USING GREASYFORK SO DIRECTLY INCLUDING HERE.
   Credit to https://github.com/CoeJoder/waitForKeyElements.js
   v1.2
*/
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
  if (typeof waitOnce === 'undefined') {
    waitOnce = true;
  }
  if (typeof interval === 'undefined') {
    interval = 300;
  }
  if (typeof maxIntervals === 'undefined') {
    maxIntervals = -1;
  }
  var targetNodes =
    typeof selectorOrFunction === 'function'
      ? selectorOrFunction()
      : document.querySelectorAll(selectorOrFunction);

  var targetsFound = targetNodes && targetNodes.length > 0;
  if (targetsFound) {
    targetNodes.forEach(function (targetNode) {
      var attrAlreadyFound = 'data-userscript-alreadyFound';
      var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
      if (!alreadyFound) {
        var cancelFound = callback(targetNode);
        if (cancelFound) {
          targetsFound = false;
        } else {
          targetNode.setAttribute(attrAlreadyFound, true);
        }
      }
    });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1;
    setTimeout(function () {
      waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
    }, interval);
  }
}