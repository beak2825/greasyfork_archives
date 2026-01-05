// ==UserScript==
// @name         Anti-necropost.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Stops you from accidentally necroposting.
// @author       Vibe UID = 5230
// @match        https://v3rmillion.net/showthread.php?tid=*
// @match        https://v3rmillion.net/newreply.php?tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27186/Anti-necropost.user.js
// @updateURL https://update.greasyfork.org/scripts/27186/Anti-necropost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tid = "";
    var a = "";
    var d = new Date();
    if (location.href.search("&") == -1) {
        tid = location.href.slice(location.href.search("tid=")+4,location.href.length);
    } else {
        tid = location.href.slice(location.href.search("tid=")+4,location.href.search("&"));
    }

    $.ajax({
        url:'https://v3rmillion.net/showthread.php?tid='+tid+'&action=lastpost',
        type:'GET',
        success: function(data){
            a = $(data).find('span.post_date')[$(data).find('span.post_date').length-1].innerText; // To explain this a bit more, variable a is the last date the thread has been posted on.
            if (a.search("-") > 0){ // If a is in correct format
                var diff_in_days = (Math.round((d.getTime())/(86400000)) - (Math.round((Date.parse(a.slice(0,10)))/(86400000))));
                if (diff_in_days > 30) {
                    var author = $(data).find('span.post_date')[$(data).find('span.post_date').length-1].closest('div.post_head').closest('div.post ').childNodes[3].childNodes[7].childNodes[1].childNodes[0].innerText;
                    if (location.href.search("showthread") > 0) {                    
                        $("textarea#message").attr("readonly",true);
                        $("textarea#message").val("This thread is old and thus posting here would be considered necroposting. The last post was on "+a.slice(0,10)+" by "+author+".\n\rPosting to this thread manually has automatically been stopped by the anti-necropost script made by Vibe.\n\rHaving any problems with the script? The anti-necropost bot release thread can be found here: https://v3rmillion.net/showthread.php?tid=234589");
                        $("input.buttons").remove();
                        $("a.button.new_reply_button")[0].setAttribute("href","https://v3rmillion.net/showthread.php?tid=234589");
                        $("a.button.new_reply_button")[0].childNodes[0].innerText = "Anti-Necropost thread";
                        $("a.button.new_reply_button")[1].setAttribute("href","https://v3rmillion.net/showthread.php?tid=234589");
                        $("a.button.new_reply_button")[1].childNodes[0].innerText = "Anti-Necropost thread";
                    } else {
                        $("body").childNodes[0].innerText = "This thread is old and thus posting here would be considered necroposting. The last post was on "+a.slice(0,10)+" by "+author+".\n\rPosting to this thread manually has automatically been stopped by the anti-necropost script made by Vibe.\n\rHaving any problems with the script? The anti-necropost bot release thread can be found here: https://v3rmillion.net/showthread.php?tid=234589";
                        $("input.button").remove();

                    }
                }
            }
        }});
})();