// ==UserScript==
// @name         Unhide reddit spoilers
// @namespace    https://greasyfork.org
// @description     Automatically unhides reddit spoilers on old reddit
// @version      1.4
// @author       valr337
// @match        https://*.reddit.com/*
// @grant        unsafeWindow
// @license MIT
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/495648/Unhide%20reddit%20spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/495648/Unhide%20reddit%20spoilers.meta.js
// ==/UserScript==

var $ = jQuery.noConflict();

// Prevents script to load twice as Reddit uses iframes
if (window.top != window.self) { return false; }
 
(function() {
    'use strict';
    /* globals $ */
 
    $(document).ready(function() {
        console.log('Unhide reddit spoilers');
      
        const unhide = () => {
            $('div.expando-gate').each(function() {   
                $(this).find('button:contains("Click to see spoiler")').click();          
            });
        }
 
        const unhidebody = () => {
            $('div.usertext-body').each(function() {
                if ($(this).find('.md-spoiler-text').length){                  	
                    $('p').each(function() {
                        let text = $(this).text()
                        if($(this).children('.md-spoiler-text').length) {
                            $(this).text(text)
                        }
                    })
                }
            });
        }
        
 	unhide();
        unhidebody();
        window.onscroll = function(ev) {
          	unhide();
            unhidebody();
        };
    });
 
})();