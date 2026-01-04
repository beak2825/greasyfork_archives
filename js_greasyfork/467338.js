// ==UserScript==
// @name         Grundos Cafe Battledome Utility
// @namespace    grundos.cafe
// @version      1.0.4
// @description  Remember last selected battledome weapons and options
// @author       eleven, wibreth
// @match        https://www.grundos.cafe/dome/1p/battle/*
// @match        https://www.grundos.cafe/dome/1p/endbattle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/467338/Grundos%20Cafe%20Battledome%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/467338/Grundos%20Cafe%20Battledome%20Utility.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    let weapons = [];
    let weaponID = '';
    if ($('div#combatlog').text().indexOf('The fight commences!') !== -1) {
        if (GM_getValue('sw1', false)) weapons.push(GM_getValue('sw1'))
        if (GM_getValue('sw2', false)) weapons.push(GM_getValue('sw2'))
    }
    if (weapons.length === 0) {
        weapons = GM_getValue('weapons', []);
    }
    for (const weapon of weapons) {
        $('#bd-form table input').each(function() {
            if ($(this).val() !== weaponID && $(this).parent().text().trim().toLowerCase() === weapon.toLowerCase()) {
                weaponID = $(this).val();
                if (!$(this).prop('checked')) {
                    $(this).click();
                }
                return false;
            }
        });
    }

    if (document.URL.indexOf('/dome/1p/battle/') !== -1) {
        let btn = $('#bd-form input[type=submit], #bd-form-end input[type=submit]').clone();
        btn.click(() => {
            $('input[type=submit]').prop('disabled', true);
            $('#bd-form, #bd-form-end').submit();
        });
        $('#page_content').prepend(btn);
    } else if (document.URL.indexOf('/dome/1p/endbattle/') !== -1) {
        let btn = $('#bd-form-rematch input[type=submit]').clone();
        btn.click(() => {
            $('input[type=submit]').prop('disabled', true);
            $('#bd-form-rematch').submit();
        });
        $('#page_content').prepend(btn);
    }

    if (GM_getValue('ability')) { $('form#bd-form select#ability').val(GM_getValue('ability')) }
    if (GM_getValue('power')) { $('form#bd-form select#power').val(GM_getValue('power')) }
    let height = !GM_getValue('height') ? 100 : GM_getValue('height');
    let width = !GM_getValue('width') ? 200 : GM_getValue('width');
    $('form#bd-form input[type=submit], #page_content > input[type=submit]:first-child').css({'height':height + 'px', 'width':width + 'px'});

    let ability = '';
    let power = '';

    $('form#bd-form').on('submit', function() {
        if ($('#bd-form table').length === 0) {
            return; // frozen
        }

        weapons = [];
        $('#bd-form table input:checked').each(function() {
            weapons.push($(this).parent().text().trim());
        });

        ability = $('form#bd-form select#ability').find(':selected').val();
        power = $('form#bd-form select#power').find(':selected').val();
        GM_setValue('weapons', weapons);
        GM_setValue('ability', ability);
        GM_setValue('power', power);
    });

    GM_registerMenuCommand('Set Starting Weapon 1', function() {
        let value = prompt('Set the first starting weapon for each battle.', GM_getValue('sw1', ''));
        if (value) GM_setValue('sw1', value.trim());
    }, '1');
    GM_registerMenuCommand('Set Starting Weapon 2', function() {
        let value = prompt('Set the second starting weapon for each battle.', GM_getValue('sw2', ''));
        if (value) GM_setValue('sw2', value.trim());
    }, '2');
    GM_registerMenuCommand('Clear Starting Weapon 1', function() {
        GM_deleteValue('sw1');
    }, '1');
    GM_registerMenuCommand('Clear Starting Weapon 2', function() {
        GM_deleteValue('sw2');
    }, '2');
    GM_registerMenuCommand('Set Button Height', function() {
        let value = prompt('Enter the pixel height value of the Go! button.', GM_getValue('height', 100));
        if (value) GM_setValue('height', value.trim());
    }, 'h');
    GM_registerMenuCommand('Set Button Width', function() {
        let value = prompt('Enter the pixel width value of the Go! button.', GM_getValue('width', 200));
        if (value) GM_setValue('width', value.trim());
    }, 'w');
})();