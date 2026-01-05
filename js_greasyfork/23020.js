// ==UserScript==
// @name       Reddit Autoexpander
// @namespace  lainscripts_reddit_autoexpander
// @version    0.3
// @description  Expands comments
// @match      http://reddit.com/*
// @match      http://*.reddit.com/*
// @match      https://reddit.com/*
// @match      https://*.reddit.com/*
// @author     lainverse
// @downloadURL https://update.greasyfork.org/scripts/23020/Reddit%20Autoexpander.user.js
// @updateURL https://update.greasyfork.org/scripts/23020/Reddit%20Autoexpander.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function clickOn(btn) {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click",true,true);
        btn.dispatchEvent(ev);

    }

    var btn = document.querySelectorAll(".expando-button.collapsed"),
        i = btn.length;
    while(i--) {
        clickOn(btn[i]);
    }
})();
