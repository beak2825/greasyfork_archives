// ==UserScript==
// @name NelsonMandela
// @description Reply to email with the msg variable
// @author JlXip
// @namespace NelsonMandela
// @version 1.0.0-RC1
// @include https://mail.google.com/mail/u/0/*

// @require http://code.jquery.com/jquery-git.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349

// @license APACHE LICENSE 2.0
// @downloadURL https://update.greasyfork.org/scripts/32210/NelsonMandela.user.js
// @updateURL https://update.greasyfork.org/scripts/32210/NelsonMandela.meta.js
// ==/UserScript==

msg = 'Are you Nelson Mandela??????????!!!!!!!!!!!!!!!';

function run() {
    $('div[role=textbox]').append(msg);
}

function addButton() {
    // TODO: Check if the button already exists

    newContainer = $('<div class="G-Ni J-J5-Ji"></div>');

    newButton = $('<div class="T-I J-J5-Ji aFi T-I-ax7 ar7"></div>'); // CAMBIA
    newButton.hover(() => {newButton.addClass('T-I-JW');}, () => {newButton.removeClass('T-I-JW');});
    newButton.on('click', () => {
        run();
    });

    newContent = $('<div class="Bn"></div>');
    newContent.append('Nelson Mandela');

    newButton.append(newContent);
    newContainer.append(newButton);
    $('div.G-tF').append(newContainer);
}

$(function() {
    waitForKeyElements('div.G-tF', addButton);
});