// ==UserScript==
// @name         echarts 设置数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://echarts.baidu.com/examples/editor.html*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css
// @require      https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.4.4/babel.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38839/echarts%20%E8%AE%BE%E7%BD%AE%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/38839/echarts%20%E8%AE%BE%E7%BD%AE%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var $ = $ || window.$;
    var dom= `
        <style>
            .setBox{
                position:fixed;
                top:0;
                left:0;
                z-index:10000;
            }
            .form-control{
                min-height:300px;
            }
        </style>
        <div class="setBox">
            <textarea class="form-control"></textarea>
        <div>
    `;
    // try {
    //     $('body').append(dom);
        
    // } catch (e) {
    //     console.log("dom未插入", e)
    // }
        
})();