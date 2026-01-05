// ==UserScript==
// @name       teblefixer
// @namespace  http://mongla.net
// @description fdbsaazbv
// @version    1.1
// @include    http://rezerwacje.ufs.pt/reports*
// @require    http://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27037/teblefixer.user.js
// @updateURL https://update.greasyfork.org/scripts/27037/teblefixer.meta.js
// ==/UserScript==

(function() {
    var css = ".tatabelka { table-layout: fixed; word-wrap: break-word; font-variant: small-caps; }";
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node); 
        }
    }
})();
$(document).ready(function ()
                  {
                    
                       function tabelka()
                      {
                         $("table").addClass( "tatabelka" );
                      }
       tabelka();
                  });