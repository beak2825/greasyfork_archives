// ==UserScript==
// @name         WME Forum Sig Char Counter
// @namespace    Dude495
// @version      2018.10.16.01
// @description  Adds the character limit counter to your forum signature box.
// @author       Dude495
// @include      /^https:\/\/.*\.waze\.com\/forum\/.*
// @downloadURL https://update.greasyfork.org/scripts/373332/WME%20Forum%20Sig%20Char%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/373332/WME%20Forum%20Sig%20Char%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sigbox = $('#signature')[0];
    const tl = document.createElement("LABEL");
    tl.id = 'CHARLIMIT';
    function charlimit() {
        var charcount = sigbox.textLength;
        const mbox = $('#message-box');
        const tdiv = document.createElement('div');
        tdiv.id = 'TBOX';
        $('#message').after(tdiv);
        tl.innerHTML = charcount + '/400';
        tdiv.after(mbox);
        mbox.after(tl);
    };
    function update() {
        var charcount = sigbox.textLength;
        if (charcount <= 400) {
            tl.style.color = "black";
        tl.innerHTML = charcount + '/400';
        } else {
            tl.style.color = "red";
            tl.innerHTML = charcount + '/400';
               }
    };
    function bootstrap(tries = 1) {
        if (/mode=signature/.test(location.href)) {
            charlimit();
            setInterval(update, 100)
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }
    bootstrap();
})();