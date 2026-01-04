// ==UserScript==
// @name           hwmTime
// @author         Tamozhnya1
// @namespace      Tamozhnya1
// @description    Время с секундами
// @version        5.7
// @include        *heroeswm.ru/*
// @include        *lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/464222/hwmTime.user.js
// @updateURL https://update.greasyfork.org/scripts/464222/hwmTime.meta.js
// ==/UserScript==

this.GM_getValue = this.GM_getValue || function(key, def) { return localStorage[key] || def; };
this.GM_setValue = this.GM_setValue || function(key, value) { localStorage[key] = value; };
this.GM_deleteValue = this.GM_deleteValue || function(key) { return delete localStorage[key]; };
let timePanel;
let online = "";
let pageEnterHours;
let pageEnterMinutes;
const isEn = document.documentElement.lang == "en";

main();
async function main() {
    findTimePanel();
    if(!timePanel) {
        return;
    }
    //console.log(`pageEnterHours: ${pageEnterHours}, pageEnterMinutes: ${pageEnterMinutes}, online: ${online}`);
    timePanel.addEventListener("click", showSettings);
    timePanel.title = isEn ? "Settings" : "Настройки";

    if(!GM_getValue("ClientServerTimeDifference")) {
        GM_deleteValue("LastClientServerTimeDifferenceRequestDate");
    }
    const gameDate = getGameDate();
    if(gameDate.getUTCHours() != pageEnterHours || gameDate.getUTCMinutes() != pageEnterMinutes) { // На клиенте часы идут не правильно (не путать с разницей в часовых поясах)
        await requestServerTime(true);
    }
    bindTimePanel();
    requestServerTime();
}
function findTimePanel() {
    const isNewInterface = document.querySelector("div.mm_item") ? true : false;
    if(isNewInterface) {
        timePanel = Array.from(document.querySelectorAll("div.sh_extra.sh_extra_right > div")).find(x => /\d+:\d+(:\d{2})?/.test(x.innerHTML));
        if(timePanel) {
            const timeTemplate = /(\d+):(\d+)(:\d{2})?/;
            const timeText = timeTemplate.exec(timePanel.innerText);
            //console.log([timePanel.innerHTML, timePanel.innerText, timeText]);
            if(timeText) {
                pageEnterHours = parseInt(timeText[1]);
                pageEnterMinutes = parseInt(timeText[2]);
            } else {
                console.log(timePanel.innerText);
            }
            return;
        }
    } else {
        timePanel = document.querySelector("td > a[href='https://gvdplayer.com/player.html']")?.closest("td");
        if(timePanel) {
            online = (/([^,]*)(, \d+ online.*)/.exec(timePanel.innerHTML))[2];
            const timeText = /(\d+):(\d+)(:\d{2})?, \d+ online/.exec(timePanel.firstChild.textContent);
            if(timeText) {
                pageEnterHours = parseInt(timeText[1]);
                pageEnterMinutes = parseInt(timeText[2]);
            } else {
                console.log(timePanel.firstChild.textContent);
            }
            return;
        }
    }
    const timeAndOnlineTemplate = /(\d+):(\d+)(:\d{2})?, \d+ online/;
    for(const currentCell of document.querySelectorAll('span')) {
        if(currentCell.innerHTML.indexOf("<span") != -1 || currentCell.innerHTML.search(timeAndOnlineTemplate) == -1) {
            continue;
        }
        timePanel = currentCell;
        online = (/([^,]*)(, \d+ online.*)/.exec(timePanel.innerHTML))[2];
        const timeText = timeAndOnlineTemplate.exec(timePanel.innerHTML);
        if(timeText) {
            pageEnterHours = parseInt(timeText[1]);
            pageEnterMinutes = parseInt(timeText[2]);
        } else {
            console.log(timePanel.innerHTML);
        }
    }
}
async function requestServerTime(force = false) {
    let requestInterval = 12 * 60 * 60 * 1000;
    const newRequestTime = parseInt(GM_getValue("LastClientServerTimeDifferenceRequestDate", 0)) + requestInterval; // Сделал раз в 12 часов. Все равно это только проверка спешки часов клиента
    if(force || newRequestTime < Date.now()) {
        await getRequestText("/time.php").then(function(responseText) {
            //throw "1";
            //console.log(responseText);
            const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
            if(responseParcing) {
                GM_setValue("ClientServerTimeDifference", Date.now() - (parseInt(responseParcing[1]) * 1000 + parseInt(GM_getValue("hwmTimeAddingIntervalMilliseconds", 0)))); // На сколько спешат часы клиента
            } else {
                throw (isEn ? `Parsing error: ${responseText}` : `Ошибка разбора: ${responseText}`);
            }
        }).catch(function(error) {
            console.log(error);
            const nowDate = new Date();
            const gameDate = new Date(Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), pageEnterHours, pageEnterMinutes, 0)); // Конструируем приближенное время, зная часы и минуты. Дата здесь безразлична, а время московское
            const serverDate = gameDate;
            serverDate.setUTCHours(serverDate.getUTCHours() - 3); // Делаем из московского - универсальное.
            //console.log(serverDate)
            GM_setValue("ClientServerTimeDifference", nowDate.getTime() - serverDate.getTime());
            requestInterval = 3600000; // В случае ошибок запрашиваем каждый час
        }).finally(function() {
            //console.log(`requestInterval: ${requestInterval}`);
            GM_setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
            setTimeout(requestServerTime, requestInterval);
        });
    } else {
        setTimeout(requestServerTime, newRequestTime - Date.now());
    }
}
function bindTimePanel() {
    const gameDate = getGameDate();
    timePanel.innerHTML = `${gameDate.getUTCHours()}:${gameDate.getUTCMinutes().toString().padStart(2, "0")}:${gameDate.getUTCSeconds().toString().padStart(2, "0")}${online}`;
    setTimeout(bindTimePanel, 1000);
}
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время
function getServerTime() { return Date.now() - parseInt(GM_getValue("ClientServerTimeDifference", 0)); } // Компенсация спешки часов клиента. К разнице часовых поясов это не имеет отношения.
function showSettings() {
    if(showPupupPanel(GM_info.script.name)) {
       return;
    }
    const fieldsMap = [];
    fieldsMap.push(["ClientServerLastRequestedTimeDifferenceMilliseconds:", `${parseInt(GM_getValue("ClientServerTimeDifference", 0))}`]);
    fieldsMap.push(["LastClientServerSyncDate:", `${new Date(parseInt(GM_getValue("LastClientServerTimeDifferenceRequestDate", 0))).toLocaleString()}`]);

    const hwmTimeAddingIntervalInput = createElement("input", { id: "hwmTimeAddingIntervalInput", type: "number", value: `${ GM_getValue("hwmTimeAddingIntervalMilliseconds", 0) }`, onfocus: `this.select();` });
    hwmTimeAddingIntervalInput.addEventListener("change", function() { GM_setValue("hwmTimeAddingIntervalMilliseconds", parseInt(this.value)); });

    fieldsMap.push([`${isEn ? 'Add time to page loading (ms.)' : "Добавлять время на загрузку страницы (мс.)"}`, hwmTimeAddingIntervalInput]);

    const hwmTimeRestartScriptSubmit = createElement("input", { id: "hwmTimeRestartScriptSubmit", type: "submit", value: `${isEn ? 'Restart the script' : "Перезапустить скрипт"}` });
    hwmTimeRestartScriptSubmit.addEventListener("click", reset);
    fieldsMap.push([hwmTimeRestartScriptSubmit]);

    createPupupPanel(GM_info.script.name, "Настройки " + GM_info.script.name, fieldsMap);
}
function reset() {
    GM_deleteValue("ClientServerTimeDifference");
    GM_deleteValue("LastClientServerTimeDifferenceRequestDate");
    hidePupupPanel(GM_info.script.name);
    location.reload(); //main(); // На панели замечены надписи NaN, а для начальной работы скрипта нужны нативные значения
}
// API
function createPupupPanel(panelName, panelTitle, fieldsMap) {
    let backgroundPopupPanel = addElement("div", document.body, { id: panelName + "1", style: "position: absolute; left: 0pt; width: 100%; background: none repeat scroll 0% 0% gray; opacity: 0.5; top: 0px; height: 100%; display: block; z-index: 200;" });
    backgroundPopupPanel.addEventListener("click", function() { hidePupupPanel(panelName); }, false);

    let popupPanel = addElement("div", document.body, { id: panelName + "2", style: `position: absolute; width: 650px; background: none repeat scroll 0% 0%; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); left: ${((document.body.offsetWidth - 650) / 2)}px; top: 150px; display: block; z-index: 200; border: 4mm ridge rgba(211, 220, 50, .6);` });
    let contentDiv = addElement("div", popupPanel, { id: panelName + "3", style: "border: 1px solid #abc; padding: 5px; margin: 2px; display: flex; flex-wrap: wrap;" });

    if(panelTitle) {
        addElement("b", contentDiv, { innerText: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" });
    }
    let divClose = addElement("div", contentDiv, {id: panelName + "close", title: "Close", innerText: "x", style: "border: 1px solid #abc; width: 15px; height: 15px; text-align: center; cursor: pointer;" });
    divClose.addEventListener("click", function() { hidePupupPanel(panelName); }, false);

    addElement("div", contentDiv, { style: "flex-basis: 100%; height: 0;"});

    if(fieldsMap) {
        let contentTable = addElement("table", contentDiv);
        for(let rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", contentDiv, { style: "flex-basis: 100%; height: 0;"});
                contentTable = addElement("table", contentDiv);
                continue;
            }
            const row = addElement("tr", contentTable);
            for(let cellData of rowData) {
                const cell = addElement("td", row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    return contentDiv;
}
function showPupupPanel(panelName) {
    let backgroundPopupPanel = document.getElementById(panelName + "1");
    let popupPanel = document.getElementById(panelName + "2");
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = popupPanel.style.display = 'block';
        return true;
    }
    return false;
}
function hidePupupPanel(panelName) {
    let backgroundPopupPanel = document.getElementById(panelName + "1");
    let popupPanel = document.getElementById(panelName + "2");
    backgroundPopupPanel.style.display = popupPanel.style.display = 'none';
}
function addElement(type, parent, data) {
    let el = createElement(type, data);
    if(parent) {
        parent.appendChild(el);
    }
    return el;
}
function createElement(type, data) {
    let el = document.createElement(type);
    if(data) {
        for(let key in data) {
            if(key == "innerText" || key == "innerHTML") {
                el[key] = data[key];
            } else {
                el.setAttribute(key, data[key]);
            }
        }
    }
    return el;
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}

