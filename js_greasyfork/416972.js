// ==UserScript==
// @name         WME Locksmith abu
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2020.10.19.02abu
// @description  Dynamic locking tool which locks based on State standards
// @author       SkiDooGuy / JustinS83 / Blaine "herrchin" Kahle
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://apis.google.com/js/api.js
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/416972/WME%20Locksmith%20abu.user.js
// @updateURL https://update.greasyfork.org/scripts/416972/WME%20Locksmith%20abu.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global OpenLayers */
/* global _ */
/* global require */

const LOCKSMITH_VERSION = `v${GM_info.script.version}`;
const FEATURELOCK = 2;
const LS_UPDATE_NOTES = `<b>NEW:</b><br>
- Translations ready<br><br>
<b>FIXES:</b><br>
-<br><br>`;
const TRANSLATIONS = {
    default: {
        scriptTitle: 'Locksmith',
        sheetTooltip: 'Spreadsheet Connection',
        rankTooltip: 'Allows segments that you cannot edit or lock to the standard rank to be highlighted and show in the UI',
        highLockTooltip: 'Watch out for map exceptions, some higher locks are there for a reason!',
        resetTooltip: 'Reset lock values and UI',
        attrTooltip: 'Colored attributes are available in this state, click to toggle them enabled',
        resetValue: 'Reset',
        scanValue: 'Scan',
        lockAllValue: 'Lock All',
        optionsMenu: 'Options',
        activeScan: 'Active Scan',
        enHighlights: 'Enable Highlights',
        detAbvRank: 'Detect segs above my rank',
        saveCustLock: 'Save custom locks',
        saveScnSet: 'Save scan settings',
        manStateSel: 'Manual state select',
        disStatePop: 'Disable states popup',
        ovrLockSegs: 'Include overlocked segs',
        lockStand: 'Lock Standards  ',
        lockStat: 'Lock Status: Low | High | All',
        othrSegTypes: 'Other segment types: ',
        addAttr: 'Additional Attributes',
        roadNonPed: 'NonRout Ped',
        roadRun: 'Runway',
        roadFry: 'Ferry',
        roadRail: 'Railroad',
        roadOff: 'Off-Road',
        roadPLR: 'PLR',
        roadPVT: 'PVT',
        roadLS: 'LS',
        roadPS: 'PS',
        roadMinH: 'mH',
        roadMajH: 'MH',
        roadRmp: 'Ramp',
        roadFwy: 'Fwy',
        unpaved: 'Unpaved',
        oneWay: 'One-way',
        hov: 'HOV',
        wkt: 'WKT',
        toll: 'Toll',
        option0: 'Auto',
        optionHRCS: 'HRCS'
    }

};

let _allStandardsArray = {};
let _currentStateStandards = {};
let LsSettings = {};
let _currentState = '';
let cakeFlavor;
let roadClear = false;
let LocksmithHighlightLayer;
let tries = 0;
let UpdateObj;
let editorInfo;
let country;
let langLocality = 'default';


console.log('Locksmith(LS): initializing...');

const css = [
    '.ls-Wrapper {width:100%;height:100%;margin-bottom:30%;background-color:white;border:2px solid white;border-radius:6px;font-size:12px;font-family:Poppins, "Helvetica Neue", Helvetica, "Open Sans", sans-serif;user-select:none;}',
    '.ls-Body {display:block;padding:3px;}',
    '.ls-Header-Wrapper {display:block;width:100%;}',
    '.ls-Header-Text-Container {width:100%;padding:0 5px 0 5px;display:inline-block;border-bottom:1px solid grey;}',
    '.ls-Label {display:inline-block;position:relative;padding-right:20px;font-weight:normal;margin:5px 0 0 0;width:auto;cursor:pointer;}',
    '.ls-Label input[type=checkbox] {position:absolute;opacity:0;height:0;width:0;}',
    '.ls-CheckBox {position:absolute;height:13px;width:13px;background-color:#eee;border:1px solid black;border-radius:4px;top:1px;right:0px;}',
    '.ls-Label:hover input ~ .ls-CheckBox {background-color:#ccc;}',
    '.ls-Label input:checked ~ .ls-CheckBox {background-color:rgb(66 184 196);}',
    '.ls-Options-Container {display:inline-block;}',
    '.ls-Options-Menu {position:relative;display:block;width:100%;float:left;padding:3px;border:1px solid black;border-radius:5px;text-align:center;}',
    '.ls-Options-Menu:hover {border:1.5px outset grey;background-color:rgb(224,224,224);}',
    '.ls-Options-Dropdown-Menu {display:none;position:absolute;background-color:#f9f9f9;min-width:160px;top:25px;left:0px;z-index:1;text-align:left;}',
    '.ls-Options-Menu:hover .ls-Options-Dropdown-Menu {display:block;}',
    '.ls-Options-Dropdown-Menu ul {list-style:none;padding-left:0px;border:1px solid grey;border-radius:5px;}',
    '.ls-Options-Dropdown-Menu li {padding:5px;}',
    '.ls-Options-Dropdown-Menu li:hover {background-color:rgb(220,220,220);border:.5px solid lightgrey;border-radius:5px;}',
    '.ls-Section-Container {display:inline-block;width:100%;}',
    '.ls-Section-Header {width:100%;display:block;padding-bottom:2px;border-bottom:1.5px solid grey;margin-bottom:5px;}',
    '.ls-Select {color:#444;box-sizing:border-box;margin-right:5px;outline:none;padding:3px;border:1px solid lightgrey;border-radius:6px;}',
    '.ls-Select:hover  {border:1px solid grey;}',
    '.ls-Select:focus  {border:1px solid black;}',
    '.ls-Lock-Options {display:block;width:100%;max-height:3-px;margin-bottom:3px;}',
    '.ls-Seg-Result {display:inline-block;position:relative;float:right;top:8px;}',
    '.ls-IL-Block {display:inline-block;}',
    '.fa.fa-arrow-circle-up {position:relative;color:lightgrey;padding:0px 5px 0px 5px}',
    '.fa.fa-arrow-circle-down {position:relative;color:lightgrey;padding:0px 5px 0px 5px}',
    '.ls-Seg-Quantity-Low {position:relative;padding:0px 5px 0px 5px;}',
    '.ls-Seg-Quantity-High {position:relative;padding:0px 5px 0px 5px;}',
    '.ls-Seg-Quantity-Low.enabled {}',
    '.ls-Seg-Quantity-High.enabled {}',
    '.ls-Seg-Attributes {display:inline-block;border:1px solid lightgrey;border-radius:5px;padding:2px;margin:4px;background-color:lightgrey;font-size:12px}',
    '.ls-Attr-Label {display:inline-block;position:relative;padding:2px 5px 2px 2px;font-size:12px;font-weight:bold;width:auto;}',
    '.ls-Attr-Label input[type=checkbox] {position:absolute;opacity:0;height:0;width:0;}',
    '.ls-Attr-CheckBox {position:relative;padding:2px;background-color:lightgrey;border:1px solid lightgrey;border-radius:4px;top:1px;right:0px;}',
    '.ls-Attr-Label:hover input ~ .ls-Attr-CheckBox {border:1.2px outset grey;}',
    '.ls-Attr-Label input:checked ~ .ls-Attr-CheckBox {border:1.2px outset black;}',
    '.ls-Button-Container {position:relative;display:inline-block;float:right;padding-top:3px;width:40%;}',
    '.ls-Button {border:1px solid black;border-radius:5px;cursor:pointer;padding:3px;background-color:white;}',
    '.ls-Button:hover {border:1.5px outset grey;background-color:rgb(224,224,224);}',
    '.key-Text {font-weight:bold;font-size:14px;}',
    '#lsConnectionStatus {display:inline;position:relative;height:15px;width:30px;border:1px solid lightgrey;border-radius:4px;font-size:8px;text-align:center;font-weight:bold;top:-2px;left:2px;line-height:1.5;}'
].join(' ');

function Locksmithbootstrap() {
    if (W && W.map && W.model && W.model.countries && W.model.states && W.loginManager.user && $ && WazeWrap.Ready) {
        checkCountry();
        if (country === null) {
            setTimeout(function () {
                Locksmithbootstrap();
            }, 200);
        } else {
            initLocksmith();
        }
    } else if (tries < 500) {
        setTimeout(() => {
            tries++;
            Locksmithbootstrap();
        }, 200);
    } else console.log('LS: Failed to load');
}

