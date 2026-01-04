// ==UserScript==
// @name         忘川夜游抽卡回收脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description   2024年7月斗鱼活动忘川夜游脚本。安装后会在直播间标题右侧有一个自动抽卡按钮。每次十连抽并自动分解抽到的战魂。脚本后台运行，抽卡次数不够自动退出。
// @author       You
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/502272/%E5%BF%98%E5%B7%9D%E5%A4%9C%E6%B8%B8%E6%8A%BD%E5%8D%A1%E5%9B%9E%E6%94%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502272/%E5%BF%98%E5%B7%9D%E5%A4%9C%E6%B8%B8%E6%8A%BD%E5%8D%A1%E5%9B%9E%E6%94%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentUrl = window.location.href;

    // 创建 URL 对象
    const urlObj = new URL(currentUrl);

    // 使用 URLSearchParams 获取查询参数
    const params = new URLSearchParams(urlObj.search);

    // 获取 rid 参数的值
    const rid = params.get('rid');
    let allCharacters = [];
    const waitInterval = 1000; // 每次检查之间等待时间（毫秒）
    const actInteractiveButton = '.actAnnual202311Interactive-container';
    const actIframe = 'iframe[class="Live-Act-Annual-Panel-iframe"]';


    let intervalId;
    let timerId;
    let lotteryFailed = false;
    let ctn = '';
    // 函数：向字典中添加新对象


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function randomSleep(minSeconds, maxSeconds) {
        const ms = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
        await sleep(ms);
    }


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    // Get cookies
    // 模拟请求


    function sendRecycleRequest(index) {

        ctn = getCookie('acf_ccn');
        const payload = `ctn=${ctn}&activity_id=2026&rid=${rid}&index=${index}&ext1=2`;
        fetch('https://www.douyu.com/japi/revenuenc/web/actqzs/immortalCultivation/recycle', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': document.cookie,
                'User-Agent': navigator.userAgent
            },
            body: payload,
            credentials: 'include'
        })
            .then(response => {
            if (response.ok) {

            }
            return response.json();
        })
            .then(data => {
            console.log('Recycle request successful:', data);
        })
            .catch(error => console.error('Recycle request failed:', error));
    }

    async function wearAndRecycleCharacters(toWearCharacter, toRecycleCharacters){

        console.log("toWearCharacter", toWearCharacter);
        console.log("toRecycleCharacters", toRecycleCharacters);
        const payload = `ctn=${ctn}&activity_id=2026&rid=${rid}&index=${toWearCharacter.index}`;
        const response = await fetch('https://www.douyu.com/japi/revenuenc/web/actqzs/immortalCultivation/wear', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': document.cookie,
                'User-Agent': navigator.userAgent
            },
            body: payload,
            credentials: 'include'
        });

        if (response.ok) {
            for (const char of toRecycleCharacters) {
                await randomSleep(0.5, 2); // 每个角色之间等待0.5-2秒
                // 执行回收请求
                await sendRecycleRequest(char.index);
            }
        }
        return response.json();
    }


    function processCharacters(characters) {
        // 找到等级最小并且wear为0的角色
        let minLevelWear0Character = characters.filter(char => char.wear === 0)
        .reduce((minChar, currentChar) => {
            return currentChar.level < minChar.level ? currentChar : minChar;
        }, characters[0]);

        // 排除掉找到的等级最小且wear为0的角色
        let filteredCharacters = characters.filter(char => char !== minLevelWear0Character);

        // 执行筛选逻辑


        // 找到等级大于等于3且不为偶数或者大于等于10的角色
        let specificCharacters = filteredCharacters.filter(char => {
            //return (char.level >= 3 && char.level % 2 !== 0) || char.level >= 10;{
            return (char.level >= 1);
        });


        wearAndRecycleCharacters(minLevelWear0Character, specificCharacters);
        // 执行特定条件角色的逻辑

    }

    function queryCharacters() {
        fetch(`https://www.douyu.com/japi/revenuenc/web/actqzs/immortalCultivation/panelInfo?activity_id=2026&rid=${rid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6',
                'User-Agent': navigator.userAgent,
                'Cookie': document.cookie
            },
            credentials: 'include'
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
            .then(data => {
            if (data.error === 0 && data.msg === 'ok') {
                allCharacters = data.data.characters;
                console.log('Characters data saved:', allCharacters);
                processCharacters(data.data.characters);
                getCtn();
            } else {
                console.error('Error in response:', data);
            }
        })
            .catch(error => console.error('Request failed:', error));
    }
    function getCtn(){
        ctn = getCookie('acf_ccn');
        console.log(ctn);
    }

    function sendLotteryRequest() {
        if (lotteryFailed) {
            clearInterval(timerId);
            console.log("Lottery failed, stopping timer.");
            return;
        }
        const payload = `ctn=${ctn}&activity_id=2026&rid=${rid}&batchNum=10`;
        console.log(payload)
        fetch('https://www.douyu.com/japi/revenuenc/web/actqzs/userLottery/lottery', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': document.cookie,
                'User-Agent': navigator.userAgent
            },
            body: payload,
            credentials: 'include'
        })
            .then(response => {
            if (response.ok) {
                randomSleep(0.5, 2).then(() => {
                    queryCharacters();
                });
            } else {

                lotteryFailed = true;
                clearInterval(timerId);
            }
            return response.json();
        })
            .then(data => {
            console.log('Lottery request successful:', data);
        })
            .catch(error => {
            lotteryFailed = true;
            clearInterval(timerId);
            console.error('Lottery request failed:', error);
        });
    }


    function processSteps(){
        getCtn();
        timerId = setInterval(() => {
            if (!lotteryFailed) {
                sendLotteryRequest();
            }
        }, 10000);
    }



    function addButton(text, className, idx, onclick) {
        const elements = Array.from(document.querySelectorAll(className));
        const container = elements[idx];
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'DiamondFansMatchEntrance';
        const label = document.createElement('label');
        label.textContent = text;
        label.style.cursor = 'pointer';
        label.onclick = onclick;
        buttonDiv.appendChild(label);
        container.appendChild(buttonDiv);
    }


    function checkAndAddButtons() {
        // 检查页面中是否存在指定的div
        const giftNamingEntranceExists = document.querySelector('.DiamondFansMatchEntrance');
        const cardBodyExists = document.querySelector(actInteractiveButton);

        // 如果两个div都存在，则添加按钮
        if (giftNamingEntranceExists && cardBodyExists) {
            console.log("找到了指定的div，添加按钮。");
            //addButton('test','.Title-col.is-left', 0, sendRecycleRequest(2));
            addButton('自动抽卡','.Title-col.is-left', 0, processSteps);
            clearInterval(checkInterval); // 停止定时器
        }
    }


    const checkInterval = setInterval(checkAndAddButtons, waitInterval);

    // Your code here...
})();