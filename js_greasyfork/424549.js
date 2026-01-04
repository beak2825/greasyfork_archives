// ==UserScript==
// @name         empty the blacklist
// @namespace    https://github.com/harryhare/
// @version      0.0.2
// @description  一键清空黑名单
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/contacts/blacklist**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424549/empty%20the%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/424549/empty%20the%20blacklist.meta.js
// ==/UserScript==

let interval = 2000;

function makeRequest(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        console.log(url);
        xhr.open("GET", url);
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function clean_page(e) {
    let url = "https://www.douban.com/contacts/blacklist";
    let response = await makeRequest(url);
    let parser = new window.DOMParser();
    let xmlDoc = parser.parseFromString(response, "text/html");
    let items = xmlDoc.querySelectorAll("a.j.a_confirm_link");
    console.log(items);
    let str = e.target.innerHTML;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let url0 = item.href + "&start=99999";
        await makeRequest(url0);
        e.target.innerHTML = `${str}, 该页已完成 ${i + 1}/${items.length}`;
        await sleep(interval);
    }
    return items.length;
}

async function clean_all(e) {
    let i = 0;
    while (true) {
        i++;
        e.target.innerHTML = `正在清空第 ${i} 页`;
        let n = await clean_page(e);
        if (n && n > 0) {
            console.log(n);
            await sleep(interval);
            continue;
        }
        break;
    }
    e.target.innerHTML = `黑名单已清空`;
    window.location="https://www.douban.com/contacts/blacklist";
}

(function () {
    'use strict';
    let div = document.querySelector("div.aside");
    let p = document.createElement('p');
    let a = document.createElement('a');
    a.onclick = clean_all;
    a.innerHTML = "清空黑名单";
    p.innerHTML = "> ";
    p.append(a);
    div.insertBefore(p, div.querySelector("h2"));
})();