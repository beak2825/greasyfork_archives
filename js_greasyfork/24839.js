// ==UserScript==
// @name         Torn City eXtended
// @namespace    test
// @description  Go to Preferences -> Script Settings in Torn
// @version      0.6
// @match        *.torn.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24839/Torn%20City%20eXtended.user.js
// @updateURL https://update.greasyfork.org/scripts/24839/Torn%20City%20eXtended.meta.js
// ==/UserScript==

//Global locally stored variables
if(localStorage.getItem('tcx_settings')){
    tcx_prefs = JSON.parse(localStorage.getItem('tcx_settings'));
}else{
    tcx_prefs = {};
    localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
    alert('Go to Preferences -> Script Settings to update your settings.');
}

currentPage = window.location.href.split('com')[1];

//check for status okay
var hospIcon = document.getElementById('icon15');
var jailIcon = document.getElementById('icon16');
var inHosp = false;
var inJail = false;
var statusOk = false;
if(hospIcon){if(hospIcon.className === 'iconShow'){inHosp = true;}}
if(jailIcon){if(jailIcon.className === 'iconShow'){inJail = true;}}
if(!inHosp && !inJail){statusOk = true;}

//what to fire when
if(currentPage === '/preferences.php'){scriptSettings();}
if(currentPage === '/index.php' && document.getElementsByClassName('travel-agency-market')[0]){if(tcx_prefs.pricesTraveling){homePricesAbroad();}}
if(currentPage === '/index.php' && document.getElementsByClassName('destination-title bold')[0]){if(tcx_prefs.forumLink){addForumLink();}}
if(currentPage === '/index.php?page=people'){if(tcx_prefs.blacklistHLon){BlacklistHL();}}
if(statusOk && document.getElementsByClassName('areas')[0]){
    if(tcx_prefs.itemMarketLink){addMarketLink();}
    if(tcx_prefs.travelAgencyLink){addTravelLink();}
    if(tcx_prefs.gymNoGreen){gymLinkNoGreen();}
}
if(currentPage === '/education.php#/step=main'){
    getEduReduc();
    if(tcx_prefs.showTrueEdu){trueEduTime();}
}
if(currentPage === '/loader.php?sid=racing' || currentPage === '/loader.php?sid=racing#'){if(tcx_prefs.quickCustomRace_on){quickCustomRace();}}


function homePricesAbroad(){
    itemWrap = document.getElementsByClassName('users-list m-bottom10 ui-accordion ui-widget ui-helper-reset')[0];
    if(itemWrap){
        document.getElementsByClassName('circulation-b')[0].innerText = 'Market Price';
        for(i=0; i < itemWrap.getElementsByClassName('item').length; i++){
            var itemID = itemWrap.getElementsByClassName('item')[i].children[0].getAttribute('src').split('/')[3];
            var circulationColumn = itemWrap.getElementsByClassName('circulation');
            circulationColumn[i].setAttribute('id', 'item-slot-'+itemID);
            circulationColumn[i].innerText = '...';
            getCurrentPrice(itemID);
        }
    }
}

function getCurrentPrice(itemID){
    $.ajax({
        type: "GET",
        url: 'https://api.torn.com/market/'+itemID+'?selections=bazaar,itemmarket&key='+tcx_prefs.APIkey,
        success: function (response) {
            var priceColumn = document.getElementById('item-slot-'+itemID);
            if(priceColumn){priceColumn.innerText = 'Fetching...';}
            var marketPrices = response;
            var lowestPrice;
            if(marketPrices.bazaar){
                for (var someKey in marketPrices.bazaar) break;
                lowestPrice = marketPrices.bazaar[someKey].cost;
                for (var bazaarKey in marketPrices.bazaar) {
                    if (marketPrices.bazaar.hasOwnProperty(bazaarKey)) {
                        if(marketPrices.bazaar[bazaarKey].cost < lowestPrice){
                            lowestPrice = marketPrices.bazaar[bazaarKey].cost;
                        }
                    }
                }
            }
            if(marketPrices.itemmarket){
                for (var marketKey in marketPrices.itemmarket) {
                    if (marketPrices.itemmarket.hasOwnProperty(marketKey)) {
                        if(marketPrices.itemmarket[marketKey].cost < lowestPrice){
                            lowestPrice = marketPrices.itemmarket[marketKey].cost;
                        }
                    }
                }
            }
            if(priceColumn){priceColumn.innerText = '$'+numberWithCommas(lowestPrice);}
            if(marketPrices.error){APIerror(marketPrices);}
    }
});
}

