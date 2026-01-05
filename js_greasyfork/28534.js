// ==UserScript==
// @name         Johns Hopkins APL
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Selects bottom bubble for you
// @author       pyro
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28534/Johns%20Hopkins%20APL.user.js
// @updateURL https://update.greasyfork.org/scripts/28534/Johns%20Hopkins%20APL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($('p:contains("1. Carefully examine all the text on the left,")').length) { console.log('Johns Hopkins APL');
       let sentences = [];
       $('div.TextCell2').each( function(x) { sentences[x] = $(this).text().trim(); } );
       console.log(sentences);
       if (sentences[2] === sentences[6] || sentences[4] === sentences[6]) {
           console.log('Match!');
           $('input[name="quality_check"][value="1"]').click();
       }
       else {
           console.log('No Match!');
           $('input[name="quality_check"][value="0"]').click();
       }
    }

})();