// ==UserScript==
// @name         ServiceNow - Update Versions - Highlight different Sources
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight Update Versions with the same Update Set (Source)
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/sys_update_version_list.do*
// @match        https://*.service-now.com/sys_metadata.do?*
// @match        https://*.service-now.com/*.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411666/ServiceNow%20-%20Update%20Versions%20-%20Highlight%20different%20Sources.user.js
// @updateURL https://update.greasyfork.org/scripts/411666/ServiceNow%20-%20Update%20Versions%20-%20Highlight%20different%20Sources.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let palette = [
        '#ED90A466',
        '#ABB15066',
        '#00C1B266',
        '#ACA2EC66'
    ];

    //if (!window.location.pathname.startsWith('/sys_update_version_list.do') && typeof g_form === 'undefined') return;

    let hooks = {
        versions_list: 'div#sys_update_version',
        versions_rellist: '#related_lists_wrapper'
    };

    if (typeof g_form !== 'undefined' && g_form.getTableName() !== 'sys_update_version' &&
        (g_form.getRelatedListNames().includes('REL:67bdac52374010008687ddb1967334ee') || g_form.getRelatedListNames().includes('REL:67bdac52374010008687ddb1967334ee_list'))) {
        console.log('Form with Update Versions related list, creating observer');
        new MutationObserver(observerCallback).observe(document.querySelector(hooks.versions_rellist), { childList: true });
        applySourceColors();
    } else if (document.querySelector(hooks.versions_list)) {
        console.log('Update Versions list, creating observer');
        new MutationObserver(observerCallback).observe(document.querySelector(hooks.versions_list), { childList: true });
        applySourceColors();
    } else {
        console.log('Last chance');
        applySourceColors();
    }

    function observerCallback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            if (!mutation.target.querySelector('table[glide_table="sys_update_version"]')) return;
            console.log('Mutation added table we want to color:', mutation);
            applySourceColors();
        }
    }

    function applySourceColors() {
        let versionsTable = document.querySelector('table[glide_table="sys_update_version"]');
        if (!versionsTable) return;

        let sourceColumn = versionsTable.querySelector('th[name="source"]');
        if (!sourceColumn) return;

        let sourceColumnIdx = [...sourceColumn.parentElement.children].indexOf(sourceColumn);

        let hrefPaletteMap = {};
        let curPalette = -1;
        [...versionsTable.querySelectorAll('td:nth-child('+(sourceColumnIdx+1)+') a')]
            .forEach(e => {
            let id = e.href.match(/[a-f0-9]{32}/);
            if (id in hrefPaletteMap) {
                e.parentElement.setStyle('background-color: ' + hrefPaletteMap[id]);
                // if you also want the column before/after Source to be colored, uncomment these:
                //e.parentElement.previousElementSibling.setStyle('background-color: ' + hrefPaletteMap[id]);
                //e.parentElement.nextElementSibling.setStyle('background-color: ' + hrefPaletteMap[id]);
                return;
            }

            curPalette = (curPalette + 1) % palette.length;
            hrefPaletteMap[id] = palette[curPalette];
            e.parentElement.parentElement.childNodes.forEach(sibling => sibling.setStyle('font-weight: bold; background-color: ' + hrefPaletteMap[id]));
        })
    }
})();