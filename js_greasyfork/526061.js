// ==UserScript==
// @name         Epitaph Enhancements
// @namespace    com.wangnianyi2001.userscript
// @license      MIT
// @version      1.0.0
// @author       Nianyi Wang
// @match        https://mkremins.github.io/epitaph/
// @grant        none
// @description  Makes Epitaph's GUI more user-friendly.
// @downloadURL https://update.greasyfork.org/scripts/526061/Epitaph%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/526061/Epitaph%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const s = document.createElement('style');
    s.innerText = `
* {
    flex-wrap: nowrap;
}
html, body, #app, .app {
    height: 100%;
    max-height: 100%;
    position: relative;
}
.app {
   display: flex;
   flex-direction: column;
   align-items: stretch;
   justify-content: flex-start;
}
body {
    margin: 0;
    padding: 0;
}
.top-bar {
    position: relative;
}
.civs {
    flex: 1;
    display: flex;
    flex-direction: row;
    position: relative;
    padding-inline: 1em;
    max-width: 100%;
    overflow-x: auto;
}
.civ {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    position: relative;
    min-width: 280px;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    margin: 0;

    transition-property: opacity;
    transition-duration: 30s;
}
.events {
    display: flex;
    flex-direction: column-reverse;
}
.civ .profile {
    position: sticky;
    bottom: 0px;
    width: 100%;
    height: 2em;
    margin-bottom: 0;
    background-color: #222;
}
.civ.extinct {
   opacity: 0 !important;
}
    `;
    document.body.append(s);
    const el = new Map();
    setInterval(function() {
        for(const e of document.getElementsByClassName('extinct')) {
            if(el.has(e))
                continue;
            el.set(e, 30000);
        }
        for(let [e, t] of el.entries()) {
            if(t <= 0) continue;
            el.set(e, t -= 1000);
            if(t <= 0)
                e.style.display = 'none';
        }
    }, 1000);
})();