// ==UserScript==
// @name         SQXYXYW
// @namespace    https://github.com/DYS0327
// @version      1.1
// @description  每隔一段时间自动访问页面，可自定义刷新间隔时间，适合挂机、PT 等需要保持心跳的网页
// @author       梦痕
// @match        http://*:8060/wifidog/auth?token=*&info=%20HTTP/1.1
// @match        http://*/wifidog/auth?token=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412787/SQXYXYW.user.js
// @updateURL https://update.greasyfork.org/scripts/412787/SQXYXYW.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var title,request_url, time=120;

    config(ready);

    // 配置
    function config(callback) {
        var url = document.location.toString();
        var arrObj = url.split("?");

        if (arrObj.length > 1) {
            ip=arrObj[0];
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");
                if (arr != null && arr[0] == token) {
                    request_url=arrObj[0]+'?token='+arr[1]+'&info=%20HTTP/1.1'
                    console.log('url获取成功' )
                }
            }
        }
        callback();
    }

    // Ready
    function ready() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            Get(request_url);
            return;
        }
        time--;
        setTimeout(loop, 1000);
    }

    //GET请求
    function Get(url){
        console.log('准备发送get请求' )
        var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        httpRequest.open('GET', url, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                console.log('get请求发送成功' )
                return;
            }
        };
    }

    // 格式化时间
    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

    // 补零
    function pad(n) {
        return ("00" + n).slice(-2);
    }

})();