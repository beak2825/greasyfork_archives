// ==UserScript==
// @name         网页浏览离开黑屏保护
// @namespace    https://greasyfork.org/zh-CN/scripts/458100-%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E7%A6%BB%E5%BC%80%E9%BB%91%E5%B1%8F%E4%BF%9D%E6%8A%A4
// @version      1.6
// @description  网页一定时间内没有浏览时，自动黑屏保护(蚩尤后裔)
// @author       蚩尤后裔
// @homepage     https://greasyfork.org/zh-CN/scripts/458100-%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E7%A6%BB%E5%BC%80%E9%BB%91%E5%B1%8F%E4%BF%9D%E6%8A%A4
// @match        http*://*/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458100/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E7%A6%BB%E5%BC%80%E9%BB%91%E5%B1%8F%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/458100/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E7%A6%BB%E5%BC%80%E9%BB%91%E5%B1%8F%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';

    // 上次停留时间(单位秒)
    let last_stay_time = parseInt(new Date().getTime() / 1000);
    // 最长离开时间(单位秒)
    let maximum_leave_time = 30;
    // 黑屏倒计时(单位秒)
    let black_screen_countdown_second = 10;
    // 当前是否正在进行黑屏倒计时(1是2否)
    let is_start_black_screen_countdown = 2;
    // 当前是否处于黑屏状态(1是2否)
    let is_black_screen = 2;
    // 黑屏计时器(用于取消倒计时)
    let blackScreenCountdownTimer = null;
    // 时间比对计时器(用于取消倒计时)
    let comparisonTime = null;

    /**
     * 页面初始化处理。
     * 页面加载完成之后，从油猴存储中读取上一次页面是否黑屏的状态,如果之前处于黑屏状态，则继续保持。
     */
    function pageInit() {
        // console.log("is_black_screen：" + is_black_screen);
        let gm_key = location.href + "_gm_is_black_screen";
        is_black_screen = GM_getValue(gm_key, 2);
        // console.log("页面初始化处理:" + gm_key + "=" + is_black_screen);
        if(is_black_screen == 1){
            runBlackScreen();
        }
    }

    /**
     * 向原始页面添加倒计时元素
     */
    function appendCountDownEle() {
        // 倒计时元素
        let contDownJQ = $(`<div id="black_screen_countdown">10</div>`);
        contDownJQ.css({'position': 'fixed', 'top': 20, 'left': 20, 'display': 'flex'});
        contDownJQ.css({'color': 'rgba(252,85,49, 0.9)', 'font-size': '4vw'});
        contDownJQ.css({'pointer-events': 'none', 'z-index': '9998'});
        contDownJQ.hide();
        // $('body').append(contDownJQ);

        // 黑色的蒙版元素
        let blackScreenJQ = $(`<div id="black_screen"></div>`);
        blackScreenJQ.css({'position': 'absolute', 'top': 0, 'left': 0, 'width': '100%', 'height': '100%', 'display': 'fixed'});
        blackScreenJQ.css({'background-color': 'rgba(0,0,0, 1)'});
        blackScreenJQ.css({'z-index': '9999'});
        blackScreenJQ.hide();
        // $('body').append(blackScreenJQ);
        
        $("body").each(function (index) {
            // 页面不是被其它页面 iframe 嵌入时才进行添加
            if (self == top) {
                $(this).append(contDownJQ);
                $(this).append(blackScreenJQ);
            }
        });
    }

    /**
     * 为网页绑定事件，单击、滚动网页都认为用户在浏览，否则认为离开。
     */
    function listenForEvent() {
        $("body").on("click mouseover keypress", function() {
            // console.log("单击：" + location.href);
            // 更新上次停留时间(单位毫秒)
            last_stay_time = parseInt(new Date().getTime() / 1000);
            // 如果当前正在进行黑屏倒计时，则结束黑屏倒计时
            closeBlackScreenCountdown();
            // 如果当前处于黑屏状态，则允许输入解锁密码。
            if(is_black_screen == 1){
                let passwod = prompt("请输入解锁密码：");
                if (passwod == "18673886425"){
                    cancelBlackScreen();
                } else {
                    alert("密码错误，请重新输入！");
                }
            }
        });
        // 滚动条事件
        $(window).scroll( function() {
            // console.log("滚动：" + location.href);
            // 更新上次停留时间(单位毫秒)
            last_stay_time = parseInt(new Date().getTime() / 1000);
            // 如果当前正在进行黑屏倒计时，则结束黑屏倒计时
            closeBlackScreenCountdown();
        });

        // 浏览器页签失去焦点时触发(用户切换到了其它新网页)
        window.onblur = function(e) {
            // console.log("浏览器页签失去焦点时触发：" + comparisonTime);
            // 如果当前正在进行黑屏倒计时，则结束黑屏倒计时
            closeBlackScreenCountdown();
            if(comparisonTime) {
                // console.log("浏览器页签失去焦点时触发：不再计时");
                // 切换到其它页面后，不再计时
                window.clearInterval(comparisonTime);
                comparisonTime = null;
            };
        };
        // 浏览器页签获得焦点时触发(用户切换到了当前网页)
        window.onfocus = function(e) {
            // console.log("浏览器页签获得焦点时触发："+ comparisonTime);
            // 如果当前正在进行黑屏倒计时，则结束黑屏倒计时
            closeBlackScreenCountdown();
            // 更新上次停留时间(单位毫秒)
            last_stay_time = parseInt(new Date().getTime() / 1000);
            if(!comparisonTime) {
                // console.log("浏览器页签获得焦点时触发：重新监控时间变化");
                // 监控时间变化
                timingComparisonTime();
            }
        }
    }

    /**
     * 监控时间变化
     * 如果达到最长离开时间(maximum_leave_time)，则开始网页黑屏倒计时
     */
    function timingComparisonTime() {
        comparisonTime = setInterval(() => {
            // 当前时间(单位秒)
            let now_stay_time = parseInt(new Date().getTime() / 1000);
            // 如果当前不处于黑屏状态，且没在进行黑屏倒计时，且达到最长离开时间(maximum_leave_time)，则开始网页黑屏倒计时
            if(is_black_screen == 2 && is_start_black_screen_countdown == 2 && (now_stay_time - last_stay_time) > maximum_leave_time){
                // console.log("达到最长离开时间(maximum_leave_time)：" + maximum_leave_time +" 秒。");
                startBlackScreenCountdown();
            }
        }, 1000);
    }

    /**
    * 开始黑屏倒计时
    */
    function startBlackScreenCountdown() {
        let black_screen_countdown_second_copy = black_screen_countdown_second;
        // 结束黑屏倒计时
        closeBlackScreenCountdown();
        is_start_black_screen_countdown = 1;
        // console.log("开始网页黑屏倒计时：" + location.href);
        $("#black_screen_countdown").show();
        blackScreenCountdownTimer = setInterval(() => {
            // console.log("开始网页黑屏倒计时：" + (black_screen_countdown_second_copy--));
            $("#black_screen_countdown").text(black_screen_countdown_second_copy--);
            if(black_screen_countdown_second_copy <= -2) {
                // 开启网页黑屏
                runBlackScreen();
                // 结束黑屏倒计时
                closeBlackScreenCountdown();
            }
        }, 1000);
    }

    /**
    * 结束黑屏倒计时
    */
    function closeBlackScreenCountdown() {
        if(is_start_black_screen_countdown == 1 && blackScreenCountdownTimer){
            // console.log("结束网页黑屏倒计时：" + location.href);
            window.clearInterval(blackScreenCountdownTimer);
            is_start_black_screen_countdown = 2;
            $("#black_screen_countdown").hide();
            $("#black_screen_countdown").text("");
        }
    }

    /**
    * 开启网页黑屏
    */
    function runBlackScreen() {
        $("#black_screen").show();
        is_black_screen = 1;
        // 隐藏滚动条
        $("body").css("overflow", "hidden");
        let gm_key = location.href + "_gm_is_black_screen";
        GM_setValue(gm_key, is_black_screen);
        // console.log("网页正式黑屏." + gm_key +"=" + is_black_screen);
    }

    /**
    * 取消网页黑屏
    */
    function cancelBlackScreen() {
        // console.log("取消网页黑屏." + location.href);
        $("#black_screen").hide();
        is_black_screen = 2;
        // 显示滚动条
        $("body").css("overflow", "visible");
        let gm_key = location.href + "_gm_is_black_screen";
        GM_deleteValue(gm_key);
    }

    $(function () {
        // console.log("监控网页：" + location.href);

        // 向原始页面添加倒计时元素
        appendCountDownEle();

        // 页面加载完成之后，从油猴存储中读取上一次页面是否黑屏的状态,如果之前处于黑屏状态，则继续保持。
        pageInit();

        // 为网页绑定事件
        listenForEvent();

        // 监控时间变化
        timingComparisonTime();

    });

})();
