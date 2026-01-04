// ==UserScript==
// @name        TROFMA Text Correction
// @namespace   trofma
// @description Corrects the automatic conversion on TROFMA forum of the sequence "gs" to a line of "***"
// @include     http://www.trofma.com/trofma/forum/*
// @match       http://www.trofma.com/trofma/forum/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/402882/TROFMA%20Text%20Correction.user.js
// @updateURL https://update.greasyfork.org/scripts/402882/TROFMA%20Text%20Correction.meta.js
// ==/UserScript==

(function(){'use strict';var k=document.getElementById('Kunena');if(k){k.innerHTML=k.innerHTML.split('- ************************** -').join('gs');}})();