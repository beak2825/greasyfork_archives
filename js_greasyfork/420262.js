// // ==UserScript==
// @name         WME Reminders
// @namespace    WazeDev
// @version      2021.01.15.001
// @description  Create reminders in the Waze Map Editor.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420262/WME%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/420262/WME%20Reminders.meta.js
// ==/UserScript==

/* global WazeWrap */
/* global $ */
/* global GM_info */

const SCRIPT_NAME = GM_info.script.name;
const SCRIPT_VERSION = GM_info.script.version;
const TAB_BUTTON_TEXT = 'Reminders';
const ALARM_NAME_PLACEHOLDER = '-- alarm name here --';
const SETTINGS_STORE_NAME = 'wmeReminders';
const DEFAULT_ALARM_NAME = 'This is your alarm.';

let _settings = {};
let _alarmTimeInput;
let _alarmNameInput;
let _tabButton;
let _timer;

function checkSettings(obj, defaultObj) {
    Object.keys(defaultObj).forEach(key => {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = defaultObj[key];
        } else if (defaultObj[key] && (defaultObj[key].constructor === {}.constructor)) {
            checkSettings(obj[key], defaultObj[key]);
        }
    });
}

function loadSettings() {
    const loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
    const defaultSettings = {
        alarmTime: null,
        alarmName: null
    };
    if (loadedSettings) {
        _settings = loadedSettings;
        checkSettings(_settings, defaultSettings);
    } else {
        _settings = defaultSettings;
    }
}

function saveSettings() {
    if (localStorage) {
        _settings.alarmTime = _alarmTimeInput.val();
        _settings.alarmName = _alarmNameInput.val();
        localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(_settings));
    }
}

function onTimeElapsed() {
    let alarmName = _alarmNameInput.val().trim();
    if (!alarmName.length) {
        alarmName = DEFAULT_ALARM_NAME;
    }
    WazeWrap.Alerts.info(SCRIPT_NAME, alarmName, true, false);
    resetAlarm();
}


function killTimer() {
    if (_timer) clearTimeout(_timer);
}

function getTimeParts(timeStr) {
    const match = /(\d+):(\d+)/.exec(timeStr);
    if (match) {
        const [, hr, min] = match;
        return { hr, min };
    }
    return null;
}

function getNewAlarmOffsetMs(timeParts) {
    const dtNow = new Date();
    const dtNew = dtNow.clone();
    dtNew.setHours(timeParts.hr, timeParts.min, 0, 0);
    if (dtNew < dtNow) {
        dtNew.addDays(1);
    }
    return dtNew - dtNow;
}

function resetAlarm() {
    killTimer();
    const timeParts = getTimeParts(_alarmTimeInput.val());
    if (timeParts) {
        const alarmTimeOffset = getNewAlarmOffsetMs(timeParts);
        _timer = setTimeout(onTimeElapsed, alarmTimeOffset);
    }
}

function onAlarmTimeInputChanged() {
    saveSettings();
    resetAlarm();
}

function onAlarmNameInputChanged() {
    saveSettings();
}

function initTabButton() {
    _tabButton = $(`a[href="#sidepanel-${TAB_BUTTON_TEXT.toLowerCase()}"]`);
    _tabButton.empty();
    _tabButton.append('<span class="fa fa-bell">');
    _tabButton.attr('title', SCRIPT_NAME);
}

function initAlarmTimeInput() {
    _alarmTimeInput = $('#wmeRemindersAlarmTime');
    _alarmTimeInput.val(_settings.alarmTime);
    _alarmTimeInput.change(onAlarmTimeInputChanged);
    resetAlarm();
}

function initAlarmNameInput() {
    _alarmNameInput = $('#wmeRemindersAlarmName');
    _alarmNameInput.change(onAlarmNameInputChanged);
    _alarmNameInput.val(_settings.alarmName);
}

function initTab() {
    initTabButton();
    initAlarmTimeInput();
    initAlarmNameInput();
}

function addTab() {
    const $content = $('<div>').append(
        $('<span>', { style: 'font-size:14px; font-weight:600' }).text(SCRIPT_NAME),
        $('<span>', { style: 'font-size:11px;margin-left:10px;color:#aaa;' }).text(SCRIPT_VERSION),
        $('<div>', { style: 'padding-top:4px;' }).append(
            $('<div>').append($('<span>').text('Alarm:')),
            $('<input>', { id: 'wmeRemindersAlarmTime', type: 'time' }),
            $('<input>', { id: 'wmeRemindersAlarmName', type: 'text', placeholder: ALARM_NAME_PLACEHOLDER })
        )
    );
    new WazeWrap.Interface.Tab(TAB_BUTTON_TEXT, $content.html(), initTab);
}

function init() {
    loadSettings();
    addTab();
}

function bootstrap() {
    if (WazeWrap.Ready) {
        init();
    } else {
        setTimeout(bootstrap, 250);
    }
}

bootstrap();
