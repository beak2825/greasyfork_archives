// ==UserScript==
// @name         Genshin Auto Login Bonus
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  -
// @author       You
// @match        https://act.hoyolab.com/ys/event/signin-sea-v3/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440580/Genshin%20Auto%20Login%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/440580/Genshin%20Auto%20Login%20Bonus.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let id;

    const confirm = ()=>{
        const elem2 = document.querySelectorAll("[class*='dialog-close']");
        elem2[0].click();
    }

    const select = ()=>{
        const elem1 = document.querySelectorAll("[class*='actived-day']");
        if(elem1){
            elem1[0].click();
            clearInterval(id);
            setTimeout(confirm, 1000);
        }
    }

    window.addEventListener("load",setInterval(select, 2000));
})();