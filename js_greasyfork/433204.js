// ==UserScript==
// @name         填报体温自用wn
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  自动填报体温
// @author       nkyuiu
// @license      nkyuiu
// @match        *://tyutgs.wjx.cn/*
// @match        tyutgs.wjx.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433204/%E5%A1%AB%E6%8A%A5%E4%BD%93%E6%B8%A9%E8%87%AA%E7%94%A8wn.user.js
// @updateURL https://update.greasyfork.org/scripts/433204/%E5%A1%AB%E6%8A%A5%E4%BD%93%E6%B8%A9%E8%87%AA%E7%94%A8wn.meta.js
// ==/UserScript==
// 网页链接
// @问卷地址     https://tyutgs.wjx.cn/user/qlist.aspx?u=%e6%89%8b%e6%9c%ba%e7%94%a8%e6%88%b7tivliw38j0y8djcff6vstq&userSystem=1&systemId=55677040
// @登录地址     https://tyutgs.wjx.cn/user/loginForm.aspx
// @问卷列表待参与     https://tyutgs.wjx.cn/user/qlist.aspx

(function() {
    'use strict';

    var account = "2019520397";//账号
    var password = "193638";//密码
    var flag = 0;// 在校填0，不在校填1


    var dicAnswer = {
        "div4" : "山西省晋中市榆次区乌金山镇太原理工大学信息与计算机学院太原理工大学明向校区[112.724485,37.748797]",
        "div6" : "明向校区住宿",
        "div8" : "<37℃",
        "div9" : "正常",
        "div10" : "无上述情况",
        "div12" : "无上述情况",
        "div14" : "无上述情况",
        "div16" : "本人承诺以上所填信息均属实，无瞒报，无漏报！",
    }

    var qTitle = ["全体研究生健康状况报告[上午]","全体研究生健康状况报告[下午]"];

    var strHref = "https://tyutgs.wjx.cn/user/qlist.aspx?u=%e6%89%8b%e6%9c%ba%e7%94%a8%e6%88%b7tivliw38j0y8djcff6vstq&userSystem=1&systemId=55677040";
    var strLogin = "tyutgs.wjx.cn/user/loginForm.aspx";
    var strComplete = "tyutgs.wjx.cn/wjx/join/complete.aspx";
    var strList = "tyutgs.wjx.cn/user/qlist.aspx";
    var strWfjrvj = "tyutgs.wjx.cn/vj/";
    var strWfjrjq = "tyutgs.wjx.cn/jq/";

    doit();
    //window.setInterval(doit, 3000);

    // 页面匹配，执行相应操作
    function doit(){

        // 登录界面操作
        if(IsTarget(strLogin)){
            var bt = document.querySelector("#btnSubmit");
            if (bt.innerText !="登录") {
                window.location.href = strHref;
                return;
            }
            if (account != "" && password !="") {
                document.querySelector("#register-user-name").value = account;
                document.querySelector("#register-user-password").value = password;
                bt.click();
            }
        }

        // QList界面操作
        if (IsTarget(strList)) {
            if(document.querySelector("#ulQs")!=null){
                var wjlist = document.querySelector("#ulQs").children;
                var time = new Date().getHours();
                alert(wjlist.length);
                for (var i = wjlist.length - 1; i >= 0; i--) {
                    let tempStr = wjlist[i].innerText;
                    if (time >= 13 && qTitle.includes(tempStr)) {
                        wjlist[i].querySelector("a").click();
                        return;
                    }
                    if (time < 13 && qTitle[0]==tempStr) {
                        wjlist[i].querySelector("a").click();
                        return;
                    }
                }}
            alert("体温填报完成！！！");
            setTimeout(function(){window.open("https://pc.xuexi.cn/points/my-points.html","_self")}, 4 * 1000);
            clearCookie();
        }

        // 答题函数
        function AnswerQuestion(q) {
            console.log(q.getAttribute("id")+"----"+ q.getAttribute("style")+"----"+q.querySelector('.div_title_question').innerText);
            var key = q.getAttribute("id");

            if (q.querySelector('.jqRadio')||q.querySelector('.jqCheckbox')) {
                //console.log(q.querySelector('.div_title_question').innerText);
                var li_lists = q.querySelectorAll("li");
                for (var i = li_lists.length - 1; i >= 0; i--) {
                    var ops = li_lists[i];
                    if (ops.innerText==dicAnswer[key]) {
                        ops.click();
                    }
                }
            }
            else{
                q.querySelector(key.replace(/div/,"#q")).innerText = dicAnswer[key];
            }
        }



        // 问卷界面操作
        if (IsTarget(strWfjrvj) || IsTarget(strWfjrjq)){
            // 获取问题列表
            document.querySelector("#divquestion1 > ul").children[flag].click(); // 选择是否在校
            var qList = document.querySelectorAll('.div_question');
            for (i = qList.length - 1; i >= 0; i--) {
                var tem = qList[i].getAttribute("style");
                if (tem==null || !tem) {
                    AnswerQuestion(qList[i]);
                }
            }

            //return ;

            // 滑动到底部
            scrollToBottom();

            //setTimeout(function(){document.querySelector('#submit_button').onclick();},getRdm(3,5) * 1000);
            let count = 0;
            //提交函数
            setTimeout( function(){
                document.querySelector("#submit_button").click();
                setTimeout( function(){
                    document.querySelector("#SM_BTN_1").click();
                    setInterval( function(){
                        try{
                            yanzhen();
                            count+=1;
                        }
                        catch(err){
                            //点击刷新验证框
                            document.querySelector("#nc_1_refresh1").click();
                            if(count>=6){
                                return;
                                //window.location.href = strHref;
                            }
                        }
                    }, 1*1000);
                }, 1 * 1000 );
            }, getRdm(3,5) * 1000);
        }

        // 提交成功页面
        if (IsTarget(strComplete)) {
            // 返回登录界面
            setTimeout(function(){window.location.href = strHref},getRdm(3,5) * 1000);
        }
    }

    // 判断herf是否包含str
    function IsTarget(str){
        return window.location.href.indexOf(str) != -1
    }

    // 获取两个数之间的随机整数
    function getRdm(start, end) {
        return Math.floor(Math.random() * (end - start) + start)
    }

    // 清除 cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
            }
        }
    }

    // 滑动验证函数
    function yanzhen(){
        var event = document.createEvent('MouseEvents');
        event.initEvent('mousedown', true, false);
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
        event = document.createEvent('MouseEvents');
        event.initEvent('mousemove', true, false);
        Object.defineProperty(event,'clientX',{get(){return 260;}})
        document.querySelector("#nc_1_n1z").dispatchEvent(event);
    }

    // 滚动到末尾函数
    function scrollToBottom(){
        (function () {
            var y = document.body.scrollTop;
            var step = 500;
            window.scroll(0, y);
            function f() {
                if (y < document.body.scrollHeight) {
                    y += step;
                    window.scroll(0, y);
                    setTimeout(f, 50);
                }
                else {
                    window.scroll(0, y);
                    document.title += "scroll-done";
                }
            }
            setTimeout(f, 1000);
        })();
    }



})();