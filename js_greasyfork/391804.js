// ==UserScript==
// @name         WME-CheatCodesDev
// @namespace    SDG
// @version      dev2019-10-30-1
// @description  Various tools to ease editing
// @authors      SkiDooGuy and JustinS83
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/391804/WME-CheatCodesDev.user.js
// @updateURL https://update.greasyfork.org/scripts/391804/WME-CheatCodesDev.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global require */
/* global _ */

// Global variables
const scriptVersion = GM_info.script.version;
const ModifyAllCon = require('Waze/Action/ModifyAllConnections');
const UpdateObj = require('Waze/Action/UpdateObject');
const DeleteSeg = require('Waze/Action/DeleteSegment');
const MergeSeg = require('Waze/Action/MergeSegments');
const UpdateSegGeo = require('Waze/Action/UpdateSegmentGeometry');
const UpdateAddress = require('Waze/Action/UpdateFeatureAddress');
const AddAltStreet = require('Waze/Action/AddAlternateStreet');
const SetTurn = require('Waze/Model/Graph/Actions/SetTurn');

const CC_UPDATE_NOTES = `<b>New:</b><br>
- <br><br>
<b>Fixed:</b><br>
- Updated event listeners for WME update<br>
- Fixed no date error on initial install/load<br><br>`;

let ccShortcuts = {};
let ccFuncSettings = {};
let speedDisplayUnits = '';
let distanceDisplayUnits = '';
let editorInfo = {};
let ignoreStateCheck = false;

function bootstrap(tries = 1) {
    if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready) {
        console.log('CheatCodes (CC) Loading....');
        initCheatCodes();
    } else if (tries < 1000) setTimeout(() => { bootstrap(tries++); }, 200);
}

async function initCheatCodes() {
    editorInfo = W.loginManager.user;
    if (editorInfo.rank >= 3) {
        console.info(`CC: ${editorInfo.userName}'s rank verified, enabling script version: ${scriptVersion}`);

        await loadSettings();
        createShortcuts();

        const $section = $('<div>');
        $section.html([
            '<div class="ccWrapper">',
            '<div class="ccBody">',

            `<div class="ccHeaderWrapper">
                <div class="ccHeaderText">
                    CheatCodes v${scriptVersion}
                </div>
                <div style="width:100%;padding-bottom:5px;border-bottom: 1.5px solid grey;">
                    <div class='ccOptions-Flex-Container'>
                        <label class="ccLabel Small">Save Settings<input type="checkbox" class="ccSettingBox" id="ccUserSettingsEnable">
                        <span class="ccCheckBox Small" /></label>
                        <label class="ccLabel Small">Check Data<input type="checkbox" class="ccSettingBox" id="ccEnableVerifyModel">
                        <span class="ccCheckBox Small" /></label>
                        <label class="ccLabel Small">Toolbar<input type="checkbox" class="ccSettingBox" id="ccToolbarEnable">
                        <span class="ccCheckBox Small" /></label>
                    </div>
                </div>
            </div>`,

            '<div class="ccFunctionsWrapper">',

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="lockSt" data-original-title="Locks all segments on screen to selected rank">
                    - Lock segments: <span class="hotKeyText" id='cc-label-auto-lock-shortcut' />
                </div></br>

                <div class="ccFuncOptionsContainer" id="lockStreetMenu">

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockStreetSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">LS Lock<input type="checkbox" class="ccSettingBox" id="cclockStreetEnable">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockPSSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">PS Lock<input type="checkbox" class="ccSettingBox" id="cclockPSEnable">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockminHSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">mH Lock<input type="checkbox" class="ccSettingBox" id="cclockminHEnable">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockmajHSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">MH Lock<input type="checkbox" class="ccSettingBox" id="cclockmajHEnable">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockRmpSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">Rmp Lock<input type="checkbox" class="ccSettingBox" id="cclockRmpEnable">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <select class="ccSelect" id="lockFWYSelect">
                        <option class="ccLockOption0">Auto</option><option class="ccLockOption1">1</option><option class="ccLockOption2">2</option>
                        <option class="ccLockOption3">3</option><option class="ccLockOption4">4</option><option class="ccLockOption5">5</option>
                        <option class="ccLockOption6">6</option>
                    </select>
                    <label class="ccLabel">FWY Lock<input type="checkbox" class="ccSettingBox" id="cclockFWYEnable">
                    <span class="ccCheckBox" /></label>
                    </span>
                </div>
            </div>`, // lock streets

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="stDel" data-original-title="Deletes all no-name segments">
                    - Delete all no-name segments: <span class="hotKeyText" id='cc-label-BaseDel-shortcut' />
                </div>

                <div class="ccFuncOptionsContainer" id="delStreetMenu">

                    <div class="ccFlexOptions">
                        <label class="ccLabel">PLR<input type="checkbox" id="ccdelPlrEnable">
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">LS<input type="checkbox" id="ccdelStreetEnable">
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">PR<input type="checkbox" id="ccdelPREnable">
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">PS<input type="checkbox" id="ccdelPSEnable">
                        <span class="ccCheckBox" /></label>
                    </div>
                    <div class="ccFlexOptions">
                        <label class="ccLabel">Non-Ped<input type="checkbox" id="ccdelNonPedEnable">
                        <span class="ccCheckBox" /></label>
                    </div>
                    <div class="ccFlexOptions">
                        <label class="ccLabel">Updated<input type="checkbox" id="ccdelUpdateEnable">
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">Has Direction<input type="checkbox" id="ccdelhasDirectionEnable">
                        <span class="ccCheckBox" /></label>
                    </div>

                    <div class="ccFuncOptions dropDown" style="display:block;width:100%;">
                        <label class="ccLabel">Length<input type="checkbox" id="ccdelSegLengthEnable">
                        <span class="ccCheckBox" /></label>
                        <input type="number" class="ccInputBox" size="2" id="ccdelSegLength" style="padding-left:5px;margin-left:3px;">
                        <div style="padding-left:5px;display:inline-block;">meters</div>
                    </div>
                </div>
            </div>`, // basemap delete

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="setNames" data-original-title="Applies names to selected segments">
                    - Set Names: <span class="hotKeyText" id='cc-label-SetName-shortcut' />
                </div>

                <div class="ccFuncOptionsContainer" id="setNamesMenu">
                    <div class="ccFuncOptions ccSubOptions">
                        <div class="ccFlexOptions">
                            <label class="ccLabel">Selected
                            <input type="radio" name="setNameSelType" value="selectedSegs" id="ccsetNameSelected" checked>
                            <div class="ccCheckBox" />
                            </label>
                            <label class="ccLabel">On-Screen
                            <input type="radio" name="setNameSelType" value="onScreenSegs" id="ccsetNameAll">
                            <div class="ccCheckBox" />
                            </label>
                        </div>
                        <div class="ccInputContainer">
                            <div class="ccNameBlock">
                                <label class="ccInputLabel">Name:</label></br>
                                <label class="ccInputLabel">City:</label></br>
                                <label class="ccInputLabel">State:</label>
                            </div></br>
                            <div class="ccNameBlock input">
                                <input type="text" name="segNameInput" id="ccNameInput" placeholder="Leave blank for 'None'"></br>
                                <input type="text" name="segCityInput" id="ccCityInput" placeholder="Leave blank for 'None'"></br>
                                <select class="ccAltNameInput" id="ccStateInput" />
                            </div>
                        </div></br>
                        <div class="ccFuncOptions" id="ccAltNameMenu" style="display:none;">
                            <div class="ccInputContainer">
                                <div class="ccFuncTitle">Alternate Segment/City Name</div>
                                <div class="ccNameBlock">
                                    <label class="ccInputLabel">Name:</label></br>
                                    <label class="ccInputLabel">City:</label></br>
                                </div></br>
                                <div class="ccNameBlock input">
                                    <input type="text" class="ccAltNameInput" name="segNameInput" id="ccAltNameInput" placeholder="Leave blank for 'None'"></br>
                                    <input type="text" class="ccAltNameInput" name="segCityInput" id="ccAltCityInput" placeholder="Leave blank for 'None'"></br>
                                </div>
                            </div></br>
                        </div>
                        <div class="ccAddFunctionContainer">
                            <div class="ccAddFunctionText" id="ccAltNameTrigger" data-original-title="Toggling alt menu clears entries">Add alt name</div>
                        </div>
                        <label class="ccLabel">Overwrite current name
                        <input type="checkbox" id="ccoverwriteNameEnable">
                        <div class="ccCheckBox" />
                        </label>
                    </div>

                    <div class="ccFuncOptions" id="selSegOptions" />

                    <div class="ccFuncOptions" id="allSegOptions" style="display:none;">
                        <span class="ccFlexOptions">
                            <label class="ccLabel">PLR<input type="checkbox" id="ccsetNamePLREnable">
                            <span class="ccCheckBox" /></label>
                            <label class="ccLabel">LS<input type="checkbox" id="ccsetNameLSEnable">
                            <span class="ccCheckBox" /></label>
                            <label class="ccLabel">PS<input type="checkbox" id="ccsetNamePSEnable">
                            <span class="ccCheckBox" /></label>
                            <label class="ccLabel">mH<input type="checkbox" id="ccsetNameMiHEnable">
                            <span class="ccCheckBox" /></label>
                            <label class="ccLabel">MH<input type="checkbox" id="ccsetNameMaHEnable">
                            <span class="ccCheckBox" /></label>
                        </span>
                    </div>
                </div>
            </div>`, // set names

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="setSLs" data-original-title="Sets speed limits on selected segments types to input speed limit">
                    - Set speed limits: <span class="hotKeyText" id='cc-label-SetSpeeds-shortcut' />
                </div>

                <div class="ccFuncOptionsContainer" id="setSpeedsMenu">
                    <span class="ccFuncOptions ccSubOptions">
                        <label class="ccLabel">Selected Segs<input type="radio" name="segSpeedType" id="ccsetSpeedSelected" value="selSegSpeed" checked>
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">All On-Screen<input type="radio" name="segSpeedType" id="ccsetSpeedAll" value="allSegSpeed">
                        <span class="ccCheckBox" /></label>
                        <label class="ccLabel">Speed:
                        <input type="number" class="ccInputBox" name="segSpeedInput" id="ccspeedInputValue" maxlength="3" size="2">
                        <span class="ccSpeedUnits" /></label>
                        <label class="ccLabel">Overwrite current speed<input type="checkbox" id="ccoverwriteSpeedEnable">
                        <span class="ccCheckBox" /></label>
                    </span>

                    <div class="ccFuncOptions" id="selSegSpeedOptions">
                    </div>

                    <div class="ccFuncOptions" id="allSegSpeedOptions" style="display:none;">
                        <span class="ccFlexOptions">
                            <label class="ccLabel">LS<input type="checkbox" id="ccallSpeedLSEnable"><span class="ccCheckBox" /></label>
                            <label class="ccLabel">PS<input type="checkbox" id="ccallSpeedPSEnable"><span class="ccCheckBox" /></label>
                            <label class="ccLabel">mH<input type="checkbox" id="ccallSpeedMiHEnable"><span class="ccCheckBox" /></label>
                            <label class="ccLabel">MH<input type="checkbox" id="ccallSpeedMaHEnable"><span class="ccCheckBox" /></label>
                            <label class="ccLabel">Fwy<input type="checkbox" id="ccallSpeedFwyHEnable"><span class="ccCheckBox" /></label>
                        </span>
                    </div>
                </div>
            </div>`, // set SL

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="closeMP" data-original-title="Closes all MPs of selected types">
                    - Close MPs: <span class="hotKeyText" id='cc-label-CloseMP-shortcut' />
                </div>

                <div class="ccFuncOptionsContainer" id="closeMPsMenu">

                <label class="ccLabel wide">Mark closed as:
                    <select class="ccSelect wide" id="ccmpResolveType">
                        <option>Resolved</option><option>Not Identified</option>
                    </select>
                </label>
                    </br>

                    <span class="ccFuncOptions dropDown">
                    <label  class="ccLabel">RP - No Exit<input type="checkbox" id="cccloseNoExitBox">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    
                    <label class="ccLabel">RP - No Turns Enabled<input type="checkbox" id="cccloseNoTurnsBox">
                    <span class="ccCheckBox" /></label>
                    </span>

                    <span class="ccFuncOptions dropDown">
                    <label class="ccLabel">Parking Lot MPs<input type="checkbox" id="ccclosePLMPBox">
                    <span class="ccCheckBox" /></label>
                    </span>
                </div>
            </div>`, // close MP

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="setSegLS" data-original-title="Sets all no-name segments matching selected variables to local street">
                    - Set all segments to LS: <span class="hotKeyText" id='cc-label-SetStreets-shortcut' />
                </div>
                <div class="ccFuncOptionsContainer" id="setSegLSMenu">
                    <span class="ccFlexOptions">
                        <label class="ccLabel">PLR<input type="checkbox" id="ccSetLsPlrEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">PVT<input type="checkbox" id="ccSetLsPREnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">PS<input type="checkbox" id="ccSetLsPsEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">Updated<input type="checkbox" id="ccSetLsUpdatedEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">Has Direction<input type="checkbox" id="ccSetLshasDirectionEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">Incl. Named Segs<input type="checkbox" id="ccSetLshasNameEnable"><span class="ccCheckBox" /></label>
                    </span>
                </div>
            </div>`, // set LS

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu collapsable" id="baseMCUp" data-original-title="Sets all segments on-screen to 2-way and enables all turns">
                    - Magic Fix: <span class="hotKeyText" id='cc-label-BaseClean-shortcut' />
                </div>
                <div class="ccFuncOptionsContainer" id="magicFixMenu">
                    <div class="ccFlexOptions">
                        <label class="ccLabel">PLR<input type="checkbox" id="ccMagicPLREnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">PVT<input type="checkbox" id="ccMagicPVTEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">PS<input type="checkbox" id="ccMagicPSEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">LS<input type="checkbox" id="ccMagicLSEnable"><span class="ccCheckBox" /></label>
                    </div><br>
                    <div class="ccFlexOptions">
                        <label class="ccLabel">mH<input type="checkbox" id="ccMagicMinEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">MH<input type="checkbox" id="ccMagicMajEnable"><span class="ccCheckBox" /></label>
                        <label class="ccLabel">Enable Turns<input type="checkbox" id="ccMagicTurnsEnable"><span class="ccCheckBox" /></label>
                    </div>
                </div>
            </div>`, // BM cleanup

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu" id="rmJunNode" data-original-title="Deletes extra junction nodes">
                    - Remove extra junction nodes: <span class="hotKeyText" id='cc-label-NodeSuppress-shortcut' />
                </div>
            </div>`, // RM junc nodes

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu" id="rmGeoNodes" data-original-title="Removes geo-nodes on selected segments">
                    - Remove geo-nodes: <span class="hotKeyText" id='cc-label-SegStraight-shortcut' />
                </div>
            </div>`, // RM geo

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu" id="enAOS" data-original-title="Enables all turns on-screen">
                    - Enable all turns: <span class="hotKeyText" id='cc-label-EnableAll-shortcut' />
                </div>
            </div>`, // EOAS

            `<div class="ccFunctionContainer">
                <div class="ccFunctionMenu" id="cc-disable-UTurns-Container" data-original-title="Disables all U-Turns on-screen">
                    - Disable all U-Turns: <span class="hotKeyText" id='cc-label-DisableUTurns-shortcut' />
                </div>
            </div>`,

            '</div>',
            '</div>',
            '</div>'
        ].join(' '));

        new WazeWrap.Interface.Tab('CC', $section.html(), initializeSettings);
        WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, CC_UPDATE_NOTES, 'https://gitlab.com/cheatcodes-dev/wme-cheatcodes', 'https://www.waze.com/forum/viewtopic.php?f=338&t=281974');

        window.addEventListener('beforeunload', () => {
            checkShortcutsChanged();
        }, false);
    } else WazeWrap.Alerts.error(GM_info.script.name, 'Editor rank/role not high enough....');
}

