// ==UserScript==
// @name         每日自动签到
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  每日自动签到.
// @author       HCLonely
// @match        https://www.52pojie.cn/
// @include      https://www.52pojie.cn/home.php?mod=task&do=draw&id=2
// @include      *://steamcn.com/f232-1
// @include      https://greasyfork.org/*
// @include      *://link.acg.tv/*.php*
// @include      *://music.163.com*
// @include      /https?:\/\/(www.)?chrono.gg/
// @include      /https?:\/\/store\.steampowered\.com\/(\/)?login[\w\W]{0,}/
// @include      *://steamcommunity.com/openid/login*
// @match        *://*.com/index.php
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @require      https://greasyfork.org/scripts/379868-jquery-not/code/jQuery%20not%20$.js?version=681281
// @downloadURL https://update.greasyfork.org/scripts/36758/%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/36758/%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
        var url = window.location.href;


        /*---------------------自动跳转到登录页面----------------------------*/
        if (/https?:\/\/giveaway\.su\/[\w\W]{0,}/.test(url)){                                    //giveaway.su
            var loginLink_1=document.getElementsByTagName("a");
            for(var d=0;d<loginLink_1.length;d++){
                var loginLink_2=loginLink_1[d].href;
                if (/^(https?)?:\/\/giveaway\.su\/steam\/redirect/i.test(loginLink_2)){
                    window.open(loginLink_2,"_self");
                }
            }
        }
        if (/https?:\/\/[\w\W]{0,}\.com\/index\.php([\w\W]{0,})?/.test(url)){                  //*.com/index.php
            var loginLink=document.getElementsByTagName("a");
            for(var i=0;i<loginLink.length;i++){
                var loginLink1=loginLink[i].href;
                if (/^(https?)?:\/\/[\w]{0,}\.com\/index\.php\?login/i.test(loginLink1)){
                    window.open(loginLink1,"_self");
                }
            }
        }

        /*---------------------自动登录/连接steam----------------------------*/
        if (/^https?:\/\/steamcommunity\.com\/openid\/login[\w\W]{0,}/.test(url)){
            var loggedName=document.getElementsByClassName("OpenID_loggedInName");
            if  (loggedName.length != 0){
                for(var j=0;j<loggedName.length;j++){
                    var loggedName1=loggedName[j].innerHTML;
                    if (/[\w\W]/.test(loggedName1)){
                        var obtn=document.getElementById('imageLogin');
                        obtn.onclick = function(){
                        };
                        obtn.click();
                        break;
                    }
                }
            }
        }


        //***************steam自动登录**********************//
        if (/https?:\/\/store\.steampowered\.com\/(\/)?login[\w\W]{0,}/.test(url)){
            document.getElementById("input_username").value="1606051253";
            document.getElementById("input_password").value="hCl19980201##@**";
            var chk = document.getElementById('remember_login');//通过getElementById获取节点
            chk.checked = true;//设置checked为选中状态
            var oBtn=document.getElementById("login_btn_signin");
            var oBtn1=document.getElementsByClassName("btnv6_blue_hoverfade  btn_medium");
            oBtn1[0].onclick = function(){
            };
            oBtn1[0].click();
        }else if(/https?:\/\/steamcommunity.com\/openid\/login.*/.test(url)){
            document.getElementById("steamAccountName").value="1606051253";
            document.getElementById("steamPassword").value="hCl19980201##@**";
            //var chk = document.getElementById('remember_login');//通过getElementById获取节点
            //chk.checked = true;//设置checked为选中状态
            var oBtn2=document.getElementById("imageLogin");
            //var oBtn1=document.getElementsByClassName("btnv6_blue_hoverfade  btn_medium");
            oBtn2.onclick = function(){
            };
            oBtn2.click();
        }


        //***************网易云音乐自动签到**********************//
        if(/music.163.com\/discover/.test(url)){
            function sign163(signBtn){
                signBtn[0].click();
                setInterval(function(){
                    if(!signBtn.hasClass("u-btn2-dis")){
                        sign163();
                    }
                },3000);
            }
            let signCheck=setInterval(function(){
                let signBtn=$jq('a[data-action="checkin"]');
                if(!empty(signBtn)&&!signBtn.hasClass("u-btn2-dis")){
                    sign163(signBtn);
                    clearInterval(signCheck);
                }else{
                    clearInterval(signCheck);
                }
            },3000);
        }
    if(/https?:\/\/music.163.com\/?$/.test(url)){
        setInterval(()=>{
            if($jq('#g_iframe')&&($jq('#g_iframe').contents().find('a[data-action="checkin"]'))){
                $jq('#g_iframe').contents().find('a[data-action="checkin"]').text()=='已签到'&&(window.close());
            }
        },1000);
    }

        //***************吾爱破解自动登录**********************//
        if (/^https?:\/\/www\.52pojie\.cn\/[\w\W]{0,}/.test(url)){
            (function() {
                var userName=document.getElementsByClassName("vwmy qq");
                if (userName[0]=== undefined){
                    document.getElementById("ls_username").value="HCLonely";
                    document.getElementById("ls_password").value="hCl19980201##@**";
                    document.getElementById("ls_cookietime").checked = true;
                    var pojieLogin=document.getElementsByClassName("pn vm");
                    pojieLogin[0].onclick=function(){
                    };
                    pojieLogin[0].click();
                }else{
                    console.log("已登录");
                }
            })();

            //***************吾爱破解自动签到**********************//
            if (/^https?:\/\/www\.52pojie\.cn\//.test(url)){
                (function() {
                    var list1=document.getElementsByClassName("qq_bind");
                    for(var i=0;i<list1.length;i++){
                        var png=list1[i].src;
                        if (/^https?:\/\/www\.52pojie\.cn\/static\/image\/common\/qds\.png/.test(png)){//检测是否已签到
                            window.open("https://www.52pojie.cn/home.php?mod=task&do=apply&id=2","_self");//执行签到
                        }
                        if (/^https?:\/\/www\.52pojie\.cn\/static\/image\/common\/wbs\.png/.test(png)){
                            console.log("已签到");
                        }
                    }
                })();
            }
            if (/^https?:\/\/www\.52pojie\.cn\/home\.php\?mod\=task\&do\=draw\&id\=2/.test(url)){//签到完成自动关闭
                window.close();
            }
        }
        //***************Greasy Fork自动登录**********************//
        if (/https?:\/\/greasyfork\.org\/[\w\W]{0,}/.test(url)){
            (function() {
                if (/https?:\/\/greasyfork\.org\/[\w]{1,}\-[\w]{1,}\/users\/sign_in[\w\W]{0,}/i.test(url)){
                    document.getElementById("user_email").value="h1606051253@gmail.com";
                    document.getElementById("user_password").value="19980201x";
                    document.getElementById("user_remember_me").checked = true;
                    var forkLogin=document.getElementsByTagName("input");
                    for (var i=0;i<forkLogin.length;i++){
                        var forkLogin1=forkLogin[i].value;
                        if (/登录/.test(forkLogin[i].value)){
                            forkLogin[i].onclick=function(){
                            };
                            forkLogin[i].click();
                            break;
                        }
                    }
                }else{
                    var forkUser=document.getElementsByClassName("sign-in-link");
                    var forkUser1=forkUser[0].getElementsByTagName("a");
                    if (/登录/.test(forkUser1[0].innerHTML)){
                        window.open(forkUser1[0].href,"_self");
                    }else{
                        return false;
                    }
                }
            })();
        }
        //***************bilibili论坛登录**********************//
        if (/https?:\/\/link\.acg\.tv\/(forum)|(home)\.php[\w\W]{0,}/.test(url)){
            (function() {
                var biliLuntan=document.getElementsByClassName("vwmy");
                var biliLuntan1=biliLuntan[0].getElementsByTagName("a");
                if(!/HCLonely/.test(biliLuntan1[0].innerHTML)){
                    window.open("http://link.acg.tv/bilibili_connect.php?mod=auth&op=login","_self");
                }
            })();
        }

        /***************************chrono.gg领金币****************************/
        if (/chrono.gg/.test(url)){
            let chrono=setInterval(()=>{
                let coin=document.getElementById("reward-coin");
                if(!empty(coin)&&!/dead/gim.test(coin.className)){
                    coin.click();
                    clearInterval(chrono);
                }
            },1000);
        }


})();