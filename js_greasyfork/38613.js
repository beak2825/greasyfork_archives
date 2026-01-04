// ==UserScript==
// @name         Проверка ВУ на сайте ГИБДД
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Оптимизация процесса проверки
// @author       М
// @include      https://xn--90adear.xn--p1ai/check/driver*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38613/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%92%D0%A3%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/38613/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%92%D0%A3%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.meta.js
// ==/UserScript==

$(function(){
    $("header.ln-header").remove();
    $("div.bn-top-menu.no-style.b-desktop-section").remove();
    $("div.bn-top-menu.no-style.b-tablet-section.b-mobile-section").remove();
    $("div.b-mobile-menu").remove();
    $("div.bn-map.tab").remove();
    $("div.bn-top-submenu.no-style").remove();
    $("ul.b-mobile-section.b-inline_menu.no-style").remove();
    $("div.ln-content-right").remove();
    $("div.bn-federal-site.wrapper").remove();
    $("footer.ln-content-top-right").remove();
    $("footer.ln-footer.wrapper").remove();
    $("div.ln-content-top-right").remove();
    $("div.ln-content.wrapper.clearfix").width(0);
});