const css = [
    '.ccWrapper {width:100%;height:100%;}',
    '.ccBody {display:block;background-color:white;border:2px solid white;border-radius:6px;font:14px;font-family:Poppins, "Helvetica Neue", Helvetica, "Open Sans", sans-serif;user-select:none;}',
    '.ccHeaderWrapper {display:block;width:100%;}',
    '.ccHeaderText {width:100%;padding-bottom:5px;padding-top:5px;padding-left:5px;padding-right:5px;display:inline-block;border-bottom:5px double grey;text-align:center;}',
    '.ccFunctionsWrapper {padding-top:5px;padding-left:5px;padding-right:5px;}',
    '.ccFunctionContainer {display:inline-block;width:100%;margin-bottom:10px;padding:3px;border:1px solid grey;border-radius:6px;}',
    '.ccFunctionMenu {position:relative;display:inline-block;width:100%;border-radius:6px;}',
    '.ccFunctionMenu.collapsable:hover {cursor:pointer;background-color:lightgrey;}',
    '.ccFuncOptionsContainer {display:none;margin-top:5px;padding-top:10px;padding-left:10px;border-top:2px solid lightgrey;}',
    '.ccFuncOptions {display:inline;width:80%;padding-top:5px;}',
    '.ccFuncOptions.ccSubOptions {display:inline-block;width:100%;margin-bottom:5px;border-bottom:1.5px solid lightgrey;}',
    '.ccFuncOptions.dropDown {display:inline-block;}',
    '.ccSelect {color:#444;width:30%;box-sizing:border-box;margin-right:5px;outline:none;padding:3px;border:1px solid lightgrey;border-radius:6px;}',
    '.ccSelect.wide {width:50%;}',
    '.ccSelect:hover  {border:1px solid black;}',
    '.ccSelect:focus  {border:1.5px solid black;}',
    '.hotKeyText {font-weight:bold;}',
    '.ccFlexOptions {display:flex;padding-right:5px;flex-flow:row wrap;justify-content:space-between;}',
    '.ccOptions-Flex-Container {display:flex;flex-flow:row wrap;justify-content:space-between;padding:0 3px 0 3px;}',
    '.ccLabel {display:inline-block;position:relative;padding-right:20px;font-weight:normal;margin-bottom:5px;margin-top:5px;width:auto;cursor:pointer;}',
    '.ccLabel.Small {padding-right:15px;}',
    '.ccLabel.wide {width:100%;padding-right:0px;}',
    '.ccLabel input[type=checkbox] {position:absolute;opacity:0;height:0;width:0;}',
    '.ccLabel input[type=radio] {position:absolute;opacity:0;height:0;width:0;}',
    '.ccCheckBox {position:absolute;height:15px;width:15px;background-color:#eee;border:1px solid black;border-radius:4px;top:1px;right:0px;}',
    '.ccCheckBox.Small {height:10px;width:10px;top:5px;}',
    '.ccLabel:hover input ~ .ccCheckBox {background-color:#ccc;}',
    '.ccLabel input:checked ~ .ccCheckBox {background-color:rgb(66 184 196);}',
    '.ccInputContainer {display:inline-block;width:100%;}',
    '.ccInputLabel {padding-top:10px;font-weight: normal;}',
    '.ccInputType {position:relative;top:3px;margin:0px;}',
    '.ccInputBox {display:inline;width:40%;margin-top:2px;padding:5px;border:1px solid grey;border-radius:6px;}',
    '.ccInputBox:focus {border:1px solid black;border-radius:6px;outline:none;}',
    '.ccAddFunctionContainer {position:relative;display:block;width:100%;margin-bottom:3px;}',
    '.ccAddFunctionText {position:relative;width:60%;left:2%;font-size:10px;color:blue;text-decoration:underline;cursor:pointer;}',
    '.ccNameBlock {position:relative;top:5px;float:left;width:25%;}',
    '.ccNameBlock.input {position:relative;float:right;left:-20px;top:-10px;width:75%;}',
    '.ccNameBlock.input input[type=text] {margin-top:2px;padding:5px;border:1px solid grey;border-radius:6px;}',
    '.ccNameBlock.input input[type=text]:focus {border:1px solid black;border-radius:6px;outline:none;}',
    '.ccSpeedUnits {padding-left:3px;}',
    '.ccDistanceUnits {padding-left:5px;padding-right:5px}',
    '.ccFuncTitle {position:relative;font-size:12px;text-decoration:underline;}',
    '.cc-Toolbar-Container {display:block;width:auto;height:25px;background-color:#35B6EE;position:absolute;border-radius:6px;border:1.5px solid;box-size:border-box;z-index:1050;}',
    '.cc-Toolbar-Wrapper {display:flex;flex-flow:row nowrap;justify-content:space-around;align-items:center;padding:2px 3px 0 3px;}',
    '.cc-Toolbar-Wrapper > .fa-ellipsis-v {position:relative;}',
    '.cc-Toolbar-Icon {display:inline-block;width:20px;}',
    '.cc-Toolbar-Icon > .fa {position:relative;cursor:pointer;padding:0 1px 0 5px;}'
].join(' ');