function initLocksmith() {
    // Checks to ensure WME is in editing mode and not HN or Event mode
    if (W.app.modeController.model.attributes.mode !== 0 && !W.editingMediator.attributes.editingHouseNumbers) {
        return console.log('LS: WME is not in editing mode');
    }

    editorInfo = W.loginManager.user;

    const $section = $('<div>');
    // HTML for UI tab
    $section.html([
        '<div class="ls-Wrapper">',
        '<div class="ls-Body">',
        `<div class="ls-Header-Wrapper">
                    <div class="ls-Header-Text-Container">
                        <span class='key-Text'>Locksmith</span> - ${LOCKSMITH_VERSION}<a href='https://docs.google.com/spreadsheets/d/1JjEWRMcGUrjL7VkG3P4egVzj3YX_YB6U-lXPGLzg1sg/edit#gid=0' target="_blank" id='lsConnectionStatus' data-original-title='${TRANSLATIONS[langLocality].colTooltip}' />
                    </div>
                    <div class="ls-Options-Container" style="display:block;height:35px;padding:2px 10px 0 10px;width:100%">
                        <div style="display:inline-block;float:left;position:relative;width:60%;">
                            <div class="ls-Options-Container" style="margin:3px 0 0 0;">
                                <div class="ls-Options-Menu">
                                    <div><span id='ls-text-options' /></div>
                                    <div class="ls-Options-Dropdown-Menu">
                                        <ul>
                                            <li>
                                                <label class="ls-Label"><span id='ls-text-activeScan' /><input type="checkbox" class="ls-Save-Status" id="lsEnableActiveScan">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li>
                                                <label class="ls-Label"><span id='ls-text-enHighlights' /><input type="checkbox" class="ls-Save-Status" id="lsEnableHighlightSeg">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li>
                                                <label class="ls-Label"><span id='ls-text-saveCustLock' /><input type="checkbox" class="ls-Save-Status" id="lsEnableSaveValues">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li>
                                                <label class="ls-Label"><span id='ls-text-saveScnSet' /><input type="checkbox" class="ls-Save-Status" id="lsEnableSaveSettings">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li>
                                                <label class="ls-Label" style="margin:0px;"><span id='ls-text-manStateSel' /><input type="checkbox" id="lsManualStateOverride">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li>
                                                <label class="ls-Label"><span id='ls-text-disStatePop' /><input type="checkbox" class="ls-Save-Status" id="lsDisableStatePopup">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li id="ls-Above-Rank-Tooltip" data-original-title='${TRANSLATIONS[langLocality].rankTooltip}'>
                                                <label class="ls-Label"><span id='ls-text-detAbvRank' /><input type="checkbox" class="ls-Save-Status" id="lsEnableIgnoreRank">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                            <li id="ls-Higher-Level-Tooltip" data-original-title='${TRANSLATIONS[langLocality].highLockTooltip}'>
                                                <label class="ls-Label" style="font-weight:bold;"><span id='ls-text-ovrLockSegs' /><input type="checkbox" class="ls-Save-Status" id="lsEnableResetHigher">
                                                <span class="ls-CheckBox" /></label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="ls-Button-Container" style="width:50%;left:-20px">
                                <input type="button" class="ls-Button" id="ls-Reset-Standards-Display" style="position:relative;" value='${TRANSLATIONS[langLocality].resetValue}' data-original-title='${TRANSLATIONS[langLocality].resetTooltip}'>
                            </div>
                        </div>
                        <div class="ls-Button-Container">
                            <input type="button" class="ls-Button" style="position:relative;left:5px;" id="ls-Maual-Scan-Activate" value='${TRANSLATIONS[langLocality].scanValue}'>
                            <input type="button" class="ls-Button" style="float:right;" id="ls-Lock-All-Submit" value='${TRANSLATIONS[langLocality].lockAllValue}'>
                        </div>
                    </div>
                </div>
                <div class="ls-Section-Container" style="margin-top:0px;">
                    <div class="ls-Section-Container">
                        <span style="float:left;border-bottom:1px solid black;" id='ls-text-lockStand' />
                        <span style="float:right;border-bottom:1px solid black;" id='ls-text-lockStat' />
                    </div>

                    <div class="ls-Section-Container">
                        <div class="ls-Section-Container" id="ls-Seg-Types-Main">
                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockStreetSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-LS-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-LS" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-LS-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-LS-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-LS-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-LS-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-LS" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockPSSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-PS-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-PS" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-PS-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-PS-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-PS-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-PS-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-PS" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockMinHSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-minH-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-minH" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-minH-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-minH-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-minH-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-minH-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-minH" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockMajHSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-majH-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-majH" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-majH-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-majH-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-majH-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-majH-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-majH" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockRmpSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-HRCS">${TRANSLATIONS[langLocality].optionHRCS}</option>
                                    <option class="ls-Lock-Option-1">1</option><option class="ls-Lock-Option-2">2</option>
                                    <option class="ls-Lock-Option-3">3</option><option class="ls-Lock-Option-4">4</option>
                                    <option class="ls-Lock-Option-5">5</option><option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Ramp-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Rmp" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Rmp-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Rmp-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Rmp-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Rmp-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Rmp" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockFwySelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-FWY-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Fwy" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Fwy-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Fwy-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Fwy-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Fwy-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Fwy" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="ls-Lock-Options">
                            <div style="display:inline-block;float:left;cursor:pointer;" id="ls-Othr-Seg-Label"><span id='ls-text-othrSegTypes' /></div>
                            <div class="ls-Seg-Result" style="top:5px;" id="rl-Othr-Result-Container">
                                <div class="ls-IL-Block">
                                    <span class="fa fa-arrow-circle-up" id="ls-othr-Lock-Up" />
                                    <span class="ls-Seg-Quantity-Low" id="ls-othr-Low-Quan" />
                                </div>
                                <div class="ls-IL-Block">
                                    <span class="fa fa-arrow-circle-down" id="ls-othr-Lock-Down" />
                                    <span class="ls-Seg-Quantity-High" id="ls-othr-High-Quan" />
                                </div>
                                <span class="fa fa-lock" id="icon-Lock-othr" style="color:lightgrey;padding-left:10px;float:right;" />
                            </div>
                        </div>

                        <div class="ls-Section-Container" id="ls-Seg-Types-Alt" style="display:none;">
                            <div class="ls-Lock-Options" style="margin-top:3px;">
                                <select class="ls-Select" id="lsLockPvtSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Pvt-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Pvt" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Pvt-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Pvt-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Pvt-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Pvt-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Pvt" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockPlrSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Plr-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Plr" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Plr-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Plr-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Plr-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Plr-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Plr" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockRailSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Rail-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Rail" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Rail-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Rail-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Rail-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Rail-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Rail" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockFrySelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Fry-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Fry" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Fry-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Fry-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Fry-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Fry-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Fry" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockRnwySelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Rnwy-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Rnwy" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Rnwy-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Rnwy-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Rnwy-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Rnwy-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Rnwy" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockOfrdSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Ofrd-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Ofrd" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Ofrd-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Ofrd-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Ofrd-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Ofrd-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Ofrd" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                            <div class="ls-Lock-Options">
                                <select class="ls-Select" id="lsLockNonpedSelect">
                                    <option class="ls-Lock-Option-0">${TRANSLATIONS[langLocality].option0}</option><option class="ls-Lock-Option-1">1</option>
                                    <option class="ls-Lock-Option-2">2</option><option class="ls-Lock-Option-3">3</option>
                                    <option class="ls-Lock-Option-4">4</option><option class="ls-Lock-Option-5">5</option>
                                    <option class="ls-Lock-Option-6">6</option>
                                </select>
                                <span class="ls-Nonped-Label" />
                                <div class="ls-Seg-Result">
                                    <div id="ls-Seg-Result-Nonped" style="float:right;">
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-up" id="ls-Nonped-Lock-Up" />
                                            <span class="ls-Seg-Quantity-Low" id="ls-Nonped-Low-Quan" />
                                        </div>
                                        <div class="ls-IL-Block">
                                            <span class="fa fa-arrow-circle-down" id="ls-Nonped-Lock-Down" />
                                            <span class="ls-Seg-Quantity-High" id="ls-Nonped-High-Quan" />
                                        </div>
                                        <span class="fa fa-lock" id="icon-Lock-Nonped" style="color:lightgrey;padding-left:10px;float:right;" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="ls-Section-Container" style="margin-top:5px;border-top:.5px solid lightgrey;">
                    <div class="ls-Section-Container" style="margin-top:3px;">
                        Current Standards:&nbsp;&nbsp;<span id="ls-Current-State-Display" style="font-weight:bold;" />
                        <div id="ls-State-Select-Container" style="display:none;">
                            <select class="ls-Select" id="ls-State-Selection"></select>
                        </div>
                    </div>
                </div>
                <div class="ls-Section-Container">
                    <div class="ls-Section-Header" style="float:left;margin-top:5px;" id="ls-Add-Att-Info" data-original-title='${TRANSLATIONS[langLocality].attrTooltip}'><span id='ls-text-addAttr' /></div>
                    <div class="ls-Locking-Attributes">
                        <label class="ls-Attr-Label">
                            <input type="checkbox" class="ls-Att-Ck-Form" id="ls-Unpaved-Enable"><span class="ls-Attr-CheckBox" id="ls-Unpaved-Status" />
                        </label>
                        <label class="ls-Attr-Label">
                            <input type="checkbox" class="ls-Att-Ck-Form" id="ls-OneWay-Enable"><span class="ls-Attr-CheckBox" id="ls-OneWay-Status" />
                        </label>
                        <label class="ls-Attr-Label">
                            <input type="checkbox" class="ls-Att-Ck-Form" id="ls-HOV-Enable"><span class="ls-Attr-CheckBox" id="ls-HOV-Status" />
                        </label>
                        <label class="ls-Attr-Label">
                            <input type="checkbox" class="ls-Att-Ck-Form" id="ls-Toll-Enable"><span class="ls-Attr-CheckBox" id="ls-Toll-Status" />
                        </label>
                        <label class="ls-Attr-Label">
                            <input type="checkbox" class="ls-Att-Ck-Form" id="ls-WKT-Enable"><span class="ls-Attr-CheckBox" id="ls-WKT-Status" />
                        </label>
                    </div>
               </div>`,
        '</div>',
        '</div>'
    ].join(' '));
    // Attach HTML for tab to webpage
    UpdateObj = require('Waze/Action/UpdateObject');
    cakeFlavor = editorInfo.rank;
    roadClear = cakeFlavor >= FEATURELOCK;

    // Script is initialized and the highlighting layer is created
    new WazeWrap.Interface.Tab('LS', $section.html(), initializeSettings);

    WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, LS_UPDATE_NOTES, 'https://greasyfork.org/en/scripts/386773-wme-locksmith', 'https://www.waze.com/forum/viewtopic.php?f=819&t=285583');

    LocksmithHighlightLayer = new OpenLayers.Layer.Vector('LocksmithHighlightLayer', { uniqueName: '_LocksmithHighlightLayer' });
    W.map.addLayer(LocksmithHighlightLayer);
    LocksmithHighlightLayer.setVisibility(true);

    setTimeout(() => {
        if (cakeFlavor < 4) {
            WazeWrap.Alerts.warning(GM_info.script.name, `Editor rank below R5, the maximum you'll be able to lock segments is R${cakeFlavor + 1}`);
        }
    }, 3000);
    console.log('LS: loaded');
}

