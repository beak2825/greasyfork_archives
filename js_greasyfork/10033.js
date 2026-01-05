// ==UserScript==
// @name           Shorten URLs on Dailymotion
// @name:de        Kürze URLs auf Dailymotion
// @namespace      tfr
// @description    Remove video name from URLs on Dailymotion page
// @description:de Entferne Videoname aus URLs auf der Dailymotion-Seite
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @compatible     chrome Works with Chrome and Tampermonkey
// @compatible     opera Works with Opera and Tampermonkey Beta or Violent monkey
// @oujs:author    tfr
// @include        http://www.dailymotion.com/*
// @include        https://www.dailymotion.com/*
// @include        http://dailymotion.com/*
// @include        https://dailymotion.com/*
// @version        3
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/10033/Shorten%20URLs%20on%20Dailymotion.user.js
// @updateURL https://update.greasyfork.org/scripts/10033/Shorten%20URLs%20on%20Dailymotion.meta.js
// ==/UserScript==

/* This script is dual-licensed under CC0 and the MIT license.
 * You can choose which one you want to use.
 * CC0 license: http://creativecommons.org/publicdomain/zero/1.0/deed.en
 * MIT license: https://pastebin.com/raw.php?i=4TMeeUXC
 *
 * Dieses Skript steht sowohl unter CC0 als auch unter der MIT-Lizenz.
 * Sie können sich aussuchen, welche Lizenz Sie nutzen.
 * CC0-Lizenz: http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * MIT-Lizenz: https://pastebin.com/raw.php?i=4TMeeUXC
 */
 
/* Version 3: Update licsense information
 * Version 2: Update Metadata
 */

if(window.location.pathname.substr(0, 8) == "/video/x") {
  var videoid = window.location.pathname.substr(8);
  if(videoid.indexOf("_") > -1) {
    videoid = videoid.substr(0, videoid.indexOf("_"));
  }
  while(videoid.length < 6) {
    videoid = "0" + videoid;
  }
  if (window.location.pathname != "/video/x" + videoid) window.location.pathname = "/video/x" + videoid;
  if (window.location.search != "") window.location.search = "";
}

LinkCount = 0;
function ChangeLinks() {
  if(LinkCount != window.document.links.length) {
    for (var i = 0; i < window.document.links.length; i++) {
      if(window.document.links[i].pathname.substr(0, 8) == "/video/x") {
        var videoid = window.document.links[i].pathname.substr(8);
        if(videoid.indexOf("_") > -1) {
          videoid = videoid.substr(0, videoid.indexOf("_"));
        }
        while(videoid.length < 6) {
          videoid = "0" + videoid;
        }
        window.document.links[i].pathname = "/video/x" + videoid;
        window.document.links[i].search = "";
      }
    }
    LinkCount = window.document.links.length;
  }
}
ChangeLinks();
window.setInterval(ChangeLinks, 1000);