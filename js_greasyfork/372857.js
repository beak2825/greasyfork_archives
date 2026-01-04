// ==UserScript==
// @name         Fuck KissManga
// @description  credit to: https://openuserjs.org/scripts/shadofx/KissManga_Adblock
// @match        http://kissmanga.com/*
// @version 0.0.1.20181004110435
// @namespace https://greasyfork.org/users/217411
// @downloadURL https://update.greasyfork.org/scripts/372857/Fuck%20KissManga.user.js
// @updateURL https://update.greasyfork.org/scripts/372857/Fuck%20KissManga.meta.js
// ==/UserScript==
var $ = jQuery
function FuckKissManga(){
  $('#divImage').show()
}
FuckKissManga();
$(window).on('load', FuckKissManga);
new MutationObserver(FuckKissManga).observe($('body')[0],{childList: true});