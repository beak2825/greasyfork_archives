// ==UserScript==
// @name         PHP.net redirect to chinese
// @namespace    https://greasyfork.org/en/scripts/40797-php-net-redirect-to-chinese
// @version      0.0.2
// @description  redirects to Chinese version of the documentation
// @author       NellPoi
// @match        *www.php.net/manual/en*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432218/PHPnet%20redirect%20to%20chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/432218/PHPnet%20redirect%20to%20chinese.meta.js
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

    if(match[2] === 'zh'){
        return;
    }

    const newUrl = match[1] + 'zh' + match[3];
    window.location.replace(newUrl);
})();