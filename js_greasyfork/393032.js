// ==UserScript==
// @name         巴哈測試 簡黑模式
// @namespace    https://forum.gamer.com.tw/A.php?bsn=26742
// @version      0.2
// @description  巴哈測試!!
// @author       You
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @match        https://forum.gamer.com.tw/A.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393032/%E5%B7%B4%E5%93%88%E6%B8%AC%E8%A9%A6%20%E7%B0%A1%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393032/%E5%B7%B4%E5%93%88%E6%B8%AC%E8%A9%A6%20%E7%B0%A1%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if( $("#BH-menu-path > ul > ul > li.BH-menu-forumA-right.dropList > dl > dd:nth-child(3) > a > div").prop('class') != 'BH-menu__switch-box is-on' ){
        console.log('變換簡黑模式!!');
        $("#themeSwitch").click();
    }else{
        console.log('已經是簡黑模式!!');
    }


    // Your code here...
})();