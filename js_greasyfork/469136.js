// ==UserScript==
// @name         Set Volume to 200% and 100% and 0% in Multiplayer Piano
// @namespace    http://tampermonkey/
// @version      1
// @description  Changes the max value of the volume slider to 2, allowing you to set the volume to 200% using the command '/set200%volume' in Multiplayer Piano.
// @match        https://multiplayerpiano.com/*
// @grant        none
// @license      James
// @downloadURL https://update.greasyfork.org/scripts/469136/Set%20Volume%20to%20200%25%20and%20100%25%20and%200%25%20in%20Multiplayer%20Piano.user.js
// @updateURL https://update.greasyfork.org/scripts/469136/Set%20Volume%20to%20200%25%20and%20100%25%20and%200%25%20in%20Multiplayer%20Piano.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set up a listener for chat messages
    MPP.client.on('a', function(data) {
        const message = data.a;

        // Check if the message contains the '/set200%volume' command
        if (message.toLowerCase().trim() == '/set200%volume') {
            // Get the volume slider element
            const volumeSlider = document.getElementById('volume-slider');
            // Change the max value of the volume slider to 2
            volumeSlider.setAttribute('max', '2.0');
        }
    });
    // Set up a listener for chat messages
    MPP.client.on('a', function(data) {
        const message = data.a;

        // Check if the message contains the '/set100%volume' command
        if (message.toLowerCase().trim() == '/set100%volume') {
            // Get the volume slider element
            const volumeSlider = document.getElementById('volume-slider');
            // Change the max value of the volume slider to 1
            volumeSlider.setAttribute('max', '1.0');
        }
    });
    // Set up a listener for chat messages
    MPP.client.on('a', function(data) {
        const message = data.a;

        // Check if the message contains the '/set0%volume' command
        if (message.toLowerCase().trim() == '/set0%volume') {
            // Get the volume slider element
            const volumeSlider = document.getElementById('volume-slider');
            // Change the max value of the volume slider to 1
            volumeSlider.setAttribute('max', '0.01');
        }
    });
})();
// Information in another language.
// @name:ru.: При такой настройке громкости, если вы введете команду "/set200%volume", она будет иметь максимальную громкость 200%, а если "/set100%volume", то она будет нормальной при максимальной громкости 100%.
// @name:es.: Con este ajuste de volumen, si escribe el comando "/ set200%volume", tendrá un volumen máximo de 200%, y si" /set100%volume", será normal a un volumen máximo de 100%.
// @name:ko.: 이 볼륨 설정을 사용하면"/200%volume"명령을 입력하면 최대 볼륨이 200%이고"/100%volume"인 경우 최대 볼륨이 100%로 정상입니다.