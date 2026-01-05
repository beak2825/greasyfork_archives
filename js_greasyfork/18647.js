// ==UserScript==
// @name         Loot Droop
// @description   Auto click the enter lootdrop modal and close it on vulcun.com
// @match        https://vulcun.com/user/lobby
// @version 0.0.1.20160409220213
// @namespace https://greasyfork.org/users/37930
// @downloadURL https://update.greasyfork.org/scripts/18647/Loot%20Droop.user.js
// @updateURL https://update.greasyfork.org/scripts/18647/Loot%20Droop.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$('.modal:not(#lootEnterModal)').on('shown.bs.modal', function() {
    setTimeout(closeModal, randomBetween(2000,5000));
});

$('#lootEnterModal').on('shown.bs.modal', function() {
    setTimeout(clickLootdrop, randomBetween(5000,15000)); //5s - 15s
});

function clickLootdrop() {
    $('#enter-lootdrop')[0].click();
    var interval = setInterval(function() {
        if($('#dropped-state:visible').length > 0) {
            clearInterval(interval);
            setTimeout(closeModal, randomBetween(2000,5000));
        }
    }, 1000);

}

function randomBetween(min, max) {
    return Math.random()*(max-min) + min;
}

function closeModal() {
    $('.modal').modal('hide')
}