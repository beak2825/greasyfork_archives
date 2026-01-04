// ==UserScript==
// @name         JavaScript Krieg on Toytown
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixing Toytown's broken JavaScript
// @author       You
// @match        https://www.toytowngermany.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toytowngermany.com
// @grant        none
// @license      Krieg
// @downloadURL https://update.greasyfork.org/scripts/467973/JavaScript%20Krieg%20on%20Toytown.user.js
// @updateURL https://update.greasyfork.org/scripts/467973/JavaScript%20Krieg%20on%20Toytown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.getElementsByClassName('ipsComposeArea_editor') ;
    elems[0].childNodes[1].childNodes[3].classList.remove("ipsHide") ;
    elems[0].childNodes[1].childNodes[3].childNodes[1].attributes[2].nodeValue="" ;

})();