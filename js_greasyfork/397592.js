// ==UserScript==
// @name         FuckMCBBS
// @namespace    https://github.com/xlch88/FuckMCBBS
// @version      1.0
// @description  去你妈的MCBBS | 取消右键屏蔽。| 取消复制屏蔽。| 取消选择屏蔽。| 删除闪图广告。
// @author       Xlch88
// @match        https://www.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397592/FuckMCBBS.user.js
// @updateURL https://update.greasyfork.org/scripts/397592/FuckMCBBS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.createElement('style');
    a.innerHTML = 'html,body,*{user-select: initial;}';
    document.body.appendChild(a);
    document.oncontextmenu=function(){return true;};
    document.onselectstart=function(){return true;};
    jq('.hdc>div').html('<span style="color:white;font-size:22px;">FuckMCBBS V1.0 Enabled.</span>');
})();
