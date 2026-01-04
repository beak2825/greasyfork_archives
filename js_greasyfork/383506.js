// ==UserScript==
// @name         leetcode-cn hide premium problems
// @namespace https://greasyfork.org/en/users/304696-ruanima
// @description:en Hide Premium Problems on Leetcode
// @version      0.4
// @author      ruanimal 
// @thanks     hntee
// @match        https://leetcode-cn.com/problemset/*
// @description Hide Premium Problems on Leetcode
// @downloadURL https://update.greasyfork.org/scripts/383506/leetcode-cn%20hide%20premium%20problems.user.js
// @updateURL https://update.greasyfork.org/scripts/383506/leetcode-cn%20hide%20premium%20problems.meta.js
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
    myObserver.observe (document, obsConfig);
    function mutationHandler (mutationRecords) {
        $('tr i.fa-lock').parent().parent().parent().parent().parent().hide();
    }
}