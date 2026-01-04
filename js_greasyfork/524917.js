// ==UserScript==
// @name         Rutor .org → .info redirect
// @license      MIT
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.0
// @description  Автоматический редирект с rutor.org на rutor.info
// @author       Титан
// @match        https://rutor.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524917/Rutor%20org%20%E2%86%92%20info%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/524917/Rutor%20org%20%E2%86%92%20info%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Редиректим на rutor.info
    if (window.location.hostname === 'rutor.org') {
        window.location.href = window.location.href.replace('rutor.org', 'rutor.info');
    }
})();
