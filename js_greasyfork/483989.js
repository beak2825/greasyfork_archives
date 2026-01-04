// ==UserScript==
// @name         AVF Link Reaper
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  AVF link reaper
// @author       RN
// @match        https://www.amateurvoyeurforum.com/showthread.php*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/483989/AVF%20Link%20Reaper.user.js
// @updateURL https://update.greasyfork.org/scripts/483989/AVF%20Link%20Reaper.meta.js
// ==/UserScript==

(function() {
    'use strict';




    // all pages: // @match *://*/*
    var data = document.body.innerHTML.replace(/hxxps/gm, 'https') // Replace hxxp
    data = data.replace(/h\*\*ps/gm, 'https') // Replace hxxp
    data = data.replace(/(?<![>"])(https?:[\w\/\.\-_]*)(\s|<\/?br.*>|)/gm, "\[LR\]<a href='$1' target='_blank'>$1</a><br>") // OK

// (.*\..*\/*)[<\s]

//    data = data.replace(/(?<![>"])(https?:.*)<\/?br.*>/gm, "\[LR\]<a href='$1' target='_blank'>$1</a><br>") // OK
//    data = data.replace(/(?<![>"])(https?:.*)/gm, "\[LR\]<a href='$1' target='_blank'>$1</a>") // catch the lat links without br
//    data = data.replace(/\s*(?<![>"])(.*\/.*)\s*</gm, "\[LR\]<a href='$1' target='_blank'>$1</a>")
    document.body.innerHTML = data

        $.each( $("div[id^='post_message_']"), function () {

        //document.body.innerHTML += "BOSTA<br>"
        var allAs=$(this).find("a");
        $.each(allAs,function(index,item){
            var url = $(item).attr("href")
            if(url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')){
                $(item).append( "<img onerror='height=\"0\"'  height='50' width='50' src='"+url+"'>")
            }

        });

    });

})();