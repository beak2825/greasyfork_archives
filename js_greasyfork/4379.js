// ==UserScript==
// @name        AnonyTank
// @namespace   http://stackoverflow.com/users/982924/rasg
// @author      RASG
// @version     2014.08.19
// @description Show only the selected city for Anonyfish Personals. Change de variable "ShowOnlyThisCity" to suit your needs.
// @require     http://code.jquery.com/jquery.min.js
// @grant       GM_log
// @include     https://anonyfish.com/personals*
// @downloadURL https://update.greasyfork.org/scripts/4379/AnonyTank.user.js
// @updateURL https://update.greasyfork.org/scripts/4379/AnonyTank.meta.js
// ==/UserScript==

$(window).load(function(){
    
    var ShowOnlyThisCity = "alegre"
    
    $("div.adLocation").each(function() {
        var txtCidade = $(this).text().toLowerCase()

        if (txtCidade.search(ShowOnlyThisCity) == -1) {
            $(this).parent().parent().parent().parent().hide();
        }
    })

});