async function initializeSettings() {
    loadSpreadsheet();
    await loadSettings();
    setUserOptions();

    $(`<style type="text/css">${css}</style>`).appendTo('head');

    // Allows WME native tooltip UI
    $('#ls-Add-Att-Info').tooltip();
    $('#lsConnectionStatus').tooltip();
    $('#ls-Above-Rank-Tooltip').tooltip({ placement: 'auto right' });
    $('#ls-Higher-Level-Tooltip').tooltip({ placement: 'auto bottom' });
    $('#ls-Reset-Standards-Display').tooltip({ placement: 'auto bottom' });

    // Create listeners to run functions when buttons are clicked
    if (roadClear) {
        $('#ls-Lock-All-Submit').click(() => { relockAll(); });
    } else {
        $('#ls-Lock-All-Submit').hover();
        $('#ls-Lock-All-Submit').attr('value', 'Disabled');
        $('#ls-Lock-All-Submit').attr('disabled', true);
        $('#ls-Lock-All-Submit').css('background-color', '#ccc');
    }
    $('#ls-Maual-Scan-Activate').click(() => { scanArea(true); });
    $('#ls-Reset-Standards-Display').click(() => {
        $('#lsEnableSaveValues').prop('checked', false);
        LsSettings.EnableSaveValues = false;
        saveSettings();
        generateStateList();
        getCurrentState();
        setCurrentStandards(_currentState);
        resetUISegStats();
    });
    $('#ls-Othr-Seg-Label').click(() => {
        $('#ls-Seg-Types-Main').toggle();
        $('#ls-Seg-Types-Alt').toggle();
        $('#rl-Othr-Result-Container').toggle();
    });

    $('#ls-State-Selection').change(function () {
        _currentState = this.value;
        setCurrentStandards(_currentState);
    });
    $('#lsEnableHighlightSeg').change(function () { if (!this.checked) { removeHighlights(); } });
    $("input[type='checkbox'].ls-Att-Ck-Form").change(function () {
        const elementName = $(this).attr('id');

        switch (elementName) {
            case 'ls-Unpaved-Enable':
                if (this.checked) $('#ls-Unpaved-Status').css({ 'background-color': 'rgb(205,133,63)', 'background-image': '' });
                else $('#ls-Unpaved-Status').css({ 'background-color': '', 'background-image': 'repeating-linear-gradient(135deg,lightgrey,rgb(205,133,63) 20%,lightgrey 10%)' });
                break;
            case 'ls-OneWay-Enable':
                if (this.checked) $('#ls-OneWay-Status').css({ 'background-color': 'rgb(236, 249, 31)', 'background-image': '' });
                else $('#ls-OneWay-Status').css({ 'background-color': '', 'background-image': 'repeating-linear-gradient(135deg,rgb(239,251,81),rgb(209,224,6) 6px,black 8px)' });
                break;
            case 'ls-HOV-Enable':
                if (this.checked) $('#ls-HOV-Status').css({ 'background-color': 'rgb(254,151,13)', 'background-image': '' });
                else $('#ls-HOV-Status').css({ 'background-color': '', 'background-image': 'repeating-linear-gradient(135deg,rgb(254,151,13),rgb(247,199,134) 6px,black 8px)' });
                break;
            case 'ls-Toll-Enable':
                if (this.checked) $('#ls-Toll-Status').css({ 'background-color': 'rgb(253,14,202)', 'background-image': '' });
                else $('#ls-Toll-Status').css({ 'background-color': '', 'background-image': 'repeating-linear-gradient(135deg,rgb(253,14,202),rgb(252,156,231) 6px,black 8px)' });
                break;
            case 'ls-WKT-Enable':
                if (this.checked) $('#ls-WKT-Status').css({ 'background-color': 'rgb(9,235,255)', 'background-image': '' });
                else $('#ls-WKT-Status').css({ 'background-color': '', 'background-image': 'repeating-linear-gradient(135deg,rgb(9,235,255),rgb(161,247,255) 6px,black 8px)' });
                break;
            default:
                console.log('LS: Seg Att switch error');
        }
    });
    $('#lsManualStateOverride').change(function () {
        if (this.checked) {
            generateStateList();
            $('#ls-State-Select-Container').css('display', 'inline-block');
            $('#ls-Current-State-Display').css('display', 'none');
            setCurrentStandards(_currentState);
        } else {
            $('#ls-State-Select-Container').css('display', 'none');
            $('#ls-Current-State-Display').css('display', 'inline-block');
            _currentState = 'changeME';
            getCurrentState();
        }
    });
    $('#lsEnableActiveScan').change(function () {
        if (!this.checked) {
            resetUISegStats();
            removeHighlights();
        }
    });

    // Trigger checkbox save status
    $('.ls-Save-Status').change(function () {
        let settingName = $(this)[0].id.substr(2);
        LsSettings[settingName] = this.checked;
        saveSettings();
    });
    // Trigger save upon select change
    $('.ls-Select').change(function () {
        let settingName = $(this)[0].id.substr(2);
        LsSettings[settingName] = this.value;
        saveSettings();
    });

    // Register WME event listeners
    W.map.events.register('moveend', null, tryScan);
    W.map.events.register('movestart', null, resetUISegStats);
    W.model.actionManager.events.register('afteraction', null, tryScan);
    W.model.actionManager.events.register('afterundoaction', null, tryScan);
    W.model.actionManager.events.register('afterclearactions', null, tryScan);
    W.model.actionManager.events.register('afterclearactions', null, resetUISegStats);
    W.accelerators.events.register('editHouseNumbers', null, tryScan);

    function setUserOptions() {
        // Checks editors rank and hides lock options above them
        verifyOptionEnable('.ls-Lock-Option-3', 2);
        verifyOptionEnable('.ls-Lock-Option-4', 3);
        verifyOptionEnable('.ls-Lock-Option-5', 4);
        verifyOptionEnable('.ls-Lock-Option-6', 5);
        // Set check boxes based on last use
        setChecked('lsEnableActiveScan', LsSettings.EnableActiveScan);
        setChecked('lsEnableHighlightSeg', LsSettings.EnableHighlightSeg);
        setChecked('lsEnableResetHigher', LsSettings.EnableResetHigher);
        setChecked('lsEnableSaveSettings', LsSettings.EnableSaveSettings);
        setChecked('lsDisableStatePopup', LsSettings.DisableStatePopup);
        setChecked('lsEnableIgnoreRank', LsSettings.EnableIgnoreRank);
        setChecked('lsEnableSaveValues', LsSettings.EnableSaveValues);

        // Enable rank select drop downs appropriate for editors rank
        function verifyOptionEnable(className, rankRequired) {
            if (cakeFlavor < rankRequired) $(className).hide();
        }

        function setChecked(checkboxId, checked) {
            $(`#${checkboxId}`).prop('checked', checked);
        }
    }
}

async function saveSettings() {
    const localsettings = {
        lastSaveAction: Date.now(),
        EnableActiveScan: LsSettings.EnableActiveScan,
        EnableHighlightSeg: LsSettings.EnableHighlightSeg,
        EnableResetHigher: LsSettings.EnableResetHigher,
        DisableStatePopup: LsSettings.DisableStatePopup,
        EnableIgnoreRank: LsSettings.EnableIgnoreRank,
        EnableSaveSettings: LsSettings.EnableSaveSettings,
        EnableSaveValues: LsSettings.EnableSaveValues,
        LockStreetSelect: LsSettings.LockStreetSelect,
        LockPSSelect: LsSettings.LockPSSelect,
        LockMinHSelect: LsSettings.LockMinHSelect,
        LockMajHSelect: LsSettings.LockMajHSelect,
        LockRmpSelect: LsSettings.LockRmpSelect,
        LockFwySelect: LsSettings.LockFwySelect,
        LockPvtSelect: LsSettings.LockPvtSelect,
        LockPlrSelect: LsSettings.LockPlrSelect,
        LockRailSelect: LsSettings.LockRailSelect,
        LockFrySelect: LsSettings.LockFrySelect,
        LockRnwySelect: LsSettings.LockRnwySelect,
        LockOfrdSelect: LsSettings.LockOfrdSelect,
        LockNonpedSelect: LsSettings.LockNonpedSelect

    };

    if (localStorage) { localStorage.setItem('LsUS_Settings', JSON.stringify(localsettings)); }
    // Attempt to connect to the WazeWrap setting store server
    const serverSave = await WazeWrap.Remote.SaveSettings('LsUS_Settings', localsettings);

    if (serverSave === null) console.log('LS: User PIN not set in WazeWrap tab');
    else if (serverSave === false) console.log('LS: Unable to save settings to server');
}

async function loadSettings() {
    const localSettings = $.parseJSON(localStorage.getItem('LsUS_Settings'));
    // Attempt connection to WazeWrap setting server to retrieve settings
    const serverSettings = await WazeWrap.Remote.RetrieveSettings('LsUS_Settings');
    if (!serverSettings) console.log('LS: Error communicating with WW settings server');
    // Default checkbox settings
    const defaultsettings = {
        lastSaveAction: null,
        EnableActiveScan: false,
        EnableHighlightSeg: false,
        EnableResetHigher: false,
        DisableStatePopup: false,
        EnableIgnoreRank: false,
        EnableSaveSettings: false,
        EnableSaveValues: false,
        LockStreetSelect: 'Auto',
        LockPSSelect: 'Auto',
        LockMinHSelect: 'Auto',
        LockMajHSelect: 'Auto',
        LockRmpSelect: 'Auto',
        LockFwySelect: 'Auto',
        LockPvtSelect: 'Auto',
        LockPlrSelect: 'Auto',
        LockRailSelect: 'Auto',
        LockFrySelect: 'Auto',
        LockRnwySelect: 'Auto',
        LockOfrdSelect: 'Auto',
        LockNonpedSelect: 'Auto'
    };

    LsSettings = $.extend({}, defaultsettings, localSettings);
    if (serverSettings && serverSettings.lastSaveAction > LsSettings.lastSaveAction) {
        $.extend(LsSettings, serverSettings);
        console.log('LS: server settings used');
    }
    if (LsSettings.EnableSaveSettings === false) LsSettings = defaultsettings;
    // Sets saved values for segment locks when desired
    if (LsSettings.EnableSaveValues === true) {
        $('#lsLockStreetSelect').val(LsSettings.LockStreetSelect);
        $('#lsLockPSSelect').val(LsSettings.LockPSSelect);
        $('#lsLockMinHSelect').val(LsSettings.LockMinHSelect);
        $('#lsLockMajHSelect').val(LsSettings.LockMajHSelect);
        $('#lsLockRmpSelect').val(LsSettings.LockRmpSelect);
        $('#lsLockFwySelect').val(LsSettings.LockFwySelect);
        $('#lsLockPvtSelect').val(LsSettings.LockPvtSelect);
        $('#lsLockPlrSelect').val(LsSettings.LockPlrSelect);
        $('#lsLockRailSelect').val(LsSettings.LockRailSelect);
        $('#lsLockFrySelect').val(LsSettings.LockFrySelect);
        $('#lsLockRnwySelect').val(LsSettings.LockRnwySelect);
        $('#lsLockOfrdSelect').val(LsSettings.LockOfrdSelect);
        $('#lsLockNonpedSelect').val(LsSettings.LockNonpedSelect);
    }
}

function changeUI(eleID, status, type, inText) {
    if (type === 'lock' && status === 1) {
        $(eleID).attr('disabled', false);
        if (inText === 'high') $(eleID).css({ color: 'cyan', cursor: 'pointer' });
        if (inText === 'low') $(eleID).css({ color: 'red', cursor: 'pointer' });
        if (inText === 'both') $(eleID).css({ color: 'orange', cursor: 'pointer' });
    }
    if (type === 'text' && status === 1) {
        $(eleID).text(inText);
    }
    if (type === 'lock' && status === 0) {
        $(eleID).css({ color: 'lightgrey', cursor: 'default' });
        $(eleID).attr('disabled', true);
        $(eleID).off('click');
    }
}

function resetUISegStats() {
    changeUI('.fa.fa-arrow-circle-up', 0, 'lock', null);
    changeUI('.fa.fa-arrow-circle-down', 0, 'lock', null);
    changeUI('.ls-Seg-Quantity-Low', 1, 'text', '--');
    changeUI('.ls-Seg-Quantity-High', 1, 'text', '--');
    changeUI('#icon-Lock-LS', 0, 'lock', null);
    changeUI('#icon-Lock-PS', 0, 'lock', null);
    changeUI('#icon-Lock-minH', 0, 'lock', null);
    changeUI('#icon-Lock-majH', 0, 'lock', null);
    changeUI('#icon-Lock-Rmp', 0, 'lock', null);
    changeUI('#icon-Lock-Fwy', 0, 'lock', null);
    changeUI('#icon-Lock-othr', 0, 'lock', null);
    changeUI('#icon-Lock-Pvt', 0, 'lock', null);
    changeUI('#icon-Lock-Plr', 0, 'lock', null);
    changeUI('#icon-Lock-Rail', 0, 'lock', null);
    changeUI('#icon-Lock-Rnwy', 0, 'lock', null);
    changeUI('#icon-Lock-Fry', 0, 'lock', null);
    changeUI('#icon-Lock-Ofrd', 0, 'lock', null);
    changeUI('#icon-Lock-Nonped', 0, 'lock', null);
    removeHighlights();
    $("a[href$='#sidepanel-lsus']").css('background-color', '#e9e9e9');
}

