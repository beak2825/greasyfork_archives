// ==UserScript==
// @name         云译课自动翻译脚本
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  cutting edge of the newer world
// @author       俊明王子
// @match        https://webcat-dl.iol8.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485686/%E4%BA%91%E8%AF%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485686/%E4%BA%91%E8%AF%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    document.body.classList.add('notranslate');

    let translateElm = document.createElement('div');
    translateElm.id = 'google_translate_element';
    document.body.appendChild(translateElm);

    window.googleTranslateElementInit = () =>{
        setTimeout(() => {
            let srcs = document.querySelectorAll('.source-txt');
            let targets = document.querySelectorAll('.target-txt');
            for (let i = 0; i < srcs.length; i++) {
                let src = srcs[i];
                let target = targets[i];
                if (src && target) {
                    let srcText = src.innerText;
                    target.innerText = srcText;
                    target.classList.add('translate');
                    
                }
            }
            setTimeout(() => {
                // translate all target text
                new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'zh-CN',
                    autoDisplay: false
                }, 'google_translate_element');
                var a = document.getElementById('google_translate_element');
                a.dispatchEvent(new Event('change'));
            }, 10000);
        }, 10000);
    };

    let s = document.createElement('script');
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
})();