//preferences.php
function scriptSettings(){
    document.getElementsByClassName('c-pointer left-bottom-round ui-state-default ui-corner-top')[0].setAttribute('class', 'c-pointer ui-state-default ui-corner-top');
    var delimiter = document.createElement('li');
    delimiter.className = 'delimiter';
    var LI_scriptSettings = document.createElement('li');
    LI_scriptSettings.setAttribute('id', 'scriptSettingsLI');
    LI_scriptSettings.setAttribute('class', 'c-pointer left-bottom-round ui-state-default ui-corner-top');
    LI_scriptSettings.setAttribute('data-title-name', 'Script Settings');
    LI_scriptSettings.setAttribute('role', 'tab');
    LI_scriptSettings.setAttribute('tabindex', '-1');
    LI_scriptSettings.setAttribute('aria-controls', 'script-settings');
    LI_scriptSettings.setAttribute('aria-labelledby', 'ui-id-17');
    LI_scriptSettings.setAttribute('aria-selected', 'false');
    LI_scriptSettings.innerHTML = '<a class="t-gray-6 bold h script-settings ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-17">Script Settings</a>'; //href="#script-settings"
    var DIV_scriptSettings = document.createElement('div');
    DIV_scriptSettings.setAttribute('id', 'script-settings');
    DIV_scriptSettings.setAttribute('class', 'prefs-cont left ui-tabs-panel ui-widget-content ui-corner-bottom');
    DIV_scriptSettings.setAttribute('aria-labelledby', 'ui-id-17');
    DIV_scriptSettings.setAttribute('role', 'tabpanel');
    DIV_scriptSettings.setAttribute('aria-expanded', 'false');
    DIV_scriptSettings.setAttribute('aria-hidden', 'true');
    DIV_scriptSettings.setAttribute('style', 'display: none;');
    var DIV_innerBlock = document.createElement('div');
    DIV_innerBlock.setAttribute('id', 'scriptSettings_inner-block');
    DIV_innerBlock.setAttribute('class', 'inner-block');
    DIV_innerBlock.innerHTML = '<p class="m-top3">Update API key below. Locally saved key: <span class="bold" id="storedAPIkey">'+tcx_prefs.APIkey+'</span></p><div class="m-top10"><input class="m-right10" type="text" name="APIkey" id="APIkey-input" value=""><div class="btn-wrap silver change"><div class="btn"><input class="c-pointer update" type="submit" id="update_APIkey" value="UPDATE"></div></div></div>';
    DIV_scriptSettings.appendChild(DIV_innerBlock);
    
    var prefWrap = document.getElementsByClassName('headers left ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')[0];
    prefWrap.insertBefore(delimiter, prefWrap.children[prefWrap.children.length - 1]);
    prefWrap.insertBefore(LI_scriptSettings, prefWrap.children[prefWrap.children.length - 1]);
    var prefDIVs = document.getElementById('prefs-tab-menu');
    prefDIVs.insertBefore(DIV_scriptSettings, prefDIVs.children[prefDIVs.children.length - 1]);
    for(i=0; i < prefWrap.children.length-2; i++){
        if(prefWrap.children[i].className !== 'delimiter' && prefWrap.children[i].className !== 'clear'){
            prefWrap.children[i].addEventListener('click', function a(){hideScriptSettings(this);});
        }
    }
    $('#scriptSettingsLI').on('click', changePrefPane);
    $('#update_APIkey').on('click', updateAPIkey);
    addRadio(DIV_innerBlock, 'pricesTraveling', 'Show lowest market price for items abroad.');
    addRadio(DIV_innerBlock, 'forumLink', 'Show Forums link on traveling page.');
    addRadio(DIV_innerBlock, 'blacklistHLon', 'Highlight blacklist enemies abroad.');
    addRadio(DIV_innerBlock, 'itemMarketLink', 'Add Item Market link to sidebar.');
    addRadio(DIV_innerBlock, 'travelAgencyLink', 'Add Travel Agency link to sidebar.');
    addRadio(DIV_innerBlock, 'gymNoGreen', 'Disable green highlight on Gym link in sidebar.');
    addRadio(DIV_innerBlock, 'showTrueEdu', 'Show reduced education. (company specials not included)');
    addRadio(DIV_innerBlock, 'quickCustomRace_on', 'User defined defaults for Custom Races.');
    //addRadio(DIV_innerBlock, 'name', 'text');
}
function changePrefPane(){
    hideActiveDiv();
    showScriptSettings(this);
}
function showScriptSettings(){
    document.getElementsByClassName('prefs-tab-title title-black top-round')[0].innerText = 'Script Settings';
    var scriptSettingsLI = document.getElementById('scriptSettingsLI');
    scriptSettingsLI.setAttribute('class', 'c-pointer left-bottom-round ui-state-default ui-corner-top ui-tabs-active ui-state-active');
    scriptSettingsLI.setAttribute('tabindex', '0');
    scriptSettingsLI.setAttribute('aria-selected', 'true');
    var scriptSettingsDIV = document.getElementById('script-settings');
    scriptSettingsDIV.setAttribute('aria-expanded', 'true');
    scriptSettingsDIV.setAttribute('aria-hidden', 'false');
    scriptSettingsDIV.setAttribute('style', 'display: table-cell;');
}
function hideScriptSettings(element){
    document.getElementsByClassName('prefs-tab-title title-black top-round')[0].innerText = element.getAttribute('data-title-name');
    var scriptSettingsLI = document.getElementById('scriptSettingsLI');
    scriptSettingsLI.setAttribute('class', 'c-pointer left-bottom-round ui-state-default ui-corner-top');
    scriptSettingsLI.setAttribute('tabindex', '-1');
    scriptSettingsLI.setAttribute('aria-selected', 'false');
    var scriptSettingsDIV = document.getElementById('script-settings');
    scriptSettingsDIV.setAttribute('aria-expanded', 'false');
    scriptSettingsDIV.setAttribute('aria-hidden', 'true');
    scriptSettingsDIV.setAttribute('style', 'display: none;');
}
function hideActiveDiv(){
    var activeTab = document.getElementsByClassName('c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active')[0];
    activeTab.setAttribute('class', 'c-pointer left-bottom-round ui-state-default ui-corner-top');
    activeTab.setAttribute('tabindex', '-1');
    activeTab.setAttribute('aria-selected', 'false');
    var activeDiv = document.getElementById(activeTab.getAttribute('aria-controls'));
    activeDiv.setAttribute('aria-expanded', 'false');
    activeDiv.setAttribute('aria-hidden', 'true');
    activeDiv.setAttribute('style', 'display: none;');
}
function updateAPIkey(){
    tcx_prefs.APIkey =  document.getElementById('APIkey-input').value;
    localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
    $('#storedAPIkey')[0].innerText = tcx_prefs.APIkey;
}
function addRadio(parent_div, radID, radText){
    var DIV_NewRadio = document.createElement('div');
    DIV_NewRadio.setAttribute('id', radID+'-radio');
    DIV_NewRadio.setAttribute('class', 'm-top10 has-pretty-child');
    DIV_NewRadio.innerHTML = '<div class="clearfix prettycheckbox labelright  blue" id="'+radID+'-checkbox_div" role="checkbox" aria-checked="false" aria-disabled="false" "=""><input class="check" type="checkbox" name="'+radID+'-checkbox" id="'+radID+'-checkbox_input" data-label="'+radText+'" style="display: none;"><a href="#" id="'+radID+'-checkbox_a" role="presentation" tabindex="0" class=""></a><label for="'+radID+'" class="">'+radText+'</label></div>';
    parent_div.appendChild(DIV_NewRadio);
    var newRadioCheckbox = document.getElementById(radID+'-checkbox_a');
    newRadioCheckbox.addEventListener('click', function toggle(){
        if(newRadioCheckbox.className === ""){
            newRadioCheckbox.className = 'checked';
            tcx_prefs[radID] = true;
            localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
        }else{
            newRadioCheckbox.className = '';
            tcx_prefs[radID] = false;
            localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
        }
        console.log(localStorage.getItem(radID));
    });
    if(tcx_prefs[radID]){newRadioCheckbox.className = 'checked';}else{newRadioCheckbox.className = '';}
}


