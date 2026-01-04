// ==UserScript==
// @name         RARBG's image
// @description  自动显示 RARBG 网站 XXX 类的预览图片
// @author       zelricx
// @namespace    https://greasyfork.org/users/212360
// @version      0.12
// @date         2018.09.23
// @match        https://rarbgunblocked.org/torrents.php?*
// @match        https://rarbgprx.org/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @icon         https://rarbgprx.org/favicon.ico
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/372480/RARBG%27s%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/372480/RARBG%27s%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var alist = $(".lista2").find("a[onmouseover]");

    $.each(alist, function (i, v) {
        var self = $(v);
        var td = self.parent("td");
        var imgFunc = self.attr("onmouseover");
        var imgBegin = imgFunc.indexOf("'") + 1;
        var imgEnd = imgFunc.lastIndexOf("'");
        var imgLength = imgEnd - imgBegin;
        var img = $(imgFunc.substr(imgBegin , imgLength).replace(/\\'/g, "\""));
        img.css("display", "block");
        img.css("padding", "5px");
        td.prepend(img);
        self.removeAttr("onmouseover");
    });
})();