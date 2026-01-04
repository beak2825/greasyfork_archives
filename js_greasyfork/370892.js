// ==UserScript==
// @name         Auto-Explore
// @namespace    Odahviing
// @author       Odahviing
// @version      1.1
// @description  Allow auto exploration when probing
// @match        http://www.war-facts.com/fleet.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370892/Auto-Explore.user.js
// @updateURL https://update.greasyfork.org/scripts/370892/Auto-Explore.meta.js
// ==/UserScript==

var wantedPlanet;

function run()
{
    let optionsElements = document.getElementById('target1')
    if (wantedPlanet == -1)
    {
        let linkHolder = document.getElementsByClassName('light tbborder padding5')[4].getElementsByTagName('a')[0].href;
        let tmpSpliter = linkHolder.split('&');
        let numberHolder = parseInt(tmpSpliter[2].substring(2)) + 4000;
        tmpSpliter[2] = 'z=' + numberHolder;
        linkHolder = tmpSpliter.join('&');

        eval(linkHolder);
    }
    else
    {
        optionsElements.value='tworld,' + wantedPlanet;
        getMission("verify", "target1")
        setTimeout(getMission('launch'),100);
    }
}

function startRunning()
{
    let amIExplorer = document.getElementById('fleetClass').innerHTML;
    let planetsList = [];

    // Check if we have Explorer Fleet and that we are not flying
    if (amIExplorer != 'Explorer' && amIExplorer != 'Sentry')
        return;
    let objc = document.getElementById('objective');
    if (objc == undefined)
        return;
    objc.value='explore';

    // Get all Planets
    let optionsElements = document.getElementById('target1').getElementsByTagName('option');
    for (let index = 2; index < optionsElements.length; index++)
        planetsList.push(optionsElements[index].value.split(',')[1]);

    // Get My Location
    let myCords = document.getElementsByClassName('light tbborder padding5')[3].getElementsByTagName('a')[0].innerHTML;
    if (myCords == '100, 100, 100 local')
    {
        wantedPlanet = planetsList[0];
    }
    else
    {
        let baseLink = document.getElementsByClassName('tbborder highlight overauto')[0].getElementsByTagName('A')[0].href;
        if (baseLink.indexOf('colony') >= 0)
            baseLink = document.getElementsByClassName('tbborder highlight overauto')[0].getElementsByTagName('A')[1].href;
        let extractPlanet = baseLink.substring(baseLink.indexOf('planet=')+7, baseLink.indexOf('fleet=') -1);
        let tmpPlanet = planetsList.findIndex(x => x == extractPlanet);
        if (tmpPlanet == planetsList.length - 1)
            wantedPlanet = -1;
        else
            wantedPlanet = planetsList[tmpPlanet+1];
    }

    let newButton = document.createElement('input');
    newButton.type = 'button'
    newButton.value = (wantedPlanet == -1 ? 'Open World' : 'Next Planet');
    newButton.style = 'width: 130px;'
    newButton.className = 'darkbutton dangerbutton';
    newButton.addEventListener("click", run);
    document.getElementsByClassName('iBlock tbborder padding5 fullwidth light')[0].insertBefore(newButton, null);
}


(function() {
    'use strict';
    setTimeout(startRunning,250);

    // Add Real Like Time
    let mEta = document.getElementById('mEta');
    if (mEta)
        mEta.innerHTML = `${mEta.innerHTML} (${mEta.title})`;

})();