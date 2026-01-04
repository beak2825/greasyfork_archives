// ==UserScript==
// @name         RustClash Ting+Claim
// @namespace    http://tampermonkey.net/
// @version      5
// @description  my first script update
// @author       You
// @match        https://rustclash.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462496/RustClash%20Ting%2BClaim.user.js
// @updateURL https://update.greasyfork.org/scripts/462496/RustClash%20Ting%2BClaim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    function play() {
        var audio = new Audio("https://nf1f8200-a.akamaihd.net/downloads/ringtones/files/mp3/facebook-messenger-tone-wapking-fm-mp3-17015-19072-43455.mp3")
        audio.volume = 0.5;
        audio.play();
    }

    async function main() {
        console.log('Start');
        play()
        while (true) {
            console.log('Dekh rhe hai! bata denge, sabhar rakho!');
            try {
                if (document.getElementsByClassName("rainbox").length > 0) {
                    var i = 0;
                    while (i < 3) {
                        console.log('Rain AAYI');
                        play()
                        i++;
                        await sleep(700);
                    }
                    await sleep(5000);
                    document.getElementsByClassName("rainbox")[0].getElementsByTagName("button")[0].click();
                    await sleep(20000);
                }
            } catch (e) {

            }

            await sleep(300);
        }
    }
    setTimeout(main, 2500)
})();