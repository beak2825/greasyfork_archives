// ==UserScript==
// @name         Hide ChatGPT Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the sidebar of the ChatGPT website
// @author       justGPT
// @license      MIT
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466336/Hide%20ChatGPT%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/466336/Hide%20ChatGPT%20Sidebar.meta.js
// ==/UserScript==

GM_addStyle(`
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
`);

(function() {
    'use strict';

    const leftMenu = '#__next > div.overflow-hidden.w-full.h-full.relative > div.dark';

    function getSidebarWidth() {
        return  $(leftMenu).width();
    }

    function getSidebarWidthWithMargin() {
        return getSidebarWidth() + 6;
    }

    function show(){
        $button.animate({
            left: getSidebarWidthWithMargin() + "px"
        });

        $(leftMenu).animate({
            width: "show"
        });

    }

    function hide(){
        $(leftMenu).animate({
            width: 'hide'
        });

        $button.animate({
            left: "6px" // button will be at the edge of the window
        });
    }

    function initial_hide(){
        $(leftMenu).animate({
            width: 'hide'
        });

        $button.animate({
            left: "6px" // button will be at the edge of the window
        });

        $button.find("#myIcon").attr("class", "fa-solid fa-arrow-right-to-bracket");

    }


    var $button = $("<button>")
    .html('<i id="myIcon" class="fa-solid fa-arrow-right-from-bracket"></i>')
    .click(function() {
        var $icon = $("#myIcon");
        if ($(leftMenu).is(":visible")) {
            hide();
            $icon.css("transform", "none");
            $icon.attr("class", "fa-solid fa-arrow-right-to-bracket"); // Update the class when flipping
        } else {
            show();
            $icon.css("transform", "scaleX(-1)");
            $icon.attr("class", "fa-solid fa-arrow-right-from-bracket"); // Update the class when flipping
        }
    });


    setTimeout(initial_hide, 200); // Delay execution of initial_hide() function by 1 second

    $button.css({
        position: "fixed",
        top: "6px",
        left: getSidebarWidthWithMargin() + "px",
        'background-color': '#202123',
        'color': 'rgba(255,255,255,var(--tw-text-opacity))',
        'padding': '.75rem',
        'text-align': 'center',
        'text-decoration': 'none',
        'display': 'inline-block',
        'font-size': '.875rem',
        'cursor': 'pointer',
        'border-radius': '.375rem',
        'border-width': '1px',
        'border-color': 'hsla(0,0%,100%,.2)',
        'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.3)',
        'font-family': '"Roboto", sans-serif',
        "transition": "background-color 0.2s ease" // Adjust the duration (0.3s) as desired
    });

    $button.hover(function(){
        $(this).css("background-color", "#2b2c2f");
    }, function(){
        $(this).css("background-color", "#202123");
    });

    $("body").append($button);

})();
