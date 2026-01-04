// ==UserScript==
// @name         Habblet ADS
// @namespace    fuckretros
// @description  Script para ocultar a rádio e anuncios do habblet
// @license      MIT
// @version      0.1
// @author       marcos/marc
// @include      *
// @icon         https://www.google.com/s2/favicons?domain=habblet.city
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489204/Habblet%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/489204/Habblet%20ADS.meta.js
// ==/UserScript==

GM_addStyle(`
  .usermotto, .motto, .motto-container, .motto-content {
    user-select: text !important;
   }

  #ad1, #ad2, div.fc-ab-root {
    display: none !important;
  }
`)

if (location.host === 'www.habblet.city') {
    setInterval(() => {
        const elements = document.querySelectorAll('.fc-ab-root')
        const googleads = document.querySelectorAll('.adsbygoogle')
        const warnings = [...document.querySelectorAll('div')].filter(e => e.outerHTML.includes('bottom: 0px; left: 0px; position: fixed;'))

        if (elements.length) elements.forEach(e => e.remove());
        if (warnings.length) warnings.forEach(e => e.remove());
        if (googleads.length) googleads.forEach(e => e.remove());
    }, 1);

    document.querySelector('#area_player').remove();
}