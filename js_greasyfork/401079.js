// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       gsxhnd
// @match        https://juejin.im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401079/test.user.js
// @updateURL https://update.greasyfork.org/scripts/401079/test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("start")
    a()
})();

function a() {
    var juejin = document.getElementById('juejin')
    console.log(juejin)
}
