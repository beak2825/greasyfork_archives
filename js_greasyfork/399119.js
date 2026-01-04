// ==UserScript==
// @name         新浪微博内容批量提取
// @namespace    80f8bbae-1e20-4b0e-96a1-db12071b6264
// @version      1.0
// @description  批量提取新浪微博内容
// @author       shenglin-feng
// @match        https://weibo.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399119/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399119/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").append("<button id='btn' style='position:fixed;left:5px;top:200px;z-index:999999'>提取</button>");

    $("#btn").click(function() {
		var str = "";
		$(".WB_detail").each(function() {
			str += $(this).find(".WB_from .S_txt2:first").text().trim() + "<br>";
            str += $(this).find(".WB_text").text().trim() + "<br>";
		});
        window.open().document.write(str);
    });

})();
