// ==UserScript==
// @name         自定义AJAX请求发送
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调试用
// @author       ActionSafe
// @include      *
// require		 http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382094/%E8%87%AA%E5%AE%9A%E4%B9%89AJAX%E8%AF%B7%E6%B1%82%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/382094/%E8%87%AA%E5%AE%9A%E4%B9%89AJAX%E8%AF%B7%E6%B1%82%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

"use strict";

(function () {
    //变量区
    let css = ".mybtn{margin: 4px 2px;padding: 10px 30px;cursor: pointer;text-decoration: none;border: 2px solid #00a1d6;background-color: #00a1d6;color: #fff;display: inline-block;text-align: center;transition-duration: 0.4s;}.btn:hover{background-color: #fff;color: #00a1d6;}\n" +
        ".mytextarea {border: 0;resize: none;color: #333;outline: 0;font-family: \"source code pro\", sans-serif;font-size: 16px;height: 150px;width: 300px;}\n" +
        ".myoutline {border: 1px solid #00a1d6;transition: .5s ease;}.outline:hover {box-shadow: 0 0 5px #acd9ff;border: 1px solid #00a1d6;}\n" +
        ".mycontainer{position: absolute;border: 2px dashed #00a1d6;width: 320px;height: 250px;display: flex;align-items: center;justify-content: space-around;flex-direction: column;cursor: pointer;}\n";
    //静态方法
    function addCSS(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    }

    //ajax
    function ajax(data) {
        data.success = function(data){console.log(data);};
        data.fail = function(){console.log("失败");};
        $.ajax(data);
    }

    (function init() {
        addCSS(css);
        $("body").prepend("<div class=\"mycontainer\"><textarea class=\"mytextarea myoutline\"></textarea><div class=\"mybtn\">发送</div></div>");
        //默认模板
            let text = $(".mytextarea");
            text.val(JSON.stringify({
                "type": "POST",
                "cache": false,
                "dataType": "json",
                "url": "",
                "data": {}
            },null,"    "));
            text.mousedown(function (e) {
                e.stopImmediatePropagation();//阻止冒泡
            });
            $(".mycontainer").mousedown(function (e) {
                let current_x = e.clientX;
                let current_y = e.clientY;
                let current_offset_x = parseInt($(this).css("left"));
                let current_offset_y = parseInt($(this).css("top"));
                $(document).mousemove(function (e) {
                    let x = e.clientX;
                    let y = e.clientY;
                    $(".mycontainer").css({
                        top:current_offset_y+(y-current_y),
                        left:current_offset_x+(x-current_x)
                    });
                });
                $(document).mouseup(function (e) {
                    $(this).off("mousemove");
                });
            });
            $(".mybtn").on('click',function (e) {
                e.stopPropagation();
                ajax(JSON.parse($(".mytextarea").val()));
            });
    })()
})();
