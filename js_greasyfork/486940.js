// ==UserScript==
// @name         Amazon Short Link Converter
// @namespace    http:///
// @version      1.1
// @description  Shorten Amazon links and show them in a floating box at the bottom left.
// @author       Crazy52
// @license      MIT
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amazon.com/dp/*
// @match        https://www.amazon.com/*/gp/*
// @match        https://www.amazon.com/gp/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486940/Amazon%20Short%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/486940/Amazon%20Short%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const convertToShortLink = url => url.match(/\/(dp|gp\/product)\/([\w-]+)/) ? `https://amzn.com/dp/${url.match(/\/(dp|gp\/product)\/([\w-]+)/)[2]}` : null;

    const createFloatingBox = shortLink => {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;background-color:#333;color:#fff;border-radius:5px;overflow:hidden;font-size:14px;height:30px;transition:width 0.3s ease-in-out;';
        document.body.appendChild(container);

        const tab = document.createElement('div');
        tab.style.cssText = 'width:30px;height:30px;background-color:#333;border-top-left-radius:5px;border-bottom-left-radius:5px;cursor:pointer;text-align:center;line-height:30px;font-size:18px;float:left;';
        tab.innerHTML = '&#128279;';
        container.appendChild(tab);

        const content = document.createElement('div');
        content.style.cssText = 'padding:0;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:0;height:100%;display:flex;justify-content:center;align-items:center;';
        container.appendChild(content);

        let isOpen = false;
        const toggleBox = () => {
            tab.innerHTML = isOpen ? '&#128279;' : '&#128279';
            content.style.width = isOpen ? '0' : 'auto';
            content.style.padding = isOpen ? '0' : '10px';
            content.textContent = isOpen ? '' : shortLink;
            isOpen = !isOpen;
        };

        const handleClick = event => {
            if (event.target === tab) {
                event.stopPropagation();
                toggleBox();
            }
        };

        tab.addEventListener('click', handleClick);
        content.addEventListener('click', () => {
            if (isOpen) {
                GM_setClipboard(shortLink);
                showNotification('Link copied to clipboard');
            } else {
                toggleBox();
            }
        });
        document.body.addEventListener('click', handleClick);

        return container;
    };

    const showNotification = message => {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background-color:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:5px;font-size:14px;animation:fadeIn 3s ease;';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.remove(); }, 3000);
    };

    const amazonLinks = document.querySelectorAll('a[href*="amazon.com"]');
    amazonLinks.forEach(link => {
        const shortLink = convertToShortLink(link.href);
        if (shortLink) link.href = shortLink;
    });

    const shortLink = convertToShortLink(window.location.href);
    if (shortLink) createFloatingBox(shortLink);
})();
