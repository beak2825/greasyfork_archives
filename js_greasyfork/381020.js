// ==UserScript==
// @name owo-uncap
// @description Removes the (ad) video overlay on owo.si
// @match *://owo.si/watch/*
// @namespace kawa.tf
// @version 0.0.2
// @license Artistic-2.0
// @downloadURL https://update.greasyfork.org/scripts/381020/owo-uncap.user.js
// @updateURL https://update.greasyfork.org/scripts/381020/owo-uncap.meta.js
// ==/UserScript==

(function(){

let name = "owo-uncap";

function log (s) {
    console.log(name+ ': ' + s)
}

function remove_attempt() {
    elts = document.getElementsByClassName('video-player--overlay');
    if (elts.length != 1) return false;
    elts[0].remove();
    return true;
}

let max_tries = 10
let tries = 0

let iid = setInterval(function() {
    if (tries == max_tries) {
        log("Max tries reached, aborting");
        return null;
    }
    tries++;

    let removed = remove_attempt();
    if (removed) {
        clearInterval(iid);
        log("Removed overlay");
    }
}, 1000);

}())
