// ==UserScript==
// @name         Highlight Listened Bandcamp Albums
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      GNU AGPLv3
// @description  Add highlights to listened Bandcamp albums. Note: All domains is required for the script, because some albums listed on bandcamp.com are not served on bandcamp.com. For albums served on sites other than bandcamp.com, the recognition of the album playback is possible only if the site uses bandcamp.com's document format.
// @author       jcunews
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/38296/Highlight%20Listened%20Bandcamp%20Albums.user.js
// @updateURL https://update.greasyfork.org/scripts/38296/Highlight%20Listened%20Bandcamp%20Albums.meta.js
// ==/UserScript==

(function(ele) {

  var highlightColor = "#fbf";

  function getPlayed(result, z) {
    try {
      result = JSON.parse(GM_getValue("played", "[]"));
    } catch(z) {
      result = [];
    }
    return result;
  }

  function onPlay(played, a) {
    played = getPlayed();
    a = location.hostname + location.pathname;
    if (played.indexOf(a) < 0) {
      played.push(a);
      GM_setValue("played", JSON.stringify(played));
    }
    this.removeEventListener("click", onPlay);
  }

  function highlightList(played, eles) {
    played = getPlayed();
    eles = document.querySelectorAll(".discover-result > .discover-item > .item-title, .results_area > .results > .item_list > .item > a");
    Array.prototype.slice.call(eles).forEach(
      function(ele, a) {
        a = ele.hostname + ele.pathname;
        if (played.indexOf(a) >= 0) {
          ele.parentNode.style.cssText = "outline:" + (ele.className ? 5 : 10) + "px solid " + highlightColor + ";background-color:" + highlightColor;
        }
      }
    );
  }

  if ((/bandcamp\.com$/).test(location.hostname)) {
    if ((/\/\/bandcamp\.com\/?($|[?#])/).test(location.href)) {
      ele = null;
      (function updHighlists(e) {
        if ((e = document.querySelector(".discover-result > .discover-item:nth-child(2)")) && (e !== ele)) {
          highlightList();
        } else setTimeout(updHighlists, 500);
      })();
    } else if ((/\/\/bandcamp\.com\/tag\//).test(location.href)) {
      highlightList();
    } else if ((/\.bandcamp\.com\/album\//).test(location.href)) {
      if (ele = document.querySelector(".playbutton")) {
        ele.addEventListener("click", onPlay);
      }
    }
    document.addEventListener("visibilitychange", highlightList);
  } else if (document.querySelector('.trackView[itemtype="http://schema.org/MusicAlbum"]')) {
    if (ele = document.querySelector(".playbutton")) {
      ele.addEventListener("click", onPlay);
    }
  }
})();
