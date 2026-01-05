// ==UserScript==
// @name         Duolingo Known-to-New Practice
// @namespace    unkkatkumiankka
// @version      0.1
// @description  Strip all but known-to-new language exercises from the timed practice of Duolingo.
// @author       unkkatkumiankka
// @match        https://www.duolingo.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xhook/1.3.5/xhook.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23178/Duolingo%20Known-to-New%20Practice.user.js
// @updateURL https://update.greasyfork.org/scripts/23178/Duolingo%20Known-to-New%20Practice.meta.js
// ==/UserScript==

xhook.after(function(request,response){
    if(typeof request.url != 'undefined'){
        if(request.url.indexOf('global_practice') !== -1){
            injson = JSON.parse(response.text);
            var elems = injson.session_elements;
            var i=0;
            while(i<elems.length){
                if(elems[i].specific_type != 'reverse_translate'){
                    elems.splice(i,1);
                }else{
                    i++;
                }
            }
            response.text = JSON.stringify(injson);
        }
    }
});
