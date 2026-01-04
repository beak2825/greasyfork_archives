// ==UserScript==
// @name         HWM_HideWorthlessTourAchievements
// @namespace    Небылица
// @version      1.0
// @description  Удаляет со страниц персонажей ачивки ПТ++ и плюсовые бронзы
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/pl_info.php.+/
// @downloadURL https://update.greasyfork.org/scripts/386851/HWM_HideWorthlessTourAchievements.user.js
// @updateURL https://update.greasyfork.org/scripts/386851/HWM_HideWorthlessTourAchievements.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var icons = document.querySelectorAll("img[src*='/i/rewards/ptpp/ptpp_'], " +
                                          "img[src*='/i/rewards/mtp_bronze'], " +
                                          "img[title*='Малый турнир++. Бронза.'], " +
                                          "img[src*='/i/rewards/pt/ptp_bronze'], " +
                                          "img[src*='/i/rewards/smtp3'], " +
                                          "img[src*='/i/rewards/t3t_bronze']");
    if (icons){
        var iconTd,
            i,
            maxI = icons.length;
        for (i=0;i<maxI;i++){
            iconTd = icons[i].parentNode.parentNode.parentNode;
            iconTd.parentNode.removeChild(iconTd);
        }
    }
})();