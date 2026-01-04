// ==UserScript==
// @name         最后纪元切换中文脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  页面加载的时候同时切换到中文界面
// @author       Jia
// @match        *://*.lastepochtools.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lastepochtools.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489520/%E6%9C%80%E5%90%8E%E7%BA%AA%E5%85%83%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489520/%E6%9C%80%E5%90%8E%E7%BA%AA%E5%85%83%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function changeLang(lang) {
    window.localStorage.setItem('__tolgee_currentLanguage', lang);
    window.le_changeLangI18N(lang);
    window.navigation.reload();
}

(function() {
    'use strict';

    const htmlLang = document.documentElement.lang;
    const currentLanguage = window.localStorage.getItem('__tolgee_currentLanguage');

    if(htmlLang === 'en' && currentLanguage === 'zh') {
        changeLang('en');
        return;
    }

    const languages = [
        {
            text: '英文',
            value: 'en',
        },
        {
            text: '中文',
            value: 'zh',
        },
    ];

    const container = document.createElement('div');
    container.id = 'lastepochtools-lang-change';
    container.style.position = 'absolute';
    container.style.top = '40px';
    container.style.right = '20px';
    container.style.padding = '2px 4px';
    container.style.borderRadius = '2px';
    container.style.background = 'white';
    container.style.fontFamily = 'Linbiolinum';
    container.style.fontSize = '1.05em';

    const label = document.createElement('label');
    label.for = 'lastepochtools-lang-change-selector'
    label.textContent = '切换页面语言';
    container.appendChild(label);

    const selector = document.createElement('select');
    selector.id = 'lastepochtools-lang-change-selector';
    selector.placeholder = '请选择展示的语言';
    selector.style.marginLeft = '4px';

    function onChange() {
        const selectedOption = selector.options[selector.selectedIndex];
        changeLang(selectedOption.value);
    }

    for (const lang of languages) {
        const option = document.createElement('option');
        option.classList.add('script-language-option');
        option.value = lang.value;
        option.textContent = lang.text;

        if (lang.value === currentLanguage) {
            option.disabled = true;
            option.selected = true;
        }

        selector.appendChild(option);
    }

    selector.addEventListener('change', onChange);

    container.appendChild(selector);
    document.body.appendChild(container);
})();