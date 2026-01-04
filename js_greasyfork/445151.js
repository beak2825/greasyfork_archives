// ==UserScript==
// @name       1.1 Shortlinks Helper Long Short
// @namespace    Grizon_Ru
// @version      2.1
// @description  Shortlinks Sites Automatically Skips annoying link shorteners
// @author       Grizon
// @grant      none
// @license MIT
// @match      *://boxlink.xyz/*
// @match      *://zoxlink.xyz/*
// @match      *://moxlink.xyz/*
// @match      *://foxlink.xyz/*
// @match      *://foofly.xyz/*
// @match      *://wizzly.xyz/*
// @match      *://porofly.xyz/*
// @match      *://morofly.xyz/*
// @match      *://zorofly.xyz/*
// @match      *://worofly.xyz/*
// @match      *://gameen.xyz/*
// @match      *://fameen.xyz/*
// @match      *://yameen.xyz/*
// @match      *://girlporo.xyz/*
// @match      *://girlmoro.xyz/*
// @match      *://girlzoro.xyz/*
// @match      *://girlworo.xyz/*
// @match      *://potoly.xyz/*
// @match      *://motoly.xyz/*
// @match      *://kotoly.xyz/*
// @match      *://zololink.xyz/*
// @match      *://cryptoon.xyz/*
// @match      *://wizly.xyz/*
// @match      *://9bitco.in/*
// @match      *://movie4i.com/*
// @grant      none
// @author     Bloggerpemula
// @run-at     document-start
// @description Bypass Addition for Bypass All Shortlinks
// @downloadURL https://update.greasyfork.org/scripts/445151/11%20Shortlinks%20Helper%20Long%20Short.user.js
// @updateURL https://update.greasyfork.org/scripts/445151/11%20Shortlinks%20Helper%20Long%20Short.meta.js
// ==/UserScript==
(function() {
    'use strict';
    delete window.document.referrer;
    window.document.__defineGetter__('referrer', function () {
        return "https://forexeen.us/";
    });
})();