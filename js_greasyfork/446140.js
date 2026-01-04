// ==UserScript==
// @name         greasyfork显示长时间未更新脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  未更新的脚本背景显示为浅红
// @author       AN drew
// @match        https://greasyfork.org/zh-CN/users/472487-an-drew
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446140/greasyfork%E6%98%BE%E7%A4%BA%E9%95%BF%E6%97%B6%E9%97%B4%E6%9C%AA%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446140/greasyfork%E6%98%BE%E7%A4%BA%E9%95%BF%E6%97%B6%E9%97%B4%E6%9C%AA%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('dd.script-list-updated-date').each(function(){
        let time1 = new Date($(this).find('relative-time').attr('datetime'));
        let time2 = new Date();
        if(time2.getTime()-time1.getTime() > 3*30*24*60*60*1000)
        {
            $(this).find('relative-time').css('color','red');
            $(this).closest('li').css('background','#ff000008');
        }
    })

})();