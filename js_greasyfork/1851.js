// ==UserScript==
// @name       VidShok Skipper
// @version    0.2.1
// @description  Skips Vidshok.com Wait Timer
// @namespace  https://greasyfork.org/users/2329-killerbadger
// @match      http://vidshok.com/*
// @author     killerbadger
// @downloadURL https://update.greasyfork.org/scripts/1851/VidShok%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/1851/VidShok%20Skipper.meta.js
// ==/UserScript==

if(document.forms[0].method_free) 
{
    var theSpans = document.getElementsByTagName("span");
    var loggedIn = self.find("Logout");
    var firstPage = document.forms[0].usr_login;

    if (document.getElementById("countdown_str")) {
        //var theSpans = document.getElementsByTagName("span");
        var important = theSpans[15].id; 
        $$(important).innerHTML = 0;
        //Submits form after waiting 3 seconds - seems to fix skipped timer error
        setTimeout(function() {document.forms["F1"].submit();},3000);
    }
    else if(loggedIn && !firstPage) { 
        document.forms["F1"].submit();  
    }
    else if(firstPage) { 
        document.forms[0].method_free.click();
    }
}