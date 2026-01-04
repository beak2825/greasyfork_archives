// ==UserScript==
// @name         Pretty LAD Schema
// @version      1.1.1
// @description  Show pretty version of LAD Schema pages
// @author       Busung Kim
// @match        https://lad-schema.line-apps.com/subjects/**
// @match        https://lad-schema.line-apps-beta.com/subjects/**
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addElement
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/10.0.0/jsoneditor.min.js
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/10.0.0/jsoneditor.min.css
// @license      MIT
// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/484421/Pretty%20LAD%20Schema.user.js
// @updateURL https://update.greasyfork.org/scripts/484421/Pretty%20LAD%20Schema.meta.js
// ==/UserScript==
/* global JSONEditor */
(function() {
    'use strict';

    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));

    const pre = document.getElementsByTagName('pre')[0];
    pre.style = 'display: none';

    const linkPanelElem = GM_addElement(document.body, 'div', {
        id: 'controller',
        style: 'width: 70%; margin-left: auto; margin-right: auto; margin-top:20px;'
    });
    const rowElem1 = GM_addElement(linkPanelElem, 'div', {});
    const rowElem2 = GM_addElement(linkPanelElem, 'div', {});

    const commonLinkStyle = 'display: inline-block; margin-right: 10px; width: 200px';
    GM_addElement(rowElem1, 'a', {
        href: 'https://lad-schema.line-apps-beta.com/subjects/lads.service_log/versions/latest',
        textContent: '[Beta] lads.service_log',
        style: commonLinkStyle
    });
    GM_addElement(rowElem1, 'a', {
        href: 'https://lad-schema.line-apps.com/subjects/lads.service_log/versions/latest',
        textContent: '[Prod] lads.service_log',
        style: commonLinkStyle
    });
    GM_addElement(rowElem2, 'a', {
        href: 'https://lad-schema.line-apps-beta.com/subjects/lads.event/versions/latest',
        textContent: '[Beta] lads.event',
        style: commonLinkStyle
    });
    GM_addElement(rowElem2, 'a', {
        href: 'https://lad-schema.line-apps.com/subjects/lads.event/versions/latest',
        textContent: '[Prod] lads.event',
        style: commonLinkStyle
    });

    const jsonEditorElem = GM_addElement(document.body, 'div', {
        id: 'json-editor',
        style: 'width: 70%; height: 95vh; margin-left: auto; margin-right: auto;'
    });
    const editor = new JSONEditor(jsonEditorElem, {
        mode: 'tree',
        maxVisibleChilds: 1000
    });

    const schemaText = document.getElementsByTagName('pre')[0].innerText;
    const json = JSON.parse(schemaText);
    const schemaJson = JSON.parse(json.schema);
    schemaJson.fields = schemaJson.fields.reverse();
    json.schema = schemaJson;

    editor.set(json);
    editor.expandAll();
})();
