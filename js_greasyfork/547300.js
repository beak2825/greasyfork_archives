// ==UserScript==
// @name         MikanAniDirectDownload
// @namespace    https://greasyfork.org/users/158429
// @version      114515
// @description  为 MikanAni 的磁力链复制按钮后加上直接打开链接的按钮。
// @author       You
// @license      MIT
// @match        https://mikanani.me/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547300/MikanAniDirectDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/547300/MikanAniDirectDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //  mikan dynamicly generate magnet-link nodes, and they cannot
    //  be observed directly.

    const env = {};
    const config = {};
    // no gui configuration yet and then, it doesn't deserve。
    config.isOpenInNewWindow = true;

    function appendATag(element) {
        let a = document.createElement("a");
        a.href = element.dataset.clipboardText;
        a.target = '_blank';
        a.textContent = ' [🔗]';
        // a.style.color = '#555';
        if (config.isOpenInNewWindow) {
            a.onclick = (e) => {
                e.preventDefault();
                window.open(a.href, '_blank ', `popup=true, width=400, height=100, left==${e.clientX}, top=${e.clientY}`);
                return false};
        }
        element.insertAdjacentElement('afterend', a);
    }

    // table-striped view has first page preloaded.
    env.isTableView = false;
    if (window.location.pathname.length > 1) {
        env.isTableView = true;
        [ ... document.getElementsByClassName('magnet-link') ].forEach(
            ( element ) => {
                appendATag(element);
            }
        )
    }

    // fuck treewalker
    function tryAddOpenLinkButton(node) {
        if (node.nodeType == 1) {
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                if (node.classList.contains('magnet-link')) {
                    appendATag(node);
                } else {
                    tryAddOpenLinkButton(node.childNodes[i]);
                }
            }
        }
    }
    // mutations
    // callback
    function cbMutations(mutations, observer) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains(env.isTableView ? 'table-striped' : 'res-detail-ul')) {
                            tryAddOpenLinkButton(node);
                        }
                    }
                })
            }
       })
    }
    // observer
    const observer = new MutationObserver(cbMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('page has been fucked.');
})();