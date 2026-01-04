// ==UserScript==
// @name         すき家
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  四川風牛すき鍋定食に投票するスクリプトです
// @author       tusu11
// @match        https://news.sukiya.jp/special/gyunabe/index.html
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/395114/%E3%81%99%E3%81%8D%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/395114/%E3%81%99%E3%81%8D%E5%AE%B6.meta.js
// ==/UserScript==
'use strict';
$(document).ready(function() {
    let id = setInterval(function(){
        clickbtn();
        if(document.querySelector('#obo01_text').textContent=="0"){
            window.location.reload()
            clearInterval(id);
        }
    }, 100);

    function clickbtn(){
        document.getElementById("popular_btn02").click();
    }
});