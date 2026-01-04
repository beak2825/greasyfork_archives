// ==UserScript==
// @name         刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38007/%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/38007/%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(()=>{
    location.reload();
},1000)
    // Your code here...
})();