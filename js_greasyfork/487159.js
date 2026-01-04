// ==UserScript==
// @name elespanol.com
// @namespace anonDeveloper
// @version 1.0
// @license MIT
// @include https://elespanol.com
// @description This script remove the elespanol.com ad's
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// https://gist.github.com/tylerdukedev/d0b3fbacb37897da2af58c1d91a7f36c
// block in your adblock https://s1.eestatic.com/eprivacy/ddf34e44-5386-4edd-8cfd-41b236983182/loader.js
// @downloadURL https://update.greasyfork.org/scripts/487159/elespanolcom.user.js
// @updateURL https://update.greasyfork.org/scripts/487159/elespanolcom.meta.js
// ==/UserScript==

(function removeElementsByClass(className) {
    'use strict';
    className = 'adv' ;
   
    var elementToRemove = document.getElementsByClassName(className);
    while(true){
        elementToRemove[0].parentNode.removeChild(elementToRemove[0]);
    }
})();
