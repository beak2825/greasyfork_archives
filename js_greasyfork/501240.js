// ==UserScript==
// @name         钟馗之眼噩梦
// @namespace    https://www.ymypay.cn/
// @version      2024-07-20
// @license      钟馗之眼噩梦，可强制取消实名认证弹窗
// @description  钟馗之眼噩梦，可强制取消实名认证弹窗,https://www.ymypay.cn/
// @author       AMEN
// @match        https://www.zoomeye.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoomeye.org
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501240/%E9%92%9F%E9%A6%97%E4%B9%8B%E7%9C%BC%E5%99%A9%E6%A2%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501240/%E9%92%9F%E9%A6%97%E4%B9%8B%E7%9C%BC%E5%99%A9%E6%A2%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let t = null;
    t = setInterval(()=>{
        let flag = $('.ant-modal-mask');
        if (flag !== null && flag.length !== 0){
            console.log("钟馗之眼噩梦成功清除实名弹窗")
            $('.ant-modal-mask').remove();
            $('.ant-modal-wrap').remove();
            //clearInterval(t)
        }

    },100)
    // Your code here...
})();