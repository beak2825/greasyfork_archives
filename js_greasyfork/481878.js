// ==UserScript==
// @name        hwmDefenceNotifier
// @author      Tamozhnya1
// @namespace   Tamozhnya1
// @description Система уведомлений о защитах
// @include     *heroeswm.ru/*
// @version     1.9
// @require        https://update.greasyfork.org/scripts/490927/1360667/Tamozhnya1Lib.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM.xmlHttpRequest
// @grant       GM_openInTab
// @grant 		GM.notification
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481878/hwmDefenceNotifier.user.js
// @updateURL https://update.greasyfork.org/scripts/481878/hwmDefenceNotifier.meta.js
// ==/UserScript==

if(!PlayerId) {
    return;
}
const DefenceDuration = 15 * 60000; // Длительность защиты 15 минут
const DefenceWaitDuration = 45 * 60000; // Длительность ожидания защиты 45 минут
const scriptExecutingPageToken = Date.now().toString();
const tasks = {};
const notificationType = { DefenceWating: 1, DefenceStarting: 2, Defence: 3 };

main();
async function main() {
    if(!await checkMilitaryClan()) {
        return;
    }
    requestServerTime();
    setLastActiveTab();
    document.addEventListener("visibilitychange", setLastActiveTab);
    if(location.pathname == '/mapwars.php') {
        const taxlogRef = document.querySelector("a[href='taxlog.php']");
        const notificationsSettingsTitle = addElement("span", { style: "cursor: pointer;", innerHTML: " (<u>уведомления</u>)" }, taxlogRef.parentNode);
        notificationsSettingsTitle.addEventListener("click", showScriptOptions);
    }
    if(new Date(parseInt(getPlayerValue("TurnOffNotificationToday", 0))) >= today()) {
        return;
    }
    tasksAssignment();
    showCurrentNotification();
}
function showCurrentNotification() {
    //setPlayerValue("CurrentNotification", `{"Type":"1","Message":"The next-sibling combinator is made of the code point that separates two compound selectors. The elements represented by the two compound selectors share the same parent in the document tree and the element represented by the first compound selector immediately precedes the element represented by the second one. Non-element nodes (e.g. text between elements) are ignored when considering the adjacency of elements."}`);
    if(!isHeartOnPage) {
        return;
    }
    let currentNotificationHolder = document.querySelector("div#currentNotificationHolder");
    let currentNotificationContent = document.querySelector("div#currentNotificationContent");
    if(!currentNotificationHolder) {
        currentNotificationHolder = addElement("div", { id: "currentNotificationHolder", style: "display: flex; position: fixed; transition-duration: 0.8s; right: 0; bottom: -300px; width: 200px; border: 2px solid #000000; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); font: 9pt sans-serif;" }, document.body);
        currentNotificationContent = addElement("div", { id: "currentNotificationContent", style: "text-align: center;" }, currentNotificationHolder);
        const divClose = addElement("div", { title: isEn ? "Close" : "Закрыть", innerText: "x", style: "border: 1px solid #abc; flex-basis: 15px; height: 15px; text-align: center; cursor: pointer;" }, currentNotificationHolder);
        divClose.addEventListener("click", function() {
            const rect = currentNotificationHolder.getBoundingClientRect();
            currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
            deletePlayerValue("CurrentNotification");
        });
    }
    if(getPlayerValue("CurrentNotification")) {
        const notification = JSON.parse(getPlayerValue("CurrentNotification"));
        const isDefence = notification.Type == notificationType.Defence;
        const isSendBrowserNotification = getPlayerBool(isDefence ? "DefenceSendBrowserNotification" : "DefenceFoundSendBrowserNotification", true);
        currentNotificationContent.innerText = notification.Message;
        const rect = currentNotificationHolder.getBoundingClientRect();
        currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
        if(isSendBrowserNotification) {
            currentNotificationHolder.style.bottom = "0";
        }
    }
}
async function checkMilitaryClan() {
    if(!getPlayerValue(`MilitaryClanId`) || location.pathname == '/pl_clans.php') {
        const doc = location.pathname == '/pl_clans.php' ? document : await getRequest(`/pl_clans.php`);
        if(location.pathname == '/pl_clans.php') {
            deletePlayerValue(`MilitaryClanId`);
        }
        const clanInfos = Array.from(doc.querySelectorAll("td > li > a[href^='clan_info.php']")).map(x => { return { Id: getUrlParamValue(x.href, "id"), Name: x.firstChild.innerText, Ref: x.href }; });
        for(const clanInfo of clanInfos) {
            const clanInfoDoc = await getRequest(clanInfo.Ref);
            if(clanInfoDoc.body.innerHTML.includes(isEn ? "[Military clan]" : "[боевой клан]")) {
                setPlayerValue(`MilitaryClanId`, clanInfo.Id);
                break;
            }
        }
    }
    if(!getPlayerValue(`MilitaryClanId`)) {
        console.log("Вы не состоите в боевом клане");
        return false;
    }
    return true;
}
function setLastActiveTab() {
    if(document.visibilityState == "visible") {
        setPlayerValue("LastActiveTab", scriptExecutingPageToken); // код отвечает за то, чтоб уведомления исходили только из последней активной вкладки, а не случайной.
    }
}
async function tasksAssignment(isForce = false) {
    let defences = restoreDefences();
    // В начале каждой пятиминутки ищем новые защиты
    const defenceSearchNeeded = truncToFiveMinutes(getServerTime()) > truncToFiveMinutes(getPlayerValue("LastSearchDate", 0)); // Текущая пятиминутка больше пятиминутки последнего опроса
    if(isForce || defenceSearchNeeded || location.pathname == "/mapwars.php") {
        defences = await findDefences();
    }
    // Распределение заданий
    const nearestDefenceTime = parseInt(getPlayerValue("NearestDefenceTime", 0));
    if(nearestDefenceTime > 0) {
        let notifications = [];
        // Вычисление всех дат оповещения
        for(const isDefence of [false, true]) {
            const startNotification = parseInt(getPlayerValue(isDefence ? "StartNotificationAboutDefenceEnd" : "StartNotificationAboutDefenceBegin", 0)); // Начинать оповещение о начале или конце за столько минут. Если пусто, то не оповещать, если ноль, то в момент события
            if(startNotification > 0) {
                // Вылидация начала оповещения
                const startNotificationMax = isDefence ? 15 : 45;
                if(startNotification > startNotificationMax) {
                    startNotification = startNotificationMax;
                }
                const eventTime = nearestDefenceTime - (isDefence ? 0 : DefenceDuration);
                //console.log(`nearestDefenceTime: ${new Date(nearestDefenceTime).toLocaleString()}, eventTime: ${new Date(eventTime).toLocaleString()}`)
                const notificationInterval = parseInt(getPlayerValue(isDefence ? "NotificationIntervalAboutDefenceEnd" : "NotificationIntervalAboutDefenceBegin", 0)); // Интервал оповещений о начале или конце в минутах. Если пусто или ноль, то оповестить один раз
                let currentNotificationTime = eventTime - startNotification * 60000;
                //console.log(`eventTime: ${toTimeFormat(new Date(eventTime))}, startNotification: ${startNotification}, notificationInterval: ${notificationInterval}`);
                while(currentNotificationTime < eventTime) {
                    notifications.push({ Time: currentNotificationTime, Type: isDefence ? notificationType.Defence : notificationType.DefenceWating, DefenceTime: nearestDefenceTime });
                    currentNotificationTime += notificationInterval * 60000;
                }
            }
        }
        if(getPlayerValue("OnceBeforeDefence")) {
            notifications.push({ Time: nearestDefenceTime - DefenceDuration - parseInt(getPlayerValue("OnceBeforeDefence")) * 1000, Type: notificationType.DefenceStarting }); // Оповещение, что защита вот-вот начнётся
        }
        notifications = notifications.filter(x => x.Time > getServerTime());
        //console.log(Object.keys(notifications).map(x => toTimeFormat(new Date(notifications[x].Time), 3) + " " + notifications[x].Type));
        // Ставим таймеры на все оповещения
        for(const notification of notifications) {
            if(!tasks[notification.Time]) {
                tasks[notification.Time] = setTimeout(function() { executeTask(notification); }, notification.Time - getServerTime());
            }
        }
        for(const notificationTime in tasks) {
            if(notificationTime < getServerTime()) {
                clearTimeout(tasks[notificationTime]);
                delete tasks[notificationTime];
            }
        }
    }
    if(getPlayerValue("CurrentNotification")) {
        const notification = JSON.parse(getPlayerValue("CurrentNotification"));
        if(nearestDefenceTime == 0 || nearestDefenceTime > notification.DefenceTime) {
            deletePlayerValue("CurrentNotification");
        }
    }
    const nextDefencesRequestDate = truncToFiveMinutes(getServerTime()) + 300000 + 5000; // Вычисляем текущую пятиминутку на сервере, добавляем 5 минут, и на всякий случай 5 секунд
    setTimeout(tasksAssignment, nextDefencesRequestDate - getServerTime());
}
async function executeTask(notification) {
    if(new Date(parseInt(getPlayerValue("TurnOffNotificationToday", 0))) >= today()) {
        return;
    }
    if(getPlayerValue("LastActiveTab", scriptExecutingPageToken) != scriptExecutingPageToken) {
        return;
    }
    //console.log(`Сообщение запоздало на: ${getServerTime() - notification.Time} миллисекунд`);
    let defences = restoreDefences();
    const nearestDefenceTime = parseInt(getPlayerValue("NearestDefenceTime", 0));
    if(nearestDefenceTime == 0) {
        return;
    }
    const isDefence = notification.Type == notificationType.Defence; // Защита началась
    const isPlaySound = getPlayerBool(isDefence ? "DefencePlaySound" : "DefenceFoundPlaySound", true);
    if(isPlaySound) {
        const soundSource = getPlayerValue(isDefence ? "DefenceAudioPath" : "DefenceFoundAudioPath") || "data:audio/mp3;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSxJyD2NYKbAeZN0gAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksQ5A8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
        new Audio(soundSource).play();
    }
    const isSendNotification = getPlayerBool(isDefence ? "DefenceSendNotification" : "DefenceFoundSendNotification", true);
    const isSendBrowserNotification = getPlayerBool(isDefence ? "DefenceSendBrowserNotification" : "DefenceFoundSendBrowserNotification", true);
    if(isSendNotification || isSendBrowserNotification) {
        let message = "";
        let defence = defences[nearestDefenceTime];
        switch(notification.Type) {
            case notificationType.DefenceWating:
                const eventTime = nearestDefenceTime - DefenceDuration;
                message = `Начало защиты в ${toTimeFormat(new Date(eventTime))}, осталось: ${formatInterval(eventTime - getServerTime())}, контроль объекта ${defence.objectControlPercent}%`;
                const otherDefenceTimes = Object.keys(defences).filter(x => parseInt(x) != nearestDefenceTime);
                const otherDefenceTimesText = otherDefenceTimes.map(x => toTimeFormat(new Date(x - DefenceDuration))).join(", ");
                if(otherDefenceTimesText && otherDefenceTimesText != "") {
                    message += `\nЕщё защита(ы) в ${otherDefenceTimesText}`;
                }
                break;
            case notificationType.DefenceStarting:
                message = `Защита ${toTimeFormat(new Date(nearestDefenceTime - DefenceDuration))} вот-вот начнется!`;
                break;
            case notificationType.Defence:
                defences = await findDefences();
                defence = defences[nearestDefenceTime];
                message = `Идет защита до ${toTimeFormat(new Date(nearestDefenceTime))}
не закрыто дорожек ${defence.openedTracks}
свободных мест ${defence.freePlaces}
ожидаемый контроль ${defence.objectControlPercentAfterDefence}%`;
                break;
        }
        if(isSendNotification) {
            GM.notification(message, "ГВД", "https://dcdn1.heroeswm.ru/i/bselect/mapwars.png?v=3aa", function() { window.focus(); GM_openInTab("/mapwars.php"); });
        }
        if(isSendBrowserNotification) {
            notification.Message = message;
            setPlayerValue("CurrentNotification", JSON.stringify(notification));
            showCurrentNotification();
        }
    }
}
function formatInterval(interval) {
    let diff = interval;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const mimutes = Math.floor(diff / 1000 / 60);
    diff -= mimutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    const formatedTime = (hours > 0 ? hours + ":" : "") + `${mimutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formatedTime;
}
async function findDefences() {
    const doc = location.pathname == "/mapwars.php" ? document : await getRequest("/mapwars.php");
    const defenceTable = doc.querySelector("body > center > table:nth-child(2) * table * table.wbwhite");
    const defences = {};
    if(defenceTable) {
        for(const row of defenceTable.rows) {
            if(row.cells[1].querySelector(`a[href='clan_info.php?id=${getPlayerValue(`MilitaryClanId`)}']`)) {
                const defenceEndExec = /(\d{1,2}:\d{1,2})/.exec(row.cells[0].innerHTML);
                if(defenceEndExec) {
                    const defenceTime = parseDate(defenceEndExec[1], true).getTime();
                    const defenceObjectRef = row.cells[1].querySelector("a[href^='object-info.php']");
                    let defenceObjectId = null;
                    let objectControlPercent = 0;
                    if(defenceObjectRef) {
                        defenceObjectId = getUrlParamValue(defenceObjectRef.href, "id");
                        objectControlPercent = await getObjectControlPercent(defenceObjectId);
                    }
                    let openedTracks = 0;
                    let freePlaces = 0;
                    if(!row.cells[2].innerHTML.match(/вступление на защиту с \d{1,2}:\d{1,2}/)) {
                        const tracks = row.cells[2].innerHTML.split("<br>").filter(x => x.match(/[1-7]{1}\)/));
                        for(const track of tracks) {
                            const playersOnTrack = (track.match(/pl_info/g) || []).length;
                            if(playersOnTrack < 2) {
                                openedTracks++;
                                freePlaces += 2 - playersOnTrack;
                            }
                        }
                    } else {
                        openedTracks = 7;
                        freePlaces = 14;
                    }
                    defences[defenceTime] = {
                        freePlaces: freePlaces,
                        openedTracks: openedTracks,
                        objectControlPercent: objectControlPercent,
                        objectControlPercentAfterDefence: Math.max(objectControlPercent - 15 * openedTracks, 0),
                        defenceObjectId: defenceObjectId
                    };
                    //console.log(new Date(defenceTime).toLocaleString());
                }
            }
        }
    }
    //console.log(defences)
    storeDefences(defences);
    setPlayerValue("LastSearchDate", getServerTime());
    return defences;
}
function calcIsDefence() { return getPlayerValue("NearestDefenceTime") && getServerTime() >= parseInt(getPlayerValue("NearestDefenceTime")) - DefenceDuration; }
function restoreDefences() {
    const defences = JSON.parse(getPlayerValue("Defences", "{}"));
    for(const key in defences) {
        const defenceTime = parseInt(key);
        if(defenceTime < getServerTime() || defenceTime > getServerTime() + DefenceWaitDuration + DefenceDuration) {
            delete defences[key]; // Защита устарела или мусор из будущего
            var isPacked = true;
        } else {
            defences[key] = JSON.parse(defences[key]);
        }
    }
    if(isPacked) {
        storeDefences(defences);
    }
    return defences;
}
function storeDefences(defences) {
    const nearestDefenceTime = Object.keys(defences).reduce((t, x) => t == 0 ? parseInt(x) : Math.min(t, parseInt(x)), 0);
    if(nearestDefenceTime > 0) {
        setPlayerValue("NearestDefenceTime", nearestDefenceTime);
    } else {
        deletePlayerValue("NearestDefenceTime");
    }
    const t = Object.keys(defences).reduce((t, x) => ({...t, [x]: JSON.stringify(defences[x])}), {});
    setPlayerValue("Defences", JSON.stringify(t));
}
function toTimeFormat(date, parts = 2) {
    const dateParts = date.toLocaleString().split(" ");
    return dateParts.find(x => x.includes(":")).split(":", parts).join(":");
}
async function getObjectControlPercent(objectId) {
    const doc = await getRequest(`/clan_info.php?id=${getPlayerValue(`MilitaryClanId`)}`);
    const objectRow = doc.querySelector(`td.wbwhite > table.wb * a[href='object-info.php?id=${objectId}']`).closest("tr");
    const controlPercentCell = objectRow.cells[objectRow.cells.length - 1];
    const objectControlPercent = parseFloat(controlPercentCell.innerText.replace("%", ""));
    return objectControlPercent;
}
function showScriptOptions() {
    if(showPupupPanel(GM_info.script.name, onScriptOptionToggle)) {
        return;
    }
    const fieldsMap = [];
    const defenceWaitTitle = addElement("span", { innerText: "Начало защиты" });
    const defenceTitle = addElement("span", { innerText: "Окончание защиты" });
    fieldsMap.push([null, defenceWaitTitle, defenceTitle]);

    const startNotificationAboutDefenceBeginLabel = addElement("label", { for: "startNotificationAboutDefenceBeginInput", innerText: "Начинать оповещения за столько минут" + "\t" });
    const startNotificationAboutDefenceBeginInput = addElement("input", { id: "startNotificationAboutDefenceBeginInput", type: "number", value: getPlayerValue("StartNotificationAboutDefenceBegin"), onfocus: "this.select();" });
    startNotificationAboutDefenceBeginInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("StartNotificationAboutDefenceBegin", this.value); });

    const startNotificationAboutDefenceEndInput = addElement("input", { id: "startNotificationAboutDefenceEndInput", type: "number", value: getPlayerValue("StartNotificationAboutDefenceEnd"), onfocus: "this.select();" });
    startNotificationAboutDefenceEndInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("StartNotificationAboutDefenceEnd", this.value); });

    fieldsMap.push([startNotificationAboutDefenceBeginLabel, startNotificationAboutDefenceBeginInput, startNotificationAboutDefenceEndInput]);


    const notificationIntervalAboutDefenceBeginLabel = addElement("label", { for: "notificationIntervalAboutDefenceBeginInput", innerText: "Интервал оповещения, минут" + "\t" });
    const notificationIntervalAboutDefenceBeginInput = addElement("input", { id: "notificationIntervalAboutDefenceBeginInput", type: "number", value: getPlayerValue("NotificationIntervalAboutDefenceBegin"), onfocus: "this.select();" });
    notificationIntervalAboutDefenceBeginInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("NotificationIntervalAboutDefenceBegin", this.value); });

    const notificationIntervalAboutDefenceEndInput = addElement("input", { id: "notificationIntervalAboutDefenceEndInput", type: "number", value: getPlayerValue("NotificationIntervalAboutDefenceEnd"), onfocus: "this.select();" });
    notificationIntervalAboutDefenceEndInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("NotificationIntervalAboutDefenceEnd", this.value); });

    fieldsMap.push([notificationIntervalAboutDefenceBeginLabel, notificationIntervalAboutDefenceBeginInput, notificationIntervalAboutDefenceEndInput]);


    const defenceFoundPlaySoundLabel = addElement("label", { for: "defenceFoundPlaySoundInput", innerText: "Проиграть звук" + "\t" });
    const defenceFoundPlaySoundInput = addElement("input", { id: "defenceFoundPlaySoundInput", type: "checkbox" });
    defenceFoundPlaySoundInput.checked = getPlayerBool("DefenceFoundPlaySound", true);
    defenceFoundPlaySoundInput.addEventListener("change", function() { setPlayerValue("DefenceFoundPlaySound", this.checked); });
    const defencePlaySoundInput = addElement("input", { id: "defencePlaySoundInput", type: "checkbox" });
    defencePlaySoundInput.checked = getPlayerBool("DefencePlaySound", true);
    defencePlaySoundInput.addEventListener("change", function() { setPlayerValue("DefencePlaySound", this.checked); });

    fieldsMap.push([defenceFoundPlaySoundLabel, defenceFoundPlaySoundInput, defencePlaySoundInput]);

    const defenceFoundAudioPathLabel = addElement("label", { for: "defenceFoundAudioPathInput", innerText: "Mp3 url" + "\t" });
    const defenceFoundAudioPathInput = addElement("input", { id: "defenceFoundAudioPathInput", type: "text", value: getPlayerValue("DefenceFoundAudioPath", ""), onfocus: "this.select();" });
    defenceFoundAudioPathInput.addEventListener("change", function() { gmSetOrDeleteString("DefenceFoundAudioPath", this.value); });

    const defenceAudioPathInput = addElement("input", { id: "defenceAudioPathInput", type: "text", value: getPlayerValue("DefenceAudioPath", ""), onfocus: "this.select();" });
    defenceAudioPathInput.addEventListener("change", function() { gmSetOrDeleteString("DefenceAudioPath", this.value); });

    fieldsMap.push([defenceFoundAudioPathLabel, defenceFoundAudioPathInput, defenceAudioPathInput]);


    const defenceFoundSendNotificationLabel = addElement("label", { for: "defenceFoundSendNotificationInput", innerText: "Прислать оповещение" + "\t" });
    const defenceFoundSendNotificationInput = addElement("input", { id: "defenceFoundSendNotificationInput", type: "checkbox" });
    defenceFoundSendNotificationInput.checked = getPlayerBool("DefenceFoundSendNotification", true);
    defenceFoundSendNotificationInput.addEventListener("change", function() { setPlayerValue("DefenceFoundSendNotification", this.checked); });
    const defenceSendNotificationInput = addElement("input", { id: "defenceSendNotificationInput", type: "checkbox" });
    defenceSendNotificationInput.checked = getPlayerBool("DefenceSendNotification", true);
    defenceSendNotificationInput.addEventListener("change", function() { setPlayerValue("DefenceSendNotification", this.checked); });

    fieldsMap.push([defenceFoundSendNotificationLabel, defenceFoundSendNotificationInput, defenceSendNotificationInput]);

    const defenceFoundSendBrowserNotificationLabel = addElement("label", { for: "defenceFoundSendBrowserNotificationInput", innerText: "Показать оповещение в браузере" + "\t" });
    const defenceFoundSendBrowserNotificationInput = addElement("input", { id: "defenceFoundSendBrowserNotificationInput", type: "checkbox" });
    defenceFoundSendBrowserNotificationInput.checked = getPlayerBool("DefenceFoundSendBrowserNotification", true);
    defenceFoundSendBrowserNotificationInput.addEventListener("change", function() { setPlayerValue("DefenceFoundSendBrowserNotification", this.checked); });
    const defenceSendBrowserNotificationInput = addElement("input", { id: "defenceSendBrowserNotificationInput", type: "checkbox" });
    defenceSendBrowserNotificationInput.checked = getPlayerBool("DefenceSendBrowserNotification", true);
    defenceSendBrowserNotificationInput.addEventListener("change", function() { setPlayerValue("DefenceSendBrowserNotification", this.checked); });

    fieldsMap.push([defenceFoundSendBrowserNotificationLabel, defenceFoundSendBrowserNotificationInput, defenceSendBrowserNotificationInput]);

    const onceBeforeDefenceLabel = addElement("label", { for: "onceBeforeDefenceInput", innerText: "Дать одиночное оповещение за столько секунд до начала защиты" + "\t" });
    const onceBeforeDefenceInput = addElement("input", { id: "onceBeforeDefenceInput", type: "number", value: getPlayerValue("OnceBeforeDefence"), onfocus: "this.select();" });
    onceBeforeDefenceInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("OnceBeforeDefence", this.value); });

    fieldsMap.push([onceBeforeDefenceLabel, onceBeforeDefenceInput]);

    const turnOffNotificationTodayLabel = addElement("label", { for: "turnOffNotificationTodayInput", innerText: "Отключить уведомления на сегодня" + "\t" });
    const turnOffNotificationTodayInput = addElement("input", { id: "turnOffNotificationTodayInput", type: "checkbox" });
    turnOffNotificationTodayInput.checked = parseInt(getPlayerValue("TurnOffNotificationToday", 0)) >= toServerTime(today().getTime()) ? true : false;
    turnOffNotificationTodayInput.addEventListener("change", function() { if(this.checked) { setPlayerValue("TurnOffNotificationToday", getServerTime()); } else { deletePlayerValue("TurnOffNotificationToday"); } });

    fieldsMap.push([turnOffNotificationTodayLabel, turnOffNotificationTodayInput]);

    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap, onScriptOptionToggle);
}
function onScriptOptionToggle(isShown) {
    if(isShown) {
        setTimeout("clearTimeout(Timer)", 0); // Вкл/выкл таймер обновления страницы (взаимодействие со скриптом на странице)
    } else {
        setTimeout("Refresh()", 0);
    }
}
