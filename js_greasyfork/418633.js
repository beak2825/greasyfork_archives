// ==UserScript==
// @name           AtCoder CustomTest Run Shortcut
// @name:ja        AtCoderカスタムテスト実行ショートカット
// @namespace      https://greasyfork.org/ja/users/570127
// @version        2025.12.25.0
// @description    You can run by using Ctrl + Enter in Custom Test of AtCoder
// @description:ja AtCoderのコードテストにおいてCtrl+Enterで実行ができるようになります。Macは、⌘+Enterも。
// @author         universato
// @grant          none
// @match          https://atcoder.jp/contests/*/custom_test
// @match          https://atcoder.jp/contests/*/custom_test*
// @license        MIT
// @supportURL     https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/418633/AtCoder%20CustomTest%20Run%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/418633/AtCoder%20CustomTest%20Run%20Shortcut.meta.js
// ==/UserScript==

console.log(`[UserScript] AtCoder CustomTest Run Shortcut`);

(function() {
    let runButton;

    const buttons = document.querySelectorAll('a.btn.btn-primary');
    for(let button of buttons){
        if(button.innerText.match(/^(Run|実行)$/)){
            runButton = button;
            runButton.innerHTML += ' <small>(Ctrl + Enter)</small>';
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.altKey || event.shiftKey) return;
        if (event.isComposing) return;
        if (event.repeat) return;

        // Mac: control -> ctrlKey, command -> metaKey
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter'){
            runButton?.click();
        }
    });
})();
