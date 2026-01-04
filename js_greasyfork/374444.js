// ==UserScript==
// @name         Transfer to Planet
// @namespace    github.com/odahviing/warfacts
// @version      0.4
// @description  Provide option to send fleet to planet directly
// @author       Odahviing
// @match        http://www.war-facts.com/fleet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374444/Transfer%20to%20Planet.user.js
// @updateURL https://update.greasyfork.org/scripts/374444/Transfer%20to%20Planet.meta.js
// ==/UserScript==

// Version 0.1 - Beta Version
// Version 0.2/3 - Add setTimeout
// Version 0.4 - Fix verify bug

(function() {
    'use strict';
    if (isCallBack() == true)
        setTimeout(pressTheButton, 250);
    else
        prepareScript()
})();

function prepareScript() {
    setTimeout(addOption, 300);
    setTimeout(hookButton, 300);
}

function addOption() {
    var fleetOption = document.getElementById('tpos');
    if (fleetOption)
        fleetOption.innerHTML = fleetOption.innerHTML + `<option value="planet">Planet</option>`;

}

function hookButton() {
    originalGetMission = getMission;
    getMission = function(str1, str2) {
        if (!document.getElementById('tpos') || document.getElementById('tpos').value != 'planet') {
            return originalGetMission(str1, str2);
        }
        else {
            let planetId = document.getElementById('xyz').value;
            let fleetId = getFleetNumber();
            window.location = `/fleet.php?tworld=${planetId}&fleet=${fleetId}#press=1`;
            return;
        }
    }
}

function getFleetNumber() {
    let tmpUrl = document.URL;
    return tmpUrl.indexOf('?') > 0 ?
        tmpUrl.split('?')[1].split('=')[1] :
        tmpUrl.split('/')[4];
}

function pressTheButton() {
    getMission('launch');
}

function isCallBack() {
    return document.URL.indexOf('press=1') > 0;
}