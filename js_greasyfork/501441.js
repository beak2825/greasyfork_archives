// ==UserScript==
// @name         动画疯自动同意年龄确认，移除广告跳转，广告静音，自动点击跳过广告
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  能够动画疯自动同意年龄确认，移除广告跳转，广告静音，自动点击跳过广告……安装即可，自动执行
// @author       XLXZ
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501441/%E5%8A%A8%E7%94%BB%E7%96%AF%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%B9%B4%E9%BE%84%E7%A1%AE%E8%AE%A4%EF%BC%8C%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BD%AC%EF%BC%8C%E5%B9%BF%E5%91%8A%E9%9D%99%E9%9F%B3%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/501441/%E5%8A%A8%E7%94%BB%E7%96%AF%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%B9%B4%E9%BE%84%E7%A1%AE%E8%AE%A4%EF%BC%8C%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BD%AC%EF%BC%8C%E5%B9%BF%E5%91%8A%E9%9D%99%E9%9F%B3%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //-配置项
    // 是否需要移除广告跳转链接？
    let ifRemoveAdsJump = true;
    // 广告期间是否静音？
    let ifMuteDuringAd = true;
    // 广告持续时间？
    let adDuringTime = 30;


    //-函数调用
    function removeAdsJump() {
        const vastBlocker = document.querySelector('.vast-blocker');
        if (vastBlocker) {
            vastBlocker.remove();
            console.log('移除广告跳转');
            return true;
        } else {
            console.log('没有广告跳转');
            return false;
        }
    }

    function skipAds() {
        const skipButton = document.querySelector('#adSkipButton');
        if (skipButton && skipButton.classList.contains('enable')) {
            skipButton.click();
            console.log('跳过广告');
            return true;
        } else {
            return false;
        }
    }

    function checkAds() {
        const skipButton = document.querySelector('#adSkipButton');
        if (!skipButton) {
            console.log('没有广告');
            return false;
        }
        return true;
    }

    function muteAds() {
        const muteButton = document.querySelector('.vjs-mute-control.vjs-control.vjs-button');
        if (muteButton) {
            if (!muteButton.classList.contains('vjs-vol-0')) {
                muteButton.click();
            }
            else {
                console.log('已经静音了');
                return true;
            }
            console.log('广告静音');
            return true;
        } else {
            console.log('没有静音按钮');
            return false;
        }
    }

    function unmuteAds() {
        const muteButton = document.querySelector('.vjs-mute-control.vjs-control.vjs-button');
        if (muteButton) {
            if (muteButton.classList.contains('vjs-vol-0')) {
                muteButton.click();
            }
            else {
                console.log('已经取消静音了');
                return true;
            }
            console.log('取消静音');
            return true;
        } else {
            console.log('没有静音按钮');
            return false;
        }
    }

    function agreeAge() {
        const adultButton = document.querySelector('#adult');
        if (adultButton) {
            adultButton.click();
            console.log('同意年龄确认');
            return true;
        } else {
            console.log('没有年龄确认按钮');
            return false;
        }
    }

    let timers = [];
    function tryUntillSuccess(func, timeout, functionName = "未知函数", interval = 20) {
        let successFunc;
        let failFunc;
        const timer = setInterval(() => {
            if (func()) {
                clearInterval(timer);
                // 同时也要清除超时计时器
                clearTimeout(timeOut);
                console.log('成功执行' + functionName);
                if (successFunc) successFunc();
            }
        }, interval);
        timers.push(timer);

        const timeOut = setTimeout(() => {
            clearInterval(timer);
            console.log(functionName + '执行超时，停止尝试');
            if (failFunc) failFunc();
        }, timeout);
        timers.push(timeOut);

        return {
            onSuccess: (func) =>{
                successFunc = func;
            },
            onFail:(func)=>{
                failFunc = func;
            }
        }
    }

    function clearAllTimers() {
        timers.forEach(timer => {
            clearInterval(timer);
            clearTimeout(timer); // 对于setTimeout和setInterval都有效
        });
        timers = [];
        console.log('所有计时器已清除');
    }


    //- 程序核心入口
    const handleChange = (mutationsList, observer) => {
        console.log(`类属性变化了,应该是剧集发生变化，重新加载脚本……`);
        clearAllTimers();

        // 开启新的监控
        tryUntillSuccess(startObserve,2000,"监控剧集变化")


        tryUntillSuccess(agreeAge, 2000, "同意年龄确认");

        if (ifRemoveAdsJump) {
            tryUntillSuccess(removeAdsJump, 2000, "移除广告跳转");
        }
        if (ifMuteDuringAd) {
            tryUntillSuccess(checkAds, 2000, "检查是否有广告并且静音").onSuccess(()=>{tryUntillSuccess(muteAds, 2000, "广告静音")});
        }

        // 防止被错误判定这里在1s后再做一个补充判定
        const reCheckAds = setTimeout(() => {
            if (!checkAds()) {
                tryUntillSuccess(unmuteAds, 1000, "取消静音");
            }
        }, 1000);
        timers.push(reCheckAds);

        // XXs后尝试跳过广告
        const skipAdsTimer = setTimeout(() => {
            console.log(adDuringTime + '秒到了，尝试跳过广告');
            tryUntillSuccess(skipAds, 5000, "跳过广告", 100).onSuccess(()=>{tryUntillSuccess(unmuteAds, 2000, "跳过广告后取消静音")});
        }, adDuringTime * 1000)
        timers.push(skipAdsTimer);
    };


    // 创建一个观察者实例并传入回调函数
    const observer = new MutationObserver(handleChange);

    // 指定要监控的配置选项（这里是属性变化）
    const config = { attributes: true, attributeFilter: ['class'] };

    // 选择目标节点
    let targetNode = document.querySelector('.playing');
    console.log(targetNode ? '找到剧集元素' : '未找到剧集元素');

    // 开始监控目标节点
    function startObserve() {
        //停止之前的观察
        observer?.disconnect();
        // 选择目标节点
        targetNode = document.querySelector('.playing');
        if (targetNode) {
            observer.observe(targetNode, config);
            console.log('找到剧集元素')
            return true;
        } else {
            console.log('未找到剧集元素');
            return false;
        }
    }

    // 如果失败就直接运行主程序
    // 失败是因为找不到监控节点，这可能是因为单个剧集造成的
    // 如果失败 -> 单个剧集 -> 不存在剧集切换 -> 无需监控，只跑一次
    tryUntillSuccess(startObserve,2000,"监控剧集变化").onFail(handleChange);
})();