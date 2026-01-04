// ==UserScript==
// @name         CF Contest Information Viewer
// @namespace    https://twitter.com/kymn_
// @version      0.1
// @description  Add information about the contest, such as contest times, to the sidebar.
// @author       keymoon
// @match        https://codeforces.com/contest/*
// @match        https://codeforces.com/gym/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414043/CF%20Contest%20Information%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/414043/CF%20Contest%20Information%20Viewer.meta.js
// ==/UserScript==

//#region LS
function getLSCache(key, defaultObj){
    const str = localStorage.getItem(key);
    return !str ? defaultObj : JSON.parse(str);
}

function setLSCache(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
}
//#endregion

//#region settings
const settingsCacheKey = "__cfciv_settings";

const dataKeys = 
[
    'id',
    'name',
    'type',
    'phase',
    'frozen',
    'durationSeconds',
    'startTimeSeconds',
    'relativeTimeSeconds',
    'preparedBy',
    'websiteUrl',
    'description',
    'difficulty',
    'kind',
    'icpcRegion',
    'country',
    'city',
    'season'
];

const defaultSettings = 
{
    id: true,
    name: false,
    type: false,
    phase: false,
    frozen: false,
    durationSeconds: true,
    startTimeSeconds: false,
    relativeTimeSeconds: false,
    preparedBy: false,
    websiteUrl: false,
    description: false,
    difficulty: false,
    kind: false,
    icpcRegion: false,
    country: false,
    city: false,
    season: false
};

const shouldTrue = 
{
    id: true,
    name: false,
    type: false,
    phase: false,
    frozen: false,
    durationSeconds: false,
    startTimeSeconds: false,
    relativeTimeSeconds: false,
    preparedBy: false,
    websiteUrl: false,
    description: false,
    difficulty: false,
    kind: false,
    icpcRegion: false,
    country: false,
    city: false,
    season: false
};

function validateSettings(settings){
    for (const key of dataKeys){
        if (!settings.hasOwnProperty(key)) return false;
        if (shouldTrue[key] && !settings[key]) return false;
    }
    return true;
}

function getSettings(){
    return getLSCache(settingsCacheKey, defaultSettings);
}

function setSettings(settings){
    if (!validateSettings(settings)) throw new Error("invalid settings");
    setLSCache(settingsCacheKey, settings);
}
//#endregion

//#region contests
const contestsCacheKey = "__cfciv_contests";

function formatContestsData(data){
    const settings = getSettings();
    for (const item of data){
        for (const key of dataKeys){
            if (!settings[key] && item.hasOwnProperty(key)) delete item[key];
        }
    }
    return data;
}

function fetchContestsAsync(){
    const contestApiURL = "https://codeforces.com/api/contest.list?gym=false";
    const gymApiURL = "https://codeforces.com/api/contest.list?gym=true";
    function _fetchContestsAsync(url){
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.onload = () => {
                if (req.status >= 400) reject("can't fetch data : status code is ${req.status}");
                const obj = JSON.parse(req.responseText);
                if (obj.status != "OK") reject(`api status is ${obj.status}`);
                resolve(obj.result);
            };
            req.onerror = () => {
                reject("can't fetch data : Error connecting to server.");
            };
            req.send();
        });
    }
    return Promise.all([_fetchContestsAsync(contestApiURL), _fetchContestsAsync(gymApiURL)]).then((values) => {
        return values[0].concat(values[1]);
    });
}

async function getContestsAsync(){
    let data = getLSCache(contestsCacheKey, undefined);
    if (!data) {
        await refreshContestsAsync();
        data = getLSCache(contestsCacheKey, undefined);
        if (!data) throw new Error("refresh failed");
    }
    formatContestsData(data);
    return data;
}

function setContests(data){
    formatContestsData(data);
    setLSCache(contestsCacheKey, data);
}

async function refreshContestsAsync(){
    setContests(await fetchContestsAsync());
}
//#endregion

//#region ui
function defaultParser(data){
    return data.toString();
}

function durationParser(sec){
    const grans = [60, 60, 24];
    const unit = ["sec(s)", "min(s)", "hour(s)", "day(s)"];
    const resarr = [sec];
    for (const gran of grans){
        var elem = resarr.pop();
        resarr.push(elem % gran);
        resarr.push(Math.floor(elem / gran));
    }
    let res = "";
    for (let i = 0; i < unit.length; i++){
        if (resarr[i] == 0) continue;
        res = `${resarr[i]} ${unit[i]},` + res;
    }
    if (res == "") res = "0 sec(s),";
    return res.substr(0, res.length - 1);
}