const $ccToolbar = $('<div>');
$ccToolbar.html([
    `<div class='cc-Toolbar-Container' id="cc-Toolbar">
        <div class='cc-Toolbar-Wrapper'>
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-crosshairs' style="cursor:move;" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-lock' id="cc-TB-Lock-Segs" data-original-title="Lock Segs" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-bomb' id="cc-TB-Del-Base" data-original-title="Del Segments"/>
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-pencil'id="cc-TB-Name-Segs" data-original-title="Name Segs" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-tachometer' id="cc-TB-Set-Speeds" data-original-title="Set SLs" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-map-marker' id="cc-TB-Close-MPs" data-original-title="Close MPs" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-road' id="cc-TB-Set-LS" data-original-title="Set LS" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-magic' id="cc-TB-Fix-Base" data-original-title="Magic Fix" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-minus-circle' id="cc-TB-Del-Nodes" data-original-title="Remove Nodes" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-recycle' id="cc-TB-Clear-Nodes" data-original-title="Remove Geo-Nodes" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-arrows' id="cc-TB-Enable-Turns" data-original-title="Enable All Turns" />
            </div>
            <i class='fa fa-ellipsis-v' />
            <div class='cc-Toolbar-Icon'>
                <i class='fa fa-undo' id="cc-TB-Disable-UTurns" data-original-title="Disable All U-Turns" />
            </div>
        </div>
    </div>`
].join(' '));

function initializeSettings() {
    updateShortcutLabels();
    setOptionStatus();
    enableUserRankOptions();
    setMeasureUnits();
    gatherStatesList();

    $('.ccSpeedUnits').text(speedDisplayUnits);
    $('.ccDistanceUnits').text(distanceDisplayUnits);
    $(`<style type="text/css">${css}</style>`).appendTo('head');
    $('#map').append($ccToolbar.html());
    // WME Event listener
    WazeWrap.Events.register('moveend', null, verifyModelData);
    WazeWrap.Events.register('moveend', null, gatherStatesList);
    // Creates draggable toolbar element
    $('.cc-Toolbar-Container').draggable({ containment: 'parent', zIndex: '100' });
    if (!ccFuncSettings.ToolbarEnable) $('.cc-Toolbar-Container').css('display', 'none');

    const mapWidth = $('#map').width();
    const mapHeight = $('#map').height();
    const XCoord = ccFuncSettings.ToolbarXCoord > mapWidth ? 0.25 * $('#map').width() : ccFuncSettings.ToolbarXCoord;
    const YCoord = ccFuncSettings.ToolbarYCoord > mapHeight ? 0.96 * $('#map').height() : ccFuncSettings.ToolbarYCoord;
    $('.cc-Toolbar-Container').css({ left: `${XCoord}px`, top: `${YCoord}px` });

    // Save toolbar location when moved
    $('.cc-Toolbar-Container').on('dragstop', () => {
        ccFuncSettings.ToolbarYCoord = $('#cc-Toolbar').position().top;
        ccFuncSettings.ToolbarXCoord = $('#cc-Toolbar').position().left;
        saveSettings();
    });

    // Reset toolbar position on option toggle
    $('#ccToolbarEnable').click(() => {
        const mapXPos = mapWidth * 0.25;
        const mapYPos = mapHeight * 0.96;
        $('.cc-Toolbar-Container').toggle();
        $('.cc-Toolbar-Container').css({ left: `${mapXPos}px`, top: `${mapYPos}px` });
    });

    // Changes units of measure displayed when setting is changed in WME
    $('.units-check').change(() => {
        setTimeout(() => {
            setMeasureUnits();
            $('.ccSpeedUnits').text(speedDisplayUnits);
            $('.ccDistanceUnits').text(distanceDisplayUnits);
            console.log(`CC: Units changed to ${speedDisplayUnits} and ${distanceDisplayUnits}`);
        }, 1000);
    });

    // Toggles the options menus for functions
    $('#lockSt').click(() => { $('#lockStreetMenu').toggle(); });
    $('#stDel').click(() => { $('#delStreetMenu').toggle(); });
    $('#setSegLS').click(() => { $('#setSegLSMenu').toggle(); });
    $('#baseMCUp').click(() => { $('#magicFixMenu').toggle(); });
    $('#closeMP').click(() => { $('#closeMPsMenu').toggle(); });
    $('#setNames').click(() => { $('#setNamesMenu').toggle(); });
    $('#setSLs').click(() => { $('#setSpeedsMenu').toggle(); });
    $('#ccAltNameTrigger').click(() => { $('#ccAltNameMenu').toggle(); $('#ccAltNameInput').val(''); $('#ccAltCityInput').val(''); });
    $('#ccAltNameTrigger').click(() => { if ($('#ccAltNameTrigger').text() == 'Add alt name') { $('#ccAltNameTrigger').text('Close alt name menu'); } else { $('#ccAltNameTrigger').text('Add alt name'); } });
    $('#cc-TB-Lock-Segs').click(() => { autoLock(); });
    $('#cc-TB-Del-Base').click(() => { baseDel(); });
    $('#cc-TB-Name-Segs').click(() => { setNames(); });
    $('#cc-TB-Set-Speeds').click(() => { setSpeeds(); });
    $('#cc-TB-Close-MPs').click(() => { closeAllMPs(); });
    $('#cc-TB-Set-LS').click(() => { setStreets(); });
    $('#cc-TB-Fix-Base').click(() => { bmUnkownFix(); });
    $('#cc-TB-Del-Nodes').click(() => { suppressNodes(); });
    $('#cc-TB-Clear-Nodes').click(() => { segStraight(); });
    $('#cc-TB-Enable-Turns').click(() => { enableAll(); });
    $('#cc-TB-Disable-UTurns').click(() => { disableUTurns(); });

    // Allows WME native tooltip UI
    $('#lockSt').tooltip();
    $('#stDel').tooltip();
    $('#setSegLS').tooltip();
    $('#closeMP').tooltip();
    $('#baseMCUp').tooltip();
    $('#rmJunNode').tooltip();
    $('#rmGeoNodes').tooltip();
    $('#setSLs').tooltip();
    $('#enAOS').tooltip();
    $('#setNames').tooltip();
    $('#ccAltNameTrigger').tooltip();
    $('#cc-disable-UTurns-Container').tooltip();
    $('#cc-TB-Lock-Segs').tooltip();
    $('#cc-TB-Del-Base').tooltip();
    $('#cc-TB-Name-Segs').tooltip();
    $('#cc-TB-Set-Speeds').tooltip();
    $('#cc-TB-Close-MPs').tooltip();
    $('#cc-TB-Set-LS').tooltip();
    $('#cc-TB-Fix-Base').tooltip();
    $('#cc-TB-Del-Nodes').tooltip();
    $('#cc-TB-Clear-Nodes').tooltip();
    $('#cc-TB-Enable-Turns').tooltip();
    $('#cc-TB-Disable-UTurns').tooltip();

    // Handles switching of tools/options based on radiobox selection
    $(document).ready(() => {
        $('input[type="radio"][name=setNameSelType]').click(function () {
            if (this.value == 'selectedSegs') {
                $('#selSegOptions').show();
                $('#allSegOptions').hide();
            } else {
                $('#selSegOptions').hide();
                $('#allSegOptions').show();
            }
        });
    });
    $(document).ready(() => {
        $('input[type="radio"][name=segSpeedType]').click(function () {
            if (this.value == 'selSegSpeed') {
                $('#selSegSpeedOptions').show();
                $('#allSegSpeedOptions').hide();
            } else {
                $('#selSegSpeedOptions').hide();
                $('#allSegSpeedOptions').show();
            }
        });
    });

    // Saves user options settings
    $('input[type=checkbox]').change(function () {
        const settingName = $(this)[0].id.substr(2);
        ccFuncSettings[settingName] = this.checked;
        saveSettings();
    });
    $('input[type=text]').change(function () {
        const settingName = $(this)[0].id.substr(2);
        ccFuncSettings[settingName] = this.value;
        saveSettings();
    });
    $('.ccSelect').change(function () {
        const settingName = $(this)[0].id;
        ccFuncSettings[settingName] = this.value;
        saveSettings();
    });

    // Watches for the shortcut dialog to close and updates UI
    const el = $.fn.hide;
    $.fn.hide = function () {
        this.trigger('hide');
        return el.apply(this, arguments);
    };
    $('#keyboard-dialog').on('hide', () => { checkShortcutsChanged(); });

    function setOptionStatus() {
        setChecked('ccUserSettingsEnable', ccFuncSettings.UserSettingsEnable);
        setChecked('cclockStreetEnable', ccFuncSettings.lockStreetEnable);
        setChecked('cclockPSEnable', ccFuncSettings.lockPSEnable);
        setChecked('cclockminHEnable', ccFuncSettings.lockminHEnable);
        setChecked('cclockmajHEnable', ccFuncSettings.lockmajHEnable);
        setChecked('cclockFWYEnable', ccFuncSettings.lockFWYEnable);
        setChecked('cclockRmpEnable', ccFuncSettings.lockRmpEnable);
        setChecked('ccdelPlrEnable', ccFuncSettings.delPlrEnable);
        setChecked('ccdelStreetEnable', ccFuncSettings.delStreetEnable);
        setChecked('ccdelPREnable', ccFuncSettings.delPREnable);
        setChecked('ccdelPSEnable', ccFuncSettings.delPSEnable);
        setChecked('ccdelNonPedEnable', ccFuncSettings.delNonPedEnable);
        setChecked('ccdelUpdateEnable', ccFuncSettings.delUpdateEnable);
        setChecked('ccdelhasDirectionEnable', ccFuncSettings.delhasDirectionEnable);
        setChecked('ccdelSegLengthEnable', ccFuncSettings.delSegLengthEnable);
        setChecked('ccoverwriteNameEnable', ccFuncSettings.overwriteNameEnable);
        setChecked('ccsetNamePLREnable', ccFuncSettings.setNamePLREnable);
        setChecked('ccsetNameLSEnable', ccFuncSettings.setNameLSEnable);
        setChecked('ccsetNamePSEnable', ccFuncSettings.setNamePSEnable);
        setChecked('ccsetNameMiHEnable', ccFuncSettings.setNameMiHEnable);
        setChecked('ccsetNameMaHEnable', ccFuncSettings.setNameMaHEnable);
        setChecked('ccoverwriteSpeedEnable', ccFuncSettings.overwriteSpeedEnable);
        setChecked('ccallSpeedLSEnable', ccFuncSettings.allSpeedLSEnable);
        setChecked('ccallSpeedPSEnable', ccFuncSettings.allSpeedPSEnable);
        setChecked('ccallSpeedMiHEnable', ccFuncSettings.allSpeedMiHEnable);
        setChecked('ccallSpeedMaHEnable', ccFuncSettings.allSpeedMaHEnable);
        setChecked('ccallSpeedFwyHEnable', ccFuncSettings.allSpeedFwyHEnable);
        setChecked('cccloseNoExitBox', ccFuncSettings.closeNoExitBox);
        setChecked('cccloseNoTurnsBox', ccFuncSettings.closeNoTurnsBox);
        setChecked('ccclosePLMPBox', ccFuncSettings.closePLMPBox);
        setChecked('ccSetLsPlrEnable', ccFuncSettings.SetLsPlrEnable);
        setChecked('ccSetLsPREnable', ccFuncSettings.SetLsPREnable);
        setChecked('ccSetLsPsEnable', ccFuncSettings.SetLsPsEnable);
        setChecked('ccSetLsUpdatedEnable', ccFuncSettings.SetLsUpdatedEnable);
        setChecked('ccSetLshasDirectionEnable', ccFuncSettings.SetLshasDirectionEnable);
        setChecked('ccSetLshasNameEnable', ccFuncSettings.SetLshasNameEnable);
        setChecked('ccToolbarEnable', ccFuncSettings.ToolbarEnable);
        setChecked('ccMagicTurnsEnable', ccFuncSettings.MagicTurnsEnable);
        setChecked('ccMagicLSEnable', ccFuncSettings.MagicLSEnable);
        setChecked('ccMagicPSEnable', ccFuncSettings.MagicPSEnable);
        setChecked('ccMagicMajEnable', ccFuncSettings.MagicMajEnable);
        setChecked('ccMagicMinEnable', ccFuncSettings.MagicMinEnable);
        setChecked('ccMagicPVTEnable', ccFuncSettings.MagicPVTEnable);
        setChecked('ccMagicPLREnable', ccFuncSettings.MagicPLREnable);
        setChecked('ccEnableVerifyModel', ccFuncSettings.EnableVerifyModel);
        setValue('lockStreetSelect', ccFuncSettings.lockStreetSelect);
        setValue('lockPSSelect', ccFuncSettings.lockPSSelect);
        setValue('lockminHSelect', ccFuncSettings.lockminHSelect);
        setValue('lockmajHSelect', ccFuncSettings.lockmajHSelect);
        setValue('lockRmpSelect', ccFuncSettings.lockRmpSelect);
        setValue('lockFWYSelect', ccFuncSettings.lockFWYSelect);
        setValue('ccNameInput', ccFuncSettings.NameInput);
        setValue('ccCityInput', ccFuncSettings.CityInput);

        function setChecked(checkboxId, checked) {
            $(`#${checkboxId}`).prop('checked', checked);
        }
        function setValue(inputId, storedValue) {
            $(`#${inputId}`).prop('value', storedValue);
        }
    }

    function enableUserRankOptions() {
        verifyOptionEnable('.ccLockOption2', 2);
        verifyOptionEnable('.ccLockOption3', 3);
        verifyOptionEnable('.ccLockOption4', 4);
        verifyOptionEnable('.ccLockOption5', 5);
        verifyOptionEnable('.ccLockOption6', 6);

        function verifyOptionEnable(className, rankRequired) {
            if (editorInfo.normalizedLevel < rankRequired) $(className).hide();
        }
    }
}

