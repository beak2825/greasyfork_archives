// ==UserScript==
// @name         code editable
// @namespace    csdnCode
// @version      0.1
// @description  This is a script for csdn to make all codes editable without login
// @author       xinyou
// @include       https://*csdn*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433757/code%20editable.user.js
// @updateURL https://update.greasyfork.org/scripts/433757/code%20editable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = ()=>{
        let code = document.querySelectorAll('code')
        for (let i=0; i<code.length; ++i){
            code[i].setAttribute('contenteditable', true)
        }
    }
})();