// ==UserScript==
// @name         LOLZ_Refresh
// @namespace    Lolz Auto Refresh
// @description  Lolz Auto Refresh
// @version      0.5
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru
// @match        https://lolz.guru
// @match        https://lolz.live
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/478435/LOLZ_Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/478435/LOLZ_Refresh.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const autoReloadTimeout = 5000; // Автоматическая перезагрузка в МС 1000 мс = 1 секунда
    const reloadButton = document.querySelector(".UpdateFeedButton");
    let _timer = null;
    if(reloadButton) {
        let _refresh = await GM.getValue("LZT_Auto_Refresh");
        let spanElement = document.createElement('span');
        spanElement.className = 'fa fa-clock lolzauthrefresh';
        spanElement.title = 'Обновить ленту';
        spanElement.style.marginLeft = '15px';
        spanElement.style.padding = '11px';
        reloadButton.parentNode.insertBefore(spanElement, reloadButton.nextSibling);
        spanElement.addEventListener('click', function() {
            set();
        });
        function set() {
            if(_timer) {
                GM.setValue("LZT_Auto_Refresh", 0);
                clearInterval(_timer);
                _timer = null;
                XenForo.alert('Автоматическое обновление отключено.', "LOLZ Auto Refresh", 2000);
            } else {
                GM.setValue("LZT_Auto_Refresh", 1);
                _timer = setInterval(click, autoReloadTimeout);
                XenForo.alert('Автоматическое обновление активировано.', "LOLZ Auto Refresh", 2000);
            }
        }
        function click() {
            if(document.hasFocus()) reloadButton.click();
        }
        document.addEventListener('keydown', function(event) {
            if (event.altKey && event.keyCode === 53) {
                set();
            } else if(event.keyCode === 53) {
                click();
                XenForo.alert('Обновили страницу.', "LOLZ Auto Refresh", 2000);
            }
        });
        if(autoReloadTimeout > 2000 && _refresh) _timer = setInterval(click, autoReloadTimeout)
    }
})();