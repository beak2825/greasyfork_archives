// ==UserScript==
// @name        Telia Mobiilivarmenne Pre-Fill Number
// @namespace   Violentmonkey Scripts
// @match       https://tunnistus.telia.fi/uas/authn/*/view?*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.2
// @author      j239872933
// @description Pre-fills phone number and submits the form on Telia Mobiilivarmenne verification page.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521320/Telia%20Mobiilivarmenne%20Pre-Fill%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/521320/Telia%20Mobiilivarmenne%20Pre-Fill%20Number.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var number = GM_getValue('number', '');
  var submit = jQuery('input[type="submit"]');
  var submitValue = submit.val();
  var changed = false;

  // Number change handler, will abort auto-submit and prompt to store new number
  jQuery('#username').on('change', function(e){
    changed = true;
    jQuery('input[type="submit"]').val(submitValue);
    if (this.value && this.value != number && confirm('Update saved number to '+this.value+'?')) {
      GM_setValue('number', this.value);
    }
  });

  if (number && !jQuery('#username').val()) {
    jQuery('#username').val(number);
    window.setTimeout(function(){ if (!changed) submit.val(submitValue+' 3'); }, 0);
    window.setTimeout(function(){ if (!changed) submit.val(submitValue+' 2'); }, 1000);
    window.setTimeout(function(){ if (!changed) submit.val(submitValue+' 1'); }, 2000);
    window.setTimeout(function(){ if (!changed) submit.val('0').click(); }, 3000);
  }

})();
