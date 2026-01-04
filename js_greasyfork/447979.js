// ==UserScript==
// @name         Geekbang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto check
// @author       You
// @match        https://account.geekbang.org/login*
// @match        https://account.geekbang.org/signin*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geekbang.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447979/Geekbang.user.js
// @updateURL https://update.greasyfork.org/scripts/447979/Geekbang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function(){
        console.log('log: ', document.querySelectorAll('.forgot')[0]);
        if (document.querySelectorAll('.forgot')[0] && document.querySelectorAll('.forgot')[0].children[0].text == '密码登录'){
            document.querySelectorAll('.forgot')[0].children[0].click();
        }
        //document.getElementById('agree').parentElement.setAttribute('checked', 'checked');

        setTimeout(function(){
            document.querySelector("#agree").click();
            //document.querySelectorAll("[class^='Button_button']")[0].click();
        }, 1000);
        
    }, 1000);
    
})();