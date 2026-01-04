// ==UserScript==
// @name         hwmFallenArts
// @namespace    Tamozhnya1
// @version      2.6
// @description  Сигнализация, что в бою изношены арты
// @author       Tamozhnya1
// @include      *heroeswm.ru/war.php*
// @include      *lordswm.com/war.php*
// @include      *heroeswm.ru/inventory.php*
// @include      *lordswm.com/inventory.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/470349/hwmFallenArts.user.js
// @updateURL https://update.greasyfork.org/scripts/470349/hwmFallenArts.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
if(!playerIdMatch) {
    return;
}
const PlayerId = playerIdMatch[1];
const windowObject = window.wrappedJSObject || unsafeWindow;
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const finalResultDiv = document.getElementById("finalresult_text");
let beginArts;

main();
async function main() {
    if(location.pathname == '/inventory.php') {
        const fallenArts = JSON.parse(getPlayerValue("FallenArts", "{}")); console.log(fallenArts);
        for(const slot in fallenArts) {
            const art = fallenArts[slot];
            //console.log(art);
            const artToReplace = Array.from(windowObject.arts).find(x => x.art_id == art.artId && x.durability1 > 0 && x.dressed == 0 && x.art_in_forge == 0 && x.suffix == art.craft);
            if(artToReplace) {
                //console.log(artToReplace);
                tryDress(artToReplace);
            }
        }
        deletePlayerValue("FallenArts");
    }
    if(location.pathname == '/war.php') {
        deletePlayerValue("FallenArts");
        beginArts = await getArts();
        //console.log(beginArts);
        observe(finalResultDiv, checkArts);
    }
}
async function checkArts() {
    if(finalResultDiv.innerHTML.length > 10) {
        const finalArts = await getArts();
        //console.log(finalArts);
        const fallenArts = Object.keys(beginArts).filter(x => !finalArts[x]).map(x => beginArts[x]);
        if(fallenArts.length > 0) {
            finalResultDiv.innerHTML += `<a id=goInventoryDressNewRef href="inventory.php" title="${isEn ? "Go to inventory and put on new ones" : "Перейти в инвентарь и надеть новые"}"><font color="red">${isEn ? "The art is worn out" : "Износились арты"}: ${Object.keys(fallenArts).map(x => fallenArts[x].artName).join(", ")}</font></a>`;
            finalResultDiv.querySelector("a#goInventoryDressNewRef").addEventListener("click", function() { setPlayerValue("FallenArts", JSON.stringify(fallenArts)); });
        }
    }
}
async function getArts() {
    const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
    const slots = Array.from(doc.querySelectorAll("div[art_id]"));
    //console.log(slots.length);
    return slots.reduce((t, x) => {
        const image = x.querySelector("img[hint]");
        const artName = image.getAttribute("hint").split(" <br />")[0];
        let craft = "";
        const craftExec = /( \[([IDN]\d{1,2})?(E\d{1,2})?(A\d{1,2})?(W\d{1,2})?(F\d{1,2})?\])/.exec(artName);
        if(craftExec) {
            craft = craftExec[1];
        }
        const artRef = x.querySelector("a[href^='art_info.php?id']");
        t[x.id] = { artId: getUrlParamValue(artRef.href, "id"), artName: artName, craft: craft };
        return t;
    }, {});
}
async function tryDress(art) {
    var k = art['pos_dress'];
    if(k == 8) {
        if(windowObject.slots[8]) {
            if(!windowObject.slots[9]) {
                k = 9;
            } else {
                if(windowObject.last_ring_dress == 8) k = 9;
            }
        }
    }
    if(!art["dressed"] && (k > 0 || art['action'] == 'open')) {
        let responseText = await getRequestText(`/inventory.php?dress=${art.id}&js=1&last_ring_dress=${windowObject.last_ring_dress}&rand=${Math.random() * 1000000}`);
        if(responseText == "fail") {
            responseText = await getRequestText(`/inventory.php?dress=${art.id}&js=1&last_ring_dress=${windowObject.last_ring_dress}&rand=${Math.random() * 1000000}`);
        }
        dressHandle(responseText);
        if(k == 8 || k == 9) {
            windowObject.last_ring_dress = k;
        }
        windowObject.last_dress = k;
    }
}
function dressHandle(txt) {
    if (txt == 'fail' || txt.length > 5000) {
        console.log(txt)
        //console.log(windowObject.add_url)
        //window.location = 'inventory.php?1' + windowObject.add_url;
        return 0;
    } else if (txt) {
        var data = txt.split('|');
        if (data && data[0]) {
            if (data[0] == 'gift_box_opened_refresh' && data[1]) {
                window.location = 'inventory.php?gift_box_opened=' + data[1] + windowObject.add_url;
                return 0;
            }
            if (data.length > 20) {
                window.location = 'inventory.php?1' + windowObject.add_url;
                return 0;
            }
            windowObject.refresh_pl_params(data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11]);
            for (var i = 0; i < windowObject.arts_c; i++)
                if (windowObject.arts[i]["id"] == data[1]) {
                    document.getElementById('slot' + data[0]).innerHTML = windowObject.arts[i]['html'];
                    document.getElementById('slot' + data[0]).onclick = windowObject.try_undress;
                    document.getElementById('slot' + data[0]).setAttribute('art_id', windowObject.arts[i]["id"]);
                    windowObject.arts[i]['dressed'] = data[0];
                    if (windowObject.slots[data[0]] > 0) windowObject.inv_remove_dress_attr_from_array_by_id(windowObject.slots[data[0]]);
                    windowObject.slots[data[0]] = windowObject.arts[i]['id'];
                    break;
                }
        }
        windowObject.show_arts_in_category();
        windowObject.hide_hwm_hint(this, true);
    }
}
// API
function getRequest(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: "text/html; charset=windows-1251",
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
function observe(target, handler, config = { childList: true, subtree: true }) {
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        observer.observe(target, config);
    });
    ob.observe(target, config);
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
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
