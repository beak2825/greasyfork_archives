// ==UserScript==
// @name         Agma.io | Simple Fast-Split Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a simple script that allows you to fast-split. Just press X and it will fast split your cell one time!
// @author       Chainx
// @match        https://agma.io/*
// @icon         https://i.imgur.com/ZSiYeJj.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430229/Agmaio%20%7C%20Simple%20Fast-Split%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/430229/Agmaio%20%7C%20Simple%20Fast-Split%20Script.meta.js
// ==/UserScript==

/*
-==o HOW TO CHANGE THE FAST-SPLIT KEYBIND o==-

> Visit the link below. There you will find a list of every key available coupled
with its own key code. Find the key you want to use as your fast-split keybind
and simply replace the number in line 17.
(You also need to Save the userscript and refresh Agma for the changes to apply.)

http://gcctech.org/csc/javascript/javascript_keycodes.htm
*/

(function() {
    'use strict';

    var $ = window.$;
    var fastSplitKey = 65


    //Setting up the one split function
    function oneSplit() {
    $("#canvas").trigger($.Event("keydown", { keyCode: 32}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 32}));
}
    //Setting up the freeze function
    function freeze() {
    $("#canvas").trigger($.Event("keydown", { keyCode: 70}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 70}));
}
    window.addEventListener('keydown', keydown);
    function keydown(event) {
    //If the X key is pressed then split once, freeze, and unfreeze after 60 milliseconds
    if (event.keyCode == fastSplitKey) {
        oneSplit()
        setTimeout(freeze, 0)
        setTimeout(freeze, 60)
    }
}
})();