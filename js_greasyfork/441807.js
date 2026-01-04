// ==UserScript==
// @name         隐藏qq邮箱右侧滚动条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除QQ邮件写邮件时右侧闪动滚动条
// @author       You
// @match        https://mail.qq.com/cgi-bin*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441807/%E9%9A%90%E8%97%8Fqq%E9%82%AE%E7%AE%B1%E5%8F%B3%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/441807/%E9%9A%90%E8%97%8Fqq%E9%82%AE%E7%AE%B1%E5%8F%B3%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    // Your code here...test template
    var i = setInterval(findDiv, 2000)
    function findDiv(){
        var iframe = document.querySelector("#mainFrame");
        if(iframe){
            var idoc = iframe.contentWindow.document;
            if(idoc)
                var div = idoc.querySelector('#rightAreaBtnWarp');
            if(div){
                div.style.overflow = 'hidden';
            }
        }

        setTimeout(removeInterval, 2000);
        function removeInterval(){
            for (var i = 1; i < 99999; i++){
                window.clearInterval(i);
            }
            console.log('clear all intervals')
        }
    }

})();