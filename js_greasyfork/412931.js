// ==UserScript==
// @name         妮可动漫工具
// @namespace    
// @version      0.2
// @description  remove nav element
// @author       cut_hand
// @match        http://www.nicotv.club/
// @match        http://www.nicotv.me/

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412931/%E5%A6%AE%E5%8F%AF%E5%8A%A8%E6%BC%AB%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/412931/%E5%A6%AE%E5%8F%AF%E5%8A%A8%E6%BC%AB%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let ad = document.querySelectorAll('.ff-bg')
    console.log(ad)
    ad[0].remove()

})();