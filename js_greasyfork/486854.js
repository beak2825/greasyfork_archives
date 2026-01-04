// ==UserScript==
// @name         崩坏星穹铁道2.0直播虎牙自动领取
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  两点自动领星琼和积分，平时领材料
// @author       线性代数
// @match        https://zt.huya.com/bb79ff8d/pc/index.html
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/486854/%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%9320%E7%9B%B4%E6%92%AD%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486854/%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%9320%E7%9B%B4%E6%92%AD%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const videoDom = document.createElement('video');
    const hiddenCanvas = document.createElement('canvas');

    videoDom.setAttribute('style', 'display:none');
    videoDom.setAttribute('muted', '');
    videoDom.muted = true;
    videoDom.setAttribute('autoplay', '');
    videoDom.autoplay = true;
    videoDom.setAttribute('playsinline', '');
    hiddenCanvas.setAttribute('style', 'display:none');
    hiddenCanvas.setAttribute('width', '1');
    hiddenCanvas.setAttribute('height', '1');
    hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
    videoDom.srcObject = hiddenCanvas?.captureStream();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickElement(xpath, gap) {
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element && !(element.classList.contains('item')&&element.classList.contains('J_item')&&element.classList.contains('active'))&& !(element.classList.contains('tab-item')&&element.classList.contains('J_connShow')&&element.classList.contains('active'))) {
            if (element.innerText === "领取" || element.innerText === "" || element.innerText === "刷新" || element.innerText === "确定" || element.innerText === "领奖") {
                element.click();
                console.log(`点击: ${element.innerText}`);
                await sleep(gap * 1000);
            } else {
                console.log(`跳过: ${element.innerText}`);
            }
        }
    }

    async function main() {
        var startDate = new Date('2024-02-07');
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        var startMs = startDate.getTime();
        var endMs, now, hours, minutes, seconds, x;
        var newUP = [
            '//*[@id="matchComponent3"]/div/div[1]/div/div[2]',
            '//*[@id="matchComponent12"]/diy/div/div[3]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[1]/div[2]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent29"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
        ];
        var jifen = [
            '//*[@id="matchComponent3"]/div/div[1]/div/div[2]',
            '//*[@id="matchComponent12"]/diy/div/div[1]',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
            '//*[@id="matchComponent17"]/div/div/div[1]/div[2]/div[2]/div/div/div[1]/div/div[3]',
            '//*[@id="matchComponent17"]/div/div/div[2]/div/div/div[5]/div',
        ];
        for (let xpath of jifen) {
            await clickElement(xpath,3);
        }
        for (let xpath of newUP) {
            await clickElement(xpath,2);
        }
        while (true) {
            now = new Date();
            endMs = now.getTime();
            hours = now.getHours();
            minutes = now.getMinutes();
            seconds = now.getSeconds();
            x = 19 + Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24 * 7));
            console.log('当前时间：' + hours + ':' + minutes + ':' + seconds);
            var richang = [
                '//*[@id="matchComponent3"]/div/div[1]/div/div[2]',
                '//*[@id="matchComponent12"]/diy/div/div[2]',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[1]/div/div[2]/div[1]/span',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[1]/div/div[2]/div[3]/div[2]/div[1]/ul/li[1]/p/button',
                '//*[@id="matchComponent' + x + '"]/div[4]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[1]/div/div[2]/div[3]/div[2]/div[1]/ul/li[2]/p/button',
                '//*[@id="matchComponent' + x + '"]/div[4]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[1]/div/div[2]/div[3]/div[2]/div[1]/ul/li[3]/p/button',
                '//*[@id="matchComponent' + x + '"]/div[4]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[1]/div/div[2]/div[3]/div[2]/div[1]/ul/li[4]/p/button',
                '//*[@id="matchComponent' + x + '"]/div[4]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
                '//*[@id="matchComponent' + x + '"]/div/div[1]/div[2]/div/div/ul/li[1]/button',
                '//*[@id="matchComponent' + x + '"]/div[2]/div[2]/button',
            ];

            if (hours === 2 && minutes >= 0 && minutes <= 5) {
                for (let xpath of richang) {
                    await clickElement(xpath,0.5);
                }
                console.log("等待2秒");
                await sleep(1500)
            } else {
                if (hours === 1 && minutes >= 55) {
                    console.log("等待到2点");
                    await sleep((60 - minutes) * 60 * 1000 - 1000 * seconds - 1000);
                } else {
                    if(hours === 2 && minutes === 6) {
                        for (let xpath of jifen) {
                            await clickElement(xpath,3);
                        }
                        console.log("等待22秒");
                        await sleep(22 * 1000);
                    }
                    else{
                        for (let xpath of richang) {
                            await clickElement(xpath,0.5);
                        }
                        console.log("等待5分钟");
                        await sleep(5 * 60 * 1000);
                    }
                }
            }
        }
    }
    const button = document.createElement('button');
    button.textContent = '开始自动领取星琼';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '0';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '10000';
    button.style.backgroundColor = 'red';
    button.style.fontSize = '18px';
    button.style.padding = '8px 15px';
    document.body.appendChild(button);
    button.onclick = function() {
        button.textContent = '自动领取星琼中';
        button.disabled = true;
        window.onload = main();
    }
})();