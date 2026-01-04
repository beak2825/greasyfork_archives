// ==UserScript==
// @name         Make Paragraphs Readable
// @namespace    http://tampermonkey.net/
// @version      2025-05-14
// @description  Style paragraphs for better readability
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535954/Make%20Paragraphs%20Readable.user.js
// @updateURL https://update.greasyfork.org/scripts/535954/Make%20Paragraphs%20Readable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeItReadable() {
        document.querySelectorAll('p').forEach(el => {
            Object.assign(el.style, {
                backgroundColor: '#fdf6e3',
                color: '#333333',
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                lineHeight: '1.6',
                maxWidth: '700px',
                margin: '2rem auto',
                padding: '0 1rem'
            });
        });
    }

    // Create and style button
    const button = document.createElement('button');
    button.innerText = 'R';
    Object.assign(button.style, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        padding: '0px 12px',
        fontSize: '14px',
        backgroundColor: '#fdf6e3',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        opacity: 0.4
    });
    button.onclick = makeItReadable;

    document.body.append(button);
})();