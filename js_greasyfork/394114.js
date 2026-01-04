// ==UserScript==
// @name         真实链接替换
// @namespace    https://www.frank6.com/
// @version      0.4
// @description  将页面中所有链接文本为网址，href却不一致的a标签替换的小工具
// @author       Frank6
// @grant        none
// @include      http*
// @downloadURL https://update.greasyfork.org/scripts/394114/%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/394114/%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let urlArr = document.getElementsByTagName('a');

    for(let item of urlArr){
        let regex = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        if(regex.test(item.text)){
            item.href = item.text;
        }
    }
})();