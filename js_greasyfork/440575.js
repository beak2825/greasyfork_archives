// ==UserScript==
// @name         Joysound コピー制限解除
// @version      0.1
// @description  Joysound の歌詞をコピーできるようにします ＊使用は自己責任でね
// @author       炎筆
// @namespace    https://greasyfork.org/users/803913
// @match        https://www.joysound.com/web/search/song/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=joysound.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440575/Joysound%20%E3%82%B3%E3%83%94%E3%83%BC%E5%88%B6%E9%99%90%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/440575/Joysound%20%E3%82%B3%E3%83%94%E3%83%BC%E5%88%B6%E9%99%90%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

const modifyBodyNode = function($body) {
    $body.style.webkitUserSelect = 'text';

    Object.defineProperties($body, {
        onselectstart: {
            set() {}
        },
        onopy: {
            set() {}
        },
        oncontextmenu: {
            set() {}
        },
    });
};

const observer = new MutationObserver(mutations => {
    for(const mutation of mutations) {
        for(const node of mutation.addedNodes) {
            if(node.tagName === 'BODY') {
                modifyBodyNode(node);
            }
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});