function updateShortcutLabels() {
    $('#cc-label-auto-lock-shortcut').text(getKeyboardShortcut('AutoLockShortcut'));
    $('#cc-label-BaseDel-shortcut').text(getKeyboardShortcut('BaseDelShortcut'));
    $('#cc-label-SetName-shortcut').text(getKeyboardShortcut('setNameShortcut'));
    $('#cc-label-SetSpeeds-shortcut').text(getKeyboardShortcut('setSpeedsShortcut'));
    $('#cc-label-CloseMP-shortcut').text(getKeyboardShortcut('closeMPsShortcut'));
    $('#cc-label-SetStreets-shortcut').text(getKeyboardShortcut('setStreetsShortcut'));
    $('#cc-label-BaseClean-shortcut').text(getKeyboardShortcut('BaseCleanShortcut'));
    $('#cc-label-NodeSuppress-shortcut').text(getKeyboardShortcut('NodeSuppressShortcut'));
    $('#cc-label-SegStraight-shortcut').text(getKeyboardShortcut('SegStraightShortcut'));
    $('#cc-label-EnableAll-shortcut').text(getKeyboardShortcut('EAOSShortcut'));
    $('#cc-label-DisableUTurns-shortcut').text(getKeyboardShortcut('DisableUTurnsShortcut'));
}

function getKeyboardShortcut(shortcut) {
    const keys = ccShortcuts[shortcut];
    let val = '';

    if (keys.indexOf('+') > -1) {
        const specialKeys = keys.split('+')[0];
        for (let i = 0; i < specialKeys.length; i++) {
            if (val.length > 0) { val += '+'; }
            if (specialKeys[i] == 'C') { val += 'Ctrl'; }
            if (specialKeys[i] == 'S') { val += 'Shift'; }
            if (specialKeys[i] == 'A') { val += 'Alt'; }
        }
        if (val.length > 0) { val+='+'; }
        let num = keys.split('+')[1];
        if (num >= 96 && num <= 105) {
            // Numpad keys
            num -= 48;
            val += '[num pad]';
        }
        val += String.fromCharCode(num);
    } else {
        let num = parseInt(keys);
        if (num >= 96 && num <= 105) {
            // Numpad keys
            num -= 48;
            val += '[num pad]';
        }
        val += String.fromCharCode(num);
    }
    return val;
}

function checkShortcutsChanged() {
    let triggerSave = false;
    for (const name in W.accelerators.Actions) {
        let TempKeys = '';
        if (W.accelerators.Actions[name].group == 'wmecc') {
            if (W.accelerators.Actions[name].shortcut) {
                if (W.accelerators.Actions[name].shortcut.altKey == true) { TempKeys += 'A'; }
                if (W.accelerators.Actions[name].shortcut.shiftKey == true) { TempKeys += 'S'; }
                if (W.accelerators.Actions[name].shortcut.ctrlKey == true) { TempKeys += 'C'; }
                if (TempKeys !== '') { TempKeys += '+'; }
                if (W.accelerators.Actions[name].shortcut.keyCode) { TempKeys += W.accelerators.Actions[name].shortcut.keyCode; }
            } else {
                TempKeys = '-1';
            }
            if (ccShortcuts[name] != TempKeys) {
                triggerSave = true;
                console.log(`CC: Stored shortcut ${name}: ${ccShortcuts[name]} changed to ${TempKeys}`);
                break;
            }
        }
    }
    if (triggerSave) { saveSettings(); setTimeout(() => { updateShortcutLabels(); }, 200); }
}

