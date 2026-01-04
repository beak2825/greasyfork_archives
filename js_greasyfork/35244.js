// ==UserScript==
// @name         Wazeopedia Enhancements
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2017.11.17.01
// @description  Fixes anchor scrolling on wazeopedia due to having a fixed height header
// @author       JustinS83
// @include      https://wazeopedia.waze.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35244/Wazeopedia%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/35244/Wazeopedia%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if ($) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function init(){
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name="' + this.hash.slice(1) +'"]');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 60 //offsets for fixed header
                    }, 250);
                    //return false;
                }
            }
        });
        $(window).load(function(){setTimeout(function(){
        //Executed on page load with URL containing an anchor tag.
        if($(location.href.split("#")[1])) {
            //debugger;
            var target = $('#'+location.href.split("#")[1]);
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 60 //offset height of header here too.
                }, 250);
                return false;
            }
        }},25);});
    }
})();
