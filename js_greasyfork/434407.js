    // ==UserScript==
    // @name         422-麦客网
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @description  422专用
    // @author       K
    // @match        http://*.mikecrm.com/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
    // @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
    // @grant        GM_xmlhttpRequest
    // @connect      *
// @downloadURL https://update.greasyfork.org/scripts/434407/422-%E9%BA%A6%E5%AE%A2%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434407/422-%E9%BA%A6%E5%AE%A2%E7%BD%91.meta.js
    // ==/UserScript==

    //学生信息配置文件
    var myName = "曾候凯"
    var myClass = "19计科05"
    var myNum = "201906150067"

    //核心程序，请勿修改。
    var listener;
    var sname;
    var sclass;
    var snumber;

    function input() {
        sname = $("input")[0];
        sclass = $("input")[1];
        snumber = $("input")[2];
        var event = document.createEvent('HTMLEvents');
        event.initEvent('input', true, false);
        sname.setAttribute('value', myName);
        sname.dispatchEvent(event);
        sclass.setAttribute('value', myClass);
        sclass.dispatchEvent(event);
        snumber.setAttribute('value', myNum);
        snumber.dispatchEvent(event);
        console.log($("input")[0].value);
        console.log($("input")[1].value);
        console.log($("input")[2].value);
    }

    function submit() {
        console.log($("a:contains('提交')")[0]);
        $("a:contains('提交')")[0].click();

    }

    function listen() {
        input();
        submit();
        var result = $("div.fb_ssTitle:contains('提交成功')");
        console.log("监听中");
        if (result.length != 0) {
            console.log(result);
            clearInterval(listener);
            alert("恭喜您，成功抢到活动");
        }
    }

    (function () {
        'use strict';
        listener = setInterval(listen, 1000);
    })();