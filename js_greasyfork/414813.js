// ==UserScript==
// @name         FV - Daily Wheel
// @version      1.1.2
// @description  Add a link to the Daily Wheel on the Daily Streak page.
// @author       msjanny (#7302)
// @match        https://www.furvilla.com/dailies*
// @match        https://www.furvilla.com/wheel*
// @grant        none
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/414813/FV%20-%20Daily%20Wheel.user.js
// @updateURL https://update.greasyfork.org/scripts/414813/FV%20-%20Daily%20Wheel.meta.js
// ==/UserScript==

(function() {
    'use strict';
  /* globals $:false */

    $('document').ready( function() {
        var url = window.location.href;
        if (url.includes('furvilla.com/dailies')) {
            $('h2').eq(0).append($('<a href="https://www.furvilla.com/wheel" class="btn">Daily Wheel</a>'));

            if ($('.btn[value="Claim Reward"]').length) {
                var elemTop = $('.btn[value="Claim Reward"]').last().offset().top;
                var elemBottom = elemTop + $('.btn[value="Claim Reward"]').last().height();

                // add 'scroll down' indicator
                var btn = $('<i class="fas fa-arrow-circle-down"></i>');
                btn.css({'font-size': '50px','position': 'fixed','bottom': '20px','right': '20px','z-index': '3','cursor':'pointer'});
                $('.left-column').append(btn);

                if ($(window).scrollTop() + $(window).height() >= elemTop)
                    btn.hide();

                btn.click(function() {
                    $('html, body').animate({scrollTop:elemBottom-$(window).height()}, '300');
                });

                // check if unclaimed rewards at bottom of screen
                $(window).scroll(function() {
                    if ($(window).scrollTop() + $(window).height() >= elemTop)
                        btn.hide();
                    else
                        btn.show();
                });
            }
        }
        else
            $('.header-right-toolbar-buttons').append($('<a href="https://www.furvilla.com/inventory?type=is_openable&sort=new_old" class="btn">Inventory</a>'));

    });
})();