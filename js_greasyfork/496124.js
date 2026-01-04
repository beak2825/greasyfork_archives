// ==UserScript==
// @name         illusiondiffusionweb
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  illusiondiffusionweb login
// @author       newwbbie
// @license      MIT
// @match        https://illusiondiffusionweb.com/*
// @match        https://illusiondiffusionweb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=illusiondiffusionweb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496124/illusiondiffusionweb.user.js
// @updateURL https://update.greasyfork.org/scripts/496124/illusiondiffusionweb.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    var task = 2;
    let ready = setInterval(function () {
        if (document.querySelector('.Modal-closeButton')) {
            document.querySelector('.Modal-closeButton').click();
            task--;
        }
        var divs = document.querySelectorAll("body > div:not([class]):not([id]):not([style]) > div:not([class]):not([id]):not([style]) > *[class^='css-']");
        if(divs.length > 0) {
            task--;
        }
        for(var i = 0; i < divs.length; i++) {
            divs[i].remove();
        }
        if(task == 0) {
            clearInterval(ready);
        }
    }, 100);
})();