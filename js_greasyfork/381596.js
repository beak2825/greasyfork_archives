// ==UserScript==
// @name         Base
// @namespace    Base VN
// @version      0.3
// @description  try to take over the world!
// @author       Hofang Hari
// @match        https://request.base.vn/?request=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381596/Base.user.js
// @updateURL https://update.greasyfork.org/scripts/381596/Base.meta.js
// ==/UserScript==

(function() {
    var mvv,tkh,po,info,gh;
  'use strict';
//div[@class='list -formdata']//div[2].-double div.page.-left:nth-child(2) div.display.-job div.section.-main:nth-child(1) div:nth-child(2) div.list.-formdata:nth-child(7) div.li.-with-icon:nth-child(2) > div.value
    // Your code here...
     setTimeout(
         function(){
             mvv = document.querySelectorAll(".value")[4].innerHTML;
             tkh = document.querySelectorAll(".value")[5].innerHTML;
             po = document.querySelectorAll(".value")[6].innerHTML;
             gh = document.querySelectorAll(".value")[11].innerHTML;
             info = "<b>MVV:</b> " + mvv +"\n<br><b>Tên KH: </b>" + tkh + "\n<br><b>PO:</b> " + po + "\n<br><b>Giao hang :</b>"+ gh;
             //mvv.execCommand("copy");
             copyStringToClipboard(info);
             //alert(info);
         },1000);
    function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}
})();