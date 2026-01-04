// ==UserScript==
// @name         greasyfork图片上传筛选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在脚本上传的页面，上传时只选择图片文件
// @author       kakasearch
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411080/greasyfork%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/411080/greasyfork%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(let i=0;i<5;i++){
        let tmp = "#add-screenshot-"+i
        document.querySelector(tmp).accept='.png,.jpg,.jpeg,.gif'
    }
})();