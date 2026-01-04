// ==UserScript==
// @name         51CTO 自定义播放倍数
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  底部增加自定义倍数播放输入,快速填鸭!!!
// @author       Clay
// @match        *://edu.51cto.com/*
// @icon         <$ICON$>
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448238/51CTO%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/448238/51CTO%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var input = $('<input type="number" placeholder="自定义播放倍数" style="height: -webkit-fill-available;">');

    input.change(function(e) {

        if (Number($(this).val()) > 15) {
            alert("喂! 别太过分!");
            return;
        }

        if (Number($(this).val()) < 0.1) {
            return;
        }

        // 设置倍数
        $(".rate-list").children("li")[0].dataset["rate"] = $(this).val()
        // 生效参数
        $(".rate-list").children("li")[0].click();

    })

    // 头部添加input
    $(".Top").append(input);

})();