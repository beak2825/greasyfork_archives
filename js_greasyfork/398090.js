// ==UserScript==
// @name         山西干部在线学习刷课
// @namespace    greedisgood_duo
// @version      0.3
// @description  山西干部在线学习的一个刷课脚本
// @author       Soledadchao
// @include      http://*
// @include      https://*

// @run-at       document-end
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/398090/%E5%B1%B1%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/398090/%E5%B1%B1%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var href = window.location.href

    if((href.indexOf("course_tzc?status=1") != -1) ){
        var nowVideo = document.getElementsByClassName("c-cou-mask")[0].getElementsByTagName("a")[0].onclick
        var url = document.getElementsByClassName("c-cou-mask")[0].getElementsByTagName("a")[0].href
        function okPlay() {
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                success: function (d) {
                },
                error: function () {
                }
            });
        }
        okPlay()
    }
})();