// ==UserScript==
// @name         Torn City Quick Custom Race
// @namespace    test
// @description  Save custom race settings defaults
// @version      0.1
// @match        *.torn.com/loader.php?sid=racing*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24856/Torn%20City%20Quick%20Custom%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/24856/Torn%20City%20Quick%20Custom%20Race.meta.js
// ==/UserScript==

//Global locally stored variables
if(localStorage.getItem('tcRace_settings')){
    tcRace_prefs = JSON.parse(localStorage.getItem('tcRace_settings'));
}else{
    tcRace_prefs = {};
}

console.log(tcRace_prefs);
quickCustomRace();

function quickCustomRace(){
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if(node.className === 'form-custom-wrap'){
                    var saveDefaultsButton = document.createElement('a');
                    node.querySelector('.custom-btn-wrap').appendChild(saveDefaultsButton);
                    saveDefaultsButton.outerHTML = '<a id="set-defaults" class="link line-h24 right" href="#"><span>Store as Default</span></a>';
                    document.querySelector('#set-defaults').addEventListener('click', storeCustomRace);
                    fillCustomRace();
                }
            }
        }
    });
    const wrapper = document.querySelector('#mainContainer .content-wrapper');
    observer.observe(wrapper, { subtree: true, childList: true });
}
function storeCustomRace(){
    tcRace_prefs.raceDefaults = {};
    tcRace_prefs.raceDefaults.track = {};
    tcRace_prefs.raceDefaults.cars = {};
    tcRace_prefs.raceDefaults.upgrades = {};
    var customRaceForm = document.querySelector('#createCustomRace .form-custom');
    var raceInputs = customRaceForm.getElementsByClassName('input-wrap');
    for(i=0; i<raceInputs.length; i++){
        tcRace_prefs.raceDefaults[raceInputs[i].children[1].name] = raceInputs[i].children[1].value;
    }
    tcRace_prefs.raceDefaults.track.trackKey = customRaceForm.querySelector('#select-racing-track').value;
    tcRace_prefs.raceDefaults.track.trackName = customRaceForm.querySelector('#select-racing-track-button').children[0].innerHTML;
    tcRace_prefs.raceDefaults.cars.carKey = customRaceForm.querySelector('#select-racing-cars').value;
    tcRace_prefs.raceDefaults.cars.carName = customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML;
    tcRace_prefs.raceDefaults.cars.carKey = customRaceForm.querySelector('#select-racing-cars').value;
    tcRace_prefs.raceDefaults.cars.carName = customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML;
    tcRace_prefs.raceDefaults.upgrades.upgradeKey = customRaceForm.querySelector('#select-allow-upgrades').value;
    tcRace_prefs.raceDefaults.upgrades.upgradeName = customRaceForm.querySelector('#select-allow-upgrades-button').children[0].innerHTML;
    tcRace_prefs.raceDefaults.defaultsSet = true;
    localStorage.setItem('tcRace_settings', JSON.stringify(tcRace_prefs));
}
function fillCustomRace(){
    if(tcRace_prefs.raceDefaults){if(tcRace_prefs.raceDefaults.defaultsSet){
        var customRaceForm = document.querySelector('#createCustomRace .form-custom');
        var raceInputs = customRaceForm.getElementsByClassName('input-wrap');
        for(i=0; i<raceInputs.length; i++){
            switch(raceInputs[i].children[1].name){
                case 'title':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.title;
                    break;
                case 'minDrivers':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.minDrivers;
                    break;
                case 'maxDrivers':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.maxDrivers;
                    break;
                case 'laps':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.laps;
                    break;
                case 'betAmount':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.betAmount;
                    break;
                case 'waitTime':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.waitTime;
                    break;
                case 'password':
                    raceInputs[i].children[1].value = tcRace_prefs.raceDefaults.password;
                    break;
                default:
                    throw 'You should not be seeing this, something broke in racing portion of script.';
            }
        }
        customRaceForm.querySelector('#select-racing-track').value = tcRace_prefs.raceDefaults.track.trackKey;
        customRaceForm.querySelector('#select-racing-track-button').children[0].innerHTML = tcRace_prefs.raceDefaults.track.trackName;
        customRaceForm.querySelector('#select-racing-cars').value = tcRace_prefs.raceDefaults.cars.carKey;
        customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML = tcRace_prefs.raceDefaults.cars.carName;
        customRaceForm.querySelector('#select-racing-cars').value = tcRace_prefs.raceDefaults.cars.carKey;
        customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML = tcRace_prefs.raceDefaults.cars.carName;
        customRaceForm.querySelector('#select-allow-upgrades').value = tcRace_prefs.raceDefaults.upgrades.upgradeKey;
        customRaceForm.querySelector('#select-allow-upgrades-button').children[0].innerHTML = tcRace_prefs.raceDefaults.upgrades.upgradeName;
    }}
}