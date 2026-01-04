// ==UserScript==
// @name         better wiktionary
// @namespace    http://tampermonkey.net/
// @version      2024-03-24.5
// @description  improving the webpage layout for reader, and adding hideshow button for every language
// @author       Al Arcus
// @match        *://*.wiktionary.org/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wiktionary.org
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490699/better%20wiktionary.user.js
// @updateURL https://update.greasyfork.org/scripts/490699/better%20wiktionary.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add CSS to hide .toclevel-1 > ul by default
    var style = document.createElement('style');
    style.innerHTML = `
        .toc-toggle-button {
            position: absolute;
            left: 5px;
            min-width: 18px;
            min-height: 18px;
            padding: 0;
            font-size: 0.7rem;
        }

        .mw-body-content, .mw-first-heading{
            margin: 0 auto;
            margin-top: 0px;
            margin-right: auto;
            margin-bottom: 0px;
            margin-left: auto;
            max-width: 948px;
        }
        .mw-content-ltr > p, li{
            max-width: 49em;
        }

        #mw-panel {
          left: auto !important;
          right: 0px;
        }
        .vector-search-box {margin-right: 0;}
        [class="portal expanded"]{margin-left: 11.2px; margin-right: 9.6px;}

        .mw-body, #mw-data-after-content, .mw-footer {
            margin-right: 10em;
        }

        .mw-body {
            border-right-width: 1px;
        }

        #mw-head {
          right: 10em;
          left: 5em;
          width: auto;
        }

        .toc {
                position: fixed;
                top: 0;
                left: 0;
                width: auto;
                min-width: 160px;
                height: 100%;
                background-color: #f6f6f6;
                display: block;
                overflow-y: auto;
                padding: 0px;
                border: 1px solid #a7d7f9;
            }
        .toc > ul { margin-left: 2em; }

        .NavFrame, .NavHead {
            background-image: none !important;
        }
        .translations-cell {
            background-color: #231400 !important;
        }
    `;
    document.head.appendChild(style);

    function adjustContentMargin() {
        var divWidth = $('#toc').width()+15.8;
        $('.mw-body').css('margin-left', divWidth);
        $('.mw-footer').css('margin-left', divWidth);
        $('#left-navigation').css('margin-left', divWidth-80.3);
    }
    adjustContentMargin()

    // Loop through each .toclevel-1 element
    $('.toclevel-1').each(function(index) {
        // Extract the name from the href attribute
        var name = $(this).find('a').attr('href').replace('#', '');

        // Set ul's id to toc-{name}-sublist
        $(this).find('ul').attr('id', 'toc-' + name + '-sublist');

        // Add button to hide/show TOC subsection
        var button = $('<button class="toc-toggle-button">+</button>');
        $(this).prepend(button);

        // Add click event to toggle visibility of subsection
        button.click(function() {
            $('#toc-' + name + '-sublist').toggle();
        });
    });

    $('.toclevel-1 > ul').css('display', 'none')
    $('.toctogglespan').css('display', 'none')

})();
