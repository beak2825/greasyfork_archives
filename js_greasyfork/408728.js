// ==UserScript==
// @name         Youtube keyboard shortcuts
// @namespace    https://greasyfork.org/en/users/674736-jatin-sharma
// @version      0.3
// @description  Add keyboard shortcuts for Youtube
// @author       Jatin Sharma (jatin.earth+greasyfork@gmail.com)
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// jshint        esversion:6
// @downloadURL https://update.greasyfork.org/scripts/408728/Youtube%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/408728/Youtube%20keyboard%20shortcuts.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let firstTime = true;

    function clickSettingsButton() {
        document.querySelector('.ytp-settings-button').click();
//        console.log('Settings button clicked');
    }

    function toggleSettingsPanel() {
        let isQualityPanelOpen = document.querySelector('.ytp-quality-menu') !== null;
        if (isQualityPanelOpen) {
            clickSettingsButton();
            setTimeout(clickSettingsButton, 100);
        } else {
            clickSettingsButton();
        }
    }

    function toggleQualitySettingsPanel() {
        if (firstTime) {
            clickSettingsButton();
            clickSettingsButton();
            firstTime = false;
        }
        let isSettingsPanelOpen = document.querySelector('.ytp-settings-menu').style.display !== 'none';
        let isQualityPanelOpen = document.querySelector('.ytp-quality-menu') !== null;
        if (!isQualityPanelOpen) {
            if(isSettingsPanelOpen) clickSettingsButton();
            document.querySelector('.ytp-panel').lastChild.lastElementChild.click();
        }
//        if (isSettingsPanelOpen) clickSettingsButton();
        clickSettingsButton();
    }

    window.addEventListener('load', (event) => {
        console.log('Window loaded');
        document.addEventListener('keydown', (e) => {
            let t = e.target;
            if (t.matches('div[contenteditable="true"') || (t.matches('input') && t.type === 'text')) {
                return;
            }
            if (!e.repeat) {
                if (e.key === 'q') toggleQualitySettingsPanel();
                else if (e.key === 's') toggleSettingsPanel();
            }
        });
        console.log('Shortcut keys registered');
    });
})();