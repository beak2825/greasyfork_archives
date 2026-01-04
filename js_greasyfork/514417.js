// ==UserScript==
// @name         NBXM
// @namespace    qiwip
// @version      2024-12-27
// @description  DX网页版插件
// @author       none
// @match        https://x.sankuai.com/*
// @icon         https://x.sankuai.com/public/images/dxfav1.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514417/NBXM.user.js
// @updateURL https://update.greasyfork.org/scripts/514417/NBXM.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cache = new Map();

    async function findUserOrgByMisId(misId) {
        if (cache.has(misId)) {
            return cache.get(misId);
        }

        const response = await GM.xmlHttpRequest({ url: "https://km.sankuai.com/api/users/neixin/search?input=" + misId }).catch(e => console.error(e));
        let data = JSON.parse(response.responseText);
        if (data.status === 0 && Array.isArray(data.data.users)) {
            for (const userEntry of data.data.users) {
                for (const [username, userDetails] of Object.entries(userEntry)) {
                    if (userDetails.account === misId) {
                        cache.set(misId, userDetails.orgNamePath);
                        return userDetails.orgNamePath;
                    }
                }
            }
        }
        return "未知部门";
    }
    // Regular expression to match possible MIS numbers
    const misRegex = /^(?:\w+|[a-zA-Z]\.[a-zA-Z]|wb_\w+)$/;
    // Function to get the currently selected text
    function getSelectedText() {
        return window.getSelection ? window.getSelection().toString().trim() : "";
    }

    // Create positioned tooltip div
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.cssText = `
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 60000;
        pointer-events: none;
        display: none;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    const tooltip = createTooltip();

    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            document.removeEventListener('dblclick', handleDoubleClick);
            document.body.addEventListener('dblclick', handleDoubleClick);

            document.removeEventListener('mousemove', hideTooltipOnMouseMove);
            document.body.addEventListener('mousemove', hideTooltipOnMouseMove);
        }
    };

    async function handleDoubleClick(event) {
        event.stopPropagation();
        if (document.URL!=`https://x.sankuai.com/chat/137440125519?type=pubchat`) return;

        const selectedText = getSelectedText();

        if (!selectedText || !misRegex.test(selectedText)) return;

        try {
            const org = await findUserOrgByMisId(selectedText);
            tooltip.innerHTML = `${org}`;

            // Position the tooltip relative to mouse coordinates
            const rect = event.target.getBoundingClientRect();
            tooltip.style.left = `${event.clientX + 20}px`;
            tooltip.style.top = `${event.clientY + 20}px`;

            tooltip.style.display = 'block';
        } catch (e) {
            console.error("Error retrieving organization:", e);
            tooltip.textContent = `MIS ID: ${selectedText}\n Error: Failed to retrieve Organization information.`;
        }
    }
    function hideTooltipOnMouseMove() {
        tooltip.style.display = 'none';
    }
})();