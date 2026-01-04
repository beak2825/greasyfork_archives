// ==UserScript==
// @name     Tinder Auto-Like
// @version  1
// @grant    none
// @match    *://tinder.com/*
// @description like in anynone each 3 seconds
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/394086/Tinder%20Auto-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/394086/Tinder%20Auto-Like.meta.js
// ==/UserScript==
function auto (x, y) { setInterval(function(){
    //x = 940;
    //y = 752;
    var ev = document.createEvent("MouseEvent");
    var el = document.elementFromPoint(x,y);
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        x, y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
},3000);

}

auto(886, 548);