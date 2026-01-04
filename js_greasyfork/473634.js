// ==UserScript==
// @name         ChatGPT-Next-Web模板网站删除标题
// @namespace    tampermonkey413575
// @version      0.3
// @description  自动隐藏网页标题部分
// @author       reece00
// @match        *://*/*
// @grant        none
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/473634/ChatGPT-Next-Web%E6%A8%A1%E6%9D%BF%E7%BD%91%E7%AB%99%E5%88%A0%E9%99%A4%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473634/ChatGPT-Next-Web%E6%A8%A1%E6%9D%BF%E7%BD%91%E7%AB%99%E5%88%A0%E9%99%A4%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if (localStorage.getItem('chat-next-web-store') !== null) {
        window.onload = setTimeout(click_item, 200);
    }
    function click_item(){
        if(document.querySelector('.window-header')){

            var title = document.querySelector('.window-header-main-title').textContent;
            if(document.querySelector('.modal-mask') == null){
                if(document.querySelector('.window-header').style.display != 'none')
                {
                    if(document.querySelector('.window-header-main-title') && title !== '设置')
                    {
                        document.getElementsByClassName("window-header")[0].style.display = 'none';
                    }
                }
            }else{
                document.getElementsByClassName("window-header")[0].style.display = '';
            }


        }
        setTimeout(click_item, 200);
    }
})();
