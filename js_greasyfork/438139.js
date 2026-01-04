// ==UserScript==
// @name         网页调试控制台eruda
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网页调试控制台,帮助浏览器接口调试工具
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/eruda/3.0.0/eruda.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @include      *:*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438139/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0eruda.user.js
// @updateURL https://update.greasyfork.org/scripts/438139/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0eruda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init(){
        eruda.init();
        console.debug('==========eruda init==========');
    }

    $(function(){
        init();
    })

})();