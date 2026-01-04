// ==UserScript==
// @name         班固米剧集看过操作二次确认
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  大于（不包括）25集的剧集看过操作二次确认，防止误操作
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487385/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%89%A7%E9%9B%86%E7%9C%8B%E8%BF%87%E6%93%8D%E4%BD%9C%E4%BA%8C%E6%AC%A1%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/487385/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%89%A7%E9%9B%86%E7%9C%8B%E8%BF%87%E6%93%8D%E4%BD%9C%E4%BA%8C%E6%AC%A1%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const id = window.location.href.split('/').pop();
    fetch(`https://api.bgm.tv/v0/subjects/${id}`)
        .then(response => response.json())
        .then(data => {
            // 这里本来想万一获取出错也应该有下面的逻辑的，不清楚有没有这个必要
            // `!data.eps` 是不知道为什么部分超长剧集接口返回值就是 0
            if (data && data.eps != null && (!data.eps || data.eps > 25)) {
                var origChiiLibHomeEpStatusClick = chiiLib.home.epStatusClick

                chiiLib.home.epStatusClick = function (tgt) {
                    var self = $(tgt), ep_status = self.attr('id').split('_')[0];
                    if (ep_status == 'WatchedTill') {
                        if (!confirm("确定**看到**吗?")) return;
                    }

                    origChiiLibHomeEpStatusClick(tgt);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
})();
