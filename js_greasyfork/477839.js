// ==UserScript==
// @name        Timer Message
// @namespace   Violentmonkey Scripts
// @match        https://my.livechatinc.com/*
// @grant       none
// @version     1.0
// @author      Developer
// @license MIT
// @description 20.10.2023, 09:41:14
// @downloadURL https://update.greasyfork.org/scripts/477839/Timer%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/477839/Timer%20Message.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(function() {
        const elements = document.querySelectorAll('.eovu8nx0');
        let intervalId;

        function countDiffTime(event) {
            function updateTimeInterval() {
                if (document.querySelector('.css-xvqtiv')) {
                    document.querySelector('.css-xvqtiv').innerHTML = document.querySelector('.css-xvqtiv').innerHTML.split(' ')[0];
                    let getDate = (string) => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),
                        string.split(':')[0], string.split(':')[1], string.split(':')[2]);

                    function diff_seconds(dt2, dt1) {
                        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
                        let minutes = diff / 60;
                        let seconds = diff % 60;
                        return Math.abs(Math.floor(minutes)) + ':' + Math.abs(Math.floor(seconds));
                    }

                    let a = getDate(document.querySelector('.css-xvqtiv').innerHTML);
                    let result = diff_seconds(new Date(), a);
                    console.log(result);
                    document.querySelector('.css-xvqtiv').innerHTML += ' || ' + result;
                }
            }

            if (!intervalId) {
                intervalId = setInterval(updateTimeInterval, 1000);
            }
        }

        elements.forEach((element) => {
            element.addEventListener('mouseover', countDiffTime);
        });
    }, 10000);
})();