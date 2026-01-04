// ==UserScript==
// @name         天猫U选自动刷新工具
// @namespace    http://www.abmbio.xin/
// @version      0.1
// @description  天猫U选自动刷新工具，自动提醒，By www.abibio.xin
// @author       Tony
// @match        https://pages.tmall.com/wow/heihe/act/viewfirst?*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/380343/%E5%A4%A9%E7%8C%ABU%E9%80%89%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/380343/%E5%A4%A9%E7%8C%ABU%E9%80%89%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.src = "https://www.abmbio.xin/default/js/jQuery-2.2.0.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?7f9964d6e2815216bcb376aa3325f971";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    setTimeout(function(){
        var dotimer = setInterval(function(){
            if(document.readyState == 'complete'){
                console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
                console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");
                var tonydiv=document.createElement("div");
                tonydiv.innerHTML = '<audio autoplay="autoplay" id="tonyauto" loop></audio>';
                document.body.append(tonydiv);
                dothat();
                clearInterval(dotimer);
            }else{
                console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
            }
        },5000);

    },1000);
    function dothat(){
        if($('.btn-text.cancel').css("display")=="block"){
            location.reload();

        }else if($('.btn-text.done').css("display")=="block"){
            console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","抢光了，停止程序");
            clearInterval(dotimer);
        }else if($('.btn-text.normal').css("display")=='block'){
            console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","搞到了，搞到了。。。");
            document.getElementById('tonyauto').src = "http://data.huiyi8.com/2017/gha/03/17/1702.mp3";

        }else{
            location.reload();
        }
    }
})();