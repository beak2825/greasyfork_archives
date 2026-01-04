// ==UserScript==
// @name         enable autofill
// @namespace    http://tampermonkey.net/
// @version      2024-07-02
// @description  auto full username password login
// @author       You
// @grant        none
// @match        https://10.0.33.252:*/*loginc?*
// @match        http://10.0.33.251:*/*loginc?*
// @match        https://10.0.33.251:*/*loginc?*
// @match        http://10.0.39.170:*/*loginc?*
// @match        https://10.0.39.170:*/*loginc?*
// @match        http://10.0.34.60:*/*loginc?*
// @match        http://10.0.34.57:*/*loginc?*
// @match        http://asp282devxm.com:*/*loginc?*
// @match        http://oa.bjsasc.com:*/*loginc?*
// @match        http://asp281dev.com:*/*loginc?*
// @match        https://aspdemo281.com:*/*loginc?*
// @match        http://asp282dev.com:*/*loginc?*
// @match        http://asp283dev.com:*/*loginc?*
// @match        http://asp284dev.com:*/*loginc?*
// @match        http://asp285dev.com:*/*loginc?*
// @match        http://asp285test.com:*/*loginc?*
// @match        http://asp.asp.asp:*/*loginc?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498213/enable%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/498213/enable%20autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deal(){
        var newValue=""
        var el1s = document.querySelectorAll('input[autocomplete="off"]');

        // 遍历所有找到的元素并移除autocomplete属性
        el1s.forEach(function(element) {
            element.removeAttribute('autocomplete');
        });

        var form = document.getElementById('signupForm');
        var el3 = document.getElementById('password1');
        form.insertBefore(el3, form.children[2]);
        if (el3) {
            el3.type = 'password';
            el3.id = 'password2';
            el3.value=""
        }

        var el2 = document.getElementById('password_orig');
        if (el2) {
            el2.style.width = '1px';
            el2.style.height = '1px';
            el2.value = "123"
            el2.style.display="none";
        }

        var el4 = document.getElementsByClassName('fa-lock')[0];
        if(el4){
            el4.style.display="none";
        }
    }
    setTimeout(deal,100);
    // Your code here...
})();