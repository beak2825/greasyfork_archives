// ==UserScript==
// @name         Разметка цвета дкву 2.0 и проверка ВУ на сайте ГИБДД
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Оптимизация процесса проверки
// @author       Сергей
// @match       http://www.gibdd.ru/check/driver/
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Dkvu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34700/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D0%B4%D0%BA%D0%B2%D1%83%2020%20%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%92%D0%A3%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/34700/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D0%B4%D0%BA%D0%B2%D1%83%2020%20%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%92%D0%A3%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.meta.js
// ==/UserScript==

$(function(){
    $("div#wrapper > header").hide();
    $("div#wrapper > section#middle > aside#sideLeft").hide();
    $("div#wrapper > section#middle > aside#sideRight").hide();
    $("div#wrapper > section#middle > div#container > div#content > div.doc-text > div#appCheckContainer > div#checkDriverContainer > button.checkFeedbackButton").hide();
    $("body > footer").hide();
});

function flxfunc(){
    var a=$("#table > div:nth-child(1) > div:nth-child(1) > table:nth-child(1)");a[0].style="background: red none repeat scroll 0% 0%;background: -webkit-gradient(linear, left top, left bottom, color-stop(12.5%, rgba(230, 57, 155, 1)), color-stop(12.5%, rgba(230, 57, 155, 1)), color-stop(12.5%, rgba(255, 86, 64, 1)), color-stop(12.5%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)));"
}
var link=window.document.createElement("link");link.rel="stylesheet",link.type="text/css",link.href='data:text/css,.container-flex > [class*="vspan"], .container-flex > div{background-size:contain;background-repeat: no-repeat;}.padding-s-bottom > span.gray{ font-style: italic;font-weight: 700;color: %23666;}.modal-dialog{ width: 811px;margin: 5px auto;}.modal-body {position: relative;padding: 7px;padding-bottom:2px;}.form-control-static {padding-top: 0px;font-size: 10px;}%23msg {height: 75px;font-size: 11.7px;background-color: rgba(255,255,255,0.70);margin-top: -10px;}.scroll-panel {height: 437px; padding: 2px 0;margin-top: 2px;}.form-group {margin-bottom: 5px;font-size: 12.2px;}.modal-footer {padding: 4px;padding-top: 2px;}li.list-group-item > b {font-size: 10px;position: absolute;right: 11px;top: -2px;color: %23bdbdbd;}.list-group-item {padding: 7px 10px;}li.list-group-item > div.gray {color: %235E5E5E;}.container-app {margin: -20px -11px;}.navbar {margin-top: -7.5px;}%23content > div:nth-child(1) {margin-top: 40px;opacity: 0.52;}%23content {margin-top: -35px;}.car-images .content {background: rgba(0,0,0,0.77);}.navbar-default .navbar-nav > .active > a {border-width: 13px;padding-top: 4px;padding-bottom: 0px;}.container-flex-horizontal .separate-left {margin-top: 0px!important;}.container-filters {padding-bottom: 0px;z-index: 99999;}div.modal-dialog > .modal-content {background-color: rgba(255,255,255,0.67);}',document.getElementsByTagName("HEAD")[0].appendChild(link),$("select").change(flxfunc),document.addEventListener("DOMContentLoaded",setTimeout(flxfunc),350);
