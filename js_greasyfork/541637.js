// ==UserScript==
// @name         京东自动抢话费券
// @license      MIT
// @version      1.1
// @description  每天0点、10点、15点、18点、20点和22点自动抢京东优惠券
// @author       Bingo95
// @match        https://h5static.m.jd.com/mall/active/3aEzDU3fpqYYtnNTFPAkyY3tRY8Y/index.html*
// @grant        none
// @namespace https://greasyfork.org/users/1312821
// @downloadURL https://update.greasyfork.org/scripts/541637/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%9D%E8%B4%B9%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/541637/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%9D%E8%B4%B9%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建UI元素
    function createUI() {
        // 创建状态显示
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'coupon-status';
        statusDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
        `;

        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-display';
        countdownDisplay.style.cssText = `
            position: fixed;
            top: 60px;
            left: 10px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
        `;

        // 创建手动抢券按钮
        const grabButton = document.createElement('button');
        grabButton.textContent = '立即抢券';
        grabButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 0 20px;
            height: 40px;
            border: none;
            border-radius: 20px;
            background: #e93b3d;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(statusDisplay);
        document.body.appendChild(countdownDisplay);
        document.body.appendChild(grabButton);

        return { statusDisplay, countdownDisplay, grabButton };
    }

    // 获取下一个抢券时间
    function getNextGrabTime() {
        const now = new Date();
        const today0am = new Date(now);
        today0am.setHours(0, 0, 0, 0);

        const today10am = new Date(now);
        today10am.setHours(10, 0, 0, 0);

        const today3pm = new Date(now);
        today3pm.setHours(15, 0, 0, 0);

        const today6pm = new Date(now);
        today6pm.setHours(18, 0, 0, 0);

        const today8pm = new Date(now);
        today8pm.setHours(20, 0, 0, 0);

        const today10pm = new Date(now);
        today10pm.setHours(22, 0, 0, 0);

        const tomorrow0am = new Date(now);
        tomorrow0am.setDate(now.getDate() + 1);
        tomorrow0am.setHours(0, 0, 0, 0);

        const tomorrow10am = new Date(now);
        tomorrow10am.setDate(now.getDate() + 1);
        tomorrow10am.setHours(10, 0, 0, 0);

        if (now < today0am) {
            return { time: today0am, label: "今天0:00" };
        } else if (now < today10am) {
            return { time: today10am, label: "今天10:00" };
        } else if (now < today3pm) {
            return { time: today3pm, label: "今天15:00" };
        } else if (now < today6pm) {
            return { time: today6pm, label: "今天18:00" };
        } else if (now < today8pm) {
            return { time: today8pm, label: "今天20:00" };
        } else if (now < today10pm) {
            return { time: today10pm, label: "今天22:00" };
        } else if (now < tomorrow0am) {
            return { time: tomorrow0am, label: "明天0:00" };
        } else {
            return { time: tomorrow10am, label: "明天10:00" };
        }
    }

    // 更新倒计时
    function updateCountdown(countdownDisplay) {
        const nextGrab = getNextGrabTime();
        const now = new Date();
        const diff = nextGrab.time - now;

        if (diff <= 0) {
            grabCoupon();
            setTimeout(() => updateCountdown(countdownDisplay), 1000);
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDisplay.textContent = `${nextGrab.label}抢券倒计时: ${hours}时${minutes}分${seconds}秒`;

        setTimeout(() => updateCountdown(countdownDisplay), 1000);
    }

    // 抢券函数
    function grabCoupon() {
        const statusDisplay = document.getElementById('coupon-status');

        try {
            const couponWrapper = document.querySelector('.coupon_wrapper');
            if (!couponWrapper) {
                statusDisplay.textContent = "未找到优惠券元素";
                return;
            }

            statusDisplay.textContent = "正在抢券...";
            couponWrapper.click();

            setTimeout(() => {
                statusDisplay.textContent = "抢券操作已执行，即将刷新页面...";

                // 抢券后3秒刷新页面
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }, 1000);
        } catch (error) {
            statusDisplay.textContent = `抢券出错: ${error.message}`;
            console.error("抢券出错:", error);
        }
    }

    // 检查是否到达抢券时间
    function checkGrabTime() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // 在0:00:00、10:00:00、15:00:00、18:00:00、20:00:00和22:00:00准点抢券
        if ((hour === 0 || hour === 10 || hour === 15 || hour === 18 || hour === 20 || hour === 22) && minute === 0 && second === 0) {
            grabCoupon();
        }

        // 每秒检查一次
        setTimeout(checkGrabTime, 1000);
    }

    // 初始化
    function init() {
        const { statusDisplay, countdownDisplay, grabButton } = createUI();

        // 添加手动抢券按钮事件
        grabButton.addEventListener('click', grabCoupon);

        // 开始倒计时
        updateCountdown(countdownDisplay);

        // 开始检查抢券时间
        checkGrabTime();

        statusDisplay.textContent = "京东自动抢券脚本已启动";
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();