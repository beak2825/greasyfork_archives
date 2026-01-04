// ==UserScript==
// @name         Anistar: Autoconfirm age
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Автоматически устанавливает cookie подтверждающее возраст на страницах Anistar. Полезно если не хранятся cookie.
// @author       lainverse
// @match        *://anistar.org/*
// @include      /^https?:\/\/anistar\d*(\.[a-z]{2,3}){1,2}\//
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34480/Anistar%3A%20Autoconfirm%20age.user.js
// @updateURL https://update.greasyfork.org/scripts/34480/Anistar%3A%20Autoconfirm%20age.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let age of ['14', '16', '18'])
        document.cookie = `${age}=yes`;
})();