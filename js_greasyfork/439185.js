// ==UserScript==
// @name         掘金自动抽奖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在抽奖页面时，如果可以免费抽奖将进行抽奖!
// @author       C盘先生
// @match        https://juejin.cn/user/center/lottery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/439185/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439185/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Your code here...
$(document).ready(function(){
        setInterval(function(){
            console.log('jquery','抽奖工作中');
            let $free = $('.text-free')
            if($free.length){
                $free.click();
            }
        },2000)
    })
    
})();