// ==UserScript==
// @name         Astral WCL Personal Log Decoration
// @namespace    https://www.warcraftlogs.com/
// @version      0.03
// @description  Add Astral recruitment decoration to WCL pages
// @author       Pewbies / Faignz
// @match        https://www.warcraftlogs.com/character/*/*/*
// @match        https://www.warcraftlogs.com/character/id/*
// @icon         https://www.astralguild.com/styles/astral/xenforo/xenforo-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491101/Astral%20WCL%20Personal%20Log%20Decoration.user.js
// @updateURL https://update.greasyfork.org/scripts/491101/Astral%20WCL%20Personal%20Log%20Decoration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addAstralButton();

    const buildListOfLinks = ( wclId ) => {
        return [
            { 'service': 'WoW Analyzer', 'image': 'https://wowanalyzer.com/favicon.ico', 'url': `https://wowanalyzer.com/report/${ wclId }` },
            { 'service': 'Warcraft Logs', 'image': 'https://www.wipefest.gg/favicon.ico', 'url': `https://www.wipefest.gg/report/${ wclId }?gameVersion=warcraft-live` },
        ]
    }

    window.startProcessing = function( status ) {
        if ( status ) { addAstralLinks(); }
        else { alertUser( 'Please select a boss fight then click this button again.' ); }
    }

    function addAstralLinks() {
        Array.from( document.getElementById('boss-table').children[0].children )[0].insertCell().innerHTML = `<img src='https://www.astralguild.com/styles/astral/xenforo/xenforo-logo.png' style='height: 20px; display: block; margin-left: auto; margin-right: auto;'>`;
        Array.from( document.getElementById('boss-table').children[1].children ).forEach( row => {
            const wclogUrl = row.getElementsByClassName('rank-per-second')[0].children[0].href;
            const wclId = wclogUrl.split('/').pop().split('#')[0];
            const linkObj = buildListOfLinks(wclId);
            const displayHtml = linkObj.reduce( (acc, curr) => {
                acc += `<a href = '${ curr.url }' target='_blank'> <img src='${ curr.image }'/> </a>&nbsp;&nbsp`;
                return acc;
            }, '')
            row.insertCell().innerHTML += displayHtml;
        })
    }

    function addAstralButton() {
        const div = document.createElement('div');
        div.innerHTML = ( `<button class='addAstralLinks' style='position: fixed; top: 0; right: 0; z-index: 99999; height: 30px; background-repeat: no-repeat; background-size: contain; width: 100px; background-color: #111826; background-image:url("https://www.astralguild.com/styles/astral/xenforo/xenforo-logo.png")' onclick='startProcessing(checkForCorrectTable())'/></button>`);
        document.body.prepend(div);
    }

    window.checkForCorrectTable = function() { return document.getElementById('boss-table') || false; }

    function alertUser( message ) { alert(message); }
})();
