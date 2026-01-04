// ==UserScript==
// @name         monitor OKX merchant status
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  monitor OKX merchant status for trade purpose.
// @author       You
// @match        https://www.okx.com/p2p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okx.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445109/monitor%20OKX%20merchant%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/445109/monitor%20OKX%20merchant%20status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let monitorMerchantIds = ['8394a6b965'];
    let targetPrice = 6.5;
const myAudioContext = new AudioContext();

/**
 * Helper function to emit a beep sound in the browser using the Web Audio API.
 *
 * @param {number} duration - The duration of the beep sound in milliseconds.
 * @param {number} frequency - The frequency of the beep sound.
 * @param {number} volume - The volume of the beep sound.
 *
 * @returns {Promise} - A promise that resolves when the beep sound is finished.
 */
function beep(duration, frequency, volume){
    return new Promise((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try{
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type= "sine";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}
    function getMerchantOrders(merchantId){
        console.log(`get merchantId=${merchantId} orders.`);
        let ts = Date.now();
        let url = `https://www.okx.com/v3/c2c/accounts/tradingOrders/${merchantId}?t=${ts}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              let res = JSON.parse(xhr.response);
              if(res.data.buy.length !== 0 || res.data.sell.length !== 0){
                console.log('merchant online');
                beep(100, 150, 20);
                res.data.buy.forEach(item => {
                    console.log(item.price);
                    if(item.price >= targetPrice){
                        beep(200, 400, 20);
                    }
              });
                return res.data;
              }else{return 0;}
          }
        };
        xhr.open('GET',url);
        xhr.send();
    }

    setInterval(()=> {
      monitorMerchantIds.forEach(id => {
        getMerchantOrders(id);
      });
    }, 10000);
})();