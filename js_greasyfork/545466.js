// ==UserScript==
// @name         Discord Message Text Replacer + Reset + Roblox Embed Tool (No Flicker)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Instantly replace Discord messages on refresh without flicker, plus Roblox embed & reset menu
// @author       ChatGPT
// @match        *://*.discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545466/Discord%20Message%20Text%20Replacer%20%2B%20Reset%20%2B%20Roblox%20Embed%20Tool%20%28No%20Flicker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545466/Discord%20Message%20Text%20Replacer%20%2B%20Reset%20%2B%20Roblox%20Embed%20Tool%20%28No%20Flicker%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'discordTextReplacements';

    function getReplacements() {
        return GM_getValue(STORAGE_KEY, {}) || {};
    }

    function saveReplacements(replacements) {
        GM_setValue(STORAGE_KEY, replacements);
    }

    function getMessageKey(elem) {
        const content = (elem.textContent || '').trim().slice(0, 100);
        const authorElem = elem.closest('[class*="message-"]')?.querySelector('h3');
        const author = authorElem ? authorElem.textContent.trim() : 'unknown';
        return `${author}::${content}`;
    }

    function clearAllOutlines() {
        document.querySelectorAll('[style*="outline"]').forEach(el => {
            try { el.style.outline = ''; } catch (e) {}
        });
    }

    // Replace as soon as element is inserted
    const observer = new MutationObserver(mutations => {
        const replacements = getReplacements();

        for (const m of mutations) {
            if (!m.addedNodes) continue;
            m.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                const targets = node.matches('[class*="messageContent"]')
                    ? [node]
                    : Array.from(node.querySelectorAll('[class*="messageContent"]'));

                targets.forEach(elem => {
                    if (elem.dataset.replaced === '1') return;
                    const key = getMessageKey(elem);
                    if (replacements[key]) {
                        elem.innerHTML = replacements[key];
                        elem.dataset.replaced = '1';
                    }
                });
            });
        }
    });

    // Start observing immediately, even before load
    const startObserver = () => {
        try {
            observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
        } catch { setTimeout(startObserver, 10); }
    };
    startObserver();

    function applySingleReplacement(elem, html) {
        if (!(elem instanceof Element)) return;
        elem.innerHTML = html;
        elem.dataset.replaced = '1';
    }

    function pickAndReplaceText() {
        alert('Click on the message TEXT to replace it.');

        function onMouseOver(e) { try { e.target.style.outline = '2px solid red'; } catch {} }
        function onMouseOut(e) { try { e.target.style.outline = ''; } catch {} }

        function onClick(e) {
            e.preventDefault();
            e.stopPropagation();
            cleanup();

            const contentElem = e.target.closest('[class*="messageContent"]');
            if (!contentElem) return alert('❌ Could not find message content.');

            const key = getMessageKey(contentElem);
            const newHTML = prompt("Enter new message content (HTML allowed):");
            if (newHTML === null) return;

            const replacements = getReplacements();
            replacements[key] = newHTML;
            saveReplacements(replacements);
            applySingleReplacement(contentElem, newHTML);
            clearAllOutlines();
            alert('✅ Message replaced and saved.');
        }

        function cleanup() {
            document.removeEventListener('mouseover', onMouseOver, true);
            document.removeEventListener('mouseout', onMouseOut, true);
            document.removeEventListener('click', onClick, true);
            clearAllOutlines();
        }

        document.addEventListener('mouseover', onMouseOver, true);
        document.addEventListener('mouseout', onMouseOut, true);
        document.addEventListener('click', onClick, true);
    }

    function addRobloxEmbedBelow() {
        alert('Click on the message TEXT you want to add the Roblox embed below.');

        function onMouseOver(e) { try { e.target.style.outline = '2px solid blue'; } catch {} }
        function onMouseOut(e) { try { e.target.style.outline = ''; } catch {} }

        function onClick(e) {
            e.preventDefault();
            e.stopPropagation();
            cleanup();

            const contentElem = e.target.closest('[class*="messageContent"]');
            if (!contentElem) return alert('❌ Could not find message content.');

            const key = getMessageKey(contentElem);
            const robloxEmbed = `<div id="message-accessories-1403787320477487104" class="container_b7e1cb" bis_skin_checked="1"><article class="embedFull__623de embed__623de markup__75297" aria-hidden="false"><div class="gridContainer__623de" bis_skin_checked="1"><div class="grid__623de hasThumbnail__623de" bis_skin_checked="1"><div class="embedSuppressButton__623de" aria-label="Remove all embeds" role="button" tabindex="0" bis_skin_checked="1"><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" class=""></path></svg></div><div class="embedProvider__623de embedMargin__623de" bis_skin_checked="1"><span>Roblox</span></div><div class="embedTitle__623de embedMargin__623de" bis_skin_checked="1"><a class="anchor_edefb8 anchorUnderlineOnHover_edefb8 embedTitleLink__623de embedLink__623de embedTitle__623de" tabindex="0" href="https://www.roblox.com/users/1770677206/profile" rel="noreferrer noopener" target="_blank" role="button">aFz_iReyxiee's Profile</a></div><div class="embedDescription__623de embedMargin__623de" bis_skin_checked="1">aFz_iReyxiee is one of the millions creating and exploring the endless possibilities of Roblox. Join aFz_iReyxiee on Roblox and explore together!prof</div><div class="imageContent__0f481 embedThumbnail__623de" bis_skin_checked="1"><div class="imageContainer__0f481" bis_skin_checked="1"><div class="imageWrapper imageWrapper_af017a imageZoom_af017a clickable_af017a" style="width: 80px; height: 80px;" bis_skin_checked="1"><a tabindex="-1" aria-hidden="true" class="originalLink_af017a" href="https://tr.rbxcdn.com/30DAY-Avatar-6FB199DDEBB0D4A13318D53177663D44-Png/352/352/Avatar/Png/noFilter" data-role="img" data-safe-src="https://images-ext-1.discordapp.net/external/-h7OOazWS7vinJ_WzOGAa1BRqwuy3vNmPP_RdlErfiU/https/tr.rbxcdn.com/30DAY-Avatar-6FB199DDEBB0D4A13318D53177663D44-Png/352/352/Avatar/Png/noFilter?format=webp&amp;width=88&amp;height=88"></a><div class="clickableWrapper_af017a" tabindex="0" aria-label="Image" aria-describedby="uid_4" role="button" bis_skin_checked="1"><div class="loadingOverlay_af017a" style="aspect-ratio: 1 / 1;" bis_skin_checked="1"><img alt="Image" src="https://images-ext-1.discordapp.net/external/-h7OOazWS7vinJ_WzOGAa1BRqwuy3vNmPP_RdlErfiU/https/tr.rbxcdn.com/30DAY-Avatar-6FB199DDEBB0D4A13318D53177663D44-Png/352/352/Avatar/Png/noFilter?format=webp&amp;width=88&amp;height=88" style="width: 80px; height: 80px;"></div></div></div></div></div></div></div></article></div>`;

            const currentHTML = contentElem.innerHTML || '';
            const finalHTML = currentHTML + robloxEmbed;

            const replacements = getReplacements();
            replacements[key] = finalHTML;
            saveReplacements(replacements);
            applySingleReplacement(contentElem, finalHTML);

            if (window.getSelection) {
                const sel = window.getSelection();
                if (sel && sel.removeAllRanges) sel.removeAllRanges();
            }

            clearAllOutlines();
            alert('✅ Roblox embed added below message and saved.');
        }

        function cleanup() {
            document.removeEventListener('mouseover', onMouseOver, true);
            document.removeEventListener('mouseout', onMouseOut, true);
            document.removeEventListener('click', onClick, true);
            clearAllOutlines();
        }

        document.addEventListener('mouseover', onMouseOver, true);
        document.addEventListener('mouseout', onMouseOut, true);
        document.addEventListener('click', onClick, true);
    }

    function resetAllReplacements() {
        if (confirm("⚠️ This will remove ALL replaced/edited messages. Are you sure?")) {
            saveReplacements({});
            alert('♻️ All replaced messages have been reset.');
            location.reload();
        }
    }

    try {
        GM_registerMenuCommand("✏️ Replace a message", pickAndReplaceText);
        GM_registerMenuCommand("➕ Add Roblox embed below a message", addRobloxEmbedBelow);
        GM_registerMenuCommand("♻️ Reset all replaced messages", resetAllReplacements);
    } catch {}
})();
