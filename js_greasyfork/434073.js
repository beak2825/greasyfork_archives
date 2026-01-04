// ==UserScript==
// @name         Broken Green Pixel
// @namespace    http://example.com
// @version      1.0
// @description  Adds a static magenta dot on every page, perfect practical joke. 
// @author       Arthur (fuj1n) Uzulin
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434073/Broken%20Green%20Pixel.user.js
// @updateURL https://update.greasyfork.org/scripts/434073/Broken%20Green%20Pixel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.styleSheets[0].addRule("html::after", "content: \"\"; background-color:  #ff00ff; width: 1px; height: 1px; position: fixed; top: 126px; right: 242px; z-index: 9999;");
})();