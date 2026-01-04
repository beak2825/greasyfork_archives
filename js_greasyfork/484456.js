// ==UserScript==
// @name         AutoRefresher
// @description  Auto Refresh Page
// @version      0.2
// @author       BovBrew
// @license      MIT
// @namespace    BovBrew
// @icon         https://ptpimg.me/1jo58l.png
// @match        http*://oldtoons.world/*
// @match        http*://www.cathode-ray.tube/*
// @match        http*://passthepopcorn.me/*
// @match        http*://broadcasthe.net/*
// @match        http*://blutopia.cc/*
// @match        http*://www.morethantv.me/*
// @match        http*://aither.cc/*
// @match        http*://anthelion.me/*
// @match        http*://nebulance.io/*
// @match        http*://privatehd.to/*
// @match        http*://cinemaz.to/*
// @match        http*://reelflix.xyz/*
// @match        http*://www.torrentleech.org/*
// @match        http*://filelist.io/*
// @match        http*://alpharatio.cc/*
// @match        http*://speedapp.io/*
// @match        http*://www.thesceneplace.com/*
// @match        http*://onlyencodes.cc/*
// @match        http*://animebytes.tv/*
// @match        http*://animetorrents.me/*
// @match        http*://www.myanonamouse.net/*
// @match        http*://orpheus.network/*
// @match        http*://redacted.ch/*
// @match        http*://gazellegames.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484456/AutoRefresher.user.js
// @updateURL https://update.greasyfork.org/scripts/484456/AutoRefresher.meta.js
// ==/UserScript==
const showCountdown = true;

const hash          = window.location.hash;
const host          = window.location.host;
const hostname      = window.location.hostname;
const href          = window.location.href;
const origin        = window.location.origin;
const pathname      = window.location.pathname;
const port          = window.location.port;
const protocol      = window.location.protocol;
const siteKey       = `${host}_AutoRefresh`;
const rapidTimerKey = `${siteKey}_RapidTimer`;
const savedSettings = getSavedSettings(siteKey);

console.log(`hash: ${hash}`);
console.log(`host: ${host}`);
console.log(`hostname: ${hostname}`);
console.log(`href: ${href}`);
console.log(`origin: ${origin}`);
console.log(`pathname: ${pathname}`);
console.log(`port: ${port}`);
console.log(`protocol: ${protocol}`);
console.log(`siteKey: ${siteKey}`);

var excluded_hash     = [];
var excluded_host     = [];
var excluded_hostname = [];
var excluded_href     = ['https://oldtoons.world/shoutbox.php?type=shoutbox'];
var excluded_origin   = [];
var excluded_pathname = [];
var excluded_port     = [];
var excluded_protocol = [];

/* checkPart true: Use if part of a URLs are included in excluded_href.
                   Example on a forum page : https://passthepopcorn.me/forums.php?action=viewthread&threadid=25848&page=1108#post2284506 the page number and post number can change so you can
                   add just 'https://passthepopcorn.me/forums.php?action=viewthread&threadid=25848' to excluded_href and set this to 'true'
            false: Will only check for exact URL matches in excluded_href */
var checkPart         = false;
var partialCheck      = checkPart ? checkPartial(excluded_href,href) : false;
function checkPartial (arraytoCheck,value){
    const isExcluded = arraytoCheck.some(excludedUrl => value.includes(excludedUrl));
    return isExcluded;
};

var rapidMode = false;
var min, max, refreshTime, countdownInterval;

if (!excluded_hash.includes(hash)         && !excluded_host.includes(host)         &&
    !excluded_hostname.includes(hostname) && !excluded_href.includes(href)         &&
    !partialCheck                         && !excluded_origin.includes(origin)     &&
    !excluded_pathname.includes(pathname) && !excluded_port.includes(port)         &&
    !excluded_protocol.includes(protocol)) {

    rapidMode ? (min = 5, max = 10, rapidModeTimer(rapidTimerKey,'Check')) : (min = 3000, max = 4200);
    if (host === 'passthepopcorn.me' && document.getElementById('vignette')) (min = 30, max = 90);
    refreshTime = Math.floor(Math.random() * (max - min + 1)) + min;
    createToggleSwitch();
    if (savedSettings) showCountdownBar(refreshTime);

} else {
    console.log('Current Page on Excluded Array. Script will now exit...');
};

function refreshPage(){
    window.location.reload(true);
};

function resetKey(key){
    if (window.localStorage.getItem(key)) window.localStorage.removeItem(key);
};

function checkKey(key){
    if (window.localStorage.getItem(key)) return true;
    return false;
};

