// ==UserScript==
// @name         LeetCode Unsolved (non-locked) Problem Numbers
// @description:en Show Number of Solved/Unsolved/Total Non-locked Problems on Leetcode
// @namespace    https://greasyfork.org/en/users/114838-groundzyy
// @version      0.2
// @author       groundzyy
// @match        https://leetcode.com/problemset/*
// @description Show Number of Solved/Unsolved/Total Non-locked Problems on Leetcode
// @downloadURL https://update.greasyfork.org/scripts/28676/LeetCode%20Unsolved%20%28non-locked%29%20Problem%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/28676/LeetCode%20Unsolved%20%28non-locked%29%20Problem%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';
     observeDomChange();
})();

function observeDomChange() {
    var MutationObserver = window.MutationObserver;
    var myObserver       = new MutationObserver (mutationHandler);
    var obsConfig        = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['list-group']
    };
    myObserver.observe(document, obsConfig);
    function mutationHandler (mutationRecords) {
        var locked = "div > i.fa-lock";
        var num_locked = $(locked).length;
        $(locked).parent().parent().parent().hide();
        if ($('#welcome strong').length == 1) {
            info = $('#welcome strong').text();
            num_finished = Number(info.split('/')[0]);
            num_questions = Number(info.split('/')[1]);
            num_unlocked = num_questions - num_locked;
            $('#welcome').append(' (Locked: ' + num_locked + ')<br />You have solved: <strong>' + num_finished + "/" + num_unlocked + ' (' + (num_unlocked - num_finished) + ')</strong> remain');
        }
    }
}