// ==UserScript==
// @name         Civitai Utility
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Civitai Utility (T = Extract Tags [ctrl + 4])
// @author       Leo Bi
// @match        *://*.civitai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/520963/Civitai%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/520963/Civitai%20Utility.meta.js
// ==/UserScript==

// convert char to ascii
function ascii(a) {
    return a.charCodeAt(0);
}



(function($) {
    'use strict';

    // copy to clipboard
    function copyToClipboard(content) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(content).select();
        document.execCommand("copy");
        $temp.remove();
    }

    $(document).bind('keypress', function(event) {

        // copy ticket number + short description
        if( event.which == ascii("4") && event.ctrlKey ) {

            var pageUrl = window.location.href;

            var tags = $('a[data-activity="tag-click:image"]');

            var extractedTags = [];

            tags.each(function() {
                var tagText = $(this).text();

                if (tagText !== "tag" && tagText !== "pg") {
                    extractedTags.push(tagText);
                }
            });


            var aiPrompts = "页面URL的值为:" + pageUrl + ",请将以下所有Stable Diffusion标签(以下简称为:SD标签)按合适的方式进行分类，并按它们出现的顺序排序，最后，生成用tab符号分隔的多行数据。每行数据包含以下内容(用tab符号分隔): 当前日期,页面URL,SD标签类别(英文),SD标签类别(中文翻译),SD标签(英文),SD标签(中文翻译)，方便我稍后将其粘贴到Excel。原始的SD标签列表:" + extractedTags;

            copyToClipboard(aiPrompts);
        }
    });

})(jQuery);