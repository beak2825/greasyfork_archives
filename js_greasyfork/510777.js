// ==UserScript==
// @name           עוצמת שמע עבור צופר - צבע אדום
// @name:en        Volume slider for Tzofar - Red Alert
// @namespace      https://github.com/sharkykh
// @version        1.01
// @description    הוסף הגדרה לקביעת עוצמת השמע של ההתרעות באתר TzevaAdom.co.il
// @description:en Add a volume slider for alerts on TzevaAdom.co.il
// @author         sharkykh
// @license        GPLv3
// @match          https://www.tzevaadom.co.il/
// @match          https://www.tzevaadom.co.il/en/
// @match          https://www.tzevaadom.co.il/es/
// @match          https://www.tzevaadom.co.il/ar/
// @match          https://www.tzevaadom.co.il/ru/
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tzevaadom.co.il
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/510777/%D7%A2%D7%95%D7%A6%D7%9E%D7%AA%20%D7%A9%D7%9E%D7%A2%20%D7%A2%D7%91%D7%95%D7%A8%20%D7%A6%D7%95%D7%A4%D7%A8%20-%20%D7%A6%D7%91%D7%A2%20%D7%90%D7%93%D7%95%D7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/510777/%D7%A2%D7%95%D7%A6%D7%9E%D7%AA%20%D7%A9%D7%9E%D7%A2%20%D7%A2%D7%91%D7%95%D7%A8%20%D7%A6%D7%95%D7%A4%D7%A8%20-%20%D7%A6%D7%91%D7%A2%20%D7%90%D7%93%D7%95%D7%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // test
    // setTimeout(() => Preferences.playSound([1599, 188], 0, true), 1000);
    // setTimeout(() => getAlerts({ cities: ['תל אביב - מזרח', 'מטולה'], threat: 0, isDrill: true }, 'volume-slider-test'), 1000);
    // setTimeout(() => getAlerts({ cities: ['בדיקה'], threat: 0, isDrill: true }, 'volume-slider-test'), 1000);

    const getStoredVolume = () => {
        let v = JSON.parse(localStorage.getItem('soundVolume'));
        if (v >= 0 && v <= 1) return v;
        localStorage.setItem('soundVolume', (v = 0.75)); // default volume 75%
        return v;
    };

    const volume = document.createElement('input');
    volume.id = 'sound-volume';
    volume.type = 'range';
    volume.max = 1.0;
    volume.min = 0.0;
    volume.step = 0.05;
    volume.value = getStoredVolume();
    Object.assign(volume.style, { flex: '1' });

    let currentPlayer = null;
    // eslint-disable-next-line no-implicit-globals, no-native-reassign
    Audio = new Proxy(Audio, {
        construct(target, args) {
            currentPlayer = new target(...args);
            currentPlayer.volume = volume.valueAsNumber;
            console.debug(`intercepted audio player set to play: ${currentPlayer.src}, volume set to: ${currentPlayer.volume}`);
            document.dispatchEvent(new CustomEvent('player:new', { detail: currentPlayer }));
            return currentPlayer;
        },
    });

    const volumeCard = document.createElement('div');
    volumeCard.id = 'volume';
    volumeCard.classList.add('card');
    Object.assign(volumeCard.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', columnGap: '.5em' });

    const volumeLabel = document.createElement('label');
    volumeLabel.setAttribute('for', 'sound-volume');
    Object.assign(volumeLabel.style, { flex: '0 0 1.5em' });
    volumeLabel.innerText = '🔊';

    const volumeValue = document.createElement('span');
    Object.assign(volumeValue.style, { fontSize: '1.2em', margin: '0 .2em', flex: '0 0 2.4em', textAlign: 'center', color: volume.valueAsNumber <= 0 ? 'red' : '' });
    volumeValue.innerText = `${(volume.value * 100)}%`;

    volumeCard.append(volumeLabel, volumeValue, volume);

    volume.addEventListener('input', () => {
        if (currentPlayer && currentPlayer.volume !== volume.valueAsNumber) {
            currentPlayer.volume = volume.valueAsNumber;
            console.debug(`audio player volume set to: ${volume.valueAsNumber}`);
        }

        localStorage.setItem('soundVolume', volume.value);
        volumeValue.innerText = `${(volume.valueAsNumber * 100).toFixed(0)}%`;
        volumeValue.style.color = volume.valueAsNumber <= 0 ? 'red' : '';
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('#sound').after(volumeCard);
    });

})();
