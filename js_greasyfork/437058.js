// ==UserScript==
// @name         南+隐藏图片
// @version      0.1
// @description  悄咪咪!
// @author       zfy2299
// @match        *://www.spring-plus.net/*
// @match        *://www.level-plus.net/*
// @icon         https://www.google.com/s2/favicons?domain=spring-plus.net
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @namespace    zfy2299_南+隐藏图片
// @downloadURL https://update.greasyfork.org/scripts/437058/%E5%8D%97%2B%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/437058/%E5%8D%97%2B%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        console.log('jquery引入成功');
        let contentImg = $('th.r_one img');
        $.each(contentImg, function(index, ele){
            if(ele.onclick) {
                let imgSrc = ele.src;
                $(ele).replaceWith(`<div style='background: #76669d69;'><span style="color: #f00;font-weight: 900;">图片：</span><a href='${imgSrc}' target='_blank'>${imgSrc}</a></div>`);
            }
        })
    })
    window.onload = function () {
        console.log('脚本启动');
        let userImg = document.querySelectorAll('.user-pic');
        for (let item of userImg) {
            item.innerHTML = '头像';
        }
    }

    // Your code here...
})();