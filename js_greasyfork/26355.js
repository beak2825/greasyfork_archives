// ==UserScript==
// @name         Sgk Stajer Giris
// @namespace    
// @version      0.1
// @description  Sgk stajer girişi için otomatik olarak default degerleri getirir. İş yükünden kurtarır.
// @author       halil ceyhan
// @match        https://uyg.sgk.gov.tr/SigortaliTescil/amp/sigortaliTescilAction
// @grant        none
// @require     https://code.jquery.com/jquery-1.11.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/26355/Sgk%20Stajer%20Giris.user.js
// @updateURL https://update.greasyfork.org/scripts/26355/Sgk%20Stajer%20Giris.meta.js
// ==/UserScript==

(function() {
    $("#tx_TekIsGirTarGG").val("09");
    $("#tx_TekIsGirTarAA").val("01");
    $("#tx_TekIsGirTarYY").val("2017");
    $("#sigtur").val(19);
     $("#cmb_Ozurkod").val('H');
     $("#cmb_eskiHukumlu").val('H');
     $("#cmb_ogrenimDurum").val(4);
     $("#30gundenaz").val('H');
     $("#csgbiskolukod").val(17);
     $("#cbgorev").val("05");
     $("#sigtur").val(19);
      $("#cbMeslek").val("9901.02  ");
    
})();