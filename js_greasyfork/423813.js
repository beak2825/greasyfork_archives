// ==UserScript==
// @name         虎嗅24小时清洁工 Huxiu 24Hr Cleaner
// @namespace    https://greasyfork.org
// @version      0.1
// @description  删除评论框
// @author       affrog
// @match        https://www.huxiu.com/moment/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423813/%E8%99%8E%E5%97%8524%E5%B0%8F%E6%97%B6%E6%B8%85%E6%B4%81%E5%B7%A5%20Huxiu%2024Hr%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/423813/%E8%99%8E%E5%97%8524%E5%B0%8F%E6%97%B6%E6%B8%85%E6%B4%81%E5%B7%A5%20Huxiu%2024Hr%20Cleaner.meta.js
// ==/UserScript==

function removeComments(mutationList, observer) {
    mutationList.forEach(function(mutation){
        if (mutation.target.className == 'moment-item') {
            var comments = mutation.target.getElementsByClassName('moment-comment-wrap');
            if (comments.length > 0) {
                comments[0].remove();
            }
        }
    })
}

(function() {
    'use strict';

    var rootNode = document.body;
    var observer = new MutationObserver(removeComments);
    if (rootNode) {
        observer.observe(rootNode, {
            childList: true,
            subtree: true
        });
    }
})();