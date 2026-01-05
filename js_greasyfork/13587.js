// ==UserScript==
// @name         Wikipedia Ad Blocking
// @namespace    http://xehanort.alwaysdata.net
// @version      1.1
// @description  enter something useful
// @author       Xehanort
// @include      https://*.wikipedia.org/*
// @match        https://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13587/Wikipedia%20Ad%20Blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/13587/Wikipedia%20Ad%20Blocking.meta.js
// ==/UserScript==

var i = setInterval(function() {
    if (document.querySelector('#frbanner-close')) {
        document.querySelector('#frbanner-close').click()
        clearInterval(i);
    }
},100);