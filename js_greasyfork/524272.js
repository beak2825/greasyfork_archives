// ==UserScript==
// @name         视频号助手
// @namespace    huxuan
// @version      0.0.5
// @description  导入自营达人数据
// @author       mtty.qiu
// @match        https://r.ruiplus.cn/api/daren*
// @match        https://channels.weixin.qq.com/platform*
// @icon         https://res.wx.qq.com/t/wx_fed/finder/helper/finder-helper-web/res/favicon-v2.ico
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_addStyle
// @grant GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524272/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524272/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var appid="";//达人名称
    let jsa = null;
    let jsb = null;
    // 定义变量来存储 JSON 数据

    // 重写XMLHttpRequest的open方法
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {

        if (url.includes('auth_data')) {
            console.log('POST request URL (XMLHttpRequest):', url);
            this.addEventListener('load', function() {
                if (this.responseType === '' || this.responseType === 'text') {
                    try {
                        jsa = JSON.parse(this.responseText);
                        //console.log('获取到的 JSON 数据:', jsonObject);
                        appid=jsa.data.finderUser.uniqId.toString();
                        //console.log(nickname);
                        setCookie('appid', appid, 1);
                    } catch (e) {
                        console.error('无法解析 JSON 数据:', e);
                    }
                }
            });

        }else if (url.includes('post_list')) {
            console.log('POST request URL (XMLHttpRequest):', url);
            this.addEventListener('load', function() {
                if (this.responseType === '' || this.responseType === 'text') {
                    try {
                        jsb = JSON.parse(this.responseText);
                        edit();
                        //console.log('获取到的 JSON 数据:', jsb);
                    } catch (e) {
                        console.error('无法解析 JSON 数据:', e);
                    }
                }
            });
        }
        //console.log(getCookie('appid'));
        originalOpen.call(this, method, url, ...args);

        //combineData();
    };


    function edit(){
    setTimeout(() => {

        if (appid) appid=getCookie('appid');
        if (appid.length>0){
            GM_xmlhttpRequest({
                method: "post",
                url: "https://r.ruiplus.cn/api/videos/addvideos_ziying",
                headers:  {
                    "Content-Type": "application/json",
                    "token":"DHowHmtkctK5KAmMLcXmPWycq9HKpzW8PVv5MNb5"
                },
                data:JSON.stringify({
                    appid: appid,
                    stat: jsb
                }),
                onload: function(response) {
                    console.log(response.responseText);
                }
            });
    }
    }, 4000)  
    }


    // 设置 cookie 的函数
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // 获取 cookie 的函数
    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }    

})();