function addForumLink() {
    var travelLinks = document.getElementById('top-page-links-list');
    var eventsLink = travelLinks.childNodes[9];
    var forumsLink = document.createElement('a');
    if(travelLinks){travelLinks.insertBefore(forumsLink, eventsLink);}
    forumsLink.outerHTML = '<a role="listitem" class="forums t-clear h c-pointer  m-icon line-h24 right last" href="forums.php"><span class="icon-wrap"><i class="new-thread-icon"></i></span><span role="button"> Forums</span></a>';
}

function BlacklistHL(){
    var enemyID = [];
    var userIDs = document.getElementsByClassName('user name');
    var usersList = document.getElementsByClassName('users-list icons cont-gray bottom-round m-bottom10')[0].children;
    $.ajax({
        type: "GET",
        url: '/userlist.php',
        data: {
            step: 'blackList',
            rfcv: getRFC(),
        },
        success: function (response) {
            var blacklistObj = parseHTML(response)[0].getElementsByClassName('user name');
            for(i=0; i<blacklistObj.length; i++){
                enemyID[i] = blacklistObj[i].getAttribute('data-placeholder').split('[')[1].replace(']', '');
            }
            for(i=0; i<userIDs.length; i++){
                if(enemyID.indexOf(userIDs[i].getAttribute('data-placeholder').split('[')[1].replace(']', '')) > -1){
                    usersList[i].style.background='linear-gradient(red, white, white, red)';
                }
            }
        }
    });
}

