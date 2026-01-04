// ==UserScript==
// @name         PHP.net redirect to english
// @namespace    https://greasyfork.org/en/scripts/40797-php-net-redirect-to-english
// @version      0.3.2
// @description  redirects to English version of the documentation
// @author       adamaru
// @match        http://php.net/manual/*
// @match        https://php.net/manual/*
// @match        http://*.php.net/manual/*
// @match        https://*.php.net/manual/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/40797/PHPnet%20redirect%20to%20english.user.js
// @updateURL https://update.greasyfork.org/scripts/40797/PHPnet%20redirect%20to%20english.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const url = window.location.href;
    const regex = /(https?:\/\/(?:[^\.]+\.)?php\.net\/manual\/)([^\/]+)(\/.*)/gm;
    const match = regex.exec(url);

    if(!match){
        return;
    }

    if(match[2] === 'en'){
        return;
    }

    const newUrl = match[1] + 'en' + match[3];
    window.location.replace(newUrl);
})();