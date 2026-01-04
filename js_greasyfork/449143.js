// ==UserScript==
// @name         cw remover
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  Removes stupid cw threads
// @author       Jesus Christ
// @match        https://v3rmillion.net/*
// @icon         https://stepbrofurious.xyz/favicon.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449143/cw%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/449143/cw%20remover.meta.js
// ==/UserScript==

$(document).ready(function () {
    var oldsub = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
    var newsub = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
    var threads = oldsub.concat(newsub);
    for (var i = 0; i < threads.length; i++) {
        if (threads[i].innerHTML.toLowerCase().search("cw") !== -1) {
            var element = threads[i].parentNode.parentNode.parentNode
            console.log("deleted a shitty cw thread")
            element.parentNode.remove(element);
        }
    }
});