function dateParser(sec){
    var date = new Date(sec * 1000);
    return date.toLocaleString();
}

const parsers = 
{
    id: defaultParser,
    name: defaultParser,
    type: defaultParser,
    phase: defaultParser,
    frozen: defaultParser,
    durationSeconds: durationParser,
    startTimeSeconds: dateParser,
    relativeTimeSeconds: durationParser,
    preparedBy: defaultParser,
    websiteUrl: defaultParser,
    description: defaultParser,
    difficulty: defaultParser,
    kind: defaultParser,
    icpcRegion: defaultParser,
    country: defaultParser,
    city: defaultParser,
    season: defaultParser
};

const names = 
{
    id: "id",
    name: "name",
    type: "type",
    phase: "phase",
    frozen: "frozen",
    durationSeconds: "duration",
    startTimeSeconds: "startTime",
    relativeTimeSeconds: "relativeTime",
    preparedBy: "preparedBy",
    websiteUrl: "websiteUrl",
    description: "description",
    difficulty: "difficulty",
    kind: "kind",
    icpcRegion: "icpcRegion",
    country: "country",
    city: "city",
    season: "season"
};

// since there is no user input, we can use rough escape
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

const divid = 'cfciv_elem';
function addElement(contest){
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const div = `<div id="${divid}" class="roundbox sidebox sidebar-menu" style=""></div>`
    sidebar.insertAdjacentHTML('beforeend', div);
    updateElement(contest);
}

async function applySettingsAsync(settings){
    setSettings(settings);
    await refreshContestsAsync();
    const currentContest = await getCurrentContestAsync();
    updateElement(currentContest);
}

function updateElement(contest){
    function getInfoRow(key, value){
        const name = names[key];
        const parsedval = parsers[key](value);
        return `<li><span>${escapeHTML(name)} : ${escapeHTML(parsedval)}</span><span style="float: right;"></span><div style="clear: both;"></div></li>`;
    }

    const checkboxIDPrefix = "cfciv_settings_checkbox_"
    function getSettingRow(key, state){
        const name = names[key];
        return (
`<div>
    <input id="${checkboxIDPrefix}${key}" type="checkbox" name="${key}" ${state ? "checked" : ""} ${shouldTrue[key] ? "disabled" : ""}>
    <label for="${key}">${name}</label>
</div>`
);
    }

    const div = document.getElementById(divid);
    if (!div) return;

    const infolist = [];
    for (const key in contest){
        infolist.push(getInfoRow(key, contest[key]));
    }

    const settinglist = [];
    const setting = getSettings();
    for (const key in setting){
        settinglist.push(getSettingRow(key, setting[key]));
    }

    const applyButtonID = 'cfciv_settings_applybtn';
    const innerhtml = 
`<div class="roundbox-lt">&nbsp;</div>
<div class="roundbox-rt">&nbsp;</div>
<div class="caption titled">→ Contest Information</div>
<ul>${infolist.join('')}</ul>
<details style="margin:1em;">
    <summary>Settings</summary>
    <div style="margin:1em;font-size:0.8em;">
    You can choose which information to display. Some information may not be present in all contests.<br>
    Click the apply button when you are done with your settings. It may take some time to reload the information.
    </div>
    <div style="margin:0.5em 1em;">
        ${settinglist.join('')}
        <button id=${applyButtonID} style="margin:0.5em">apply</button>
    </div>
</details>`; 

    div.innerHTML = innerhtml;

    const elem = document.getElementById(applyButtonID);
    elem.onclick = async () => {
        const settings = getSettings();
        for (const key in settings){
            const elem = document.getElementById(checkboxIDPrefix + key);
            settings[key] = elem.checked;
            document.getElementById(checkboxIDPrefix + key).disabled = true;
        }
        applySettingsAsync(settings);
    };
}
//#endregion

//#region util
function getContestID(){
    return parseInt(document.location.href.split('/')[4]);
}

async function getCurrentContestAsync(){
    const contestID = getContestID();
    const contests = await getContestsAsync();
    const contest = contests.filter(x => x.id == contestID)[0];
    return contest;
}
//#endregion

(async function() {
    'use strict';
    let contest = await getCurrentContestAsync();
    if (!contest){
        await refreshContestsAsync();
        contest = await getCurrentContestAsync();
        if (!contest) throw new Error("can't find contest information");
    }
    addElement(contest);
})();