function WKT_to_LinearRing(wkt) {
    const lines = wkt.split(',');
    const ringPts = [];

    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i].trim().match(/(-?\d*(?:\.\d*)?)\s(-?\d*(?:\.\d*))/);
        const pt = WazeWrap.Geometry.ConvertTo900913(coords[1], coords[2]);
        ringPts.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
    }
    return new OpenLayers.Geometry.LinearRing(ringPts);
}

async function loadSpreadsheet() {
    let connectionEstablished = false;
    const sheetCode = '1JjEWRMcGUrjL7VkG3P4egVzj3YX_YB6U-lXPGLzg1sg';
    const apiKey = 'AIzaSyDv4Tfcw3QYwvhv_6sIKCm7fEYXBK0J-J4';
    const standardsFailFunc = (jqXHR, textStatus, errorThrown) => {
        console.error('LS: Error loading settings:', errorThrown);
    };
    const translationsFailFunc = (jqXHR, textStatus, errorThrown) => {
        console.error('LS: Error loading trans:', errorThrown);
    };

    try {
        await $.getJSON(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetCode}/values/Translations!A2:C?key=${apiKey}`
        )
            .done(async (transArray) => {
                if (transArray.values.length > 0) {
                    _.each(transArray.values, t => {
                        if (!TRANSLATIONS[t[1]] && Number.parseInt(t[2], 10) === 1) {
                            TRANSLATIONS[t[1]] = JSON.parse(t[0]);
                        }
                    });
                } else {
                    translationsFailFunc();
                }
            })
            .fail(translationsFailFunc);
    } catch (e) {
        translationsFailFunc(null, null, e);
    }

    try {
        await $.getJSON(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetCode}/values/Standards!A2:D?key=${apiKey}`
        )
            .done((serverSettings) => {
                if (serverSettings.values.length > 0) {
                    _.each(serverSettings.values, v => {
                        if (!_allStandardsArray[v[1]]) _allStandardsArray[v[1]] = {};
                        if (!_allStandardsArray[v[1]].States) _allStandardsArray[v[1]].States = {};
                        if (!_allStandardsArray[v[1]].States[v[2]]) _allStandardsArray[v[1]].States[v[2]] = JSON.parse(v[0]);
                        else {
                            if (!_allStandardsArray[v[1]].States[v[2]].Areas) _allStandardsArray[v[1]].States[v[2]].Areas = {};
                            _allStandardsArray[v[1]].States[v[2]].Areas[v[3]] = JSON.parse(v[0]);
                            if (v[3].startsWith('POLYGON')) _allStandardsArray[v[1]].States[v[2]].Areas[v[3]].Polygon = new OpenLayers.Geometry.Polygon(WKT_to_LinearRing(v[3]));
                        }
                    });
                    connectionEstablished = true;
                } else {
                    standardsFailFunc();
                }
            })
            .fail(standardsFailFunc);
    } catch (e) {
        standardsFailFunc(null, null, e);
    }

    if (connectionEstablished) {
        $('#lsConnectionStatus').text('Good');
        $('#lsConnectionStatus').css('backgroundColor', 'lime');
    } else {
        $('#lsConnectionStatus').text('Error');
        $('#lsConnectionStatus').css('backgroundColor', 'red');
    }

    // Process state standards for later use
    _.each(_allStandardsArray, stateKey => {
        for (const k in stateKey) {
            if (stateKey.hasOwnProperty(k)) {
                // Check if strings are numbers and convert to numbers if so
                let keyValue = stateKey[k];
                // convert "" values to null
                if (keyValue == '') keyValue = null;
                // If lock is 1 then change to Auto to prevent excessive 1 locks
                let tempKey = parseInt(keyValue);
                if (!isNaN(tempKey)) {
                    if (keyValue == 1) tempKey = 'Auto';
                    keyValue = tempKey;
                }
                stateKey[k] = keyValue;
            }
        }

        if (stateKey.Areas) {
            _.each(stateKey.Areas, polyArea => {
                for (const k in polyArea) {
                    if (polyArea.hasOwnProperty(k)) {
                        // Check if strings are numbers and convert to numbers if so
                        let keyValue = polyArea[k];
                        // convert "" values to null
                        if (keyValue == '') keyValue = null;
                        // If lock is 1 then change to Auto to prevent excessive 1 locks
                        let tempKey = parseInt(keyValue);
                        if (!isNaN(tempKey)) {
                            if (keyValue == 1) tempKey = 'Auto';
                            keyValue = tempKey;
                        }
                        polyArea[k] = keyValue;
                    }
                }
            });
        }
    });

    getCurrentState();
    setUIText();
}

function setUIText() {
    let strings = {};
    langLocality = I18n.currentLocale().toLowerCase();
    if (TRANSLATIONS[langLocality]) {
        strings = TRANSLATIONS[langLocality];
    } else if (langLocality.includes('-') && TRANSLATIONS[langLocality.split('-')[0]]) {
        strings = TRANSLATIONS[langLocality.split('-')[0]];
    } else {
        strings = TRANSLATIONS.default;
    }

    $('#ls-text-options').text(strings.optionsMenu);
    $('#ls-text-activeScan').text(strings.activeScan);
    $('#ls-text-enHighlights').text(strings.enHighlights);
    $('#ls-text-detAbvRank').text(strings.detAbvRank);
    $('#ls-text-saveCustLock').text(strings.saveCustLock);
    $('#ls-text-saveScnSet').text(strings.saveScnSet);
    $('#ls-text-manStateSel').text(strings.manStateSel);
    $('#ls-text-disStatePop').text(strings.disStatePop);
    $('#ls-text-ovrLockSegs').text(strings.ovrLockSegs);
    $('#ls-text-othrSegTypes').text(strings.othrSegTypes);
    $('#ls-text-addAttr').text(strings.addAttr);
    $('#ls-text-lockStand').text(strings.lockStand);
    $('#ls-text-lockStat').text(strings.lockStat);
    $('.ls-option0').text(strings.option0);
    $('.ls-optionHRCS').text(strings.optionHRCS);
    $('.ls-option1').text(strings.option1);
    $('.ls-option2').text(strings.option2);
    $('.ls-option3').text(strings.option3);
    $('.ls-option4').text(strings.option4);
    $('.ls-option5').text(strings.option5);
    $('.ls-option6').text(strings.option6);
    $('.ls-FWY-Label').text(strings.roadFwy);
    $('.ls-Ramp-Label').text(strings.roadRmp);
    $('.ls-majH-Label').text(strings.roadMajH);
    $('.ls-minH-Label').text(strings.roadMinH);
    $('.ls-PS-Label').text(strings.roadPS);
    $('.ls-LS-Label').text(strings.roadLS);
    $('.ls-Pvt-Label').text(strings.roadPVT);
    $('.ls-Plr-Label').text(strings.roadPLR);
    $('.ls-Rail-Label').text(strings.roadRail);
    $('.ls-Fry-Label').text(strings.roadFry);
    $('.ls-Ofrd-Label').text(strings.roadOff);
    $('.ls-Rnwy-Label').text(strings.roadRun);
    $('.ls-Nonped-Label').text(strings.roadNonPed);
    $('#ls-Unpaved-Status').text(strings.unpaved);
    $('#ls-OneWay-Status').text(strings.oneWay);
    $('#ls-HOV-Status').text(strings.hov);
    $('#ls-WKT-Status').text(strings.wkt);
    $('#ls-Toll-Status').text(strings.toll);
    $('.ls-Seg-Quantity-Low').text('--');
    $('.ls-Seg-Quantity-High').text('--');
    $('.fa.fa-arrow-circle-up').css({ color: 'lightgrey', cursor: 'default' });
    $('.fa.fa-arrow-circle-down').css({ color: 'lightgrey', cursor: 'default' });
    $('.fa.fa-arrow-circle-up').attr('disabled', true);
    $('.fa.fa-arrow-circle-down').attr('disabled', true);
}

function getCurrentState() {
    const overrideEnable = getId('lsManualStateOverride').checked;
    const disablePopup = getId('lsDisableStatePopup').checked;
    let statusOk = false;
    let attempts = 0;

    function stateModelStatus() {
        const statesAvailable = W.model.states.getObjectArray();

        if (statesAvailable) {
            // Verify the number of states currently available and either prompt for manual selection or set standards based on that state
            if (statesAvailable.length > 1) {
                if (!overrideEnable) {
                    if (!disablePopup) WazeWrap.Alerts.info(GM_info.script.name, 'Multiple States available, please manually set the correct state or zoom in/out to reset the States layer');
                    $('#ls-Current-State-Display').text('Multiple');
                } else statusOk = true;
            } else if (statesAvailable.length === 1 && !overrideEnable) {
                if (_currentState !== statesAvailable[0].name) {
                    _currentState = statesAvailable[0].name;
                    $('#ls-Current-State-Display').text(_currentState);
                    setCurrentStandards(_currentState);
                    statusOk = true;
                } else statusOk = true;
            } else if (attempts < 20) setTimeout(() => { stateModelStatus(attempts++); }, 300);
        } else if (attempts < 20) setTimeout(() => { stateModelStatus(attempts++); }, 300);
        else WazeWrap.Alerts.warning(GM_info.script.name, 'Error loading state array');
    }
    stateModelStatus();
    return statusOk;
}

function checkCountry() {
    try {
        country = W.model.getTopCountry().name;
    } catch (err) {
        country = null;
        // console.log(err);
    }
}

function generateStateList() {
    const stateSelector = getId('ls-State-Selection');
    const currOptionsLength = stateSelector.childNodes.length;
    const statesAvailable = W.model.states.getObjectArray();

    // Removes any options currently attached to the select
    if (currOptionsLength > 0) {
        for (let i = 0; i < currOptionsLength; i++) {
            stateSelector.removeChild(stateSelector.firstChild);
        }
    }

    // Adds available states to the user select
    for (let i = 0; i < statesAvailable.length; i++) {
        const currStateName = statesAvailable[i].name;
        const newStateOption = document.createElement('option');
        const stateNameText = document.createTextNode(currStateName);
        if (i === 0) {
            newStateOption.setAttribute('selected', true);
            _currentState = currStateName;
        }
        newStateOption.appendChild(stateNameText);
        stateSelector.appendChild(newStateOption);
    }
}

