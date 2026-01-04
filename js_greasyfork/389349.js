// ==UserScript==
// @name  Auto Refresh
// @namespace  Nguyen Kim Long
// @description  Tự động refresh.
// @version  1.0.2
// @author  NKL
// @match  https://colkidsclub.vn/backpack-season-3*
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.8/js/select2.full.min.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/389349/Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/389349/Auto%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        if (document.getElementsByClassName('sold-out').length == 1) {
            setTimeout(function () {
                location.reload();
            }, 3000);
        } else {
            if (document.title == 'Just a moment...') {
                //alert('antiddos');
                setTimeout(function () {
                    location.reload();
                }, 5000);
            } else {
                async function playaudio() {
                    var audio = await new Audio('https://www.w3schools.com/html/horse.mp3');
                    audio.loop = true;
                    audio.play();
                }
                playaudio();
                async function addTocart() {
                    var button = await document.getElementsByClassName('add_to_cart ');
                    await button[0].click();
                    var url = await 'https://colkidsclub.vn/checkout/'
                    await window.open(url,'_blank');
                }
                addTocart();
            }

        }
    });
})();