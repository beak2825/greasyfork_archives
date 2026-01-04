// ==UserScript==
// @name         KBin.social remove custom styles
// @namespace    https://kbin.social/
// @version      0.3
// @description  Says it right in the title
// @author       H2SO4
// @match        https://kbin.social/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/469581/KBinsocial%20remove%20custom%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/469581/KBinsocial%20remove%20custom%20styles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let stylesheet = document.getElementsByTagName("head")[0].getElementsByTagName("style");
    if(stylesheet && stylesheet[0]) {
        stylesheet[0].remove();
    }
})();