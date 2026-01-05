// ==UserScript==
// @name         EA C&I 24x7 - Grafana auto-scroll
// @namespace    https://graphs.citools.ea.com/dashboard/*
// @version      1.3
// @description  Auto-scroll for grafana. Adding an option to the top menu and stopping with mouse over on the screen.
// @author       Arturo Bruno <abruno@contractor.ea.com>
// @match        https://graphs.citools.ea.com/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12893/EA%20CI%2024x7%20-%20Grafana%20auto-scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/12893/EA%20CI%2024x7%20-%20Grafana%20auto-scroll.meta.js
// ==/UserScript==

$(function(){
    var scroll_speed = 15 * 1000;

    function start_scroll() {
        // console.log('Creating scroll');

        if($(window).scrollTop() > (page_height / 2)) {
            // console.log('Continue scroll top. ' + $(window).scrollTop() + ' < ' + (page_height / 2));
            top_or_bottom = 0;
        } else {
            // console.log('Continue scroll down. ' + $(window).scrollTop() + ' > ' + (page_height / 2));
            top_or_bottom = page_height;
        }

        clearInterval(auto_scroll_interval);

        auto_scroll_interval = setInterval(function(){
            scroll_page();
        }, scroll_speed + 10000);

        scroll_page();
    }

    function scroll_page() {
        // console.log('Scrooling');
        $('html, body').animate(
            {
                scrollTop: top_or_bottom
            },
            scroll_speed
        );

        if(top_or_bottom == page_height) {
            top_or_bottom = 0;
            // console.log('Next one is going up');
        } else if (top_or_bottom == 0) {
            top_or_bottom = page_height;
            // console.log('Next one is going down!');
        }
    }

    function stop_scroll() {
        // console.log('Stopping scrolling');
        $('html, body').stop();
        clearInterval(auto_scroll_interval);
    }

    page_height = 600;
    top_or_bottom = page_height;
    auto_scroll_interval = setInterval(null, null);

    setTimeout(function(){
        page_height = ($(document).height() - $(window).height()) + 400;

        $('ul.nav.pull-left.top-nav-dash-actions').append('<li><a id="auto-scroll-init" onclick="return false;">Auto-scroll</li>');

        $('#auto-scroll-init').click(function(event){
            var btn = this;
            
            if ($(btn).hasClass('running')) {
                $(btn).text('Auto-scroll').removeClass('running');
            }

            start_scroll();

            $('html, body').mouseenter(function() {
                $('html, body').stop();
                stop_scroll();
            }).mouseleave(function() {
                $('html, body').stop();
                start_scroll();
            });

            $(btn).text('Stop auto-scroll').addClass('running');

            return false;
        });
    }, 5000);
});