// ==UserScript==
// @name        双卫网自动挂课(正常倍速 处理弹窗)
// @namespace   
// @match       https://*sww.com.cn/*
// @grant       qft19
// @version     3.0
// @author      浩浩
// @description 听课\答题\请尽快使用
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523196/%E5%8F%8C%E5%8D%AB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%28%E6%AD%A3%E5%B8%B8%E5%80%8D%E9%80%9F%20%E5%A4%84%E7%90%86%E5%BC%B9%E7%AA%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523196/%E5%8F%8C%E5%8D%AB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%28%E6%AD%A3%E5%B8%B8%E5%80%8D%E9%80%9F%20%E5%A4%84%E7%90%86%E5%BC%B9%E7%AA%97%29.meta.js
// ==/UserScript==
$(document).ready(function() {
    $("li[is_right='1']").each(function() {
        $(this).find("span").click();
    });
 
$('#btn-answer').click(function() {
 
    $('.dati-dialog').hide();
    $('.video-zhezhao').hide();
});
    $("#btn-submit.jiaoquan").click();
    (function() {
        'use strict';
        let isPopQuestion = false; // 使用let来声明局部变量
        if (!isPopQuestion) {
            isPopQuestion = true;
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var confirmButton = document.querySelector('#btnKaoShi.kaoshi');
                    if (confirmButton) {
                        observer.disconnect();
                        confirmButton.click();
                    }
                });
            });
            var targetNode = document.body;
            var config = { childList: true, subtree: true };
            observer.observe(targetNode, config);
        }
    })();
});