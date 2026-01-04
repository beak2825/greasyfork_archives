// ==UserScript==
// @name           るる鯖発言ショートカット
// @version        1.0
// @description    Ctrl+Enterで発言できるようになるやつ
// @author         keymoon
// @license        MIT
// @include        https://ruru-jinro.net/village.jsp
// @namespace      https://twitter.com/kymn_
// @downloadURL https://update.greasyfork.org/scripts/391475/%E3%82%8B%E3%82%8B%E9%AF%96%E7%99%BA%E8%A8%80%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/391475/%E3%82%8B%E3%82%8B%E9%AF%96%E7%99%BA%E8%A8%80%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey||event.metaKey)&&event.keyCode==13){
            todo();
        }
    }, false);
})();