// ==UserScript==
// @name         [HWM] SmithsGuildOnHome
// @namespace    [HWM] SmithsGuildOnHome
// @version      0.4.0
// @description  Информация о гильдии кузнецов/оружейников на странице персонажа.
// @author       Komdosh
// @include      http*://*.heroeswm.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436859/%5BHWM%5D%20SmithsGuildOnHome.user.js
// @updateURL https://update.greasyfork.org/scripts/436859/%5BHWM%5D%20SmithsGuildOnHome.meta.js
// ==/UserScript==


const SMITHS_GUILD_SETTINGS = 'SMITHS_GUILD_SETTINGS';
const SMITHS_GUILD_PARALLEL_WORK = 'SMITHS_GUILD_PARALLEL_WORK';
const SMITHS_GUILD_INFO_FIRST = 'SMITHS_GUILD_INFO_V4_1';
const SMITHS_GUILD_INFO_SECOND = 'SMITHS_GUILD_INFO_V4_2';

const SMITHS_GUILD_NOTIFICATION_IS_SHOWN = 'SMITHS_GUILD_NOTIFICATION_IS_SHOWN_V2';

const SMITH_FREE = '\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u0430!'; // Кузница свободна

if (!/home.php/.test(location.href)) {
    initNotificationsOnNonHome();
    return;
}

const smithsLevel = level("https://dcdn.heroeswm.ru/i/pl_info/icons/guild_blacksmiths.png");
const modLevel = level("https://dcdn.heroeswm.ru/i/pl_info/icons/guild_armourers.png");

const parallelWork = smithsLevel == 9 || modLevel == 5;
localStorage.setItem(SMITHS_GUILD_PARALLEL_WORK, parallelWork);

const smithGuildInfoContentDiv = createSmithsInfoDOM();

let finishScript = false;
let savedGuildInfo = getWithExpiry(SMITHS_GUILD_INFO_FIRST);
if (savedGuildInfo != null) {
    displaySmithsGuildInfo(savedGuildInfo.workedOnText, savedGuildInfo.timeToFinishText, savedGuildInfo.finishTimeValues);
    if (!parallelWork) {
        return;
    }
    finishScript = true;
} else {
    localStorage.removeItem(SMITHS_GUILD_INFO_SECOND);
}

savedGuildInfo = getWithExpiry(SMITHS_GUILD_INFO_SECOND);
if (savedGuildInfo != null) {
    smithGuildInfoContentDiv.append(document.createElement('hr'));

    displaySmithsGuildInfo(savedGuildInfo.workedOnText, savedGuildInfo.timeToFinishText, savedGuildInfo.finishTimeValues);
    finishScript = true;
} else {
    localStorage.removeItem(SMITHS_GUILD_INFO_FIRST);
}

if (finishScript) {
    return;
}

requestSmithInfo();


//***************************************************************************
function createSmithsInfoDOM() {
    const smithGuildInfoDiv = document.createElement('div');
    smithGuildInfoDiv.className += "home_container_block";
    smithGuildInfoDiv.style = "align-items: left;"

    const smithGuildInfoHeader = document.createElement('div');
    smithGuildInfoHeader.className += "global_container_block_header global_a_hover";

    smithGuildInfoHeader.innerHTML = '<a href="/mod_workbench.php"">\u0413\u0438\u043B\u044C\u0434\u0438\u044F \u041A\u0443\u0437\u043D\u0435\u0446\u043E\u0432</a>'; //Гильдия Кузнецов
    smithGuildInfoDiv.append(smithGuildInfoHeader);

    const notifyMeLink = document.createElement('a');
    notifyMeLink.style = 'cursor: pointer';
    notifyMeLink.id = 'smithGuildNotifier';
    smithGuildInfoHeader.append(notifyMeLink);

    const smithGuildInfoContentDiv = document.createElement('div');
    smithGuildInfoContentDiv.className += "home_inside_margins global_a_hover";
    smithGuildInfoDiv.append(smithGuildInfoContentDiv);

    const workerGuild = document.querySelector(".home_work_block");

    workerGuild.after(smithGuildInfoDiv);

    return smithGuildInfoContentDiv;
}

