// ==UserScript==
// @name         Modif DashBoard
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  try to take over the world!
// @author       Maximilien Legras
// @match        http://fr1-mobile-dashboard-prd-01.vinci-energies.net/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/392369/Modif%20DashBoard.user.js
// @updateURL https://update.greasyfork.org/scripts/392369/Modif%20DashBoard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ev = new $.Event('style'),
        orig = $.fn.css;
    $.fn.css = function() {
        $(this).trigger(ev);
        return orig.apply(this, arguments);
    }

    $('app-page').bind('style', function(e) {
        console.log( $(this).attr('style') );
    });

    setTimeout(function() {
        console.log('ok');
        $("iframe").contents().find(".image").attr('style', function(i,s) {
            let str = '';
            if (s !== undefined) {
                str = s.replace('rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)');
            }
            return (str || '') + 'background-size: contain !important; background-repeat: no-repeat;'
        });

        $("iframe").contents().find(".integration").attr('style', 'font-size:22px !important');
        $("iframe").contents().find(".feed-title").attr('style', 'font-size:22px !important');
        $("iframe").contents().find(".feed-body").attr('style', 'font-size:20px !important; margin-top: 20px !important');
        $("iframe").contents().find(".message-details").attr('style', 'font-size:20px !important');

        $(".menu-button").click();
        $("#autoscroll").click();
        $(".ion-android-arrow-dropdown").click();
        $(".menu-button").click();
        $(".menu-button").hide();

    }, 15000);

    setInterval(function(){ 
        $("iframe").contents().find(".image").attr('style', function(i,s) {
            let str = '';
            if (s !== undefined) {
                str = s.replace('rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)');
            }
            return (str || '') + 'background-size: contain !important; background-repeat: no-repeat;'
        });

        $("iframe").contents().find(".integration").attr('style', 'font-size:22px !important');
        $("iframe").contents().find(".feed-title").attr('style', 'font-size:22px !important');
        $("iframe").contents().find(".feed-body").attr('style', 'font-size:20px !important; margin-top: 20px !important');
        $("iframe").contents().find(".message-details").attr('style', 'font-size:20px !important');
    }, 30000);

    setTimeout(function() {
        location.reload();
    }, 3600000);
})();