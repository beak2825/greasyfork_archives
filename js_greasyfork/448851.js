// ==UserScript==
// @name SPO-NoEdit
// @version 0.1.2
// @description Hide options to edit in SharePoint Online pages
// @author codenameClio
// @match https://*.sharepoint.com/sites/*
// @run-at document-start
// @grant GM_addStyle
// @namespace https://github.com/codenameClio/SPO-NoEdit
// @homepageURL https://github.com/codenameClio/SPO-NoEdit
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448851/SPO-NoEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/448851/SPO-NoEdit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = '{display:none !important;}';
    const selectors = [
        '#HorizontalNav2EditLink',
        '#HorizontalNav0EditLink',
        '#spCommandBar',
        '#FooterEditLink',
        '.ms-Button--hasMenu',
        '.ms-HorizontalNavItem-Edit',
        '[data-automationid="HorizontalNav-edit"]',
        '[data-automationid="SimpleFooter-edit"]',
        '[data-automation-id="newsAddButton"]'
    ];

    selectors.forEach(selector => {
        try {
            GM_addStyle(selector + style);
        } catch (err) {
            console.error(`[SPO-NoEdit] Could not apply style to ${selector}`);
        }
        
    });
})();
