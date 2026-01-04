// ==UserScript==
// @name         京东养猪
// @namespace    http://tampermonkey.net/
// @version      0.4.9
// @description  京东养猪： 签到、捡饲料、喂食、抽奖
// @author       bob
// @match        https://uua.jr.jd.com/*
// @grant        none
// @note         插件地址： https://greasyfork.org/zh-CN/scripts/398000-%E4%BA%AC%E4%B8%9C%E5%85%BB%E7%8C%AA
// @note         2020-04-07 使用let声明变量
// @note         2020-04-23 当浏览器被限制养猪时，会每隔15分钟刷新页面重试
// @downloadURL https://update.greasyfork.org/scripts/398000/%E4%BA%AC%E4%B8%9C%E5%85%BB%E7%8C%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/398000/%E4%BA%AC%E4%B8%9C%E5%85%BB%E7%8C%AA.meta.js
// ==/UserScript==

// 养猪连接
const jdyzUrl = 'https://uua.jr.jd.com/uc-fe-wxgrowing/cloudpig/index/home/20191030/158432123100870350/?channelLV=qdy&shareId=vZoq-O6FkuUp62HuKheuTcAdoUJQ3Dik&sourceID=240&actflag=1AEE706F1D&isPay=N&utm_source=Android%2aurl%2a1584321232229&utm_medium=jrappshare&utm_term=qqfriends';
// 点击后等待时间
const timeForClick = 1000;
// 定时捡饲料
let pickFoodTask = null;

