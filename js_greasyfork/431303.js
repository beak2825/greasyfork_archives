// ==UserScript==
// @name         MondjadMarGeci
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Useful when you don't want to spend 30 minutes listening to 20+ voice messages in your group chat on 1x playback rate
// @author       Levente Kovacs
// @include      https://*messenger.com/*
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431303/MondjadMarGeci.user.js
// @updateURL https://update.greasyfork.org/scripts/431303/MondjadMarGeci.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    while (document.querySelector('div[data-testid="mw_message_list"]') == null) {
        await new Promise(r => setTimeout(r, 2000));
    }

    const globalPlayBackSpeed = 1.0;

    const observer = new MutationObserver(list => {
        appendIndividualAudioElements();
        // appendGlobalAudioElements();
    });
    observer.observe(document.body, {attributes: true, childList: true, subtree: true});

    // *** Not implemented yet ***
    function appendGlobalAudioElements() {
        const conversation_info = document.querySelector('div[aria-label="Conversation Information"]');
        const parent = getNthParent(conversation_info, 4);
        if (parent != null) {
            if (parent.querySelectorAll('button').length == 0) {
                const ffButton = getFastForwardButton();
                const rwButton = getRewindButton();
                const pbsLabel = getPlayBackSpeedLabel();

                parent.appendChild(pbsLabel);
                parent.appendChild(ffButton);
                parent.appendChild(rwButton);
            }
        }
    }

    function appendIndividualAudioElements() {
        const audioNodes = document.querySelectorAll('div[data-testid="chat-audio-player"] > div > audio');
        audioNodes.forEach(node => {
            var parent = node.parentElement;
            while (parent.getAttribute('data-testid') != 'message-container') {
                parent = parent.parentElement;
            }
            if (parent != null) {
                if (parent.querySelectorAll('div[data-testid="message-container"] > button').length == 0) {
                    parent.setAttribute('style', 'align-items: center;')

                    const ffButton = getFastForwardButton();
                    const rwButton = getRewindButton();
                    const pbsLabel = getPlayBackSpeedLabel();
                    let pbRate = parent.querySelector('audio').playbackRate;
                    pbsLabel.innerHTML = `${pbRate.toFixed(2)}x`;

                    ffButton.addEventListener('click', function(){
                        pbRate = testAndSetPbRate(pbRate + 0.25);
                        pbsLabel.innerHTML = `${pbRate.toFixed(2)}x`;
                        parent.querySelector('audio').playbackRate = pbRate;
                    });
                    rwButton.addEventListener('click', function(){
                        pbRate = testAndSetPbRate(pbRate - 0.25);
                        pbsLabel.innerHTML = `${pbRate.toFixed(2)}x`;
                        parent.querySelector('audio').playbackRate = pbRate;
                    });

                    parent.appendChild(rwButton);
                    parent.appendChild(pbsLabel);
                    parent.appendChild(ffButton);
                }
            }
        })
    }

    function testAndSetPbRate(newValue) {
        return newValue >= 0 ? newValue : 0;
    }

    function getFastForwardButton() {
        var ffb = document.createElement('button');
        ffb.setAttribute('class', 'ffwButton');
        ffb.setAttribute('style', 'border: 1px solid silver; margin-left: 10px; background-color: transparent; padding: 7px; border-radius: 20px;');
        ffb.addEventListener('mousedown', function() {
            toggleBg(ffb, 'lightgrey');
        })
        ffb.addEventListener('mouseup', function() {
            toggleBg(ffb, 'transparent');
        })
        ffb.addEventListener('mouseover', function() {
            toggleBg(ffb, 'whitesmoke');
        })
        ffb.addEventListener('mouseout', function() {
            toggleBg(ffb, 'transparent');
        })
        ffb.innerHTML = 'elalszom bazmä⏩';
        return ffb;
    }

    function getRewindButton() {
        var rwb = document.createElement('button');
        rwb.setAttribute('class', 'rwButton');
        rwb.setAttribute('style', 'border: 1px solid silver; margin-left: 10px; background-color: transparent; padding: 7px; border-radius: 20px;');
        rwb.addEventListener('mousedown', function() {
            toggleBg(rwb, 'lightgrey');
        })
        rwb.addEventListener('mouseup', function() {
            toggleBg(rwb, 'transparent');
        })
        rwb.addEventListener('mouseover', function() {
            toggleBg(rwb, 'whitesmoke');
        })
        rwb.addEventListener('mouseout', function() {
            toggleBg(rwb, 'transparent');
        })
        rwb.innerHTML = 'jólvan, chill⏪';
        return rwb;
    }

    function getPlayBackSpeedLabel() {
        let pbs = document.createElement('label');
        pbs.setAttribute('class', 'pbsLabel');
        pbs.setAttribute('style', 'margin-left: 10px; background-color: transparent;');
        return pbs;
    }

    function getNthParent(node, n) {
        let parent = node.parentElement;
        for (let i = 0; i < n; i++) {
            parent = parent.parentElement;
        }
        return parent;
    }

    function toggleBg(element, color) {
        if(!color) {
            color = element.dataset.normalColor;
        } else {
            element.dataset.normalColor = element.style.backgroundColor;
        }

        element.style.backgroundColor = color;
    }

//     function onFfClick(parent) {
//         const audioNode = parent.querySelector('audio');
//         audioNode.playbackRate = audioNode.playbackRate + 0.25;
//     }

//     function onRwClick(parent) {
//         const audioNode = parent.querySelector('audio');
//         audioNode.playbackRate = audioNode.playbackRate - 0.25;
//     }
})();