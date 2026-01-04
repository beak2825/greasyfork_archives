// ==UserScript==
// @name         MXCube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yangjunwei
// @match        http://www.stm32cube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387788/MXCube.user.js
// @updateURL https://update.greasyfork.org/scripts/387788/MXCube.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $('.lightbox').remove();
     //$("body > div:nth-child(1)").css("width","0px");
    $("body > div:nth-child(1)").remove();
    // Your code here...
})();