// ==UserScript==
// @name         Bilibili关注迁移
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将bilibili关注从一个账号转移到另一个账号
// @author       Todd
// @match        https://space.bilibili.com/*/fans/follow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458842/Bilibili%E5%85%B3%E6%B3%A8%E8%BF%81%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/458842/Bilibili%E5%85%B3%E6%B3%A8%E8%BF%81%E7%A7%BB.meta.js
// ==/UserScript==

const title_seletor = "#page-follows > div > div.follow-main > div.follow-header.follow-header-info > div";

let WaitForLoaded = (parentNode, checkFuntion) => {
    let option = {
        'childList': true,
        'subtree': true
    };

    let promise = new Promise((resolve, reject) => {
        let mo = new MutationObserver((mutations, obs) => {
            try {
                if (checkFuntion(mutations)) {
                    resolve(obs);
                }
            } catch (e) {
                reject(e);
            }
        })

        mo.observe(parentNode, option);
    })

    return promise;
}

function getUid() {
    let regExp = new RegExp('(?<=https://space.bilibili.com/)[\\d]+')
    let url = window.location.href;
    return regExp.exec(url)[0];
}

async function getFollowListPromise(uid, pn) {
    let url = `https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${pn}&ps=50`
    let promise = fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://space.bilibili.com/5919189/fans/follow?spm_id_from=333.788.0.0",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    let res = await promise;
    let body = await res.json();
    let follow_array = body.data.list;
    return follow_array.map((val) => val.mid).flat();
}

let ALL_COUNT = 0;
let CUR_COUNT = 0;
async function getFollowPromise(id, csrf) {
    await fetch("https://api.bilibili.com/x/relation/modify", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "body": `fid=${id}&act=1&csrf=${csrf}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    console.log(`Finished ${++CUR_COUNT} of ${ALL_COUNT}`)
}

async function backup() {
    let uid = getUid();
    let follow_count_selector = '#page-follows > div > div.follow-sidenav > div.nav-container.follow-container > div.be-scrollbar.follow-list-container.ps > ul > li.follow-item.cur > span.num'
    let follow_count = document.querySelector(follow_count_selector).innerHTML
    follow_count = parseInt(follow_count);

    let loop_count = Math.ceil(follow_count / 50);
    let promise_array = [];
    for (let i = 1; i <= loop_count; i++) {
        promise_array.push(getFollowListPromise(uid, i))
    }

    let follows = await Promise.all(promise_array);
    await navigator.clipboard.writeText(follows.toString());
    alert("所有关注已复制至剪切板，粘贴至还原按钮弹出的对话框即可");
}

async function restore() {
    let follow_id = prompt();
    let follow_id_array = follow_id.split(",");
    let cookie = document.cookie;
    let reg = /(?<=bili_jct=)(.+?)(?=;)/
    let csrf = reg.exec(cookie)[0];
    ALL_COUNT = follow_id_array.length;
    console.log(csrf);
    console.log(follow_id_array);
    let id = setInterval(async ()=>{
        await getFollowPromise(follow_id_array.pop(), csrf);
        if(CUR_COUNT >= ALL_COUNT){
            clearInterval(id);
        }
    }, 1000); //1秒发送一次关注请求
    //await Promise.all(promise_array);
}

function insertBtn() {
    let title = document.querySelector(title_seletor);
    let backup_btn = document.createElement("button");
    let restore_btn = document.createElement("button");
    backup_btn.style.fontSize = "12px";
    restore_btn.style.fontSize = "12px";
    backup_btn.onclick = backup;
    restore_btn.onclick = restore;
    backup_btn.innerHTML = "备份";
    restore_btn.innerHTML = "还原";
    title.appendChild(backup_btn);
    title.appendChild(restore_btn);

    const search_seletor = "#page-follows > div > div.follow-main > div.follow-header.follow-header-info > div > div"
    document.querySelector(search_seletor).style.order = 1;
}

async function main() {
    let obs = await WaitForLoaded(document.body, () => {
        return document.querySelectorAll(title_seletor).length > 0
    });
    obs.disconnect();
    insertBtn();
}

main();