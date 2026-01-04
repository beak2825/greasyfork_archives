// ==UserScript==
// @name         nbstudy-mobile-save
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto save and input your mobile number!
// @author       Sin_up
// @match        https://www.nbstudy.gov.cn:81/vm/login.jsp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436773/nbstudy-mobile-save.user.js
// @updateURL https://update.greasyfork.org/scripts/436773/nbstudy-mobile-save.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#mobver').on('change', function(){
        localStorage.setItem("mob", $("#mobver").val());
    });
    localStorage.getItem("mob")
        ? $("#mobver").val(localStorage.getItem("mob"))
    : "";
})();