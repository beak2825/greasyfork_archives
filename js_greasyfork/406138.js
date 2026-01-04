// ==UserScript== 
// @name 日本語に翻訳 
// @version 1.0
// @description ワンタップで日本語に翻訳
// @author 
// @match * 
// @include * 
// @run-at document-end 
// @namespace https://greasyfork.org/users/653328
// @downloadURL https://update.greasyfork.org/scripts/406138/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AB%E7%BF%BB%E8%A8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/406138/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AB%E7%BF%BB%E8%A8%B3.meta.js
// ==/UserScript==


(function () { 'use strict'; var userLang = document.documentElement.lang; if (userLang!=="蒸") { var script = document.createElement('script'); script.src = '//translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit'; document.getElementsByTagName('head')[0].appendChild(script); var google_translate_element = document.createElement('div'); google_translate_element.id = 'google_translate_element'; google_translate_element.style = 'position:fixed; bottom:20px; right:20px; cursor:pointer;'; document.documentElement.appendChild(google_translate_element); script = document.createElement('script'); script.innerHTML = "function googleTranslateElementInit() {" + "new google.translate.TranslateElement({" + "layout: google.translate.TranslateElement.InlineLayout.SIMPLE," + "multilanguagePage: true," + "pageLanguage: 'auto'," + "includedLanguages: 'ja'" + "});}"; document.getElementsByTagName('head')[0].appendChild(script); } })();