// ==UserScript==
// @name         filter planet
// @namespace    http://github.com/harryhare
// @version      0.1.2
// @description  Delete level 0 & level 1 planet of dark forest
// @author       You
// @match        https://zkga.me/play/*
// @match        https://dfgame.277dao.com/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/442222/filter%20planet.user.js
// @updateURL https://update.greasyfork.org/scripts/442222/filter%20planet.meta.js
// ==/UserScript==

function get_planet_level(id) {
    let str = id.substring(8, 14);
    let s = parseInt(str, 16);
    //const PLANET_LEVEL_THRESHOLDS=df.contractConstants.planetLevelThresholds;
    const PLANET_LEVEL_THRESHOLDS = [
        16777216,
        4194292,
        1048561,
        262128,
        65520,
        16368,
        4080,
        1008,
        240,
        48
    ];
    let level = -1;
    for (let i = 9; i >= 0; i--) {
        if (s < PLANET_LEVEL_THRESHOLDS[i]) {
            level = i;
            break;
        }
    }
    return level;
}

function delete_small(value) {
    let filtered = [];
    for (let i = 0; i < value.l.length; i++) {
        const h = value.l[i].h;
        const level = get_planet_level(h);
        if (level >= 2) {
            filtered.push(value.l[i]);
        }
    }
    console.log(filtered.length);
    value.l = filtered;
    return value;
}


async function openDB(db_name) {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(db_name);
        request.onupgradeneeded = function (event) {
            console.log("upgrade needed");
            resolve(event.target.result);
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function update(db, table_name, key, value) {
    return new Promise((resolve, reject) => {
        let request = db.transaction(table_name, "readwrite").objectStore(table_name).put(value, key);
        request.onsuccess = function (event) {
            resolve(event.target.result);
            console.log("update", key);
        };
        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function filterAll(db) {
    return new Promise((resolve, reject) => {
        const table_name = "knownBoard";
        var request = db.transaction(table_name).objectStore(table_name).openCursor();
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                console.log('id: ', cursor.id);
                console.log('key: ', cursor.key);
                console.log('value: ', cursor.value);
                update(db, table_name, cursor.key, delete_small(cursor.value));
                cursor.continue();
            } else {
                console.log('没有更多数据了！');
                resolve(event.target.result);
            }
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

(function () {
    'use strict';
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.height = "200px";
    container.style.width = "200px";


    let input = document.createElement("input");
    input.style.width = "100%";
    input.placeholder = "address";

    let button = document.createElement("button");
    button.style.width = "100%";
    button.style.backgroundColor = "grey";
    button.innerText = "过滤星球";
    button.onclick = async () => {
        let gameId = window.location.href.substring("31");
        //let userId = '0xb4de376b58a5a0e0b57ccf497ae902d8f2101588';
        let userId = input.value;
        if (gameId.length !== 42) {
            return;
        }
        if (userId.length !== 42) {
            return;
        }
        //db_name = "darkforest-0x65580edf65670620be0965d22544a8e9c7955eb1-0xb4de376b58a5a0e0b57ccf497ae902d8f2101588";
        let db_name = `darkforest-${gameId}-${userId}`;
        console.log(db_name);

        button.innerText="过滤中...";
        button.disabled=true;

        let db = await openDB(db_name);
        await filterAll(db);

        button.innerText="过滤星球";
        button.disabled=false;
    };


    container.appendChild(input);
    container.appendChild(button);
    document.body.appendChild(container);
})();