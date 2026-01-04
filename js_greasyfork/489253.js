// ==UserScript==
// @name         Huug shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  Shortcuts for Farm towns and Indexing
// @author       HuugTheSeal
// @match        https://*.grepolis.com/game/*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn2.iconfinder.com%2Fdata%2Ficons%2Fanimal-vivid-volume-3%2F256%2FSeal-512.png&f=1&nofb=1&ipt=5c00f56e9c4fb707e1ba901de6214cc7c036a4ec2868e7c37353f2ef03319ed2&ipo=images
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489253/Huug%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/489253/Huug%20shortcuts.meta.js
// ==/UserScript==

function triggerButton(selector, buttonName) {
    const button = document.querySelector(selector);
    if (button && button.offsetParent !== null) {
        button.click();
        console.log(`Button pressed: ${buttonName}`);
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '.':
            triggerButton('.btn_next', 'Next button');
            break;
        case ',':
            triggerButton('.btn_prev', 'Previous button');
            break;
        case '/':
            triggerButton('.gd_btn_index', 'Index button');
            break;
        case ';':
            triggerButton('.btn_spend_shards.button_new.icon_right.icon_type_map_currency', 'Spend Shards button');
            break;
        case '-': // '-' key code
            triggerButton('a[onclick^="w(this).sendMessage(\'sendUnits\', \'support\', \'town_info\'"]', 'Send Units button');
            triggerButton('#btn_attack_town', 'Attack Town button');
            break;
        case '=': // '=' key code
            triggerButton('.button_new.square.remove.js-delete.cancelable', 'Delete button');
            break;
        case '\'': // ';' key code
            triggerButton('.button_close.button_new', 'Close button');
            break;
        case 'q': // Q
            triggerButton('.button.send_resources_btn', 'Send Resources button');
            break;
        default:
            break;
    }
});
