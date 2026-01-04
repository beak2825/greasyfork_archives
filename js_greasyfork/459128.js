// ==UserScript==
// @name         IITD Moodle Login Captcha AutoComplete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AutoCompletes the IITD Moodle Login Captcha
// @author       17vali
// @match        https://moodle.iitd.ac.in/login/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.in
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459128/IITD%20Moodle%20Login%20Captcha%20AutoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/459128/IITD%20Moodle%20Login%20Captcha%20AutoComplete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        const forms = document.getElementsByTagName('form');
        const captcha_str = forms[0].childNodes[10].nodeValue;
        const res = captcha_str.match(/Please\s+(.+?)\s+(\d+)\s*(\S+)\s+(\d+)\s*=/);

        const input = document.getElementById('valuepkg3');
        if(res[1] == 'enter first value') {
            input.value = res[2];
        } else if(res[1] == 'enter second value'){
            input.value = res[4];
        } else{
            input.value = eval(res[2]+res[3]+res[4]);
        }
    }, false)
})();