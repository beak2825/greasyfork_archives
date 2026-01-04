// ==UserScript==
// @name         Screen Spoofer 16:9
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes the value of your screen resolution
// @include      *
// @author       Matthew Beres
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450609/Screen%20Spoofer%2016%3A9.user.js
// @updateURL https://update.greasyfork.org/scripts/450609/Screen%20Spoofer%2016%3A9.meta.js
// ==/UserScript==
var choice = Math.floor(Math.random() * 3);

switch(choice){
    //1920 x 1080
    case 0:
        Object.defineProperty(window.screen, "availWidth", { get: function(){return 1920; }});
        Object.defineProperty(window.screen, "width", { get: function(){return 1920; }});

        Object.defineProperty(window.screen, "availHeight", { get: function(){return 1080; }});
        Object.defineProperty(window.screen, "height", { get: function(){return 1080; }});

        Object.defineProperty(window, "innerWidth", { get: function(){return 1920; }});
        Object.defineProperty(window, "innerHeight", { get: function(){return 974; }});

        Object.defineProperty(window, "outerWidth", { get: function(){return 1920; }});
        Object.defineProperty(window, "outerHeight", { get: function(){return 1040; }});

        Object.defineProperty(window, "devicePixelRatio", { get: function(){return 1; }});
    break;
    //1366 x 768
    case 1:
        Object.defineProperty(window.screen, "availWidth", { get: function(){return 1366; }});
        Object.defineProperty(window.screen, "width", { get: function(){return 1366; }});

        Object.defineProperty(window.screen, "availHeight", { get: function(){return 768; }});
        Object.defineProperty(window.screen, "height", { get: function(){return 768; }});

        Object.defineProperty(window, "innerWidth", { get: function(){return 1366; }});
        Object.defineProperty(window, "innerHeight", { get: function(){return 662; }});

        Object.defineProperty(window, "outerWidth", { get: function(){return 1366; }});
        Object.defineProperty(window, "outerHeight", { get: function(){return 728; }});

        Object.defineProperty(window, "devicePixelRatio", { get: function(){return 1; }});
    break;
    //1536 x 864
    case 2:
        Object.defineProperty(window.screen, "availWidth", { get: function(){return 1536; }});
        Object.defineProperty(window.screen, "width", { get: function(){return 1536; }});

        Object.defineProperty(window.screen, "availHeight", { get: function(){return 864; }});
        Object.defineProperty(window.screen, "height", { get: function(){return 864; }});

        Object.defineProperty(window, "innerWidth", { get: function(){return 1536; }});
        Object.defineProperty(window, "innerHeight", { get: function(){return 750; }});

        Object.defineProperty(window, "outerWidth", { get: function(){return 1536; }});
        Object.defineProperty(window, "outerHeight", { get: function(){return 824; }});

        Object.defineProperty(window, "devicePixelRatio", { get: function(){return 1; }});
    break;
}