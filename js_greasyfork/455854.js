// ==UserScript==
// @name ajax_comment_form_imgbb
// @namespace http://tampermonkey.net/
// @version 0.1.9
// @author Nei & Bab
// @description catwar script!
// @match https://*.catwar.net/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455854/ajax_comment_form_imgbb.user.js
// @updateURL https://update.greasyfork.org/scripts/455854/ajax_comment_form_imgbb.meta.js
// ==/UserScript==

//<script async src="//imgbb.host/sdk/pup.js" data-url="https://imgbb.host/upload"></script>

(function() {
    $('#main').bind("DOMSubtreeModified",function(){
        if(document.querySelector('#text')){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//imgbb.host/sdk/pup.js';
            script.dataset.autoInsert = "bbcode-embed-medium";
            script.dataset.sibling = "#text";
            script.dataset.url = "https://imgbb.host/upload";
            document.head.appendChild(script);
        }
    });

    $('#creation_div').bind("DOMSubtreeModified",function(){
        if(document.querySelector('#creation_div')){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://imgbb.com/upload.js';
            script.dataset.autoInsert = "bbcode-embed-medium";
            script.dataset.sibling = "#creation_div";
            document.head.appendChild(script);
        }
    });
    if(document.querySelector('#mess_form')){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://imgbb.com/upload.js';
        script.dataset.autoInsert = "bbcode-embed-medium";
        script.dataset.sibling = "#mess_form";
        document.head.appendChild(script);
    }

    window.onload = function() {
        if(document.querySelector('#send_comment_form')){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://imgbb.com/upload.js';
            script.dataset.autoInsert = "bbcode-embed-medium";
            script.dataset.sibling = "#comment";
            document.head.appendChild(script);
        }
    };

})();