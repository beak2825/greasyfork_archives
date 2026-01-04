// ==UserScript==
// @name         ykt100
// @namespace    
// @version      0.1.1
// @description  盐课堂控制台
// @author       burgess
// @match        https://www.ykt100.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412213/ykt100.user.js
// @updateURL https://update.greasyfork.org/scripts/412213/ykt100.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src = 'https://cdn.bootcdn.net/ajax/libs/vConsole/1.0.1/vconsole.min.js'
    new VConsole();
})();
