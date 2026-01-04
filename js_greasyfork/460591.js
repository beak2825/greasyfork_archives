// ==UserScript==
// @name         zhihu search page Wide Screen Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zhihu website search page Wide Screen Display
// @author       fvydjt
// @match        https://www.zhihu.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460591/zhihu%20search%20page%20Wide%20Screen%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/460591/zhihu%20search%20page%20Wide%20Screen%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let ele = document.querySelector('.css-knqde');
    ele.outerHTML = '';
    let css=`
        .SearchMain {
            width: 1000px !important;
        }
    `;
    GM_addStyle(css);
})();