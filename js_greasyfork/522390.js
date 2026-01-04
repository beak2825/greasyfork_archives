// ==UserScript==
// @name         小米路由自动登录
// @namespace    http://yeyu2048.xyz/
// @version      1.0
// @description  xxx
// @author       夜雨
// @match        *://*/*
// @grant      GM_xmlhttpRequest
// @connect    *
// @license    MIT
// @website    https://yeyu1024.xyz/gpt.html
// @run-at     document-end

// @downloadURL https://update.greasyfork.org/scripts/522390/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/522390/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==



(async function () {
    'use strict';

    if(!location.host.startsWith("192")) return

    console.log('小米路由器')
    
     const password = '123456' //你的路由器密码



    async function GM_fetch(details) {
        return new Promise((resolve, reject) =>{
            switch (details.responseType){
                case "stream":
                    details.onloadstart = (res)=>{
                        resolve(res)
                    }
                    break;
                default:
                    details.onload = (res)=>{
                        resolve(res)
                    };
            }

            details.onerror = (res)=>{
                reject(res)
            };
            details.ontimeout = (res)=>{
                reject(res)
            };
            details.onabort = (res)=>{
                reject(res)
            };

        });
    }

   

    window.onload = async function () {
        const noLogin = document.body.innerText.includes("随时随地管理你的路由器")
        const nonce = Encrypt.init();
        const oldPwd = Encrypt.oldPwd(password);
        const param = {
            username: 'admin',
            password: oldPwd,
            logtype: 2,
            nonce: nonce
        };

        if (document.title.includes("Redmi路由器") && noLogin) {
            let baseURL = location.origin;

            const res = await fetch(baseURL + "/cgi-bin/luci/api/xqsystem/login", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "http://192.168.10.126/cgi-bin/luci/web/home",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": new URLSearchParams(param),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }) ;
            const ret = await res.json()
            console.log(ret)
            const redirect = ret.url
            location.href = redirect



        }
    }




})();



