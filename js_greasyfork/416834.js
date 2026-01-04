// ==UserScript==
// @name         netflix fix browser extension
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix &lrm;
// @author       Kokuru
// @match        https://www.netflix.com/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416834/netflix%20fix%20browser%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/416834/netflix%20fix%20browser%20extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var load = function(){
        if ( $("#migaku-subtitle-container").length === 0){
            setTimeout(function(){
                load();
            }, 100);
        } else {
            var func = function() {
                $(".migaku-no-reading").each(function( index ) {
                    var html = $( this ).html()
                    if (html === "<c.japanese><c.bg_transparent>&amp;</c.bg_transparent></c.japanese>"){
                        $( this ).hide()
                        $( this ).next().hide()
                        $( this ).next().next().hide()
                    }
                });
            };

            $("#migaku-subtitle-container").on('DOMSubtreeModified', "", function() {
                func()
            });

            $(".subBrowser").on('DOMSubtreeModified', "", function() {
                func()
            });
        }
    }
    load();
})();