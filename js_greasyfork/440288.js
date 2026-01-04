// ==UserScript==
// @name         淘宝X5滑块自动复制
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  淘宝滑块手动后自动复制X5sec值
// @author       You
// @match        *://*.taobao.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/440288/%E6%B7%98%E5%AE%9DX5%E6%BB%91%E5%9D%97%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440288/%E6%B7%98%E5%AE%9DX5%E6%BB%91%E5%9D%97%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cookie_cache=document.cookie;
    Object.defineProperty(document, 'cookie', {
        get: function() {

            if(document!=undefined && document.querySelector!=undefined){
                if(document.querySelector("#nc_1_n1z")!=undefined && document.querySelector("#nc_1_n1z").style.left!='0px'){
                    cookie_cache = cookie_cache.replace(/x5sec=([^;]+;?)/,'');
                }
            }

            return cookie_cache;
        },
        set: function(value) {
            console.log(value);
            if(document.querySelector('.warnning-text')!= undefined){
                var warningText = document.querySelector('.warnning-text').innerText;
                if(warningText.indexOf('休息会')>-1||warningText.indexOf('请拖动下方滑块完成验证')>-1 ){

                    if(
                        (location.href.indexOf('_____tmd_____') >-1 && location.href.indexOf('x5secdata') >-1) ||
                        (window._config_ != undefined && window._config_['action'] == 'captcha')
                    ){
                        if(value.indexOf("x5sec")>-1){
                            ClipboardJS.copy(value);
                            prompt("请复制内容到软件",value);
                        }
                    }
                }
            }
            return value;
        },
    });

})();