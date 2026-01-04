// ==UserScript==
// @name         Ji Csing plus
// @namespace    http://jicsing.hu/
// @version      0.1
// @description  Csak a kiválasztott változó vonalak magyarázatai jelennek meg az oldalon
// @author       zamiere
// @match        https://jicsing.hu/hexagram/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412752/Ji%20Csing%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/412752/Ji%20Csing%20plus.meta.js
// ==/UserScript==

(function() {
  function showHide(e){
    var line = $(e).attr('id').replace('flip-line-','');
    if ($(e).is(":checked")) {
      $('#line_' + line).show();
    }else{
      $('#line_' + line).hide();
    }
  }
  $( ".hexagram-line" ).each(function(i){
      showHide(this);
  });
  $('.hexagram-line').on('click', function(){
      showHide(this);
  });
})();