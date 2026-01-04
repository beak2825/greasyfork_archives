// ==UserScript==
// @name         Bitrix Fields
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show UF codes for fields
// @author       Edward
// @match        https://*.bitrix24.ru/crm/configs/fields/*
// @match        https://*.bitrix24.ru/crm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485156/Bitrix%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/485156/Bitrix%20Fields.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[BitrixFields] Working...');
    window.addEventListener('load', function() {
        let fieldsSettingsItems = document.querySelectorAll('#fields_list tr');
        if (fieldsSettingsItems.length > 0) {
            fieldsSettingsItems.forEach((item, index, array) => {
                if (index >= 2) {
                    let link = item.querySelector('a[target="_self"]');
                    let ufCodeRaw = link.href.split('/');
                    let ufCode = ufCodeRaw[ufCodeRaw.length - 2];

                    item.querySelector('td[align="right"]').innerHTML = ufCode;
                }
            });
        }
        let fieldsCRMItems = document.querySelectorAll('.ui-entity-editor-content-block');
        if (fieldsCRMItems.length > 0) {
            fieldsCRMItems.forEach((element) => {
                let code = element.dataset.cid;
                let field = element.querySelector('label');
                if (field) {
                    field.innerHTML = field.innerHTML + ' <span style="color: red;">' + code + '</span>';
                }
            })
        }
    }, false);
})();