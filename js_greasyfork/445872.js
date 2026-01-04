// ==UserScript==
// @name         B站跳转解析VIP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  附加工具，需要这个脚本的支持（https://greasyfork.org/zh-CN/scripts/445871-%E7%9C%8B%E7%9C%8B%E4%B8%8D%E4%BA%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%89%BE%E6%88%91?locale_override=1）
// @author       黄先生
// @match        http*://v*.superso.top/*
// @match        https://v.superso.top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license  none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/445872/B%E7%AB%99%E8%B7%B3%E8%BD%AC%E8%A7%A3%E6%9E%90VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/445872/B%E7%AB%99%E8%B7%B3%E8%BD%AC%E8%A7%A3%E6%9E%90VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

        document.body.addEventListener('click',async (e) => {const text = await navigator.clipboard.readText();
                                                             console.log(text.match(/www.bilibili.com/g) != null);
                                                             if(text.match(/www.bilibili.com/g )!= null){
                                                                 var ins = document.getElementById('url');
                                                                 var buttonValue = document.getElementById('doplayers');
                                                                 ins.value = text;
                                                                 console.log("1111111111111111111111：",text);
                                                                 buttonValue.onclick = function(){};
                                                                 buttonValue.click();
                                                                 GM_setClipboard("load");
                                                             }
                                                            });

})();