// ==UserScript==
// @name         amazon command
// @namespace    amazon command
// @version      0.2
// @description  Amazonの商品検索画面で、Amazon.jpから販売される商品のみが検索結果に表示されるようになるボタンを追加します。
// @author       meguru
// @include      https://www.amazon.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420598/amazon%20command.user.js
// @updateURL https://update.greasyfork.org/scripts/420598/amazon%20command.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createButton = (label, cmd) => {
        const button = document.createElement('button');
        if (!button) { console.log('failed create ${label}') };
        button.innerHTML = label;
        button.onclick = () => {
            window.location.href += cmd;
        };
        return button;
    }

    const refArea = document.getElementById('s-refinements');
    if (!refArea) {
        console.log('not find refArea');
        return;
    };

    const fromAmazonJpButton = createButton('from amazon.jp', '&emi=AN1VRQENFRJN5');
    let res = refArea.parentNode.insertBefore(fromAmazonJpButton, refArea);
    if (!res) {
        console.log('failed add button');
        return;
    };

    const offButton = createButton('50% off', '&pct-off=50-');
    res = refArea.parentNode.insertBefore(offButton, refArea);
    if (!res) {
        console.log('failed add button');
        return;
    };

})();