// ==UserScript==
// @name         蓝墨云班课（Moso Tech）资源下载
// @namespace    https://github.com/xfl03/
// @version      0.2
// @description  增加下载按钮，以便于直接在线下载蓝墨云班课（Moso Tech）中的资源
// @author       xfl03
// @match        https://www.mosoteach.cn/web/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35668/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%EF%BC%88Moso%20Tech%EF%BC%89%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/35668/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%EF%BC%88Moso%20Tech%EF%BC%89%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".res-row-open-enable").each(function() {
        if ($(this).find(".download-res-button").length > 0) return;//如果已经存在下载按钮（例如mp3），则不再添加
        $(this).find("ul").html('<li class="download-ress download-res-button">下载</li>' + $(this).find("ul").html());
    });

    $(document).on('click', '.download-ress', function() {
            var resHref = $(this).parents(".res-row-open-enable").attr('data-href');
            window.open(resHref);
    });
})();