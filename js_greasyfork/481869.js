// ==UserScript==
// @name         快捷复制轻雀文档脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以用ctrl+c复制轻雀文档脚本
// @author       You
// @match        https://docs.qingque.cn/*
// @icon         https://h1.static.yximgs.com/udata/pkg/is-docs-tequila-frame/assets/favicon.ico
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/481869/%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E8%BD%BB%E9%9B%80%E6%96%87%E6%A1%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481869/%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E8%BD%BB%E9%9B%80%E6%96%87%E6%A1%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
let time = setInterval(()=>{
    try {
        Docs.Excel.workbook.getCanCopy = () =>{
            return true
        }
        if(!Docs.Excel.redux.getState().common.vodkaModel.docInfo.canCopy){
            Docs.Excel.redux.getState().common.vodkaModel.docInfo.canCopy = true;Docs.Excel.redux.getState().common.vodkaModel.docInfo.canDuplicate=true;
            window.Docs.Excel.workbook.canCopy_ = true;window.Docs.Excel.workbook.canDuplicate_ = true;window.Docs.Excel.workbook.canComment_=true;
            clearInterval(time)
        }
    } catch (error) {

    }
},100)

