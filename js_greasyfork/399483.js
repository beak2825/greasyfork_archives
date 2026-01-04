// ==UserScript==
// @name         黑白
// @namespace    http://www.wxy1343.tk/
// @version      0.1
// @description  网页黑白
// @author       wxy
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399483/%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/399483/%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    GM_addStyle ( `
    html {
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        -webkit-filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
    }
`);
})();

function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}