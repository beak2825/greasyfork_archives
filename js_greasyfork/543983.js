// ==UserScript==
// @name         volume set per channel
// @namespace    http://tampermonkey.net/
// @version      2025-08-02
// @description  allows you to set different volumes for different twitch channels!
// @author       trevrosa
// @run-at       document-body
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543983/volume%20set%20per%20channel.user.js
// @updateURL https://update.greasyfork.org/scripts/543983/volume%20set%20per%20channel.meta.js
// ==/UserScript==

function log(msg) {
    console.log(`volumeset: ${msg}`)
}

// https://stackoverflow.com/a/61511955
function waitForElem(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';

    async function getChannelName() {
        const page = window.location.pathname;
        // https://twitch.tv(/xdd)
        // ^ one `/`, two split regions
        if (page.split("/").length == 2) {
            return page;
        } else {
            log("in a vod: waiting for channel name");
            const name = (await waitForElem("h1[class*='ScTitleText']")).innerText;
            return `/${name.toLowerCase()}`;
        }
    }

    async function setVolume(slider) {
        if (!slider) {
            log("could not set volume: slider was null, retrying");
            setTimeout(() => { setVolume(document.querySelector("input[type='range']")) }, 1000);
            return;
        }

        const channel = await getChannelName();

        const volume = GM_getValue(channel, null);
        if (!volume) {
            log(`no saved volume for channel '${channel}'`);
            return;
        }

        // change the slider's value to what we want
        slider.value = volume;

        // invoke the react event handler to then change the volume (https://stackoverflow.com/a/77083516)
        const reactHandlerKey = Object.keys(slider).find(key => key.startsWith('__reactProps$')); // changed to reactProps
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'currentTarget', {writable: false, value: slider}); // https://stackoverflow.com/a/49122553
        slider[reactHandlerKey].onChange(changeEvent);

        log(`set the volume to ${volume} (${channel})`)
    }

    let listenerSet = false;

    function setListener(slider) {
        if (!slider) {
            log("could not set listener: slider was null");
            return;
        }

        slider.onchange = async (e) => {
            const volume = parseFloat(e.target.value);
            const channel = await getChannelName();
            GM_setValue(channel, volume)
            log(`${channel} saved to ${volume} volume`);
        }

        log("set volume slider listener");
        listenerSet = true;
    }

    // skip the main page, if we switch to an actual channel, we set the listener then.
    if (window.location.pathname != "/") {
        log("waiting for volume slider")
        waitForElem("input[type='range']").then(async (slider) => {
            await setListener(slider);
            await setVolume(slider);
        });
    }

    let lastPage = window.location.pathname;
    setInterval(async () => {
        const curPage = window.location.pathname;

        // ignore main page
        if (curPage == "/") return;

        if (!listenerSet) {
            const slider = document.querySelector("input[type='range']");
            setListener(slider);
            setVolume(slider);
        }

        if (curPage != lastPage) {
            lastPage = curPage;
            await setVolume(document.querySelector("input[type='range']"));
        }
    }, 500);
})();