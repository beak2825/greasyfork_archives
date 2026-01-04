// ==UserScript==
// @name         Bilibili live enhanced ban - 增强的哔哩哔哩直播间禁言
// @namespace    http://tampermonkey.net/
// @version      2024-03-16
// @description  虽然是在纵横交错的宏伟时间跨度里只一刹那的昙花一现，也很庆幸与你跨越光年的相遇。
// @author       NailvCoronation
// @match        https://live.bilibili.com/*
// @icon         https://nailv.live/static/images/favicon.ico
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488142/Bilibili%20live%20enhanced%20ban%20-%20%E5%A2%9E%E5%BC%BA%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%A6%81%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/488142/Bilibili%20live%20enhanced%20ban%20-%20%E5%A2%9E%E5%BC%BA%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%A6%81%E8%A8%80.meta.js
// ==/UserScript==

/*
FUCK BILIBILI
BILIBILI直播间禁言只能永久禁言、不能控制禁言时长就已经很傻逼了，
但我没想到能有__长了人类大脑的人__能写出更傻逼的API。
禁言时用POST请求，但是参数写在query里；
解禁时还用POST请求，但是参数写在payload里。
我建议写出这个API的人去寻求一下心理治疗。
*/

const unbanCheckInterval = 30; // In seconds
const banDurations = [1, 3, 7, 30, 365]; // In days
const disableAd = false; // Disable ad at the bottom

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

(function() {
    'use strict';

    var targetUid = 0;
    var danmakuMenuModified = false;
    const msInADay = 24 * 60 * 60 * 1000;
    const roomId = window.location.pathname.split('/').pop();

    function banNDays(duration) {
        fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/banned/AddSilentUser?' + $.param({
            room_id: roomId,
            tuid: targetUid,
            mobile_app: 'web',
            csrf_token: getCookie('bili_jct'),
            csrf: getCookie('bili_jct'),
        }), {method: 'POST', credentials: 'include'})
            .then((resp) => resp.json())
            .then((data) => {
            if (data.code === 0) {
                GM_setValue(targetUid, JSON.stringify({banTime: Date.now(), duration, roomId}));
            }
        })
    }

    function modifyMenu() {
        let menu = document.getElementsByClassName('danmaku-menu')[0]
        let attr = menu.firstChild.getAttributeNames()[0]

        // Test
        /*
        const testMinutes = 3;
        let newDiv = document.createElement("div");
        newDiv.setAttribute(attr, "");
        newDiv.classList.add("add-to-black-list");

        let newLink = document.createElement("a");
        newLink.setAttribute(attr, "");
        newLink.classList.add("clickable", "bili-link", "pointer");

        let newSpan = document.createElement("span");
        newSpan.textContent = "禁言该用户（" + testMinutes + "分钟）";

        newLink.addEventListener('click', function() {
            console.log("Ban " + targetUid + " for " + testMinutes + " minutes");
            banNDays(testMinutes * 60 * 1000);
            document.body.click();
        });
        newLink.appendChild(newSpan);
        newDiv.appendChild(newLink);
        menu.appendChild(newDiv);
        */

        // Add new buttons to danmaku menu
        banDurations.forEach(duration => {
            let newDiv = document.createElement("div");
            newDiv.setAttribute(attr, "");
            newDiv.classList.add("add-to-black-list");

            let newLink = document.createElement("a");
            newLink.setAttribute(attr, "");
            newLink.classList.add("clickable", "bili-link", "pointer");

            let newSpan = document.createElement("span");
            newSpan.textContent = "禁言该用户（" + duration + "天）";


            newLink.addEventListener('click', function() {
                console.log("Ban " + targetUid + " for " + duration + " days");
                banNDays(duration * msInADay);
                document.body.click();
            });

            newLink.appendChild(newSpan);
            newDiv.appendChild(newLink);
            menu.appendChild(newDiv);
        });
        danmakuMenuModified = true;

        if (!disableAd) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute(attr, "");
            newDiv.classList.add("add-to-black-list");

            let newLink = document.createElement("a");
            newLink.setAttribute(attr, "");
            newLink.classList.add("clickable", "bili-link", "pointer");
            newLink.setAttribute("href", "https://live.bilibili.com/25034104");
            newLink.setAttribute("target", "_blank");

            let newSpan = document.createElement("span");
            newSpan.textContent = "关注明前奶绿喵🥰";

            newLink.appendChild(newSpan);
            newDiv.appendChild(newLink);
            menu.appendChild(newDiv);
        }
    }

    function handleButtonClick(event) {
        if (event.target.matches('.open-menu')) {
            if (!danmakuMenuModified) {
                modifyMenu()
            }
            targetUid = event.target.parentElement.parentElement.parentElement.getAttribute('data-uid')
        }
    }

    async function unbanExpiredUsers() {
        const uids = await GM_listValues();
        console.log('Banned users: ' + uids)
        for (const uid of uids) {
            const info = JSON.parse(await GM_getValue(uid));
            if (info.banTime + info.duration <= Date.now()) {
                console.log(new Date() + ' - unban user ' + uid)
                console.log('User banned at ' + new Date(info.banTime))
                fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/banned/DelSilentUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'include',
                    body: $.param({
                        room_id: info.roomId,
                        tuid: uid,
                        csrf_token: getCookie('bili_jct'),
                        csrf: getCookie('bili_jct'),
                    })
                }).then((resp) => resp.json())
                .then((data) => {
                    if (data.code === 0 || data.code === 1200000 /* already unbanned code */) {
                        GM_deleteValue(uid);
                    }
                })
            }
        }
    }

    unbanExpiredUsers();
    window.setInterval(unbanExpiredUsers, unbanCheckInterval * 1000);
    document.addEventListener("click", handleButtonClick);
})();