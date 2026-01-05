// ==UserScript==
// @name         不知道是干嘛的
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://cashier.95516.com/b2c/showCard.action*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28051/%E4%B8%8D%E7%9F%A5%E9%81%93%E6%98%AF%E5%B9%B2%E5%98%9B%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/28051/%E4%B8%8D%E7%9F%A5%E9%81%93%E6%98%AF%E5%B9%B2%E5%98%9B%E7%9A%84.meta.js
// ==/UserScript==

(function fuck() {
    'use strict';
    var duanxin = 666666; //短信验证码
    var jiage = 150.00; //订单原价
    var youhuijiage = jiage - 30;
    var yemianjiage;
    var xuandingyouhui;

    //检测是否符合提交并提交
    function jiance() {
        yemianjiage = $(".order_u_pay span").text();
        xuandingyouhui = $('#discount-chk-u').prop('checked');
        if (youhuijiage == yemianjiage && xuandingyouhui) {
            $("#smsCode").val(duanxin);
            tijiao();
            clearInterval(chongfujiance);
        }
    }
    var chongfujiance = setInterval(jiance, 200);

    //提交
    function tijiao() {
        setTimeout(function() { $("#cardPay").submit(); }, 100);
    }

    //下个整数小时刷新页面
    function zhengdianzhixing(curDate,curDate2) {
        //var date = new Date(); //现在时刻
        var date = curDate;
        console.log(date);
        //var date2 = new Date(); //用户登录时刻的下一个整点，也可以设置成某一个固定时刻
        var date2 = curDate2;
        console.log(date2);
        date2.setHours(date.getHours() + 1); //小时数增加1
        console.log(date2);
        date2.setMinutes(0);
        console.log(date2);
        date2.setSeconds(0);
        console.log(date2);
        var shijiancha=date2-date;
        console.log(shijiancha);
        setTimeout(function() { window.location.reload(); },shijiancha); //用户登录后的下一个整点执行。
    }

    //获取服务器时间
    huoqudangqianshijian();
    function huoqudangqianshijian(option) {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else { // ie
            xhr = new ActiveObject("Microsoft");
        }
        // 通过get的方式请求当前文件
        xhr.open("get", "/b2c/showCard.action");
        xhr.send(null);
        // 监听请求状态变化
        xhr.onreadystatechange = function() {
            var time = null,
                curDate = null,
                curDate2 = null;
            if (xhr.readyState === 2) {
                // 获取响应头里的时间戳
                time = xhr.getResponseHeader("Date");
                console.log(xhr.getAllResponseHeaders());
                curDate = new Date(time);
                curDate2 = new Date(time);
                //alert(curDate);
                zhengdianzhixing(curDate,curDate2);
            }
        };
    }


    // Your code here...
})();