function createShortcuts() {
    new WazeWrap.Interface.Shortcut('AutoLockShortcut', 'Lock all segments by type', 'wmecc', 'Cheat Codes', ccShortcuts.AutoLockShortcut, autoLock, null).add();
    new WazeWrap.Interface.Shortcut('BaseDelShortcut', 'Delete all no-name segments', 'wmecc', 'Cheat Codes', ccShortcuts.BaseDelShortcut, baseDel, null).add();
    new WazeWrap.Interface.Shortcut('setNameShortcut', 'Set segment name/city', 'wmecc', 'Cheat Codes', ccShortcuts.setNameShortcut, setNames, null).add();
    new WazeWrap.Interface.Shortcut('setSpeedsShortcut', 'Set SLs on selected road types', 'wmecc', 'Cheat Codes', ccShortcuts.setSpeedsShortcut, setSpeeds, null).add();
    new WazeWrap.Interface.Shortcut('closeMPsShortcut', 'Close all selected MP types', 'wmecc', 'Cheat Codes', ccShortcuts.closeMPsShortcut, closeAllMPs, null).add();
    new WazeWrap.Interface.Shortcut('setStreetsShortcut', 'Set all segments to LS', 'wmecc', 'Cheat Codes', ccShortcuts.setStreetsShortcut, setStreets, null).add();
    new WazeWrap.Interface.Shortcut('BaseCleanShortcut', 'Basemap Clean-up', 'wmecc', 'Cheat Codes', ccShortcuts.BaseCleanShortcut, bmUnkownFix, null).add();
    new WazeWrap.Interface.Shortcut('NodeSuppressShortcut', 'Remove extra junction nodes', 'wmecc', 'Cheat Codes', ccShortcuts.NodeSuppressShortcut, suppressNodes, null).add();
    new WazeWrap.Interface.Shortcut('SegStraightShortcut', 'Clear all geo-nodes on selected segments', 'wmecc', 'Cheat Codes', ccShortcuts.SegStraightShortcut, segStraight, null).add();
    new WazeWrap.Interface.Shortcut('EAOSShortcut', 'Enable all turns on screen', 'wmecc', 'Cheat Codes', ccShortcuts.EAOSShortcut, enableAll, null).add();
    new WazeWrap.Interface.Shortcut('DisableUTurnsShortcut', 'Disable all U-Turns on screen', 'wmecc', 'Cheat Codes', ccShortcuts.DisableUTurnsShortcut, disableUTurns, null).add();
}

async function saveSettings() {
    const localshortcutsettings = {
        lastSaveAction: Date.now(),
        EAOSShortcut: ccShortcuts.EAOSShortcut,
        AutoLockShortcut: ccShortcuts.AutoLockShortcut,
        BaseDelShortcut: ccShortcuts.BaseDelShortcut,
        BaseCleanShortcut: ccShortcuts.BaseCleanShortcut,
        NodeSuppressShortcut: ccShortcuts.NodeSuppressShortcut,
        SegStraightShortcut: ccShortcuts.SegStraightShortcut,
        setStreetsShortcut: ccShortcuts.setStreetsShortcut,
        setSpeedsShortcut: ccShortcuts.setSpeedsShortcut,
        closeMPsShortcut: ccShortcuts.closeMPsShortcut,
        setNameShortcut: ccShortcuts.setNameShortcut,
        DisableUTurnsShortcut: ccShortcuts.DisableUTurnsShortcut
    };
    for (const name in W.accelerators.Actions) {
        let TempKeys = '';
        if (W.accelerators.Actions[name].group == 'wmecc') {
            // console.log(name);
            if (W.accelerators.Actions[name].shortcut) {
                if (W.accelerators.Actions[name].shortcut.altKey == true) { TempKeys += 'A'; }
                if (W.accelerators.Actions[name].shortcut.shiftKey == true) { TempKeys += 'S'; }
                if (W.accelerators.Actions[name].shortcut.ctrlKey == true) { TempKeys += 'C'; }
                if (TempKeys !== '') { TempKeys += '+'; }
                if (W.accelerators.Actions[name].shortcut.keyCode) { TempKeys += W.accelerators.Actions[name].shortcut.keyCode; }
            } else { TempKeys = '-1'; }
            localshortcutsettings[name] = TempKeys;
        }
    }

    ccShortcuts = localshortcutsettings;

    const localusersettings = {
        lastSaveAction: Date.now(),
        UserSettingsEnable: ccFuncSettings.UserSettingsEnable,
        EnableVerifyModel: ccFuncSettings.EnableVerifyModel,
        lockStreetEnable: ccFuncSettings.lockStreetEnable,
        lockStreetSelect: ccFuncSettings.lockStreetSelect,
        lockPSEnable: ccFuncSettings.lockPSEnable,
        lockPSSelect: ccFuncSettings.lockPSSelect,
        lockminHEnable: ccFuncSettings.lockminHEnable,
        lockminHSelect: ccFuncSettings.lockminHSelect,
        lockmajHEnable: ccFuncSettings.lockmajHEnable,
        lockmajHSelect: ccFuncSettings.lockmajHSelect,
        lockFWYEnable: ccFuncSettings.lockFWYEnable,
        lockFWYSelect: ccFuncSettings.lockFWYSelect,
        lockRmpEnable: ccFuncSettings.lockRmpEnable,
        lockRmpSelect: ccFuncSettings.lockRmpSelect,
        delPlrEnable: ccFuncSettings.delPlrEnable,
        delStreetEnable: ccFuncSettings.delStreetEnable,
        delPREnable: ccFuncSettings.delPREnable,
        delPSEnable: ccFuncSettings.delPSEnable,
        delNonPedEnable: ccFuncSettings.delNonPedEnable,
        delUpdateEnable: ccFuncSettings.delUpdateEnable,
        delhasDirectionEnable: ccFuncSettings.delhasDirectionEnable,
        delSegLengthEnable: ccFuncSettings.delSegLengthEnable,
        NameInput: ccFuncSettings.NameInput,
        CityInput: ccFuncSettings.CityInput,
        overwriteNameEnable: ccFuncSettings.overwriteNameEnable,
        setNamePLREnable: ccFuncSettings.setNamePLREnable,
        setNameLSEnable: ccFuncSettings.setNameLSEnable,
        setNamePSEnable: ccFuncSettings.setNamePSEnable,
        setNameMiHEnable: ccFuncSettings.setNameMiHEnable,
        setNameMaHEnable: ccFuncSettings.setNameMaHEnable,
        overwriteSpeedEnable: ccFuncSettings.overwriteSpeedEnable,
        allSpeedLSEnable: ccFuncSettings.allSpeedLSEnable,
        allSpeedPSEnable: ccFuncSettings.allSpeedPSEnable,
        allSpeedMiHEnable: ccFuncSettings.allSpeedMiHEnable,
        allSpeedMaHEnable: ccFuncSettings.allSpeedMaHEnable,
        allSpeedFwyHEnable: ccFuncSettings.allSpeedFwyHEnable,
        closeNoExitBox: ccFuncSettings.closeNoExitBox,
        closeNoTurnsBox: ccFuncSettings.closeNoTurnsBox,
        closePLMPBox: ccFuncSettings.closePLMPBox,
        SetLsPlrEnable: ccFuncSettings.SetLsPlrEnable,
        SetLsPREnable: ccFuncSettings.SetLsPREnable,
        SetLsPsEnable: ccFuncSettings.SetLsPsEnable,
        SetLsUpdatedEnable: ccFuncSettings.SetLsUpdatedEnable,
        SetLshasDirectionEnable: ccFuncSettings.SetLshasDirectionEnable,
        SetLshasNameEnable: ccFuncSettings.SetLshasNameEnable,
        MagicTurnsEnable: ccFuncSettings.MagicTurnsEnable,
        MagicLSEnable: ccFuncSettings.MagicLSEnable,
        MagicPSEnable: ccFuncSettings.MagicPSEnable,
        MagicMajEnable: ccFuncSettings.MagicMajEnable,
        MagicMinEnable: ccFuncSettings.MagicMinEnable,
        MagicPVTEnable: ccFuncSettings.MagicPVTEnable,
        MagicPLREnable: ccFuncSettings.MagicPLREnable,
        ToolbarEnable: ccFuncSettings.ToolbarEnable,
        ToolbarXCoord: ccFuncSettings.ToolbarXCoord,
        ToolbarYCoord: ccFuncSettings.ToolbarYCoord
    };

    if (localStorage) {
        localStorage.setItem('ccShortcuts', JSON.stringify(localshortcutsettings));
        localStorage.setItem('ccFuncSettings', JSON.stringify(localusersettings));
    }

    // Connect and save settings to the WazeWrap server
    const serverShortcutSave = await WazeWrap.Remote.SaveSettings('ccShortcuts', localshortcutsettings);
    const serverSettingSave = await WazeWrap.Remote.SaveSettings('ccFuncSettings', localusersettings);

    if (serverShortcutSave == null || serverSettingSave == null) console.log('CC: User PIN not set in WazeWrap tab');
    if (serverShortcutSave === false) console.log('CC: Unable to save shortcuts to server');
    if (serverSettingSave === false) console.log('CC: Unable to save settings to server');
}

