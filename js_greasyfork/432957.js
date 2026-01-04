// ==UserScript==
// @name         Discord Video Cycle
// @version      0.1
// @description  Cycles through Discord video streams
// @author       Cory Sanin
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhQABAAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAABAAEAAAAL/lI+py+0Po5y02ouz3rz7D4biSJbmOQYqpQao0cZsvIr0Ld20p+twD8RpgrsD8Zg5yhJK4KVZU0B9lSZkupxYI7ttjqjNCpDfYLklBXPVDiqT3YYbEc60+SH//e7veoNMh2Xnt5CHhdbXE0c4dohoxDeoGOjoQskIiVkZlTkpKdRZmeh26bm3OUp6atq4aRmq2sroyinLaqtK+7oaC8h7mAr6KzzsBUtqjDsVjKzEnGycrOz8XFRMPB15bZ2N3e0NVZr3/SgeKfgJvnysnboYjT4UT357tr7dfiXKDupdaC0Nnhhx5mLxU1cvHB5fGKjZ8zcD08NaSQxW4SZvIAeKEvJeePwIMqTIkSRLmjyJMmWJAgA7
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      Unlicense
// @namespace https://greasyfork.org/users/183103
// @downloadURL https://update.greasyfork.org/scripts/432957/Discord%20Video%20Cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/432957/Discord%20Video%20Cycle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VIDEOICONSELECTOR = '.titleIcon-2eloVh';
    const VIDEOTITLESELECTOR = '.container-x-SnoF';
    const APPMOUNTSELECTOR = '#app-mount';
    let videoTargets = [];
    let videoTitleElement = null;
    let index = 0;

    function getVideoTargets() {
        videoTargets = Array.prototype.slice.call(document.querySelectorAll(VIDEOICONSELECTOR)).map(e => e.parentElement.parentElement.parentElement);
    }

    function removeChildElements(e) {
        while(e.firstChild) {
            e.removeChild(e.lastChild);
        }
    }

    function selectNext() {
        getVideoTargets();
        if(videoTargets.length > 1){
            index = (index + 1) % videoTargets.length;
            videoTargets[index].click();
            setVideoTitle();
        }
    }

    function setVideoTitle(title = document.querySelector(VIDEOTITLESELECTOR).innerText) {
        if(videoTitleElement == null){
            videoTitleElement = document.createElement('div');
            videoTitleElement.id = 'dvc-title';
            videoTitleElement.style.position = 'fixed';
            videoTitleElement.style.color = '#fff';
            videoTitleElement.style.fontSize = '46pt';
            videoTitleElement.style.top = videoTitleElement.style.left = '0.1em';
            videoTitleElement.style['z-index'] = 999;
            document.querySelector(APPMOUNTSELECTOR).appendChild(videoTitleElement);
        }
        removeChildElements(videoTitleElement);
        videoTitleElement.appendChild(document.createTextNode(title));
    }

    function registerMenuCommand() {
        let mcid = GM_registerMenuCommand('Cycle Through Video', () => {
            let intervalId = setInterval(selectNext, 10000);
            GM_unregisterMenuCommand(mcid);
            mcid = GM_registerMenuCommand('Stop Cycle', () => {
                removeChildElements(videoTitleElement);
                clearInterval(intervalId);
                GM_unregisterMenuCommand(mcid);
                registerMenuCommand();
            });
            getVideoTargets();
            setVideoTitle();
        });
    };

    registerMenuCommand();
})();