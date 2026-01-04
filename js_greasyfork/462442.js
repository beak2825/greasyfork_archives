// ==UserScript==
// @name         B站不登录续播
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  去除B站不登录弹出提示窗以及视频暂停
// @author       啦A多梦
// @match        https://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/462442/B%E7%AB%99%E4%B8%8D%E7%99%BB%E5%BD%95%E7%BB%AD%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/462442/B%E7%AB%99%E4%B8%8D%E7%99%BB%E5%BD%95%E7%BB%AD%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    localStorage.setItem('recommend_auto_play', 'close');// 关闭自动连续播放开关
    var css = "#slide_ad, .bpx-player-toast-wrap {display: none !important}";
    GM_addStyle(css);
    var JSON_parse = `JSON.parse;
    JSON.parse = function(arg){
        if(arg.indexOf('账号未登录') != -1){
            arg = arg.replace('"code":-101', '"code":0').replace('"message":"账号未登录"','"message":"0"').replace('"isLogin":false','"isLogin":true');
            return JSON_parse(arg);
        }
        return JSON_parse(arg);
    }`

    // hook fetch
    const { fetch: originalFetch } = unsafeWindow;
    unsafeWindow.fetch = async (...args) => {
        let [resource, config] = args;
      // if(resource.indexOf('setting/list') != -1 || resource.indexOf("interaction-status") != -1 || resource.indexOf('session_svr/single_unread') != -1){
        let response = await originalFetch(resource, config);
        const json = () =>
          response
            .clone()
            .json()
            .then(function(data){
              if(data.message == "账号未登录"){
                data = { ...data, code: 0, message: "0", ttl:1};
                return data;
              }else{
                return data;
              }
            });
            // .then((data) => ({ ...data, code: 0, message: "0", ttl:1}));
        response.json = json;
        return response;
      // }
        // let response = await originalFetch(resource, config);
        // return response;
    };

    // hook xhr
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async){
        if(url.indexOf('web-interface/nav') != -1 || url.indexOf('is_forbid') != -1){
//            console.log("find url:", url);
            this.addEventListener("readystatechange", function () {
                if(this.readyState == 3 && this.responseType == ''){
                    var _responsetext = this.responseText;
                    Object.defineProperty(this, "responseText",{
                        writable: true,
                    });
                    this.responseText = _responsetext.replace('"code":-101', '"code":0').replace('"message":"账号未登录"','"message":"0"').replace('"isLogin":false','"isLogin":true').replace('"forbid_note_entrance":true', '"forbid_note_entrance":false');
//                    console.log(this.responseText);
                }
            })
        }
        return open.apply(this, arguments);
    }

    window.onload = function(){
        if(!(/dedeuserid/i).test(document.cookie)){
            document.querySelector(".default-btn").innerHTML = document.querySelector(".not-follow").innerHTML;
            document.querySelector(".default-btn").className = document.querySelector(".not-follow").className;
            document.querySelector(".default-btn").nextElementSibling.style.display = 'none';
            let time = new Date().getTime();
            let itv = setInterval(() => {
                try{
                    document.querySelector(".header-avatar-wrap").innerHTML = '<div class="right-entry__outside go-login-btn"><div class="header-login-entry"><span> 登录 </span></div></div>';
                    document.querySelector(".header-avatar-wrap").className = 'v-popover-wrap';
                    if(document.querySelector(".go-login-btn").className == 'right-entry__outside go-login-btn' || new Date().getTime() - time > 10000){
                        clearInterval(itv);
                        console.log("清理定时器成功");
                    }
                }catch{}
            }, 100);
        }
    }

})();