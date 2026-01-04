// ==UserScript==
// @name         kongregate spam removal script
// @version      0.1.20201225b
// @description  removal of some annoying spams chats on kongregate, this is the b version, which only contains clean words, which removes most of the spams but not all
// @namespace    http://tampermonkey.net/
// @include      https://www.kongregate.com/games/*
// @author       rinkyboy
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419222/kongregate%20spam%20removal%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/419222/kongregate%20spam%20removal%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var matchxp = /tingfr|ysdat|waterfall/i;
        console.log ("** installing user script");
        unsafeWindow.holodeck.addIncomingMessageFilter(function(s,e){if(matchxp.test(s)){e("");console.log ("** userscript removed "+s);}else e(s);});
    }, 2500)

})();
