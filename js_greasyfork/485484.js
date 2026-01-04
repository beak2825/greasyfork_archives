// ==UserScript==
// @name         沉浸式翻译伴侣
// @namespace    https://github.com/mefengl
// @version      0.0.2
// @description  A script to automatically close translation modals.
// @author       mefengl
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485484/%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/485484/%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const intervalId = setInterval(() => {
        const modalRoot = document.querySelector('#immersive-translate-modal-root');
        if (modalRoot) {
            const shadowRoot = modalRoot.shadowRoot;
            if (shadowRoot) {
                const cancelBtn = shadowRoot.querySelector('.immersive-translate-cancel-btn');
                if (cancelBtn) {
                    cancelBtn.click();
                }
                const closeBtn = shadowRoot.querySelector('.immersive-translate-close');
                if (closeBtn) {
                    closeBtn.click();
                }
                
                const spanElement = document.querySelector('#error span');
                if (spanElement) {
                    spanElement.click();
                }
            }
        }
    }, 2000);
})();
