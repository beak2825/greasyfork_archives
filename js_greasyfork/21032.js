// ==UserScript==
// @name         Phabricator - Mark as read without confirmation needed
// @namespace    http://tampermonkey.net/
// @description  Make "Marking all notifications as read" a one-click operation instead of a two-clicks operation (with the nagging modal)
// @version      0.1
// @author       Damien <damien@dam.io>
// @include      https://phabricator.*.*/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/21032/Phabricator%20-%20Mark%20as%20read%20without%20confirmation%20needed.user.js
// @updateURL https://update.greasyfork.org/scripts/21032/Phabricator%20-%20Mark%20as%20read%20without%20confirmation%20needed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var template = '' +
        '<form method="POST" class="" data-sigil="jx-dialog" style="display: inline;">' +
        '<input type="hidden" name="__csrf__" value="B@f4f3n7j716a1a0c4e2494b01">' +
        '<input type="hidden" name="__form__" value="1">' +
        '<input type="hidden" name="__dialog__" value="1">' +
        '<input type="hidden" name="chronoKey" value="99999999999999999999999999" data-sigil="aphront-dialog-application-input">' +
        '<button name="__submit__" type="submit" data-sigil="__default__" data-meta="5_0" style="margin-top: 10px;background: inherit;border: none;">' +
        'Mark All Read' +
        '</button>' +
        '</form>';

    // add menu button
    var menu = document.querySelector('.phabricator-main-menu.phabricator-main-menu-background');
    var notifIcon = document.querySelector('.phabricator-main-menu-alerts');
    var markRead = document.createElement('span');
    markRead.innerHTML = template;

    // add csrf token
    var token = document.querySelector('form[action="/search/"]').querySelector('input[name="__csrf__"]').value;
    markRead.querySelector('input[name="__csrf__"]').value = token;
    
    menu.appendChild(markRead, notifIcon);
})();