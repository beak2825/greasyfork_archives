// ==UserScript==
// @name         河洛农场 自动种植
// @version      0.0.13
// @description  自动种植农场
// @author       selfuse
// @license      GPL-3.0 License
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horou.com
// @grant        none
// @namespace ke3470.com
// @downloadURL https://update.greasyfork.org/scripts/467367/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467367/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%20%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    var nextCheckTime = new Date();
    var failTimes = 0;
    const totalLands = 5;
    const useActionDrug = true;
    const minActionPointUsingDrug = totalLands;
    const switchSeed = true;
    var doProcess = false;
    var actionPoints = 0;
    var isDebug = false;
    var beforeDelay = new Date();
    const maxGap = 29.9;

    await run();

    async function run() {
        await waitScreenRefresh();
        if (isDebug) console.log("start");
        while(true) {
            try {
                if (isDebug) console.log("start", new Date());
                doProcess = false;
                setActionPoints();
                await farm();
                await harvestSpeedUp();
                await waitLoading();

                failTimes = 0;
            } catch(e) {
                if (failTimes >= 3) {
                    console.log("%c fail too many times, reload page", "color: red;", new Date());
                    await reloadpage();
                    break;
                } else {
                    if (isDebug) console.log("%c main process error", "color: red;", e);
                    failTimes += 1;
                    await waitAction();
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

    async function farm() {
        var farmlist = Array.from(document.getElementsByClassName("thispop"));
        if (isDebug) console.log("farm", farmlist, "action point", actionPoints, new Date());
        var itemNumber = 0;
        if ( switchSeed && actionPoints < (totalLands+1) && !isNearLevelUp(0.01)) {
            itemNumber = 1;
        }
        for (const element of farmlist) {
            if (isDebug) console.log("click farm land", new Date());
            element.click();
            doProcess = true;
            if (isDebug) console.log("wait popup", new Date());
            await waitPopUp();

            var failTimes = 0;
            var currentfarm = null;
            while (true) {
                currentfarm = document.getElementById("try");
                if (currentfarm != null) {
                    break;
                }

                if (isDebug) console.log("currentfarm processNoPopUp", new Date());
                await processNoPopUp(failTimes);
                failTimes += 1;
            }

            // click first crop
            if (isDebug) console.log(`farm ${itemNumber}`, new Date());
            var seed = currentfarm.children[2].children[1].children[itemNumber];
            if (seed == null) {
                seed = currentfarm.children[2].children[1].children[0];
            }
            seed.children[0].children[1].click();
            await waitAction();

            if (isDebug) console.log("close popup", new Date());
            await closePopUp();
        }
    }


    async function harvestSpeedUp() {
        var farmlist = Array.from(document.getElementsByClassName("thisfarm"));
        if (isDebug) console.log("harvestSpeedUp", farmlist, new Date());
        await processActionPoint();

        var newCheckTime = getDefaultNextCheckTime();

        for (const element of farmlist) {
            if (isDebug) console.log("process land", element, new Date());
            var timehavest = await processFarmLand(element);
            if (isDebug) console.log("finish", new Date());
            if (timehavest == null) {
                doProcess = false;
                return;
            }
            if (timehavest < newCheckTime) {
                newCheckTime = timehavest;
            }
        }
        await waitUntillNextCheckTime(newCheckTime);
    }

    async function processFarmLand(farmLand) {
        if (isDebug) console.log("click land", new Date());
        farmLand.click();
        doProcess = true;
        if (isDebug) console.log("popup", new Date());
        await waitPopUp();

        var failTimes = 0;
        var currentfarm = null;
        while (true) {
            currentfarm = document.getElementById("try");
            if (currentfarm != null) {
                break;
            }

            if (isDebug) console.log("currentfarm processNoPopUp", new Date());
            await processNoPopUp(failTimes);
            failTimes += 1;
        }

        failTimes = 0;
        var spanlist = null;
        while (true) {
            spanlist = currentfarm?.children[2]?.children[0]?.children[1]?.children[1]?.children;
            if (spanlist != null) {
                break;
            }

            if (isDebug) console.log("spanlist processNoPopUp", new Date());
            await processNoPopUp(failTimes);
            failTimes += 1;
        }

        var timestr = spanlist[0].textContent;

        if (timestr.match(/枯萎/) != null) { // 收获
            spanlist[1].click(); //点击收获
            if (isDebug) console.log("harvest", new Date());
            await waitAction();

            if (isDebug) console.log("close popup", new Date());
            await closePopUp();
            if (isDebug) console.log("farm", new Date());
            await farm();
            return await processFarmLand(farmLand);
        } else if (timestr.match(/成熟/) != null) { // 加速
            // if (spanlist[1] != null) {//加速可用
            //     //if (isDebug) console.log("加速信息:" + spanlist[spanid].textContent);
            //     spanlist = spanlist[1].children;
            //     //if (isDebug) console.log(spanlist);
            //     for (spanid = 0; spanid < spanlist.length; spanid=spanid+2) {
            //         speedup = spanlist[spanid].textContent.match(/\d+/)[0];
            //         //if (isDebug) console.log("speedup : " + speedup);
            //         if (spanlist[spanid].textContent.match(/小时/) != null) {//按钮为加速n小时
            //             speedup = speedup * 3600 * 1000;
            //         } else {//按钮为加速n分钟
            //             speedup = speedup * 60 * 1000;
            //         }
            //         //if (isDebug) console.log("加速(ms):" + speedup);

            //         //判断剩余时间
            //         //if (isDebug) console.log("timediff:" + (timehavest - timenow));
            //         if ((timehavest - timenow) > (speedup - 300000)) { //剩余时间超过加速时间，可以使用加速
            //             if (isDebug) console.log("点击加速, 加速(ms):" + speedup);
            //             spanlist[spanid].click(); //点击加速

            //             //延时5s重新判断作物成熟时间
            //             currentfarm.parentNode.parentNode.getElementsByClassName("layui-layer-close1")[0].click();//关闭当前地块信息
            //             stat = 3;
            //             timeout = 5;
            //             setTimeout(step, timeout*1000);
            //             return;
            //        }
            //     }
            // }

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
        if (actionPoints <= minActionPointUsingDrug) {
            var res = await useActionPointDrug();
            if (res) {
                console.log("%c using action point drug", "color: red;", new Date());
                await reloadpage();
            }

        }

        if (actionPoints == 0) {
            console.log("%c action point", "color: red;", new Date());
            await delay(9.9 * 60);
            await reloadpage();
        }
    }

    async function useActionPointDrug() {
        if (useActionDrug == false || isNearLevelUp(0.06)) {
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

    async function processNoPopUp(failTimes) {
        if (failTimes < 3) {
            await waitPopUp();
        } else {
            await reloadpage();
        }
    }

    async function closePopUp() {
        try {
            document.querySelector("span.layui-layer-setwin > a").click();
            await waitClose();
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
                    playAudio();
                }
            }, seconds*1000.0);
        });
    }

    // to avoid timer throttling
    function playAudio() {
        var audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
        audio.play();
    }

    async function waitPopUp() {
        await delay(2.9);
    }

    async function waitAction() {
        await delay(2.0);
    }

    async function waitClose() {
        await delay(1.5);
    }

    async function waitScreenRefresh() {
        await delay(5.0);
    }


    function getDefaultNextCheckTime() {
        return new Date((new Date()).getTime() + 60.0*60*1000);
    }

    async function reloadpage() {
        location.reload();
        await delay(60);
    }

})();