// ==UserScript==
// @name         [HWM] GuildTimersOnMain
// @namespace    [HWM] GuildTimersOnMain
// @version      0.3.4
// @description  Таймеры для гильдии охотников, наёмников, воров и лидеров
// @author       Komdosh
// @include      http*://*.heroeswm.ru/home.php*
// @include      http*://*.heroeswm.ru/map.php*
// @include      http*://*.heroeswm.ru/mercenary_guild.php*
// @include      http*://*.heroeswm.ru/leader_guild.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437040/%5BHWM%5D%20GuildTimersOnMain.user.js
// @updateURL https://update.greasyfork.org/scripts/437040/%5BHWM%5D%20GuildTimersOnMain.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const GUILDS_INFO_MERCENARY = 'GUILDS_INFO_MERCENARY';
    const GUILDS_INFO_HUNTER = 'GUILDS_INFO_HUNTER';
    const GUILDS_INFO_LEADER = 'GUILDS_INFO_LEADER';
    const GUILDS_INFO_THIEF = 'GUILDS_INFO_THIEF';

    if (/map.php/.test(location.href)) {
        const hunterInfo = getWithExpiry(GUILDS_INFO_HUNTER);
        if (hunterInfo != null && hunterInfo === '-1') {
            localStorage.removeItem(GUILDS_INFO_HUNTER);
        }
        const thiefInfo = getWithExpiry(GUILDS_INFO_THIEF);
        if (thiefInfo != null && thiefInfo === '-1') {
            localStorage.removeItem(GUILDS_INFO_THIEF);
        }
        return;
    } else if (/leader_guild.php/.test(location.href)) {
        const leaderInfo = getWithExpiry(GUILDS_INFO_LEADER);
        if (leaderInfo != null && leaderInfo === '-1') {
            localStorage.removeItem(GUILDS_INFO_LEADER);
        }
        return;
    }

    localStorage.removeItem(GUILDS_INFO_MERCENARY);

    const isThiefsAvailable = parseInt(Array.from(document.querySelectorAll('.home_guild_text'))
                                       .find(el => el.innerText === 'Воров').parentElement.querySelector('.home_text_exp').innerText) > 0;

    const userInfo = getUserInfo();

    const guildsInfoDiv = document.createElement('div');
    guildsInfoDiv.className += "home_container_block";
    guildsInfoDiv.style = "align-items: left;";

    const guildsInfoHeader = document.createElement('div');
    guildsInfoHeader.className += "global_container_block_header global_a_hover";
    guildsInfoHeader.innerHTML = 'Таймеры';
    guildsInfoDiv.append(guildsInfoHeader);

    const guildsInfoContentDiv = document.createElement('div');
    guildsInfoContentDiv.className += "home_inside_margins global_a_hover";
    guildsInfoDiv.append(guildsInfoContentDiv);

    const workerGuild = document.querySelector(".home_work_block");

    workerGuild.before(guildsInfoDiv);

    const loading = document.createElement('span');
    loading.innerText = 'Данные обновляются...';
    guildsInfoContentDiv.append(loading);

    requestHunterInfo();
    requestMercenaryInfo();
    if (isThiefsAvailable) {
        requestThiefInfo(userInfo.id);
    }
    requestLeadersInfo();

    //***************************************************************************
    function requestLeadersInfo() {
        request('leader', 'Новое задание через ', "/leader_guild.php",
                GUILDS_INFO_LEADER,
                'ГЛ',
                '<a href="leader_guild.php" style="text-decoration:underline">Все цели обнаружены</a>',
                'Требуется лидер',
                (respDoc, timerDiv) => {
            const nextTime = respDoc.querySelector('#next_lg');
            if(nextTime == null){
                return 0;
            }
            const script = nextTime.parentElement.getElementsByTagName('script')[0];

            const scriptDeltaText = script.text.match(/Delta2 = (\d+)/);

            if (scriptDeltaText == null) {
                return 0;
            } else {
                return parseInt(scriptDeltaText[1]);
            }
        });
    }

    //***************************************************************************
    function requestHunterInfo() {
        request('hunter', 'Охота будет доступна через ', "/map.php",
                GUILDS_INFO_HUNTER,
                'ГО',
                '<a href="map.php" style="text-decoration:underline">Новая охота</a>',
                'Охотники зовут на помощь',
                (respDoc, timerDiv) => {
            const script = document.querySelector('#map_right_block_inside').getElementsByTagName('script')[0];

            const scriptDeltaText = script.text.match(/MapHunterDelta = (\d+)/);

            if (scriptDeltaText == null) {
                return 0;
            } else {
                return parseInt(scriptDeltaText[1]);
            }
        });
    }

    //***************************************************************************
    function requestMercenaryInfo() {
        request('mercenary', 'Новое задание через ', "/mercenary_guild.php", GUILDS_INFO_MERCENARY,
                'ГН',
                '<a href="mercenary_guild.php" style="text-decoration:underline">Новое задание</a>',
                'Наёмникам требуется герой!',
                (respDoc, timerDiv) => {
            const taskMessageDiv = respDoc.querySelector('table:not([align="center"])').querySelector('table:not([align="center"], [class="wbwhite"])');

            if (taskMessageDiv == null) {
                return 0;
            } else {
                const taskMessage = taskMessageDiv.querySelector('td').innerText;
                return (parseInt(taskMessage.split('\u0447\u0435\u0440\u0435\u0437 ')[1].split(' ')[0])+1) * 60 ;
            }
        });
    }

    //***************************************************************************
    function requestThiefInfo(userId) {
        request('thief', 'Новое задание через ', `/pl_warlog.php?id=${userId}`, GUILDS_INFO_THIEF,
                'ГВ',
                '<a href="map.php" style="text-decoration:underline">Новая засада</a>',
                'Воры замышляют новое нападение!',
                (respDoc, timerDiv) => {
            const battles = respDoc.querySelector('div[class="global_a_hover"]').innerHTML.split('br');

            let nextTime = 1000 * 60 * 60;
            if (isPremium()) {
                nextTime *= 0.7;
            }
            for (const battle of battles) {
                if (/<b>\u041A\u0430\u0440\u0430\u0432\u0430\u043D/.test(battle)) {  // Караван выигран
                    let battleDate = battle.split('>')[1].split('<')[0];
                    const battleDateSplit = battleDate.split('-');
                    battleDate = battleDateSplit[1] + '-' + battleDateSplit[0] + '-' + battleDateSplit[2];
                    const thiefDateTime = new Date(battleDate);

                    return Math.floor(((thiefDateTime.getTime() + nextTime) - Date.now()) / 1000);
                } else {
                    return 0;
                }
            }

            return 0;
        });
    }

    function request(domId, taskHtml, link, localStorageName, notifyMeLinkName, newTaskInstantlyDom, notifyText, processor) {
        const timerDiv = document.createElement('div');
        timerDiv.id = domId;
        guildsInfoContentDiv.append(timerDiv);

        const expiration = getWithExpiry(localStorageName);

        const notifyMeLink = document.createElement('a');
        notifyMeLink.style = 'cursor: pointer';

        let isNotify = localStorage.getItem(`${localStorageName}_SETTINGS`) === 'true';

        notifyMeLink.innerHTML = isNotify ? `<b>${notifyMeLinkName}</b>: ` : `${notifyMeLinkName}: `;

        notifyMeLink.onclick = () => {
            isNotify = !isNotify;

            toggleNotification(isNotify,
                               notifyMeLink,
                               notifyMeLinkName);

            localStorage.setItem(`${localStorageName}_SETTINGS`, isNotify);
        };

        const wrapper = document.createElement('span');
        wrapper.append(notifyMeLink);

        if (expiration != null) {
            if (loading != null) {
                loading.remove();
            }

            if (expiration === '-1') {
                timerDiv.append(createElementFromTextAndAppend(wrapper, newTaskInstantlyDom));
                return;
            }

            toggleNotification(isNotify,
                               notifyMeLink,
                               notifyMeLinkName);

            const delay = Math.floor((expiration - Date.now()) / 1000);
            initTimer(delay, timerDiv, createElementFromTextAndAppend(wrapper, taskHtml), () => {
                timerFinished(isNotify, notifyText, timerDiv, newTaskInstantlyDom);
            });
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(link));
        xhr.overrideMimeType('text/xml; charset=windows-1251');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const div = document.createElement('div');
                div.id = 'kom-' + domId;
                div.style.display = 'none';
                div.innerHTML = xhr.responseText;
                document.getElementsByTagName('body')[0].appendChild(div);
                const respDoc = document.getElementById('kom-' + domId);
                if (loading != null) {
                    loading.remove();
                }
                const delta = processor(respDoc, timerDiv);

                if (delta > 0) {
                    const expiration = Date.now() + delta * 1000;

                    setWithExpiry(localStorageName, expiration, expiration);

                    toggleNotification(isNotify,
                                       notifyMeLink,
                                       notifyMeLinkName);

                    initTimer(delta, timerDiv, createElementFromTextAndAppend(wrapper, taskHtml), () => {
                        timerFinished(isNotify, notifyText, timerDiv, newTaskInstantlyDom);
                    });
                } else {
                    setWithExpiry(localStorageName, '-1', Date.now() + 60 * 60 * 1000);
                    timerDiv.append(createElementFromTextAndAppend(wrapper, newTaskInstantlyDom));
                }

                respDoc.remove();
            } else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    //***************************************************************************
    function setWithExpiry(key, value, expirationTime) {
        const item = {
            value: value,
            expiry: expirationTime,
        }
        localStorage.setItem(key, JSON.stringify(item))
    }

    //***************************************************************************
    function getWithExpiry(key) {
        const itemStr = localStorage.getItem(key)
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null;
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }

    //***************************************************************************
    function initTimer(Delta, timerDiv, html, onTimeEnd) {
        const timeSpan = document.createElement('span');
        html.append(timeSpan);

        function print_time(t) {
            if (t < 0) t = 0;

            const min = Math.floor(t / 60);
            const sec = t % 60;
            let s = '';

            if (min) s = min + ' ' + 'мин. ';
            s = s + sec + ' ' + 'с. ';

            timeSpan.innerText = ' ' + s;
            if (timerDiv.firstChild != null) {
                timerDiv.replaceChild(html, timerDiv.firstChild);
            } else {
                timerDiv.append(html);
            }
        }

        const Refresh = () => {
            if (Timer >= 0) clearTimeout(Timer);
            Delta = Delta - 1;
            print_time(Delta);
            if (Delta >= 0) {
                Timer = setTimeout(Refresh, 1000);
            } else {
                onTimeEnd();
            }
        }

        let Timer = setTimeout(Refresh, 1000);
        print_time(Delta);
    }

    //*******************
    function getUserInfo() {
        const infoLink = document.querySelector('center>a[href^=pl_info]');
        const infoLinkValues = infoLink.href.split("id=");

        return {id: infoLinkValues[infoLinkValues.length - 1], name: infoLink.innerText};
    }

    //*******************
    function isPremium() {
        return document.querySelector('a[href="shop.php?cat=potions#vip"]') != null;
    }

    //***************************************************************************
    function toggleNotification(isNotify, notifyMeLink, notifyMeLinkName) {
        if (isNotify) {
            notifyMeLink.innerHTML = `<b>${notifyMeLinkName}</b>: `;
            notifyMeLink.title = 'Уведомление: включено';
        } else {
            notifyMeLink.innerHTML = `${notifyMeLinkName}: `;
            notifyMeLink.title = 'Уведомление: выключено';
        }
    }

    //***************************************************************************
    function createElementFromTextAndAppend(wrapper, html) {
        const span = document.createElement('span');
        span.innerHTML = html.trim();
        wrapper.append(span);
        return wrapper;
    }

    //***************************************************************************
    function timerFinished(isNotify, notifyText, timerDiv, finishedHtml) {
        if (isNotify) {
            notifyAfter(notifyText);
        }


        const span = document.createElement('span');
        span.innerHTML = finishedHtml.trim();

        timerDiv = timerDiv.lastChild;
        let child = timerDiv.lastChild;
        while (timerDiv.children.length > 1) {
            timerDiv.removeChild(child);
            child = timerDiv.lastChild;
        }

        timerDiv.append(span);
    }

    //***************************************************************************
    function notifyAfter(text) {
        var notify = alert;

        const cancellation = setTimeout(() => {
            notify(text);
        }, 1000);

        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                notify = (t) => new Notification(t);
            }
        });

        return cancellation;
    }
})();