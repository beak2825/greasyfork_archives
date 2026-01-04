// ==UserScript==
// @name         洛谷动态个签
// @namespace    https://greasyfork.org/zh-CN/users/1338222-lzm0107
// @version      3.0.0
// @license      GPLv3
// @description  在个签中添加最后活跃时间
// @author       lzm0107
// @run-at       document-idle
// @match        https://www.luogu.com/*
// @match        https://www.luogu.com.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/501498/%E6%B4%9B%E8%B0%B7%E5%8A%A8%E6%80%81%E4%B8%AA%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501498/%E6%B4%9B%E8%B0%B7%E5%8A%A8%E6%80%81%E4%B8%AA%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let INTERVAL = 1000 * 60;
    let REPLACE, SLOGAN_TEXT, TOKEN, USER_NAME;

    function checkSettings(){
        if(GM_getValue('replaceSlogan') === undefined){
            let replaceSlogan = confirm('覆盖原有个签，而不是在原个签末尾添加？');
            GM_setValue('replaceSlogan', replaceSlogan);
            let sloganText = prompt('请输入个签内容，具体参考 greasyfork 上的使用说明：', replaceSlogan ? '最后在线时间: {date1} {time1}' : ' | 最后在线时间: {date1} {time1}');
            while(sloganText === null){
                sloganText = prompt('请输入一个有效的字符串。', replaceSlogan ? '最后在线时间: {date1} {time1}' : ' | 最后在线时间: {date1} {time1}');
            }
            GM_setValue('sloganText', sloganText);
        }
    }

    function getDate(date, format = 1){
        let year = date.getFullYear().toString();
        let year2 = year.slice(-2);
        let month = (date.getMonth() + 1).toString();
        let month0 = ('0' + month).slice(-2);
        let day = date.getDate().toString();
        let day0 = ('0' + (date.getDate()).toString()).slice(-2);
        switch(format){
            case 1: return `${year}/${month}/${day}`;
            case 2: return `${year}-${month}-${day}`;
            case 3: return `${year}.${month}.${day}`;
            case 4: return `${year}/${month0}/${day0}`;
            case 5: return `${year}-${month0}-${day0}`;
            case 6: return `${year}.${month0}.${day0}`;
            case 7: return `${year2}/${month}/${day}`;
            case 8: return `${year2}-${month}-${day}`;
            case 9: return `${year2}.${month}.${day}`;
            case 10: return `${year2}/${month0}/${day0}`;
        }
    }
    
    function getTime(date, format = 1){
        let hours = date.getHours().toString();
        let hours0 = ('0' + hours).slice(-2);
        let am_pm = (date.getHours() >= 12 ? '下午' : '上午');
        let hours12 = ((date.getHours() % 12 + 11) % 12 + 1).toString();
        let hours12_0 = ('0' + hours12).slice(-2);
        let minutes = ('0' + (date.getMinutes()).toString()).slice(-2);
        switch(format){
            case 1: return `${hours}:${minutes}`;
            case 2: return `${hours0}:${minutes}`;
            case 3: return `${am_pm}${hours12}:${minutes}`;
            case 4: return `${am_pm}${hours12_0}:${minutes}`;
        }
    }

    function sendSlogan(slogan){
        fetch('/api/user/updateSlogan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': TOKEN
            },
            body: JSON.stringify({
                slogan: slogan
            })
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateSlogan(){
        let date = new Date();
        let slogan;
        slogan = SLOGAN_TEXT;
        for(let i = 1; i <= 10; i ++ ){
            slogan = slogan.replace('{date' + i.toString() + '}', getDate(date, i));
        }
        for(let i = 1; i <= 4; i ++ ){
            slogan = slogan.replace('{time' + i.toString() + '}', getTime(date, i));
        }
        if(!REPLACE){
            fetch(`/api/user/search?keyword=${USER_NAME}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    let old = data.users[0].slogan;
                    if(old.indexOf('\u200B') != -1){
                        old = old.substring(0, old.indexOf('\u200B'));
                    }
                    slogan = old + '\u200B' + slogan;
                    sendSlogan(slogan);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
        else{
            sendSlogan(slogan);
        }
    }

    setTimeout(function(){
        checkSettings();
        REPLACE = GM_getValue('replaceSlogan');
        SLOGAN_TEXT = GM_getValue('sloganText');
        TOKEN = document.querySelector('meta[name="csrf-token"]').content;
        USER_NAME = document.querySelector('img[class=avatar]').alt;
        updateSlogan();
        setInterval(updateSlogan, INTERVAL);
    }, 3000);
})();