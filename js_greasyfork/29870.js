// ==UserScript==
// @name         baidu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  精简百度搜索首页
// @author       xpc
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29870/baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/29870/baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#u_sp, #s_top_wrap, #s_upfunc_menus,#bottom_container, #u1, .qrcodeCon, #ftCon').hide();  
})();