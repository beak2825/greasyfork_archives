// ==UserScript==
// @name        澳門幾健康
// @namespace   ccpforever
// @match       https://app.ssm.gov.mo/healthPHD/page/TradChin/ch9.html
// @version     1.2
// @author      ccpforever
// @description 你健康吗
// @downloadURL https://update.greasyfork.org/scripts/433109/%E6%BE%B3%E9%96%80%E5%B9%BE%E5%81%A5%E5%BA%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/433109/%E6%BE%B3%E9%96%80%E5%B9%BE%E5%81%A5%E5%BA%B7.meta.js
// ==/UserScript==

(function(){
  
$(function() {
//沒有以上症狀
$("input[type=checkbox][value=99][name=symptom]").prop('checked', true);

//否
$("input[type=checkbox][value=N][name=symptau]").prop('checked', true);
  
});
})();