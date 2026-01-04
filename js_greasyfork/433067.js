// ==UserScript==
// @name         Mint Theme
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A mint theme for the WPI Hub (requires Theme Engine)
// @author       You
// @match        https://hub.wpi.edu/*
// @icon         https://www.google.com/s2/favicons?domain=wpi.edu
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/433067/Mint%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/433067/Mint%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (!window.themeEngine) {
        window.themeEngine = new Array();
    }

    let theme = {
        style: `
body.mint {
    --color-light: #FAFAFA;
    --color-chrome: #344;
    --color-lane: #276;
    --color-lane-subtle: #0A8;
    --color-lane-subtler: #699;
    --color-lane-subtless: #ACC;
    --color-header-icons: #2DA;
    --color-header-icons-h: #0EC;
    --color-header-chrome: #233;
    --color-body: #022;
    --color-body-headers: #FAFAFA;
    --color-body-subtitle: #EFF;
    --color-body-text: #FAFAFA;
    --color-pop: #2DB;
    --color-bright-1: var(--color-pop);
    --color-pop-h: #0A8;
    --color-pop-light: #0EC;
    --opacity-img: .8;
    --color-brand-primary: #0EC;
    --color-brand-alt: #212;
    --color-brand-primary-h: #455;
    --color-brand-stop-1: var(--color-header-icons);
    --color-brand-stop-2: var(--color-header-icons-h);
    --color-brand-stop-1-h: var(--color-lane-subtle);
    --color-brand-stop-2-h: var(--color-lane-subtle);
    --color-brand-alt-h: #0EC;
}

.profile-option label.mint span {
    background: #0CA;
}`,

        name: 'mint',
        title: 'Mint'
    };

    window.themeEngine.push(theme);
    const style = document.createElement('style');
    style.innerHTML = theme.style;
    document.querySelector('head').appendChild(style);
    console.log(`Added theme ${theme.name}!`);
})();