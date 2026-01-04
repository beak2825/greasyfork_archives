// ==UserScript==
// @name         CDS 首云自动登录
// @namespace    http://tampermonkey.net/
// @version      2025-08-06
// @description  自动点击登录按钮、自动滑动验证码
// @author       Ganlv
// @match        https://c2.capitalonline.net/*
// @icon         https://c2.capitalonline.net/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541019/CDS%20%E9%A6%96%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541019/CDS%20%E9%A6%96%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand(
        "设置CDS用户名和密码",
        function () {
            const username = prompt("请输入用户名：", GM_getValue("username", ""));
            if (username === null) {
                return;
            }
            if (username === '') {
                alert("用户名不能为空");
                return;
            }
            const password = prompt("请输入密码：", "");
            if (password === null) {
                return;
            }
            if (password === '') {
                alert("密码不能为空");
                return;
            }
            GM_setValue("username", username);
            GM_setValue("password", password);
            alert("用户名和密码已保存！");
        },
    );

    GM_registerMenuCommand(
        "删除CDS用户名和密码",
        function () {
            GM_deleteValue("username");
            GM_deleteValue("password");
            alert("用户名密码已删除");
        },
    );

    function getImageData() {
        const slideVerifyImageEls = Array.from(document.querySelectorAll('.slideVerify-box img'));
        const imageEl = slideVerifyImageEls[0];
        const y = slideVerifyImageEls[1].parentElement.offsetTop; // 滑块 y 坐标
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.zIndex = 10000;
        canvas.width = imageEl.naturalWidth;
        canvas.height = imageEl.naturalHeight;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        const ctx = canvas.getContext('2d', {willReadFrequently: true});
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(imageEl, 0, 0);
        const imageData1 = ctx.getImageData(0, y + 51, canvas.width, 1); // 滑块最后一行
        const imageData2 = ctx.getImageData(0, y + 53, canvas.width, 1); // 滑块最后一行往下 2 行
        return [imageData1, imageData2];
    }

    // 计算颜色差值。因为白色区域的颜色差值很大，找出颜色差值最大的区域就是验证码。
    function calcDiff(data1, data2, blockPixels=40) {
        const totalPixels = data1.length / 4;
        const resultLength = totalPixels - blockPixels + 1;
        const result = new Float32Array(resultLength);
        // 初始化第一个窗口的和
        let sum1 = 0;
        let sum2 = 0;
        for (let j = 0; j < blockPixels; j++) {
            const pixelIndex = j * 4;
            sum1 += data1[pixelIndex] + data1[pixelIndex + 1] + data1[pixelIndex + 2];
            sum2 += data2[pixelIndex] + data2[pixelIndex + 1] + data2[pixelIndex + 2];
        }
        // 计算第一个结果
        result[0] = (sum1 - sum2) / 3 / blockPixels;
        // 滑动窗口：移除左边像素，添加右边像素
        for (let i = 1; i < resultLength; i++) {
            const removeIndex = (i - 1) * 4;
            const addIndex = (i + blockPixels - 1) * 4;
            sum1 -= data1[removeIndex] + data1[removeIndex + 1] + data1[removeIndex + 2];
            sum2 -= data2[removeIndex] + data2[removeIndex + 1] + data2[removeIndex + 2];
            sum1 += data1[addIndex] + data1[addIndex + 1] + data1[addIndex + 2];
            sum2 += data2[addIndex] + data2[addIndex + 1] + data2[addIndex + 2];
            result[i] = (sum1 - sum2) / 3 / blockPixels;
        }
        return result;
    }

    function findMaxIndex(arr) {
        if (arr.length === 0) {
            return -1;
        }
        let maxIndex = 0;
        let maxValue = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > maxValue) {
                maxValue = arr[i];
                maxIndex = i;
            }
        }
        return maxIndex;
    }

    function getLoginButton() {
        return Array.from(document.querySelectorAll('.el-form button span')).filter(el => el.textContent.includes('登录') && el.offsetParent !== null)[0];
    }

    async function simulateSlide(code) {
        const targetElement = document.querySelector('.slide-verify-slider-mask-item');
        targetElement.dispatchEvent(new MouseEvent('mousedown',{
            bubbles: true,
            cancelable: true,
            clientX: 20,
            clientY: 20,
        }));
        targetElement.dispatchEvent(new MouseEvent('mousemove',{
            bubbles: true,
            cancelable: true,
            clientX: 20 + code / 268 * 287, // 拼图和滑块的滑动距离不一样，需要按比例转换一下。
            clientY: 20,
        }));
        await new Promise((resolve) => setTimeout(resolve, 500));
        targetElement.dispatchEvent(new MouseEvent('mouseup',{
            bubbles: true,
            cancelable: true,
            clientX: 20,
            clientY: 20,
        }));
    }

    (async () => {
        if (!location.pathname.startsWith('/login')) {
            return;
        }
        const username = GM_getValue("username", "");
        const password = GM_getValue("password", "");
        if (!username || !password) {
            console.log("用户名或密码为空，请先设置用户名和密码。");
            return;
        }
        for (let i = 0; i < 100; i++) {
            const loginButtonEl = getLoginButton();
            if (loginButtonEl) {
                document.querySelector('input[placeholder="登录名/手机号/邮箱"]').value = username;
                document.querySelector('input[placeholder="登录密码"]').value = password;
                await new Promise((resolve) => setTimeout(resolve, 100));
                document.querySelector('input[placeholder="登录名/手机号/邮箱"]').dispatchEvent(new Event('input', {
                    bubbles: true,
                    cancelable: true
                }));
                document.querySelector('input[placeholder="登录密码"]').dispatchEvent(new Event('input', {
                    bubbles: true,
                    cancelable: true
                }));
                loginButtonEl.click();
                console.log('Login button clicked');
                break;
            } else {
                console.log('Waiting login form loaded');
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        while (location.pathname.startsWith('/login')) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const [imageData1,imageData2] = getImageData()
            const code = findMaxIndex(calcDiff(imageData1.data, imageData2.data, 40));
            console.log(`code = ${code}`);
            simulateSlide(code);
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
    })();
})();