//***************************************************************************
function requestSmithInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/mod_workbench.php"));
    xhr.overrideMimeType('text/xml; charset=windows-1251');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const div = document.createElement('div');
            div.id = 'kom-smiths';
            div.style.display = 'none';
            div.innerHTML = xhr.responseText;
            document.getElementsByTagName('body')[0].appendChild(div);
            const respDoc = document.getElementsByTagName('body')[0].lastChild;
            if (!/\u0418\u0434\u0435\u0442 \u0440\u0430\u0431\u043E\u0442\u0430 \u043D\u0430\u0434/.test(respDoc.innerText)) { //Идёт работа над
                const noWorkSpan = document.createElement('span');
                noWorkSpan.innerHTML += SMITH_FREE;
                smithGuildInfoContentDiv.append(noWorkSpan);
                return;
            }

            const documentSmithTables = Array.from(respDoc.querySelectorAll("table[align=center]"));
            const smithTable = documentSmithTables[documentSmithTables.length - 1];
            const {
                workedOnText,
                finishTimeValues,
                expiration
            } = saveSmithsTable(smithTable, SMITHS_GUILD_INFO_FIRST);

            displaySmithsGuildInfo(workedOnText, expiration, finishTimeValues);

            if(parallelWork){
                const anotherSmithTable = documentSmithTables[documentSmithTables.length - 2]

                if (anotherSmithTable.querySelector("td[colspan]").innerText.trim() !== '') {
                    const {
                        workedOnText,
                        finishTimeValues,
                        expiration
                    } = saveSmithsTable(anotherSmithTable, SMITHS_GUILD_INFO_SECOND);
                    smithGuildInfoContentDiv.append(document.createElement('hr'));
                    displaySmithsGuildInfo(workedOnText, expiration, finishTimeValues);
                }
            }
            respDoc.remove();
        } else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

//***************************************************************************
function displaySmithsGuildInfo(workedOnText, timeToFinishText, finishTimeValues) {
    const notifyMeLink = document.querySelector("#smithGuildNotifier");
    let notificationCancellation = null;
    let isNotify = localStorage.getItem(SMITHS_GUILD_SETTINGS, 'false') == 'true';

    notificationCancellation = createCancellableNotificationWithLink(isNotify, notificationCancellation, notifyMeLink, timeToFinishText - Date.now());
    notifyMeLink.onclick = () => {
        isNotify = !isNotify;
        notificationCancellation = createCancellableNotificationWithLink(isNotify, notificationCancellation, notifyMeLink, timeToFinishText - Date.now());
        localStorage.setItem(SMITHS_GUILD_SETTINGS, isNotify);
    };

    const workedOnSpan = document.createElement('span');
    workedOnSpan.innerText = workedOnText;
    smithGuildInfoContentDiv.append(workedOnSpan);

    smithGuildInfoContentDiv.append(document.createElement('br'));

    const timeToFinishSpan = document.createElement('span');

    timeToFinishSpan.innerHTML = '\u0412 \u0440\u0435\u043C\u043E\u043D\u0442\u0435: \u0435\u0449\u0435 ' + formatFinishedTime(timeToFinishText); // В ремонте ещё
    smithGuildInfoContentDiv.append(timeToFinishSpan);

    smithGuildInfoContentDiv.append(document.createElement('br'));

    const finishTimeSpan = document.createElement('span');
    const finishTimeText = finishTimeValues[0];
    const finishDateTimeText = finishTimeValues[1];
    finishTimeSpan.innerHTML = finishTimeText + ': <a href="/mod_workbench.php" style="text-decoration:underline;">' + finishDateTimeText + '</a>';

    smithGuildInfoContentDiv.append(finishTimeSpan);
}

