// ==UserScript==
// @name         translatorTest
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  translate from japanise to chinese use translate
// @author       Rexkny
// @license      MIT
// @match        */1.RpgxViewer/index.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/translate@1/translate.min.js
// @downloadURL https://update.greasyfork.org/scripts/511651/translatorTest.user.js
// @updateURL https://update.greasyfork.org/scripts/511651/translatorTest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const translatedTextBox = document.createElement("div")
    translatedTextBox.innerText = "翻译内容将在下方显示："
    translatedTextBox.style.color = 'white'
    const translateSpan = document.createElement("span")
    translateSpan.style.display = 'block'
    const contentWrap = document.querySelector('#body-wrapper')
    contentWrap.appendChild(translatedTextBox)
    translatedTextBox.appendChild(translateSpan)
    const doTranslate = (strTobeTranslated, targetDom, sourceLanguage, targetLanguage) => {
        const options = {}
        options.engine = 'google'; // 使用Google翻译
        options.from = sourceLanguage || 'ja'; // 源语言为日语
        options.to = targetLanguage || 'zh'; // 目标语言为中文
        options.cache = 2000; // 请求时长2000ms

        translate(strTobeTranslated, options).then(res => {
            translateSpan.innerText = res
        })
    }
    // 获取场景父元素
    var scenceView = document.querySelector('#scene-viewer')
    const config = { childList: true, subtree: true };
    const callback = (mutationsList) => { // 父元素更新时获取对话框文本
        const textBox = document.querySelector('.text-box-text')
        if (textBox && textBox.innerText) {
            const formattedText = textBox.innerText.replace(/[\r\n]+/g, '')
            doTranslate(textBox.innerText, textBox)
        }
    }
    const textBoxObserver = new MutationObserver(callback);
    textBoxObserver.observe(scenceView, config);
    document.addEventListener('beforeunload', () => {
        textBoxObserver.disconnect()
    })
})();