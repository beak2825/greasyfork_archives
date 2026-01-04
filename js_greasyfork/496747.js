// ==UserScript==
// @name         Get Youtube current Seconds
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Hold ctrl and click(or just click) on the title to get Youtube's current seconds in the clipboard.
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @author       fengxxc
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/496747/Get%20Youtube%20current%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/496747/Get%20Youtube%20current%20Seconds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        requireCtrl: false
    };

    function getConfig() {
        return GM_getValue('config', defaultConfig);
    }

    function saveConfig(config) {
        GM_setValue('config', config);
    }

    function toggleCtrlClickRequirement() {
        const config = getConfig();
        config.requireCtrl = !config.requireCtrl;
        saveConfig(config);
        registerMenuCommand();
        console.log(config.requireCtrl ? 'Ctrl + click enabled' : 'Ctrl + click disabled');
    }

    let menuCommandId;

    function registerMenuCommand() {
        if (menuCommandId) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        const config = getConfig();
        const menuText = config.requireCtrl
        ? 'Toggle Ctrl+click (enabled)'
        : 'Toggle Ctrl+click (disabled)';
        menuCommandId = GM_registerMenuCommand(menuText, toggleCtrlClickRequirement);
    }

    function getSeconds(timestamp) {
        const sp = timestamp.split(":").map(Number);
        let seconds = 0;
        for (let i = 0; i < sp.length; i++) {
            seconds += sp[i] * (60 ** (sp.length - i - 1));
        }
        return seconds;
    }

    let btn = null;
    let intervalId = setInterval(() => {
        if (btn != null) {
            clearInterval(intervalId);
            btn.onclick = () => {
                const config = getConfig();
                if ( (!config.requireCtrl && !event.ctrlKey) // click
                    || (config.requireCtrl && event.ctrlKey)){ // ctrl + click
                    const currenttime = document.querySelector('.ytp-time-current').innerText;
                    const currentSeconds = getSeconds(currenttime);
                    const url = `${window.location.href}&t=${currentSeconds}s`;
                    console.log(`Now Play: ${currenttime}, seconds: ${currentSeconds}, url: ${url}`);
                    navigator.clipboard.writeText(url).then(() => {
                        console.log('url copied to clipboard');
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            }
        }
        btn = document.querySelector('#above-the-fold > #title');
    }, 60)

    registerMenuCommand();

})();