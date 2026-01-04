// ==UserScript==
// @name         MacEnjoy百度盘自动填充密码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  需要配合【网盘自动填写访问码】使用
// @author       Haiifenng
// @match        https://info.macenjoy.co/blog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421727/MacEnjoy%E7%99%BE%E5%BA%A6%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/421727/MacEnjoy%E7%99%BE%E5%BA%A6%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        $(".s-common-button").each(function(){
            let button = $(this);
            if ("百度下载" === button.text()) {
                let sBlockItem = button.parents(".s-block-item");
                let prevItem = sBlockItem.prev();
                let pText = prevItem.find("p").text();
                let code = pText.substr(pText.lastIndexOf("< ")+2, 4);
                let href = button.attr("href");
                button.attr("href", href + "#" + code);
            }
        });
    },300);
})();