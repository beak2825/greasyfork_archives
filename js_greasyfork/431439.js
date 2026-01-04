// ==UserScript==
// @name         Google网页翻译
// @namespace    https://greasyfork.org/zh-CN/users/808940
// @version      0.1
// @description  不跳转Google翻译页面的整页翻译
// @author       srczhang
// @match        http://*/*
// @include      https://*/*
// @include      file://*/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/431439/Google%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/431439/Google%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

function containsChinese(temp) {
    let re = /[^\u4e00-\u9fa5]/;
    let status = false;
    for (let index in temp) {
        if (!re.test(temp[index])) {
            status = true;
            break;
        }
    }
    return status;
}

(
    function () {
        'use strict';
        var userLang = document.documentElement.lang;

        if (userLang !== "" && userLang.substr(0, 2) != "zh" && !containsChinese(document.title)) {
            var script = document.createElement('script');
            script.src = '//translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit';
            document.getElementsByTagName('head')[0].appendChild(script);

            var google_translate_element = document.createElement('div');
            google_translate_element.id = 'google_translate_element';
            google_translate_element.style = 'position:fixed; bottom:10px; right:10px; cursor:pointer;';
            document.documentElement.appendChild(google_translate_element);

            script = document.createElement('script');
            script.innerHTML = "function googleTranslateElementInit() {" +
                "new google.translate.TranslateElement({" +
                "layout: google.translate.TranslateElement.InlineLayout.SIMPLE," +
                "multilanguagePage: true," +
                "pageLanguage: 'auto'," +
                "includedLanguages: 'zh-CN,zh-TW,en'" +
                "}, 'google_translate_element');}";
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
)();