function showCountdownBar(timeInSeconds){
    setTimeout(() => {
        clearInterval(countdownInterval);
        document.body.removeChild(countdownBar);
        refreshPage();
    }, timeInSeconds * 1000);

    const targetTime = Date.now() + timeInSeconds * 1000;

    const countdownBar = document.createElement('div');
    countdownBar.id = 'countdownBar';
    countdownBar.classList.add('refresh-all-countdown-bar');
    var refreshBarWidth = host === 'passthepopcorn.me' ? '1013px' : '100%';
    var countdownBarElement = document.getElementById('countdownBar');

    var countdownBarCSS = `.refresh-all-countdown-bar {
                                position: fixed;
                                top: 0px;
                                width: ${refreshBarWidth};
                                background-color: rgba(0, 0, 0, 0.3);
                                color: white;
                                text-align: center;
                                padding: 15px;
                                font-family: Courier New;
                                z-index: 9999;
                                pointer-events: none;
                            }`;
    var countdownBarStyleSheet = document.createElement("style");
        countdownBarStyleSheet.innerText = countdownBarCSS;
    document.head.appendChild(countdownBarStyleSheet);
    if (!countdownBarElement && showCountdown) document.body.appendChild(countdownBar);

    const updateCountdown = () => {
        const remainingTime = getRemainingTime();
        const minutes       = Math.floor(remainingTime / 60);
        const seconds       = remainingTime % 60;
        const displayText   = `Page will refresh in ${minutes}min ${seconds}sec`;
        const rapidModeText = `!RAPID MODE ACTIVATED! Page will refresh in ${seconds}sec`;
        rapidMode ? countdownBar.textContent = rapidModeText : countdownBar.textContent = displayText;
    };

    const getRemainingTime = () => {
        const currentTime   = Date.now();
        const remainingTime = Math.max(0, Math.floor((targetTime - currentTime) / 1000));
        return remainingTime;
    };

    updateCountdown();

    countdownInterval = setInterval(updateCountdown, 1000);

    document.addEventListener("visibilitychange", function () {
        document.hidden ? clearInterval(countdownInterval) : countdownInterval = setInterval(updateCountdown, 1000);
    });
};

function rapidModeTimer(key, mode){
    const nowTime = new Date();
    if(mode === 'Activate')activateRapidTimer();
    if(mode === 'Deactivate')deactivateRapidTimer();
    if(mode === 'Check')checkRapidTimer();

    function activateRapidTimer(){
        resetKey(key);
        localStorage.setItem(key, nowTime.toString());
    };

    function deactivateRapidTimer(){
        resetKey(key);
        document.getElementById('rapidModeToggle').checked = false;
        updateSettings('rapidMode', false);
    };

    function checkRapidTimer(){
        if(checkKey(key)){
            const activatedTime = localStorage.getItem(key);
            const lastActivated = new Date(activatedTime);
            const timeDifference = (nowTime - lastActivated) / (1000 * 60);
            if (timeDifference >= 10) {
                console.log('Rapid Mode has been active for 10mins and will now Deactivate.');
                deactivateRapidTimer();
            };
        }else{deactivateRapidTimer();};
    };
};

function getSavedSettings(key){
    var savedStatus = checkKey(key) ? JSON.parse(window.localStorage.getItem(key)) : false;
    return savedStatus;
};

async function createToggleSwitch(){
    var toggleSwitchCSS = `
    .refresh-all-toggle-container {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 9999;
    }

    .refresh-all-switch {
        position: relative;
        display: inline-block;
        width: 30px;
        height: 17px;
    }

    .refresh-all-switch input {
        display: none;
    }

    .refresh-all-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 17px;
    }

    .refresh-all-slider:before {
        position: absolute;
        content: "";
        height: 13px;
        width: 13px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .refresh-all-slider {
        background-color: #FF6600;
    }

    input:checked + .refresh-all-slider:before {
        transform: translateX(13px);
    }`;
    var toggleSwitchStyleSheet = document.createElement("style");
    toggleSwitchStyleSheet.innerText = toggleSwitchCSS;
    document.head.appendChild(toggleSwitchStyleSheet);

    var toggleContainer = document.createElement('div');
    toggleContainer.classList.add('refresh-all-toggle-container');
    toggleContainer.style.position = 'absolute';
    toggleContainer.style.top = '20px';
    toggleContainer.style.left = '20px';
    document.body.appendChild(toggleContainer);

    var toggleLabel = document.createElement('label');
    toggleLabel.classList.add('refresh-all-switch');

    var toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'toggleSwitch';

    var toggleSlider = document.createElement('span');
    toggleSlider.classList.add('refresh-all-slider');

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
    toggleContainer.appendChild(toggleLabel);

    toggleInput.addEventListener('change', function () {
        var isChecked = toggleInput.checked;
        window.localStorage.setItem(siteKey, isChecked);
        if(isChecked) showCountdownBar(refreshTime);
        console.log('Toggle Switch Switched ' + (isChecked ? 'ON' : 'OFF'));
    });

    toggleInput.checked = savedSettings;

};