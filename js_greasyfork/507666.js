// ==UserScript==
// @name         kontrolnaya-rabota.ru adbypass 
// @version      0
// @description  обход кнопки поделится 
// @author       TOOM_TYM
// @match        *://*.kontrolnaya-rabota.ru/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kontrolnaya-rabota.ru
// @license      MIT
// @namespace https://greasyfork.org/users/1184281
// @downloadURL https://update.greasyfork.org/scripts/507666/kontrolnaya-rabotaru%20adbypass.user.js
// @updateURL https://update.greasyfork.org/scripts/507666/kontrolnaya-rabotaru%20adbypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.cookie.includes("visit_info__share_complete")) {
        console.log("not bypassed")
        const a = setInterval(() => {
            if (document.querySelector('.blurred-block')) {
                document.cookie = "visit_info__share_complete=true; domain=www.kontrolnaya-rabota.ru; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                location.reload();
                clearInterval(a)
            }
        }, 100);
    } else { console.log("already bypass") }

})();