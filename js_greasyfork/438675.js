// ==UserScript==
// @name        YouTube: Fix memory leak in live chat
// @description YouTube Live のチャット欄のメモリリークを軽減します
// @namespace   https://gitlab.com/sigsign
// @version     0.1.0
// @author      Sigsign
// @license     MIT or Apache-2.0
// @match       https://www.youtube.com/live_chat?*
// @match       https://www.youtube.com/live_chat_replay?*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/438675/YouTube%3A%20Fix%20memory%20leak%20in%20live%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/438675/YouTube%3A%20Fix%20memory%20leak%20in%20live%20chat.meta.js
// ==/UserScript==
(function () {
'use strict';

function callback(list) {
    const tasks = [];
    for (const mutation of list) {
        for (const node of mutation.removedNodes) {
            const nodeName = node.nodeName.toLowerCase();
            if (nodeName !== 'yt-live-chat-text-message-renderer') {
                continue;
            }
            const promise = destroy(node);
            tasks.push(promise);
        }
    }
    // Todo: rewrite to requestIdleCallback()
    Promise.allSettled(tasks).catch((err) => {
        console.error(err);
    });
}
async function destroy(node) {
    for (const leaf of Array.from(node.childNodes)) {
        await destroy(leaf);
    }
    for (const key of Object.keys(node)) {
        node[key] = undefined;
    }
    node.remove();
}
function observe(observer, target) {
    if (target) {
        observer.observe(target, {
            childList: true,
        });
    }
    else {
        console.warn('Observer target is null');
    }
}
const observer = new MutationObserver(callback);
const container = document.querySelector('yt-live-chat-renderer div#chat div#item-list');
if (container) {
    observe(observer, container.querySelector('div#items'));
    // チャットを上位チャットとチャットで切り替えたときの対策
    // Todo: あとで書き直す
    const reload = new MutationObserver((list) => {
        for (const mutation of list) {
            for (const node of mutation.addedNodes) {
                const nodeName = node.nodeName.toLowerCase();
                if (nodeName !== 'yt-live-chat-item-list-renderer') {
                    console.dir(node);
                    continue;
                }
                observe(observer, node.querySelector('div#items'));
            }
        }
    });
    reload.observe(container, {
        childList: true,
    });
}

})();
