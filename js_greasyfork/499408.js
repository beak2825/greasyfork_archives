// ==UserScript==
// @name chat-logs
// @namespace http://tampermonkey.net/
// @version 0.1.0
// @author Nei
// @description chat message!
// @match https://catwar.su/cw3/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499408/chat-logs.user.js
// @updateURL https://update.greasyfork.org/scripts/499408/chat-logs.meta.js
// ==/UserScript==




(function() {
    'use strict';

    var target = document.querySelector("#chat_msg");
    var infoPanel = document.querySelector("body");
    var InfoItem = document.createElement("div");
    InfoItem.textContent = "Произошло обновление в чате";
    InfoItem.style.display = "none";
    InfoItem.style.top = "0";
    InfoItem.style.height = "30px";
    InfoItem.style.background = "white";
    InfoItem.style.position = "sticky";
    InfoItem.style.fontSize = "16px";
    InfoItem.style.textAlign = "center";
    InfoItem.style.zIndex = "9";

    InfoItem.id = "chat-update";
    // infoPanel.appendChild(InfoItem);
    infoPanel.insertBefore(InfoItem, infoPanel.firstChild);


    const config = {
        childList: true,
    };

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                document.querySelector("#chat-update").style.display = "block";
                setTimeout(() => document.querySelector("#chat-update").style.display = "none", 3000);
            }
        }
    };

    // Создаём экземпляр наблюдателя с указанной функцией колбэка
    const observer = new MutationObserver(callback);

    // Начинаем наблюдение за настроенными изменениями целевого элемента
    observer.observe(target, config);
})();