// ==UserScript==
// @name         第一版主PC访问
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  去除广告以及解除PC访问限制
// @author       啦A多梦
// @license      MIT
// @match        https://www.banzhu66666.net/*
// @match        https://www.66yydstxt426.com/*
// @match        https://www.5yydstxt426.com/*
// @match        https://www.6yydstxt234.com/*
// @match        https://www.4yydstxt426.com/*
// @match        https://www.3yydstxt426.com/*
// @match        https://www.1yydstxt426.com/*
// @match        https://www.88yydstxt426.com/*
// @match        https://www.77yydstxt426.com/*
// @match        https://www.55yydstxt426.com/*
// @match        https://www.44yydstxt426.com/*
// @match        https://www.33yydstxt426.com/*
// @match        https://www.33yydstxt226.com/*
// @match        https://www.33yydstxt434.com/*
// @match        https://www.44yydstxt234.com/*
// @webRequest   [{"selector": "*://www.*.com/js/pc.js", "action": "cancel"}, {"selector": "*://www.*.com/js/cdn.js", "action": "cancel"}, {"selector": "*://www.*.com/js/htmlka.js", "action": "cancel"}, {"selector": "*://www.*.com/js/htmlkb.js", "action": "cancel"}, {"selector": "*://www.*.com/js/htmlkc.js", "action": "cancel"}, {"selector": "*://www.*.net/js/cdn.js", "action": "cancel"}, {"selector": "*://www.*.net/js/htmlka.js", "action": "cancel"}, {"selector": "*://www.*.net/js/htmlkb.js", "action": "cancel"}, {"selector": "*://www.*.net/js/htmlkc.js", "action": "cancel"}, {"selector": "*://www.*.net/js/htmlkcc.js", "action": "cancel"}, {"selector": "*://www.*.net/js/mobile.js", "action": "cancel"}, {"selector": "*://www.*.net/js/zepto.min.js", "action": "cancel"}]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cupfox.app
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508385/%E7%AC%AC%E4%B8%80%E7%89%88%E4%B8%BBPC%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/508385/%E7%AC%AC%E4%B8%80%E7%89%88%E4%B8%BBPC%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(navigator, 'userAgent', {
        get: function(val) {
            return "iphone";
        }
    });

    Object.defineProperty(navigator, 'platform', {
        get: function(val) {
            return "Linux";
        }
   });

    //键盘翻页功能
    document.addEventListener('keydown', (e)=>{
		// if(e.keyCode == 39){
        if(e.key == 'ArrowRight'){
            if(document.querySelector(".curr").nextSibling != null){
                document.querySelector(".curr").nextSibling.click();
            }else{
                document.querySelector(".next").click();
            }
		}

        // if(e.keyCode == 37){
        if(e.key == 'ArrowLeft'){
            if(document.querySelector(".curr").previousSibling != null){
                document.querySelector(".curr").previousSibling.click();
            }else{
                document.querySelector(".prev").click();
            }
        }
    }, true);



    //防屏蔽罩
    window.onload = function () {
        if(document.querySelector(".title") != null && document.querySelector(".title").textContent.indexOf("1234") != -1){
            $.post('',{'action':'1','v':'1234'},function(e){
                e = $.trim(e);
                if(e == "success"){
                    window.location.reload();
                }
            })
        }
        try {
            if (0 < document.querySelector("div").style.background.indexOf("area51")) {
                document.querySelector("div").style.display = 'none';
            }
            //独立窗口打开
            if (window.location.pathname == '/s.php') {
                for (var i = 0; i < document.querySelectorAll(".right").length; i++){
                    document.querySelectorAll(".right")[i].children[0].target = "_blank";
                    document.querySelectorAll(".right")[i].children[2].children[0].target = "_blank"
                }
            }
        }catch(err){}
    }
})();