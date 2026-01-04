// ==UserScript==
// @name         sentry适合竖屏
// @namespace    https://jeff.wtf/
// @version      0.1
// @description  把侧边栏去掉
// @author       kindJeff
// @match        https://sentry.17bdc.com/shanbay/*/issues/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395127/sentry%E9%80%82%E5%90%88%E7%AB%96%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/395127/sentry%E9%80%82%E5%90%88%E7%AB%96%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function(){
        setTimeout(function(){
            $("body").css("padding-left", 0)
            $($(".app").children()[0]).hide()
        }, 1000)
    })
})();