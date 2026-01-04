// ==UserScript==
// @name         qTest Cases History Highlight Diff
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  Highlight diff of qTest Cases History 
// @author       Damon Yu
// @match        https://*.qtestnet.com/*
// @icon         https://www.qtestnet.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522264/qTest%20Cases%20History%20Highlight%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/522264/qTest%20Cases%20History%20Highlight%20Diff.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('.my-table.table.ng-star-inserted')) {
                    setTimeout(() => {
                        console.log("find");
                        var e1 = $('tr.ng-star-inserted').last().find('.history-value').last().prev();
                        var e2 = $('tr.ng-star-inserted').last().find('.history-value').last();
                        var all = $('tr.ng-star-inserted').map(function() {
                            let text1 = $(this).find('.history-value').last().prev().text();
                            let text2 = $(this).find('.history-value').last().text();
                            if (text1 == "" & text2 ==""){
                                return ""
                            }
                            if (text1 != text2){
                                $(this).find('.history-value').last().prev().css( "background-color", "#c0d8fa" )
                                $(this).find('.history-value').last().css( "background-color", "#c0d8fa" )
                            }
                            return text1 + "\n" + text2 + "\n\n";
                        }).get();
                    }, 300);
                    // console.log(all.join(', '));
                }
            });
        });
    });
    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
})();