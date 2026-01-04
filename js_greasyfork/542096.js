// ==UserScript==
// @name        Jira Service Desk - Default Reply to Customer
// @namespace   comrads.default.reply.to.customer
// @match       https://*.atlassian.net/*
// @grant       none
// @version     1.0
// @author      Ré Schopmeijer
// @description 7/9/2025, 8:44:53 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542096/Jira%20Service%20Desk%20-%20Default%20Reply%20to%20Customer.user.js
// @updateURL https://update.greasyfork.org/scripts/542096/Jira%20Service%20Desk%20-%20Default%20Reply%20to%20Customer.meta.js
// ==/UserScript==

// Function lifted from: https://medium.com/@ryan_forrester_/javascript-wait-for-element-to-exist-simple-explanation-1cd8c569e354
function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, observer) => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect();
            callback(element);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}


waitForElement("#comment-container", (element) => {
  waitForElement("#issue-transition-comment-editor-container-tabs-1", (el) => {
    const secondCommentTabText = el.querySelector('span').innerText;
    if (secondCommentTabText === 'Reply to customer') {
      el.click();
    }
  })
});