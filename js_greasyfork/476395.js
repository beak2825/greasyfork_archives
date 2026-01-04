// ==UserScript==
// @name         R0ckstarYT's Multi-Drop
// @namespace    R0ckstarYT's Multi-Drop
// @version      1.0.0
// @description  Drop Multiple Items On The Map!
// @author       R0ckstarYT
// @icon         https://abload.de/img/fordiscordmpjz0.png
// @match        https://cellcraft.io/
// @grant        none
// @license      adiaedaeda
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476395/R0ckstarYT%27s%20Multi-Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/476395/R0ckstarYT%27s%20Multi-Drop.meta.js
// ==/UserScript==

/*
---------------------------------------------------
- Click The Item You Want To Drop
- Then Press V To Drop Items
---------------------------------------------------
*/

(function() {
    'use strict';

    var mouseX = 0;
    var mouseY = 0;
    var invName = "";
    var timer = 0;
    document.body.addEventListener("mousemove", function(e) {mouseX = e.clientX; mouseY = e.clientY;});
    $(".inventory-box").mousedown(function(e) {invName = e.currentTarget.id;});
    function drop() {
        $("#"+invName).trigger($.Event("mousedown", {button: 0}));
        $("body").trigger($.Event("mouseup", {button: 0, clientX: mouseX, clientY: mouseY}));
        timer = setTimeout(drop, 100);
    }
    window.addEventListener("keydown", function(e) {e.keyCode == 86 && !timer && invName != "" && drop();});
    window.addEventListener("keyup", function(e) {e.keyCode == 86 && timer && (clearTimeout(timer), timer = 0);});
})();//