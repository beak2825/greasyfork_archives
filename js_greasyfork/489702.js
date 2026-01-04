// ==UserScript==
// @name         Standard OG colors
// @namespace    http://tampermonkey.net/
// @version      1.47
// @description  Standard OG colors script
// @author       You
// @match        https://*.standard.sk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=standard.sk
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489702/Standard%20OG%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/489702/Standard%20OG%20colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load the Karma and DM Sans fonts from Google Fonts
    var fontUrls = [
        'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Karma:wght@300;400;500;600;700&display=swapa',
        'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap'
    ];
    fontUrls.forEach(function(url) {
        GM_addStyle('@import url("' + url + '");');
    });

    function applyStyles(selector, styles) {
        document.querySelectorAll(selector).forEach(function(element) {
            for (var property in styles) {
                element.style[property] = styles[property];
            }
        });
    }

    // logo
    applyStyles('header .main-logo', {
        'height': '50px',
        'paddingRight': '55px',
        'position': 'absolute',
        'bottom': '-15px',
        //'left': '42px'
    });
    applyStyles('.main-logo path', {
        'fill': 'black',
        'transform': 'scale(1.8)'
    });
    applyStyles('.main-logo svg', {
        'overflow': 'visible'
    });

    // region logo
    applyStyles('.region-logo', {
        'position': 'absolute',
        'left': '120px'
    });
    // profile, search
    applyStyles('.header .header--right', {
        'background': '#afafaf',
        //'right': '-360px'
    });

    // banner
    applyStyles('.bg-standard_red', {
        'backgroundColor': 'white'
    });

    // banner text
    applyStyles('.header a', {
        'color': 'black',
        //'fontSize': '16px'
    });

    // banner small background
    applyStyles('.header .menu', {
        'backgroundColor': 'white'
    });

    // hover menu items
    applyStyles('.submenu', {
        'backgroundColor': 'white'
    });
    applyStyles('.header .cat-label', {
        'color': 'black'
    });
    //applyStyles('.header .header--middle', {
    //    'left': '300px'
    //});

    // minuta background
    applyStyles('.background-pink', {
        'backgroundColor': '#fbfbfb'
    });

    // single article title
    applyStyles('.single__title', {
        'fontFamily': '"Karma", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontSize': '32px',
        'fontWeight': '600',
        'lineHeight': '1.25'
    });

    // multi article title
    applyStyles('.article__title hover', {
        'fontFamily': '"Karma", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontWeight': '600',
        'fontSize': '22px',
        'color': '#3d3434'
    });

    // multi article main article title
    applyStyles('.layout__single.w-full .article__title', {
        'fontFamily': '"Karma", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontWeight': '600',
        'fontSize': '28px',
        'color': '#3d3434'
    });

    // main article bg
    applyStyles('.bg-standard_pink', {
        'backgroundColor': 'white'
    });

    // multi article description
    applyStyles('.article__description a', {
        'fontFamily': '"DM Sans", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontWeight': '400',
        'fontSize': '16px',
        'color': 'black'
    });

    // article subtitle
    applyStyles('.single__content .content>p:first-of-type strong, .single__content .content>p:first-of-type', {
        'fontFamily': '"DM Sans", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'color': 'black',
        'fontWeight': 'bold',
        'fontSize': '18px',
        'lineHeight': '1.6'
    });

    // single article excerpt
    applyStyles('.single__excerpt p', {
        'fontFamily': '"DM Sans", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'color': 'black',
        'fontWeight': 'bold',
        'fontSize': '18px',
        'lineHeight': '1.6',
        'display': 'none'
    });

    // article column
    applyStyles('.single__content .content', {
        'maxWidth': '600px'
    });

    // paragraph
    applyStyles('.single__content .content p', {
        'fontFamily': '"DM Sans", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontSize': '18px',
        'lineHeight': '1.6',
    });

    // h2 heading
    applyStyles('.single__content .content h2', {
        'fontFamily': '"DM Sans", sans-serif, "Sharp Grotesk Bold 15", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontWeight': 'bold',
        'fontSize': '18px'
    });

    // footer
    applyStyles('.footer', {
        'background': 'white'
    });

    // footer bottom
    applyStyles('.footer__bottom.padding--row', {
        'background': 'white'
    });

    // discussion enable article interaction
    document.getElementById("overlay").remove();

    // minuta
    applyStyles('.minute__articles__result .article .article__content p strong', {
      'color': 'black',
      'fontWeight': '600'
    });
})();