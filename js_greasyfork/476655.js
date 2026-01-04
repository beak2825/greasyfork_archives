// ==UserScript==
// @name         fatsecret 栄養コピペ
// @namespace    https://greasyfork.org/users/5795
// @version      0.1
// @description  fatsecretのカロリーと三大栄養素をSpreadsheet用の形式でコピーします
// @author       ikeyan
// @license MIT
// @match        https://www.fatsecret.jp/%E3%82%AB%E3%83%AD%E3%83%AA%E3%83%BC-%E6%A0%84%E9%A4%8A/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fatsecret.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476655/fatsecret%20%E6%A0%84%E9%A4%8A%E3%82%B3%E3%83%94%E3%83%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/476655/fatsecret%20%E6%A0%84%E9%A4%8A%E3%82%B3%E3%83%94%E3%83%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const h4s = [...document.querySelectorAll('.factPanel h4')].filter((x) => x.textContent?.includes('栄養のまとめ:'));
    if (h4s.length !== 1) return;
    const factPanel = h4s[0].closest('.factPanel');
    const labelToValueMap = new Map([...factPanel.querySelectorAll('.fact')].map((fact) => ['.factTitle', '.factValue'].map((selector) => fact.querySelector(selector).textContent.trim())));
    const getValue = (name, suffix) => {
        const value = labelToValueMap.get(name);
        if (value === undefined || !value.endsWith(suffix)) {
            return undefined;
        }
        return value.slice(0, value.length - suffix.length).trim();
    };
    const calories = getValue('カロ', '');
    const protein = getValue('たんぱく質', 'g');
    const fat = getValue('脂質', 'g');
    const carboHydrate = getValue('炭水化物', 'g');
    console.log([calories, protein, fat, carboHydrate].join('\t'));
    const sheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [sheet];
    sheet.replaceSync(`
    #copyButton {
        display: block;
        position: relative;
    }
    #copyButton.clicked::after {
        content: '✓';
        display: 'block';
        position: absolute;
        animation-name: clicked;
        animation-duration: 1.5s;
        animation-iteration-count: 1;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
    @-webkit-keyframes clicked {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    `);
    const $copyButton = document.createElement('button');
    $copyButton.textContent = 'COPY';
    $copyButton.id = 'copyButton';
    $copyButton.addEventListener('click', e => {
        $copyButton.classList.add('clicked');
        navigator.clipboard.writeText("={" + [calories, protein, fat, carboHydrate].join(',') + "}");
    });
    $copyButton.addEventListener("animationend", (ev) => {
        if (ev.animationName === 'clicked') {
            $copyButton.classList.remove('clicked');
        }
    });
    factPanel.before($copyButton);
})();