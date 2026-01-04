// ==UserScript==
// @name         Youku 1080 zz
// @namespace    http://v.youku.com/
// @version      0.3
// @description  解开 VIP 1080p
// @author       游客
// @match        http://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39175/Youku%201080%20zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39175/Youku%201080%20zz.meta.js
// ==/UserScript==
// 优酷更新代码 div层有变动
// <解开1080> 提示移到设置分辨率选项的底部
(function() {
    'use strict';
    $('.playBox').append('<div style=\"position:relative;left:-136px;top:-64px;Z-INDEX: 9999; text-align:Right;\"><a href=javascript:voide(); onclick=\" $(\'.settings-item.disable\').remove();  if($(\'#my1080p\').length <= 0) $(\'.quality-dashboard.larger\').append(\'<div data-val=1080p class=settings-item data-eventlog=xsl id=my1080p>1080p</div>\'); \"><font color=#909096><b>解开1080</b></font></a></div>');

})();