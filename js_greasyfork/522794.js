// ==UserScript==
// @name         NodeSeek 自动签到
// @namespace    https://greasyfork.org/users/101223
// @version      0.2
// @description  NodeSeek 每日自动签到
// @author       Splash
// @license      GPLv3.0-or-later
// @match        https://www.nodeseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.nodeseek.com
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522794/NodeSeek%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522794/NodeSeek%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    getBonus();
    async function getBonus() {
        let lastTime = new Date(localStorage.getItem('gd_lastSign')),
        checkSign = '/api/attendance/board?page=1',
        signUrl = '/api/attendance?random=true',
        origin = 'https://www.nodeseek.com',
        referer = origin + '/board';
        if (lastTime == 'Invalid Date' || !isSameDay(lastTime, new Date())) {
            let result = await xhr({
                method: 'get',
                url: checkSign,
                headers: {
                    referer
                },
                responseType: 'json'
            });
            if (result?.record?.created_at) {
                const createdAt = new Date(result.record.created_at);
                if (createdAt != 'Invalid Date') {
                    lastTime = createdAt;
                    localStorage.setItem('gd_lastSign', lastTime);
                }
            }
            if (!isSameDay(lastTime, new Date())) {
                result = await xhr({
                    method: 'post',
                    url: signUrl,
                    headers: {
                        origin,
                        referer
                    },
                    responseType: 'json'
                });
                if (result && 'success' in result) {
                    console.log(`签到${result.success ? '成功' : '失败'}! ${result.message}`);
                    lastTime = new Date();
                    localStorage.setItem('gd_lastSign', lastTime);
                } else {
                    console.error('错误：' + result);
                    setSignedIcon(false);
                    setDelay(lastTime);
                    return;
                }
            }
        }
        setSignedIcon();
        setDelay(lastTime);
    }
    function setDelay(lastTime) {
        let delay;
        const now = new Date();
        if (lastTime == 'Invalid Date' || !isSameDay(lastTime, now)) {
            delay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9) - now;
        } else {
            delay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9) - now;
        }
        setTimeout(getBonus, delay);
    }
    function sleep(sleepTime) {
        return new Promise((resolve) => setTimeout(resolve, sleepTime));
    }
    function isSameDay(date1, date2) {
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()
    }
    function setSignedIcon(success = true) {
        const dom = document.querySelector('.menu .iconpark-icon');
        if (dom) {
            if (success) {
                dom.style.setProperty("color", "#035bb0", "important");
                dom.parentElement.title = '已签到！';
            } else {
                dom.style.setProperty("color", null);
                dom.parentElement.title = '签到';
            }
        }
    }
    function xhr(options, retryTimes = 5) {
        let options_ = JSON.parse(JSON.stringify(options));
        return new Promise((resolve, reject) => {
            options_.onload = resp => {
                resolve(resp.response);
            };
            options_.onerror = options_.ontimeout = resp => {
                if (--retryTimes <= 0) {
                    reject(resp);
                } else {
                    return xhr(options, retryTimes).then(resolve, reject);
                }
            };
            GM_xmlhttpRequest(options_);
        });
    }
})();
