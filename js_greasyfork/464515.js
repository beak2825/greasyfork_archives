// ==UserScript==
// @name         青年大学习
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  青年大学习一键结尾
// @author       Qiuyue
// @match        h5.cyol.com
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cyol.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464515/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/464515/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let INT = setInterval(
        ()=>{
            // 获取节点
            let ele = document.querySelectorAll('video')
            //  判断节点是否为空
            if(ele.length){
                ele.forEach(c=>{
                    //跳转到结尾
                    c.currentTime = c.duration
                    if(c.currentTime == c.duration){
                        // 确定跳转到结尾后清除定时器
                        clearInterval(INT)
                    }
                }
                           )
            }
        },1000
    )
    })();