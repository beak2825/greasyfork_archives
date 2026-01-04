// ==UserScript==
// @name         swagger添加复制url按钮
// @namespace    http://sslfer.com/
// @version      0.1
// @description  复制 swagger-ui.html 页面的path 的 url
// @author       sslf
// @match        */swagger-ui.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373608/swagger%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6url%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/373608/swagger%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6url%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function (){

        $("#swagger-ui-container .path").after(
            $("<butten>复制</butten>").css("cursor","pointer").click(function (){
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents($(this).prev()[0]);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("Copy")
            }));

    }, 1000);


})();