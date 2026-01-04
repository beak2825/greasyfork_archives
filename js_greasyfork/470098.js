// ==UserScript==
// @name         河洛农场 循环加速 VIP版
// @version      0.0.5
// @description  自动循环加速收获农作物
// @author       selfuse
// @license      GPL-3.0 License
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horou.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace https://greasyfork.org/users/1084278
// @downloadURL https://update.greasyfork.org/scripts/470098/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E5%BE%AA%E7%8E%AF%E5%8A%A0%E9%80%9F%20VIP%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470098/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E5%BE%AA%E7%8E%AF%E5%8A%A0%E9%80%9F%20VIP%E7%89%88.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    const useActionDrug = true;
    const defaultMaxWaitTime = 5;
    const screenLoadingWaitTime = 30;

    var failTimes = 0;

    var actionPoints = 0;
    var isDebug = false;
    var beforeDelay = new Date();

    var countHitHarvest = 0;

    let useActionTimes;
    let farmSeed;
    let startToken;

    let commSetUseActionDrugTims;
    let commSetFarmSeed;
    let commToggleStartToken;

    await run();

    async function run() {
        await waitScreenLoaded();
        if (isDebug) console.log("start");
        stopTabThrottle();
        registerCommandSetUseActionDrugTims();
        registerCommandSetFarmSeed();
        registerCommandToggleStartToken();
        while(true) {
            if (!startToken) {
                await delay(1.0);
                continue;
            }
            try {
                if (isDebug) console.log("start", new Date());
                await waitLoading();
                await setActionPoints();
                await processActionPoint();

                await farm();
                await harvest();

                failTimes = 0;
            } catch(e) {
                switch (e.message) {
                    case 'no fertilizer':
                    case 'no seed':
                    case 'no action drug':
                        console.error(e);
                        return;
                    case 'prompt bug':
                        console.log("%c prompt bug, reload page", "color: red;", new Date());
                        failTimes += 1;
                        break;
                    default:
                        if (failTimes >= 3) {
                            console.log("%c fail too many times, reload page", "color: red;", new Date());
                            await reloadpage();
                            break;
                        } else {
                            if (isDebug) console.log("%c main process error", "color: red;", e);
                            failTimes += 1;
                            await waitAction();
                        }
                        break;
                }
            }
        }
    }

    function registerCommandSetUseActionDrugTims() {
        if (commSetUseActionDrugTims != null) {
            GM_unregisterMenuCommand(commSetUseActionDrugTims);
        }
        useActionTimes = GM_getValue("useActionTimes", 1);
        commSetUseActionDrugTims = GM_registerMenuCommand (`设置使用体力包数量(当前为${useActionTimes})`, setActionDrugTimes);
    }

    function setActionDrugTimes() {

        var target = +prompt("一次使用多少包体力", "");
        if (!Number.isInteger(target) || target <= 0) {
            return;
        }
        useActionTimes = GM_setValue("useActionTimes", target);
        registerCommandSetUseActionDrugTims();
    }

    function registerCommandSetFarmSeed() {
        if (commSetFarmSeed != null) {
            GM_unregisterMenuCommand(commSetFarmSeed);
        }
        farmSeed = GM_getValue("farmSeed", 1);
        commSetFarmSeed = GM_registerMenuCommand (`使用种子位置(当前为${farmSeed})`, setFarmSeed);
    }

    function setFarmSeed() {

        var target = +prompt("种子在播种页面的位置", "");
        if (!Number.isInteger(target) || target <= 0) {
            return;
        }
        farmSeed = GM_setValue("farmSeed", target);
        registerCommandSetFarmSeed();
    }

    function registerCommandToggleStartToken() {
        if (commToggleStartToken != null) {
            GM_unregisterMenuCommand(commToggleStartToken);
        }
        startToken = GM_getValue("startToken", false);
        commToggleStartToken = GM_registerMenuCommand (`是否自动执行(当前为${startToken ? "是": "否"})`, toggleStartToken);
    }

    function toggleStartToken() {

        startToken = GM_setValue("startToken", !startToken);
        registerCommandToggleStartToken();
    }

    function getPendingFarmLands() {
        return Array.from(document.getElementsByClassName("thispop"));
    }

    async function farm() {
        var farmlist = getPendingFarmLands();

        while (farmlist.length > 0) {
            farmlist[0].click();
            await waitFarmPanelPopup();

            var target = document.querySelector(`#try > div > div:nth-child(2) > div:nth-child(${farmSeed}) > div > div:nth-child(1) > a`);
            if (target == null) {
                console.log("%c no seed", "color: red;", new Date());
                throw new Error('no seed');
            } else {
                target.click();
                await waitFarm();

                await closePopUp();
            }

            farmlist = getPendingFarmLands();
            countHitHarvest = 0;
        }
    }

    function getPendingHarvestLands() {
        return Array.from(document.getElementsByClassName("thisfarm"));
    }

    async function harvest() {
        var farmlist = getPendingHarvestLands();

        if (farmlist.length > 0) {
            var target = farmlist[0];
            await processFarmLand(target);
        }
    }

    async function processFarmLand(farmLand) {
        farmLand.click();
        await waitLandInfoPopup();

        var spanlist = document.getElementById("try")?.children[2]?.children[0]?.children[1]?.children[1]?.children;
        var timestr = spanlist[0].textContent;

        if (timestr.match(/已枯萎/) != null) {
            await closePopUp();
            countHitHarvest = 0;
        }
        else if (timestr.match(/枯萎/) != null) { // 收获
            spanlist[2].click(); //点击收获
            await waitHarvest();
            await closePopUp();
            countHitHarvest += 1;
        } else if (timestr.match(/成熟/) != null) {
            speedUp();
            await closePopUp();
            countHitHarvest = 0;
        }
    }

    function speedUp() {
        var speedUp = document.querySelector("#try > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)");

        if (speedUp == null) {
            throw new Error('no fertilizer');
        }
        var fertilizer = +getValueInsideBracket(speedUp.innerText);
        if (fertilizer > 0) {
            document.querySelector("#try > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a.layui-btn.layui-btn-xs.layui-btn-danger").click();
        } else {
            throw new Error('no fertilizer');
        }
    }

    async function waitLoading() {
        var now = new Date();

        while(isInnerTextExists("请稍候")) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function setActionPoints() {
        var divActionPoint = null;
        actionPoints = null;
        var now = new Date();

        do {
            divActionPoint = document.querySelector("#userinfo > div > i.layui-icon.layui-icon-tips")?.parentNode;
            if (divActionPoint != null &&
                divActionPoint.innerText != null &&
                divActionPoint.innerText.replaceAll("\n", "").replaceAll(" ", "").split("/").length > 0) {
                    actionPoints = +divActionPoint.innerText.replaceAll("\n", "").replaceAll(" ", "").split("/")[0];
            }

            await exceedWaitingTime(now, defaultMaxWaitTime);
        } while (!Number.isInteger(actionPoints));

        if (isDebug) console.log("actionPoints", actionPoints, new Date());
    }

    async function processActionPoint() {
        if (countHitHarvest > 2) {
        // if (actionPoints < minActionPointUsingDrug) {
            var lsRes = [];
            for (var i = 0; i < useActionTimes; i++) {
                lsRes.push(await useActionPointDrug());
            }
            if (lsRes.every(e => e == false)) {
                throw new Error('no action drug');
            }
            return;
        }
    }

    async function useActionPointDrug() {
        if (useActionDrug == false) {
            return false;
        }
        try {
            document.querySelector("#thistop > div:nth-child(1) > div.thistore > img").click();
            await waitWarehousePopup();

            var target = Array.from(document.querySelectorAll('a')).find(e => e.textContent.toLowerCase().includes("+10点体力".toLowerCase()))?.parentNode?.children[1]?.children[0];
            if (target) {
                target.click();
                console.log("useActionPointDrug", new Date());
                await closePopUp();
                countHitHarvest = 0;
                return true;
            }
        } catch (error) {
            console.log("%c useActionPointDrug", "color: red;", error);
            return false;
        }

        return false;
    }

    async function closePopUp() {
        try {
            document.querySelector("span.layui-layer-setwin > a").click();
            await waitPopUpClosed();
        } catch (error) {
            // if (isDebug) console.log(error);
        }
    }

    function delay(seconds){
        if (seconds <= 0) {
            location.reload();
            return;
        }
        beforeDelay = new Date();
        return new Promise(resolve => {
            if(isDebug && seconds > 1) console.log("delay", seconds, new Date());
            setTimeout(() => {
                resolve();
                if(isDebug && seconds > 1) console.log("delayed", seconds, new Date());
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
            await reloadpage();
        }
    }

    function getTimeSpan() {
        return document.querySelector(`#try > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)`);
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

    async function waitFarm() {
        var now = new Date();
        var text = "播种";

        while(!isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitHarvest() {
        var now = new Date();
        var text = "枯萎";

        while(!isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function handlePromptBug() {
        var bugText = "勾选完毕";

        if (isInnerTextExists(bugText)) {
            await closePopUp();
            throw new Error('prompt bug');
        }
    }

    async function waitFarmPanelPopup() {
        var now = new Date();
        var text = "一键播种";

        while(!isInnerTextExists(text)) {
            await handlePromptBug();
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitWarehousePopup() {
        var now = new Date();
        var text = "+10点体力";

        while(!isInnerTextExists(text)) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
        }
    }

    async function waitLandInfoPopup() {
        var now = new Date();

        var timeSpan = null;
        var farmInfo = null;
        while(timeSpan == null && farmInfo == null) {
            await handlePromptBug();
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
            timeSpan = getTimeSpan();
            farmInfo = document.querySelector("#try > div > div:nth-child(1) > div");
        }
    }

    async function waitAction() {
        await delay(1.0);
    }

    async function waitPopUpClosed() {
        var now = new Date();

        var popup = null;
        var popupClose = null
        while(true) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
            popup = document.querySelector(`#try`);
            popupClose = document.querySelector("span.layui-layer-setwin > a");
            if (popup == null && popupClose == null) {
                return;
            }
        }
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

    async function reloadpage() {
        location.reload();
        await delay(60);
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

    // to avoid timer throttling
    function stopTabThrottle() {
        var audio = new Audio('https://download.samplelib.com/mp3/sample-15s.mp3');
        audio.loop = true;
        audio.volume = 0.01;
        audio.play();
    }
})();