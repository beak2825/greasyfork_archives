// ==UserScript==
// @name         巴哈首頁簽到
// @namespace    Bee10301
// @version      1.0
// @description  進入首頁時如果可以簽到，將自動簽到
// @author       Bee10301
// @match        https://www.gamer.com.tw/
// @homepage    https://home.gamer.com.tw/home.php?owner=bee10301
// @downloadURL https://update.greasyfork.org/scripts/375310/%E5%B7%B4%E5%93%88%E9%A6%96%E9%A0%81%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/375310/%E5%B7%B4%E5%93%88%E9%A6%96%E9%A0%81%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
//     var script = document.createElement("script");  // create a script DOM node
//     script.src = "https://i2.bahamut.com.tw/js/signin.js";  // set its src to the provided URL

//     document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    window.onload=function(){
        if(document.body.outerHTML.match(/ 巴幣/)!=null){
        Signin.start(this);}
        //debug
        //console.log(document.body.outerHTML.match(/ 巴幣/)!=null);

    };

})();