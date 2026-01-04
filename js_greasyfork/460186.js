// ==UserScript==
// @name         purge jianshu article
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  界面
// @description:en  give you a page look better
// @author       You
// @match        https://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460186/purge%20jianshu%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/460186/purge%20jianshu%20article.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(mycode, 3000)

    function mycode() {
        const ad_hor = document.querySelector('.adad_container');
        ad_hor.style.cssText = "visibility:hidden; height: 0;";

        const aside = document.querySelector('aside');
        aside.style.cssText = "visibility:hidden; width: 0;";

        const mainc = document.querySelector('div[role=main] > div:first-child');
        mainc.style.width = "1500px"

        const con = document.querySelector('footer + div[class]');
        con.style.cssText = "visibility:hidden; width: 0;"
    }
})();