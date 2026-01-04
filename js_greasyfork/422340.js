// ==UserScript==
// @name           AtCoder Customtest Keyboard Shortcut
// @version        0.1
// @description    AtCoder のコードテストを Ctrl+Enter で実行できるようにします
// @license        MIT
// @include        https://atcoder.jp/contests/*/custom_test*
// @supportURL     https://twitter.com/linuxmetel
// @namespace https://greasyfork.org/users/741480
// @downloadURL https://update.greasyfork.org/scripts/422340/AtCoder%20Customtest%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/422340/AtCoder%20Customtest%20Keyboard%20Shortcut.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey||event.metaKey)&&event.keyCode==13){
            vueCustomTest.submit();
        }
    }, false);
})();