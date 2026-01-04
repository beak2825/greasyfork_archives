// ==UserScript==
// @name         河洛农场 循环加速
// @version      0.0.6
// @description  自动循环加速收获农作物
// @author       selfuse
// @license      GPL-3.0 License
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horou.com
// @grant        none
// @namespace https://greasyfork.org/users/1084278
// @downloadURL https://update.greasyfork.org/scripts/468934/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E5%BE%AA%E7%8E%AF%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/468934/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E5%BE%AA%E7%8E%AF%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    const targetLand = 6;
    const useActionDrug = true;
    const useSeed = 2;
    const minActionPointUsingDrug = 1;
    const maxWaitTime = 10;
    const oneKey = true;

    var actionPoints = 0;
    var isDebug = false;
    var beforeDelay = new Date();

    await run();

    async function run() {
        await waitScreenRefresh();
        if (isDebug) console.log("start");
        while(true) {
            try {
                if (isDebug) console.log("start", new Date());
                await process();
            } catch(e) {
                switch (e.message) {
                    case 'no fertilizer':
                    case 'no seed':
                        console.error(e);
                        return;
                    default:
                        console.error(e);
                        await reloadpage();
                        break;
                }
            }
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

    async function openLandPopup(target) {
        target.click();

        await waitPopUpInfoLoaded();

        return getTimeSpan() == null ? 1 : 0;
    }

    async function getTargetLand() {
        var now = new Date();

        var target = null;

        while (target == null) {
            await exceedWaitingTime(now);
            await delay(0.1);
            target = document.querySelector(`[data-jfid='${targetLand}']`);
        }

        return target;
    }

    async function waitScreenRefresh() {
        await delay(7.9);
        await getTargetLand();
    }

    async function waitPopUpInfoLoaded() {
        var now = new Date();

        var timeSpan = null;
        var farmInfo = null;
        while(timeSpan == null && farmInfo == null) {
            await exceedWaitingTime(now);
            await delay(0.1);
            timeSpan = getTimeSpan();
            farmInfo = document.querySelector("#try > div > div:nth-child(1) > div");
        }
    }

    async function waitPopUpClosed() {
        var now = new Date();

        var popup = null;
        while(true) {
            await exceedWaitingTime(now);
            await delay(0.1);
            popup = document.querySelector(`#try`);
            if (popup == null) {
                return;
            }
        }
    }

    async function exceedWaitingTime(startTime) {
        var diff = (new Date() - startTime)/1000;
        if (diff > maxWaitTime) {
            await reloadpage();
        }
    }

    function getTimeSpan() {
        return document.querySelector(`#thisfarm${targetLand} > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)`);
    }

    function harvest() {
        if (oneKey) {
            document.querySelector(`#thisfarm${targetLand} > div > div:nth-child(2) > div:nth-child(2) > a:nth-child(3) > div`).click();
        } else {
            document.querySelector(`#thisfarm${targetLand} > div > div:nth-child(2) > div:nth-child(2) > a:nth-child(2)`).click();
        }
    }

    function speedUp() {
        var speedUp = document.querySelector(`#thisfarm${targetLand} > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)`);
        if (speedUp == null) {
            throw new Error('no fertilizer');
        }
        var fertilizer = +getValueInsideBracket(speedUp.innerText);
        if (fertilizer > 0) {
            if (oneKey) {
                document.querySelector(`#thisfarm${targetLand} > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a.layui-btn.layui-btn-xs.layui-btn-danger`).click();
            } else {
                speedUp.click();
            }
        } else {
            throw new Error('no fertilizer');
        }
    }

    async function process() {
        setActionPoints();
        await processActionPoint();
        var target = await getTargetLand();

        var type = await openLandPopup(target);

        switch (type) {
            case 0:
                var timestr = getTimeSpan().innerText;
                if (timestr.match(/枯萎/) != null) {
                    harvest();
                    await waitPopUpClosed();
                } else if (timestr.match(/成熟/) != null) {
                    speedUp();
                    await waitAction();
                    await waitPopUpInfoLoaded();
                    harvest();
                    await waitPopUpClosed();
                }

                break;
            case 1:
                await farm();
            default:
                break;
        }
    }

    async function farm() {
        var seed = null;
        if (oneKey) {
            seed = document.querySelector(`#try > div > div:nth-child(2) > div:nth-child(${useSeed}) > div > div:nth-child(1) > a`);
        } else {
            seed = document.querySelector(`#try > div > div:nth-child(2) > div:nth-child(${useSeed}) > div > a:nth-child(2)`);
        }
        if (seed == null) {
            throw new Error('no seed');
        } else {
            seed.click();
            await waitAction();
            if (isDebug) console.log("close popup", new Date());
            await closePopUp();
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
        if (actionPoints <= minActionPointUsingDrug) {
            var res = await useActionPointDrug();
            if (res) {
                console.log("%c using action point drug", "color: red;", new Date());
                // await reloadpage();
            }

        }

        if (actionPoints == 0) {
            console.log("%c action point", "color: red;", new Date());
            await delay(9.9 * 60);
            await reloadpage();
        }
    }

    async function useActionPointDrug() {
        if (useActionDrug == false || isNearLevelUp(0.01)) {
            return false;
        }
        try {
            document.querySelector("#thistop > div:nth-child(1) > div.thistore > img").click();
            await waitPopUp();

            for (const div of document.querySelectorAll('a')) {
                if (div.textContent.toLowerCase().includes("+10点体力".toLowerCase())) {
                    div.parentNode.children[1].children[0].click();
                    console.log("useActionPointDrug", new Date());
                    await waitAction();
                    await closePopUp();
                    return true;
                }
            }
        } catch (error) {
            console.log("%c useActionPointDrug", "color: red;", error);
            return false;
        }

        return false;
    }

    function isNearLevelUp(pctExp) {
        try {
            var elements = document.querySelectorAll('[lay-percent]');
            if (elements.length > 0) {
                var lsExp = elements[0].getAttribute('lay-percent').replaceAll("\n", "").replaceAll(" ", "").split("/");
                var currExp = +lsExp[0];
                var maxExp = +lsExp[1];

                return (maxExp - currExp)/maxExp < pctExp;
            }
        } catch (error) {
            console.log("%c isNearLevelUp", "color: red;", error);
            return false;
        }
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
                var diff = (new Date() - beforeDelay)/1000;
                if(diff > seconds*1.5){
                    console.log("%c error delayed", "color: red;", "should delay ", seconds);
                    console.log("%c before", "color: red;", beforeDelay, "should delay ", seconds);
                }
            }, seconds*1000.0);
        });
    }

    async function waitPopUp() {
        await delay(2.9);
    }

    async function waitAction() {
        await delay(1.9);
    }

    async function reloadpage() {
        location.reload();
        await delay(60);
    }

})();