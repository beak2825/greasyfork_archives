// ==UserScript==
// @name         Clear symfony documentation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This US clear symfony documentation from garbage, advertisment, banners
// @author       You
// @match        https://symfony.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446412/Clear%20symfony%20documentation.user.js
// @updateURL https://update.greasyfork.org/scripts/446412/Clear%20symfony%20documentation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#sln').remove();
    document.querySelector('.doc-header-container').remove();
    document.querySelector('.highlight-top-horizontal').remove();
    document.querySelector('.doc-sidebar-highlight').remove();
    document.querySelector('body').style = 'padding-top:0px;margin-top:0px;';
    document.querySelector('#ukraine-message').remove();
    document.querySelector('footer').remove();
    document.querySelector('.doc-content-embedded-sidebar').remove();
    document.querySelector('.ui-prose').style = 'max-width: inherit;'
})();




