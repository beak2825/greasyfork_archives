// ==UserScript==
// @name         YLCET Layout 1
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change YLCET layout
// @author       Me
// @match        http://chess.my2dollars.ca/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38430/YLCET%20Layout%201.user.js
// @updateURL https://update.greasyfork.org/scripts/38430/YLCET%20Layout%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wr = document.getElementById("wrapper");
    if (wr) {
        // insert sidebar
        var sb = document.createElement('div');
        sb.id = "sidebar";
        sb.style="position:fixed; width:500px; height:100%; z-index:1; ";
        wr.parentNode.insertBefore(sb, wr);

        // set margin
        var cp = document.getElementById("full");
        if (cp) {
            cp.removeAttribute('style');
            cp.style='margin-left: 500px; ';
        }
        var yl = document.getElementById("YLCET");
        if (yl) {
            yl.removeAttribute('width');
            yl.width='500px';
            yl.removeAttribute('height');
            yl.height='700px';
        }

        // move chat
        var ch = document.getElementById("chat_right");
        if (ch) {
            ch.parentNode.removeChild(ch);
            sb.appendChild(ch);
            ch.removeAttribute('style');
            ch.style='float:left; top:0;';
        }

        // move game moves
        var gc = document.getElementById("gameboardcontainer");
        if (gc) {
            var gm = document.getElementById("GameMoves");
            if (gm) {
                gm.parentNode.removeChild(gm);
                gc.insertBefore(gm, gc.childNodes[0]);
            }
        }
    }
})();
