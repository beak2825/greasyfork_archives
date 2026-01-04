// ==UserScript==
// @name         HWM_HideBestStacks
// @namespace    Небылица
// @version      1.2
// @description  Удаляет со страницы персонажа блок с лучшими отрядами ГЛ
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/pl_info.php.+/
// @downloadURL https://update.greasyfork.org/scripts/374232/HWM_HideBestStacks.user.js
// @updateURL https://update.greasyfork.org/scripts/374232/HWM_HideBestStacks.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // берём все блоки вида как нужный и из них последний
    var bestStacksQueryResults = document.querySelectorAll("table.wblight[cellpadding='2'][cellspacing='0'][border='0'][width='878'][align='center']"),
        bestStacksBlock = bestStacksQueryResults[bestStacksQueryResults.length-1];
    // если это точно существа ГЛ, то удаляем
    if (bestStacksBlock.innerHTML.indexOf("Лучшие отряды Гильдии Лидеров") !== -1){
        bestStacksBlock.parentNode.removeChild(bestStacksBlock);
    }
})();