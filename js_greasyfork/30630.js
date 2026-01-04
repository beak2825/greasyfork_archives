// ==UserScript==
// @name         Show Number of LeetCode Unsolved Problems
// @namespace    https://greasyfork.org/en/users/114838-groundzyy
// @version      0.1
// @author       groundzyy
// @match        https://leetcode.com/problemset/*
// @description Show Number of LeetCode Unsolved Problems for the new style
// @downloadURL https://update.greasyfork.org/scripts/30630/Show%20Number%20of%20LeetCode%20Unsolved%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/30630/Show%20Number%20of%20LeetCode%20Unsolved%20Problems.meta.js
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
        if ($('#welcome > span').length == 1) {
            info = $('#welcome > span > span:nth-child(1)').text().split(" ");
            num_finished = Number(info[0].split('/')[0]);
            num_questions = Number(info[0].split('/')[1]);
            $('#welcome').append('<br/><span>' + num_finished + "/" + num_questions + ' (' + (num_questions - num_finished) + ')</span>');
        }
    }
}