// ==UserScript==
// @name        Screen Resolution Spoof
// @namespace   r-a-y/browser/screen
// @description Alters attempts at fingerprinting your screen resolution to 1920x1080. Only tested in FIrefox.
// @include     *
// @version     1.1.4
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/29352/Screen%20Resolution%20Spoof.user.js
// @updateURL https://update.greasyfork.org/scripts/29352/Screen%20Resolution%20Spoof.meta.js
// ==/UserScript==

Object.defineProperty(window.screen, "availWidth", { get: function(){return 1920; }});
Object.defineProperty(window.screen, "width", { get: function(){return 1920; }});

Object.defineProperty(window.screen, "availHeight", { get: function(){return 1080; }});
Object.defineProperty(window.screen, "height", { get: function(){return 1080; }});

Object.defineProperty(window, "innerWidth", { get: function(){return 1920; }});
Object.defineProperty(window, "innerHeight", { get: function(){return 974; }});

Object.defineProperty(window, "outerWidth", { get: function(){return 1920; }});
Object.defineProperty(window, "outerHeight", { get: function(){return 1040; }});

Object.defineProperty(window, "devicePixelRatio", { get: function(){return 1; }});