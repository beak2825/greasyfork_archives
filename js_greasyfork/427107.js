// ==UserScript==
// @name         小众软件linux广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小众软件去广告
// @author       jan
// @match        https://www.appinn.com/
// @icon         https://www.google.com/s2/favicons?domain=appinn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427107/%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6linux%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/427107/%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6linux%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let temp1 = document.querySelector("#latest-posts > article:nth-child(2)");
    temp1.parentNode.removeChild(temp1);
    let temp2 = document.querySelector("#featured-section-1");
    temp2.parentNode.removeChild(temp2);
    let temp3 = document.querySelector("#content_box > section.featured-section.clearfix");
    temp3.parentNode.removeChild(temp3);
    let temp4 = document.querySelector("#media_image-2");
    temp4.parentNode.removeChild(temp4);
})();