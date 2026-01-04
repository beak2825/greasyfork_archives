// ==UserScript==
// @name     Orcpub to Dice by PCalc
// @include  https://www.dungeonmastersvault.com/*
// @namespace    http://tampermonkey.net/
// @description  Redirect Orcpub links to Dice
// @license MIT
// @author       Igor Makarov
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @version 0.0.1.20241225102113
// @downloadURL https://update.greasyfork.org/scripts/485383/Orcpub%20to%20Dice%20by%20PCalc.user.js
// @updateURL https://update.greasyfork.org/scripts/485383/Orcpub%20to%20Dice%20by%20PCalc.meta.js
// ==/UserScript==

var buttonsCount = 0;
function modifyButtons() {
    let buttons = $('button.roll-button');
    if (buttons.length == buttonsCount) {
        return;
    }
    buttonsCount = buttons.length;
    buttons.each(function() {
        $(this).prop('onclick', null);
        let text = $(this).text();
        $(this).click(function(e){
            e.stopPropagation();
            console.log(`Roll: ${text}`);
            let roll;
            if (text == '0') {
                roll = 'd20';
            } else if (text.startsWith('+') || text.startsWith('-')) {
                roll = `d20${text}`;
            } else if (text.startsWith('v ')) {
                roll = text.replace('v ','');
            } else {
                roll = text;
            }
            if (e.shiftKey) {
                window.location.href = `dice://roll/${roll}(DIS)`;
            } else if (e.ctrlKey || e.metaKey) {
                window.location.href = `dice://roll/${roll}(ADV)`;
            } else {
                window.location.href = `dice://roll/${roll}`;
            }
        });
    });
}

$(document).ready(modifyButtons);
$(document).bind("DOMSubtreeModified", modifyButtons);