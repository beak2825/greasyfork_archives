// ==UserScript==
// @name               ph去除vk限制
// @version            1.0
// @include            http*://*.pornhub.com/*
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @description        解除ruvds访问ph的vk验证

// @namespace https://greasyfork.org/users/164673
// @downloadURL https://update.greasyfork.org/scripts/390557/ph%E5%8E%BB%E9%99%A4vk%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/390557/ph%E5%8E%BB%E9%99%A4vk%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
       var nr = document.querySelector("#age-verification-wrapper");
       var nr2 = document.querySelector("#age-verification-container");
        if(nr !== null){
               nr.parentNode.removeChild(nr);
        }
            if(nr2 !== null){
                nr2.parentNode.removeChild(nr2);

        }

    }, 500);

})();