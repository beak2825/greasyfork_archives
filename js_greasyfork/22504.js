// ==UserScript==
// @name         Pixiv Top Rankings enhancer
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @description  Adds a filter for Pixiv top rankings
// @version      1.1.0
// @author       nixx quality <nixx@is-fantabulo.us>
// @match        http://www.pixiv.net/ranking.php*
// @downloadURL https://update.greasyfork.org/scripts/22504/Pixiv%20Top%20Rankings%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/22504/Pixiv%20Top%20Rankings%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var optionsList = document.getElementsByClassName("options")[0];
    var showOnlyList = document.createElement("select");

    var options = [["", "Show only..."], ["lo", "未成年"], ["furry", "ケモノ"], ["bl", "男性同性愛"], ["yuri", "女性同性愛"]];
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i][0];
        option.text = options[i][1];
        showOnlyList.appendChild(option);
    }

    var oldupdate = pixiv.ranking.attrFilter.update;
    function updateShowOnly() {
        oldupdate.apply(pixiv.ranking.attrFilter);
        [].forEach.call(document.getElementsByClassName("ranking-item"), function (element) {
            if (!element.dataset.attr.includes(showOnlyList.value)) {
                element.className = "ranking-item _attr-filter-hidden";
            }
        });
    }

    pixiv.ranking.attrFilter.update = updateShowOnly;
    showOnlyList.addEventListener("change", updateShowOnly);

    optionsList.appendChild(showOnlyList);
})();