// ==UserScript==
// @name         YLCET Chat 400x600
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change YLCET layout, chat width 400, depth 600
// @author       Me
// @match        http://chess.my2dollars.ca/live.html
// @match        http://chess.my2dollars.ca/livesmall.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38529/YLCET%20Chat%20400x600.user.js
// @updateURL https://update.greasyfork.org/scripts/38529/YLCET%20Chat%20400x600.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wr = document.getElementById("wrapper");
    if (wr) {
        // insert sidebar
        var sb = document.createElement('div');
        sb.id = "sidebar";
        sb.style="position:fixed; height:100%; z-index:1; ";
        wr.parentNode.insertBefore(sb, wr);

        // set margin
        var cp = document.getElementById("full");
        if (cp) {
            cp.removeAttribute('style');
            cp.style='margin-left: 400px; ';
        }
        var yl = document.getElementById("YLCET");
        if (yl) {
            yl.removeAttribute('width');
            yl.removeAttribute('height');
            yl.style="width:400px; height:600px;";
        }
        var cr = document.getElementById("chat_right");
        if (cr) {
            cr.removeAttribute('style');
            cr.style="float:left; width:400px;";
        }

        // move chat
        var ch = document.getElementById("rightside");
        if (ch) {
            ch.parentNode.removeChild(ch);
            sb.appendChild(ch);
            ch.removeAttribute('style');
            ch.style='float:left; top:0;';
        }

        /* move game moves
        var gc = document.getElementById("gameboardcontainer");
        if (gc) {
            var gm = document.getElementById("GameMoves");
            if (gm) {
                gm.parentNode.removeChild(gm);
                gc.insertBefore(gm, gc.childNodes[0]);
            }
        }
        */
    }
})();
