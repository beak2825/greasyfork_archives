// ==UserScript==
// @name         Bloxd Account Generator (Reset)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Jhonny-The
// @description  it will clear your data kinda = kinda new account?
// @icon         https://www.svgrepo.com/svg/343263/reset
// @match        https://bloxd.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534762/Bloxd%20Account%20Generator%20%28Reset%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534762/Bloxd%20Account%20Generator%20%28Reset%29.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '50px';
    box.style.right = '20px';
    box.style.background = '#222';
    box.style.color = '#fff';
    box.style.padding = '10px';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    box.style.zIndex = '9999';
    box.style.fontFamily = 'sans-serif';


    const title = document.createElement('div');
    title.innerText = '🔧 Guest Account Generator';
    title.style.marginBottom = '10px';
    box.appendChild(title);


    const btn = document.createElement('button');
    btn.innerText = 'Create New Guest Account';
    btn.style.padding = '6px 12px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {

        localStorage.clear();

        document.cookie.split(";").forEach(c => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
        });

        alert("✅ Guest account reset.\nPage will now reload.");
        location.reload();
    };
    box.appendChild(btn);

    // Append to page
    document.body.appendChild(box);
})();