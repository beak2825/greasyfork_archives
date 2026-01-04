// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            BSI金融实训平台字符专项练习脚本
// @author          kkevin
// @description     自动填入字符
// @match           *://bsi.occupationedu.com/SkillExam/TypeWrite/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.4
// @namespace https://greasyfork.org/users/501359
// @downloadURL https://update.greasyfork.org/scripts/400335/BSI%E9%87%91%E8%9E%8D%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%AD%97%E7%AC%A6%E4%B8%93%E9%A1%B9%E7%BB%83%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/400335/BSI%E9%87%91%E8%9E%8D%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%AD%97%E7%AC%A6%E4%B8%93%E9%A1%B9%E7%BB%83%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    setInterval(function(){
    if($('#TestStartDateTime') !== null) {
        $('*[id*=Tcontent]:visible').each(function() {
            $(this).next().val($(this).text().trim())
            $(this).next().trigger("onkeyup")
        });
        document.getElementById("timeisOver").value = "1";
        isover = '1';
    }},4000);
})();
