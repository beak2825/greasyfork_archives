// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns your grades on Jupiter Ed to A's.
// @author       Tobe O
// @match        https://*.jupitered.com/*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.0/mousetrap.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434559/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/434559/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function loadScript(src) {
        var s = document.createElement('script');
        s.src = src;
        document.body.appendChild(s);
    }

    function changeGrades() {
        $('#showpage > tbody > tr > td > div.colwidth.lineheight > table > tbody > tr > td:nth-child(3) > span').each(function() {
            var $span = $(this);
            var text = $span.text();
            
            if (text.indexOf('A') === -1) {
                var grade = (90 + Math.random() * 10).toFixed(1);
                text = '' + grade + ' &nbsp; A';
                
                if (grade < 93)
                    text += '-';
                else if (grade >= 100)
                    text += '+';
                
                $span.html(text);
            }
        });
    }
    
    
    if (!window.jQuery)
        loadScript('https://code.jquery.com/jquery-3.1.1.slim.min.js');
    if (!window.Mousetrap)
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.0/mousetrap.min.js');
    
    $(document).ready(changeGrades);
    
    Mousetrap.bind(['ctrl+shift+y', 'command+shift+y'], changeGrades);
})();