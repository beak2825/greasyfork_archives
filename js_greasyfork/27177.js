// ==UserScript==
// @name         关掉开通 QQ 空间的提示
// @namespace    https://www.kindjeff.com/
// @version      2017.2.8
// @description  再关掉 QQ 空间之后，每次进入空间时都会有一个烦人的提示。这个脚本去掉这个提示。
// @author       kindJeff
// @match        http://user.qzone.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/27177/%E5%85%B3%E6%8E%89%E5%BC%80%E9%80%9A%20QQ%20%E7%A9%BA%E9%97%B4%E7%9A%84%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/27177/%E5%85%B3%E6%8E%89%E5%BC%80%E9%80%9A%20QQ%20%E7%A9%BA%E9%97%B4%E7%9A%84%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var remove_block = function(){
        document.body.removeChild(document.getElementById('top_tips_container'));
    };

    var main_loop = setInterval(function(){
        if(document.getElementById('top_tips_container')!==null){
            clearInterval(main_loop);
            remove_block();
            document.getElementsByClassName('top-fix-inner')[0].style = "";
        }
    }, 1000);
})();