function setCurrentStandards(stateName) {
    let attempts = 0;
    let proceed = false;
    // Sets the locking standards based on the state and updates relevent UI components
    function applyStandards() {
        if (W.model.states.getObjectArray().length > 0) {
            _.each(W.model.states.getObjectArray(), s => {
                if (s.name === stateName) {
                    if (W.model.countries.getObjectById(s.countryID).name) {
                        country = W.model.countries.getObjectById(s.countryID).name;
                        proceed = true;
                        _currentStateStandards = _allStandardsArray[country].States[stateName];
                    }
                }
            });
        }

        if (_currentStateStandards && _currentStateStandards.LS && proceed) {
            if (!getId('lsEnableSaveValues').checked) {
                $('#lsLockStreetSelect').val(_currentStateStandards.LS);
                $('#lsLockPSSelect').val(_currentStateStandards.PS);
                $('#lsLockMinHSelect').val(_currentStateStandards.mH);
                $('#lsLockMajHSelect').val(_currentStateStandards.MH);
                $('#lsLockRmpSelect').val(_currentStateStandards.Ramp);
                $('#lsLockFwySelect').val(_currentStateStandards.Fwy);
                $('#lsLockPvtSelect').val(_currentStateStandards.Private);
                $('#lsLockPlrSelect').val(_currentStateStandards.PLR);
                $('#lsLockRailSelect').val(_currentStateStandards.Railroad);
                $('#lsLockFrySelect').val(_currentStateStandards.Ferry);
                $('#lsLockRnwySelect').val(_currentStateStandards.Runway);
                $('#lsLockOfrdSelect').val(_currentStateStandards.Offroad);
                $('#lsLockNonpedSelect').val(_currentStateStandards.NonRoutablePedestrian);
            }

            // Setup seg attribute based locks on UI
            if (_currentStateStandards.Unpaved) {
                $('#ls-Unpaved-Enable').attr('disabled', false);
                $('#ls-Unpaved-Enable').prop('checked', true);
                $('#ls-Unpaved-Status').css({ 'background-color': 'rgb(205,133,63)', 'background-image': '' });
            } else {
                $('#ls-Unpaved-Enable').attr('disabled', true);
                $('#ls-Unpaved-Status').css({ 'background-image': 'repeating-linear-gradient(135deg,lightgrey,grey 10px,black 4px)', 'background-color': '' });
            }
            if (_currentStateStandards.LS1Way || _currentStateStandards.PS1Way || _currentStateStandards.mH1Way
                || _currentStateStandards.MH1Way || _currentStateStandards.Private1Way) {
                $('#ls-OneWay-Enable').attr('disabled', false);
                $('#ls-OneWay-Enable').prop('checked', true);
                $('#ls-OneWay-Status').css({ 'background-color': 'rgb(236,249,31)', 'background-image': '' });
            } else {
                $('#ls-OneWay-Enable').attr('disabled', true);
                $('#ls-OneWay-Status').css({ 'background-image': 'repeating-linear-gradient(135deg,lightgrey,grey 10px,black 4px)', 'background-color': '' });
            }
            if (_currentStateStandards.HOV) {
                $('#ls-HOV-Enable').attr('disabled', false);
                $('#ls-HOV-Enable').prop('checked', true);
                $('#ls-HOV-Status').css({ 'background-color': 'rgb(254,151,13)', 'background-image': '' });
            } else {
                $('#ls-HOV-Enable').attr('disabled', true);
                $('#ls-HOV-Status').css({ 'background-image': 'repeating-linear-gradient(135deg,lightgrey,grey 10px,black 4px)', 'background-color': '' });
            }
            if (_currentStateStandards.Toll) {
                $('#ls-Toll-Enable').attr('disabled', false);
                $('#ls-Toll-Enable').prop('checked', true);
                $('#ls-Toll-Status').css({ 'background-color': 'rgb(253,14,202)', 'background-image': '' });
            } else {
                $('#ls-Toll-Enable').attr('disabled', true);
                $('#ls-Toll-Status').css({ 'background-image': 'repeating-linear-gradient(135deg,lightgrey,grey 10px,black 4px)', 'background-color': '' });
            }
            if (_currentStateStandards.Areas) {
                $('#ls-WKT-Enable').attr('disabled', false);
                $('#ls-WKT-Enable').prop('checked', true);
                $('#ls-WKT-Status').css({ 'background-color': 'rgb(9,235,255)', 'background-image': '' });
            } else {
                $('#ls-WKT-Enable').attr('disabled', true);
                $('#ls-WKT-Status').css({ 'background-image': 'repeating-linear-gradient(135deg,lightgrey,grey 10px,black 4px)', 'background-color': '' });
            }

            console.log(`LS: Lock levels loaded for: ${stateName}`);
        } else {
            if (attempts < 3) {
                setTimeout(() => { applyStandards(); }, 200);
            } else {
                // console.log('LS: Error in settings current standards');
                generateStateList();
                getCurrentState();
                setCurrentStandards(_currentState);
            }
            attempts++;
        }
    }
    applyStandards();
}

function getId(iD) {
    return document.getElementById(iD);
}

function onScreen(obj) {
    if (obj.geometry) {
        return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
    }
    return false;
}

function removeHighlights() {
    LocksmithHighlightLayer.removeAllFeatures();
}

function processLocks(seg, currLockRnk, stdLockRnk) {
    // Process lock action
    if (stdLockRnk > cakeFlavor) stdLockRnk = cakeFlavor;
    if (((currLockRnk < stdLockRnk) || (currLockRnk == null && stdLockRnk != null) ||
            ((currLockRnk > stdLockRnk) && (currLockRnk <= cakeFlavor))) &&
        seg.isGeometryEditable() && seg.attributes.hasClosures === false) {
        W.model.actionManager.add(new UpdateObj(seg, { lockRank: stdLockRnk }));
        return true;
    }
    return false;
}

function getSegmentConditions(seg, conditions) {
    // Determine segment attributes for locking exceptions
    const restrictions = seg.restrictions;
    if ((seg.fwdDirection === false && seg.revDirection === true) || (seg.fwdDirection === true && seg.revDirection === false)) conditions.isOneWay = true;
    if (seg.fwdToll === true || seg.revToll === true) conditions.isTollRoad = true;
    if (restrictions.length > 0) {
        for (let i = 0; i < restrictions.length; i++) {
            if (restrictions[i]._defaultType === 'TOLL') conditions.isTollRoad = true;
        }
    }
    if (seg.flags === 16) conditions.isUnpaved = true;
    return conditions;
}

function getHighestLock(segID) {
    const segObj = W.model.segments.getObjectById(segID);
    const segType = segObj.attributes.roadType;
    const checkedSegs = [];
    let forwardLock = null;
    let reverseLock = null;

    function processForNode(forwardID) {
        checkedSegs.push(forwardID);
        const forNode = W.model.segments.getObjectById(forwardID).getToNode();
        const forNodeSegs = [...forNode.attributes.segIDs];

        for (let j = 0; j < forNodeSegs.length; j++) {
            if (forNodeSegs[j] === forwardID) { forNodeSegs.splice(j, 1); }
        }

        for (let i = 0; i < forNodeSegs.length; i++) {
            const conSeg = W.model.segments.getObjectById(forNodeSegs[i]).attributes;

            if (conSeg.roadType !== segType) {
                forwardLock = Math.max(conSeg.lockRank, forwardLock);
            } else {
                for (let k = 0; k < forNodeSegs.length; k++) {
                    if (!checkedSegs.some(segNum => segNum === conSeg.id)) {
                        const tempRank = processForNode(conSeg.id);
                        if (tempRank > forwardLock) forwardLock = tempRank;
                    }
                }
            }
        }
        return forwardLock;
    }

    function processRevNode(reverseID) {
        checkedSegs.push(reverseID);
        const revNode = W.model.segments.getObjectById(reverseID).getFromNode();
        const revNodeSegs = [...revNode.attributes.segIDs];

        for (let j = 0; j < revNodeSegs.length; j++) {
            if (revNodeSegs[j] === reverseID) { revNodeSegs.splice(j, 1); }
        }

        for (let i = 0; i < revNodeSegs.length; i++) {
            const conSeg = W.model.segments.getObjectById(revNodeSegs[i]).attributes;

            if (conSeg.roadType !== segType) {
                reverseLock = Math.max(conSeg.lockRank, reverseLock);
            } else {
                for (let k = 0; k < revNodeSegs.length; k++) {
                    if (!checkedSegs.some(segNum => segNum === conSeg.id)) {
                        const tempRank = processRevNode(conSeg.id);
                        if (tempRank > reverseLock) { reverseLock = tempRank; }
                    }
                }
            }
        }
        return reverseLock;
    }

    return Math.max(processForNode(segID), processRevNode(segID));
}

