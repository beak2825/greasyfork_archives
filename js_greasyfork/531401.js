// ==UserScript==
// @name         注册器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  注册latexlive
// @author       You
// @match        https://www.latexlive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=latexlive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531401/%E6%B3%A8%E5%86%8C%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531401/%E6%B3%A8%E5%86%8C%E5%99%A8.meta.js
// ==/UserScript==

// https://www.latexlive.com/login

var newNavItem = $('<li class="nav-item"><a class="nav-link" href="https://www.latexlive.com/login" style="color: rgb(0, 0, 0);">注册</a></li>');
$('ul.navbar-nav').append(newNavItem);

function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9',
                 'A','B','C','D','E','F','G','H','I','J','K','L','M',
                 'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < n ; i++) {
        var id = Math.floor(Math.random()*36);
        res += chars[id];
    }
    return res;
}

(function() {
    'use strict';
    $("#a_gotoreg_account").click()

    var rdm = generateMixed(6)
    var name = "PoorGuy" + rdm
    $("#input_regusername").val(name)
    $("#input_regpassword").val("Aa123456")
    $("#input_regpasswordagain").val("Aa123456")
})();