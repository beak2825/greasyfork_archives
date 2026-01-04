// ==UserScript==
// @name        racing-make-names-clickable
// @namespace   sb.torn.racing-link
// @version     1.00
// @description make names on racing page linkable
// @author      Community
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/loader.php?sid=racing*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495229/racing-make-names-clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/495229/racing-make-names-clickable.meta.js
// ==/UserScript==

const actionLogNode = "#leaderBoard";

GM_addStyle(`
    .finally-ap-link {
        color: var(--default-color);
    }`);

function watchActionLog(observeNode) {
    if (!observeNode) return;
    console.log("sb1");
    const logNode = "li[class='name'] > span";
    observeNode.querySelectorAll(logNode).forEach((e) => addLogLink(e));

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const node of mutation.addedNodes) {
                addLogLink(node.querySelector && node.querySelector(logNode));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function addLogLink(node) {
    if (!node) return;
    if (node.querySelector("a")) return;

    node.innerHTML = node.innerHTML.replace(/^([^\s]+)/i, '<a class="finally-ap-link" target="_blank" href="profiles.php?NID=$1">$1</a>');
}

watchActionLog(document.querySelector(actionLogNode));

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            watchActionLog(node.querySelector && node.querySelector(actionLogNode));
        }
    });
}).observe(document.body, { childList: true, subtree: true });
