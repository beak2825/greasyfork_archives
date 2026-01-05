// ==UserScript==
// @name         remove attach files icon in gmail
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove attach files icon in gmail, and focus on using gdrive
// @author       oopus
// @require https://code.jquery.com/jquery-3.2.1.slim.min.js
// @match        *://*mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29798/remove%20attach%20files%20icon%20in%20gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/29798/remove%20attach%20files%20icon%20in%20gmail.meta.js
// ==/UserScript==


(function() {
//    console.log(0);
//    setTimeout(function (){
//        console.log(1);
//        setTimeout(function (){
//            console.log(2);
//            $('div[data-tooltip="Attach files"]').remove();
//        }, 1000);
//        $(".inboxsdk__compose").click(function(){
//            console.log("compose_area");
//            setTimeout(function (){
//                console.log(2);
//                $('div[data-tooltip="Attach files"]').remove();
//            }, 3000);
//        });
//    }, 10000);
    document.addEventListener('click', function(e) {
        setTimeout(function (){
            $('div[data-tooltip="Attach files"]').remove();
        }, 1000);
    }, false);
})();
