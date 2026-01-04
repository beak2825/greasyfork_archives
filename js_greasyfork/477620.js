// ==UserScript==
// @name         ShowTitle
// @namespace    ShowTitle
// @version      0.1
// @description  Show Title
// @author       rayfish
// @match        https://aliexpress.ru/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/477620/ShowTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/477620/ShowTitle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Title = document.createElement("h1");
    Title.textContent = document.title;
    document.body.prepend(Title);
})();