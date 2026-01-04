// ==UserScript==
// @name         Beauty Ground
// @namespace    https://greasyfork.org/zh-CN/scripts/383366-beauty-ground
// @version      0.3
// @description  Every page have a girl !
// @author       ang
// @match        */*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383366/Beauty%20Ground.user.js
// @updateURL https://update.greasyfork.org/scripts/383366/Beauty%20Ground.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var top = document.body;
    top.style.backgroundImage = "url(https://api.ixiaowai.cn/mcapi/mcapi.php)";
    top.style.backgroundRepeat = "no-repeat";
    top.style.backgroundSize = "auto";
    top.style.backgroundPosition ="right";
    top.style.opacity = "0.9";

})();