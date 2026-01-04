// ==UserScript==
// @name         eln-auto-click
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  eln auto click
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @match http://eln.izuche.com/kng/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448771/eln-auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/448771/eln-auto-click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        console.log('listening');
        var a = document.getElementById('reStartStudy');
        console.log(a);
        if(a){
            console.log('auto click');
            myMousedown = true;
            a.click();
        }
    }, 10 * 1000);
})();