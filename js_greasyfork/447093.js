// ==UserScript==
// @name         妖火自动发吹牛
// @namespace    http://blog.zgcwkj.cn
// @version      1.9.0.1.15.14.55
// @description  zh-cn
// @author       zgcwkj
// @match        *://yaohuo.me/games/chuiniu/add*
// @match        *://yaohw.com/games/chuiniu/add*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447093/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/447093/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.title.indexOf("密码") == -1) {
        if (document.title.indexOf("公开挑战") != -1) {
            var toHtml_input = document.getElementsByTagName("input");
            console.log(toHtml_input.length);
            if (toHtml_input.length != 0) {
                //==>随机妖晶（删掉的话，那么默认就是500）
                var yaojing = 1600 + Math.ceil(Math.random() * 10);
                toHtml_input[0].value = yaojing;
                //==>随机妖晶（删掉的话，那么默认就是500）
                toHtml_input[1].value = "我是吹牛逼大神！";
                toHtml_input[2].value = "不是";
                toHtml_input[3].value = "当然";
                //==>随机答案（删掉的话，那么默认就是答案一）
                var toHtml_select = document.getElementsByTagName("select");
                toHtml_select[0].value = Math.ceil(Math.random() * 2);
                //==>随机答案（删掉的话，那么默认就是答案一）
                toHtml_input[toHtml_input.length - 1].click();//确定按钮
            } else {
                setTimeout(function () {
                    window.location.href = '/games/chuiniu/add.aspx';
                }, '2000');
            }
        } else {
            console.log("不该运行");
        }
    } else {
        console.log("输入密码");
    }
})();