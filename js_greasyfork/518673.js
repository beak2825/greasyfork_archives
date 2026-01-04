// ==UserScript==
// @name         Greasyfork Script Icon
// @description  Displays the clickable favicon of scripts.
// @icon         https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version      1.4
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://greasyfork.org/*/scripts/*
// @match        https://sleazyfork.org/*/scripts/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518673/Greasyfork%20Script%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/518673/Greasyfork%20Script%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function addIconToHeader() {
        const firstListItem = document.querySelector('.script-show-applies-to .block-list li:first-child');
        const h2Element = document.querySelector('header h2');
        if (!firstListItem || !h2Element || h2Element.querySelector('img')) return false;

        const domain = (firstListItem.querySelector('a')?.textContent || firstListItem.textContent).trim();
        if (!domain) return false;

        h2Element.style.cssText = 'display:flex;align-items:center;gap:10px;margin:0;min-height:32px;';
        
        const iconLink = document.createElement('a');
        iconLink.href = `http://${domain}`;
        iconLink.target = '_blank';
        iconLink.style.cssText = 'text-decoration:none;display:flex;align-items:center;';
        
        const iconImg = document.createElement('img');
        iconImg.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;
        iconImg.style.cssText = 'width:32px;height:32px;flex-shrink:0;cursor:pointer;display:block;';
        
        iconImg.title = `Visit ${domain}`;
        
        const textSpan = document.createElement('span');
        textSpan.style.cssText = 'display:flex;align-items:center;flex:1;';
        textSpan.textContent = h2Element.textContent;
        
        iconLink.appendChild(iconImg);
        h2Element.replaceChildren(iconLink, textSpan);
        
        return true;
    }

    function init(attempts = 10) {
        if (addIconToHeader() || attempts < 1) return;
        setTimeout(() => init(attempts - 1), 50);
    }

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', () => init())
        : init();

    new MutationObserver(() => init(5)).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();