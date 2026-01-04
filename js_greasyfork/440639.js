// ==UserScript==
// @name         Moods
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Moods autochange
// @decription:ru Автосмена статуса
// @author       Fenion
// @match        https://hikanime.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hikanime.ru
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/440639/Moods.user.js
// @updateURL https://update.greasyfork.org/scripts/440639/Moods.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const moods = [];
    $('<div class="head_option moods"><i class="fa fa-smile-o" style="font-size: 20px;" aria-hidden="true"></i></div>').insertBefore('#get_private');
    const setMoods = () => {
        const i = prompt('Введите желаемое кол-во строк');
        if (i === null) return;
        if (i == 0) {
            localStorage.removeItem('moods');
            newSetMood('').then(() => location.reload());
            return;
        }
        for(let j = 0; j < i; j++) {
            const str = prompt(`Введите строку ${j+1}`);
            if (str === null) break;
            moods.push(str);
        }
        localStorage.setItem('moods', moods);
        newSetMood(moods[0]).then(() => location.reload());
    }
    const newSetMood = (mood) => new Promise((res, rej) => {
        $.post('system/action_profile.php', {
            save_mood: mood,
            token: utk
        }, function(response) {
            if(response == 0){
                callSaved(system.error, 3);
                rej('error');
                hideOver();
            }
            else if(response == 2){
                callSaved(system.restrictedContent, 3);
                rej('error');
            }
            else {
                $('#pro_mood').html(response);
                res(true);
                hideOver();
            }
        });
    });
    const currentMoods = !localStorage.getItem('moods') ? [] : localStorage.getItem('moods').split(',');
    let activeMood = 0;
    const changeMoods = () => {
        if (activeMood === (currentMoods.length - 1)) {
            activeMood = 0;
        } else {
            activeMood++;
        }
        return currentMoods.length < 1 ? null : currentMoods[activeMood];
    }
    const handleInterval = () => {
        userReload();
        if (currentMoods.length <= 1) return;
        newSetMood(changeMoods());
    }
    setInterval(() => handleInterval(), 5000);
    $('.moods').click(setMoods);
})();