// ==UserScript==
// @name         Shorts remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a checkbox to remove YouTube shorts from the sub page.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467441/Shorts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/467441/Shorts%20remover.meta.js
// ==/UserScript==

const titleContainerTarget = '#content #title-container';
const videoTarget = 'ytd-grid-video-renderer';
const cookieName = 'SHORTSVISIBLE2534';
let shortsVisible, checkboxInput;

(async function() {
    'use strict';

    const titleContainer = await waitForElm(titleContainerTarget);
    if (!titleContainer) return;

    shortsVisible = getCookie(cookieName) === 'true';
    if (shortsVisible === '') {
        shortsVisible = true;
    }

    const shortsSwitch = document.createElement('div');
    checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.addEventListener('change', function() {
        checkBoxChange(this.checked);
    });

    checkBoxChange(shortsVisible);

    shortsSwitch.appendChild(checkboxInput);
    titleContainer.appendChild(shortsSwitch);
})();

function checkBoxChange(checked) {
    shortsVisible = checked;
    setCheckbox(shortsVisible);

    if (checked) {
        showShorts();
    } else {
        startHideShorts();
    }

    setCookie(cookieName, shortsVisible, 999);
}

async function startHideShorts() {
    if (shortsVisible) return;

    hideShorts();
    await timeout(3000);
    startHideShorts();
}

function hideShorts() {
    const videoElements = document.querySelectorAll(videoTarget);
    videoElements.forEach((videoElement) => {
        const thumbnailLink = videoElement.querySelector('#thumbnail');
        if (thumbnailLink && thumbnailLink.href.startsWith('https://www.youtube.com/shorts')) {
            videoElement.style.display = 'none';
        }
    });
}

function showShorts() {
    const videoElements = document.querySelectorAll(videoTarget);
    videoElements.forEach((videoElement) => {
        if (videoElement.style.display === 'none') {
            videoElement.style.display = '';
        }
    });
}

const setCheckbox = (value) => {
    checkboxInput.checked = value;
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
        } else {
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}