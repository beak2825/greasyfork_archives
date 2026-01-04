// ==UserScript==
// @name         Google整页翻译
// @namespace    https://greasyfork.org/zh-CN/users/
// @version      1.0
// @description  调用Google API进行整页翻译
// @author       Cirno9-dev
// @license      GPL-3.0-only
// @match        http://*/*
// @include      https://*/*
// @include      file://*/*
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438274/Google%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438274/Google%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function addNewElement(innerhtml,node,src) {
        var element = document.createElement(node);
        if(src){
            element.src = innerhtml;
        }else{
            element.innerHTML = innerhtml;
        }
        document.getElementsByTagName('head')[0].appendChild(element);
    }
    if (/en/.test(document.documentElement.lang)) {

        var google_translate_element = document.createElement('div');
        google_translate_element.id = 'google_translate_element';
        google_translate_element.style = 'position:fixed; bottom:5px; right:5px; cursor:pointer;Z-INDEX: 99999;opacity:0.8;';
        document.documentElement.appendChild(google_translate_element);

        var gtehtml="function googleTranslateElementInit() {" +
            "new google.translate.TranslateElement({" +
            "autoDisplay: false,"+
            "layout: google.translate.TranslateElement.InlineLayout.SIMPLE," +
            "multilanguagePage: true," +
            "pageLanguage: 'auto'," +
            "includedLanguages: 'zh-CN,zh-TW,en'" +
            "}, 'google_translate_element');}";
        addNewElement(gtehtml,'script',false);
        addNewElement('https://cdn.jsdelivr.net/gh/zs6/gugefanyijs@1.9/element.js','script',true);
        addNewElement(".goog-te-banner-frame{display:none}","style",false);
    }
}());