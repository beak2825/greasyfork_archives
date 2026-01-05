// ==UserScript==
// @name        GoG Gift Codes
// @namespace   net.listopad
// @description Show Gog Gift codes properlu
// @include     https://www.gog.com/account/gifts
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4729/GoG%20Gift%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/4729/GoG%20Gift%20Codes.meta.js
// ==/UserScript==
var split = function(code){
  var start = 0;
  var retString = "";
  var piece = code.length / 4;
  while(start < code.length){
    console.log(start + ":" + piece);
    retString = retString + code.substring(start, start += piece) + "-";
    //start += piece;
  }
  return retString.substring(0, retString.length -1);
}

$(".code").each(function(){
  $(this).text(split($(this).parent().data('giftcode').toUpperCase()));
})