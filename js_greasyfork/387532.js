// ==UserScript==
// @name         HWM_CampaignDialogsSkipping
// @namespace    Небылица
// @version      1.1
// @description  Автопромотка диалогов в кампаниях
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/campaign\.php/
// @downloadURL https://update.greasyfork.org/scripts/387532/HWM_CampaignDialogsSkipping.user.js
// @updateURL https://update.greasyfork.org/scripts/387532/HWM_CampaignDialogsSkipping.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const callAgainInterval = 150; // Задержка при прокликивании, мс

    // Вспомогательные функции
    function clickWrapper(){ // Обёртка для прокликивания, при наличии кнопок "Далее"/"ОК" нажимает их и рекурсивно вызывает себя с задержкой callAgainInterval, пока диалог не кончится
        if (document.documentElement.innerHTML.indexOf("успешно завершили кампанию") === -1){ // кроме финального окна
            var callAgain = false;
            if (panelDialog.style.display !== "none"){
                nextButton.dispatchEvent(mouseup);
                callAgain = true;
            }
            if (panelInfo.style.display !== "none"){
                okButton.dispatchEvent(mouseup);
                callAgain = true;
            }
            if (callAgain){window.setTimeout(function(){clickWrapper();}, callAgainInterval);}
        }
    }
    function setupObserver(target, config, callback){ // Привязка к target observer'а с параметрами config и вызовом callback при срабатывании
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){callback();});
        });
        observer.observe(target, config);
    }
    //

    // объявляем 2 вида кнопок для прожатия, элементы, в которых они находятся, и событие для вызова
    var nextButton = document.getElementById("btn_next_dialog"),
        okButton = document.getElementById("btn_ok_panel"),
        panelDialog = document.getElementById("camp_panel_dialog"),
        panelInfo = document.getElementById("camp_panel_info"),
        mouseup = new Event("mouseup");

    // привязываем к появлению окошек с кнопками запуск прокликивания
    setupObserver(panelDialog, {attributes: true, attributeFilter: ["style"]}, clickWrapper);
    setupObserver(panelInfo, {attributes: true, attributeFilter: ["style"]}, clickWrapper);
    if (panelDialog.style.display !== "none" || panelInfo.style.display !== "none"){clickWrapper();}
})();