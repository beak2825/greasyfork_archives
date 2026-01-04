// ==UserScript==
// @name        PortalAutoFill
// @namespace   13|14
// @include     http://portal.ulm.ac.id/kuisioner/*
// @include     https://portal.ulm.ac.id/kuisioner/*
// @version     3.0
// @grant       none
// @description dari angkatan 13 untuk dunia
// @downloadURL https://update.greasyfork.org/scripts/30568/PortalAutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/30568/PortalAutoFill.meta.js
// ==/UserScript==
$('#dialog_kuisioner').on('shown.bs.modal', function (e) {
var allElems = document.getElementsByClassName('rating-input');
for (i = 0; i < allElems.length; i++) {
  if (allElems[i].type == 'radio' && allElems[i].value == 5) {
    allElems[i].checked = true ;
  }
}
    console.log('YEAH');
});

var allElems = document.getElementsByClassName('rating-input');
for (i = 0; i < allElems.length; i++) {
  if (allElems[i].type == 'radio' && allElems[i].value == 5) {
    allElems[i].checked = true ;
  }
}