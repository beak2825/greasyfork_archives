// ==UserScript==
// @name        安全微伴自动刷课脚本
// @namespace   http://tampermonkey.net/
// @version     1.0.1
// @license     GPL-3.0
// @description 安全微伴刷课脚本，自动点击，小节刷完后需要手动选择！
// @author      117Ryan
// @match       https://mcwk.mycourse.cn/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506377/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506377/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
   

    const createTip = () => {
        const tip = document.createElement('button');
        tip.style.cssText = 'font-size:30px;position:fixed;top:10px;left:10px;z-index:9999;padding:5px 10px;cursor:pointer;';
        return tip;
    };

    const createButton = () => {
        const button = document.createElement('button');
        button.style.cssText = 'font-size:30px;position:fixed;top:10px;right:10px;z-index:9999;padding:5px 10px;cursor:pointer;';
        return button;
    };

    const setButtonText = (button, text) => {
        button.textContent = text;
    };

    const setTipText = (tip, text) => {
        tip.textContent = text;
    };

    const updateCountdown = (button, seconds) => {
        setButtonText(button, '当前时间：' + seconds + '秒');
        setTipText(tip, '刷课界面');
        if (seconds <= 0) {
            
            setButtonText(button, '倒计时结束，自动完成任务');
            button.disabled = false;
            button.click();
        }
    };

    console.log('开始倒计时:15秒');
    const startCountdown = (button, seconds) => {
        const interval = setInterval(() => {
            seconds--;
            updateCountdown(button, seconds);
            if (seconds <= 0) {
                clearInterval(interval); // 倒计时结束后清理计时器
            }
        }, 1000);
    };

    const simulateClick = (x, y) => {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        document.elementFromPoint(x, y).dispatchEvent(event);
       
    };

    const clickCenterThreeTimes = () => {
       
        const centerX = window.innerWidth / 2 - 30;
        const centerY = window.innerHeight / 2 - 50;

        setTimeout(() => simulateClick(centerX, centerY), 0);
        setTimeout(() => simulateClick(centerX + 20, centerY), 100);
        setTimeout(() => simulateClick(centerX + 40, centerY), 300);
        setTimeout(clickMaiCaptaButton, 1000);
    };

    const clickMaiCaptaButton = () => {
        console.log('尝试点击“mai-capta”按钮');
        const skipButton = document.querySelector('.mai-capta-button.mai-capta-button-skip');
        if (skipButton) {
            skipButton.click();
            document.body.removeChild(button);
            document.body.removeChild(tip);
           
        } else {
          
        }
    };

    const completeTask = () => {
       
        const iframe = document.querySelector('iframe');
        if (iframe) {
            
            window.location.href = iframe.src;
        } else if (typeof finishWxCourse === "function") {
            
            finishWxCourse();
        } else {
           
        }
        setTimeout(clickCenterThreeTimes, 1000);
    };

    const showAd = () => {
        const ad = document.createElement('div');
        ad.textContent = '刷课咯~请保持页面不是处于最小化状态！！！';
        ad.style.cssText = 'background-color:red;color:white;text-align:center;position:fixed;bottom:0px;width:100%;padding:10px 0px;z-index:9998;height:3%;font-size:medium;';
        document.body.appendChild(ad);
       
    };

    const button = createButton();
    const tip = createTip();
    setButtonText(button, '倒计时：15秒');
    setTipText(tip, '刷课界面');
    button.disabled = true;
    tip.disabled = true;
    button.onclick = completeTask;
    document.body.appendChild(button);
    document.body.appendChild(tip);
    showAd();
    startCountdown(button, 15);
})();
