// ==UserScript== 
// @name Googleç½‘é¡µç¿»è¯‘ 
// @namespace https://greasyfork.org/zh-CN/users/150560 
// @version 1.1 
// @description ä¸�è·³è½¬Googleç¿»è¯‘é¡µé�¢çš„æ•´é¡µç¿»è¯‘ // @author ç”°é›¨è�² 
// @match http://*/* 
// @include https://*/* 
// @include file://*/* 
// @run-at document-end 
// @downloadURL https://update.greasyfork.org/scripts/391084/Google%C3%A7%C2%BD%E2%80%98%C3%A9%C2%A1%C2%B5%C3%A7%C2%BF%C2%BB%C3%A8%C2%AF%E2%80%98.user.js
// @updateURL https://update.greasyfork.org/scripts/391084/Google%C3%A7%C2%BD%E2%80%98%C3%A9%C2%A1%C2%B5%C3%A7%C2%BF%C2%BB%C3%A8%C2%AF%E2%80%98.meta.js
// ==/UserScript==


(function () { 'use strict'; var userLang = document.documentElement.lang; if (userLang!=="" && userLang.substr(0, 2) != "zh") { var script = document.createElement('script'); script.src = '//translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit'; document.getElementsByTagName('head')[0].appendChild(script); var google_translate_element = document.createElement('div'); google_translate_element.id = 'google_translate_element'; google_translate_element.style = 'position:fixed; bottom:10px; right:10px; cursor:pointer;'; document.documentElement.appendChild(google_translate_element); script = document.createElement('script'); script.innerHTML = "function googleTranslateElementInit() {" + "new google.translate.TranslateElement({" + "layout: google.translate.TranslateElement.InlineLayout.SIMPLE," + "multilanguagePage: true," + "pageLanguage: 'auto'," + "includedLanguages: 'zh-CN,zh-TW,en'" + "}, 'google_translate_element');}"; document.getElementsByTagName('head')[0].appendChild(script); } })();