function processSegment(seg) {
    const segAtt = seg.attributes;
    const segType = segAtt.roadType;
    let lockUpdateLvl = null;
    let enUpdate = false;
    let tempLocks = _currentStateStandards;
    let possiblePolys = [];

    // Gather primary segment locks from UI in case of user override of standards
    tempLocks.LS = getId('lsLockStreetSelect').value;
    tempLocks.PS = getId('lsLockPSSelect').value;
    tempLocks.mH = getId('lsLockMinHSelect').value;
    tempLocks.MH = getId('lsLockMajHSelect').value;
    tempLocks.Ramp = getId('lsLockRmpSelect').value;
    tempLocks.Fwy = getId('lsLockFwySelect').value;
    tempLocks.Private = getId('lsLockPvtSelect').value;
    tempLocks.PLR = getId('lsLockPlrSelect').value;
    tempLocks.Railroad = getId('lsLockRailSelect').value;
    tempLocks.Ferry = getId('lsLockFrySelect').value;
    tempLocks.Offroad = getId('lsLockOfrdSelect').value;
    tempLocks.Runway = getId('lsLockRnwySelect').value;
    tempLocks.NonRoutablePedestrian = getId('lsLockNonpedSelect').value;
    const unpavedChkd = getId('ls-Unpaved-Enable').checked;
    const oneWayChkd = getId('ls-OneWay-Enable').checked;
    const tollChkd = getId('ls-Toll-Enable').checked;
    const wktChkd = getId('ls-WKT-Enable').checked;
    // const hovChkd = getId('ls-HOV-Enable').checked;

    let segStatus = seg.state == null ? 'good' : seg.state;
    if (segStatus.toLowerCase() !== 'insert' && segStatus.toLowerCase() !== 'delete') {
        // Gather/verify info attached to segment
        const priSt = W.model.streets.getObjectById(segAtt.primaryStreetID);
        const cityObj = W.model.cities.getObjectById(priSt.cityID);
        const cityName = cityObj.attributes.name;
        const segStateName = W.model.states.getObjectById(cityObj.attributes.stateID).name;
        // Setup object to verify certain segment attributes
        const conditions = {
            isOneWay: false,
            isTollRoad: false,
            isTunnel: false,
            isUnpaved: false,
            hasHeadlights: false
        };

        // Check if segment is in special city/polygon locking standards
        if (wktChkd) {
            _.each(tempLocks.Areas, (v, k) => {
                if (!k.startsWith('POLYGON')) {
                    if (k === cityName) {
                        tempLocks = v;
                    }
                } else { possiblePolys.push(v); }
            });
            for (let i = 0; i < possiblePolys.length; i++) {
                if (possiblePolys[i].Polygon.intersects(seg.geometry)) {
                    tempLocks = possiblePolys[i];
                    break;
                }
            }
        }

        const coreLocks = {
            lsLock: tempLocks.LS === 'Auto' ? 0 : tempLocks.LS - 1,
            psLock: tempLocks.PS === 'Auto' ? 0 : tempLocks.PS - 1,
            minHLock: tempLocks.mH === 'Auto' ? 0 : tempLocks.mH - 1,
            majHLock: tempLocks.MH === 'Auto' ? 0 : tempLocks.MH - 1,
            rmpLock: tempLocks.Ramp >= 0 ? tempLocks.Ramp - 1 : tempLocks.Ramp,
            fwyLock: tempLocks.Fwy === 'Auto' ? 0 : tempLocks.Fwy - 1,
            plrLock: tempLocks.PLR === 'Auto' ? 0 : tempLocks.PLR - 1,
            pvtLock: tempLocks.Private === 'Auto' ? 0 : tempLocks.Private - 1,
            nrpedLock: tempLocks.NonRoutablePedestrian === 'Auto' ? 0 : tempLocks.NonRoutablePedestrian - 1,
            fryLock: tempLocks.Ferry === 'Auto' ? 0 : tempLocks.Ferry - 1,
            rrLock: tempLocks.Railroad === 'Auto' ? 0 : tempLocks.Railroad - 1,
            rnwyLock: tempLocks.Runway === 'Auto' ? 0 : tempLocks.Runway - 1,
            offRoadLock: tempLocks.Offroad === 'Auto' ? 0 : tempLocks.Offroad - 1
        };
        const attLocks = {
            pvtOneWay: tempLocks.Private1Way != null ? tempLocks.Private1Way - 1 : coreLocks.pvtLock,
            plrOneWay: tempLocks.PLR1Way != null ? tempLocks.PLR1Way - 1 : coreLocks.plrLock,
            lsOneWay: tempLocks.LS1Way != null ? tempLocks.LS1Way - 1 : coreLocks.lsLock,
            psOneWay: tempLocks.PS1Way != null ? tempLocks.PS1Way - 1 : coreLocks.psLock,
            minOneWay: tempLocks.mH1Way != null ? tempLocks.mH1Way - 1 : coreLocks.minHLock,
            majOneWay: tempLocks.MH1Way != null ? tempLocks.MH1Way - 1 : coreLocks.majHLock,
            tollLock: tempLocks.Toll != null ? tempLocks.Toll - 1 : null,
            unpavedLock: tempLocks.Unpaved != null
        };

        if (seg.type === 'segment' && onScreen(seg) && (segStateName === _currentState)) {
            getSegmentConditions(segAtt, conditions);

            // Process local streets
            if (segType === 1) {
                lockUpdateLvl = coreLocks.lsLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.lsOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.lsOneWay;
                }
                enUpdate = true;
            }
            // Process primary streets
            if (segType === 2) {
                lockUpdateLvl = coreLocks.psLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.psOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.psOneWay;
                }
                enUpdate = true;
            }
            // Process Fwy
            if (segType === 3) {
                lockUpdateLvl = coreLocks.fwyLock;
                enUpdate = true;
            }
            // Process ramps
            if (segType === 4) {
                lockUpdateLvl = coreLocks.rmpLock;
                enUpdate = true;
                if (lockUpdateLvl === 'HRCS') {
                    lockUpdateLvl = getHighestLock(segAtt.id);
                }
            }
            // Process routable ped path
            // if(segType == 5) {
            // lockUpdateLvl = coreLocks.rpedLock;
            // enUpdate = true;
            // }
            // Process MH
            if (segType === 6) {
                lockUpdateLvl = coreLocks.majHLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.majHOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.majOneWay;
                }
                enUpdate = true;
            }
            // Process minor highways
            if (segType === 7) {
                lockUpdateLvl = coreLocks.minHLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.minHOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.minHOneWay;
                }
                enUpdate = true;
            }
            // Process offroad
            if (segType === 8) {
                lockUpdateLvl = coreLocks.offRoadLock;
                enUpdate = true;
            }
            // Process non-routable ped path
            if (segType === 10) {
                lockUpdateLvl = coreLocks.nrpedLock;
                enUpdate = true;
            }
            // Process Ferry
            if (segType === 15) {
                lockUpdateLvl = coreLocks.fryLock;
                enUpdate = true;
            }
            // Process PVT
            if (segType === 17) {
                lockUpdateLvl = coreLocks.pvtLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.pvtOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.pvtOneWay;
                }
                enUpdate = true;
            }
            // Process Railroads
            if (segType === 18) {
                lockUpdateLvl = coreLocks.rrLock;
                enUpdate = true;
            }
            // Process Runways
            if (segType === 19) {
                lockUpdateLvl = coreLocks.rnwyLock;
                enUpdate = true;
            }
            // Process PLR
            if (segType === 20) {
                lockUpdateLvl = coreLocks.plrLock;

                if (conditions.isUnpaved && attLocks.unpavedLock && unpavedChkd) {
                    lockUpdateLvl++;
                }
                if (conditions.isOneWay && attLocks.plrOneWay && oneWayChkd) {
                    lockUpdateLvl = attLocks.plrOneWay;
                }
                enUpdate = true;
            }
            if (conditions.isTollRoad && attLocks.tollLock && tollChkd) {
                lockUpdateLvl = attLocks.tollLock;
            }
            if (lockUpdateLvl === -1) lockUpdateLvl = 0;
        }
    }

    if (enUpdate) return lockUpdateLvl;
    return false;
}

function relockAll() {
    let count = 0;
    const resetHigher = getId('lsEnableResetHigher').checked;

    if (getCurrentState()) {
        _.each(W.model.segments.getObjectArray(), v => {
            const segAtt = v.attributes;
            const currLockRnk = segAtt.lockRank;
            let updateSuccess;

            const stdLockRank = processSegment(v);

            if (stdLockRank !== false) {
                if (currLockRnk < stdLockRank || (currLockRnk > stdLockRank && resetHigher)) {
                    updateSuccess = processLocks(v, currLockRnk, stdLockRank);
                }
            }
            if (updateSuccess) count++;
        });
        resetUISegStats();

        if (count > 0) WazeWrap.Alerts.info(GM_info.script.name, `Locked ${count} segments`);
        else WazeWrap.Alerts.info(GM_info.script.name, 'No segments out of standards');
    }
}

function tryScan() {
    if (W.app.modeController.model.attributes.mode == 0 && !W.editingMediator.attributes.editingHouseNumbers && getId('lsEnableActiveScan').checked) scanArea(false);
}

