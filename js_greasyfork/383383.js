// ==UserScript==
// @name         再也不见吧百度
// @namespace    https://blog.wangmao.me/
// @version      0.2
// @description  强制戒断习惯性百度
// @author       Secret
// @match        www.baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383383/%E5%86%8D%E4%B9%9F%E4%B8%8D%E8%A7%81%E5%90%A7%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/383383/%E5%86%8D%E4%B9%9F%E4%B8%8D%E8%A7%81%E5%90%A7%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // overwrite docment
    document.write(``);
    // trying Google
    var image = new Image();
    image.src = `https://www.google.com/favicon.ico`;
    // if google's icon can load, the location redirection google
    image.onload = function(){
        window.location.href = `https://www.google.com/`;
    };
    // if timeout, the location redirection dogedoge
    setTimeout(function(){
        window.location.href = `https://www.dogedoge.com/`;
    }, 1000);
})();