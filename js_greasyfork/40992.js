// ==UserScript==
// @name         yellow-dlp-page-testing
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  try to take over the world!
// @author       You
// @include      http*://beryllium.*.yellow.co.nz/y/*
// @require      https://unpkg.com/mithril/mithril.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40992/yellow-dlp-page-testing.user.js
// @updateURL https://update.greasyfork.org/scripts/40992/yellow-dlp-page-testing.meta.js
// ==/UserScript==

var actions = {
    email: {
        el: document.querySelector('.emailBusiness'),
        submitEl: document.getElementById('sendEmailPopup_business'),
        fillup: () => {
            actions.email.el.click();
            $('#fromAddress').ready(() => {
                // NOTE there's 2 items with id=fromAddress
                document.querySelector('#dialog-email-business [name=fromAddress]').value = 'eric.ye@yellow.co.nz';
                document.querySelector('#dialog-email-business [name=message]').value = 'test message from eric ' + new Date();
                setTimeout(() => actions.email.submitEl.click(), 2000);
            });
        }
    }
};

var EmailAddon = {
    view: () => {
        return m('div', {class: 'testing-addon', onclick: actions.email.fillup}, 'Email business');
    }
};


(function() {
    'use strict';

    // styles
    GM_addStyle('.serialized-view {width: 100%; min-height: 800px; display: none;}');
    GM_addStyle(
        '.testing-addon {' +
        '  margin-top: 45px;' +
        '  padding: 5px;' +
        '  text-align: center;' +
        '  background-color: #808080;' +
        '  color: white;' +
        '  width: 128px;' +
        '  opacity: 0.5;' +
        '  border: 1px solid #ccc;' +
        '  border-radius: 5px;' +
        '  cursor: pointer;' +
        '}'
    );
    GM_addStyle(
        '.testing-addon:hover {' +
        '  background-color: black;' +
        '}'
    );


    var emailAddon = document.createElement('div');
    m.mount(emailAddon, EmailAddon);
    actions.email.el.parentElement.appendChild(emailAddon);
})();
