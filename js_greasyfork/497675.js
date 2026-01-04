// ==UserScript==
// @name         IntelX.io Copy ID
// @description  Add a copy button to each search result to copy the data-id attribute
// @author       You
// @match        https://intelx.io/*
// @grant        none
// @version      0.3.3
// @namespace    https://greasyfork.org/en/scripts/497675-intelx-copy-id
// @license      MIT
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+FFVn/hRVc/4UVXP+FFVz/hRVc/4UVXP+FFVb/hRUT/4UVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/hRXp/4UV7P+FFez/hRXs/4UV7P+FFe3/hRXh/4UVN/+FFRr/hRUf/4UVAv+FFQD/hRUA/4YWAP+FFRn/hRUq/4UVLf+FFS//hRUv/4UVL/+FFS//hRUv/4UVLP+FFQj/hRVz/4UV1P+FFTP/hRUA/4UVAP+FFSH/hRXF/4UVvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/hRUA/4UVG/+FFcr/hRWw/4UVDf+FFQX/hRWW/4UV6f+FFUkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4UVAP+FFQD/hRVK/4UV6f+FFWr/hRVT/4UV8f+FFX3/hhYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/hRUA/4UVA/+FFYv/hRXl/4UV4f+FFbz/hRUT/4UVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+FFQD/hRUn/4UV4/+FFfn/hRVO/4UVAP+GFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+FFQD/hRQA/4UVbP+FFfP/hRXz/4UVj/+FFQX/hRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+GFgD/hRUA/4UVMf+FFeH/hRWl/4UVcf+FFer/hRVS/4UVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/hRUA/4UVDf+FFa7/hRXc/4UVKv+FFQn/hRWo/4UV0P+FFSYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/hRUA/4UVAP+FFWb/hRXx/4UVZP+FFQD/hRUA/4UVK/+FFdj/hRWpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4UVAP+GFwD/hRU2/4UVR/+FFQr/hRUA/4UVAP+GFgH/hRUz/4UVTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAA/wAAABgAAAAYAAD/AAAA/4AAAP+BAAD/wwAA/8EAAP+BAAD/AAAA/xgAAP4YAAD//wAA//8AAA==
// @downloadURL https://update.greasyfork.org/scripts/497675/IntelXio%20Copy%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/497675/IntelXio%20Copy%20ID.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function appendCopyButton(element) {
        if (element.querySelector('.copy-btn')) return;

        let copyBtn = document.createElement('button');
        const dataId = element.getAttribute('data-id');
        if (dataId.length > 10) {
            copyBtn.textContent = dataId.substring(0, 5) + ' ... ' + dataId.substring(dataId.length - 5);
        } else {
            copyBtn.textContent = dataId;
        }
        copyBtn.className = 'copy-btn';
        copyBtn.style.marginRight = '10px';
        copyBtn.onclick = function() {
            navigator.clipboard.writeText(element.getAttribute('data-id'))
                .catch(err => console.error('Error copying data-id:', err));
        };

        element.insertAdjacentElement('beforebegin', copyBtn);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                let detailLink = node.querySelector('.prevResult .view_details');
                if (detailLink) {
                    appendCopyButton(detailLink);
                } else {
                    console.log("Detail link not found within search-result element.");
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('.prevResult .view_details').forEach(element => {
        appendCopyButton(element);
    });
})();
