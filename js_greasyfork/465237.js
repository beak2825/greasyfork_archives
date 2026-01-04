// ==UserScript==
// @name         商品
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465237/%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/465237/%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // 更改h3
    GM_addStyle(`
        h3 {
            height:350px !important;
            color:#34495e !important;
            font-family:"霞鹭文楷GB屏幕阅读版";
            font-weight:300;
            font-size: 18px !important;
        }
    `)
    GM_addStyle(`
        h3 span {
            color:#34495e !important;
            font-size:16px !important;
        }
    `)
    GM_addStyle(`
        h3:first-line {
            // font-size: 18px;
        }
    `)

    // 更改query文字
    // GM_addStyle(`
    //     h3 {
    //         font-size:18px !important;
    //     }
    // `)
    // GM_addStyle(`
    //     h3 > a {
    //         font-size:13px !important;
    //     }
    // `)

    // 更改按键大小
    GM_addStyle(`
        .item-button-span{
            font-size:16px !important;
        }
    `)

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

    // 更改显示图片
    GM_addStyle(`
        img{
        display:none;
    }
    // `)

        setInterval(() => {
            let a = document.getElementsByTagName('h3')
            for (let i = 0; i < a.length; i++) {
                let reg = /其他秋哥|其他物种/g;
                if(reg.test(a[i].innerText)){
                    console.log('true')
                    a[i].style.backgroundColor = "rgba(0, 206, 201,0.2)"
                    // a[i].style.borderColor = "red"
                }
            }
        }, 200)


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