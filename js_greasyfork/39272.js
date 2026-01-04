// ==UserScript==
// @name         Yeezy Supply Registration
// @namespace    http://yeezysupply.com/
// @version      0.0.1
// @description  Add back the YS login form
// @author       egonny
// @match        *://*.yeezysupply.com/account/register
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39272/Yeezy%20Supply%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/39272/Yeezy%20Supply%20Registration.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addForm(path, data, appendTo) {
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', path);

    function constructElements(item, parentString, isChild) {
        for (var key in item) {
            if (item.hasOwnProperty(key) && item[key] != null) {
                if (Object.prototype.toString.call(item[key]) === '[object Object]') {
                    constructElements(item[key], parentString + key, true);
                } else {
                    var container = document.createElement('div');
                    container.className = 'F__field_transparent';
                    var field = document.createElement('input');
                    field.className = 'F__input js-required';
                    if (parentString !== 'customer') {
                        field.setAttribute('type', 'hidden');
                    } else if (key === 'password' || key === 'email') {
                        field.setAttribute('type', key);
                    } else {
                        field.setAttribute('type', 'text');
                    }
                    field.setAttribute('placeholder', key.replace('_', ' '));

                    if (!isChild) {
                        field.setAttribute('name', parentString + key);
                    } else {
                        field.setAttribute('name', parentString + '[' + key + ']');
                    }
                    field.value = item[key];
                    container.appendChild(field);
                    form.appendChild(container);
                }
            }
        }
    }

    constructElements(data, '');
    var submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    form.appendChild(submit);
    if (!appendTo) {
        appendTo = document.body;
    }
    appendTo.appendChild(form);
}

addForm('/account', {
    form_type: 'create_customer',
    utf8: '✓',
    customer: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    }
}, document.querySelector('.B__container'));
})();