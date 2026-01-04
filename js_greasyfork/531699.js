// ==UserScript==
// @name         雨滴强制显示套餐选择
// @namespace    http://tampermonkey.net/
// @version      2024-12-13
// @description  让雨滴校园网系统一定显示套餐选择页面
// @author       Lsmaker
// @match        https://10.6.6.6:8080/*
// @icon         http://10.6.6.6/tpl/bbgu/static/img/favicon.ico
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/531699/%E9%9B%A8%E6%BB%B4%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E5%A5%97%E9%A4%90%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/531699/%E9%9B%A8%E6%BB%B4%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E5%A5%97%E9%A4%90%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const listener = elmGetter.each('ul[role=menubar]', document, (elem, isInserted) => {
        if (isInserted) {
            var div=nevItem("/#/my/package","套餐选择")
            elem.appendChild(div);
            return false;
        }
    });
    function nevItem(url,name){
        let div = document.createElement("div");
        var addstr="<a href="+url+"><div data-v-481bb2c0=\"\" class=\"sidebar-item mb-2\"><li data-v-481bb2c0=\"\" class=\"el-menu-item !text-base font-bold rounded-md\" role=\"menuitem\" tabindex=\"-1\"><div data-v-481bb2c0=\"\" class=\"inline-block w-7\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1024 1024\" class=\"w-7\"></svg></div><span data-v-481bb2c0=\"\" class=\"pl-3 pt-1\">"+name+"</span></li></div></a>"
        div.innerHTML =addstr;
        return div;
    }
})();
