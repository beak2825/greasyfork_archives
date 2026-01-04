// ==UserScript==
// @name        Necromancer's
// @namespace    -
// @version     12
// @description force moomoo.io servers
// @author      iXeL
// @match       *://moomoo.io/*
// @match       *://dev.moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/393046/Necromancer%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/393046/Necromancer%27s.meta.js
// ==/UserScript==

document.body.onkeydown = function(e) {
    var code = e.keyCode;
    if(code === 88) {
        storeHolder.scrollTo(document.body.scrollLeft,
                        document.body.scrollTop + 1200);
    }
    else if(code === 84) {
        storeHolder.scrollTo(document.body.scrollLeft,
                        document.body.scrollTop + 1450);
    }
    else if(code === 82) {
        storeHolder.scrollTo(document.body.scrollLeft,
                        document.body.scrollTop + 1850);
    }
    else if(code === 90) {
        storeHolder.scrollTo(document.body.scrollLeft,
                        document.body.scrollTop + 2050);
    }
           };