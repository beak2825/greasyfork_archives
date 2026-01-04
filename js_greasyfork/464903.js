// ==UserScript==
// @name         PaintHua - Hide Toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press H on the keyboard to hide the toolbar. Helpful for viewing full image and accepting a generation when generating at the left-most edge.
// @author       Gnol
// @match        https://www.painthua.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=painthua.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464903/PaintHua%20-%20Hide%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/464903/PaintHua%20-%20Hide%20Toolbar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var visible = true;
    var activeElmId = "blank";

    document.addEventListener('click', function (e) {
    var elm = e.target;
    if (elm && elm.nodeType === 1 && elm.nodeName === 'A') {
        alert(elm.href);
    }
    activeElmId = elm.id;
});

    document.addEventListener('keyup', function() {
        if ((event.key == "h" || event.key == "H") && activeElmId != "prompt") {
            let res;
            if (visible) { res = "hidden"; } else { res = "visible"; }
            visible = !visible;
            document.getElementById("tools").setAttribute("style","visibility: " + res);
        }
    });
})();