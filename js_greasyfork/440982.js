// ==UserScript==
// @name        Mouse Amplifier
// @description Amplify volume of Twitch streams on a per-channel basis
// @author      Xspeed
// @namespace   xspeed.net
// @license     MIT
// @version     5
// @icon        https://cdn.discordapp.com/icons/399202924695388160/a_131293bc9991ade1ec366efb27b05adf.webp

// @match       *://*.twitch.tv/*
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440982/Mouse%20Amplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/440982/Mouse%20Amplifier.meta.js
// ==/UserScript==

const predefinedDefaults = {
    ironmouse: 2.33
};

let lastName;
let targetVid;
let gainNode;
let inputElem;

const audioCtx = new AudioContext();

function log(txt) {
    console.log('[' + GM.info.script.name + '] ' + txt);
}

// gain = 20 - 20 * sqrt(1 - (input / 64) ^ 2)
function input2gain(i) {
    return (20 - 20 * Math.sqrt(1 - (i / 64) * (i / 64))).toFixed(2);
}

// input = 64 * sqrt(1 - (1 - gain / 20) ^ 2)
function gain2input(g) {
    return (64 * Math.sqrt(1 - (1 - g / 20) * (1 - g / 20))).toFixed(0);
}

async function setup() {
    const path = document.location.pathname.substring(1).split('/');
    const mobile = document.location.hostname.split('.')[0] == 'm';

    if (path.length == 1 || path[0] == 'videos' || path[1] == 'clip') {
        let chnlElem;
        let chnlName;

        if (mobile) {
            const child = document.querySelector('a.tw-link>figure.tw-avatar>img.tw-image');
            if (child) chnlElem = child.parentElement.parentElement;
            if (chnlElem) {
                const arr = chnlElem.href.split('/');
                chnlName = arr[arr.length - 2];
            }
        }
        else {
            chnlElem = document.querySelector('div>a>h1.tw-title');
            if (chnlElem) chnlName = chnlElem.innerText;
        }

        if (!chnlName || chnlName.length == 0) {
            // Not a channel page, offline or not loaded yet
            return;
        }

        let gainData = JSON.parse(await GM.getValue('gainData', '{}')) ?? {};
        let gain = gainData[chnlName];

        if (gain == null || isNaN(gain)) {
            gain = predefinedDefaults[chnlName] ?? 1;
            gainData[chnlName] = gain;
        }

        if (chnlName != lastName) {
            log('Detected channel ' + chnlName + ", initial gain " + gain);
            lastName = chnlName;
        }

        function setGain() {
            gain = input2gain(inputElem.value);
            gainNode.gain.value = gain;
            inputElem.parentElement.childNodes[1].innerText = 'Gain ' + gain + 'x';
        }

        if (gainNode == null) {
            const source = audioCtx.createMediaElementSource(targetVid);
            gainNode = audioCtx.createGain();

            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }

        if (inputElem == null || !document.body.contains(inputElem)) {
            const container = document.createElement('div');

            inputElem = document.createElement('input');
            inputElem.type = 'range';
            inputElem.min = 2;
            inputElem.max = 64;
            inputElem.step = 1;
            inputElem.value = gain2input(gain);
            inputElem.style.verticalAlign = 'middle';

            const labelElem = document.createElement('label');
            labelElem.innerText = 'Gain ' + gain + 'x';
            labelElem.style.display = 'inline-block';
            labelElem.style.marginLeft = '5px';
            labelElem.style.verticalAlign = 'middle';

            inputElem.addEventListener('input', setGain);

            inputElem.addEventListener('change', function() {
                setGain();

                if (gain == (predefinedDefaults[chnlName] ?? 1)) {
                    delete gainData[chnlName];
                }
                else {
                    gainData[chnlName] = gain;
                }

                GM.setValue('gainData', JSON.stringify(gainData));
                log('Gain for channel ' + chnlName + ' set to ' + gain);
            });

            container.appendChild(inputElem);
            container.appendChild(labelElem);

            const parent = chnlElem.parentElement.parentElement.parentElement.parentElement;
            parent.appendChild(container);
        }

        setGain();
    }
}

function presetup() {
    if (gainNode == null || inputElem == null || !document.body.contains(inputElem)) {
        setup();
    }
}

function detect() {
    const vidElem = document.querySelector('video');

    if (vidElem != targetVid) {
        if (targetVid) targetVid.removeEventListener('canplay', presetup);
        if (gainNode) gainNode.disconnect();

        targetVid = vidElem;
        gainNode = null;

        if (targetVid) {
            log('New video element found on page');
            targetVid.addEventListener('canplay', presetup);
        }
    }

    presetup();
}

setInterval(detect, 1000);
detect();