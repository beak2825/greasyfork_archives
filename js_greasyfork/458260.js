// ==UserScript==
// @name         百度首页取消推荐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度首页取消推荐0.1
// @author       awerty3450p@126.com
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458260/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8F%96%E6%B6%88%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/458260/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8F%96%E6%B6%88%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(location.href=='https://www.baidu.com/')
    {
       let tuijian = document.querySelector('#s_menus_wrapper span[data-id="99"]');
       if(tuijian.classList.contains('current')){
            //alert('包含 current 这个class');
            let guanzhu = document.querySelector('#s_menus_wrapper span[data-id="100"]');

            let s_menu_mine = document.getElementById('s_menu_mine');
            //console.log(s_menu_mine);
            //s_menu_mine.click();
            setTimeout("document.getElementById('s_menu_mine').click()",500);



            //s_content_100.style.display="block";
            //let s_content_2 = document.querySelector('#s_content_2');
            //console.log(s_content_2);
            //s_content_2.style.display="none";
            //console.log(guanzhu);



       }

    }

})();