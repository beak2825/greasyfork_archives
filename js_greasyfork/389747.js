// ==UserScript==
// @name         BitMEX Header Auto-hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto hide BitMEX header for bigger view. Hover mouse to show back the header
// @author       Nobakab
// @match        https://www.bitmex.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389747/BitMEX%20Header%20Auto-hide.user.js
// @updateURL https://update.greasyfork.org/scripts/389747/BitMEX%20Header%20Auto-hide.meta.js
// ==/UserScript==

/* globals jQuery */

(function() {
    'use strict';
    jQuery.noConflict();

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    function addExternalScript(js) {
        var head, script;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = js;
        head.appendChild(script);
    }

    addGlobalStyle('.popUpChat {display: none}');
    //addGlobalStyle('#header {display: none}');

    var hideTimer;
    var showTimer = null;
    // Start after page loaded 3s
    setTimeout(function() {
        var header = jQuery('#header');
        var tickerBar = jQuery('.tickerBar');
        if (header && tickerBar) {
            // Hide it first time
            hideTimer = setTimeout(function() {
                jQuery(header).hide();
            }, 2000);
            // Show it
            jQuery(tickerBar).mouseover(function() {
                if (hideTimer) clearTimeout(hideTimer);
                if (!showTimer) {
                    showTimer = setTimeout(function() {
                        if (showTimer) {
                            showTimer = null;
                            jQuery(header).show();
                        }
                    }, 500);
                }
            });
            // Hide after 1s moving out
            jQuery(tickerBar).mouseout(function() {
                if (hideTimer) clearTimeout(hideTimer);
                if (showTimer) {
                    clearTimeout(showTimer);
                    showTimer = null;
                }
                hideTimer = setTimeout(function() {
                    jQuery(header).hide();
                }, 2000);
            });
            /*
            jQuery(header).mouseenter(function() {
              if (hideTimer) clearTimeout(hideTimer);
              jQuery(header).show();
            });
            // Hide after 1s moving out
            jQuery(header).mouseout(function() {
                hideTimer = setTimeout(function() {
                    jQuery(header).hide();
                }, 1000);
            });
            */
        }
    }, 3000);
})();