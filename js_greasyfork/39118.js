// ==UserScript==
// @name         ДКБ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Подсветка ДКБ
// @author       М
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Lightbox*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Stiker*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Charge*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Rug*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Chair*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Booster*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb/Branding*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39118/%D0%94%D0%9A%D0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39118/%D0%94%D0%9A%D0%91.meta.js
// ==/UserScript==



function flxfunc(){
    var a=$("div.datagrid-content");a[0].style="background: red none repeat scroll 0% 0%;background: -webkit-gradient(linear, left top, left bottom, color-stop(12.5%, rgba(230, 57, 155, 1)), color-stop(12.5%, rgba(230, 57, 155, 1)), color-stop(12.5%, rgba(255, 86, 64, 1)), color-stop(12.5%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(0, 255, 255, 1)), color-stop(25%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(255, 86, 64, 1)), color-stop(37.5%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(239, 253, 73, 1)), color-stop(50%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(255, 127, 80, 1)), color-stop(62.5%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(155, 48, 255, 1)), color-stop(75%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(53, 214, 153, 1)), color-stop(87.5%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)), color-stop(100%, rgba(246, 178, 107, 1)));"
}
var link=window.document.createElement("link");link.rel="stylesheet",link.type="text/css",link.href='data:text/css,.container-flex > [class*="vspan"], .container-flex > div{background-size:contain;background-repeat: no-repeat;}.padding-s-bottom > span.gray{ font-style: italic;font-weight: 700;color: %23666;}.modal-dialog{ width: 811px;margin: 5px auto;}.modal-body {position: relative;padding: 7px;padding-bottom:2px;}.form-control-static {padding-top: 0px;font-size: 10px;}%23msg {height: 75px;font-size: 11.7px;background-color: rgba(255,255,255,0.70);margin-top: -10px;}.scroll-panel {height: 437px; padding: 2px 0;margin-top: 2px;}.form-group {margin-bottom: 5px;font-size: 12.2px;}.modal-footer {padding: 4px;padding-top: 2px;}li.list-group-item > b {font-size: 10px;position: absolute;right: 11px;top: -2px;color: %23bdbdbd;}.list-group-item {padding: 7px 10px;}li.list-group-item > div.gray {color: %235E5E5E;}.container-app {margin: -20px -11px;}.navbar {margin-top: -7.5px;}%23content > div:nth-child(1) {margin-top: 40px;opacity: 0.52;}%23content {margin-top: -35px;}.car-images .content {background: rgba(0,0,0,0.77);}.navbar-default .navbar-nav > .active > a {border-width: 13px;padding-top: 4px;padding-bottom: 0px;}.container-flex-horizontal .separate-left {margin-top: 0px!important;}.container-filters {padding-bottom: 0px;z-index: 99999;}div.modal-dialog > .modal-content {background-color: rgba(255,255,255,0.67);}',document.getElementsByTagName("HEAD")[0].appendChild(link),$("select").change(flxfunc),document.addEventListener("DOMContentLoaded",setTimeout(flxfunc),350);
