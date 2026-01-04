// ==UserScript==
// @name         EAA - Easy Alert Access
// @namespace    http://www.jeuxvideo.com/
// @version      0.1
// @description  Easy acces to alerts
// @author       Lúthien Sofea Elenassë
// @match        http://www.jeuxvideo.com/messages-prives/message.php?*
// @match        http://www.jeuxvideo.com/gta/info_alerte.php
// @match        http://www.jeuxvideo.com/gta/info_alerte.php?
// @match        http://www.jeuxvideo.com/gta/info_alerte.php?*
// @match        http://www.jeuxvideo.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402825/EAA%20-%20Easy%20Alert%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/402825/EAA%20-%20Easy%20Alert%20Access.meta.js
// ==/UserScript==

(function() {
    var element = document.createElement("div");
    element.style.zIndex = 10000000000;
    element.style.top = 0;
    element.style.right = 0;
    element.style.position = "fixed";
    element.style.backgroundColor = "#FF8000";
    element.style.padding = "5px";

    var puce = document.createElement("span");
    puce.className = "picto-msg-exclam"
    puce.style.cursor = "pointer";

    var style = document.createElement("link");
    style.href = "//static.jvc.gg/1.113.2/css/skin-forum.css"
    style.rel = "stylesheet"

    puce.addEventListener("click", () => {
        var id = prompt("Numéro d'alerte ?", "");
        if (id) {
            location.href = "http://www.jeuxvideo.com/gta/info_alerte.php?ida=" + id
        }
    }, false);

    document.head.appendChild(style);
    document.body.appendChild(element);
    element.appendChild(puce);
})();