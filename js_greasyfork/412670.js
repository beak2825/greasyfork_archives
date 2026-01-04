// ==UserScript==
// @name         屏蔽vip视频+下载视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sese7208.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412670/%E5%B1%8F%E8%94%BDvip%E8%A7%86%E9%A2%91%2B%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412670/%E5%B1%8F%E8%94%BDvip%E8%A7%86%E9%A2%91%2B%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("click", urlcheck);
        //检查url的函数是不是包含'/photo/'，包含了就清除所有绑定的事件并且绑定我们自己的click事件，如果不包含就返回
        function urlcheck() {
        $("div.item.premium").hide();
        }
    let currentUrl = document.location.href;
        if (currentUrl.includes("/videos/")) {
            setTimeout(downloadporn, 100);
            console.log("延时1秒成功");
        } else {
            console.log("检查url不包含videos，成功");
            //$("#layers > div.css-1dbjc4n img[src]").unbind();
            //console.log("不包含photo取消了所有图片的绑定事件成功");
            return;
        };


        function downloadporn() {
            //91porn自动提取下载地址
            var src = "";
            //顶层建立一个悬浮层
            var xuanfu91porn = $("<div style='z-index: 9999; position: fixed ! important; width:100%; top: 0px;'><table><input type='text' value='' id='myinputb' style='position:absolute;left:0px;top:0px;width:30%;color:red;'><input type='button' value='提取地址' id='mybutton' style='position: absolute;right: 0px; top: 0px;'></table></div>");
            $(document.body).append(xuanfu91porn);
            //建立方法集合，提取出src地址
            var Methods = {
                //把视频地址传递到悬浮层
                Get91pornSrc: function (e) {
                    src = $("#kt_player > div.fp-player > video").attr("src");
                    $("input#myinputb").val(src);
                    src = "";
                },
                //一键粘贴代码
                Methosb: function () {
                    var inputText = document.getElementById('myinputb');
                    var currentFocus = document.activeElement;
                    inputText.focus();
                    inputText.setSelectionRange(0, inputText.value.length);
                    document.execCommand('copy', true);
                    currentFocus.focus();
                }
            };
            //绑定button事件
            $("input#mybutton").click(function (e) {
                Methods.Get91pornSrc();
                Methods.Methosb();
                e.target.value = "复制成功";
            })
        };

    // Your code here...
})();