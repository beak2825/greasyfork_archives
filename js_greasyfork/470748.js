// ==UserScript==
// @name         河洛农场 自动喂食
// @version      0.0.8
// @description  自动喂食
// @author       selfuse
// @license      GPL-3.0 License
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horou.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace https://greasyfork.org/users/1084278
// @downloadURL https://update.greasyfork.org/scripts/470748/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E5%96%82%E9%A3%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/470748/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E5%96%82%E9%A3%9F.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    let isDebug = false;
    let beforeDelay = new Date();

    let isStarted = false;

    const defaultMaxWaitTime = 10;
    const screenLoadingWaitTime = 30;

    let commStart;
    let commStop;
    let commSetFeedTarget;
    let commShowFeedRounds;
    let commAutoStart;

    let feedRounds = 0;
    let totalFeedRounds = 0;
    let newRoundTarget = 1;

    let failRounds = 0;

    let autoStart = "N";

    var originalAlert;
    await run();

    function isAutoStart() {
        return autoStart.toUpperCase() == "Y";
    }

    async function run() {
        await waitScreenLoaded();
        if (isDebug) console.log("start");
        stopTabThrottle();

        registerCommandStart();
        registerCommandSetFeedTarget();
        registerCommandShowFeedRounds();
        loadInitValues();
        registerCommandAutoStart();

        if (isAutoStart()) {
            isStarted = true;
            await feedAnimal();
        }
    }

    function registerCommandStart() {
        commStart = GM_registerMenuCommand ("开始喂食", startFeeding);
    }

    function registerCommandStop() {
        commStop = GM_registerMenuCommand ("停止喂食", stopFeeding);
    }

    function registerCommandSetFeedTarget() {
        if (commSetFeedTarget != null) {
            GM_unregisterMenuCommand(commSetFeedTarget);
        }
        newRoundTarget = GM_getValue("newRoundTarget", 1);
        commSetFeedTarget = GM_registerMenuCommand (`设置喂食目标(当前为${newRoundTarget})`, setFeedTarget);
    }

    function registerCommandShowFeedRounds() {
        if (commShowFeedRounds != null) {
            GM_unregisterMenuCommand(commShowFeedRounds);
        }
        commShowFeedRounds = GM_registerMenuCommand ("显示总喂食轮次", () => {
            prompt(`总喂食轮次：${totalFeedRounds}`);
        });
    }

    function registerCommandAutoStart() {
        if (commAutoStart != null) {
            GM_unregisterMenuCommand(commAutoStart);
        }
        commAutoStart = GM_registerMenuCommand (`是否自动开始(Y/N)，当前为${autoStart}`, () => {
            autoStart = autoStart == "Y" ? "N" : "Y";
            GM_setValue("autoStart", autoStart);
            registerCommandAutoStart();
        });
    }

    async function startFeeding() {        
        var total = +prompt("喂食轮次：", "");
        if (!Number.isInteger(total) || total <= 0) {
            return;
        } else {
            setTotalFeedRounds(total);
        }

        if (commStart != null) {
            GM_unregisterMenuCommand(commStart);
        }
        registerCommandStop();

        isStarted = true;

        await feedAnimal();
    }

    function stopFeeding() {
        isStarted = false;

        if (commStop != null) {
            GM_unregisterMenuCommand(commStop);
        }
        registerCommandStart();
        prompt(`喂食完成，停止喂食; 已喂食轮次：${feedRounds}`);
        resetFeedRounds();
    }

    function setFeedTarget() {
        prompt("功能尚未完成");
        return;

        var target = +prompt("喂食目标：", "");
        if (!Number.isInteger(target) || target <= 0) {
            return;
        }
        newRoundTarget = GM_setValue("newRoundTarget", target);
        registerCommandSetFeedTarget();
    }

    async function feedAnimal() {
        try {
            disableAlert();
            console.log("feedAnimal", new Date());

            await openCommercePopup();
            await openCommerceTab();
    
            var isFirstTime = true;
    
            while (totalFeedRounds > feedRounds && isStarted) {
                if (isNewRoundStarted()) {
                    isFirstTime = false;
    
                    if (!isFeedTabOpened()) {
                        await openFeedTab();
                    }
                    await feedAnimalOneRound();
                } else {
                    if (!isFirstTime) {
                        if (totalFeedRounds <= feedRounds) {
                            prompt(`喂食完成，停止喂食; 已喂食轮次：${feedRounds}`);
                            return;
                        }
                    }
                    await startNewRound();
                    await openCommercePopup();
                    await openCommerceTab();
                }

                setFailRounds(0);
            }
            stopFeeding();
        } catch (error) {
            if (autoStart) {
                if (failRounds <= 5) {
                    setFailRounds(failRounds + 1);
                }
                await reloadpage();
                return;
            }
            prompt(`喂食失败，停止喂食; 已喂食轮次：${feedRounds}`);
            return;
        } finally {
            enableAlert();
        }

        // await closePopUp();
    }

    async function openCommercePopup() {
        if (!isCommercePopupOpened()) {
            document.querySelector("#thistop > div:nth-child(1) > div.thisguild > img").click()
            await waitCommercePopup();
        }
    }

    async function openCommerceTab() {
        document.querySelector("#try > div:nth-child(3) > div > button:nth-child(3)").click();
        await waitCommerceTabSwitch();
    }

    function loadInitValues() {
        feedRounds = GM_getValue("feedRounds", 0);
        totalFeedRounds = GM_getValue("totalFeedRounds", 0);
        failRounds = GM_getValue("failRounds", 0);
        autoStart = GM_getValue("autoStart", "N");
    }

    function resetFeedRounds() {
        GM_setValue("feedRounds", 0);
        GM_setValue("totalFeedRounds", 0);

        feedRounds = 0;
        totalFeedRounds = 0;
    }

    function setFeedRounds(newVal) {
        GM_setValue("feedRounds", newVal);
        feedRounds = newVal;
    }

    function setTotalFeedRounds(newVal) {
        GM_setValue("totalFeedRounds", newVal);
        totalFeedRounds = newVal;
    }

    function setFailRounds(newVal) {
        GM_setValue("failRounds", newVal);
        failRounds = newVal;
    }

    async function openFeedTab() {
        document.querySelector("#guildinfo > div:nth-child(1) > button").click();
        await waitFeedTabOpened();
    }

    async function feedAnimalOneRound() {
        document.querySelector("#jnfarm_pop > div > div > div:nth-child(2) > div > div > div > i").click();
        await delay(0.5);
        while (true) {
            document.querySelector("#gsubmitbtn").click();
            await delay(0.1);
            if (isInnerTextExists("达到收获的次数, 全员奖励")) {
                setFeedRounds(feedRounds + 1);
                break;
            }

            if (!isStarted) {
                return;
            }
        }

        document.getElementsByClassName("layui-layer-shade")[1].click();
        await waitFeedTabClosed();
        await delay(3);
        // await waitFeedStart();
        // await waitFeedFinish();
    }

    async function waitFeedStart() {
        var now = new Date();
        var text = "喂食成功";

        while(!isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitFeedFinish() {
        var now = new Date();
        var text = "喂食成功";

        while(isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function startNewRound() {
        document.querySelector("#guildinfo > div:nth-child(1) > button").click();
        await waitNewRoundPopup();
        document.querySelector("#gsubmitbtn").click();
        await waitNewRoundClosed();
    }

    function isCommercePopupOpened() {
        return isInnerTextExists("帮会介绍");
    }

    async function waitCommercePopup() {
        var now = new Date();

        while(!isCommercePopupOpened()) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitCommerceTabSwitch() {
        var now = new Date();
        var text = "帮会当前";

        while(!isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    function isFeedTabOpened() {
        return isInnerTextExists("当前喂食进度");
    }

    async function waitFeedTabOpened() {
        var now = new Date();

        while(!isFeedTabOpened()) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitFeedTabClosed() {
        var now = new Date();

        while(isFeedTabOpened()) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    function isNewRoundPopupExists() {
        return isInnerTextExists("激活消耗");
    }

    async function waitNewRoundPopup() {
        var now = new Date();

        while(!isNewRoundPopupExists()) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitNewRoundClosed() {
        var now = new Date();

        while(isNewRoundPopupExists()) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    function isNewRoundStarted() {
        return isInnerTextExists("帮会当前已激活");
    }

    async function closePopUp() {
        try {
            document.querySelector("span.layui-layer-setwin > a").click();
            await waitPopUpClosed();
        } catch (error) {
            // if (isDebug) console.log(error);
        }
    }

    async function waitPopUpClosed() {
        var now = new Date();

        var popup = null;
        while(true) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
            popup = document.querySelector(`#try`);
            if (popup == null) {
                return;
            }
        }
    }

    function delay(seconds){
        if (seconds <= 0) {
            location.reload();
            return;
        }
        beforeDelay = new Date();
        return new Promise(resolve => {
            if(isDebug) console.log("delay", seconds, new Date());
            setTimeout(() => {
                resolve();
                if(isDebug) console.log("delayed", seconds, new Date());
                var diff = Math.floor((new Date() - beforeDelay)/1000);
                if(diff > seconds*1.5 && diff > 1){
                    console.log("%c error delayed", "color: red;", "should delay ", seconds);
                    console.log("%c before", "color: red;", beforeDelay, "should delay ", seconds);
                }
            }, seconds*1000.0);
        });
    }

    async function exceedWaitingTime(startTime, maxWaitTime) {
        var diff = (new Date() - startTime)/1000;
        if (diff > maxWaitTime) {
            if(isAutoStart()) {
                prompt(`喂食失败，停止喂食; 已喂食轮次：${feedRounds}`);
            }
            throw new Error(`exceed waiting time ${diff} > ${maxWaitTime}`);
        }
    }

    function isInnerTextExists(text) {
        const elements = document.querySelectorAll('*'); // Get all elements in the document

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerText.includes(text)) {
            // console.log(elements[i]);
            return true; // Found an element with 'test' in its innerText
            }
        }

        return false; // No element with 'test' in its innerText
    }

    async function waitScreenLoaded() {
        var now = new Date();

        while(document.readyState != 'complete') {
            await exceedWaitingTime(now, screenLoadingWaitTime);
            await delay(0.1);
        }
        while (document.querySelector("#updatefarmsituation > span > div") != null) {
            await exceedWaitingTime(now, screenLoadingWaitTime);
            await delay(0.1);
        }
    }

    function getValueInsideBracket(val) {
        const regex = /\((.*?)\)/;
        const match = regex.exec(val);

        if (match) {
          return match[1];
        } else {
          return "";
        }
    }

    async function reloadpage() {
        location.reload();
        await delay(60);
    }

    // to avoid timer throttling
    function stopTabThrottle() {
        var audio = new Audio('https://download.samplelib.com/mp3/sample-15s.mp3');
        audio.loop = true;
        audio.volume = 0.01;
        audio.play();
    }

    function disableAlert() {
        if (originalAlert == null || originalAlert == undefined) {
            originalAlert = window.alert;
            window.alert = (message) => {
                console.log(message);
            };
        }
    }

    function enableAlert() {
        if (originalAlert != null) {
            window.alert = originalAlert;
            originalAlert = null;
        }
    }

    function prompt(text) {
        if (originalAlert != null) {
            return originalAlert(text);
        } else {
            return window.prompt(text);
        }
    }
})();