async function loadSettings() {
    const localShortcutSettings = $.parseJSON(localStorage.getItem('ccShortcuts'));
    let localFuncSettings = $.parseJSON(localStorage.getItem('ccFuncSettings'));

    // Connect to WazeWrap server and pull stored settings
    const serverShortcutSettings = await WazeWrap.Remote.RetrieveSettings('ccShortcuts');
    const serverUserSettings = await WazeWrap.Remote.RetrieveSettings('ccFuncSettings');
    if (!serverShortcutSettings || !serverUserSettings) console.log('CC: Error communicating with WW server');

    const defaultShortcutSettings = {
        lastSaveAction: Date.now(),
        EAOSShortcut: '',
        AutoLockShortcut: '',
        BaseDelShortcut: '',
        BaseCleanShortcut: '',
        NodeSuppressShortcut: '',
        SegStraightShortcut: '',
        setStreetsShortcut: '',
        setSpeedsShortcut: '',
        closeMPsShortcut: '',
        setNameShortcut: '',
        DisableUTurnsShortcut: ''
    };

    const defaultUserSettings = {
        lastSaveAction: Date.now(),
        UserSettingsEnable: false,
        EnableVerifyModel: true,
        lockStreetEnable: false,
        lockStreetSelect: 'Auto',
        lockPSEnable: false,
        lockPSSelect: 'Auto',
        lockminHEnable: false,
        lockminHSelect: 'Auto',
        lockmajHEnable: false,
        lockmajHSelect: 'Auto',
        lockFWYEnable: false,
        lockFWYSelect: 'Auto',
        lockRmpEnable: false,
        lockRmpSelect: 'Auto',
        delPlrEnable: false,
        delStreetEnable: false,
        delPREnable: false,
        delPSEnable: false,
        delNonPedEnable: false,
        delUpdateEnable: false,
        delhasDirectionEnable: false,
        delSegLengthEnable: false,
        NameInput: '',
        CityInput: '',
        overwriteNameEnable: false,
        setNamePLREnable: false,
        setNameLSEnableL: false,
        setNamePSEnable: false,
        setNameMiHEnable: false,
        setNameMaHEnable: false,
        overwriteSpeedEnable: false,
        allSpeedLSEnable: false,
        allSpeedPSEnable: false,
        allSpeedMiHEnable: false,
        allSpeedMaHEnable: false,
        allSpeedFwyHEnable: false,
        closeNoExitBox: false,
        closeNoTurnsBox: false,
        closePLMPBox: false,
        SetLsPlrEnable: false,
        SetLsPREnable: false,
        SetLsPsEnable: false,
        SetLsUpdatedEnable: false,
        SetLshasDirectionEnable: false,
        SetLshasNameEnable: false,
        MagicTurnsEnable: true,
        MagicLSEnable: false,
        MagicPSEnable: false,
        MagicMajEnable: false,
        MagicMinEnable: false,
        MagicPVTEnable: false,
        MagicPLREnable: false,
        ToolbarEnable: true,
        ToolbarXCoord: ($('#map').width() * 0.25),
        ToolbarYCoord: 1
    };

    if (localFuncSettings === null) localFuncSettings = defaultUserSettings;

    ccShortcuts = localShortcutSettings.lastSaveAction > 0 ? localShortcutSettings : defaultShortcutSettings;
    ccFuncSettings = localFuncSettings.lastSaveAction > 0 ? localFuncSettings : defaultUserSettings;

    // Check if local or server settings are more recent and use the most recent
    if (serverShortcutSettings && serverShortcutSettings.lastSaveAction > ccShortcuts.lastSaveAction) {
        $.extend(ccShortcuts, serverShortcutSettings);
        console.log('CC: WW server shortcut settings used');
    }
    if (serverUserSettings && serverUserSettings.lastSaveAction > ccFuncSettings.lastSaveAction) {
        $.extend(ccFuncSettings, serverUserSettings);
        console.log('CC: WW server user settings used');
    }
    // Reset user settings to default values if the save settings box isn't checked
    ccFuncSettings = ccFuncSettings.UserSettingsEnable ? ccFuncSettings : defaultUserSettings;

    // If there is no value set in any of the stored settings then use the default
    for (const funcprop in defaultUserSettings) {
        if (!ccFuncSettings.hasOwnProperty(funcprop)) ccFuncSettings[funcprop] = defaultUserSettings[funcprop];
    }
}

function gatherStatesList() {
    const stateSelector = getId('ccStateInput');
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
        const currStateId = statesAvailable[i].id;
        const newStateOption = document.createElement('option');
        const stateNameText = document.createTextNode(currStateName);
        if (i === 0) {
            newStateOption.setAttribute('selected', true);
        }
        newStateOption.appendChild(stateNameText);
        newStateOption.setAttribute('title', `${currStateId}`);
        stateSelector.appendChild(newStateOption);
    }
}

function isImperial() {
    return W.model.isImperial;
}

function setMeasureUnits() {
    if (isImperial()) {
        speedDisplayUnits = 'mph';
        distanceDisplayUnits = 'mi';
    } else {
        speedDisplayUnits = 'km/h';
        distanceDisplayUnits = 'km';
    }
}

function getId(iD) {
    return document.getElementById(iD);
}

function objOnScreen(obj) {
    if (obj.geometry) {
        return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
    }
    return false;
}

function objectEditable(obj) {
    return obj.isGeometryEditable();
}

function zoomLevel() {
    return W.controller.map.getZoom();
}

function verifyModelData() {
    const verifyData = getId('ccEnableVerifyModel').checked;
    let stopReload = false;
    // || returns false when both operands are false and true in all other cases
    stopReload = false || (W.model.actionManager.getActions().length > 0);

    if (!stopReload && verifyData) {
        // W.controller.reload();
    } // else WazeWrap.Alerts.warning(GM_info.script.name, 'Error with model, please save your current changes and try again');
}

function enableAll() {
    let count = 0;
    _.each(W.model.nodes.getObjectArray(), t => {
        if (t.areConnectionsEditable() && t.areAllConnectionsEnabled() == 0) {
            if (typeof t.geometry !== 'undefined' && t.geometry !== null ? W.map.getExtent().intersectsBounds(t.geometry.getBounds()) : !1) {
                W.model.actionManager.add(new ModifyAllCon(t, !0));
                count++;
            }
        }
    });
    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Enabled all turns on ${count} node(s)`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No turns to update');
}

function autoLock() {
    let count = 0;

    const lockLS_Status = getId('cclockStreetEnable').checked;
    const lockPS_Status = getId('cclockPSEnable').checked;
    const lockmH_Status = getId('cclockminHEnable').checked;
    const lockMH_Status = getId('cclockmajHEnable').checked;
    const lockRmp_Status = getId('cclockRmpEnable').checked;
    const lockFWY_Status = getId('cclockFWYEnable').checked;
    const ls_lvl = getId('lockStreetSelect').value == 'Auto' ? null : getId('lockStreetSelect').value - 1;
    const pri_lvl = getId('lockPSSelect').value == 'Auto' ? null : getId('lockPSSelect').value - 1;
    const min_lvl = getId('lockminHSelect').value == 'Auto' ? null : getId('lockminHSelect').value - 1;
    const maj_lvl = getId('lockmajHSelect').value == 'Auto' ? null : getId('lockmajHSelect').value - 1;
    const rmp_lvl = getId('lockRmpSelect').value == 'Auto' ? null : getId('lockRmpSelect').value - 1;
    const fwy_lvl = getId('lockFWYSelect').value == 'Auto' ? null : getId('lockFWYSelect').value - 1;

    _.each(W.model.segments.getObjectArray(), v => {
        if (count < 150 && objOnScreen(v) && v.isGeometryEditable()) {
            if (v.attributes.roadType == 3 && lockFWY_Status && (v.attributes.lockRank != fwy_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: fwy_lvl }));
            }
            if (v.attributes.roadType == 4 && lockRmp_Status && (v.attributes.lockRank != rmp_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: rmp_lvl }));
            }
            if (v.attributes.roadType == 6 && lockMH_Status && (v.attributes.lockRank != maj_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: maj_lvl }));
            }
            if (v.attributes.roadType == 7 && lockmH_Status && (v.attributes.lockRank != min_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: min_lvl }));
            }
            if (v.attributes.roadType == 2 && lockPS_Status && (v.attributes.lockRank != pri_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: pri_lvl }));
            }
            if (v.attributes.roadType == 1 && lockLS_Status && (v.attributes.lockRank != ls_lvl)) {
                count++;
                W.model.actionManager.add(new UpdateObj(v, { lockRank: ls_lvl }));
            }
            /* if (v.attributes.roadType == 18 && (v.attributes.lockRank < rr_lvl || (absolute && v.attributes.lockRank != rr_lvl))) {
				count++;
				W.model.actionManager.add(new UpdateObj(v, { lockRank: rr_lvl }));
			}
			if (v.attributes.roadType == 15 && (v.attributes.lockRank < fer_lvl || (absolute && v.attributes.lockRank != fer_lvl))) {
				count++;
				W.model.actionManager.add(new UpdateObj(v, { lockRank: fer_lvl })); } */
        }
    });

    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Updated locks on ${count} segments`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No locks to update');
}

