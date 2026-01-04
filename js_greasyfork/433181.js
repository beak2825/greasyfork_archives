// ==UserScript==
// @name         Fix Reddit Galleries
// @namespace    vaindil
// @version      1.1
// @description  Fixes Reddit gallery links
// @author       vaindil
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433181/Fix%20Reddit%20Galleries.user.js
// @updateURL https://update.greasyfork.org/scripts/433181/Fix%20Reddit%20Galleries.meta.js
// ==/UserScript==

'use strict';

const siteTable = document.getElementById('siteTable');
const callback = () => document.querySelectorAll('a.title[href=""],a.thumbnail[href=""]').forEach(i => { i.href = i.closest('.thing').dataset.url });
const observer = new MutationObserver(callback);
observer.observe(siteTable, { childList: true });
callback();