// ==UserScript==
// @name           Skip "Need anything else?" page
// @name:ja        「他に何か必要ですか？」画面をスキップ
// @namespace      https://github.com/zknx
// @icon           https://www.amazon.com/favicon.ico
// @version        1.2
// @description    Skip the "Need anything else?" page by changing the cart proceed button destination
// @description:ja カート画面上のボタンの遷移先を変えることで「他に何か必要ですか？」画面をスキップ
// @author         zknx
// @match          https://www.amazon.*/gp/cart*
// @match          https://www.amazon.*/cart*
// @downloadURL https://update.greasyfork.org/scripts/547381/Skip%20%22Need%20anything%20else%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/547381/Skip%20%22Need%20anything%20else%22%20page.meta.js
// ==/UserScript==

document.addEventListener('click', e => {
    const target = e.target;
    if (target.name === 'proceedToRetailCheckout') {
        e.preventDefault();
        window.location.href = '/checkout/entry/cart';
    }
});