function addMarketLink(){
    var menu = document.getElementsByClassName('areas');
    var iMarketLink = document.createElement('li');
    iMarketLink.className = "";
    iMarketLink.innerHTML = '<div class="list-link" id="nav-item-market"><a href="/imarket.php"><i class="dog-tags-icon left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Item Market</span></a></div>';
    menu[0].insertBefore(iMarketLink, menu[0].children[2]);
}

function addTravelLink(){
    var menu = document.getElementsByClassName('areas');
    var travelLink = document.createElement('li');
    travelLink.className = "";
    travelLink.innerHTML = '<div class="list-link" id="nav-travel-agency"><a href="/travelagency.php"><i class="witch-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Travel Agency</span></a></div>';
    menu[0].insertBefore(travelLink, menu[0].children[4]);
}

function gymLinkNoGreen(){
    var gymLink = document.getElementById('nav-gym');
    if(gymLink){gymLink.parentNode.className = '';}
}

function trueEduTime(){
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if(node.className){
                    if(node.className.split(' ')[0] === 'desc-wrap'){
                        var originalStr = node.querySelector('.parameters .info').children[0].innerHTML;
                        var baseLength = parseInt(originalStr.split(' ')[1]);
                        var redWeeks = parseInt(baseLength*tcx_prefs.eduReduc);
                        var redDays = parseInt(7 * (baseLength*tcx_prefs.eduReduc - redWeeks));
                        var redHours = 24 * ((7 * (baseLength*tcx_prefs.eduReduc - redWeeks) - redDays));
                        node.querySelector('.parameters .info').children[0].innerHTML = originalStr + ' (' + redWeeks + 'w, ' + redDays + 'd, ' + redHours.toFixed(1) +'hr)';
                    }
                }
            }
        }
    });
    const wrapper = document.querySelector('#mainContainer .content-wrapper');
    observer.observe(wrapper, { subtree: true, childList: true });
}

