// ==UserScript==
// @name         下单鞋子
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match       https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430531/%E4%B8%8B%E5%8D%95%E9%9E%8B%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/430531/%E4%B8%8B%E5%8D%95%E9%9E%8B%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    var setTime = "17:00";
    var tq = 100;

    // 姓名
    var name = "十仔";
    // 手机号
    var phone = "001363";
    // 提货密码
    var password = "123456";

    // 商品订单
    // 定几种尺寸就填写几行
    // [ 尺寸 , 数量 ]
    var list = [
        ["10|44", "2"]
    ];
    //================ 下面的这些不用管  ===================
    var remin = CalcTime(setTime);
    if (remin > 0) {
        console.log((remin / 1000) + "s后刷新网页");
        setTimeout(() => {
            location.reload();
        }, remin);
    } else {
        var obj = $("#divProgress > div.pagepercent")[0];
        if (obj == "undefined") return;

        for (var i = 0; i < 3; i++) {
            setTimeout(Run, 5 * i);
        }
    }

    function CalcTime(t) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var ms = d.getMilliseconds();

        var arr = t.split(":");
        var target_h = parseInt(arr[0])
        var target_m = parseInt(arr[1])
        return (target_h * 60 * 60 + target_m * 60) * 1000 - ((h * 60 * 60 + m * 60 + s) * 1000 + ms)-tq;
    }

    var isEnd = false;

    function Run() {
        if (isEnd) return;
        var page = $("#divProgress > div.pagepercent").text().replace("/3页", "");
        console.log(page);
        switch (page) {
            case "1":
                $("#div1 > div.ui-controlgroup > div:nth-child(1) > div")[0].click();
                $("#divNext > a").click();
                break;
            case "2":
                Page2();
                $("#divNext > a").click();
                break;
            case "3":
                Page3();
                isEnd = true;
                break;
        }
    }


    function Page2() {
        // 计算
        var text = $("#div2 > div.field-label").text();
        var pattern = /：(.+)=/;

        if (pattern.test(text)) {
            var res = eval(RegExp.$1);
            var ls = $("#div2 > div.ui-controlgroup > div  > div");
            for (var i = 0; i < ls.length; i++) {
                if (ls[i].innerText == res) {
                    ls[i].click();
                    break;
                }
            }
        }
    }

    function Page3() {

        $("#div1 > div.ui-controlgroup > div:nth-child(1)").click();
        $("#q3")[0].value = name;
        $("#q4")[0].value = phone;
        $("#q5")[0].value = password;
        for (var i = 0; i < list.length; i++) {
            var temp = list[i];
            Select(temp[0], temp[1]);
        }

        function Select(type, num) {
            var list = $("#div6 > div.shopPart > ul > li.shop-item");
            for (var i = 0; i < list.length; i++) {
                var size = $(list[i]).children(0).children(".item_name")[0].innerText;
                var arr = type.split("|");

                for (var j = 0; j < arr.length; j++) {
                    if (size == arr[j].trim()) {
                        $(list[i]).children(1).children("input")[0].value = num - 1;
                        $(list[i]).children(1).children(".add")[0].click();
                        break;
                    }
                }

            }
            return "没有找到指定尺码";
        }

        $("#ctlNext").click();

        var obj = {};
        obj.num = 0;
        var timer = setInterval(() => {
            var btn = $("#SM_BTN_2 > div.sm-ico")[0];
            if (btn) {
                btn.click();
                clearInterval(timer);
            }
            if (obj.num >= 10) clearInterval(timer);
            obj.num++;
        }, 200);
    }
}());