// ==UserScript==
// @name        TemporaryGPT
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0
// @author      MUmarShahbaz
// @license     MIT
// @description Whenever you initially load onto the ChatGPT website, it will redirect you onto the temporry chat unless you are opening a specifc chat or the image library. Also closes the sidebr, but only on the initial load so that it doesn't stop you from interacting with the website.
// @downloadURL https://update.greasyfork.org/scripts/540226/TemporaryGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/540226/TemporaryGPT.meta.js
// ==/UserScript==

function enable_temp(current_url) {
    if (current_url.includes('chatgpt')) {
        if (!current_url.includes('library') && !current_url.includes('c/') && !current_url.includes('temporary-chat=true')) {
            if (!current_url.includes('?')) current_url = current_url.concat('?');
            location.href = current_url.match(/^https:\/\/chatgpt.com\/?\?.+$/) ? current_url.concat('&temporary-chat=true') : current_url.concat('temporary-chat=true');
        }
    }
}

enable_temp(location.href);

function close_sidebar() {
    const sidebar_toggler = document.querySelector('[data-testid="close-sidebar-button"]');
    if (sidebar_toggler) sidebar_toggler.click();
}

if (location.href.includes('temporary-chat=true')) {
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', close_sidebar);
    } else {
        const sidebar_closer = setInterval(() => {
            if (document.querySelector('[data-testid="close-sidebar-button"]')) {
                close_sidebar();
                clearInterval(sidebar_closer);
            }
        }, 500);
    }
}