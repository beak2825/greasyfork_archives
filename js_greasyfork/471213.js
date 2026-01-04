// ==UserScript==

// @name         poe国内访问
// @namespace    https://poe.com
// @version      1.1
// @description  科技让教育更美好
// @author       Praise
// @match        https://poe.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471213/poe%E5%9B%BD%E5%86%85%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/471213/poe%E5%9B%BD%E5%86%85%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const originalFloor = Math.floor;
    Math.floor = function(num) {
        if(num<999999 & num>10000){
            return 167103;
        }
        return originalFloor.apply(this, arguments);
    }

})();