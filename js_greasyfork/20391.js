// ==UserScript==
// @name           CL1024
// @author         SevenStar
// @namespace      SevenStar
// @description    CL1024JS
// @version        1.00.00
// @create         2016-06-09
// @lastmodified   2016-06-09
// @include        *.t66y.*
// @copyright      2016+, SevenStar
// @grant          unsafeWindow
// @run-at         document-end
// @require        http://libs.useso.com/js/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20391/CL1024.user.js
// @updateURL https://update.greasyfork.org/scripts/20391/CL1024.meta.js
// ==/UserScript==
(function() {
    // http://10240.tk/*
    var Lc = location,
        lurl = location.href;
    var dhost = location.hostname.replace(/\w+\./, '');
    var win = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;
    $('html').append('<style>*{font-family:"微软雅黑",helvetica,arial,sans-serif!important}#main,#header{max-width:1600px!important}');
})();