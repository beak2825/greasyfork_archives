// ==UserScript==
// @name         Photo Yes No Filler
// @author       Tehapollo
// @version      1.0
// @include      *gethybrid.io/workers/tasks*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  1 for yes 2 for no
// @downloadURL https://update.greasyfork.org/scripts/376601/Photo%20Yes%20No%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/376601/Photo%20Yes%20No%20Filler.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if ($('p:contains(Is this a real car or truck?)').length){
         document.onkeydown = function (YesNo) {
             if (YesNo.keyCode === 49 || YesNo.keyCode === 97)  {
             $('input[type=radio]')[0].click();
             $('input.btn.btn.btn-primary.btn-lg').click();
             }
             else if (YesNo.keyCode === 50 || YesNo.keyCode === 98) {
             $('input[type=radio]')[1].click();
             $('input.btn.btn.btn-primary.btn-lg').click();
             }
             }
   }
})();