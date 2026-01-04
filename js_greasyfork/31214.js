// ==UserScript==
// @name         Excessive Depunctualizer
// @namespace    http://ejew.in/
// @version      0.1
// @description  make peple appear a little less lost in this world
// @author       EntranceJew
// @match        https://mail.google.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/31214/Excessive%20Depunctualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/31214/Excessive%20Depunctualizer.meta.js
// ==/UserScript==

(function() {
    setInterval(function(){
        $('b, span, h2, div').contents().filter(function() {
            return this.nodeType === 3;
        }).each(function(){
            this.nodeValue = this.nodeValue.replace(/(\?)(\s*)(\?)/gm, '$1$3').replace(/(\?+)/gm, '?');
        });
    },1000);
})();