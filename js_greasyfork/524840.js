// ==UserScript==
// @name         Make Chrome not Translate Code and Formula
// @name:zh-cn   让谷歌浏览器不翻译代码和公式
// @name:en      Make Chrome not Translate Code and Formula
// @description  For Google Translate, you can customize and specify tags and keywords without translating
// @author       @amormaid
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description:zh-cn 针对谷歌翻译，可以自定义指定标签、关键词不翻译
// @description:en  For Google Translate, you can customize and specify tags and keywords without translating
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524840/Make%20Chrome%20not%20Translate%20Code%20and%20Formula.user.js
// @updateURL https://update.greasyfork.org/scripts/524840/Make%20Chrome%20not%20Translate%20Code%20and%20Formula.meta.js
// ==/UserScript==




(function () {
    'use strict'

    console.log('not translate ready!');
    const root = document.getElementsByTagName('html')[0];
    root.classList.remove('notranslate');
    root.removeAttribute('translate');

    let action_id = undefined
    function setNotTranslate() {
        const list = [
            ...(document.getElementsByTagName("math") || []),
            ...(document.getElementsByTagName("svg") || []),
            ...(document.getElementsByTagName("tex-math") || []),
            ...(document.getElementsByClassName("MathJax"))
        ];
        Array.from(list).forEach(e => e.classList.add('notranslate'));
        Array.from(list).forEach(e => e.setAttribute('translate', 'no'));
        console.log('not translate complete')
    }
    action_id = setTimeout(setNotTranslate, 500);

    const observerOptions = {
        childList: true,
        subtree: true,
    };

    const observer = new MutationObserver((records, observer) => {
        for (const record of records) {
            // console.log('record is ', record.target.tagName )
            if (["math","svg","tex-math"].includes(record.target.tagName.toLowerCase()) || ["MathJax"].some(class_name => record.target.classList.contains(class_name))) {
                action_id && clearTimeout(action_id)
                action_id = setTimeout(setNotTranslate, 500);
            }

        }
    });
    observer.observe(document.body, observerOptions);



})();