// ==UserScript==
// @name         浙大 DeepSeek 免登陆
// @namespace    http://tampermonkey.net/
// @version      2025-02-19
// @description  浙大 DeepSeek 免登陆，打开即用
// @author       LZJ
// @match        https://chat.zju.edu.cn/
// @match        https://chat.zju.edu.cn/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zju.edu.cn
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527409/%E6%B5%99%E5%A4%A7%20DeepSeek%20%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/527409/%E6%B5%99%E5%A4%A7%20DeepSeek%20%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var free = setInterval(()=>{
        if(window.location.pathname == '/login'){
            window.location.pathname = '/'
        }else{
            let overlay = document.querySelector(".overlay")
            if (overlay){
                overlay.remove()
                clearInterval(free)
            }
        }
    },500)
    })();