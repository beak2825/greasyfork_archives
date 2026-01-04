// ==UserScript==
// @name         雀魂 fullscreen [Alt + Enter]
// @version      0.1
// @description  雀魂をフルスクリーン可能にします Alt + Enter
// @author       炎筆
// @namespace    https://greasyfork.org/users/803913
// @match        https://game.mahjongsoul.com/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mahjongsoul.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440439/%E9%9B%80%E9%AD%82%20fullscreen%20%5BAlt%20%2B%20Enter%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/440439/%E9%9B%80%E9%AD%82%20fullscreen%20%5BAlt%20%2B%20Enter%5D.meta.js
// ==/UserScript==

let $layaContainer = null;

const observer = new MutationObserver(mutations => {
    for(const mutation of mutations) {
        for(const node of mutation.addedNodes) {
            if(node.id === 'layaContainer') {
                $layaContainer = node;
            }
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});

document.addEventListener('keydown', evt => {
    if(!evt.repeat && evt.code === 'Enter' && evt.altKey) {
        $layaContainer.requestFullscreen();
    }
});