// ==UserScript==
// @name         Shut Up Posener
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hides articles from Alan Posener on zeit.de
// @author       leserbrief
// @match        https://www.zeit.de/*
// @icon         https://www.google.com/s2/favicons?domain=zeit.de
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @resource     IMPORTED_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427458/Shut%20Up%20Posener.user.js
// @updateURL https://update.greasyfork.org/scripts/427458/Shut%20Up%20Posener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    let articles = Array.from(document.getElementsByTagName('span'))
                   .filter(e => e.innerText.includes('Alan Posener'));
    articles.forEach(e => { e.closest('article').style.display = 'none'});

    if (articles.length > 0) {
        Toastify({
            text: "🤐",
            duration: 2000,
            gravity: "top",
            position: "right",
            newWindow: true,
            backgroundColor: "linear-gradient(90deg, rgba(0,199,147,1) 0%, rgba(0,212,255,1) 100%)",
        }).showToast();
    }

    //© 2021
})();