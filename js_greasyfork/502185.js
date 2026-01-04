// ==UserScript==
// @name         AT版卷王监视器
// @namespace    https://atcoder.jp
// @version      1.3
// @description  在题目界面显示关注的人的通过情况
// @author       lnw143
// @match        https://atcoder.jp/*
// @connect      kenkoooo.com
// @connect      atcoder.jp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502185/AT%E7%89%88%E5%8D%B7%E7%8E%8B%E7%9B%91%E8%A7%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502185/AT%E7%89%88%E5%8D%B7%E7%8E%8B%E7%9B%91%E8%A7%86%E5%99%A8.meta.js
// ==/UserScript==

let user_list = localStorage.fav;

let mp = {};

if (localStorage.last == undefined) localStorage.last = '0';

if (new Date().getTime() - parseInt(localStorage.last) >= 1000 * 60 * 60) {
    delete localStorage.mp;
    localStorage.last = new Date().getTime();
}

if (localStorage.mp != undefined) mp = JSON.parse(localStorage.mp);

async function getrate(uid) {
    if (mp[uid] != undefined) return mp[uid];
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://kenkoooo.com/atcoder/proxy/users/" + uid + "/history/json",
            onload: async res => {
                const obj = JSON.parse(res.responseText);
                const rating = obj[obj.length - 1].NewRating;
                mp[uid] = parseInt(rating);
                localStorage.mp = JSON.stringify(mp);
                resolve(parseInt(rating));
            },
            onerror: () => {
                resolve(-1);
            }
        })
    });
}

async function GetColorByUser(uid) {
    let rating = await getrate(uid);
    if (rating < 400) return 'user-gray';
    if (400 <= rating && rating < 800) return 'user-brown';
    if (800 <= rating && rating < 1200) return 'user-green';
    if (1200 <= rating && rating < 1600) return 'user-cyan';
    if (1600 <= rating && rating < 2000) return 'user-blue';
    if (2000 <= rating && rating < 2400) return 'user-yellow';
    if (2400 <= rating && rating < 2800) return 'user-orange';
    if (2800 <= rating) return 'user-red';
}

var solved_list = new Array();
var rest;

async function upd(type) {
    function show(str2) {
        let str = "Solved by " + solved_list.length + str2 + ".";
        $('#solved_list').html(str);
    }
    let str2 = " friend";
    console.log(solved_list, solved_list.length);
    if (solved_list.length == 0) {
        if (type == 1) str2 += " (finished)";
    } else {
        if (solved_list.length > 1) str2 += "s";
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
            show(str2);
        }
    }
    show(str2);
}

async function check(uid, pid, bt) {
    if (bt == 0) console.log("checking ", uid);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=' + uid + '&from_second=' + bt,
        onload: async res => {
            const data = JSON.parse(res.responseText);
            if (data.length == 0) {
                console.log(uid, "didn't solve", pid);
                if (--rest == 0) await upd(1);
                return;
            }
            let lstt = 0;
            for (let val of data) {
                lstt = val.epoch_second;
                if (val.problem_id == pid && val.result == 'AC') {
                    solved_list.push(uid);
                    await upd(0);
                    console.log(uid, "solved", pid);
                    if (--rest == 0) await upd(1);
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

(async function () {
    'use strict';
    user_list = JSON.parse(user_list);
    console.log(user_list);
    const url = location.href;
    let pid = "", cnt = 0;
    for (let i = 0; i < url.length; ++i) {
        if (url[i] == '/') cnt++;
        else if (cnt >= 6) pid += url[i];
    }
    let problem_info = document.querySelector(`#main-div > div.container > div.row > div:nth-child\(2\) > span`).innerHTML;
    var list = $('<span>');
    list.css({
        'line-height': '1.1',
        'margin-top': '20px',
        'margin-bottom': '10px',
        'font-weight': 'bold',
        'font-size': '16px',
        'color': 'grey',
    });
    list.text('Fetching solved list...');
    list.attr('id', 'solved_list');
    $('#main-container > div.row > div:nth-child(2) > span.h2').after(list);
    $('#main-container > div.row > div:nth-child(2) > span.h2').after('<br>');
    rest = user_list.length;
    for (let i = 0; i < user_list.length; ++i) {
        let uid = user_list[i];
        await check(uid, pid, 0);
    }
})();