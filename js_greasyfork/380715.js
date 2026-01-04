// ==UserScript==
// @name         IEDB
// @namespace    http://tools.iedb.org/mhci/*
// @version      0.1
// @description  press F5
// @author       quz
// @match        http://tools.iedb.org/mhci/*
// @include      http://tools.iedb.org/mhci/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/380715/IEDB.user.js
// @updateURL https://update.greasyfork.org/scripts/380715/IEDB.meta.js
// ==/UserScript==
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     //alert(window.location.href)
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) return unescape(r[2]); return null;
}


(function() {
    //get parameter
    document.getElementById("id_sequence_text").value = getQueryString("mhci_sequence");

   // document.getElementById("added_row").remove();
   //$("#tabName tbody").prepend('<tr id="added_row"><td><input type="hidden" name="allele" value="HLA-C*03:04">HLA-C*03:04</td><td><input type="hidden" name="length" value="10">10</td><td style="background:transparent;border:0;"><input type="hidden" name="species" value="human"><img src="/static/images/delete.png" border="0" class="delete" value="HLA-C*03:04,10,human"></td></tr>');
    var capturedText = window.location.search.match(/(\?|&)seq=(.*?)(&|$)/);
    var capturedSeq = capturedText ? decodeURIComponent(capturedText[2]) : '';
    var s = [{'mhci_refset': 'off', 'mhci_length': getQueryString("mhci_length"), 'mhci_species': 'human', 'mhci_allele': getQueryString("mhci_allele")},
             {'mhci_sequence': getQueryString("mhci_sequence")}, 'web']
    load_session(s, capturedSeq);

})();

