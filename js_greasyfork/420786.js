// ==UserScript==
// @name         nuget.org to fuget.org
// @namespace    https://github.com/nordinrahman/
// @version      0.3
// @description  Add link to fuget.org from nuget.org page
// @author       Nordin Rahman
// @copyright    2021, Nordin Rahman
// @license      MIT license (MIT)
// supportURL    https://github.com/nordinrahman/userscript/issues
// @match        https://www.nuget.org/packages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420786/nugetorg%20to%20fugetorg.user.js
// @updateURL https://update.greasyfork.org/scripts/420786/nugetorg%20to%20fugetorg.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    var listItem = $('<li>');

    $('<i>')
        .addClass('ms-Icon ms-Icon--Globe')
        .attr('aria-hidden', true)
        .appendTo(listItem)
    ;

    $('<a>')
        .attr("href", document.URL.toString().replace("://www.nuget.org/", "://www.fuget.org/"))
        .attr('rel', 'nofollow')
        .attr("target", "_blank")
        .attr("title", "Visit nuget package browser combined with an API browser")
        .text("Open in fuget.org")
        .appendTo(listItem)
    ;

    $('.package-details-info>ul:first').append(listItem);
})(window.jQuery);
