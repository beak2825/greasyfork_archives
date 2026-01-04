// ==UserScript==
// @name         qaru.site fck invert
// @namespace    http://greasyfork.org
// @version      0.01
// @description  Reverse answer text if you have adblock
// @author       HyperKek
// @match        http://qaru.site/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373602/qarusite%20fck%20invert.user.js
// @updateURL https://update.greasyfork.org/scripts/373602/qarusite%20fck%20invert.meta.js
// ==/UserScript==

setTimeout(function() { $('.answer-row').children().removeClass(); }, 1000);