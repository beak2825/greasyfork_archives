// ==UserScript==
// @name         WME Custom Managed Area Names
// @namespace    https://fxzfun.com/userscripts
// @version      0.0.2
// @description  allows for editing managed area names
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485550/WME%20Custom%20Managed%20Area%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/485550/WME%20Custom%20Managed%20Area%20Names.meta.js
// ==/UserScript==

/* global W, OpenLayers, WazeWrap, trustedTypes */

(function() {
    'use strict';

    const SCRIPT_NAME = GM_info.script.name.toLowerCase().replaceAll(' ', '_');

    function createAreaEntry(parent, id, name) {
        const p = document.createElement('p');
        p.innerText = `#${id} `;
        const i = document.createElement('input');
        i.id = SCRIPT_NAME + '_' + id;
        i.value = name;
        i.onkeyup = () => {
            W.app.attributes.user.attributes.managedAreas.forEach(a => a?.id === 49012 ? a.name = i.value : null);
            localStorage.setItem(SCRIPT_NAME + '_areas', JSON.stringify(W.app.attributes.user.attributes.managedAreas));
            console.log('CMAN: saved area names');
        }
        p.appendChild(i);
        parent.appendChild(p);
    }

    function run() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_NAME);

        tabLabel.innerText = 'Areas';
        tabPane.innerHTML += '<h2>Your Areas</h2>';

        if (localStorage.hasOwnProperty(SCRIPT_NAME + "_areas")) {
            W.app.attributes.user.attributes.managedAreas = JSON.parse(localStorage.getItem(SCRIPT_NAME + "_areas"));
        }

        W.app.attributes.user.attributes.managedAreas.forEach(a => createAreaEntry(tabPane, a.id, a.name));
    }

    W?.userscripts?.state?.isReady ? run() : document.addEventListener("wme-ready", run, { once: true });
})();