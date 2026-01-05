// ==UserScript==
// @name         Fix VK Design
// @namespace    https://vk.com/realpeha
// @version      0.1
// @description  Скрипт улучшает отображение сайта на маленьких экранах
// @author       RealPeha
// @include      https://vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/29814/Fix%20VK%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/29814/Fix%20VK%20Design.meta.js
// ==/UserScript==
(function() {
    document.getElementById("ads_left").remove();
    var css = [
        ".scroll_fix {",
        "margin: 0 auto; width: 100% !important;",
        "}",
        ".js-im-page  {",
        "width: 911px;",
        "}",
        "#page_layout {",
        "max-width: 960px !important; width: 100% !important; padding: 0;",
        "}",
        "#page_body {",
        "width: 795px !important;",
        "}",
        ".side_bar_inner {",
        "position: fixed !important; top: 0 !important; margin-top: 42px !important;",
        "}",
        "@media(max-width: 1010px) {",
         "#side_bar .left_label {",
         "display: none;",
         "}",
         ".left_menu_nav_wrap {",
         "line-height: inherit; padding: 0;",
         "}",
         ".ads_left_empty {",
         "display: none;",
         "}",
         ".side_bar_inner {",
         "width: 100%; margin-top: 32px !important; margin-left: 10px;",
         "}",
         "#page_body {",
         "width: 100% !important; margin-top: 62px;",
         "}",
         ".narrow_column_wrap {",
         "width: 230px;",
         "}",
         ".narrow_column {",
         "width: 220px;",
         "}",
         "#main_feed {",
         "margin: 0 0 0 10px;",
         "}",
        "}"
        ].join("\n");
    var newStyle = document.createElement("style");
	newStyle.type = "text/css";
	newStyle.appendChild(document.createTextNode(css));
	var site = document.getElementsByTagName("head");
	site[0].appendChild(newStyle);
})();