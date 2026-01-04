// ==UserScript==
// @name         Дуэльная статистика
// @namespace    https://www.bestmafia.com/
// @version      1.2
// @description  Дуэльная статистика для игры bestmafia
// @author       Chappa
// @match        http://www.mafia-rules.net/*
// @match        https://www.mafia-rules.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436787/%D0%94%D1%83%D1%8D%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436787/%D0%94%D1%83%D1%8D%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const loadJetons = (f = 4) => {
        let arr = [];
        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: 'http://www.mafia-rules.net/standalone/' + PAGE_goto.toString().match(/\d*\w*\/\"/)[0].replace('"', '') + "DO/" + Math.random(),
            data: {
                method: 'cl_ff',
                f
            },
            dataType: 'json',
            success: function (data) {
                arr = data.arr;
            }
        });
        return arr;
    };

    const sendToServer = (password) => {
        const duels = [];
        duels.push(loadJetons(4));
        duels.push(loadJetons(5));
        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: 'https://bestmafiastat.ru/loadJetons',
            data: {
                duels,
                my_clan,
                uid: my_id,
                password,
            },
            dataType: 'json',
            success: function (data) {
                console.debug(data);
                if (data.status == 'error') {
                    if(data.text == 'Неверный пароль') {
                        window.localStorage.removeItem('jetonPasword');
                    }
                    return console.warn('Произошла ошибка при сохранении', data.text);
                }
                if (data.newPassword) {
                    prompt('Внимание! Вам выдан пароль для сайта, запишите его в надежное место:', data.newPassword);
                    window.localStorage.setItem('jetonPasword', data.newPassword);
                }
                if (data.status == 'ok' && password) {
                    window.localStorage.setItem('jetonPasword', password);
                }
            }
        });
    };

    const getLastSunday = () => {
        let lastSunday = null;
        $.ajax({
            async: false,
            cache: false,
            type: 'GET',
            url: 'https://bestmafiastat.ru/lastSunday?my_clan=' + my_clan,
            dataType: 'json',
            success: function (data) {
                lastSunday = data.lastSunday;
            }
        });
        return lastSunday;
    };

    const imUprav = () => {
        let isUprav = false;
        $.ajax({
            async: false,
            type: 'POST',
            url: 'http://www.mafia-rules.net/standalone/' + PAGE_goto.toString().match(/\d*\w*\/\"/)[0].replace('"', '') + "DO/" + Math.random(),
            data: {
                method: 'cl_root',
                id: my_clan
            },
            dataType: 'json',
            success: function (data) {
                const places = [1, 14, 15, 16, 27, 30, 31];
                for (let place of places) {
                    if (data.arr[place] == my_id) {
                        return isUprav = true;
                    }
                }
                isUprav = false;
            }
        });
        return isUprav;
    };

    const isGoodTime = () => {
        if (new Date().getDay() == 0) {
			console.debug('Плохое время для обновления');
			return false;
        }
        if (new Date().getDay() == 6) {
			if(new Date().getUTCHours() > 12){
				console.debug('Плохое время для обновления');
			}
            return new Date().getUTCHours() <= 12;
        }
        return true;
    };

    const getPrevDuel = () => {
        const now = new Date();
        now.setUTCHours(15);
        now.setUTCMinutes(0);
        now.setUTCSeconds(0);
        now.setUTCMilliseconds(0);
        while (now.getDay() !== 0) {
            now.setDate(now.getDate() - 1);
        }
        return String(now.getDate());
    };


    if (isGoodTime() && imUprav()) {
        const lastSunday = getLastSunday();
        if (!lastSunday) {
            sendToServer();
        } else if (lastSunday== getPrevDuel()) {
            return console.warn(`Дуэль за ${lastSunday} уже записана`);
        } else {
            let password = localStorage.getItem('jetonPasword');
            if (!password || password == 'undefined' || password == 'null') {
                password = prompt('Введите пароль от сайта с жетонами');
            }
            sendToServer(password);
        }
    }

})();