//***************************************************************************
function saveSmithsTable(smithTable, smithGuildInfoName) {
    const workedOnText = smithTable.querySelector("td[colspan]").innerText.trim();
    const finishTimeValues = smithTable.querySelector("td>table").querySelector("td").innerText.split(': ');

    const expiration = parseGuildDateTime(finishTimeValues[1]).getTime() + 1000 * 60;
    localStorage.setItem(SMITHS_GUILD_NOTIFICATION_IS_SHOWN, 'false');
    setWithExpiry(smithGuildInfoName, {
        workedOnText: workedOnText,
        timeToFinishText: expiration,
        finishTimeValues: finishTimeValues,
    }, expiration);
    return {workedOnText, finishTimeValues, expiration};
}

//***************************************************************************
function formatFinishedTime(finishTime) {
    const diff = finishTime - Date.now();
    const diffDays = Math.floor(diff / 86400000); // days
    const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes

    let dateString = '';
    if (diffDays > 0) {
        dateString += diffDays + ' \u0434. ';
    }
    if (diffHrs > 0) {
        dateString += diffHrs + ' \u0447. ';
    }
    if (diffMins > 0) {
        dateString += diffMins + ' \u043C\u0438\u043D.';
    }

    if(dateString == ''){
        const diffSecs = Math.round((((diff % 86400000) % 3600000) % 60000)/1000); // seconds
        dateString += diffSecs + ' \u0441\u0435\u043a.';
    }

    return dateString;
}

//***************************************************************************
function parseGuildDateTime(dateString) {
    dateString = dateString.split(' ');
    const datef = dateString[0].split('-');
    const date = new Date(datef[1] + '-' + datef[0] + '-' + (new Date().getFullYear()));
    const time = dateString[1].split(':');
    date.setHours(time[0], time[1], 0);
    return date;
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
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key);
        return null
    }
    return item.value
}

//***************************************************************************
function createCancellableNotificationWithLink(isNotify, notificationCancellation, notifyMeLink, delay) {
    if (isNotify) {
        notifyMeLink.innerHTML = '&nbsp(!)';
        notifyMeLink.title = 'Уведомление об окончании работ: включено';
    } else {
        notifyMeLink.innerHTML = '&nbsp(#)';
        notifyMeLink.title = 'Уведомление об окончании работ: выключено';
    }

    return createCancellableNotification(isNotify, notificationCancellation, delay);
}

function createCancellableNotification(isNotify, notificationCancellation, delay) {
    if (localStorage.getItem(SMITHS_GUILD_NOTIFICATION_IS_SHOWN) == 'true') {
        return null;
    }
    if (isNotify) {
        notificationCancellation = notifyAfter(delay, SMITH_FREE);
    } else {
        if (notificationCancellation != null) {
            clearTimeout(notificationCancellation);
        }
    }
    return notificationCancellation;
}

//***************************************************************************
function notifyAfter(delay, text) {
    let notify = alert;
    let cancellation = null;

    cancellation = setTimeout(() => {
        localStorage.setItem(SMITHS_GUILD_NOTIFICATION_IS_SHOWN, 'true');
        notify(text)
    }, delay > 0 ? delay : 1000);

    Notification.requestPermission((permission) => {
        if (permission === 'granted') {
            notify = (text) => new Notification(text);
        }
    });

    return cancellation;
}

//***************************************************************************
function level(link) {
    const levelText = document.body.querySelector('img[src="' + link + '"]').parentElement.parentElement.querySelector('#bartext').innerText;

    return parseInt(levelText);
}

//***************************************************************************
function initNotificationsOnNonHome() {
    const isNotify = localStorage.getItem(SMITHS_GUILD_SETTINGS, 'false') == 'true';
    const parallelWork = localStorage.getItem(SMITHS_GUILD_PARALLEL_WORK, 'false') == 'true';


    const savedGuildInfoFirst = getWithExpiry(SMITHS_GUILD_INFO_FIRST);
    if (savedGuildInfoFirst == null) {
        return;
    }
    createCancellableNotification(isNotify, null, savedGuildInfoFirst.timeToFinishText - Date.now());

    if (!parallelWork) {
        return;
    }

    const savedGuildInfoSecond = getWithExpiry(SMITHS_GUILD_INFO_SECOND);
    if (savedGuildInfoSecond == null) {
        return;
    }
    createCancellableNotification(isNotify, null, savedGuildInfoSecond.timeToFinishText - Date.now());

    return;
}
