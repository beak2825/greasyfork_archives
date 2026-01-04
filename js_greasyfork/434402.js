        // ==UserScript==
        // @name         422-问卷网
        // @namespace    http://tampermonkey.net/
        // @version      0.6
        // @description  422专用
        // @author       K
        // @match        https://www.wenjuan.com/s/*
        // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
        // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
        // @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
        // @grant        GM_xmlhttpRequest
        // @connect      *
// @downloadURL https://update.greasyfork.org/scripts/434402/422-%E9%97%AE%E5%8D%B7%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434402/422-%E9%97%AE%E5%8D%B7%E7%BD%91.meta.js
        // ==/UserScript==

        // 信息配置
        var myName = "曾候凯"
        var myClass = "19计科05"
        var myNum = "201906150067"
        var myPhone = "13172866288"
        var flag = false; //是否自动提交报名，是 true，否 false

        //核心程序
        var listener;
        var sname;
        var sclass;
        var snumber;

        function input() {
            // console.log($("textarea"))
            sname = $("textarea")[0];
            snumber = $("textarea")[1];
            sclass = $("textarea")[2];
            sphone = $("textarea")[3];
            var event = document.createEvent('HTMLEvents');
            event.initEvent('input', true, false);
            sname.prepend(myName);
            sname.dispatchEvent(event);
            snumber.prepend(myNum);
            snumber.dispatchEvent(event);
            sclass.prepend(myClass);
            sclass.dispatchEvent(event);
            sphone.prepend(myPhone);
            sphone.dispatchEvent(event);
            console.log($("textarea")[0].value);
            console.log($("textarea")[1].value);
            console.log($("textarea")[2].value);
            console.log($("textarea")[3].value);
        }

        function submit() {
            console.log($("#next_button"));
            $("#next_button").click();

        }

        function listen() {
            var result = $("div");
            console.log("监听中 ");
            if (result.length != 0) {
                console.log(result);
                clearInterval(listener);
                alert("恭喜您，成功抢到活动");
            }
        }


        (function () {
            'use strict';
            setTimeout(
                function () {
                    input();
                    if (flag) {
                        submit();
                    }
                }, 1000)

        })();