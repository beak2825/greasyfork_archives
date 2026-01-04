// ==UserScript==
// @name         Sci-Hub Sidebar Remover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the Sci-Hub Sidebar when viewing an article
// @author       tatianabasileus
// @include      *://sci-hub.*/*
// @grant        https
// @downloadURL https://update.greasyfork.org/scripts/412001/Sci-Hub%20Sidebar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/412001/Sci-Hub%20Sidebar%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('article').style.marginLeft = 0;
})();