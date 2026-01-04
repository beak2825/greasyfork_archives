// ==UserScript==
// @name         BDO codex only two langs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Switch between ru and eng versions with ease
// @author       You
// @match        https://bdocodex.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bdocodex.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/457840/BDO%20codex%20only%20two%20langs.user.js
// @updateURL https://update.greasyfork.org/scripts/457840/BDO%20codex%20only%20two%20langs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let path = window.location.pathname
    let switchTo = "ru"
    if (path.includes("ru")) {
        switchTo = "en"
    }

    const rex = /\/(en|us|ru)\//
    path = path.replace(rex, '/' + switchTo + '/')


    const el = document.querySelector(".navbar-nav.nav > li.dropdown.nav-item")
    console.log(el)
    const target = el.parentElement
    const newLink = document.createElement("a")
    newLink.href = path
    newLink.innerText = switchTo.toUpperCase()
    newLink.className = "nav-link fs-3"

    target.replaceChild(newLink, el)
})();