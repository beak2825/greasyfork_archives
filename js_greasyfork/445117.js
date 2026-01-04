// ==UserScript==
// @name         傻瓜式推特去广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  傻瓜式推特去广告，未经过可靠测试
// @author       炽幻
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445117/%E5%82%BB%E7%93%9C%E5%BC%8F%E6%8E%A8%E7%89%B9%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445117/%E5%82%BB%E7%93%9C%E5%BC%8F%E6%8E%A8%E7%89%B9%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    window.onscroll = function(){
        var a = document.querySelectorAll('[dir="auto"]');
        for(var i=0;i<a.length;i++){
            if(a[i].children&&a[i].children.length>0&&a[i].children[0].innerText == '推荐'){
                console.log('去掉一条广告');
                a[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            }
        }
    }
    
})();