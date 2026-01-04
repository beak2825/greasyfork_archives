// ==UserScript==
// @name         Github导航栏添加主页按钮
// @version      0.7
// @description  导航栏增加主页按钮
// @author       xiaoxuan6
// @license      MIT
// @match        https://github.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/1038333
// @downloadURL https://update.greasyfork.org/scripts/477852/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%E4%B8%BB%E9%A1%B5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/477852/Github%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%E4%B8%BB%E9%A1%B5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
 
 
$(document).ready(function(){
    init()
    
    function init() {
        $('.AppHeader-globalBar-end').append('<div class="main"><?xml version="1.0" encoding="UTF-8"?><svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="16" r="6" fill="#ff4c2f" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 36C36 29.3726 30.6274 24 24 24C17.3726 24 12 29.3726 12 36" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 4H44V12" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 4H4V12" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 44H44V36" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 44H4V36" stroke="#0021ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')
    }
    
    $('.main').on('click', function() {
        window.location.href="/xiaoxuan6"
    })

});