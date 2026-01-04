// ==UserScript==
// @name         河洛农场 自动种植 VIP版
// @version      0.0.7
// @description  自动种植农场 VIP版
// @author       selfuse
// @license      GPL-3.0 License
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horou.com
// @grant        none
// @namespace https://greasyfork.org/users/1084278
// @downloadURL https://update.greasyfork.org/scripts/470047/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D%20VIP%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470047/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D%20VIP%E7%89%88.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    const totalLands = 6;
    const useActionDrug = true;
    const minActionPointUsingDrug = totalLands;
    const farmSeed = 1;
    const defaultMaxWaitTime = 10;
    const screenLoadingWaitTime = 30;

    var nextCheckTime = new Date();
    var failTimes = 0;

    var doProcess = false;
    var actionPoints = 0;
    var isDebug = false;
    var beforeDelay = new Date();
    const maxGap = 29.9;

    await run();

    async function run() {
        await waitScreenLoaded();
        if (isDebug) console.log("start");
        stopTabThrottle();
        while(true) {
            try {
                if (isDebug) console.log("start", new Date());
                doProcess = false;
                setActionPoints();
                await farm();
                await harvest();
                await waitLoading();

                failTimes = 0;
            } catch(e) {
                switch (e.message) {
                    case 'no fertilizer':
                    case 'no seed':
                    case 'no action drug':
                        console.error(e);
                        return;
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

    async function waitNextCheckTime() {
        var now = new Date();
        while (now < nextCheckTime) {
            var diff = Math.floor((nextCheckTime - now)/1000);
            var waitTime = diff > maxGap ? maxGap : diff;
            await delay(waitTime);
            now = new Date();
            if (isDebug) console.log("finish wait", waitTime, now);
        }
    }

    function getPendingFarmLands() {
        return Array.from(document.getElementsByClassName("thispop"));
    }

    async function farm() {
        var farmlist = getPendingFarmLands();

        while (farmlist.length > 0) {
            farmlist[0].click();
            doProcess = true;
            await waitFarmPanelPopup();

            var seed = farmSeed;
            var target = null;
            while (seed >= 1 && target == null) {
                target = document.querySelector(`#try > div > div:nth-child(2) > div:nth-child(${seed}) > div > div:nth-child(1) > a`);
                seed -= 1;
            }
            if (target == null) {
                console.log("%c no seed", "color: red;", new Date());
                throw new Error('no seed');
            } else {
                target.click();
                await waitFarm();

                if (isDebug) console.log("close popup", new Date());
                await closePopUp();
            }

            farmlist = getPendingFarmLands();
        }
    }


    async function harvest() {
        var farmlist = Array.from(document.getElementsByClassName("thisfarm"));
        if (isDebug) console.log("harvest", farmlist, new Date());

        if (farmlist.length > 0) {
            var newCheckTime = getDefaultNextCheckTime();
            await processActionPoint();

            var target = farmlist[0];
            if (isDebug) console.log("process land", target, new Date());
            var timehavest = await processFarmLand(target);
            if (isDebug) console.log("finish", new Date());
            if (timehavest == null) {
                doProcess = false;
                return;
            }
            if (timehavest < newCheckTime) {
                newCheckTime = timehavest;
            }

            await waitUntillNextCheckTime(newCheckTime);
        }
    }

    async function processFarmLand(farmLand) {
        if (isDebug) console.log("click land", new Date());
        farmLand.click();
        doProcess = true;
        if (isDebug) console.log("popup", new Date());
        await waitLandInfoPopup();

        var spanlist = document.getElementById("try")?.children[2]?.children[0]?.children[1]?.children[1]?.children;
        var timestr = spanlist[0].textContent;

        if (timestr.match(/已枯萎/) != null) {
            await closePopUp();
        }
        else if (timestr.match(/枯萎/) != null) { // 收获
            spanlist[2].click(); //点击收获
            await waitHarvest();
            await closePopUp();
            await farm();
            await processFarmLand(farmLand);
        } else if (timestr.match(/成熟/) != null) {
            var timeary = timestr.match(/\d+/g);
            var timehavest = new Date(timeary[0],timeary[1]-1,timeary[2],timeary[3],timeary[4],timeary[5]);

            if (isDebug) console.log("close popup", new Date());
            await closePopUp();
            return timehavest;
        }
    }

    async function waitUntillNextCheckTime(newCheckTime) {
        nextCheckTime = newCheckTime;
        console.log("nextCheckTime", nextCheckTime, new Date());
        await waitNextCheckTime();
    }

    async function waitLoading() {
        if (!doProcess) {
            await delay(3);
        }
    }

    function setActionPoints() {
        var divActionPoint = document.querySelector("#userinfo > div > i.layui-icon.layui-icon-tips")?.parentNode;
        if (divActionPoint != null &&
            divActionPoint.innerText != null &&
            divActionPoint.innerText.replaceAll("\n", "").replaceAll(" ", "").split("/").length > 0) {
                actionPoints = +divActionPoint.innerText.replaceAll("\n", "").replaceAll(" ", "").split("/")[0];
                if (isDebug) console.log("actionPoints", actionPoints, new Date());
        } else {
            console.log("%c get action point error", "color: red;", new Date());
        }
    }

    async function processActionPoint() {
        if (actionPoints < minActionPointUsingDrug) {
            var res = await useActionPointDrug();
            if (!res) {
                throw new Error('no action drug');
            }

            return;
        }

        if (actionPoints == 0) {
            console.log("%c action point", "color: red;", new Date());
            await delay(9.9 * 60);
            await reloadpage();
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

    async function waitFarmPanelPopup() {
        var now = new Date();
        var text = "一键播种";

        while(!isInnerTextExists(text)) {
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
        while(true) {
            await exceedWaitingTime(now, defaultMaxWaitTime);
            await delay(0.1);
            popup = document.querySelector(`#try`);
            if (popup == null) {
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


    function getDefaultNextCheckTime() {
        return new Date((new Date()).getTime() + 60.0*60*1000);
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
})();