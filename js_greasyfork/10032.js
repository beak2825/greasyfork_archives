// ==UserScript==
// @name           Bypass YouTube age verification
// @name:de        Youtube-Altersverifikation umgehen
// @namespace      tfr
// @description    Bypass YouTube age verification without logging in.
// @description:de Umgehe die Altersverifikation ohne Einloggen.
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @compatible     chrome Works with Chrome and Tampermonkey
// @compatible     opera Works with Opera and Tampermonkey Beta or Violent monkey
// @compatible     tfrbmlconv-1 Works with / Funktioniert mit: Firefox 40, Chrome 44, Opera 31; Does not work with / Funktioniert nicht mit: IE 8, IE 11, Opera 12
// @oujs:author    tfr
// @include        http://www.youtube.com/watch*
// @include        https://www.youtube.com/watch*
// @version        6
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/10032/Bypass%20YouTube%20age%20verification.user.js
// @updateURL https://update.greasyfork.org/scripts/10032/Bypass%20YouTube%20age%20verification.meta.js
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

/* Version 6: Update license information
 * Version 5: Update metadata block
 * Version 4: Correct string search index from 1 to -1
 * Version 3: https://greasyfork.org/forum/discussion/4509
 * Version 2: Error in code, bypass in playlists was not working
 */

if(window.document.getElementById("watch7-player-age-gate-content"))
  {
    var videoid = window.location.search.substr(window.location.search.indexOf("v=") + 2);
    if(videoid.indexOf("&") > -1)
      {
        videoid = videoid.substr(0, videoid.indexOf("&"));
      }
    videoid = decodeURIComponent(videoid);
    window.document.getElementById("player-api").remove();
    var playerparent = window.document.getElementById("player-unavailable");
    var playerframe = window.document.createElement("iframe");
    playerframe.setAttribute("src", "//www.youtube.com/embed/" + videoid + "?autoplay=1&showinfo=0");
    playerframe.setAttribute("id", "player-frame");
    playerframe.setAttribute("style", "position:absolute; z-index:99999; width:100%; height:100%;");
    playerparent.appendChild(playerframe);
  }