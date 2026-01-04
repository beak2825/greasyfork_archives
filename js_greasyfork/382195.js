// ==UserScript==
// @name         麦能网自动开始未完成课程（停止维护，请使用麦能网学习助手）
// @namespace    https://blog.luoyb.com
// @version      1.3 final
// @description  麦能网成教平台自动选课
// @author       robin<37701233@qq.com>
// @match        http://g.cjnep.net/lms/web/
// @grant        none
// @license      GPL
// @icon         http://fs.cjnep.net/resources/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/382195/%E9%BA%A6%E8%83%BD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E9%BA%A6%E8%83%BD%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/382195/%E9%BA%A6%E8%83%BD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E9%BA%A6%E8%83%BD%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoselect(){
        var _list = $('.courselist>.row>div');
        for (var i = 0; i < _list.length; i++) {
            if (!$(_list[i]).find('.statusdiv').length) {
                console.log("跳转至："+$(_list[i]).find('.introdiv').text());
                window.location.href = "http://g.cjnep.net"+$(_list[i]).find('.zbtn').attr('href').replace('/detail', '');
                break;
            }
        }
        setTimeout(autoselect, 10000);
    }
    //autoselect();
alert('停止维护，请使用“麦能网学习助手”');
})();