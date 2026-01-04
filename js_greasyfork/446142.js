// ==UserScript==
// @name         自动点击所有greasyfork脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示重新安装，则版本相同直接关闭页面
// @author       AN drew
// @match        https://greasyfork.org/zh-CN/users/*
// @match        https://greasyfork.org/zh-CN/scripts/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446142/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%80%E6%9C%89greasyfork%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446142/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%80%E6%9C%89greasyfork%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#user-script-list-section a.script-link').each(function(){
        //window.open($(this).attr('href'));
    })

    $('#user-unlisted-script-list-section a.script-link').each(function(){
        //window.open($(this).attr('href'));
    })

    if(window.location.href.indexOf('/scripts/') > -1)
    {
        if($('body>p').text().indexOf('down for maintenance') > -1)
        {
            setTimeout(function(){
                window.location.reload();
            },10000)
        }
    }

    setInterval(function(){
        if($('#install-area').text().indexOf('重新安装') > -1)
        {
            window.close();
        }
    },1000)
})();