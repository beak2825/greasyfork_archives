// ==UserScript==
// @name         bdys03
// @namespace    td
// @version      1.0
// @description  bdys03助手
// @author       ch
// @match        *://*.bdys03.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461381/bdys03.user.js
// @updateURL https://update.greasyfork.org/scripts/461381/bdys03.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('bdys03');

    var Cla = {

    };
    var alert = function () { return 1 }
    var confirm = function () { return 1 }
    var prompt = function () { return 1 } 
    var peertitle = '';
    var peerid = 0;
    var reflesh = 30 * 60;//刷新间隔秒
    debugger
    var word = '测试';
    var time = 10;//时间间隔秒
    function videoPage() {//视频界面
        if (!location.href.includes('/play/'))
            return;

        window.setInterval(function () {
           
            if ($('.ayx').length > 0) {
                $('.ayx').remove();
            }
            if ($('header.d-print-none').length > 0) {
                $('header.d-print-none').remove();
            }
            if ($('div.navbar-expand-md').length > 0) {
                $('div.navbar-expand-md').remove();
            }
            if ($('footer.container-fluid').length > 0) {
                $('footer.container-fluid').remove();
            }
            if ($('.card-footer').length > 0) {
                $('.card-footer').remove();
            }
            if ($('#count-down').length > 0) {
                $('#count-down').click();
            }
            
            $('.container-xl>.row-cards>div').not(":first").remove();
        }, 0.2 * 1000);



    } 
    videoPage();
})();

