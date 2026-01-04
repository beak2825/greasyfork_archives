// ==UserScript==
// @name         open in new tab jjj66
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  force auto open in new tab
// @author       You
// @match        https://m.youtube.com/*
// @exclude      https://m.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/441754/open%20in%20new%20tab%20jjj66.user.js
// @updateURL https://update.greasyfork.org/scripts/441754/open%20in%20new%20tab%20jjj66.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...\
    $(document).ready(
        function() {


            window.setTimeout(function(){
                $("a").each(function() { $(this).attr('target','_blank') });
            }, 500);


            $("html").bind("DOMNodeInserted",function(){
                $("a").each(function() { $(this).attr('target','_blank') });
            });


        }
    );
})();