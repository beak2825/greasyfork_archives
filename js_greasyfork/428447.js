// ==UserScript==
// @name         cmatc reload
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  cmatc定时重载
// @author       minhill
// @include        http://www.cmatc.cn/lms/app/lms/student/Learn/enterUrl.do*
// @icon         https://www.google.com/s2/favicons?domain=cmatc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428447/cmatc%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/428447/cmatc%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function reload(){
        window.onbeforeunload = '';
        window.location.href=window.location.href;
        window.location.reload;
    }
    setTimeout(reload, 2000000 );

    // Your code here...
})();