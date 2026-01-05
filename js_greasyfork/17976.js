// ==UserScript==
// @name         SweClockers Adblock
// @namespace    sRtBJ9mvaQRTaaqXEa8b
// @author       LemonIllusion
// @version      1.1
// @include      /^https?:\/\/.*sweclockers\.com.*/
// @description  Resets the adblock boolean on SweClockers.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/17976/SweClockers%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/17976/SweClockers%20Adblock.meta.js
// ==/UserScript==

function check() {
    if (typeof adblock !== 'undefined') {
        adblock = false;
        new Main.Widgets.AdblockLog().logStatus(session, false);
    } else {
        setTimeout(check, 100);
    }
}

check();