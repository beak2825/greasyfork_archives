// ==UserScript==
// @name        亚马逊<管理我的内容和设备>:批量删除文件
// @namespace    undefined
// @version      0.1
// @description  亚马逊<管理我的内容和设备>:批量删除文件!
// @author       北漂梧桐
// @match        https://www.amazon.cn/mn/dcw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30019/%E4%BA%9A%E9%A9%AC%E9%80%8A%3C%E7%AE%A1%E7%90%86%E6%88%91%E7%9A%84%E5%86%85%E5%AE%B9%E5%92%8C%E8%AE%BE%E5%A4%87%3E%3A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/30019/%E4%BA%9A%E9%A9%AC%E9%80%8A%3C%E7%AE%A1%E7%90%86%E6%88%91%E7%9A%84%E5%86%85%E5%AE%B9%E5%92%8C%E8%AE%BE%E5%A4%87%3E%3A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }
    function remainTime(){
        $("#dialogButton_ok_myx").click();

        $('#chk0').click();
        $('#chk1').click();
        $('#chk2').click();
        $('#chk3').click();
        $('#chk4').click();
        $('#chk5').click();
        $('#chk6').click();
        $('#chk7').click();
        $('#chk8').click();
        $("#contentAction_delete_myx").click();
        $("#dialogButton_ok_myx").click();
        $("#dialogButton_ok_myx").click();
        setTimeout(remainTime,3000);
    }
    addJQuery(remainTime);
})();