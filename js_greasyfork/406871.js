// ==UserScript==
// @name         网页分屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Split the Page | 网页分屏展示
// @author       Lynn Speng
// @match        http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406871/%E7%BD%91%E9%A1%B5%E5%88%86%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406871/%E7%BD%91%E9%A1%B5%E5%88%86%E5%B1%8F.meta.js
// ==/UserScript==

(function() {

    document.onkeydown = function(event) {
    var key = event.key;
    var ctrlKey = event.ctrlKey || event.metaKey;
     // 快捷键 Ctrl + `
    if(ctrlKey && key === '`') {
        document.write('<HTML><HEAD></HEAD><FRAMESET COLS=\'50%25,*\'><FRAME SRC=' + location.href + '><FRAME SRC=' + location.href + '></FRAMESET></HTML>');
    }
}
})();