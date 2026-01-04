// ==UserScript==
// @name           RW hunter
// @namespace      eRRW
// @author         iMan (Persian Myth)
// @description    support RW
// @version        1.1
// @include        https://www.erepublik.com/*
// @downloadURL https://update.greasyfork.org/scripts/37997/RW%20hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/37997/RW%20hunter.meta.js
// ==/UserScript==
var ResistanceForceInsert = function($, window, undefined) {
  function supportRW() {
    setTimeout(function () {
      $('#fundRW_btn2').trigger('click');
      console.log('[RW hunter] Support button clicked');
      // If the button has a class disabled it should mean the RW is supported
      if (!document.getElementById('fundRW_btn').classList.contains('disabled')) {
        supportRW();
      } else {
        console.log('[RW hunter] RW supported successfully');
      };
    }, 1000)  // Delay(ms) in which script tries to support again
  }
  function controlIt(control){GM_setValue("control", control);}
  function autoRefresh(interval) {setTimeout('location.reload(true);',interval);};
  $(document).ready(function () {
    if (parent.document.location.toString()==='https://www.erepublik.com/en') {
      if ($('#battle_listing > ul.resistance_war > li > a#fundRW_btn').length==1) {
        supportRW();
      } else {
        var vNmax = 1; var vNmin = 1;
        var vNum = Math.round(Math.random() * (vNmax - vNmin) + vNmin);
        autoRefresh(vNum*1000);
      };
    };
  });
};
// Script Insert
var script = document.createElement('script');
script.textContent = '(' + ResistanceForceInsert + ')(jQuery, window);';
document.body.appendChild(script);