(function() {
    'use strict';
    // Your code here...
    // 根据class名称，点击对应节点
    function clickByClassName (className, index = 0) {
        let btn = document.getElementsByClassName(className)
        if (btn && btn[index]) {
            btn[index].click();
            return true;
        }
        return false;
    }

    function sleep(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    // 京东养猪
    if (/https:\/\/uua.jr.jd.com\/uc-fe-wxgrowing\/cloudpig\/index\/home\/20191030\/158432123100870350\/*/.test(window.location.href)) {
        // 签到
        async function signIn () {
            console.log('准备签到')
            // 打开签到
            clickByClassName("main-icon main-icon-sign");
            await sleep(timeForClick);
            // 签到
            clickByClassName("sign-btn");
            await sleep(timeForClick);
            // 关闭签到
            clickByClassName("sign-close");
            // 关闭奖励
            clickByClassName("precious-btn");
            console.log('签到完成');
        }

        // 捡猪饲料
        function pickFood () {
            console.log('开始捡猪饲料');
            let disableFood = document.getElementsByClassName("main-precious-disable")[0];
            if (disableFood) {
                console.log('待补给饲料，停止捡饲料');
                stopPickFood();
            }
            if (pickFoodTask) {
                return;
            }
            pickFoodTask = setInterval(async () => {
                // 点击左边礼物盒
                let res = clickByClassName("precious precious-one precious-pos-1 springback");
                if (!res) {
                    // 点击右边礼物盒
                    clickByClassName("precious precious-one precious-pos-2 springback");
                }
                await sleep(timeForClick);
            	clickByClassName("precious-btn");
            }, 3000);
        }

        // 停止捡饲料
        function stopPickFood () {
            console.log('停止捡饲料')
            if (pickFoodTask) {
                clearInterval(pickFoodTask);
            }
        }

        // 添加食物
        async function addFood () {
            console.log('开始喂食')
            // 打开饲料仓库
            clickByClassName("draw-trough-img");
            await sleep(timeForClick);

            // 如果是没有饲料，直接关闭
            let empytBtn = document.querySelector('.empty-btn');
            if (empytBtn) {
                empytBtn.click();
                console.log('没有饲料，退出喂食');
                await sleep(timeForClick);
                return false;
            }
            // 饲料详情
            let foodItems = document.getElementsByClassName("feed-item-desc");
            let foodCounts = new Array();
            for (let i=0; i<foodItems.length; i++) {
                let count = foodItems[i].childNodes[1].innerText;
                foodCounts.push({"index": i, "count": count});
            }
            // 饲料按余量降序
            foodCounts.sort((a, b) => {
                return b.count - a.count;
            });
            // 取最大余量喂食
            let index = foodCounts[0].index;
            clickByClassName("feed-item-btn", index);
            // 关闭饲料仓库
            clickByClassName("feed-close");
            await sleep(timeForClick);
        }

        // 是否需要喂食
        function isNeedFood () {
            let needBtn = document.getElementsByClassName("draw-feed-btn")
            if (needBtn && needBtn[0]) {
                return true;
            }
            // 剩余时间 mm:hh:ss 格式
            let residue = document.getElementsByClassName("draw-feed-time");
            if (residue && residue[0]) {
                return !/\d{2}:\d{2}:\d{2}/.test(residue[0].innerText);
            }
            return false;
        }

        // 抽奖
        async function getLucky() {
            let btn = document.querySelector(".foot-icon");
            btn.click();
            console.log('打开抽奖');
            await sleep(2000);
            console.log('已打开抽奖');
            btn = document.querySelector("a[class='luck-btn KinerLotteryBtn start']");
            if (btn) {
                let txt = btn.innerText;
                if (txt.indexOf('免费') == 0) {
                    console.log('免费抽奖');
                    btn.click();
                    await sleep(8000);
                    btn = document.querySelectorAll('.precious-btn');
                    if (btn && btn[0] && btn[0].innerText == '好的') {
                        btn[0].click();
                        await sleep(timeForClick);
                        getLucky();
                    } else {
                        console.log('没有中奖');
                        btn = document.querySelector('.luck-close');
                        btn.click();
                        await sleep(timeForClick);
                    }
                } else {
                    console.log('免费次数用完，退出抽奖');
                    btn = document.querySelector('.luck-close');
                    btn.click();
                    await sleep(timeForClick);
                }
            } else {
                console.log('没有签到抽奖入口');
                btn = document.querySelector('.luck-close');
                btn.click();
                await sleep(timeForClick);
            }
        }

        // 协调喂食和捡饲料
        function checkAndAddFood () {
            setInterval(() => {
                if (isNeedFood()) {
                    stopPickFood();
                    addFood();
                    pickFood();
                } else {
                    console.log('不需要喂食')
                }
            }, 3000);
        }

        // 检查是否可以执行
        function checkCanExecute() {
            let war = document.querySelector('.modal-btn.confirm');
            if (war && war.innerText == '在京东金融App领福利') {
                console.log("被限制只能在京东金融App领福利");
                // alert('无法自动养猪，请设置浏览器代理为手机模式、清除浏览器缓存后，刷新页面重试');
                return false;
            }
            return true;
        }

        // 清除浏览器缓存
        function clearCache() {
            let ca = document.cookie.split(';');
            for(let i=0; i<ca.length; i++) {
                let c = ca[i].trim();
                console.log(`document.cookie = "${c}; expires=Thu, 01 Jan 1970 00:00:00 GMT";`);
                document.cookie = `${c}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
            return "";
        }

        window.addEventListener("load", async () => {
            await sleep(3000);
            if (!checkCanExecute()) {
                let date = new Date();
                // alert('检测到当前浏览器被限制养猪，每隔15分钟自动刷新页面重试');
                console.log(`检测到当前浏览器被限制养猪，15分钟后自动刷新页面重试，当前时间： ${date.getDate()} 日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                let tip = document.createElement('span');
                tip.innerText = '自动养猪：检测到当前浏览器被限制，15分钟后自动刷新页面重试';
                tip.style = 'font-size: 20pt;'
                document.body.insertBefore(tip, document.body.children[0]);
                setTimeout(() => {window.location.reload()}, 1000*60*15);
                return false;
            }
            let date = new Date();
            console.log(`开始搞事情 ${date.getDate()} 日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            signIn();
            await sleep(5000);
            getLucky();
            pickFood();
            checkAndAddFood();

            // 下一天凌晨刷新页面，进行新一轮任务
            
            date = new Date();
            date.setDate(date.getDate()+1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(1);
            setTimeout(() => {
                window.location.reload();
            }, (date.getTime() - new Date().getTime()));
            console.log(`计划【${date}】 刷新页面`);
            
            // 每一个小时刷新一次页面
            /*
            setTimeout(() => {
                window.location.reload();
            }, (1000*60*60));
            console.log(`计划一个小时后刷新页面`);
            */
        });
    }

})();