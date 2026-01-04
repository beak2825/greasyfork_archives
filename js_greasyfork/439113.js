// ==UserScript==
// @name        澳門幾健康
// @namespace   ccpforever
// @match       https://app.ssm.gov.mo/healthPHD/*
// @version     1.3
// @author      ccpforever, loveweini
// @description 你健康吗
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439113/%E6%BE%B3%E9%96%80%E5%B9%BE%E5%81%A5%E5%BA%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439113/%E6%BE%B3%E9%96%80%E5%B9%BE%E5%81%A5%E5%BA%B7.meta.js
// ==/UserScript==

(function(){
  
$(function() {
//沒有以上症狀
$("input[type=checkbox][value=99][name=symptom]").prop('checked', true);

//否
$("input[type=checkbox][value=N][name=symptau]").prop('checked', true);
  
  

 var scan= $("<div class='scan'>scan</div>");
  
  $("body").children().append(scan);
  
  
  var style = $(`<style>
  #myDownload {
    display:none !important;
  }
</style>`);
		$("head").append(style);
  
});
})();