// ==UserScript==
// @name         漫画台、看漫画web免费破解插件
// @namespace    9c
// @version      1.5
// @description  漫画台脚本
// @author       9c
// @match        *://*.manhuatai.com/*
// @match        *://*.kanman.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411736/%E6%BC%AB%E7%94%BB%E5%8F%B0%E3%80%81%E7%9C%8B%E6%BC%AB%E7%94%BBweb%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/411736/%E6%BC%AB%E7%94%BB%E5%8F%B0%E3%80%81%E7%9C%8B%E6%BC%AB%E7%94%BBweb%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$

    unsafeWindow.onload = function () {
        $.get("https://"+unsafeWindow.location.host+"/"+unsafeWindow.comicInfo.comic_id + "/", function(res) {
            unsafeWindow.ACGN.layer.closeAll();
            var data = {}, p={}
            if (unsafeWindow.localStorage.virtualCoinRecord) {
                data = JSON.parse(unsafeWindow.localStorage.virtualCoinRecord)
            }
            if (unsafeWindow.localStorage.p) {
                p = JSON.parse(unsafeWindow.localStorage.p)
            }
            data[unsafeWindow.comicInfo.comic_id] = []
            var lis
            if($(res).find("#js_chapter_list li").length) {
                lis = $(res).find("#js_chapter_list li")
            } else {
                lis = $(res).find("#j_chapter_list li")
            }
            lis.each(function(item) {
                data[unsafeWindow.comicInfo.comic_id].push($(this).data('chapterid') ? $(this).data('chapterid') : $(this).data('chapter'))
            })

            unsafeWindow.localStorage.virtualCoinRecord = unsafeWindow.localStorage.virtualCoinRecord = JSON.stringify(data)
            setTimeout(() => {
                if (!p[unsafeWindow.comicInfo.comic_id]) {
                    p[unsafeWindow.comicInfo.comic_id] = 1
                    unsafeWindow.localStorage.p = JSON.stringify(p)
                    unsafeWindow.location.reload()
                }

            }, 100)
        })
    }
})();