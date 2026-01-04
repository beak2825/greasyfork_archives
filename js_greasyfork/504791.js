// ==UserScript==
// @name         取消超链接的下划线
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  手机端使用X浏览器取消超链接的下划线
// @author       zhn
// @match        *://dszh.xyz/list.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dszh.org
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/504791/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%9A%84%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/504791/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%9A%84%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义CSS
    //GM_addStyle(`
    //     a.custom-link {
    //        text-decoration: none !important; /* 去除下划线 */
    //    }
    //    a.style.textdecoration = 'none !important';
    //`);
    
    

    window.onload=function(){//do something

        var lists = document.getElementsByTagName("a");
        for(var i = 0;i < lists.length;i++)
        {
            //lists[i].classList.add('custom-link'); 
            //GM_addStyle(lists[i]+'{text-decoration: none !important}')
            lists[i].style.textDecoration = 'none';
        }
    }
})();