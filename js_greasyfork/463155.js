// ==UserScript==
// @name         【掘金/知乎】免登录复制并移除小尾巴
// @version      0.2
// @author       雪导
// @description  自用小工具~掘金免登录复制并移除小尾巴
// @match        https://juejin.cn/post/*
// @match        https://www.zhihu.com/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/860042
// @downloadURL https://update.greasyfork.org/scripts/463155/%E3%80%90%E6%8E%98%E9%87%91%E7%9F%A5%E4%B9%8E%E3%80%91%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E5%B9%B6%E7%A7%BB%E9%99%A4%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/463155/%E3%80%90%E6%8E%98%E9%87%91%E7%9F%A5%E4%B9%8E%E3%80%91%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E5%B9%B6%E7%A7%BB%E9%99%A4%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("pre,code").css("user-select","auto");


    [...document.querySelectorAll('*')].forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    })
})();