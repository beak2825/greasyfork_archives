// ==UserScript==
// @name         Arras.io Analytics Blocker
// @namespace    https://
// @version      2024-12-13
// @description  Blocks requests to and from the Arras.io analytics server.
// @author       JavedPensions
// @match        *://arras.io/*
// @icon         https://arras.io/favicon/2048x2048.png
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520664/Arrasio%20Analytics%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/520664/Arrasio%20Analytics%20Blocker.meta.js
// ==/UserScript==

const oldFetch = window.fetch;

window.fetch = async function(...y2) {
    const url = typeof y2[0] === 'string' ? y2[0] : y2[0].url;

    if (url.includes('analytics')) {
        console.error('blocked fetch request to:', url);
        return Promise.reject(new Error('fetch request quit, is part of the category "analytics".'));
    }

    console.log('received fetch req:', {
        url: url,
        options: y2[1] || {}
    });

    const z3 = await oldFetch(...y2);
    const a4 = z3.clone();

    a4.text().then(b5 => {
        console.log('received fetch resp:', {
            url: z3.url,
            status: z3.status,
            statusText: z3.statusText,
            body: b5
        });
    }).catch(c6 => {
        console.error(c6);
    });

    return z3;
};