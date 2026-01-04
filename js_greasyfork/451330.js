// ==UserScript==
// @name         Agent Spoofer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes the value of your user agent
// @include      *
// @author       Matthew Beres
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451330/Agent%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/451330/Agent%20Spoofer.meta.js
// ==/UserScript==
var choice = Math.floor(Math.random() * 4);

switch(choice){
    //windows 8 edge
    case 0:
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.25'; }
        });
    break;
    //windows xp ie
    case 1:
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 5.1; WOW64; Trident/7.0; rv:11.0) like Gecko'; }
        });
    break;
    //windows vista chrome
    case 2:
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'; }
        });
    break;
    //windows 7 firefox
    case 3:
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0'; }
        });
    break;
}