// ==UserScript==
// @name         Mug Report
// @namespace    mugreport.zero.torn
// @version      0.1
// @description  Shows mug amount
// @author       -zero [2669774]
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/473706/Mug%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/473706/Mug%20Report.meta.js
// ==/UserScript==


const sheetId = '1s_nF2HDoYDimbZcS5bY3cSvFo1aPgc1UKBv9aa6WToU';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'users';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
let data = {};
let locurl = window.location.href;
let curtime = Date.now();
let lastCheck = localStorage.mugCheckTime || "";


function init() {
    console.log('Init');

    if (lastCheck){
        if (lastCheck - Date.now() < 2*60*60*1000){
            return;
        }
    }


    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            console.log(response);
            let rep = response.responseText;
            let jdata = JSON.parse(rep.substr(47).slice(0, -2));

            for (let index in jdata.table.rows) {
                if (index == 0) {
                    continue;
                }

                let id = jdata.table.rows[index].c[0].v;


                data[id] = [
                    jdata.table.rows[index].c[1].v.toLocaleString("en-US"),
                    jdata.table.rows[index].c[2].v.toLocaleString("en-US"),
                    jdata.table.rows[index].c[3].v.toLocaleString("en-US"),
                    jdata.table.rows[index].c[4].v.toLocaleString("en-US"),
                ];
            }

            console.log(data);
            localStorage.mugData = JSON.stringify(data);
            localStorage.mugCheckTime = JSON.stringify(Date.now());


        }
    });

}

main();

async function main(){
    await init();
    display();
}

function display() {
    let url = window.location.href;

    let id = url.split("XID=")[1];

    let mugData = JSON.parse(localStorage.mugData);
    if (mugData[id]) {
        let avg = mugData[id][0];
        let best = mugData[id][1];
        let worst = mugData[id][2];
        let last = mugData[id][3];
        insert(avg, best, worst, last);
    }
}

function insert(a, b, c, d) {
    if ($(".profile-container").length == 0) {
        setTimeout(insert, 300, a,b,c,d);
        return;
    }

    let ins = `<p>Avg Mug: <b>${a}</b></p>
    <p>Best Mug: <b>${b}</b></p>
    <p>Worst Mug: <b>${c}</b></p>
    <p>Last Mug: <b>${d}</b></p>`;

    $($('.profile-container')[1]).prepend(ins);

}