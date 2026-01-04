// ==UserScript==
// @name         GranBlue Raid Finder Auto Copy
// @namespace    https://gbf-raidinfder.teemo.name/
// @version      0.0.3
// @description  Auto copy the first column last raid id to clipboard
// @author       Reusu
// @match        https://gbf-raidfinder.teemo.name/
// @icon         https://gbf-raidfinder.teemo.name/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/443039/GranBlue%20Raid%20Finder%20Auto%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/443039/GranBlue%20Raid%20Finder%20Auto%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const start = () => {
        const obConfig = {subtree: true, characterData:true, childList: true};
        const targetCard = document.querySelector('.ant-list .ant-spin-nested-loading .ant-spin-container .ant-list-items .ant-list-item');
        const targetCode = targetCard.querySelector('.ant-card-body .ant-row .ant-col-6 div');
        const mutationObserver = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
            	if (mutation.type === 'characterData') {
                    if (mutation.target.length == 8 && /^[A-Z0-9]*$/.test(mutation.target.data)) {
                        GM_setClipboard(mutation.target.data, 'text');
                        // GM_notification({title: '新救援已复制' ,text: '救援码：' + mutation.target.data ,timeout: 3000});
                    }
                }
            	if (mutation.type === 'childList') {
                    Array.from(mutation.addedNodes).reverse().forEach( node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return
                        const nodeId = node.querySelector('.ant-card-body .ant-row .ant-col-6 div');
                        if (!nodeId) return
                        GM_setClipboard(nodeId.innerHTML, 'text');
                        // GM_notification({title: '新救援已复制' ,text: '救援码：' + nodeId.innerHTML ,timeout: 3000});
                    })
                }
            }
        });
        mutationObserver.observe(targetCard, obConfig);
    }

    const main = () => {
        setTimeout(start, 1000);
    }

    if (window.unsafeWindow) {
        unsafeWindow.addEventListener('load', main);
    } else {
        window.addEventListener('load', main);
    }
})();