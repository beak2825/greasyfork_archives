// ==UserScript==
// @name         百度文库文本选中复制【失效联系作者24小时更新】
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  解除网站不允许复制的限制，文本选中后点击复制按钮即可复制，目前支持百度文库，持续支持中。
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       蜡小新
// @match        https://wenku.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant       unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445128/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445128/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var content = "";
     function checkTextOnSelected(){
        $(".tips-wrap").hide();
        if($("#copy-door").length == 0)  {
            $("body").append("<div id='copy-door' style='color: white;background-color: #363738;width: 70px;height: 31px;padding: 0 4px 0 11px;position:absolute;font-size: 15px;line-height: 31px;border-radius: 3px;cursor: pointer;'>点我复制</div>");
            $("#copy-door").click(function(event){
                const aux = document.createElement('input');
                aux.setAttribute('value', $(".search-result-wrap .link").text().split("查看全部包含“")[1].split("”的文档")[0]);
                document.body.appendChild(aux);
                aux.select();
                document.execCommand('copy')
                document.body.removeChild(aux)
                $("#copy-door").css("background-color","green");
                $("#copy-door").text("复制成功");
                $("#copy-door").fadeOut(2000);
            });
        }
        let isTextVisiable = !!$(".search-result-wrap .link") || $(".search-result-wrap .link").length != 0;
        if (!isTextVisiable) {return;}
        let text = $(".search-result-wrap .link").text();
        if(!text || text.indexOf("查看全部包含“”的文档") != -1) {return;}
        let newContent = text.split("查看全部包含“")[1].split("”的文档")[0];
        if(newContent != content) {
            content = newContent;
            $("#copy-door").css("background-color"," #363738");
            $("#copy-door").text("点我复制");
            $("#copy-door").css("top",$("#reader-helper").css("top"));
            $("#copy-door").css("left",$("#reader-helper").css("left"));
            $("#copy-door").show();
        }
    }

    window.setInterval(checkTextOnSelected, 500);
    checkTextOnSelected();
    document.addEventListener("DOMContentLoaded", function () {
        var pageData = {};
        Object.defineProperty(unsafeWindow, "pageData", {
            set: function (v) { return (pageData = v); },
            get: function () {
                if (!pageData.vipInfo)
                    return (pageData.vipInfo = {});
                pageData.vipInfo.global_svip_status = 1;
                pageData.vipInfo.global_vip_status = 1;
                pageData.vipInfo.isVip = 1;
                pageData.vipInfo.isWenkuVip = 1;
                return pageData;
            },
        });
    });
})();