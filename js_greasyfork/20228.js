// ==UserScript==
// @name        Google Optimization
// @namespace   0x123.com
// @author      Elf Sundae
// @description Google Search Page Optimization
// @copyright   www.0x123.com
// @icon        http://img-cdn.0x321.com/stuff/googleg_lodp.png
// @encoding    utf-8
// @run-at      document-end
// @include     /^https?://www\.google\.com
// @date        28/07/2014
// @modified    19/07/2016
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/20228/Google%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/20228/Google%20Optimization.meta.js
// ==/UserScript==

/**
 * https://greasyfork.org/scripts/20228-google-optimization
 */

if (document.URL.match(/[\?#&]q=/g)) {
  remove_url_tracker();
}

function remove_url_tracker() {
  window.RemoveURLTrackerTimer = setInterval(function() {
    var iresDiv = document.getElementById('ires');
    if (!iresDiv) {
      return;
    }

    clearInterval(window.RemoveURLTrackerTimer);
    var links = iresDiv.getElementsByTagName('a');
    Array.prototype.slice.call(links).forEach(function(a) {
      a.removeAttribute("onmousedown");
      var url = a.getAttribute('data-href');
      if (url) {
        a.setAttribute('href', url);
      }
    });

    var resultStats = document.getElementById('resultStats');
    resultStats.innerHTML += "<nobr>&nbsp;<i>Removed URL tracker.</i>&nbsp;</nobr>";

  }, 100);
}
