// ==UserScript==
// @name         'mTurk Multibind LLL Fork
// @namespace    salembeats
// @version      6.2
// @description  Works with groups and checkboxes now too. Latest update: AutoNext option, autosubmit only submits when all radio/checkbox groups detected as complete.
// @author       Cuyler Stuwe (salembeats)
// @icon         https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @include      *
// @include      https://worker.mturk.com/projects/*
// @require      https://greasyfork.org/scripts/33041-mturk-frame-parent-interface-library/code/mTurk%20Frame-%3EParent%20Interface%20Library.js?version=239183
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/38406/%27mTurk%20Multibind%20LLL%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/38406/%27mTurk%20Multibind%20LLL%20Fork.meta.js
// ==/UserScript==

// TODO: Rename radio-button-specific variables and methods to reflect that this script also works with checkboxes now.

function isInMturkIframe() {
    return ( window !== window.top && (document.referrer.includes("mturk.com/mturk/preview") || document.referrer.includes("mturk.com/mturk/accept") || document.referrer.includes("mturk.com/mturk/continue") || document.referrer.includes("mturk.com/mturk/return") || document.referrer.includes("mturk.com/mturk/previewandaccept") || document.referrer.includes("worker.mturk.com/projects/")));
}
if (!isInMturkIframe()) {return;}

// This method of inserting styles has demonstrated 1 rare instance of crashing the latest version of Chrome (HIT 3EM4DVSA9VCUF872SQS7MYM8S5830K).
// Commenting out.

// document.styleSheets[0].insertRule('@keyframes breathingRadios { 0%: {transform: scale(1);} 50% {transform: scale(1.3);} 100% {transform: scale(1);} }');
// document.styleSheets[0].insertRule('input[type="radio"].salemFocusedRadio { animation: breathingRadios 0.33s linear infinite; }');
// document.styleSheets[0].insertRule('input[type="checkbox"].salemFocusedRadio { animation: breathingRadios 0.33s linear infinite; }');

// New style insertion method to work around crashing bug.

document.head.insertAdjacentHTML("beforeend", `
<style>
@keyframes breathingRadios {
0%: {transform: scale(1);}
50% {transform: scale(1.3);}
100% {transform: scale(1);}
}
input[type="radio"].salemFocusedRadio {
animation: breathingRadios 0.33s linear infinite !important;
}
input[type="checkbox"].salemFocusedRadio {
animation: breathingRadios 0.33s linear infinite !important;
}
</style>
`);

var allRadios = document.querySelectorAll("input[type='radio'],input[type='checkbox']");
var radioGroups = [{groupName: "ungroupedRadios", radios: []}];

for(let radio of allRadios) {
    if(radio.getAttribute("name") === undefined || radio.getAttribute("name") === "") { // If radio isn't grouped.
        radioGroups[0].radios.push(radio);
    }
    else if(radioGroups[radioGroups.length-1].groupName !== radio.getAttribute("name")) { // If radio's group is different than group at the end of the array.
        radioGroups.push({groupName: radio.getAttribute("name"), radios: [radio]});
        radioGroups[radioGroups.length-1].radios[0].insertAdjacentHTML("beforebegin",`<span style='font-weight: bold'>1: </span>`);
    }
    else { // If radio belongs in the group at the end of the array.
        radioGroups[radioGroups.length-1].radios.push(radio);
        radioGroups[radioGroups.length-1].radios[radioGroups[radioGroups.length-1].radios.length-1].insertAdjacentHTML("beforebegin",`<span style='font-weight: bold'>${radioGroups[radioGroups.length-1].radios.length}: </span>`);
    }
}

// Remove the initial ungrouped section if all radios have groups.
if(radioGroups[0].radios.length === 0) {radioGroups.shift();}

function hasRadios() {
    return radioGroups.length > 0;
}

var selectedRadioGroupIndex;
var selectedRadioGroup;
if(hasRadios()) {
    selectedRadioGroupIndex = 0;
    selectedRadioGroup = radioGroups[selectedRadioGroupIndex];
}
else { return; }

