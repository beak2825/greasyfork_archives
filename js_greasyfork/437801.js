// ==UserScript==
// @name         Hide Luraph Threads
// @namespace    https://hypernite.xyz
// @version      0.1
// @description  Hide all of the shitty Luraph threads
// @author       HyperNite
// @match        https://v3rmillion.net/*
// @icon         https://avatars.githubusercontent.com/u/33453589?v=4
// @require      http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437801/Hide%20Luraph%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/437801/Hide%20Luraph%20Threads.meta.js
// ==/UserScript==

$(document).ready(function() {
    var allThreadSubjects;
    var oldSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_old"), 0);
    var newSubjects = Array.prototype.slice.call(document.getElementsByClassName("subject_new"), 0);
    allThreadSubjects = Array.prototype.concat.call(oldSubjects, newSubjects);

    for (var i = 0; i < allThreadSubjects.length; i++) {
        var S = allThreadSubjects[i].innerHTML.toLowerCase()
        if(S.search("^.*luraph.*$") == 0){
           var elem = allThreadSubjects[i].parentNode.parentNode.parentNode
            elem.parentNode.remove(elem);
            console.log("Removed a shitty Luraph thread!")
        }
    }
});