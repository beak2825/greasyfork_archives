// ==UserScript==
// @name         2ch Colorized Links
// @description  Раскрашивает ссылки на посты разными цветами для более простого визуального восприятия. Дает ссылкам на один пост один и тот же цвет.
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @author       Anonymous
// @match        https://2ch.hk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369870/2ch%20Colorized%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/369870/2ch%20Colorized%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forEachChildWithClass(el, klass, f) {
        Array.from(el.getElementsByClassName(klass)).forEach(f);
    }

    function hasClass(el, klass) {
        return el.classList && el.classList.contains(klass);
    }

    // https://stackoverflow.com/a/4382138/6879054
    var kelly_colors_hex = [
        "#FFB300", // Vivid Yellow
        "#803E75", // Strong Purple
        "#FF6800", // Vivid Orange
        "#A6BDD7", // Very Light Blue
        "#C10020", // Vivid Red
        "#CEA262", // Grayish Yellow
        "#817066", // Medium Gray

        // The following don't work well for people with defective color vision
        "#007D34", // Vivid Green
        "#F6768E", // Strong Purplish Pink
        "#00538A", // Strong Blue
        "#FF7A5C", // Strong Yellowish Pink
        "#53377A", // Strong Violet
        "#FF8E00", // Vivid Orange Yellow
        "#B32851", // Strong Purplish Red
        "#F4C800", // Vivid Greenish Yellow
        "#7F180D", // Strong Reddish Brown
        "#93AA00", // Vivid Yellowish Green
        "#593315", // Deep Yellowish Brown
        "#F13A13", // Vivid Reddish Orange
        "#232C16", // Dark Olive Green
    ];

    function colorizeReplyLink(elem) {
        var num = parseInt(elem.textContent.replace(/^>>/, "").replace(/ \(OP\)$/, ""));
        elem.style.color = kelly_colors_hex[num % kelly_colors_hex.length];
    }

    function colorizePostNumber(elem) {
        elem.style.color = kelly_colors_hex[parseInt(elem.textContent) % kelly_colors_hex.length];
    }

    window.onload = function() {
        forEachChildWithClass(document, "post-reply-link", colorizeReplyLink);
        forEachChildWithClass(document, "postbtn-reply-href", colorizePostNumber);
    };

    document.addEventListener(
        "DOMNodeInserted",
        function(e) {
            var el = e.target;

            // новые и всплывающие по наведению мыши посты
            if (hasClass(el, "post-wrapper") || hasClass(el, "post")) {
                forEachChildWithClass(el, "post-reply-link", colorizeReplyLink);
                forEachChildWithClass(el, "postbtn-reply-href", colorizePostNumber);

            // первая ссылка на ответ к посту
            } else if (hasClass(el, "ABU-refmap")) {
                forEachChildWithClass(el, "post-reply-link", colorizeReplyLink);

            // остальные ссылки на ответы к посту
            } else if (hasClass(el, "post-reply-link")) {
                colorizeReplyLink(el);
            }
        },
        false);
})();