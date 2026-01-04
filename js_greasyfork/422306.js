// ==UserScript==
// @name         辅助签到
// @description  常用辅助签到工具，包括远景论坛、52破解、SMZDM、TTG、Hao4K、飞客等。
// @namespace    isign
// @version      1.0.1
// @author       Hugo
// @include      http*://*.pcbeta.com/*
// @include      http*://totheglory.im/*
// @include      http*://www.52pojie.cn/*
// @include      http*://www.smzdm.com/*
// @include      http*://www.hao4k.cn/*
// @include      http*://flyertea.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/422306/%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/422306/%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    // 日期格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                   //月份
            "d+": this.getDate(),                        //日
            "h+": this.getHours(),                       //小时
            "m+": this.getMinutes(),                     //分
            "s+": this.getSeconds(),                     //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()                  //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // 远景
    if (matchURL("bbs.pcbeta.com") || matchURL("i.pcbeta.com")) {
        // 判断是否登录
        if ($('.vwmy').length > 0) {
            // 获取上次签到日期
            var pcbetaLastSignDate = getData('pcbeta');
            if (!pcbetaLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), pcbetaLastSignDate)) {
                console.log('开始自动签到！');
                $.ajax({
                    type: "GET",
                    url: "/home.php?mod=task&do=apply&id=149",
                    success: function (data) {
                        if (data.indexOf('恭喜您，任务已成功完成，您将收到奖励通知，请注意查收') != -1) {
                            console.log('签到完成!');
                            setData('pcbeta', new Date().format("yyyy-MM-dd"));
                        }
                        if (data.indexOf('抱歉，本期您已申请过此任务，请下期再来') != -1) {
                            console.log('重复签到!');
                            setData('pcbeta', new Date().format("yyyy-MM-dd"));
                        }
                    }
                })
            }
        }
    }

    // TTG
    if (matchURL("totheglory.im")) {
        if ($("#signed")) $("#signed")[0].click();
    }

    // Hao4K
    if (matchURL("hao4k.cn")) {
        if ($("#JD_sign")) $("#JD_sign")[0].click();
    }

    // 52破解
    if (matchURL("52pojie.cn")) {
        var qdimg = $("img[src$='qds.png']");
        if (qdimg) {
            $.ajax({
                url: 'home.php?mod=task&do=apply&id=2',
                dataType: 'html',
                success: function (result) {
                    if (result.indexOf('任务已完成') != -1) {
                        console.log("签到成功!");
                        qdimg.attr('src', 'https://www.52pojie.cn/static/image/common/wbs.png');
                    }
                }
            })
        }
    }

    // 什么值得买
    if (matchURL("smzdm.com")) {
        var signBtn = $('.J_punch');
        if ($('.J_punch').length > 0 && signBtn.text() == '签到领奖') {
            $('.J_punch')[0].click();
        }
    }

    // 飞客茶馆
    if (matchURL("flyertea.com")) {
        if ($('a[data-title="签到"]').length > 0) {
            $.ajax({
                url: 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + $("input[name='formhash']").val() + '&from=insign&is_ajax=1',
                dataType: 'html',
                success: function (result) {
                    if (result.indexOf('签到成功') != -1) {
                        console.log("签到成功!");
                        location.reload();
                    }
                }
            })
        }
    }

    function qd(checkElement, emoji) {
        if (matchURL('dsu_paulsign:sign')) {
            if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                $("#" + emoji).attr('checked', true);
                $("#todaysay").val("每天签到水一发。。。");
                $("#qiandao").submit();
            }
        } else if (window.find(checkElement)) {
            window.location.href = "plugin.php?id=dsu_paulsign:sign";
        }
    }

    // 比较日期大小
    function compareDate(date1, date2) {
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        if (d1.getTime() > d2.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    // 获取分割后的最后的文本
    function getLastText(text, separtor) {
        var arr = text.split(separtor);
        return arr[arr.length - 1];
    }

    function getStorageData() {
        var data = GM_getValue('BBSSignHelperData');
        if (!data) {
            data = {};
        }
        return data;
    }

    function getData(key) {
        var data = getStorageData();
        return data[key];
    }

    function setData(key, value) {
        var data = getStorageData();
        data[key] = value;
        return GM_setValue('BBSSignHelperData', data);
    }

    function deleteStorageData() {
        GM.deleteValue("BBSSignHelperData");
    }

    function matchURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
})();