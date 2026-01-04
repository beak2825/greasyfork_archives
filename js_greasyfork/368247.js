// ==UserScript==
// @name        CSW-Enable-Browser-Spellcheck
// @namespace   local crowdsurfwork
// @description CSW enable browser spellcheck for transcription
// @include     https://ops.cielo24.com/mediatool/transcription/jobs/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368247/CSW-Enable-Browser-Spellcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/368247/CSW-Enable-Browser-Spellcheck.meta.js
// ==/UserScript==

({
   enable_spellcheck: function()
   {
      console.log('in enable browser spellcheck, document=', document);
      let pte = $('#plaintext_edit');

      pte.attr('spellcheck', 'true');
      pte.attr('placeholder', 'Browser spellcheck is on');
      pte.focus();
  },

  main : function()
  {
    let outer_this = this;
    $(document).on('readystatechange', function() { outer_this.enable_spellcheck(); });
  },
}).main();
