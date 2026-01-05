// ==UserScript==
// @name         Contest Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Que?
// @match        https://www.goodreads.com/giveaway*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24326/Contest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/24326/Contest%20Helper.meta.js
// ==/UserScript==

var addressID="";

(function() {
    if(document.URL.indexOf("enter_print_giveaway")==-1)
    {
       var buttons=document.querySelectorAll('[class^="gr-butto"]');
        for(var x=0; x<buttons.length; x++)
        {
            if(buttons[x].innerText=="Enter Giveaway")
            {
                buttons[x].href+="?address="+addressID;
                buttons[x].href=buttons[x].href.replace('giveaway/enter_choose_address','giveaway/enter_print_giveaway');
            }
        }
    }
    else if(document.URL.indexOf("enter_print_giveaway")!=-1)
    {
        var a=document.getElementsByName("entry_terms");
        var b=document.getElementsByName("want_to_read");
        a[0].checked=true;
        b[0].checked=false;
        var c=document.getElementsByName("commit");
        c[0].removeAttribute("disabled");
        $( "input[name='commit']" ).click();
    }
})();