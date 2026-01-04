// ==UserScript==
// @name         痞客邦去广告测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  痞客邦去广告
// @author       You
// @match        https://hpipiw.pixnet.net/blog/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixnet.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480880/%E7%97%9E%E5%AE%A2%E9%82%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480880/%E7%97%9E%E5%AE%A2%E9%82%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(removeAD, 1500)
    // Your code here...
    function removeAD(){

        $('#mib-video-expander').remove()
    }
})();