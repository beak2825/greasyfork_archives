// ==UserScript==
// @name         Recommend this
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the recommendations for channels and videos on Youtube's main page.
// @author       You
// @match        https://www.youtube.com/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/14131/Recommend%20this.user.js
// @updateURL https://update.greasyfork.org/scripts/14131/Recommend%20this.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var incriminating_selectors = [
    'span:contains("Recommended channel for you")',
    'span:contains("Want all the latest updates? Subscribe now.")',
    'span:contains("Recommended videos for you")',
    'span.branded-page-module-title-text:contains("Recommended")',
];

var judgeNode = function(node) {
    $node = $(node);
    incriminating_selectors.forEach(function(inc_s) {
        if ($node.find(inc_s).length)
            $node.hide()
    })
};

var mo = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node){
            judgeNode(node);
        });
    });   
});

var rootNode = document.querySelector("#feed-main-what_to_watch > ol");
//once for all the content initially loaded
for (var i = 0; i < rootNode.children.length; i++)
    judgeNode(rootNode.children[i]);
mo.observe(rootNode, {"childList": true});