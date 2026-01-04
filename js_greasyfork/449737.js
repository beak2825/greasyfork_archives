// ==UserScript==
// @name        掌上百科自动完成日常任务
// @namespace   Violentmonkey Scripts
// @version     1.1.2
// @author      NoHeatPen
// @description 2022/8/18 08:03:59，自动签到、浇水施肥、兑换积分，基于[自用论坛辅助签到](https://greasyfork.org/zh-CN/scripts/38018-%E8%87%AA%E7%94%A8%E8%AE%BA%E5%9D%9B%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0)
// @include      http*://www.pdawiki.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/449737/%E6%8E%8C%E4%B8%8A%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%97%A5%E5%B8%B8%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/449737/%E6%8E%8C%E4%B8%8A%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%97%A5%E5%B8%B8%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

 var userurl = ""//打开浇水/施肥/许愿/兑换果实等任意一个页面，观察网页链接的最后端formhash=之后的字符，填入即可

(function () {
    // 日期格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
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


    // 掌上百科
    if (matchURL("www.pdawiki.com")) {
        if ($('form[action^="member.php?mod=logging&action=login"]').length > 0) {
            console.log('未登录');
            return;
        }
        // 获取上次签到日期
        var pdawikiLastSignDate = getData('imotor');
        if (!pdawikiLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), pdawikiLastSignDate)) {
            if (matchURL('dsu_paulsign:sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true);
                    $("#todaysay").val('每天签到水一发。。。');
                    $('#qiandao').submit();
                }
                if (window.find("您今天已经签到过了")) {
                    setData('imotor', new Date().format("yyyy-MM-dd"));
                }
            } else if (window.find('每日签到')) {
                window.location.href = "plugin.php?id=dsu_paulsign:sign";
            } else if (window.find("摇钱树")){
            setTimeout(() => window.location.href = "plugin.php?id=are_yqs_money:spend&typeid=2&formhash="+userurl, 1000)//施肥
            setTimeout(() => window.location.href = "plugin.php?id=are_yqs_money:spend&typeid=3&formhash="+userurl,2000)//许愿
            setTimeout(() => window.location.href = "plugin.php?id=are_yqs_money:time_slot&typeid=1&formhash="+userurl,3000)//12点之前的签到
            setTimeout(() => window.location.href ="plugin.php?id=are_yqs_money:getaward&typeid=1&formhash="+userurl,4000)//兑换积分
            }
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
  