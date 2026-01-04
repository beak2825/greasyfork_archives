// ==UserScript==
// @name         LeetCode remove premium problems
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://leetcode.com/problemset/*
// @match        https://leetcode.com/tag/*
// @match        https://leetcode.com/company/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399877/LeetCode%20remove%20premium%20problems.user.js
// @updateURL https://update.greasyfork.org/scripts/399877/LeetCode%20remove%20premium%20problems.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let attempts = 0;
    setTimeout(addButton, 1000);

    function addButton() {
        let anchor = $('div#welcome, label.tags-toggl__3H2x');
        if (anchor.length === 0 && attempts < 10) {
            attempts++;
            setTimeout(addButton, 1000);
            return;
        }

        let removePremium = $('<button class="remove-premium" style="margin-left: 10px;">Remove premium</button>');
        removePremium.click(() => {
            $('tbody.reactable-data tr:has(td[label="Title"] i.fa-lock)').remove();
        });

        anchor.after(removePremium);
    }
})();
