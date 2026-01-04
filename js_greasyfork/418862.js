// ==UserScript==
// @name           Noto Color Emoji on all pages
// @name:ru           Эмодзи (Noto Color) на всех страницах
// @description    Inject Noto Color Emoji font into css on all pages
// @description:ru    Внедряет эмодзи (смайлы) из шрифта Noto Color Emoji в css на всех страницах
// @version        1.02
// @match          *://*/*
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @grant          none
// @namespace https://greasyfork.org/users/718526
// @downloadURL https://update.greasyfork.org/scripts/418862/Noto%20Color%20Emoji%20on%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/418862/Noto%20Color%20Emoji%20on%20all%20pages.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

$("html,head,body,tbody,br,div,td,span,li,p,.emoji").css("font-family", function(index,currentValue){
  if (currentValue.match(/Noto Color Emoji/i)) {
    return currentValue + ',Segoe UI Emoji';
  } else if (currentValue.match(/Segoe UI Emoji/i)) {
    return currentValue.replace(/Segoe UI Emoji/i,'noto color emoji') + ',Segoe UI Emoji';
  } else {
    return currentValue + ',noto color emoji,Segoe UI Emoji';
  }
});

//ALTERNATIVE WAY (loads resources heavily even with the specified exceptions)
//$("*:not(i):not(.fa):not(.fbar):not(.smart-form):not(input)").css("font-family", function(index,currentValue){
//FULL EMOJI FONTS LIST (heavy)
//return currentValue + ',sans-serif,noto color emoji,emoji,apple color emoji,segoe ui emoji,android emoji,emojisymbols,emojione mozilla,twemoji mozilla,twitter color emoji,segoe ui symbol';