// ==UserScript==
// @name        escaperoom-2022
// @namespace   http://tampermonkey.net/
// @version     0.0.9
// @description Controls timer
// @author		GMiclotte
// @include		https://sites.google.com/view/escaperoom202230min
// @include		https://sites.google.com/view/escaperoom202230min/*
// @include		https://sites.google.com/view/escaperoom-202*
// @include		https://sites.google.com/view/escaperoom-202*/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/454539/escaperoom-2022.user.js
// @updateURL https://update.greasyfork.org/scripts/454539/escaperoom-2022.meta.js
// ==/UserScript==

function appendName(t, name) {
    if (t === 0) {
        return "";
    }
    return t + name[0];
}

function msToHms(ms) {
    let seconds = Number(ms / 1000);
    // split seconds in days, hours, minutes and seconds
    let d = Math.floor(seconds / 86400)
    let h = Math.floor(seconds % 86400 / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    // append h/hour/hours etc depending, then concat and return
    return [
        appendName(d, "d"),
        appendName(h, "u"),
        appendName(m, "m"),
        appendName(s, "s"),
    ].filter(x => x.length).join(' ');
}

// default 30 minutes = 30 * 60 * 1000 ms
function setAllowedDuration(ms = 30 * 60 * 1000) {
    localStorage.setItem('duration', ms);
}

function saveStartTime() {
    window.hasDinged = false;
    localStorage.setItem('startTime', Date.now());
}

function getRemainingTime() {
    const currentTime = Date.now();
    const targetTime = Number(localStorage.getItem('startTime')) + Number(localStorage.getItem('duration'));
    return targetTime - currentTime;
}

function ding() {
    // let ding = new Audio("https://www.myinstants.com/media/sounds/za-warudo-the-world-time-stop.mp3");
    let ding = new Audio("https://www.myinstants.com/media/sounds/alarm_clock.mp3");
    ding.volume = 1;
    ding.play();
}

function getFormattedRemainingTime() {
    const remainingTime = getRemainingTime();
    if (remainingTime < 0) {
        if (!window.hasDinged) {
            ding();
            window.hasDinged = true;
        }
        return 'De tijd is om!';
    }
    return msToHms(remainingTime);
}

// after resetMinutes the start time is cleared, if force is true, then the timer is also cleared
function clearStartTime(resetMinutes = 5, force = false) {
    const remainingTime = getRemainingTime();
    if (force || remainingTime < -resetMinutes * 60 * 1000) {
        localStorage.removeItem('startTime');
    }
}

function addButton(parent, idx) {
    const button = document.createElement('button');
    button.id = `countdownButton-${idx}`;
    button.style.textAlign = 'center';
    button.style.fontSize = '60px';
    button.style.marginTop = '0px';
    button.style.marginBottom = '0px';
    button.style.display = 'none';
    button.textContent = 'Start!';
    button.onclick = saveStartTime;
    parent.appendChild(button);
    return button;
}

function addTimer(parent, idx) {
    const timer = document.createElement('p');
    timer.id = `countdownTimer-${idx}`;
    timer.style.textAlign = 'center';
    timer.style.fontSize = '60px';
    timer.style.marginTop = '0px';
    timer.style.marginBottom = '0px';
    timer.style.display = 'none';
    timer.textContent = '';
    parent.appendChild(timer);
    return timer;
}

function updateTimer() {
    // check if we need to clear the start time
    clearStartTime();
    // get the start time
    const startTime = localStorage.getItem('startTime');
    if (startTime === null) {
        // start time is not yet set, show the start button
        window.countdownTimers.forEach(x => {
            x.button.style.display = 'block';
            x.timer.style.display = 'none';
        });
        return;
    }
    // start time is set, show the countdown
    window.countdownTimers.forEach(x => {
        x.button.style.display = 'none';
        x.timer.style.display = 'block';
        x.timer.textContent = getFormattedRemainingTime();
    });
}

function cleanup() {
    clearInterval(window.countdownTimer);
    window.countdownTimers.forEach(x => {
        x.button.remove();
        x.timer.remove();
    });
    window.countdownTimers = [];
    clearStartTime(0, true);
}

function init() {
    console.log('initializing escape room countdown timer')
    let parents = document.getElementsByTagName('iframe');
    if (parents.length === 0) {
        setTimeout(init, 100);
        return;
    }
    let maxParents = 2;
    let idx = 0;
    const countdownTimers = [];
    for (let parent of parents) {
        parent = parent.parentElement.parentElement;
        parent.children[0].remove();
        parent.style.display = 'flex';
        parent.style.justifyContent = 'center';
        parent.style.alignItems = 'center';
        setAllowedDuration(30 * 60 * 1000);
        const button = addButton(parent, idx);
        const timer = addTimer(parent, idx);
        countdownTimers.push({button: button, timer: timer})
        idx++;
        // only overwrite first maxParents iframes
        if (idx >= maxParents) {
            break;
        }
    }
    window.countdownTimers = countdownTimers;
    window.countdownTimer = setInterval(updateTimer, 250);
}

init();

window.cleanup = cleanup;
window.init = init;