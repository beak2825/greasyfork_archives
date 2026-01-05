// ==UserScript==
// @name         Laravel Docs Sidebar Expander
// @namespace    https://tendian.io/
// @version      0.1
// @description  Expand all categories in the Laravel docs sidebar automatically
// @author       You
// @match        https://laravel.com/docs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29081/Laravel%20Docs%20Sidebar%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/29081/Laravel%20Docs%20Sidebar%20Expander.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $('.sidebar li h2').addClass('is-active');
})();