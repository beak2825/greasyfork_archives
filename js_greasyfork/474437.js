// ==UserScript==
// @name         カロリーSlism 栄養コピペ
// @namespace    https://greasyfork.org/users/5795
// @version      0.2
// @description カロリーSlismのカロリーと三大栄養素をSpreadsheet用の形式でコピーします
// @author       ikeyan
// @license MIT
// @match        https://calorie.slism.jp/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slism.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474437/%E3%82%AB%E3%83%AD%E3%83%AA%E3%83%BCSlism%20%E6%A0%84%E9%A4%8A%E3%82%B3%E3%83%94%E3%83%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474437/%E3%82%AB%E3%83%AD%E3%83%AA%E3%83%BCSlism%20%E6%A0%84%E9%A4%8A%E3%82%B3%E3%83%94%E3%83%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const labels = document.querySelectorAll('#mainData>table>tbody>tr>td.label');
    if (labels.length === 0) return;
    const labelToValueMap = new Map();
    for (const $label of labels) {
        const label = $label.textContent;
        const $value = $label.nextElementSibling
        const value = $value.textContent;
        labelToValueMap.set(label.trim(), value.trim());
    }
    const getValue = (name, suffix) => {
        const value = labelToValueMap.get(name);
        if (value === undefined || !value.endsWith(suffix)) {
            return undefined;
        }
        return value.slice(0, value.length - suffix.length).trim();
    };
    const calories = getValue('エネルギー', 'kcal');
    const protein = getValue('タンパク質', 'g');
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

    const $mainData = document.querySelector('#mainData');
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
    $mainData.before($copyButton);
})();