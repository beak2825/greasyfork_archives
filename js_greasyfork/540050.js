// ==UserScript==
// @name         Hide Falcon LLM Profile Image Container
// @description  Hides all profile image containers on Falcon LLM Chat
// @match        https://chat.falconllm.tii.ae/*
// @version 0.0.1.20250620185036
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540050/Hide%20Falcon%20LLM%20Profile%20Image%20Container.user.js
// @updateURL https://update.greasyfork.org/scripts/540050/Hide%20Falcon%20LLM%20Profile%20Image%20Container.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideAllProfileContainers = () => {
        const imgs = document.querySelectorAll('#chat-container img[alt="profile"]');
        imgs.forEach(img => {
            const container = img.closest('div');
            if (container) {
                container.style.display = 'none';
            }
        });
    };

    // Attempt immediately
    hideAllProfileContainers();

    // Observe for future DOM changes
    const observer = new MutationObserver(() => hideAllProfileContainers());
    observer.observe(document.body, { childList: true, subtree: true });
})();
