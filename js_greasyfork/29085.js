// ==UserScript==
// @name         autolike v2
// @namespace    
// @version      2.02
// @description  script sencillo que da likes y no te abre la casilla rapida de comentario
// @author       @macrigatou
// @match        https://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29085/autolike%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/29085/autolike%20v2.meta.js
// ==/UserScript==

(function() {
    function autolike() {
        if($("#Feed-reload").css("display") == "block"){
            $("#Feed-reload").click();
        }
    $( "div" ).removeClass( "quick-reply" );
    $(".s-like").click();
    }
   setInterval(autolike, 1500);
})();