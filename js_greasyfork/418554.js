// ==UserScript==
// @name         Leetcode Notes remove
// @namespace    http://www.cocong.cn/
// @version      0.1
// @description  Remove Lettcode Notes.
// @author       huzhenhua
// @match        https://leetcode-cn.com/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418554/Leetcode%20Notes%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/418554/Leetcode%20Notes%20remove.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    var wait_duration = 1000;
    var try_times = 5;

    setTimeout(function(){
        var note = document.querySelector('.note-btn-cn__uUt0')
        if(note != null) {
            note.remove();
            console.log("Note was removed.");
        } else if(--try_times >= 0) {
            setTimeout(arguments.callee, wait_duration);
            console.log("Try to remove note again.");
        } else {
            console.log("Note was failed to remove.");
        };
    }, wait_duration);

})();