// ==UserScript==
// @name         Internet Roadtrip - April Fools!
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Flip the entire page visually by wrapping content, with a toggle button fixed center-left
// @match        https://neal.fun/internet-roadtrip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538945/Internet%20Roadtrip%20-%20April%20Fools%21.user.js
// @updateURL https://update.greasyfork.org/scripts/538945/Internet%20Roadtrip%20-%20April%20Fools%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.title = 'Internet Roadtrip - April Fools!';

    // Create a wrapper div and move all body children inside it
    const wrapper = document.createElement('div');
    wrapper.id = 'flip-wrapper';
    // Make wrapper fill viewport and use GPU compositing
    wrapper.style.width = '100vw';
    wrapper.style.height = '100vh';
    wrapper.style.willChange = 'transform';
    wrapper.style.transition = 'transform 0.3s ease';

    while (document.body.firstChild) {
        wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);

    // Create the flip toggle button
    const btn = document.createElement('button');
    btn.id = 'flip-button';
    btn.textContent = '🔄 Flip Page';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        zIndex: 10000,
        padding: '10px 14px',
        fontSize: '14px',
        backgroundColor: '#fff',
        border: '1px solid #000',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'none',
    });
    document.body.appendChild(btn);

    let flipped = false;
    btn.addEventListener('click', () => {
        flipped = !flipped;
        wrapper.style.transform = flipped ? 'scaleY(-1)' : 'none';
    });
})();