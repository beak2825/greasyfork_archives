// ==UserScript==
// @name         Grepolis Spam Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @include     /http[s]{0,1}://[a-z]{2}[0-9]{1,}\.grepolis\.com/game*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401362/Grepolis%20Spam%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/401362/Grepolis%20Spam%20Script.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    let time = Math.floor(Math.random() * Math.floor(max));
    if (time < min) return time + min;
    return time
}

function sleep(milliseconds, callback) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }

    callback();
}

(function() {
    'use strict';

    $('.nui_main_menu .bottom').append($('<button />', {class: 'start-spam', style: 'margin-top:40px;', text: 'start spam'}))

    $('.start-spam').click(function() {
        var spam;
        console.log('start');
        $('.start-spam').hide();
        $('.nui_main_menu .bottom').append($('<button />', {class: 'stop-spam', text: 'stop spam'}))
        spam = setInterval(() => {
            let time = getRandomInt(20000, 30000);
            console.log('offset ' + time)
            sleep(time, () => {
                $('a.unit.index_unit.bold.unit_icon40x40.harpy')[Math.floor(Math.random() * Math.floor($('a.unit.index_unit.bold.unit_icon40x40.harpy ').length))].click();
                $("div#btn_attack_town").click()
                let cancel = setTimeout(() => {
                    if ($('a.game_arrow_delete').length > 0) {
                        $('a.game_arrow_delete').click()
                        clearInterval(cancel)
                    }
                }, 2500)
            })
        }, 60000)

        $('.stop-spam').click(function() {
            clearInterval(spam)
            $('.stop-spam').hide();
            $('.nui_main_menu .bottom').append($('<button />', {class: 'start-spam', style: 'margin-top:40px;', text: 'start spam'}))
        })

        // stop when Grepolis tries to check a bot
        $(document).on("bot_check:update_started_at_change", function () {
           $('.stop-spam').click();
        });
    });
})();