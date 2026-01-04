// ==UserScript==
// @name         Fuck KissManga
// @description  credit to: https://openuserjs.org/scripts/shadofx/KissManga_Adblock
// @match        http://kissmanga.com/*
// @version 0.0.1.20181004113411
// @namespace https://greasyfork.org/users/217419
// @downloadURL https://update.greasyfork.org/scripts/372858/Fuck%20KissManga.user.js
// @updateURL https://update.greasyfork.org/scripts/372858/Fuck%20KissManga.meta.js
// ==/UserScript==
var $ = jQuery
function FuckKissManga(){
  $('#divImage').show()
  $('#divComments').show()
}
FuckKissManga();
$(window).on('load', FuckKissManga);
new MutationObserver(FuckKissManga).observe($('body')[0],{childList: true});