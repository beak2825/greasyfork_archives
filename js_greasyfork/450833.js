// ==UserScript==
// @name         Zbpm扩展
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  zielsmart中文登录扩展
// @author       wsj
// @license      MIT
// @match        https://pm.zielsmart.com/*
// @match        https://zbpm.zielsmart.cn/login
// @match        https://zbpm.zielsmart.com/login
// @match        https://uums.zielsmart.cn/login
// @match        https://uums.zielsmart.com/login
// @match        https://oms-b2c.zielsmart.cn/login
// @match        https://oms-b2c.zielsmart.com/login
// @match        https://mc.zielsmart.cn/login
// @match        https://mc.zielsmart.com/login
// @match        https://oms.zielsmart.cn/login
// @match        https://oms.zielsmart.com/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zielsmart.com
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/450833/Zbpm%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/450833/Zbpm%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        GM_log('加载扩展');
        var curUrl = document.location.href;
        if(curUrl.indexOf('pm.zielsmart.com')!=-1){
            GM_log('开始替换图标');
            var lk = document.querySelector('link[rel="shortcut icon"]');
            lk.href='https://www.zentao.net/favicon.ico';
            GM_log('图标替换成功');
        }else if(curUrl.indexOf('login')!=-1){
            var name = document.querySelector('#userName');
            var logo = document.querySelector('.zl-logo');
            var ziel = GM_getValue('ziel',null);
            if(ziel == null){
                GM_xmlhttpRequest({
                    url:"https://git.ziel.cn/600874406/wsj/-/raw/master/ziel.json",
                    method:"GET",
                    headers: {
                        "content-type": "application/json"
                    },
                    onerror:function(res){
                        GM_log(res);
                    },
                    onload:function(res){
                        GM_log('用户数据加载成功')
                        var obj = JSON.parse(res.response);
                        ziel = obj;
                        GM_setValue("ziel",obj);
                    }
                });
            }
            name.addEventListener('blur',function(e){
                GM_log('监听焦点');
                var number = ziel[name.value];
                if(number!=null){
                    GM_log('设置工号');
                    GM_log(number);
                    var setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                    name.focus();
                    setValue.call(name, number);
                    var event = new Event('input', { bubbles: true });
                    name.dispatchEvent(event);
                }
            },false);
            logo.addEventListener('click',function(e){
                GM_log('清除缓存');
               GM_setValue("ziel",null);
            });
        }
    },1000);
}
)();
