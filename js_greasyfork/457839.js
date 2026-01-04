// ==UserScript==
// @name         网页自定义倒计时
// @namespace    https://greasyfork.org/zh-CN/scripts/457839-%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%92%E8%AE%A1%E6%97%B6
// @version      1.4.1
// @description  网页自定义倒计时-蚩尤后裔
// @author       蚩尤后裔
// @homepage     https://greasyfork.org/zh-CN/scripts/457839-%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%92%E8%AE%A1%E6%97%B6
// @match        http*://*/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artDialog/7.0.0/dialog.js
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457839/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/457839/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';

    // 目标日期(yyyy,mth,dd,hh,mm,ss)，月份从0开始[0,11]，手动修改为实际日期即可
    let targetDate = new Date(2023, 0, 14, 8, 0, 0);
    let tipPrefix = '离春节回家还有';
    // 缓存目标日期的key
    const cacheKeyNameForDateTime = "wmx_targetDate";
    // 缓存倒计时名称的key
    const cacheKeyNameForName = "wmx_targetName";

    /**
     * 向原始页面添加倒计时元素
     *
     * @param align_items ：对齐方式
     * * align-items: flex-start; 上对齐
     * * align-items: center; 中对齐
     * * align-items: flex-end; 下对齐
     */

    function appendCountDownEle(align_items) {
        let contDownJQ = $(`<div id="page-countdown"></div>`);
        contDownJQ.css({'position': 'fixed', 'top': 0, 'bottom': 0, 'left': 0, 'right': 0, 'display': 'flex'});
        contDownJQ.css({'justify-content': 'center', 'align-items': align_items});
        contDownJQ.css({'color': 'rgba(252,85,49, 0.5)', 'font-size': '5vw'});
        contDownJQ.css({'pointer-events': 'none', 'z-index': '9999'});
        // $('body').append(contDownJQ);
        $("body").each(function (index) {
            $(this).append(contDownJQ);
        });
    }

    /**
     * 开始倒计时，每隔1秒刷新一下
     */
    function countDown() {
        // 如果缓存中存在，则继续保持原来设置的值。
        if(GM_getValue(cacheKeyNameForDateTime)) {
            targetDate.setTime(GM_getValue(cacheKeyNameForDateTime));
        }
        if(GM_getValue(cacheKeyNameForName)) {
            tipPrefix = GM_getValue(cacheKeyNameForName)
        }
        setInterval(() => {
            // 获取当前时间与目标时间的相差的秒数
            let diff = parseInt((targetDate - Date.now()) / 1000);
            let hour = parseInt(diff / 3600);
            let min = parseInt((diff / 60) % 60);
            let sec = parseInt(diff % 60);
            let day = 0;
            if (hour > 24) {
                day = parseInt(hour / 24);
                hour = hour % 24;
            }
            $("#page-countdown").text(`${tipPrefix}：${day}天${hour}小时${min}分${sec}秒`);
            // document.querySelector('#page-countdown').innerHTML = `离春节回家还有：${day}天${hour}小时${min}分${sec}秒`;
        }, 1000);
    }

    /**
     * 控制某个元素不断的透明度降为0，然后透明度又升为1
     * @param jQueryObj  ：待操作的 Jquery对象
     * @param speed      ：速度
     * @param opacity    ：透明度
     * @param isShow     ：1表示显示，0表示隐藏
     */
    function hFlout(jQueryObj, speed, opacity, isShow) {
        jQueryObj.fadeTo(speed, opacity, function () {
            /** 当本次为隐藏时，下次应该为显示*/
            if (isShow == 0) {
                isShow = 1;
                opacity = 1;
            } else {
                /** 当本次为显示时，下次应该为隐藏*/
                isShow = 0;
                opacity = 0;
            }
            /**方法回调，循环动画*/
            hFlout(jQueryObj, speed, opacity, isShow);
        });
    }

    /**
    * 自定义设置菜单功能
    */
    function customSetting() {
        // 如果已经弹出了，则直接跳过，不再重复弹出
        if($("#wmx_dialog_div").length > 0 ){
            return;
        }
        let contentHtml = "<div id='wmx_dialog_div'>\n" +
            "    <p>倒计时名称：<input type='text' maxlength=60 id='wmx_target_name'/>\n" +
            "    <p>目标日期：<input type='date' id='wmx_target_date'/><input type='time' id='wmx_target_time'></p>\n" +
            "</div>";
        let wmx_dialog = dialog({
            title: '自定义设置',
            quickClose: true, // 点击空白处快速关闭
            fixed: true,
            content: contentHtml
        });
        // 缓存有值时，进行回写
        if(GM_getValue(cacheKeyNameForName)) {
            $("#wmx_target_name").val(GM_getValue(cacheKeyNameForName));
        }
        // 回显年月日
        let wmx_chache_month = targetDate.getMonth() + 1;
        let wmx_chache_date = targetDate.getDate();
        wmx_chache_month = wmx_chache_month <10 ? '0' + wmx_chache_month: wmx_chache_month;
        wmx_chache_date = wmx_chache_date <10 ? '0' + wmx_chache_date: wmx_chache_date;
        $("#wmx_target_date").val(targetDate.getFullYear() +"-" + wmx_chache_month +"-" + wmx_chache_date);

        // 回显时分秒
        var wmx_chache_hour = targetDate.getHours(); // 时
        var wmx_chache_minutes = targetDate.getMinutes(); // 分
        wmx_chache_hour = wmx_chache_hour <10 ? '0' + wmx_chache_hour:wmx_chache_hour;
        wmx_chache_minutes = wmx_chache_minutes <10 ? '0' + wmx_chache_minutes:wmx_chache_minutes;
        $("#wmx_target_time").val(wmx_chache_hour +":" + wmx_chache_minutes);

        // 弹框
        wmx_dialog.show();

        // 获取倒计时名称
        $("#wmx_target_name").on("blur", function () {
            if ($(this).val() && $(this).val().trim().length > 0) {
                // 将用户设置的倒计时名称缓存起来，下次打开浏览器，以及新开其它页面都能看到最新设置的值。
                GM_setValue(cacheKeyNameForName, $(this).val().trim());
                tipPrefix = $(this).val().trim();
            }
        });

        // 获取[展示位置]
        $("input[name='wmx_show_position']").on("change", function () {
            console.log($(this).val());
        });
        // 获取[目标日期]
        $("#wmx_target_date,#wmx_target_time").on("change", function () {
            let year, month, day, hour, minute, second = "00";
            let targetDateStr = $("#wmx_target_date").val();
            let targetTimeStr = $("#wmx_target_time").val();
            if (targetDateStr && targetTimeStr) {
                let targetDateArr = targetDateStr.split("-");
                if (targetDateArr.length == 3) {
                    year = targetDateArr[0];
                    month = targetDateArr[1];
                    day = targetDateArr[2];
                }
                let targetTimeArr = targetTimeStr.split(":");
                if (targetTimeArr.length >= 2) {
                    hour = targetTimeArr[0];
                    minute = targetTimeArr[1];
                }
            }
            // 完整的目标日期
            if (year && month && day && hour && minute && second) {
                targetDate = new Date(year, month-1, day, hour, minute, minute);
                // 将用户设置的目标日期缓存起来，下次打开浏览器，以及新开其它页面都能看到最新设置的值。
                GM_setValue(cacheKeyNameForDateTime, targetDate.getTime());
            }
        });
    }

    $(function () {
        // 页面不是被其它页面 iframe 嵌入时才进行添加
        if (self == top) {
            // 向原始页面添加倒计时元素
            appendCountDownEle('flex-end');
            // 开始倒计时
            countDown();
            // 为倒计时加点动画效果
            hFlout($("#page-countdown"), 3000, 0, 0);
            // 自定义功能菜单
            GM_registerMenuCommand("自定义设置", customSetting);
        }
    });

})();