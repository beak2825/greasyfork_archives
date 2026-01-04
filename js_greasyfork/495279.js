// ==UserScript==
// @name         检测网站存在脚本
// @namespace    http://yeyu2048.xyz
// @version      1.0
// @description  检测脚本
// @author       夜雨
// @match        *://*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @connect     greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495279/%E6%A3%80%E6%B5%8B%E7%BD%91%E7%AB%99%E5%AD%98%E5%9C%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495279/%E6%A3%80%E6%B5%8B%E7%BD%91%E7%AB%99%E5%AD%98%E5%9C%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

   



    function getParams(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    }

    //封装GM_xmlhttpRequest ---start---
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

            GM_xmlhttpRequest(details)

        });
    }

    function GM_httpRequest(details, callBack, errorCallback, timeoutCallback, abortCallback){
        if(callBack){
            switch (details.responseType){
                case "stream":
                    details.onloadstart = callBack;
                    break;
                default:
                    details.onload = callBack
            }
        }
        if(errorCallback){
            details.onerror = errorCallback;
        }
        if(timeoutCallback){
            details.ontimeout = timeoutCallback;
        }
        if(abortCallback){
            details.onabort = abortCallback;
        }
        console.log(details)

        GM_xmlhttpRequest(details)
    }

    //封装GM_xmlhttpRequest ---end---


    GM_fetch({
        method: "GET",
        url: `https://greasyfork.org/zh-CN/scripts/by-site/${location.host.startsWith("www.")?location.host.slice(4):location.host}?filter_locale=0&sort=updated`,
        headers: {
            "Referer": "https://greasyfork.org/"
        },
        responseType: "text"
    }).then((res) => {
        if (res.status === 200) {
            console.log(res)
            let rest = res.responseText
            if(!rest.includes("找不到相关脚本")){
                GM_registerMenuCommand("存在脚本", function (event) {
                    console.warn("存在脚本")
                    GM_openInTab(`https://greasyfork.org/zh-CN/scripts/by-site/${location.host.startsWith("www.")?location.host.slice(4):location.host}?filter_locale=0&sort=updated`)
                }, "searchJS");
            }else {
               console.error("找不到相关脚本")
            }

        } else {
            console.log('访问失败了')
        }
    },function (err) {
        console.log(err)
    }).catch((ex)=>{
        console.log(ex)
    })




})();