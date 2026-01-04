// ==UserScript==
// @name         Torn Stats Faction Stats to Spy Format
// @namespace    tornstats.factionstatstospyformat
// @version      1.0.2
// @description  Format your faction spies to the Torn Stats spy format
// @author       Heasley
// @match        https://www.tornstats.com/factions/show/*
// @match        https://www.tornstats.com/spies/faction/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458797/Torn%20Stats%20Faction%20Stats%20to%20Spy%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/458797/Torn%20Stats%20Faction%20Stats%20to%20Spy%20Format.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const spyButton = `<button id="faction_to_spy">Copy members to spy format</button>`;

    let element;
    const url = window.location.href;

    if (url.includes('factions/show')) {
        element = $('#faction-table_wrapper');
        element.before(spyButton);
        $('#faction_to_spy').click(function() {
            createSpyStringFaction();
        });
    }

    if (url.includes('spies/faction')) {
        element = $('#spies-table_wrapper');
        element.before(spyButton);
        $('#faction_to_spy').click(function() {
            createSpyStringSpies();
        });
    }


})();

function createSpyStringFaction() {
    var string = "";
    $('tbody > tr').each(function() {
        let name = $(this).find('span > a').text();
        let level = $(this).find('td:nth-child(3)').text();
        let strength = $(this).find('td:nth-child(4)').text();
        let defense = $(this).find('td:nth-child(5)').text();
        let speed = $(this).find('td:nth-child(6)').text();
        let dexterity = $(this).find('td:nth-child(7)').text();
        let total = $(this).find('td:nth-child(8)').text();

        string += `
Name: ${name}
Level: ${level}

You managed to get the following results:
Speed: ${speed}
Strength: ${strength}
Defense: ${defense}
Dexterity: ${dexterity}
Total: ${total}

`;
    })
    copyTextToClipboard(string);
    $('#faction_to_spy').text('Copied to clipboard!');
    setTimeout(function(){
        $('#faction_to_spy').text('Copy members to spy format');
    }, 2000);

}

function createSpyStringSpies() {
    var string = "";
    $('tbody > tr').each(function() {
        let name = $(this).find('td > a').text();
        let strength = $(this).find('td:nth-child(5)').text();
        let defense = $(this).find('td:nth-child(6)').text();
        let speed = $(this).find('td:nth-child(7)').text();
        let dexterity = $(this).find('td:nth-child(8)').text();
        let total = $(this).find('td:nth-child(9)').text();

        string += `
Name: ${name}

You managed to get the following results:
Speed: ${speed}
Strength: ${strength}
Defense: ${defense}
Dexterity: ${dexterity}
Total: ${total}

`;
    })
    copyTextToClipboard(string);
    $('#faction_to_spy').text('Copied to clipboard!');
    setTimeout(function(){
        $('#faction_to_spy').text('Copy members to spy format');
    }, 2000);

}




function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}