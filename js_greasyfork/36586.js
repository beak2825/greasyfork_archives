// ==UserScript==
// @name         ekşi sözlük derdini sikeyim butonu
// @namespace    https://eksisozluk.com
// @version      0.1
// @description  manevi derdini sikeyim göndericisi. ekşi sözlük ile kurumsal bir bağlantısı bulunmamaktadır.
// @author       euro truck simulator 2 kamyoncusu
// @match        https://eksisozluk.com
// @include      https://eksisozluk.com/*
// @include      https://eksisozluk.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36586/ek%C5%9Fi%20s%C3%B6zl%C3%BCk%20derdini%20sikeyim%20butonu.user.js
// @updateURL https://update.greasyfork.org/scripts/36586/ek%C5%9Fi%20s%C3%B6zl%C3%BCk%20derdini%20sikeyim%20butonu.meta.js
// ==/UserScript==

(function() {
   $(document).ready(function () {
       // HTML'i hazırlayıp entry altlarına gömelim.
       var ds_html = '<span class="dertsikici"><a style="color:#929292 !important" href="#">derdini sikeyim</a></span>';
       $('.feedback').append(ds_html);

       // Tıkladığımızda uyarı versin.
       $('.dertsikici').click(function(e){
           alert("dert başarıyla sikildi...");
           e.preventDefault();
       });
   });
})();