// ==UserScript==
// @name         禅道复制url
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chandao.aibeike.com/zentao/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381678/%E7%A6%85%E9%81%93%E5%A4%8D%E5%88%B6url.user.js
// @updateURL https://update.greasyfork.org/scripts/381678/%E7%A6%85%E9%81%93%E5%A4%8D%E5%88%B6url.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 复制
    function copy(text) {
        var input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input)
        return result;
    }
    var wrap = document.querySelector('.page-title')
    if (!wrap) return
    var button = document.createElement('button')
    button.innerText='复制链接'
    wrap.append(button)
    button.addEventListener('click',function(){
       var title = document.title
       var url = location.href
       var str = '['+title+']('+url+')'
       copy(str)
       console.log('链接复制成功..')
    })
    // Your code here...
})();