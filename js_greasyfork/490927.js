// ==UserScript==
// @name           Tamozhnya1Lib
// @namespace      Tamozhnya1
// @author         Tamozhnya1
// @description    Библиотека с общими функциями. (Устанавливать не надо)
// @version        1.7
// @include        *heroeswm.ru/*
// @include        *lordswm.com/*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
const PlayerId = playerIdMatch ? playerIdMatch[1] : "";
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
const isHeartOnPage = (document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile")) ? true : false;
const isMooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

// Array and object
function groupBy(list, keyFieldOrSelector) { return list.reduce(function(t, item) { const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector]; (t[keyValue] = t[keyValue] || []).push(item); return t; }, {}); };
function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }
function findKey(obj, selector) { return Object.keys(obj).find(selector); }
function pushNew(array, newValue) { if(array.indexOf(newValue) == -1) { array.push(newValue); } }
function sortBy(field, reverse, evaluator) {
    const key = evaluator ? function(x) { return evaluator(x[field]); } : function(x) { return x[field]; };
    return function(a, b) { return a = key(a), b = key(b), (reverse ? -1 : 1) * ((a > b) - (b > a)); }
}
// HttpRequests
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.responseType = type;

          xhr.onload = () => {
            if (xhr.status === 200) return resolve(xhr.response);
            throwError(`Error with status ${xhr.status}`);
          };

          xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

          xhr.send(body);

          function throwError(msg) {
            const err = new Error(msg);
            err.status = xhr.status;
            reject(err);
          }
    });
}
// Storage
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function setOrDeleteNumberValue(key, value) {
    if(!value || value == "" || isNaN(Number(value))) {
        deleteValue(key);
    } else {
        setValue(key, value);
    }
}
function setOrDeleteNumberPlayerValue(key, value) { setOrDeleteNumberValue(key + PlayerId, value); }
function getStorageKeys(filter) { return listValues().filter(filter); }
// Html DOM
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findChildrenTextContainsValue(selector, value) { return Array.from(document.querySelectorAll(selector)).reduce((t, x) => { const match = Array.from(x.childNodes).filter(y => y.nodeName == "#text" && y.textContent.includes(value)); return [...t, ...match]; }, []); }
// Popup panel
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
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
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
// Script autor and url
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
// Server time
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function toServerTime(clientTime) { return clientTime -  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function toClientTime(serverTime) { return serverTime +  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function truncToFiveMinutes(time) { return Math.floor(time / 300000) * 300000; }
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 6 * 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское // Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
// Misc
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        setPlayerValue("UserName", document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText);
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function showBigData(data) { console.log(data); /*addElement("TEXTAREA", { innerText: data }, document.body);*/ }
function round0(value) { return Math.round(value * 10) / 10; }
function round00(value) { return Math.round(value * 100) / 100; }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}
// UpdatePanels
// Если используется url, то это должна быть та же локация с другими параметрами
async function refreshUpdatePanels(panelSelectors, postProcessor, url = location.href) {
    panelSelectors = Array.isArray(panelSelectors) ? panelSelectors : [panelSelectors];
    let freshDocument;
    for(const panelSelector of panelSelectors) {
        const updatePanel = panelSelector(document);
        //console.log(panelSelector.toString())
        //console.log(updatePanel)
        if(updatePanel) {
            freshDocument = freshDocument || await getRequest(url);
            const freshUpdatePanel = panelSelector(freshDocument);
            if(!freshUpdatePanel) {
                console.log(updatePanel)
                continue;
            }
            if(postProcessor) {
                postProcessor(freshUpdatePanel);
            }
            updatePanel.innerHTML = freshUpdatePanel.innerHTML;
            Array.from(updatePanel.querySelectorAll("script")).forEach(x => {
                x.insertAdjacentElement("afterend", addElement("script", { innerHTML: x.innerHTML })); // Передобавляем скрипты, как элементы, что они сработали
                x.remove();
            });
        }
    }
    if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
    return freshDocument;
}
