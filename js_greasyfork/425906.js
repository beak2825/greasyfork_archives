// ==UserScript==
// @name         IceFilms VPN bypass
// @namespace    https://greasyfork.org/en/scripts/425906-icefilms-vpn-bypass
// @version      0.6
// @description  AutoSkip NordVPN message
// @author       ayourk
// @match        https://wwv.icefilms-info.com/check/*
// @icon         https://www.google.com/s2/favicons?domain=icefilms-info.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425906/IceFilms%20VPN%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/425906/IceFilms%20VPN%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Loop through the scripts array in reverse
    var curscr = document.scripts.length;
    var vpnskipscr;
    var redirpos;
    var redirend;
    for (; curscr > 0; curscr--) {
      vpnskipscr = "" + document.scripts[curscr-1].text;
      if (vpnskipscr.length == 0) continue;
      redirpos = vpnskipscr.indexOf("window.location.replace"); // Where should we go instead?
      if (redirpos == -1) continue;
      redirend = vpnskipscr.indexOf(";", redirpos) + 1;
      vpnskipscr = vpnskipscr.substring(redirpos, redirend);
      eval(vpnskipscr);
    }
})();