function getEduReduc(){
    eduLength = 1;
    $.ajax({
        type: "GET",
        url: 'https://api.torn.com/user/?selections=perks&key='+tcx_prefs.APIkey,
        success: function (response) {
            for(i=0; i < Object.keys(response).length; i++){
                for(j=0; j < response[Object.keys(response)[i]].length; j++){
                    var perkStr = response[Object.keys(response)[i]][j];
                    if(1 < perkStr.split('Education Length').length){
                        eduLength *= (100-parseInt(perkStr.split('Education Length')[0].split('%')[0].split(' ')[1]))/100;
                    }
                }
            }
            tcx_prefs.eduReduc = eduLength;
            localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
        }
    });
}

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
    tcx_prefs.raceDefaults = {};
    tcx_prefs.raceDefaults.track = {};
    tcx_prefs.raceDefaults.cars = {};
    tcx_prefs.raceDefaults.upgrades = {};
    console.log('defaults button clicked');
    var customRaceForm = document.querySelector('#createCustomRace .form-custom');
    var raceInputs = customRaceForm.getElementsByClassName('input-wrap');
    for(i=0; i<raceInputs.length; i++){
        tcx_prefs.raceDefaults[raceInputs[i].children[1].name] = raceInputs[i].children[1].value;
    }
    tcx_prefs.raceDefaults.track.trackKey = customRaceForm.querySelector('#select-racing-track').value;
    tcx_prefs.raceDefaults.track.trackName = customRaceForm.querySelector('#select-racing-track-button').children[0].innerHTML;
    tcx_prefs.raceDefaults.cars.carKey = customRaceForm.querySelector('#select-racing-cars').value;
    tcx_prefs.raceDefaults.cars.carName = customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML;
    tcx_prefs.raceDefaults.cars.carKey = customRaceForm.querySelector('#select-racing-cars').value;
    tcx_prefs.raceDefaults.cars.carName = customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML;
    tcx_prefs.raceDefaults.upgrades.upgradeKey = customRaceForm.querySelector('#select-allow-upgrades').value;
    tcx_prefs.raceDefaults.upgrades.upgradeName = customRaceForm.querySelector('#select-allow-upgrades-button').children[0].innerHTML;
    tcx_prefs.raceDefaults.defaultsSet = true;
    localStorage.setItem('tcx_settings', JSON.stringify(tcx_prefs));
}
function fillCustomRace(){
    if(tcx_prefs.raceDefaults){if(tcx_prefs.raceDefaults.defaultsSet){
        var customRaceForm = document.querySelector('#createCustomRace .form-custom');
        var raceInputs = customRaceForm.getElementsByClassName('input-wrap');
        for(i=0; i<raceInputs.length; i++){
            switch(raceInputs[i].children[1].name){
                case 'title':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.title;
                    break;
                case 'minDrivers':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.minDrivers;
                    break;
                case 'maxDrivers':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.maxDrivers;
                    break;
                case 'laps':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.laps;
                    break;
                case 'betAmount':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.betAmount;
                    break;
                case 'waitTime':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.waitTime;
                    break;
                case 'password':
                    raceInputs[i].children[1].value = tcx_prefs.raceDefaults.password;
                    break;
                default:
                    throw 'You should not be seeing this, something broke in racing portion of script.';
            }
        }
        customRaceForm.querySelector('#select-racing-track').value = tcx_prefs.raceDefaults.track.trackKey;
        customRaceForm.querySelector('#select-racing-track-button').children[0].innerHTML = tcx_prefs.raceDefaults.track.trackName;
        customRaceForm.querySelector('#select-racing-cars').value = tcx_prefs.raceDefaults.cars.carKey;
        customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML = tcx_prefs.raceDefaults.cars.carName;
        customRaceForm.querySelector('#select-racing-cars').value = tcx_prefs.raceDefaults.cars.carKey;
        customRaceForm.querySelector('#select-racing-cars-button').children[0].innerHTML = tcx_prefs.raceDefaults.cars.carName;
        customRaceForm.querySelector('#select-allow-upgrades').value = tcx_prefs.raceDefaults.upgrades.upgradeKey;
        customRaceForm.querySelector('#select-allow-upgrades-button').children[0].innerHTML = tcx_prefs.raceDefaults.upgrades.upgradeName;
    }}
}


function APIerror(APIobj){
    switch(APIobj.error.code){
        case 0:
            throw 'Unknown Error: Unhandled error, should not occur.';
        case 1:
            throw 'Key is empty: Private key is empty in current request.';
        case 2:
            throw 'Incorrect API Key: Private key is wrong/incorrect format.';
        case 3:
            throw 'Wrong type: Requesting an incorrect basic type.';
        case 4:
            throw 'Wrong fields: Requesting incorrect selection fields.';
        case 5:
            throw 'Too many requests: Current private key is banned for a small period of time because of too many requests\n***Please disable scripts for a short time.';
        case 6:
            throw 'Incorrect ID: Wrong ID value.';
        case 7:
            throw 'Incorrect ID-entity relation: Requested selection is private.\n(For example, personal data of another user / faction)';
        case 8:
            throw 'IP block: Current IP is banned for a small period of time because of abuse.\n***Please disable any scripts calling the API for some time.';
        default:
            throw 'Something is broken m8';
            }
}

function numberWithCommas(x) {
    if(x){
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x;
    }
}
function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return $(tmp.body);
}