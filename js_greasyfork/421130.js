// ==UserScript==
// @name         ipass日志优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ipass日志优化,折叠左边栏+去除日志多余信息
// @author       Andy:597966823
// @match        https://ipaas-e.ynzy-tobacco.com:5601/app/discover
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/421130/ipass%E6%97%A5%E5%BF%97%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421130/ipass%E6%97%A5%E5%BF%97%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...

    //TEST
    GM_setValue("FLAG",true);
    GM_registerMenuCommand('菜单一', () => {
        alert(GM_getValue("FLAG"));
        GM_setValue("FLAG",!GM_getValue("FLAG"));
    });

    //页面初次加载时，延迟3秒执行
    setTimeout(function(){
        //折叠左边栏定时器
        var foldInterval = window.setInterval(function(){
            var foldBtn = document.getElementsByClassName("euiButtonIcon euiButtonIcon--primary dscCollapsibleSidebar__collapseButton");
            console.log("foldInterval:"+foldInterval);
            if(foldBtn.length > 0){
                foldBtn?.[0]?.click();
                window.clearInterval(foldInterval);
                console.log("清除定时器："+foldInterval);
            };
        }, 500);
        //清除日志多余信息定时器
        var reloadInterval = window.setInterval(EliminateUnwantedInformation, 500);
        console.log("reloadInterval:"+reloadInterval);
    },3000);

    //注册快捷键Ctrl+S清除日志多余信息
    document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if(ctrlKey && keyCode == 83) {
            EliminateUnwantedInformation();
            //屏蔽原生事件
            e.preventDefault();
            return false;
        };
    };

    function EliminateUnwantedInformation(){
        console.log("去除日志多余的信息");
        var tar = document.getElementsByClassName("truncate-by-height");
        tar.forEach(r=>{
            r.innerHTML = r.innerHTML.replaceAll("{org.apache.synapse.mediators.bsf.CommonScriptMessageContext} - ","");
            r.innerHTML = r.innerHTML.replaceAll("{com.power.carbon.core.services.util.CarbonAuthenticationUtil} - ","");
            r.innerHTML = r.innerHTML.replaceAll("{com.power.carbon.mediation.dependency.mgt.DependencyTracker} - ","");
            r.innerHTML = r.innerHTML.replaceAll("{org.apache.synapse.mediators.bsf.NashornJavaScriptMessageContext} - ","");
        });
    };
})();