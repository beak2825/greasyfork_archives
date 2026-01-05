// ==UserScript==
// @name         Best Tricksplit Macro
// @namespace    n3l.nl
// @version      2
// @description  Never miss a tricksplit again!
// @author       n3l
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23894/Best%20Tricksplit%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/23894/Best%20Tricksplit%20Macro.meta.js
// ==/UserScript==

function keydown(event) {
    if (event.keyCode == 32) {
        $("body").trigger($.Event("keydown", { keyCode: 87}));
        $("body").trigger($.Event("keyup", { keyCode: 87}));
    }
}