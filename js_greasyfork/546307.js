// ==UserScript==
// @name         Drawaria Drag Any Element And Delete Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Перетаскивай и удаляй элементы на любых страницах интернета
// @author TheProhaaa
// @match        *://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546307/Drawaria%20Drag%20Any%20Element%20And%20Delete%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/546307/Drawaria%20Drag%20Any%20Element%20And%20Delete%20Element.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selected = null;
    let offsetX = 0;
    let offsetY = 0;

    document.addEventListener("mousedown", function (e) {
        // ЛКМ только
        if (e.button !== 0) return;

        selected = e.target;
        // DELETE
        selected.style.position = "absolute";
        selected.style.zIndex = 9999;

        offsetX = e.clientX - selected.getBoundingClientRect().left;
        offsetY = e.clientY - selected.getBoundingClientRect().top;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (!selected) return;
        selected.style.left = (e.pageX - offsetX) + "px";
        selected.style.top = (e.pageY - offsetY) + "px";
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        selected = null;
    }
})();
