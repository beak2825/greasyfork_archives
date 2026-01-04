// ==UserScript==
// @name         KG Upgrade Finder
// @namespace    https://www.cinelounge.org/
// @version      1.01
// @description  Look for DVDR or BR of trumpable torrents
// @author       tadanobu
// @thanks       applesouce
// @match        https://karagarga.in/trumpable.php*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @connect      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.notification
//
// @run-at       document-start
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453602/KG%20Upgrade%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/453602/KG%20Upgrade%20Finder.meta.js
// ==/UserScript==
window.addEventListener("load", showCL);

function showCL() {
  $("a").each(function() {
    if($(this).is('[href*="imdb"')) {
      if($(this).attr("href").indexOf("https") >= 0) {
        var imdb = $(this).attr("href").substr(27, 10);
      } else {
        var imdb = $(this).attr("href").substr(26, 10);
      }
      var dvd = 1;
      var br = 1;
      //Si HD
      if($(this).parents("tr").children("td").eq(0).find('img[src*="1080"]').length || $(this).parents("tr").children("td").eq(0).find('img[src*="720"]').length) {
        dvd = 0;
      }
      //Si DVDR
      if($(this).parents("tr").children("td").eq(0).find('img[src*="dvdr"]').length) {
        br = 0;
        dvd = 0;
      }
      //Si BR
      if($(this).parents("tr").children("td").eq(0).find('img[src*="bluray"]').length) {
        br = 0;
        dvd = 0;
      }
      if(dvd == 1) {
        GM.xmlHttpRequest({
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
          url: "https://karagarga.in/browse.php?sort=added&search=" + imdb + "&search_type=imdb&d=DESC&dvdr=1",
          onload: function(response) {
            if(String(response.responseText).match("No torrents found") || String(response.responseText).match("Invalid IMDB ID")) {
            } else {
                if(String(response.responseText).match("deadrow")) {
                    $("a[href*=" + imdb + "]").before('<span><a href="https://karagarga.in/browse.php?sort=added&search=' + imdb + '&search_type=imdb&d=DESC&dvdr=1" target="_blank" style="color:grey;font-weight:800;vertical-align:top;border: 1px solid;">DVD</a> </span>');
                }
                else {
                    $("a[href*=" + imdb + "]").before('<span><a href="https://karagarga.in/browse.php?sort=added&search=' + imdb + '&search_type=imdb&d=DESC&dvdr=1" target="_blank" style="color:red;font-weight:800;vertical-align:top;border: 1px solid;">DVD</a> </span>');
                }
            }
          },
        });
      }
      if(br == 1) {
        GM.xmlHttpRequest({
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
          url: "https://karagarga.in/browse.php?sort=added&search=" + imdb + "&search_type=imdb&d=DESC&hdrip=3",
          onload: function(response) {
            if(String(response.responseText).match("No torrents found") || String(response.responseText).match("Invalid IMDB ID")) {
            } else {
                if(String(response.responseText).match("deadrow")) {
                    $("a[href*=" + imdb + "]").before('<span><a href="https://karagarga.in/browse.php?sort=added&search=' + imdb + '&search_type=imdb&d=DESC&hdrip=3" target="_blank" style="color:grey;font-weight:800;vertical-align:top;border: 1px solid;">BR</a> </span>');
                }
                else {
                    $("a[href*=" + imdb + "]").before('<span><a href="https://karagarga.in/browse.php?sort=added&search=' + imdb + '&search_type=imdb&d=DESC&hdrip=3" target="_blank" style="color:red;font-weight:800;vertical-align:top;border: 1px solid;">BR</a> </span>');
                }
            }
          },
        });
      }
    }
  });
}