// ==UserScript==
// @license MIT
// @name         luohaonan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  闹着玩的。
// @author       luohaonan
// @match        https://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442243/luohaonan.user.js
// @updateURL https://update.greasyfork.org/scripts/442243/luohaonan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简书giao
    setInterval(()=>{
        $("._3Z3nHf").remove();
    },1000)


})();