function highlightSelectedRadioGroup() {
    for(let radio of selectedRadioGroup.radios) {
        radio.classList.add("salemFocusedRadio");
    }
}

function unhighlightSelectedRadioGroup() {
    for(let radio of selectedRadioGroup.radios) {
        radio.classList.remove("salemFocusedRadio");
    }
}

const SB_LOGO = "https://turkerhub.com/data/avatars/m/1/1637.jpg?1513481491";

const MIDI_TYPE_CC = 176;
const MIDI_BUTTON_PRESS_VALUE = 127;

var midi, midiData;

var midiCCState = {};

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("No MIDI support exists in this browser.");
}

function onMIDISuccess(midiAccess) {
    midi = midiAccess;

    var inputs = midi.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure(error) {
    console.log("MIDI support exists in this browser, but the permission request failed.");
}

function onMIDIMessage(message) {
    midiData = message.data;

    let cmd = midiData[0] >> 4,
        type = midiData[0] & 0xf0,
        channel = midiData[0] & 0xF,
        noteOrCC = midiData[1],
        value = midiData[2];

    if(type === MIDI_TYPE_CC) {
        updateMIDICCState(channel, noteOrCC, value);
    }
}

function updateMIDICCState(channel,cc,value) {

    let isNewState = false;

    if(midiCCState[channel] === undefined) {
        midiCCState[channel] = {};
        isNewState = true;
    }

    if(midiCCState[channel][cc] === undefined) {
        midiCCState[channel][cc] = value;
        isNewState = true;
    }

    if(isNewState) {
        onNewMIDICCState(channel,cc,value);
        return;
    }

    if(midiCCState[channel][cc] !== value) {
        midiCCState[channel][cc] = value;
        onNewMIDICCState(channel,cc,value);
    }
}

function onNewMIDICCState(channel,cc,value) {
    if(value === MIDI_BUTTON_PRESS_VALUE) {
        switch(cc) {
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                clickRadioButtonByIndex(cc - 50);
                break;
            default:
                break;
        }
    }

}

const ONE_SECOND_AS_MILLISECONDS = 1000;
const SAFETY_MODE_ACTIVATION_SECONDS = 60;
const SAFETY_MODE_AUTOACTIVATE_TIME = ONE_SECOND_AS_MILLISECONDS * SAFETY_MODE_ACTIVATION_SECONDS;

const KEYCODE_TAB = 9;
const KEYCODE_NUMPAD_PLUS = 107;
const KEYCODE_SHIFT = 16;
const KEYCODE_NUMPAD_DECIMAL = 110;

const SAFE_MODE_BACKGROUND_COLOR = "#02ff02";
const DANGER_MODE_BACKGROUND_COLOR = "#ff0000";

const RETURNABLE_TOGGLE_KEY = "u";
const NUMBERS_TOGGLE_KEY = "i";
const BOTTOM_ROW_LETTERS_TOGGLE_KEY = "o";
const AUTOSUBMIT_TOGGLE_KEY = "p";

document.body.insertAdjacentHTML(
    `afterbegin`,

    `<div id="keybindsDiv" tabindex="-1" style="background-color: ${GM_getValue(`safetyMode`) ? SAFE_MODE_BACKGROUND_COLOR : DANGER_MODE_BACKGROUND_COLOR }; font-size: 0.7em;">` +


    `<label tabindex="-1" id="safetyModeLabel" ${GM_getValue(`safetyMode`) ? `style="color:green;"` : `style="color:red";`}><span id="safetyModeStatus"> <span id="lock">${GM_getValue(`safetyMode`) ? `?` : `?`}</span> Safety Toggle:</span> ` +
    `<input tabindex="-1" type="checkbox" id="safetyMode" ${GM_getValue(`safetyMode`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label tabindex="-1" style="color: black; margin-left: 10px;">Keybinds Forked by LLL</label>` +

    `<label tabindex="-1" style="color: black; float: right; margin-right: 10px;">Auto Submit: ` +
    `<input tabindex="-1" id="autosubmit" type="checkbox" ${GM_getValue(`autosubmit`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label tabindex="-1" style="color: black; float: right; margin-right: 10px;">Use [z-.]: ` +
    `<input tabindex="-1" id="letters" type="checkbox" ${GM_getValue(`letters`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label tabindex="-1" style="color: black; float: right; margin-right: 10px;">Use [1-9]: ` +
    `<input tabindex="-1" id="numbers" type="checkbox" ${GM_getValue(`numbers`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label tabindex="-1" style="color: black; float: right; margin-right: 10px;">Return w/ Shift/Num+: ` +
    `<input tabindex="-1" id="returnable" type="checkbox" ${GM_getValue(`returnable`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label tabindex="-1" style="color: black; float: right; margin-right: 10px;">AutoNext: ` +
    `<input tabindex="-1" id="autoNext" type="checkbox" ${GM_getValue(`autoNext`) ? `checked` : ``}></input>` +
    `</label>` +

    `</div>`
);

const numbers = document.getElementById(`numbers`);
const letters = document.getElementById(`letters`);
const autosubmit = document.getElementById(`autosubmit`);
const safetyMode = document.getElementById(`safetyMode`);
const safetyModeLabel = document.getElementById('safetyModeLabel');
const safetyModeStatus = document.getElementById('safetyModeStatus');
const returnable = document.getElementById('returnable');
const autoNext = document.getElementById('autoNext');

autoNext.addEventListener(`change`, function (event) {
    GM_setValue(`autoNext`, autoNext.checked);
});

numbers.addEventListener(`change`, function (event) {
    GM_setValue(`numbers`, numbers.checked);
});

letters.addEventListener(`change`, function (event) {
    GM_setValue(`letters`, letters.checked);
});

autosubmit.addEventListener(`change`, function (event) {
    GM_setValue(`autosubmit`, autosubmit.checked);
});

returnable.addEventListener(`change`, function (event) {
    GM_setValue(`returnable`, returnable.checked);
});

function scrollSelectedRadioGroupIntoView() {
    let centralRadio = selectedRadioGroup.radios[Math.floor(selectedRadioGroup.radios.length/2)];
    centralRadio.scrollIntoView({block: "center", inline: "center"});
}

function cycleRadioGroup() {
    unhighlightSelectedRadioGroup();
    selectedRadioGroupIndex++;
    selectedRadioGroupIndex = selectedRadioGroupIndex % (radioGroups.length);
    selectedRadioGroup = radioGroups[selectedRadioGroupIndex];
    scrollSelectedRadioGroupIntoView();
    highlightSelectedRadioGroup();
}

function doAllRadioGroupsHaveAResponse() {
    for(let radioGroup of radioGroups) {

        let {radios} = radioGroup;

        for(let [index, radio] of radios.entries()) {
            if(radio.checked) { break; }
            else if(index === radios.length - 1) { return false; }
        }
    }
    return true;
}

function clickCurrentRadioGroupButtonByIndex(index) {
    let radioToClick = selectedRadioGroup.radios[index];
    if(radioToClick) {
        radioToClick.click();
        if(autoNext.checked) {
            cycleRadioGroup();
        }
    }
    else {
        console.log(`Radio at index ${index} does not exist.`);
    }
}

function clickRadioButtonByIndex(index) {
    let radioToClick = document.querySelectorAll(`[type="radio"]`)[index];
    if(radioToClick) {
        radioToClick.click();
    }
    else {
        console.log(`Radio at index ${index} does not exist.`);
    }
}

function setSafetyMode() {
    safetyMode.checked = true;
    GM_setValue('safetyMode', safetyMode.checked);
    safetyModeStatus.innerText = "?(OFF) Activate:";
    safetyModeStatus.style.color ="black";
    keybindsDiv.style.backgroundColor = SAFE_MODE_BACKGROUND_COLOR;
}

function defeatSafetyMode() {
    safetyMode.checked = false;
    GM_setValue('safetyMode', safetyMode.checked);
    safetyModeStatus.innerText = "?(ON) Deactivate:";
    safetyModeStatus.style.color = "white";
    keybindsDiv.style.backgroundColor = DANGER_MODE_BACKGROUND_COLOR;
}

function isSafetyModeOn() {
    return (safetyMode.checked);
}

function isSafetyModeOff() {
    return !isSafetyModeOn();
}

function areNumbersEnabled() {
    return numbers.checked;
}

function areLettersEnabled() {
    return letters.checked;
}

function isReturningEnabled() {
    return returnable.checked;
}

function isNumberKey(key) {
    return Boolean(key.match(/^[0-9]$/));
}

function isBottomRowLetterKey(key) {
    return Boolean(key.match(/^[zxcvbnm,\.\/]$/));
}

function submitHit() {
    (document.querySelector(`[type="submit"]`) || document.querySelector("#submit")).click();
    GM_setValue('lastSubmitTime',new Date().getTime());
}

safetyMode.addEventListener(`change`, function(event) {
    if(safetyMode.checked) {
        setSafetyMode();
    }
    else
    {
        defeatSafetyMode();
    }
});

var lastSubmitTime = Number(GM_getValue('lastSubmitTime'));

function shouldAutomaticallyEnableSafetyMode() {
    return (new Date().getTime() - lastSubmitTime) > SAFETY_MODE_AUTOACTIVATE_TIME ||
        (!GM_getValue('lastSubmitTime'));
}

if( shouldAutomaticallyEnableSafetyMode() ) {
    setSafetyMode();
    safetyModeStatus.innerText = `?  Activate: `;
}
else {
    if(isSafetyModeOff()) {
        scrollSelectedRadioGroupIntoView();
        highlightSelectedRadioGroup();
    }
}

var escapeCount = 0;

document.addEventListener("click", e => {
    if (isSafetyModeOff() && autosubmit.checked && doAllRadioGroupsHaveAResponse()) {
        submitHit();
    }
});

window.addEventListener(`keydown`, function radioKeybindKeydown(event) {

    if(event.key.match(/Escape/))
    {
        if(escapeCount < 2) {
            escapeCount++;
        }
        else {
            escapeCount = 0;
            if( isSafetyModeOn() ) {
                defeatSafetyMode();
                scrollSelectedRadioGroupIntoView();
                highlightSelectedRadioGroup();
            }
            else {
                setSafetyMode();
            }
        }
    }

    if( isSafetyModeOff() ) {

        const key = event.key;

        if (key.match(/Enter/)) {
            submitHit();
        }

        switch(event.key) {
            case RETURNABLE_TOGGLE_KEY:
                returnable.checked = !returnable.checked;
                break;
            case NUMBERS_TOGGLE_KEY:
                numbers.checked = !numbers.checked;
                break;
            case BOTTOM_ROW_LETTERS_TOGGLE_KEY:
                letters.checked = !letters.checked;
                break;
            case AUTOSUBMIT_TOGGLE_KEY:
                autosubmit.checked = !autosubmit.checked;
                break;
            default:
                break;
        }

        if( event.keyCode === KEYCODE_TAB || event.keyCode === KEYCODE_NUMPAD_DECIMAL) {
            event.preventDefault();
            cycleRadioGroup();
        }

        if( isReturningEnabled() ) {
            if(event.keyCode === KEYCODE_NUMPAD_PLUS ||
               event.keyCode === KEYCODE_SHIFT) {
                event.preventDefault();
                mTurkParentWindow.returnHIT();
            }
        }

        if ( areNumbersEnabled() && isNumberKey(key) ) {

            const numberKeyToIndex = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8 , '0': 9};
            clickCurrentRadioGroupButtonByIndex(numberKeyToIndex[key]);

            if (autosubmit.checked && doAllRadioGroupsHaveAResponse()) {
                submitHit();
            }
        }

        if ( areLettersEnabled() && isBottomRowLetterKey(key) ) {

            const letterKeyToIndex = { 'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6, ',': 7, '.': 8, '/': 9 };
            clickCurrentRadioGroupButtonByIndex(letterKeyToIndex[key]);

            if (autosubmit.checked && doAllRadioGroupsHaveAResponse()) {
                submitHit();
            }
        }
    }
});

window.focus();