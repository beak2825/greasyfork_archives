// ==UserScript==
// @name         百度去广告调布局test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  油猴脚本测试，百度去广告/调布局
// @author       fsf
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411424/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%B0%83%E5%B8%83%E5%B1%80test.user.js
// @updateURL https://update.greasyfork.org/scripts/411424/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%B0%83%E5%B8%83%E5%B1%80test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        // jQuery调布局
        $('.s_form').css('padding-left','20%');
        $('.s_tab_inner').css('margin-left','13.5%');
        $('#container').css('width','60%').css('margin-left','20%');
        $('.c-icons-outer').hide();
        // jQuery去广告
        $('.ec_tuiguang_ppouter, .ec_tuiguang_pplink').parent().parent().hide();
        $("span").each(function() {
            if ($(this)[0].innerHTML == '广告') {
                $(this).parent().parent().remove();
            }
        });
        // 原生DOM操作测试
        var grp = document.getElementsByClassName("opr-toplist1-subtitle");
        for (var i=0; i<grp.length; i++) {
            // $(grp[i]).css('color', 'red');
            grp[i].style.color = "green";
        }
    },100);
})();