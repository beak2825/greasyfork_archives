// ==UserScript==
// @name         synapse thread remover
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  Removes stupid synapse malding threads
// @author       Jesus Christ
// @match        https://v3rmillion.net/*
// @icon         https://stepbrofurious.xyz/favicon.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453009/synapse%20thread%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/453009/synapse%20thread%20remover.meta.js
// ==/UserScript==


var blacklisted = [
    "synapse",
    "synx",
    "sx",
    "s^x"
]
$(document).ready(function () {
    var oldsub = Array.prototype.slice.call(document.getElementsByClassName("subject_old"), 0);
    var newsub = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
    var threads = oldsub.concat(newsub);
    for (var i = 0; i < threads.length; i++) {
        var threadname = threads[i].innerText.toLowerCase()
        var del = false
        blacklisted.forEach(function(v){
            if (threadname.search(v) !== -1 ){
                del = true
            }
        })
        if (del) {
            var element = threads[i].parentNode.parentNode.parentNode
            console.log("deleted a synapse related thread :D")
            element.parentNode.remove(element);
        }
    }
});