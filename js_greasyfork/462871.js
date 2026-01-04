// ==UserScript==
// @name         搜索引擎快捷键跳转
// @namespace    https://greasyfork.org/zh-CN/users/298906-jonolo
// @version      1.0
// @description  通过 Ctrl、Shift 和 S 键组合按键在google和baidu之间互相跳转
// @author       Jonolo
// @run-at       document-start
// @include      http*://*baidu.com/s*
// @include      http*://*baidu.com/baidu*
// @include      *://www.google.com/search?*
// @include      *://www.google.com.*/search?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462871/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462871/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    document.addEventListener('keydown', (event) => {
        // 判断是否同时按下了 Ctrl、Shift 和 S 键
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            // 阻止默认行为
            event.preventDefault();

            // 触发你的函数
            var hostname = window.location.hostname;
            if(hostname.match(RegExp(/google.com.*/))){
                google();
            }
            if(hostname.match(RegExp(/baidu.com/))){
                baidu();
            }


            yourFunction();
        }
    });


    function google(){
        var sVal = document.querySelector("input[name='q']").value
        var url_baidu_new = "https://www.baidu.com/s?wd=" + encodeURIComponent(sVal);
        window.location.href = url_baidu_new;
    }

    function baidu(){
        let sVal = document.getElementById('kw').value;
        let url_baidu_new = 'https://www.google.com/search?&ie=UTF-8&q=' + sVal;
        window.location.href = url_baidu_new;
    }
})();