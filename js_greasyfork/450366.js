// ==UserScript==
// @author       YuXianwen
// @name         木易杨前端进阶免扫码查看全文
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license MIT
// @description  木易杨前端进阶站点
// @match        https://muyiy.cn/question/*
// @icon         https://muyiy.cn/favicon.ico
// @require      https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450366/%E6%9C%A8%E6%98%93%E6%9D%A8%E5%89%8D%E7%AB%AF%E8%BF%9B%E9%98%B6%E5%85%8D%E6%89%AB%E7%A0%81%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/450366/%E6%9C%A8%E6%98%93%E6%9D%A8%E5%89%8D%E7%AB%AF%E8%BF%9B%E9%98%B6%E5%85%8D%E6%89%AB%E7%A0%81%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //  声明定时器
    var timer = null
    //  检查dom是否执行完成
    function checkDom() {
        let dom = document.getElementById('read-more-wrap')
        if(dom) {
            //  执行dom加载完成后的操作
            doSomething();
            //  清除定时器
            if(!timer) {
                clearTimeout(timer)
            }
        } else {
            //  自我调用
            timer = setTimeout(checkDom, 0)
        }
    }
    //  首次执行
    checkDom()
    // Your code here...
    // 加载样式
    function doSomething(){
      $('#read-more-wrap').remove();
      $('#container').height('initial')
    }
})();