// ==UserScript==
// @name         mouser.com自动跳到mouser.cn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hendeliao
// @include      https://www.mouser.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/419199/mousercom%E8%87%AA%E5%8A%A8%E8%B7%B3%E5%88%B0mousercn.user.js
// @updateURL https://update.greasyfork.org/scripts/419199/mousercom%E8%87%AA%E5%8A%A8%E8%B7%B3%E5%88%B0mousercn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.location.href=window.location.href.replace(/www.mouser.com/,"www.mouser.cn");
})();