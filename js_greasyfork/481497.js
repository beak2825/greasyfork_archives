// ==UserScript==
// @name       雨课堂-自动看PPT-Pro
// @version      8.8.0
// @namespace    自动看PPT，1模式版本，全新版本，新的检测机制，操作逻辑！
// @description   支持【雨课堂】自动看PPT，1模式版本，全新版本，新的检测机制，操作逻辑！“祝福”偷代码不声明作者的**！！！
// @author       ZuoTeam团队-ZTL
// @match        *.yuketang.cn/pro/yktmanage/*
// @match        *.yuketang.cn/v2/web/studentCards/*
// @match        https://www.yuketang.cn/pro/yktmanage/*
// @match        https://www.yuketang.cn/v2/web/studentCards/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @grant        GM_registerMenuCommand
// @grant	 GM_unregisterMenuCommand
// @license      CC BY-NC-SA 4.0
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/481497/%E9%9B%A8%E8%AF%BE%E5%A0%82-%E8%87%AA%E5%8A%A8%E7%9C%8BPPT-Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/481497/%E9%9B%A8%E8%AF%BE%E5%A0%82-%E8%87%AA%E5%8A%A8%E7%9C%8BPPT-Pro.meta.js
// ==/UserScript==

//TODO 优化代码架构，修改匹配方式，本版本仅保留 模式3，会跳，优化匹配方式，油猴不能匹配动态网页

(function() {
    'use strict';

    const targetPattern = /^(https?:\/\/(www\.)?yuketang\.cn\/(pro\/yktmanage|v2\/web\/studentCards)\/.*)$/;
    let hasRun = true; // 用于标识是否已经执行过函数

    let interval = GM_getValue('interval');
    if (interval === undefined || interval === null ) {
        GM_setValue('interval', 7000);
    }

    GM_registerMenuCommand(`一键阅读-doge`, () => {
        Doge();
    });

    GM_registerMenuCommand(`设置延迟时间（ms）`, () => {
        let newInterval = parseInt(prompt("输入延迟时间（ms）（建议不低于7000ms）：", interval));
        if (newInterval !== null) {
            newInterval = parseInt(newInterval);

            if (!isNaN(newInterval)) {
                if (interval !== newInterval) {
                    interval = newInterval;
                }
                GM_setValue('interval', interval);
                alert(`当前延迟时间: ${interval}（ms）`);
            } else {
                alert("请输入一个有效的数字！");
            }
        }
        GM_setValue('interval', interval);
        alert(`当前延迟时间: ${interval}（ms）`);
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickPPTBox() {
        await sleep(500);
        const pptBox = document.querySelector('.ppt_img_box');
        if (pptBox) {
            pptBox.click();
            console.log('已点击课件框');
        }
    }

    async function clickClose() {
        const totalExercises = parseInt(await getTotalExercises());
        const totalNoRead = parseInt(await countNoReadElements());
        const exitButton = document.querySelector('.el-button.el-button--default');
        if (exitButton) {
            exitButton.click();
            //console.log('已点击退出按钮');
            await sleep(100);
        }
        const pptBox = document.querySelector('.close');
        if (pptBox) {
            pptBox.click();
            //console.log('已点击关闭');
        }
        if (totalExercises == totalNoRead && totalNoRead != 0){
            console.log('存在习题，请手动完成！');
            alert("存在习题，请手动完成！");
        }else if (totalExercises == totalNoRead && totalNoRead == 0){
            console.log('全部完成！');
            alert("全部完成！");
        }
    }

    async function Mode3() {
        let index = 0;
        let buttonClickCount = 0;
        async function simulateClick() {
            const elements = document.querySelectorAll('span.flag.noRead');
            const totalPages = parseInt(await getTotalPages());
            const totalExercises = parseInt(await getTotalExercises());
            const totalNoRead = parseInt(await countNoReadElements());

            if (index < elements.length) {
                const element = elements[index];
                if (element) {
                    await sleep(interval);
                    element.click();
                    buttonClickCount++;
                    console.log(`按钮点击次数: ${buttonClickCount}`);
                    console.log("已点击按钮");
                    index++;
                    await simulateClick();
                } else {
                    console.log('元素不存在，请手动刷新');
                    alert("元素不存在，请手动刷新");
                }
            } else {
                console.log('所有按钮已点击完成');
                console.log('开始检查是否全部点击');
                if (totalPages <= 0) {
                    console.log('未匹配到总页数或总习题数，请手动检查是否全部完成');
                    alert('未匹配到总页数或总习题数，请手动检查是否全部完成');
                } else if (totalNoRead === totalExercises) {
                    console.log('点击次数匹配，完成');
                    await clickClose();
                } else {
                    console.log('点击次数不匹配，重新开始');
                    await extractPageInfo();
                    index = 0;
                    buttonClickCount = 0;
                    await simulateClick();
                }
            }
        }
        await simulateClick();
    }

    async function getTotalPages() {
        const pageElement = document.querySelector('.ppt_page');
        if (pageElement) {
            const pageMatch = pageElement.textContent.match(/\((\d+)页\)/);
            if (pageMatch) {
                const totalPages = pageMatch[1];
                return totalPages;
            }
        }
        return 0;
    }

    async function getTotalExercises() {
        const exercisesElement = document.querySelector('.exercises_total');
        if (exercisesElement) {
            const exercisesMatch = exercisesElement.textContent.match(/共(\d+)题/);
            if (exercisesMatch) {
                const totalExercises = exercisesMatch[1];
                return totalExercises;
            }
        }
        return 0;
    }

    async function countNoReadElements() {
        const noReadElements = document.querySelectorAll('span.flag.noRead');
        return noReadElements.length;
    }

    async function extractPageInfo() {
        const totalPages = await getTotalPages();
        const totalExercises = await getTotalExercises();
        const totalNoRead = await countNoReadElements();
        console.log(`提取信息: 总页数 = ${totalPages}, 总习题数 = ${totalExercises}， 总未读数 = ${totalNoRead}`);
    }

    async function Doge() {
        const elements = document.querySelectorAll('span.flag.noRead');
        elements.forEach(element => {
            element.classList.remove('noRead');
            element.classList.add('Read');
        });
        alert(`已一键全部阅读了！！！`);
        await sleep(2500);
        alert(`好吧，骗你的。Doge，你刷新看看。`);
    }

    async function main() {
        console.log('雨课堂自动看PPT-当前模式: mode3');
        console.log(`雨课堂自动看PPT-延迟时间: ${interval}`);
        await clickPPTBox();
        await sleep(300);
        await extractPageInfo();
        const totalExercises = parseInt(await getTotalExercises());
        const totalNoRead = parseInt(await countNoReadElements());
        if (totalExercises != totalNoRead && totalNoRead != 0) {
            await Mode3();
        } else {
            await clickClose();
        }
    }

    window.addEventListener('load', () => {
        main();
        Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; } });
    });

    /*     const checkUrlChange = () => {
        console.log(hasRun)
        if (targetPattern.test(location.href) && hasRun) {
            console.log('匹配到链接！')
            window.addEventListener('load', () => {
                main();
                hasRun = false;
                Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; } });
            });
        } else if (!targetPattern.test(location.href)) {
            hasRun = true;
        }
    };

    const observer = new MutationObserver(checkUrlChange);
    observer.observe(document, { childList: true, subtree: true });

    setInterval(checkUrlChange, 50); */
})();