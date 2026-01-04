// ==UserScript==
// @name         高热
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  haha
// @author       CYF
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482253/%E9%AB%98%E7%83%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/482253/%E9%AB%98%E7%83%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // 更改h3
    GM_addStyle(`
        h3 {
            height:150px !important;
            font-family:"霞鹭文楷GB屏幕阅读版";
            font-weight:500;
            font-size:18px !important;
            color:black !important;
        }
    `)

    GM_addStyle(`
        h3 > a {
            font-size:13px !important;
        }
    `)

    // 更改按键大小
    // GM_addStyle(`
    //     .item-button-span{
    //         font-size:16px !important;
    //     }
    // `)

    // 更改id文字大小
    GM_addStyle(`
        .desc-panel{
            font-size:10px !important;
        }
    `)

    // 更改分类文字大小
    GM_addStyle(`
        .category-desc{
            font-size:10px !important;
        }
    `)

    GM_addStyle(`
        .answer-group-input-text {
            display: none;
        }
    `)

    // 更改显示图片
    // GM_addStyle(`
    //     img{
    //     display:none;
    // }
    // // `)


    // setInterval(() => {
    //     let a = document.getElementsByTagName('h3')

    //     for (let i = 0; i < a.length; i++) {
    //         a[i].style.height = '130px'
    //     }
    //     $('.desc-panel').css("font-size","10px")
    //     $('.category-desc').css("font-size","10px")
    //     $('.item-button-span').css("font-size","16px");
    // }, 50)

})();