function scanArea(manual) {
    // Start by resetting UI scan elements
    resetUISegStats();
    let okGO = getCurrentState();

    function editorSufficientRank(segRank, standardRank) {
        if (cakeFlavor >= segRank && cakeFlavor >= standardRank) { return true; }
        return false;
    }

    function highlightSegments(errorType, segGeo) {
        const enableHighlight = getId('lsEnableHighlightSeg').checked;
        if (enableHighlight) {
            const style = {
                strokeColor: '',
                strokeLinecap: 'round',
                strokeWidth: 18,
                fill: false,
                strokeOpacity: 0.5
            };
            if (errorType === 'high') { style.strokeColor = 'cyan'; } else { style.strokeColor = 'red'; }

            const geo = segGeo.clone();
            const feature = new OpenLayers.Feature.Vector(geo, {}, style);
            LocksmithHighlightLayer.addFeatures([feature]);
        }
    }

    if (okGO) {
        // Object with array of roadtypes, to collect each wrongly locked segment, for later use
        const badLockSegs = {
            ls: [],
            ps: [],
            mih: [],
            mah: [],
            rmp: [],
            fwy: [],
            plr: [],
            pvt: [],
            rail: [],
            fry: [],
            rnwy: [],
            ofrd: [],
            nrpd: [],
            othr: []
        };
        let incorrectLocks = false;
        let numWrongLocks = 0;
        const resetHigher = getId('lsEnableResetHigher').checked;
        const ignoreHigher = getId('lsEnableIgnoreRank').checked;

        // Count how many segments need a corrected lock (limit to 150 to save CPU), accounts for the users editor level
        _.each(W.model.segments.getObjectArray(), v => {
            if (numWrongLocks < 150 && v.type === 'segment' && onScreen(v)) {
                const correctLockRank = processSegment(v);

                if (correctLockRank !== false) {
                    const segGeo = v.geometry;
                    const segType = v.attributes.roadType;
                    const segLockRank = v.attributes.lockRank;

                    // LS
                    if (segType === 1) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ls.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ls.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // PS
                    if (segType === 2) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ps.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ps.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Fwy
                    if (segType === 3) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.fwy.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.fwy.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Rmp
                    if (segType === 4) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rmp.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rmp.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // MH
                    if (segType === 6) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.mah.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.mah.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // mH
                    if (segType === 7) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.mih.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.mih.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Offroad
                    if (segType === 8) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ofrd.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.ofrd.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Non-Routable Ped
                    if (segType === 10) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.nrpd.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.nrpd.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Ferry
                    if (segType === 15) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.fry.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.fry.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Pvt
                    if (segType === 17) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.pvt.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.pvt.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Railroads
                    if (segType === 18) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rail.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rail.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // Runway
                    if (segType === 19) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rnwy.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.rnwy.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // PLR
                    if (segType === 20) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.plr.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.plr.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                    // All other segment types
                    if (segType === 8 || segType === 10 || segType === 15 || segType === 17 || segType === 18 || segType === 19 || segType === 20) {
                        if (resetHigher && segLockRank > correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.othr.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'high'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('high', segGeo);
                        }
                        if (segLockRank < correctLockRank && (editorSufficientRank(segLockRank, correctLockRank) || ignoreHigher)) {
                            badLockSegs.othr.push({
                                segID: v.attributes.id,
                                currLockRnk: segLockRank,
                                stdLockRnk: correctLockRank,
                                lockError: 'low'
                            });
                            incorrectLocks = true;
                            numWrongLocks++;
                            highlightSegments('low', segGeo);
                        }
                    }
                }
            }
        });


        // Enable/configure UI elements if bad segments are found
        let lsLow = 0;
        let lsHigh = 0;
        let psLow = 0;
        let psHigh = 0;
        let miLow = 0;
        let miHigh = 0;
        let maLow = 0;
        let maHigh = 0;
        let rmpLow = 0;
        let rmpHigh = 0;
        let fwyLow = 0;
        let fwyHigh = 0;
        let othrLow = 0;
        let othrHigh = 0;
        let plrLow = 0;
        let plrHigh = 0;
        let pvtLow = 0;
        let pvtHigh = 0;
        let railLow = 0;
        let railHigh = 0;
        let fryLow = 0;
        let fryHigh = 0;
        let rnwyLow = 0;
        let rnwyHigh = 0;
        let ofrdLow = 0;
        let ofrdHigh = 0;
        let nrpdLow = 0;
        let nrpdHigh = 0;
        if (incorrectLocks) {
            _.each(badLockSegs, (key, value) => {
                if (value === 'ls') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') lsHigh++;
                        if (key[i].lockError === 'low') lsLow++;
                    }
                    if (lsHigh > 0 || lsLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-LS', 1, 'lock', 'both');
                            $('#icon-Lock-LS').click(() => {
                                for (let i = 0; i < badLockSegs.ls.length; i++) {
                                    const aryData = badLockSegs.ls[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-LS', 0, 'lock', null);
                                changeUI('#ls-LS-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-LS-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-LS-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-LS-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (lsHigh > 0) {
                            changeUI('#ls-LS-High-Quan', 1, 'text', lsHigh);
                            
                            if (roadClear) {
                                changeUI('#ls-LS-Lock-Down', 1, 'lock', 'high');
                                $('#ls-LS-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.ls.length; i++) {
                                        const aryData = badLockSegs.ls[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-LS-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-LS-High-Quan', 1, 'text', '--');
                                    lsHigh = 0;
                                    if (lsLow === 0) changeUI('#icon-Lock-LS', 0, 'lock', null);
                                });
                            }
                        }
                        if (lsLow > 0) {
                            changeUI('#ls-LS-Low-Quan', 1, 'text', lsLow);

                            if (roadClear) {
                                changeUI('#ls-LS-Lock-Up', 1, 'lock', 'low');
                                $('#ls-LS-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.ls.length; i++) {
                                        const aryData = badLockSegs.ls[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-LS-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-LS-Low-Quan', 1, 'text', '--');
                                    lsLow = 0;
                                    if (lsHigh === 0) changeUI('#icon-Lock-LS', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'ps') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') psHigh++;
                        if (key[i].lockError === 'low') psLow++;
                    }
                    if (psHigh > 0 || psLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-PS', 1, 'lock', 'both');
                            $('#icon-Lock-PS').click(() => {
                                for (let i = 0; i < badLockSegs.ps.length; i++) {
                                    const aryData = badLockSegs.ps[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-PS', 0, 'lock', null);
                                changeUI('#ls-PS-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-PS-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-PS-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-PS-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (psHigh > 0) {
                            changeUI('#ls-PS-High-Quan', 1, 'text', psHigh);

                            if (roadClear) {
                                changeUI('#ls-PS-Lock-Down', 1, 'lock', 'high');
                                $('#ls-PS-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.ps.length; i++) {
                                        const aryData = badLockSegs.ps[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-PS-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-PS-High-Quan', 1, 'text', '--');
                                    psHigh = 0;
                                    if (psLow === 0) changeUI('#icon-Lock-PS', 0, 'lock', null);
                                });
                            }
                        }
                        if (psLow > 0) {
                            changeUI('#ls-PS-Low-Quan', 1, 'text', psLow);

                            if (roadClear) {
                                changeUI('#ls-PS-Lock-Up', 1, 'lock', 'low');
                                $('#ls-PS-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.ps.length; i++) {
                                        const aryData = badLockSegs.ps[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-PS-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-PS-Low-Quan', 1, 'text', '--');
                                    psLow = 0;
                                    if (psHigh === 0) changeUI('#icon-Lock-PS', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'mih') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') miHigh++;
                        if (key[i].lockError === 'low') miLow++;
                    }
                    if (miHigh > 0 || miLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-minH', 1, 'lock', 'both');
                            $('#icon-Lock-minH').click(() => {
                                for (let i = 0; i < badLockSegs.mih.length; i++) {
                                    const aryData = badLockSegs.mih[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-minH', 0, 'lock', null);
                                changeUI('#ls-minH-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-minH-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-minH-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-minH-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (miHigh > 0) {
                            changeUI('#ls-minH-High-Quan', 1, 'text', miHigh);

                            if (roadClear) {
                                changeUI('#ls-minH-Lock-Down', 1, 'lock', 'high');
                                $('#ls-minH-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.mih.length; i++) {
                                        const aryData = badLockSegs.mih[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-minH-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-minH-High-Quan', 1, 'text', '--');
                                    miHigh = 0;
                                    if (miLow === 0) changeUI('#icon-Lock-minH', 0, 'lock', null);
                                });
                            }
                        }
                        if (miLow > 0) {
                            changeUI('#ls-minH-Low-Quan', 1, 'text', miLow);

                            if (roadClear) {
                                changeUI('#ls-minH-Lock-Up', 1, 'lock', 'low');
                                $('#ls-minH-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.mih.length; i++) {
                                        const aryData = badLockSegs.mih[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-minH-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-minH-Low-Quan', 1, 'text', '--');
                                    miLow = 0;
                                    if (miHigh === 0) changeUI('#icon-Lock-minH', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'mah') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') maHigh++;
                        if (key[i].lockError === 'low') maLow++;
                    }
                    if (maHigh > 0 || maLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-majH', 1, 'lock', 'both');
                            $('#icon-Lock-majH').click(() => {
                                for (let i = 0; i < badLockSegs.mah.length; i++) {
                                    const aryData = badLockSegs.mah[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-majH', 0, 'lock', null);
                                changeUI('#ls-majH-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-majH-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-majH-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-majH-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (maHigh > 0) {
                            changeUI('#ls-majH-High-Quan', 1, 'text', maHigh);

                            if (roadClear) {
                                changeUI('#ls-majH-Lock-Down', 1, 'lock', 'high');
                                $('#ls-majH-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.mah.length; i++) {
                                        const aryData = badLockSegs.mah[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-majH-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-majH-High-Quan', 1, 'text', '--');
                                    maHigh = 0;
                                    if (maLow === 0) changeUI('#icon-Lock-majH', 0, 'lock', null);
                                });
                            }
                        }
                        if (maLow > 0) {
                            changeUI('#ls-majH-Low-Quan', 1, 'text', maLow);

                            if (roadClear) {
                                changeUI('#ls-majH-Lock-Up', 1, 'lock', 'low');
                                $('#ls-majH-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.mah.length; i++) {
                                        const aryData = badLockSegs.mah[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-majH-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-majH-Low-Quan', 1, 'text', '--');
                                    maLow = 0;
                                    if (maHigh === 0) changeUI('#icon-Lock-majH', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'rmp') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') rmpHigh++;
                        if (key[i].lockError === 'low') rmpLow++;
                    }
                    if (rmpHigh > 0 || rmpLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Rmp', 1, 'lock', 'both');
                            $('#icon-Lock-Rmp').click(() => {
                                for (let i = 0; i < badLockSegs.rmp.length; i++) {
                                    const aryData = badLockSegs.rmp[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Rmp', 0, 'lock', null);
                                changeUI('#ls-Rmp-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Rmp-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Rmp-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Rmp-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (rmpHigh > 0) {
                            changeUI('#ls-Rmp-High-Quan', 1, 'text', rmpHigh);

                            if (roadClear) {
                                changeUI('#ls-Rmp-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Rmp-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.rmp.length; i++) {
                                        const aryData = badLockSegs.rmp[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rmp-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Rmp-High-Quan', 1, 'text', '--');
                                    rmpHigh = 0;
                                    if (rmpLow === 0) changeUI('#icon-Lock-Rmp', 0, 'lock', null);
                                });
                            }
                        }
                        if (rmpLow > 0) {
                            changeUI('#ls-Rmp-Low-Quan', 1, 'text', rmpLow);

                            if (roadClear) {
                                changeUI('#ls-Rmp-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Rmp-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.rmp.length; i++) {
                                        const aryData = badLockSegs.rmp[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rmp-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Rmp-Low-Quan', 1, 'text', '--');
                                    rmpLow = 0;
                                    if (rmpHigh === 0) changeUI('#icon-Lock-Rmp', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'fwy') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') fwyHigh++;
                        if (key[i].lockError === 'low') fwyLow++;
                    }
                    if (fwyHigh > 0 || fwyLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Fwy', 1, 'lock', 'both');
                            $('#icon-Lock-Fwy').click(() => {
                                for (let i = 0; i < badLockSegs.fwy.length; i++) {
                                    const aryData = badLockSegs.fwy[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Fwy', 0, 'lock', null);
                                changeUI('#ls-Fwy-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Fwy-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Fwy-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Fwy-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (fwyHigh > 0) {
                            changeUI('#ls-Fwy-High-Quan', 1, 'text', fwyHigh);

                            if (roadClear) {
                                changeUI('#ls-Fwy-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Fwy-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.fwy.length; i++) {
                                        const aryData = badLockSegs.fwy[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Fwy-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Fwy-High-Quan', 1, 'text', '--');
                                    fwyHigh = 0;
                                    if (fwyLow === 0) changeUI('#icon-Lock-Fwy', 0, 'lock', null);
                                });
                            }
                        }
                        if (fwyLow > 0) {
                            changeUI('#ls-Fwy-Low-Quan', 1, 'text', fwyLow);

                            if (roadClear) {
                                changeUI('#ls-Fwy-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Fwy-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.fwy.length; i++) {
                                        const aryData = badLockSegs.fwy[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Fwy-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Fwy-Low-Quan', 1, 'text', '--');
                                    fwyLow = 0;
                                    if (fwyHigh === 0) changeUI('#icon-Lock-Fwy', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'othr') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') othrHigh++;
                        if (key[i].lockError === 'low') othrLow++;
                    }
                    if (othrHigh > 0 || othrLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-othr', 1, 'lock', 'both');
                            $('#icon-Lock-othr').click(() => {
                                for (let i = 0; i < badLockSegs.othr.length; i++) {
                                    const aryData = badLockSegs.othr[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-othr', 0, 'lock', null);
                                changeUI('#ls-othr-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-othr-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-othr-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-othr-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (othrHigh > 0) {
                            changeUI('#ls-othr-High-Quan', 1, 'text', othrHigh);
                            
                            if (roadClear) {
                                changeUI('#ls-othr-Lock-Down', 1, 'lock', 'high');
                                $('#ls-othr-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.othr.length; i++) {
                                        const aryData = badLockSegs.othr[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-othr-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-othr-High-Quan', 1, 'text', '--');
                                    othrHigh = 0;
                                    if (othrLow === 0) changeUI('#icon-Lock-othr', 0, 'lock', null);
                                });
                            }
                        }
                        if (othrLow > 0) {
                            changeUI('#ls-othr-Low-Quan', 1, 'text', othrLow);
                            
                            if (roadClear) {
                                changeUI('#ls-othr-Lock-Up', 1, 'lock', 'low');
                                $('#ls-othr-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.othr.length; i++) {
                                        const aryData = badLockSegs.othr[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-othr-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-othr-Low-Quan', 1, 'text', '--');
                                    othrLow = 0;
                                    if (othrHigh === 0) changeUI('#icon-Lock-othr', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'plr') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') plrHigh++;
                        if (key[i].lockError === 'low') plrLow++;
                    }
                    if (plrHigh > 0 || plrLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Plr', 1, 'lock', 'both');
                            $('#icon-Lock-Plr').click(() => {
                                for (let i = 0; i < badLockSegs.plr.length; i++) {
                                    const aryData = badLockSegs.plr[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Plr', 0, 'lock', null);
                                changeUI('#ls-Plr-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Plr-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Plr-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Plr-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (plrHigh > 0) {
                            changeUI('#ls-Plr-High-Quan', 1, 'text', plrHigh);
                            
                            if (roadClear) {
                                changeUI('#ls-Plr-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Plr-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.plr.length; i++) {
                                        const aryData = badLockSegs.plr[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Plr-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Plr-High-Quan', 1, 'text', '--');
                                    plrHigh = 0;
                                    if (plrLow === 0) changeUI('#icon-Lock-Plr', 0, 'lock', null);
                                });
                            }
                        }
                        if (plrLow > 0) {
                            changeUI('#ls-Plr-Low-Quan', 1, 'text', plrLow);
                            
                            if (roadClear) {
                                changeUI('#ls-Plr-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Plr-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.plr.length; i++) {
                                        const aryData = badLockSegs.plr[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Plr-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Plr-Low-Quan', 1, 'text', '--');
                                    plrLow = 0;
                                    if (plrHigh === 0) changeUI('#icon-Lock-Plr', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'pvt') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') pvtHigh++;
                        if (key[i].lockError === 'low') pvtLow++;
                    }
                    if (pvtHigh > 0 || pvtLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Pvt', 1, 'lock', 'both');
                            $('#icon-Lock-Pvt').click(() => {
                                for (let i = 0; i < badLockSegs.pvt.length; i++) {
                                    const aryData = badLockSegs.pvt[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Pvt', 0, 'lock', null);
                                changeUI('#ls-Pvt-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Pvt-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Pvt-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Pvt-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (pvtHigh > 0) {
                            changeUI('#ls-Pvt-High-Quan', 1, 'text', pvtHigh);
                            
                            if (roadClear) {
                                changeUI('#ls-Pvt-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Pvt-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.pvt.length; i++) {
                                        const aryData = badLockSegs.pvt[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Pvt-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Pvt-High-Quan', 1, 'text', '--');
                                    pvtHigh = 0;
                                    if (pvtLow === 0) changeUI('#icon-Lock-Pvt', 0, 'lock', null);
                                });
                            }
                        }
                        if (pvtLow > 0) {
                            changeUI('#ls-Pvt-Low-Quan', 1, 'text', pvtLow);
                            
                            if (roadClear) {
                                changeUI('#ls-Pvt-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Pvt-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.pvt.length; i++) {
                                        const aryData = badLockSegs.pvt[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Pvt-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Pvt-Low-Quan', 1, 'text', '--');
                                    pvtLow = 0;
                                    if (pvtHigh === 0) changeUI('#icon-Lock-Pvt', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'rail') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') railHigh++;
                        if (key[i].lockError === 'low') railLow++;
                    }
                    if (railHigh > 0 || railLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Rail', 1, 'lock', 'both');
                            $('#icon-Lock-Rail').click(() => {
                                for (let i = 0; i < badLockSegs.rail.length; i++) {
                                    const aryData = badLockSegs.rail[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Rail', 0, 'lock', null);
                                changeUI('#ls-Rail-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Rail-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Rail-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Rail-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (railHigh > 0) {
                            changeUI('#ls-Rail-High-Quan', 1, 'text', railHigh);
                            
                            if (roadClear) {
                                changeUI('#ls-Rail-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Rail-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.rail.length; i++) {
                                        const aryData = badLockSegs.rail[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rail-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Rail-High-Quan', 1, 'text', '--');
                                    railHigh = 0;
                                    if (railLow === 0) changeUI('#icon-Lock-Rail', 0, 'lock', null);
                                });
                            }
                        }
                        if (railLow > 0) {
                            changeUI('#ls-Rail-Low-Quan', 1, 'text', railLow);
                            
                            if (roadClear) {
                                changeUI('#ls-Rail-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Rail-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.rail.length; i++) {
                                        const aryData = badLockSegs.rail[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rail-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Rail-Low-Quan', 1, 'text', '--');
                                    railLow = 0;
                                    if (railHigh === 0) changeUI('#icon-Lock-Rail', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'fry') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') fryHigh++;
                        if (key[i].lockError === 'low') fryLow++;
                    }
                    if (fryHigh > 0 || fryLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Fry', 1, 'lock', 'both');
                            $('#icon-Lock-Fry').click(() => {
                                for (let i = 0; i < badLockSegs.fry.length; i++) {
                                    const aryData = badLockSegs.fry[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Fry', 0, 'lock', null);
                                changeUI('#ls-Fry-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Fry-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Fry-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Fry-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (fryHigh > 0) {
                            changeUI('#ls-Fry-High-Quan', 1, 'text', fryHigh);

                            if (roadClear) {
                                changeUI('#ls-Fry-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Fry-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.fry.length; i++) {
                                        const aryData = badLockSegs.fry[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Fry-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Fry-High-Quan', 1, 'text', '--');
                                    fryHigh = 0;
                                    if (fryLow === 0) changeUI('#icon-Lock-Fry', 0, 'lock', null);
                                });
                            }
                        }
                        if (fryLow > 0) {
                            changeUI('#ls-Fry-Low-Quan', 1, 'text', fryLow);

                            if (roadClear) {
                                changeUI('#ls-Fry-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Fry-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.fry.length; i++) {
                                        const aryData = badLockSegs.fry[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Fry-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Fry-Low-Quan', 1, 'text', '--');
                                    fryLow = 0;
                                    if (fryHigh === 0) changeUI('#icon-Lock-Fry', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'rnwy') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') rnwyHigh++;
                        if (key[i].lockError === 'low') rnwyLow++;
                    }
                    if (rnwyHigh > 0 || rnwyLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Rnwy', 1, 'lock', 'both');
                            $('#icon-Lock-Rnwy').click(() => {
                                for (let i = 0; i < badLockSegs.rnwy.length; i++) {
                                    const aryData = badLockSegs.rnwy[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Rnwy', 0, 'lock', null);
                                changeUI('#ls-Rnwy-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Rnwy-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Rnwy-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Rnwy-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (rnwyHigh > 0) {
                            changeUI('#ls-Rnwy-High-Quan', 1, 'text', rnwyHigh);

                            if (roadClear) {
                                changeUI('#ls-Rnwy-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Rnwy-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.rnwy.length; i++) {
                                        const aryData = badLockSegs.rnwy[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rnwy-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Rnwy-High-Quan', 1, 'text', '--');
                                    rnwyHigh = 0;
                                    if (rnwyLow === 0) changeUI('#icon-Lock-Rnwy', 0, 'lock', null);
                                });
                            }
                        }
                        if (rnwyLow > 0) {
                            changeUI('#ls-Rnwy-Low-Quan', 1, 'text', rnwyLow);

                            if (roadClear) {
                                changeUI('#ls-Rnwy-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Rnwy-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.rnwy.length; i++) {
                                        const aryData = badLockSegs.rnwy[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Rnwy-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Rnwy-Low-Quan', 1, 'text', '--');
                                    rnwyLow = 0;
                                    if (rnwyHigh === 0) changeUI('#icon-Lock-Rnwy', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'ofrd') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') ofrdHigh++;
                        if (key[i].lockError === 'low') ofrdLow++;
                    }
                    if (ofrdHigh > 0 || ofrdLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Ofrd', 1, 'lock', 'both');
                            $('#icon-Lock-Ofrd').click(() => {
                                for (let i = 0; i < badLockSegs.ofrd.length; i++) {
                                    const aryData = badLockSegs.ofrd[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Ofrd', 0, 'lock', null);
                                changeUI('#ls-Ofrd-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Ofrd-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Ofrd-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Ofrd-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (ofrdHigh > 0) {
                            changeUI('#ls-Ofrd-High-Quan', 1, 'text', ofrdHigh);

                            if (roadClear) {
                                changeUI('#ls-Ofrd-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Ofrd-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.ofrd.length; i++) {
                                        const aryData = badLockSegs.ofrd[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Ofrd-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Ofrd-High-Quan', 1, 'text', '--');
                                    ofrdHigh = 0;
                                    if (ofrdLow === 0) changeUI('#icon-Lock-Ofrd', 0, 'lock', null);
                                });
                            }
                        }
                        if (ofrdLow > 0) {
                            changeUI('#ls-Ofrd-Low-Quan', 1, 'text', ofrdLow);

                            if (roadClear) {
                                changeUI('#ls-Ofrd-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Ofrd-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.ofrd.length; i++) {
                                        const aryData = badLockSegs.ofrd[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Ofrd-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Ofrd-Low-Quan', 1, 'text', '--');
                                    ofrdLow = 0;
                                    if (ofrdHigh === 0) changeUI('#icon-Lock-Ofrd', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
                if (value === 'nrpd') {
                    for (let i = 0; i < key.length; i++) {
                        if (key[i].lockError === 'high') nrpdHigh++;
                        if (key[i].lockError === 'low') nrpdLow++;
                    }
                    if (nrpdHigh > 0 || nrpdLow > 0) {
                        if (roadClear) {
                            changeUI('#icon-Lock-Nonped', 1, 'lock', 'both');
                            $('#icon-Lock-Nonped').click(() => {
                                for (let i = 0; i < badLockSegs.nrpd.length; i++) {
                                    const aryData = badLockSegs.nrpd[i];
                                    const seg = W.model.segments.getObjectById(aryData.segID);
                                    processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                }
                                changeUI('#icon-Lock-Nonped', 0, 'lock', null);
                                changeUI('#ls-Nonped-Lock-Up', 0, 'lock', null);
                                changeUI('#ls-Nonped-Lock-Down', 0, 'lock', null);
                                changeUI('#ls-Nonped-Low-Quan', 1, 'text', '--');
                                changeUI('#ls-Nonped-High-Quan', 1, 'text', '--');
                            });
                        }
                        if (nrpdHigh > 0) {
                            changeUI('#ls-Nonped-High-Quan', 1, 'text', nrpdHigh);

                            if (roadClear) {
                                changeUI('#ls-Nonped-Lock-Down', 1, 'lock', 'high');
                                $('#ls-Nonped-Lock-Down').click(() => {
                                    for (let i = 0; i < badLockSegs.nrpd.length; i++) {
                                        const aryData = badLockSegs.nrpd[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'high') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Nonped-Lock-Down', 0, 'lock', null);
                                    changeUI('#ls-Nonped-High-Quan', 1, 'text', '--');
                                    nrpdHigh = 0;
                                    if (nrpdLow === 0) changeUI('#icon-Lock-Nonped', 0, 'lock', null);
                                });
                            }
                        }
                        if (nrpdLow > 0) {
                            changeUI('#ls-Nonped-Low-Quan', 1, 'text', nrpdLow);

                            if (roadClear) {
                                changeUI('#ls-Nonped-Lock-Up', 1, 'lock', 'low');
                                $('#ls-Nonped-Lock-Up').click(() => {
                                    for (let i = 0; i < badLockSegs.nrpd.length; i++) {
                                        const aryData = badLockSegs.nrpd[i];
                                        const seg = W.model.segments.getObjectById(aryData.segID);
                                        if (aryData.lockError === 'low') processLocks(seg, aryData.currLockRnk, aryData.stdLockRnk);
                                    }
                                    changeUI('#ls-Nonped-Lock-Up', 0, 'lock', null);
                                    changeUI('#ls-Nonped-Low-Quan', 1, 'text', '--');
                                    nrpdLow = 0;
                                    if (nrpdHigh === 0) changeUI('#icon-Lock-Nonped', 0, 'lock', null);
                                });
                            }
                        }
                    }
                }
            });

            let isActiveTab = $("a[href$='#sidepanel-ls']").parent().prop('class');
            if (isActiveTab === '' || isActiveTab !== 'active') $("a[href$='#sidepanel-ls']").css('background-color', '#ed503bb5');
        } else {
            if (manual) WazeWrap.Alerts.info(GM_info.script.name, 'No segments out of standards');
        }
    }
}

Locksmithbootstrap();
