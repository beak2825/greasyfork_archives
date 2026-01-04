// ==UserScript==
// @name         Chain alert
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  Alert when time left under set times
// @author       Ahab [1735214] & modified by Hwa [2466470]
// @include      *torn.com*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534054/Chain%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/534054/Chain%20alert.meta.js
// ==/UserScript==

const times = [10, 15, 30, 45, 60, 90, 105, 120];
var hitsOver = 100;
var audioPlayer = document.createElement('audio');
var timesNew = [...times];
var act = 0;
audioPlayer.src = 'https://www.torn.com/casino/russianRoulette/audio/bang.ogg';
// for a less jarring sound, replace 'https://www.torn.com/casino/russianRoulette/audio/bang.ogg' with 'https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103'
audioPlayer.preload = 'auto';
document.body.appendChild(audioPlayer);

if (localStorage.alertStatus === undefined) {
    localStorage.alertStatus = 0;
}
if (localStorage.selectedTime === undefined) {
    localStorage.selectedTime = times[0];
}

$(document).ready(function () {
    $('a[class*="chain-bar___"]').before(`
        <div style='color:rgb(153, 10, 0); cursor: pointer; margin-bottom: 6px;'>
            <span id='chainAlert'>Alert: <span id='state'>Off</span></span>
            <select id='timeSelect'></select>
        </div>
    `);

    times.forEach(time => {
        $('#timeSelect').append(`<option value='${time}'>${time} sec</option>`);
    });

    $('#timeSelect').val(localStorage.selectedTime);
    $('#timeSelect').on('change', function () {
        localStorage.selectedTime = this.value;
    });

    if (localStorage.alertStatus == 1) {
        $('#chainAlert').css('color', 'rgb(61, 153, 0)');
        $('#state').text('On');
        alert();
    }
});

$('#chainAlert').on('click', function () {
    if ($('#state').text() == 'Off') {
        $(this).css('color', 'rgb(61, 153, 0)');
        $('#state').text('On');
        localStorage.alertStatus = 1;
        alert();
    } else {
        $(this).css('color', 'rgb(153, 10, 0)');
        $('#state').text('Off');
        localStorage.alertStatus = 0;
    }
});

document.addEventListener('visibilitychange', function () {
    act = document.hidden ? 1 : 0;
});

function alert() {
    let lastPlayed = 0; // Track the last time sound was played

    if (localStorage.alertStatus == 1 && $('div[class*="cooldown___"]').length == 0 && act == 0) {
        var observerTarget = $('p[class*="bar-timeleft"]')[0];
        var observerConfig = { attributes: false, childList: false, characterData: true, subtree: true };
        var observer = new MutationObserver(function (mutations) {
            let selectedTime = parseInt(localStorage.selectedTime);
            let currentTime = Date.now();

            if (
                localStorage.alertStatus == 1 &&
                parseInt($('p[class*="bar-value___"]')[4].innerText.split('/')[0]) > hitsOver &&
                $('div[class*="cooldown___"]').length == 0
            ) {
                let timeStr = mutations[0].target.nodeValue;
                let timeLeft = parseInt(timeStr.split(':')[0]) * 60 + parseInt(timeStr.split(':')[1]);

                if (timeLeft <= selectedTime && currentTime - lastPlayed > 5000) {
                    audioPlayer.play().catch(error => console.log('Audio play failed:', error));
                    lastPlayed = currentTime; // Update last played time
                }
            } else {
                observer.disconnect();
            }
        });
        observer.observe(observerTarget, observerConfig);
    }
}