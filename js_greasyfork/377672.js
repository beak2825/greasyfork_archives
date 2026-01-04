// ==UserScript==
// @name              csdn 简易阅读模式
// @namespace
// @description       csdn 简易阅读模式-自用 test
// @version           1.0.3
// @match             *://blog.csdn.net/*
// @require           https://code.jquery.com/jquery-3.3.1.min.js
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/377672/csdn%20%E7%AE%80%E6%98%93%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377672/csdn%20%E7%AE%80%E6%98%93%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    $('aside').remove();
    $('.recommend-right').remove();
    $('.tool-box').remove();
    $('#mainBox').css('margin-left', '15px');
    $('main').css('cssText', 'float: left; min-width:840px;')

})();

