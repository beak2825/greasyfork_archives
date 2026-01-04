// ==UserScript==
// @name         nfls_cpoy
// @version      0.2
// @description  copy
// @author       meowoof
// @include      http://www.nfls.com.cn:20035/*
// @grant        none
// @rewritten_script_code javascript
// @namespace https://greasyfork.org/users/1379059
// @downloadURL https://update.greasyfork.org/scripts/512110/nfls_cpoy.user.js
// @updateURL https://update.greasyfork.org/scripts/512110/nfls_cpoy.meta.js
// ==/UserScript==


(function() {
    var elementsByClass = document.getElementsByClassName('ban_copy');
    for (var i = 0; i < elementsByClass.length; i++) {
        elementsByClass[i].classList.remove("ban_copy");
    }

    // Your code here...
})();