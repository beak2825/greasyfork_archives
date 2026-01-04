// ==UserScript==
// @name         uview删除广告
// @namespace    https://gitee.com/canotf
// @version      2024-12-17
// @description  uview删除强制观看广告
// @author       cacode
// @match        *uview-plus.jiangruyi.com/*
// @match        *uiadmin.net/*
// @icon         https://uview-plus.jiangruyi.com/common/logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521105/uview%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/521105/uview%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        const dialog__wrapper = document.getElementsByClassName("el-dialog__wrapper");
        if(dialog__wrapper.length > 0){
            dialog__wrapper[0].style.zIndex='-1';
        }
        const modal = document.getElementsByClassName("v-modal");
        if(modal.length > 0){
             modal[0].style.zIndex='-1';
        }
    },100)
    // Your code here...
})();