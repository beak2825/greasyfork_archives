// ==UserScript==
// @name         vPlus
// @namespace    https://greasyfork.org/en/users/190451-leo-aee
// @version      0.1.4
// @description  让 v2ex 跟随系统的深色/浅色模式
// @author       Leoaee
// @icon         https://cdn.jsdelivr.net/gh/mopig/oss@master/uPic/202005/v_logo.png
// @include      https://*.v2ex.com/*
// @include      https://v2ex.com/*
// @match        <$URL$>
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/402883/vPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/402883/vPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function detectColorScheme(){
        var ret = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        return ret;
    }
    var curScheme = detectColorScheme()
    var curColor = document.querySelector('.light-toggle > img').alt.toLowerCase()
    if(curScheme !== curColor) {
        document.querySelector('.light-toggle').click()
    }
})();