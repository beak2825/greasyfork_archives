// ==UserScript==
// @name         Views/Follow Ratio [neocities.org]
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displays Views/Follow ratio
// @author       https://neocities.org/site/dimden
// @match        https://neocities.org/site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neocities.org
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450178/ViewsFollow%20Ratio%20%5Bneocitiesorg%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/450178/ViewsFollow%20Ratio%20%5Bneocitiesorg%5D.meta.js
// ==/UserScript==

let stats = document.getElementsByClassName('stats')[0];
let div = document.createElement('div');
div.className = 'stat';
div.innerHTML = `
    <strong>${Math.round(+stats.children[0].children[0].innerText.replace(/,/g, '') / +stats.children[1].children[0].innerText.replace(/,/g, ''))}</strong>
    <span>Views/Follow</span>
`;
stats.append(div);