// ==UserScript==
// @name         Twitter fast clean link copy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy tweet links with one click and strip query parameters
// @author       cro
// @match        https://*.twitter.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439383/Twitter%20fast%20clean%20link%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/439383/Twitter%20fast%20clean%20link%20copy.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function()
{
    'use strict';
    let id = 'cro-copy-id';

    let make_button = function()
    {
        let button = document.createElement('button');
        button.textContent = 'copy link';
        button.onclick = function ()
        {
            let url = new URL(button.closest('article').querySelector('[href*="status"]').href);
            url.pathname = url.pathname.split('/').slice(0,4).join('/');
            navigator.clipboard.writeText(url.toString());
        };
        button.id = id;
        return button;
    };

    setInterval(function()
    {
        let nodes = document.querySelectorAll('article div[role="group"]');
        for (let node of nodes)
        {
            if (!node.querySelector(`#${id}`))
            {
                node.lastChild.append(make_button());
            }
        }
    }, 250);
})();