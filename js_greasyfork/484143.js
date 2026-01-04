// ==UserScript==
// @name         LANZOU Auto Download Fix
// @name:zh-CN   蓝奏云自动下载 (修复版)
// @name:zh-TW   藍奏雲自動下載 (修復版)
// @namespace    lanzouyun_auto_download_fix
// @version      1.2
// @description  蓝奏云跳过手动验证并自动下载, 可配置自动关闭页面
// @description:zh-CN  蓝奏云跳过手动验证并自动下载, 可配置自动关闭页面
// @description:zh-TW  藍奏雲跳過手動驗證並自動下載, 可配置自動關閉頁面
// @author       狐狸小宮
// @match        *.baidupan.com/file/*
// @match        *.lanzoua.com/*
// @match        *.lanzoub.com/*
// @match        *.lanzouc.com/*
// @match        *.lanzoud.com/*
// @match        *.lanzoue.com/*
// @match        *.lanzouf.com/*
// @match        *.lanzoug.com/*
// @match        *.lanzouh.com/*
// @match        *.lanzoui.com/*
// @match        *.lanzouj.com/*
// @match        *.lanzouk.com/*
// @match        *.lanzoul.com/*
// @match        *.lanzoum.com/*
// @match        *.lanzoun.com/*
// @match        *.lanzouo.com/*
// @match        *.lanzoup.com/*
// @match        *.lanzouq.com/*
// @match        *.lanzour.com/*
// @match        *.lanzous.com/*
// @match        *.lanzout.com/*
// @match        *.lanzouu.com/*
// @match        *.lanzouv.com/*
// @match        *.lanzouw.com/*
// @match        *.lanzoux.com/*
// @match        *.lanzouy.com/*
// @match        *.lanzouz.com/*
// @match        *.lanosso.com/*
// @match        *.lanzn.com/*
// @match        *.lanzog.com/*
// @match        *.lanpw.com/*
// @match        *.lanpv.com/*
// @match        *.lanzv.com/*
// @match        *.lanrar.com/file/*
// @grant    GM_getValue
// @grant    GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/484143/LANZOU%20Auto%20Download%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/484143/LANZOU%20Auto%20Download%20Fix.meta.js
// ==/UserScript==

(
    function() {
        var defaultClose = false;
        var defaultTimeout = 1;
        var closeInterval,closeTimeout;
        'use strict';

        document.getElementById("load2").style.display="none";
        //添加倒计时显示
        var count = 2;
        var countDown = setInterval(function(){
            document.getElementById("sub").firstElementChild.innerHTML = "验证并下载 ("+ count.toFixed(1) +"s)";
            count=count-0.1;
        }, 100);
        //倒计时两秒后自动点击验证，自动点击下载
        setTimeout(function(){
            clearInterval(countDown);
            down_r(2);
            setTimeout(function(){
                window.location.href = document.getElementById("go").firstElementChild.href;
                //设置自动关闭下载页面
                closePage();
            }, 500);
        }, 2000);

        //页面关闭倒计时
        var closePage = function(){
            if(GM_getValue('doClose', defaultClose)){
                let count = GM_getValue('doCloseTimeout', defaultTimeout) * 1;
                closeInterval = setInterval(function(){
                    document.getElementById("countdown").innerHTML = "("+ count.toFixed(1) +"s)";
                    count=count-0.1;
                }, 100);
                closeTimeout = setTimeout(function(){
                    window.close();
                }, GM_getValue('doCloseTimeout', defaultTimeout) * 1000);
            }
        }

        //配置是否关闭页面
        var autoClosed = function(){
            if(GM_getValue('doClose', defaultClose) === false){
                GM_setValue('doClose', true);
            } else{
                document.getElementById("countdown").innerHTML = "";
                clearInterval(closeInterval)
                clearTimeout(closeTimeout)
                GM_setValue('doClose', false);
            }
        }
        //配置关闭页面时间
        var closeTimeoutChange = function(){
            if(!document.getElementById("closeTimeout").value || document.getElementById("closeTimeout").value < 1){
                document.getElementById("closeTimeout").value = 1;
            }
            GM_setValue('doCloseTimeout', document.getElementById("closeTimeout").value);
        }

        //添加是否关闭页面设置以及倒计时设置
        var gmSetting = document.createElement('div');
        gmSetting.style.position = 'fixed';
        gmSetting.style.top = '5%';
        gmSetting.style.right = '5%';
        gmSetting.innerHTML = '<input id="gmSetting" type="checkbox" name="gm" '+ (GM_getValue('doClose', defaultClose) ? 'checked' : '') +'/> 启动下载<input style="border:none;border-bottom:1px solid;width:50px;text-align:center" id="closeTimeout"/>秒后自动关闭页面<span id="countdown"></span>'
        document.getElementsByTagName("body")[0].append(gmSetting)
        document.getElementById("gmSetting").onclick = autoClosed;
        document.getElementById("closeTimeout").value = GM_getValue('doCloseTimeout', defaultTimeout);
        document.getElementById("closeTimeout").onchange = closeTimeoutChange;
        document.getElementById("go").onclick = closePage;
    }
)();自动关闭页面