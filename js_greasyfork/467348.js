// ==UserScript==

// @name         新商盟
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to facilitate merchants
// @author       You
// @match        https://sx.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467348/%E6%96%B0%E5%95%86%E7%9B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/467348/%E6%96%B0%E5%95%86%E7%9B%9F.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);


(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    $(function(){
        var obj=$("input[name='req_qty']");
    obj.val(1);
    var num=obj.length;
    for(var i=0;i<num;i++){
          obj.eq(i).trigger("click");
   }
   obj.eq(num-2).trigger("click");

setTimeout(function (){

  for(var i=0;i<=num;i++){
          var dnum=obj.eq(i).parent().parent().parent().find("span.cgt-col-qtl-lmt").html();
      obj.eq(i).val(dnum);
         obj.eq(i).trigger("click");
   }

}, 5000);
    });
})();