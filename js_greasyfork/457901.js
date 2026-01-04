// ==UserScript==
// @name         爱奇书屋翻页插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  爱奇书屋---方向键翻页功能，Enter键跳转到目录
// @author       Feng_Yijiu
// @match        https://www.k70.xyz/*
// @icon         https://static.k75.la/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457901/%E7%88%B1%E5%A5%87%E4%B9%A6%E5%B1%8B%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/457901/%E7%88%B1%E5%A5%87%E4%B9%A6%E5%B1%8B%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    $(document).keyup(function(event){
        console.log(event.keyCode)
            if(event.keyCode==39){
                //下一章
                var href ="https://www.k70.xyz/" + $(".nr_page>.xyz").attr('href');
                window.location.href = href
            }else if(event.keyCode==37){
                //上一章
                var href ="https://www.k70.xyz/" + $(".nr_page>.syz").attr('href');
                window.location.href = href
            }else if(event.keyCode==13){
                //目录章节
                var href ="https://www.k70.xyz/" + $(".nr_page>.ml").attr('href');
                window.location.href = href
            }
        })
})();