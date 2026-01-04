// ==UserScript==
// @name         ServiceNow - Reference direct link to record
// @version      0.0.5
// @description  Add a direct link button to reference fields in forms
// @author       Matteo Lecca
// @match        *.service-now.com/*.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/484647/ServiceNow%20-%20Reference%20direct%20link%20to%20record.user.js
// @updateURL https://update.greasyfork.org/scripts/484647/ServiceNow%20-%20Reference%20direct%20link%20to%20record.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let referenceList = document.querySelectorAll("button[data-type='reference_popup']:not([style*='display: none'])");

    referenceList.forEach(referenceField => {
        //let table = referenceField.dataset.table;
        let field = referenceField.dataset.ref;
        let form = referenceField.dataset.form;
        let recordId = g_form.getValue(field);

        let buttonLink = document.createElement('a');
        buttonLink.title = '[WK - SN] Direct link to record';
        buttonLink.href = 'https://' + window.location.hostname + '/' + form + '?sys_id=' + recordId;
        buttonLink.classList.add('btn', 'btn-info', 'btn-ref', 'icon', 'icon-arrow-right');

        referenceField.parentNode.append(buttonLink);
    });

    let documentIdList = document.querySelectorAll("a[data-type*='id_document_id_reference_popup']");

    documentIdList.forEach(documentField => {
        let field = documentField.dataset.ref;
        let form = documentField.dataset.form;
        let recordId = g_form.getValue(field);

        let buttonLink = document.createElement('a');
        buttonLink.title = '[WK - SN] Direct link to record';
        buttonLink.href = 'https://' + window.location.hostname + '/' + form + '?sys_id=' + recordId;
        buttonLink.classList.add('btn', 'btn-info', 'btn-ref', 'icon', 'icon-arrow-right');

        documentField.parentNode.append(buttonLink);
    });

    let variableIdList = document.querySelectorAll("a[id^='ni.VE'][id$='LINK.info']");

    variableIdList.forEach(variableField => {
        let elementId = variableField.id.replace('LINK.info', '');
        let form;
        let recordId;
        let tableElem = document.getElementById(elementId + "TABLE");
        if (tableElem) {
            form = tableElem.value;
        }
        let sysIdElem = document.getElementById(elementId);
        if (sysIdElem) {
            recordId = sysIdElem.value;
        }

        if(form && recordId) {
            let buttonLink = document.createElement('a');
            buttonLink.title = '[WK - SN] Direct link to record';
            buttonLink.href = 'https://' + window.location.hostname + '/' + form + '?sys_id=' + recordId;
            buttonLink.classList.add('btn', 'btn-info', 'btn-ref', 'icon', 'icon-arrow-right');

            variableField.parentNode.append(buttonLink);
        }
    });

})();