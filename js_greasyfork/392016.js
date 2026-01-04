// ==UserScript==
// @name         Numberone Favicon
// @namespace    #1NL Scripts
// @version      0.1
// @description  Adds favicon to the N1 website
// @author       Luiz Menezes
// @match        http://numberone.com.br/*
// @match        https://numberone.com.br/*
// @grant        none
// @icon         https://online.numberone.com.br/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/392016/Numberone%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/392016/Numberone%20Favicon.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://online.numberone.com.br/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
})();