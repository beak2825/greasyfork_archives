// ==UserScript==
// @name         atcoder friend problemset
// @namespace    https://atcoder.jp
// @version      0.1
// @description  Show friend's accepted submissions.
// @author       Enucai
// @match        https://atcoder.jp/*
// @connect      kenkoooo.com
// @connect      atcoder.jp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474583/atcoder%20friend%20problemset.user.js
// @updateURL https://update.greasyfork.org/scripts/474583/atcoder%20friend%20problemset.meta.js
// ==/UserScript==

let user_list = localStorage.fav;

let mp = {};

async function getrate(uid) {
    if (mp[uid] != undefined) return mp[uid];
    let tmp = await fetch("https://atcoder.jp/users/" + uid);
    let lim = 0;
    while (tmp.status != 200 && lim <= 5) {
        tmp = await fetch("https://atcoder.jp/users/" + uid);
        lim += 1;
    }
    let content = await tmp.text();
    let pos = content.indexOf('<tr><th class="no-break">Rating</th><td><span');
    let rating = "", f = 0;
    let len = content.length;
    for (let i = pos; i < len; ++i) {
        if (f) {
            if (content[i] >= '0' && content[i] <= '9') rating = rating + content[i];
            else break;
        } else {
            if (content[i] >= '0' && content[i] <= '9') {
                rating = rating + content[i];
                f = 1;
            }
        }
    }
    // console.log("getting", uid);
    mp[uid] = parseInt(rating);
    return parseInt(rating);
}

async function GetColorByUser(uid) {
//    let x = Math.floor(Math.random() * 8);
//    if (x == 0) return "user-gray";
//    if (x == 1) return "user-brown";
//    if (x == 2) return "user-green";
//    if (x == 3) return "user-cyan";
//    if (x == 4) return "user-blue";
//    if (x == 5) return "user-yellow";
//    if (x == 6) return "user-orange";
//    if (x == 7) return "user-red";
    let rating = await getrate(uid);
	if ( rating < 400 ) return 'user-gray';
	if ( 400 <= rating && rating < 800 ) return 'user-brown';
	if ( 800 <= rating && rating < 1200 ) return 'user-green';
	if ( 1200 <= rating && rating < 1600 ) return 'user-cyan';
	if ( 1600 <= rating && rating < 2000 ) return 'user-blue';
	if ( 2000 <= rating && rating < 2400 ) return 'user-yellow';
	if ( 2400 <= rating && rating < 2800 ) return 'user-orange';
	if ( 2800 <= rating ) return 'user-red';
}

var solved_list = new Array();
var bef;

let res_str;
let call = 0, rest;

async function upd(type) {
    let str = "";
    let str2 = "";
    str += "<span style = \"font-size: 16px; color: grey;\">Solved by ";
    console.log(solved_list, solved_list.length);
    str2 += " friend";
    if (solved_list.length == 0) {
        if (type == 1) str2 += " (finished)";
    } else {
        str2 += "s";
        if (type == 1) str2 += " (finished)";
        str2 += ": ";
        for (let i = 0; i < solved_list.length; ++i) {
            str2 += "<span class="
            str2 += "\"";
            str2 += (await GetColorByUser(solved_list[i]));
            str2 += "\"";
            str2 += ">";
            str2 += solved_list[i];
            str2 += "</span>";
            if (i != solved_list.length - 1) str2 += ", ";
        }
    }
    str = str + solved_list.length + str2 + ".</span>";
    document.querySelector(`#main-div > div.container > div.row > div:nth-child\(2\) > span`).innerHTML = bef + str;
}

async function check(uid, pid, bt) {
    console.log(uid);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=' + uid + '&from_second=' + bt,
        onload: async res => {
            const data = JSON.parse(res.responseText);
            if (data.length == 0) {
                rest -= 1;
                 console.log(rest);
                if (rest == 0) await upd(1);
                return;
            }
            let lstt = 0;
            for (let val of data) {
                lstt = val.epoch_second;
                if (val.problem_id == pid && val.result == 'AC') {
                    solved_list.push(uid);
                    await upd(0);
                    // console.log("ok");
                    rest -= 1;
                    console.log(rest);
                    if (rest == 0) await upd(1);
                    return;
                }
            }
            await check(uid, pid, lstt + 1);
        },
        onerror: () => {
            return;
        }
    });
}

(async function() {
    'use strict';
    user_list = JSON.parse(user_list);
    console.log(user_list);
	const url = location.href;
    let pid = "", cnt = 0;
    for (let i = 0; i < url.length; ++i) {
        if (url[i] == '/') cnt++;
        else if (cnt >= 6) pid += url[i];
    }
    // console.log(pid);
    let problem_info = document.querySelector(`#main-div > div.container > div.row > div:nth-child\(2\) > span`).innerHTML;
    bef = document.querySelector(`#main-div > div.container > div.row > div:nth-child\(2\) > span`).innerHTML + "</br>";
    res_str = bef;
    rest = user_list.length;
    // console.log(bef);
    for (let i = 0; i < user_list.length; ++i) {
        let uid = user_list[i];
        await check(uid, pid, 0);
    }
})();