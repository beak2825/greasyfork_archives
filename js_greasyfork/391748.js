// ==UserScript==
// @name         STRAVA：アクティビティの一括「自分のみ」化
// @namespace    https://www.nigauri.me/mix/fitness_app/runkeeper-strava
// @version      0.1
// @description  Myアクティビティに表示されたログの公開範囲を一括で「自分のみ」にする。ページ単位に有効。画面下部の「→」ボタンを押せば次ページの一覧も全部「自分のみ」にする。既に「自分のみ」になっているデータは何もしない。
// @author       nigauri
// @match        https://www.strava.com/athlete/training
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391748/STRAVA%EF%BC%9A%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%93%E3%83%86%E3%82%A3%E3%81%AE%E4%B8%80%E6%8B%AC%E3%80%8C%E8%87%AA%E5%88%86%E3%81%AE%E3%81%BF%E3%80%8D%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/391748/STRAVA%EF%BC%9A%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%93%E3%83%86%E3%82%A3%E3%81%AE%E4%B8%80%E6%8B%AC%E3%80%8C%E8%87%AA%E5%88%86%E3%81%AE%E3%81%BF%E3%80%8D%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer1 = new MutationObserver(function (MutationRecords1, MutationObserver1) {
        jQuery(".btn.btn-link.btn-xs.quick-edit").each(function(i, elem) {
            ++count;
            if (jQuery(elem).closest("tr").find(".col-title .icon-private").is(":visible")) {
                return true;
            }

            var observer2 = new MutationObserver(function (MutationRecords2, MutationObserver2) {
                if (0 < jQuery("td.edit-col:visible").length) {
                    jQuery("td.edit-col:visible .visibility-select select").val("only_me");
                    jQuery("td.edit-col:visible .edit-actions button[type='submit']").click();
                    observer2.disconnect();
                }
            });
            observer2.observe(jQuery(elem).closest("tr").find("td.edit-col").get(0), {
                attributes: true,
            });

            jQuery(elem).click();
        });
    });
    observer1.observe(jQuery("#search-results tbody").get(0), {
        childList: true,
    });

})();