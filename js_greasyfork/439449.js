// ==UserScript==
// @name         YT - Fuck Watched Videos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script will look in your recommended feed for videos with a full red bar, which shows you've watched them already, and then go through the 10 clicks needed to tell YT to stop showing you videos you've already watched.
// @author       BloodyRain2k
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439449/YT%20-%20Fuck%20Watched%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/439449/YT%20-%20Fuck%20Watched%20Videos.meta.js
// ==/UserScript==

function xpEval(find, root) { var result = []; var elems = document.evaluate(find, root || document, null, XPathResult.ANY_TYPE, null);
    while (!elems.invalidIteratorState) { var elem = elems.iterateNext(); if (elem == null) { break; } result.push(elem); } return result; }
function qsa(selector, root) { if (selector.startsWith("/")) { return xpEval(selector, root); } return (root || document).querySelectorAll(selector); }
function qs(selector, root) { return qsa(selector, root)[0]; }
function wait(func, time = 100) { window.setTimeout(func, time); }

function setLocalObject(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getLocalObject(key) { var str = localStorage.getItem(key); return str ? function() { try { return JSON.parse(str); } catch (e) { return undefined; } }() : undefined; }

function getHttp(obj) {
	var http = new XMLHttpRequest();
    http.open(obj.method || "GET", obj.url);
    for (let hName in (obj.headers || {})) { http.setRequestHeader(hName, obj.headers[hName]); }
    if (obj.onload) { http.onload = (http) => { obj.onload(http); } }
    if (obj.onerror) { http.onerror = (http) => { obj.onerror(http); } }
	http.send(obj.data);
}

function toHash(str) {
    let hash = 0; str = str.toString();
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    } return hash;
}

// variables

let wlh = window.location.href;
let watched;
let notInterested;

// functions

function check() {
    if (notInterested != null) {
        findVideo();
    }
    else {
        window.setTimeout(check, 500);
    }
}

function findVideo(debug = false) {
    watched = xpEval("//ytd-thumbnail-overlay-resume-playback-renderer[div[@id='progress'][contains(@style,'width: 100%')]]/ancestor-or-self::div[@id='dismissible'][not(.//span[text()='LIVE NOW'] | @hidden)]")[0];
    if (watched != null) {
        console.log("Video:", watched, watched.hidden);
        if (!debug) {
            openMenu();
        }
    }
    else {
        wait(findVideo, 500);
    }
}

function openMenu() {
    // console.log("Node:", watched);
    let btn = qs("button.yt-icon-button", watched);
    if (btn == null) {
        wait(openMenu);
    }
    else {
        btn.click();
        waitForMenu();
    }
}

function isMenuOpen() {
    let result = qs("div#contentWrapper") != null;
    if (result) {
        notInterested = xpEval("//div[@id='contentWrapper']//yt-formatted-string[contains(text(), 'Not interested')]")[0];
        // console.log(notInterested);
    }
    return result;
}

function waitForMenu() {
    if (isMenuOpen() && notInterested != null) {
        notInterested.click();
        wait(clickTell);
    }
    else {
        wait(waitForMenu);
    }
}

function clickTell() {
    let tell = xpEval("//tp-yt-paper-button//yt-formatted-string[contains(text(), ' us why')]")[0];
    if (tell != null) {
        tell.click();
        wait(clickCheckbox);
    }
    else {
        wait(clickTell);
    }
}

function clickCheckbox() {
    let check = xpEval("//tp-yt-paper-checkbox//yt-formatted-string[contains(text(), ' already watched the video')]")[0];
    // console.log(check);
    if (check != null) {
        check.click();
        wait(clickSubmit);
    }
    else {
        wait(clickCheckbox);
    }
}

function clickSubmit() {
    let submit = xpEval("//div[@id='buttons']/ytd-button-renderer[@id='submit']")[0];
    if (submit != null) {
        submit.click();
        watched.hidden = true;
        findVideo();
    }
    else {
        wait(clickSubmit);
    }
}

// execution

wait(findVideo, 500);
