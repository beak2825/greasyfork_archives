// ==UserScript==
// @name         Astral WoWProgress Character Information Decorator
// @namespace    https://www.wowprogress.com
// @version      0.03
// @description  Add Astral recruitment decoration to WCL pages
// @author       Pewbies / Faignz
// @match        https://www.wowprogress.com/character/*/*/*
// @icon         https://www.astralguild.com/styles/astral/xenforo/xenforo-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491043/Astral%20WoWProgress%20Character%20Information%20Decorator.user.js
// @updateURL https://update.greasyfork.org/scripts/491043/Astral%20WoWProgress%20Character%20Information%20Decorator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addAstralButton();

    const buildListOfLinks = ( characterUrl ) => {
        return [
            { 'service': 'Raider IO', 'image': 'https://cdn.raiderio.net/images/favicon-32x32.png', 'url': `https://raider.io/characters/${ characterUrl }` },
            { 'service': 'Warcraft Logs', 'image': 'https://assets.rpglogs.com/img/warcraft/favicon.png', 'url': `https://www.warcraftlogs.com/character/${ characterUrl }` },
        ]
    }

    window.startProcessing = function( characterUrl ) {
        if ( characterUrl ) { addAstralLinks(characterUrl); }
        else { alertUser( 'Please view a character then click this button again.' ); }
    }

    function addAstralLinks( characterUrl ) {
        const linkObj = buildListOfLinks( characterUrl );
        console.log(linkObj);
        const displayHtml = linkObj.reduce( (acc, curr) => {
            acc += `<a href = '${ curr.url }' target='_blank'> <img src='${ curr.image }' style='height:32px;'/> </a>&nbsp;&nbsp`;
            return acc;
        }, '')
        addLinkDisplay( displayHtml );
    }

    function addLinkDisplay(displayHtml) {
        console.log(displayHtml);
        const div = document.createElement('div');
        div.innerHTML = ( `<div class='astralLinks' style='position: fixed; top: 30px; right: 0; z-index: 99999; height: 32px; background-color: #111826;' >${ displayHtml }</div>`);
        document.body.prepend(div);
    }

    function addAstralButton() {
        const div = document.createElement('div');
        div.innerHTML = ( `<button class='addAstralLinks' style='position: fixed; top: 0; right: 0; z-index: 99999; height: 30px; background-repeat: no-repeat; background-size: contain; width: 100px; background-color: #111826; background-image:url("https://www.astralguild.com/styles/astral/xenforo/xenforo-logo.png")' onclick='startProcessing(checkForCharacterPage())'/></button>`);
        document.body.prepend(div);
    }

    window.checkForCharacterPage = function() { return window.location.href.split('character/')[1].replace('-','') || false; }

    function alertUser( message ) { alert(message); }
})();