function baseDel() {
    const includePLR = getId('ccdelPlrEnable').checked ? 20 : 0;
    const includeLS = getId('ccdelStreetEnable').checked ? 1 : 0;
    const includePVT = getId('ccdelPREnable').checked ? 17 : 0;
    const includePS = getId('ccdelPSEnable').checked ? 2 : 0;
    const includeNonPed = getId('ccdelNonPedEnable').checked ? 10 : 0;
    const updatedStreet = getId('ccdelUpdateEnable').checked;
    const hasDirection = getId('ccdelhasDirectionEnable').checked;
    const delSegLengthBox = getId('ccdelSegLengthEnable').checked;
    const maxSegLength = getId('ccdelSegLength').value;

    let segsDeleted = 0;

    _.each(W.model.segments.getObjectArray(), v => {
        const seg = W.model.streets.getObjectById(v.attributes.primaryStreetID);
        const segName = seg.name;
        const roadType = v.attributes.roadType;
        let sureDelete = true;
        if (v.type == 'segment' && objOnScreen(v) && v.arePropertiesEditable() && segName == null && v.state !== 'Delete') {
            if (delSegLengthBox && v.attributes.length > maxSegLength) {
                sureDelete = false;
            }
            if (!hasDirection && (v.attributes.fwdDirection || v.attributes.revDirection)) {
                sureDelete = false;
            }
            if (!updatedStreet && v.attributes.updatedOn != null) {
                sureDelete = false;
            }
            if (roadType !== includeLS && roadType !== includePVT && roadType !== includePS && roadType !== includePLR && roadType !== includeNonPed) {
                sureDelete = false;
            }
            if (sureDelete) {
                W.model.actionManager.add(new DeleteSeg(v));
                segsDeleted++;
            }
        }
    });
    if (segsDeleted !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Deleted ${segsDeleted} segments`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No segments to delete');
}

function bmUnkownFix() {
    const enableTurns = getId('ccMagicTurnsEnable').checked;
    const fixLS = getId('ccMagicLSEnable').checked;
    const fixPS = getId('ccMagicPSEnable').checked;
    const fixMaj = getId('ccMagicMajEnable').checked;
    const fixMin = getId('ccMagicMinEnable').checked;
    const fixPVT = getId('ccMagicPVTEnable').checked;
    const fixPLR = getId('ccMagicPLREnable').checked;
    const editCountMax = 100;
    let segsUpdated = 0;
    let nodesUpdated = 0;
    let proceed = true;

    console.log('CC: Beginging Basemap Cleanup!');

    function saveLimit() {
        WazeWrap.Alerts.warning(GM_info.script.name, 'Save limit reached. Please save before processing more edits');
        proceed = false;
    }

    _.each(W.model.nodes.getObjectArray(), node => {
        if (W.saveController._actionManager.getActions().length >= editCountMax) {
            return saveLimit();
        }

        if (proceed) {
            const nodeAtt = node.getFeatureAttributes();
            const nodeId = nodeAtt.id;
            // console.log(`CC: Verifying/processing node: ${nodeId}`);

            for (let i = 0; i < nodeAtt.segIDs.length; ++i) {
                let badDir = false;
                let validRoad = false;
                const segId = nodeAtt.segIDs[i];
                const seg = W.model.segments.getObjectById(segId);
                const sa = seg.getFeatureAttributes();
                // console.log(`CC: Checking seg: ${segId}`);

                if (seg && objOnScreen(seg) && objectEditable(seg) && seg.state != 'Delete') {
                    // Road Types - street, PS, MH, mH, PR
                    if (sa.roadType === 1 && fixLS) validRoad = true; // LS
                    if (sa.roadType === 2 && fixPS) validRoad = true; // PS
                    if (sa.roadType === 6 && fixMaj) validRoad = true; // MH
                    if (sa.roadType === 7 && fixMin) validRoad = true; // mH
                    if (sa.roadType === 17 && fixPVT) validRoad = true; // PVT
                    if (sa.roadType === 20 && fixPLR) validRoad = true; // PLR
                    if (!sa.fwdDirection || !sa.revDirection) badDir = true;
                    if (badDir && validRoad) {
                        const updates = {};
                        console.log(`CC: Updating seg: ${sa.id}`);

                        updates.fwdDirection = true;
                        updates.revDirection = true;
                        W.model.actionManager.add(new UpdateObj(seg, updates));
                        segsUpdated++;
                    }
                }
            }
            if (nodeAtt.segIDs.length > 1 && node.areConnectionsEditable() && !node.areAllConnectionsEnabled() && node.state != 'Delete' && objOnScreen(node) && objectEditable(node)) {
                if (enableTurns) {
                    W.model.actionManager.add(new ModifyAllCon(node, !0));
                    nodesUpdated++;

                    console.log(`CC: Set turns on node: ${nodeId}`);
                }
            }
        }
    });

    console.log('CC: Basemap Cleanup complete!');

    if ((nodesUpdated || segsUpdated) > 0) {
        WazeWrap.Alerts.success(GM_info.script.name, `Updated direction on ${segsUpdated} segments and turns on ${nodesUpdated} nodes`);
    } else WazeWrap.Alerts.info(GM_info.script.name, 'No segments or nodes require updating');
}

function suppressNodes() {
    let count = 0;
    const geo = W.map.getExtent().toGeometry();

    if (zoomLevel() < 4) {
        WazeWrap.Alerts.warning(GM_info.script.name, 'You need to be at zoom level 4 (100m/500ft) or higher to use this function');
    }

    _.each(W.model.nodes.getObjectArray(), v => {
        if (count < 10) {
            if (v.areConnectionsEditable() && geo.containsPoint(v.geometry) && v.state !== 'Delete') {
                if (v.attributes.segIDs.length == 2) {
                    const seg1 = W.model.segments.getObjectById(v.attributes.segIDs[0]);
                    const seg2 = W.model.segments.getObjectById(v.attributes.segIDs[1]);

                    if (seg1 && seg2 && seg1.attributes.primaryStreetID == seg2.attributes.primaryStreetID) {
                        let update = true;

                        if (seg1.attributes.roadType != seg2.attributes.roadType) {
                            update = false;
                            console.log('CC: Cant merge nodes due to roadType');
                        }
                        if ((seg1.isOneWay() != seg2.isOneWay()) || !seg1.isDrivable() || !seg2.isDrivable()) {
                            update = false;
                            console.log('CC: Cant merge nodes due to direction');
                        }
                        if (seg1.attributes.junctionID != null || seg2.attributes.junctionID != null) {
                            update = false;
                        }
                        if ((seg1.attributes.level != seg2.attributes.level) || seg1.attributes.hasClosures || seg2.attributes.hasClosures) {
                            update = false;
                            console.log('CC: Cant merge nodes due to elevation or closures');
                        }
                        if ((seg1.attributes.flags != seg2.attributes.flags) || (seg1.attributes.fwdToll != seg2.attributes.fwdToll)) {
                            update = false;
                            console.log('CC: Cant merge nodes due to road flags');
                        }
                        if ((seg1.attributes.lockRank != seg2.attributes.lockRank) || (seg1.attributes.rank != seg2.attributes.rank)) {
                            update = false;
                            console.log('CC: Cant merge nodes due to road locks');
                        }
                        if (seg1.attributes.fwdMaxSpeed != seg2.attributes.fwdMaxSpeed || seg1.attributes.revMaxSpeed != seg2.attributes.revMaxSpeed) {
                            update = false;
                            WazeWrap.Alerts.warning(GM_info.script.name, 'Some segments cannot be merged due to differing speed limits');
                        }
                        if (seg1.attributes.fwdMaxSpeedUnverified != seg2.attributes.fwdMaxSpeedUnverified || seg1.attributes.revMaxSpeedUnverified != seg2.attributes.revMaxSpeedUnverified) {
                            update = false;
                            WazeWrap.Alerts.warning(GM_info.script.name, 'Some segments have conflicting verified speed status');
                        }
                        if (seg1.attributes.toNodeID == seg1.attributes.fromNodeID || seg2.attributes.toNodeID == seg2.attributes.fromNodeID) {
                            update = false;
                        }
                        if (seg1.attributes.toNodeID != v.attributes.id && (seg1.attributes.toNodeID == seg2.attributes.toNodeID || seg1.attributes.toNodeID == seg2.attributes.fromNodeID)) {
                            update = false;
                        }
                        if (seg1.attributes.fromNodeID != v.attributes.id && (seg1.attributes.fromNodeID == seg2.attributes.toNodeID || seg1.attributes.fromNodeID == seg2.attributes.fromNodeID)) {
                            update = false;
                        }

                        if (update) {
                            let n1;
                            let n2;

                            if (seg1.attributes.toNodeID == v.attributes.id) {
                                n1 = W.model.nodes.getObjectById(seg1.attributes.fromNodeID);
                            } else n1 = W.model.nodes.getObjectById(seg1.attributes.toNodeID);

                            if (seg2.attributes.toNodeID == v.attributes.id) {
                                n2 = W.model.nodes.getObjectById(seg2.attributes.fromNodeID);
                            } else n2 = W.model.nodes.getObjectById(seg2.attributes.toNodeID);

                            for (let i = 0; i < n1.attributes.segIDs.length; i++) {
                                for (let j = 0; j < n2.attributes.segIDs.length; j++) {
                                    if (n1.attributes.segIDs[i] == n2.attributes.segIDs[j]) {
                                        console.log('CC: Merge on', v.attributes.id, 'would cause two or more segments connected to same nodes.');
                                        update = false;
                                    }
                                    if (update === false) break;
                                }
                                if (update === false) break;
                            }
                        }
                        if (update) {
                            W.model.actionManager.add(new MergeSeg(seg1, seg2, v));
                            count++;
                            console.log(`CC: merged segment ${seg1.attributes.id} with ${seg2.attributes.id} at node ${v.attributes.id}`);
                        }
                    }
                }
            }
        }
    });
    if (count !== 0) {
        WazeWrap.Alerts.success(GM_info.script.name, `Removed ${count} junction nodes`);
    } else WazeWrap.Alerts.info(GM_info.script.name, 'No junction nodes to remove');
}

function segStraight() {
    let count = 0;

    _.each(W.selectionManager.getSelectedFeatures(), k => {
        const v = k.model;

        if (v && v.type == 'segment' && v.geometry.components.length > 2) {
            const geo = v.geometry.clone();
            geo.components.splice(1, geo.components.length - 2);
            geo.components[0].calculateBounds();
            geo.components[1].calculateBounds();
            W.model.actionManager.add(new UpdateSegGeo(v, v.geometry, geo));
            count++;
        }
    });
    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Removed all geonodes on ${count} segments`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No geonodes to remove');
}

function setStreets() {
    const PLRStreet = getId('ccSetLsPlrEnable').checked ? 20 : null;
    const PRStreet = getId('ccSetLsPREnable').checked ? 17 : null;
    const PSStreet = getId('ccSetLsPsEnable').checked ? 2 : null;
    const updatedStreet = getId('ccSetLsUpdatedEnable').checked;
    const hasDirection = getId('ccSetLshasDirectionEnable').checked;
    const hasName = getId('ccSetLshasNameEnable').checked;

    let count = 0;

    _.each(W.model.segments.getObjectArray(), v => {
        const seg = W.model.streets.getObjectById(v.attributes.primaryStreetID);
        const segName = seg.name;
        if (v.type == 'segment' && v.isGeometryEditable() && objOnScreen(v) && ((!hasName && segName == null) || hasName)
			&& ((v.attributes.fwdDirection == false && v.attributes.revDirection == false && !hasDirection)
				|| (hasDirection && v.attributes.fwdDirection !== null && v.attributes.revDirection !== null))
			&& ((updatedStreet && v.attributes.updatedOn !== 0) || (!updatedStreet && v.attributes.updatedOn == null))
			&& (v.attributes.roadType == PLRStreet || v.attributes.roadType == PRStreet || v.attributes.roadType == PSStreet)) {
            W.model.actionManager.add(new UpdateObj(v, { roadType: 1 }));
            count++;
        }
    });
    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Updated ${count} segments to LS`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No segments to update');
}

function setSpeeds() {
    const setSpeedSelected = getId('ccsetSpeedSelected').checked;
    const setSpeedAll = getId('ccsetSpeedAll').checked;
    const speedOverride = getId('ccoverwriteSpeedEnable').checked;
    const newSpeedValue = getId('ccspeedInputValue').value;
    const setLSSpeed = getId('ccallSpeedLSEnable').checked;
    const setPSSpeed = getId('ccallSpeedPSEnable').checked;
    const setMiHSpeed = getId('ccallSpeedMiHEnable').checked;
    const setMaHSpeed = getId('ccallSpeedMaHEnable').checked;
    const setFwySpeed = getId('ccallSpeedFwyHEnable').checked;
    const speedLimitValue = isImperial() ? Math.round(newSpeedValue * 1.6) : newSpeedValue;
    let count = 0;
    const updates = {
        fwdMaxSpeed: speedLimitValue,
        fwdMaxSpeedUnverified: false,
        revMaxSpeed: speedLimitValue,
        revMaxSpeedUnverified: false
    };

    if (setSpeedSelected) {
        const selectedSegs = W.selectionManager.getSelectedFeatures();
        const arrayLength = selectedSegs.length;
        for (let i = 0; i < arrayLength; i++) {
            const segObject = selectedSegs[i].model;
            if (segObject.type == 'segment' && segObject.isGeometryEditable() && objOnScreen(segObject)
				&& (speedOverride || (!speedOverride && (segObject.attributes.fwdMaxSpeed == null && segObject.attributes.revMaxSpeed == null)))) {
                W.model.actionManager.add(new UpdateObj(segObject, updates));
                count++;
            }
        }
    } else if (setSpeedAll) {
        _.each(W.model.segments.getObjectArray(), s => {
            if (s.type == 'segment' && s.isGeometryEditable() && objOnScreen(s)
				&& (speedOverride || (!speedOverride && (s.attributes.fwdMaxSpeed == null && s.attributes.revMaxSpeed == null)))
				&& ((s.attributes.roadType == 1 && setLSSpeed)
				|| (s.attributes.roadType == 2 && setPSSpeed)
				|| (s.attributes.roadType == 7 && setMiHSpeed)
				|| (s.attributes.roadType == 6 && setMaHSpeed)
				|| (s.attributes.roadType == 3 && setFwySpeed))) {
                W.model.actionManager.add(new UpdateObj(s, updates));
                count++;
            }
        });
    }

    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Updated speed limit(s) on ${count} segment(s)`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No speed limits to update');
}

function closeAllMPs() {
    let resolveAs = null;
    let count = 0;

    const resolutionType = getId('ccmpResolveType').value;
    const noExitStatus = getId('cccloseNoExitBox').checked;
    const noTurnsStatus = getId('cccloseNoTurnsBox').checked;
    const plMpStatus = getId('ccclosePLMPBox').checked;

    if (resolutionType == 'Resolved') {
        resolveAs = 0;
    } else if (resolutionType == 'Not Identified') {
        resolveAs = 1;
    } else {
        return WazeWrap.Alerts.warning(GM_info.script.name, 'Resolution type error');
    }

    if (!noExitStatus && !noTurnsStatus && !plMpStatus) {
        return WazeWrap.Alerts.warning(GM_info.script.name, 'You must select an MP type to close');
    }

    _.each(W.model.problems.getObjectArray(), s => {
        if (s.attributes.open && objOnScreen(s) && ((noExitStatus && s.attributes.subType == 6) || (noTurnsStatus && s.attributes.subType == 23)
			|| (plMpStatus && (s.attributes.subType == 70 || s.attributes.subType == 71)))) {
            W.model.actionManager.add(new UpdateObj(s, { open: false, resolution: resolveAs }));
            count++;
        }
    });
    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Closed ${count} MPs`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No MPs to close');
}

function setNames() {
    const setNameSelected = getId('ccsetNameSelected').checked;
    const setNameAll = getId('ccsetNameAll').checked;
    const nameOverride = getId('ccoverwriteNameEnable').checked;
    const setPLRName = getId('ccsetNamePLREnable').checked;
    const setLSName = getId('ccsetNameLSEnable').checked;
    const setPSName = getId('ccsetNamePSEnable').checked;
    const setMiHName = getId('ccsetNameMiHEnable').checked;
    const setMaHName = getId('ccsetNameMaHEnable').checked;
    const newSegName = getId('ccNameInput').value;
    const newCityName = getId('ccCityInput').value;
    const newAltSegName = getId('ccAltNameInput').value;
    const newAltCityName = getId('ccAltCityInput').value;
    const stateId = $('#ccStateInput > option:selected').attr('title');
    const setAltName = !!(($('#ccAltNameInput').val() || $('#ccAltCityInput').val()));
    const stateConfirmText = 'Selected state is not the same as the segment state. Do you want to change it?';
    let segs = {};
    let proceed = true;
    let stateVerified = false;
    let count = 0;

    if (setNameAll) {
        segs = W.model.segments.getObjectArray();
    } else if (setNameSelected) {
        const selectedFeatures = W.selectionManager.getSelectedFeatures();
        let correctType = true;

        for (let i = 0; i < selectedFeatures.length; i++) {
            if (selectedFeatures[0].model.type != 'segment') correctType = false;
        }

        if (correctType) {
            for (let i = 0; i < selectedFeatures.length; i++) {
                segs[i] = selectedFeatures[i].model;
            }
        } else WazeWrap.Alert.warning(GM_info.script.name, 'Some selected objects are not segments');
    }

    _.each(segs, v => {
        const segObj = W.model.segments.getObjectById(v.attributes.id);
        const priSt = W.model.streets.getObjectById(v.attributes.primaryStreetID);
        const priName = priSt.name;
        const stCity = W.model.cities.getObjectById(priSt.cityID);
        const stState = W.model.states.getObjectById(stCity.attributes.stateID);
        const stStateID = stState.id;
        const stCountryID = stState.countryID;
        const noName = newSegName == '';
        const noCity = newCityName == '';
        const updatedAtt = {
            countryID: stCountryID,
            stateID: stStateID,
            cityName: noCity ? '' : newCityName,
            streetName: noName ? '' : newSegName,
            emptyStreet: noName,
            emptyCity: noCity
        };

        proceed = true;

        function processSegs() {
            if (priName !== null || (priName !== null && !nameOverride)) update = false;
            if (setNameAll) {
                if (!setLSName && v.attributes.roadType == 1) proceed = false;
                if (!setPSName && v.attributes.roadType == 2) proceed = false;
                if (!setMiHName && v.attributes.roadType == 7) proceed = false;
                if (!setMaHName && v.attributes.roadType == 6) proceed = false;
                if (!setPLRName && v.attributes.roadType == 20) proceed = false;
            }

            if (proceed) {
                W.model.actionManager.add(new UpdateAddress(segObj, updatedAtt, { streetIDField: 'primaryStreetID' }));
                count++;
                console.log('CC: Updated the segment primary Name/City');
                if (setAltName) {
                    const streetName = newAltSegName;
                    const cityName = newAltCityName;
                    W.model.actionManager.add(new AddAltStreet(segObj, { cityName, streetName }));
                    console.log('CC: Updated segment alt Name/City');
                }
            }
        }

        if (stStateID != stateId) {
            let userConfirm = confirm(`${stateConfirmText}`);
            if (userConfirm) {
                updatedAtt.StateID = stateId;
            }
                stateVerified = true;
        } else stateVerified = true;

        if (stateVerified) processSegs();
    });

    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Updated ${count} segment(s) name(s)`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No segments to update');
}

function disableUTurns() {
    const allNodes = W.model.nodes.getObjectArray();
    const turnGraph = W.model.getTurnGraph();
    let count = 0;

    _.each(allNodes, curNode => {
        const nodeAtt = curNode.getFeatureAttributes();

        if (curNode.state == null || curNode.state == 'update') {
            for (let n = 0; n < nodeAtt.segIDs.length; n++) {
                const k = nodeAtt.segIDs[n];
                const seg = W.model.segments.getObjectById(k);
                // const segAtt = seg.getAttributes();
                let turnStatus = turnGraph.getTurnThroughNode(curNode, seg, seg);
                let turnData = turnStatus.getTurnData();

                if (turnData.isAllowed() && (seg.status == null || seg.status == 'update')) {
                    turnData = turnData.withToggledState(false);
                    turnStatus = turnStatus.withTurnData(turnData);

                    W.model.actionManager.add(new SetTurn(turnGraph, turnStatus));
                    count++;
                }
            }
        }
    });
    if (count !== 0) WazeWrap.Alerts.success(GM_info.script.name, `Disabled ${count} U-Turns`);
    else WazeWrap.Alerts.info(GM_info.script.name, 'No U-Turns to update');
}

bootstrap();
