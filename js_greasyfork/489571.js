// ==UserScript==
// @name         Moby Credits Textifier 2024
// @namespace    http://tampermonkey.net/
// @version      0.2
// @copyright    https://en.wikipedia.org/wiki/WTFPL
// @license      WTFPL
// @description  extract credits from mobygames - I'm using a temporary email for this greasyfork so don't expect updates <3
// @author       Curious, aren't we?
// @match        https://www.mobygames.com/game/*/*/credits/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobygames.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489571/Moby%20Credits%20Textifier%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/489571/Moby%20Credits%20Textifier%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

    waitForElm('main#main').then((elm) => {
        var $ = window.jQuery;
        $('h1').after('<textarea style="background-color: LemonChiffon;" id="mobyex-txt"></textarea><button id="mobyex-btn">allText</button>');
        $('#mobyex-btn').click(function(){
            var txtCredits = '';
            $('table.table-credits > tbody > tr').each(function(){
                $(this).find('th h4').each(function(){
                    txtCredits += '\n\n' + $(this).text();
                });
                if ( $(this).find('td').length ) {
                    $(this).find('td:nth-child(1)').each(function(){
                        txtCredits += '\n\n' + $(this).text();
                    });
                    //$(this).find('td:nth-child(2) ul li').each(function(){ // not since 2024-03-14 or so
                    $(this).find('td:nth-child(2)').text().split(', ').forEach(function(item, index){
                        //txtCredits += '\n' + $(this).text();
                        txtCredits += '\n' + item;
                    });
                }
            });
            $('#mobyex-txt').text(txtCredits.trim());
        });
    });
})();