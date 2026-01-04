// ==UserScript==
// @name         Bangumi科学排名显示
// @namespace    https://bgm.tv/group/topic/337638
// @version      0.1
// @description  基于 https://bgm.tv/group/topic/337638 的排名显示
// @author       WashSwang
// @include      /^https?:\/\/(bangumi|bgm|chii)\.(tv|in).*$/
// @icon         https://www.google.com/s2/favicons?domain=bangumi.tv
// @grant        GM_xmlhttpRequest
// @connect      ranking.ikely.me
// @downloadURL https://update.greasyfork.org/scripts/433432/Bangumi%E7%A7%91%E5%AD%A6%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/433432/Bangumi%E7%A7%91%E5%AD%A6%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ranking.ikely.me/api/anime/list?start=0&length=50000",
        onload: function(res) {
            if (res.status == 200) {
                var text = res.responseText;
                var data = JSON.parse(text);
                let dict = data.reduce((map, x) => { map[x.id] = x.rank; return map; }, {});
                $("li.item").each(function() {
                    var id = parseInt($(this).attr("id").slice(5));
                    if (id in dict) $(".inner", this).append(`<span class="rank" style="right: 80px; background: #069667;"><small>Rank </small>${dict[id]}</span>`);
                });
            }
        }
    });

})();