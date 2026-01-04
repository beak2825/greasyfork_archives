// ==UserScript==
// @name         Внешний вид окна с шаблонами
// @version      0.5
// @description  ///
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkb/Dkvu
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkb/*
// @include	 https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @include	 https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/371999/%D0%92%D0%BD%D0%B5%D1%88%D0%BD%D0%B8%D0%B9%20%D0%B2%D0%B8%D0%B4%20%D0%BE%D0%BA%D0%BD%D0%B0%20%D1%81%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/371999/%D0%92%D0%BD%D0%B5%D1%88%D0%BD%D0%B8%D0%B9%20%D0%B2%D0%B8%D0%B4%20%D0%BE%D0%BA%D0%BD%D0%B0%20%D1%81%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

var sheet = document.createElement('style');
sheet.innerHTML = '.container-flex > [class*="vspan"], .container-flex > div{background-size:contain;background-repeat: no-repeat;}.padding-s-bottom > span.gray{ font-style: italic;font-weight: 700;color: %23666;}.modal-dialog{ width: 811px;margin: 5px auto;}.modal-body {position: relative;padding: 7px;padding-bottom:2px;}.form-control-static {padding-top: 0px;font-size: 10px;}%23msg {height: 75px;font-size: 11.7px;background-color: rgba(255,255,255,0.70);margin-top: -10px;}.scroll-panel {height: 437px; padding: 2px 0;margin-top: 2px;}.form-group {margin-bottom: 5px;font-size: 12.2px;}.modal-footer {padding: 4px;padding-top: 2px;}li.list-group-item > b {font-size: 10px;position: absolute;right: 11px;top: -2px;color: %23bdbdbd;}.list-group-item {padding: 7px 10px;}li.list-group-item > div.gray {color: %235E5E5E;}.container-app {margin: -20px -11px;}.navbar {margin-top: -7.5px;}%23content > div:nth-child(1) {margin-top: 40px;opacity: 0.52;}%23content {margin-top: -35px;}.car-images .content {background: rgba(0,0,0,0.77);}.navbar-default .navbar-nav > .active > a {border-width: 13px;padding-top: 4px;padding-bottom: 0px;}.container-flex-horizontal .separate-left {margin-top: 0px!important;}.container-filters {padding-bottom: 0px;z-index: 99999;}div.modal-dialog > .modal-content {background-color: rgba(255,255,255,0.67);}'
document.body.appendChild(sheet);