// ==UserScript==
// @name         X Bookmarks Quick Access
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show floating bookmark button on Twitter/X pages only
// @author       biganthonymo
// @match        *://x.com/*
// @match        *://www.x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531383/X%20Bookmarks%20Quick%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/531383/X%20Bookmarks%20Quick%20Access.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Avoid duplicates
    if (document.getElementById('x-bookmark-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'x-bookmark-btn';
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="24px" height="24px">
            <path d="M17 3H7a2 2 0 00-2 2v16l7-3.18L17 21V5a2 2 0 00-2-2z"/>
        </svg>
    `;

    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#1DA1F2',
        borderRadius: '50%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '99999',
        transition: 'transform 0.2s ease',
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });

    btn.title = 'Go to Bookmarks';
    btn.onclick = () => {
        window.location.href = 'https://x.com/i/bookmarks';
    };

    document.body.appendChild(btn);
})();
