// ==UserScript==
// @name            WaniKani Stealth Mode
// @namespace 		wk-stealth-mode
// @description     A muted colour version of WaniKani for more discreet use. Includes subtle lesson/review UI for less visually obtrusive colours, and greyscale site-wide everywhere else.
// @version         1.0.0

// @author          Saxon Cameron, @saxoncameron
// @website         http://www.saxoncameron.com/
// @source          https://github.com/saxoncameron/WaniKani-Stealth-Mode

// @match           https://www.wanikani.com/*
// @grant           none
// @run-at          document-start
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @license         MIT; http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/39019/WaniKani%20Stealth%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/39019/WaniKani%20Stealth%20Mode.meta.js
// ==/UserScript==

'use strict';

(function($) {
    // =====================================================
    // NOTE: CSS is populated via build task
    // =====================================================

    var CSS = [
        '#loading,',
        '#loading-screen,',
        '#answer-form,',
        '#additional-content,',
        '#supplement-info,',
        '#information,',
        '#question-type .srs,',
        'body.wk-stealth-mode {',
        '  -webkit-filter: grayscale(80%);',
        '          filter: grayscale(80%);',
        '  /* DO NOT REMOVE: wk-stealth-desaturation-level */',
        '}',
        '#lessons #main-info,',
        '#reviews #question #character {',
        '  background: grey;',
        '  padding-bottom: 25px;',
        '  position: relative;',
        '}',
        '#lessons #main-info,',
        '#lessons #main-info #meaning,',
        '#lessons #main-info #character,',
        '#reviews #question #character,',
        '#reviews #question #character #meaning,',
        '#reviews #question #character #character {',
        '  text-shadow: 2px 2px 0 #535353;',
        '}',
        '#lessons #main-info.radical::before,',
        '#reviews #question #character.radical::before {',
        '  background-color: #0093DD;',
        '  content: \'radical\';',
        '}',
        '#lessons #main-info.kanji::before,',
        '#reviews #question #character.kanji::before {',
        '  background-color: #DD0093;',
        '  content: \'kanji\';',
        '}',
        '#lessons #main-info.vocabulary::before,',
        '#reviews #question #character.vocabulary::before {',
        '  background-color: #9300DD;',
        '  content: \'vocab\';',
        '}',
        '#lessons #main-info::before,',
        '#reviews #question #character::before {',
        '  position: absolute;',
        '  text-transform: uppercase;',
        '  text-shadow: 1px 1px black;',
        '  left: 50%;',
        '  font-family: \'Arial\' !important;',
        '  -webkit-transform: translateX(-50%);',
        '          transform: translateX(-50%);',
        '  bottom: 20px;',
        '  width: 60px;',
        '  height: 25px;',
        '  box-sizing: border-box;',
        '  z-index: 99;',
        '  font-size: 10px;',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  border-radius: 5px;',
        '}',
        '@media (max-width: 767px) {',
        '  #lessons #main-info::before,',
        '  #reviews #question #character::before {',
        '    font-size: 9px;',
        '    height: 20px;',
        '    width: 50px;',
        '    bottom: 10px;',
        '  }',
        '}',
        '#question #question-type .srs {',
        '  top: -105px;',
        '}',
        '@media (max-width: 767px) {',
        '  #question #question-type .srs {',
        '    top: -55px;',
        '  }',
        '}',
    ].join('\n');

    // =====================================================
    // =====================================================

    var CLASSES = {
        GREYSCALE: 'wk-stealth-mode'
    };

    function init() {
        console.log('=====================================');
        console.log('WaniKani Stealth mode activated.');
        console.log('-------------------------------------');
        console.log('Author: Saxon Cameron, @saxoncameron');
        console.log('Website: http://saxoncameron.com/');
        console.log('=====================================');

        // Add greyscale overlay to every page except lesson/reviews, which have specific styles
        if (window.location.href.indexOf('/review/session') < 0 && window.location.href.indexOf('/lesson/session') < 0) {
            $(document).ready(function() {
                $('body').addClass(CLASSES.GREYSCALE);
            });
        }

        // Append CSS to the document
        $('head').append(['<!-- START - WaniKani Stealth Mode CSS -->', '<style type="text/css">' + CSS + '</style>', '<!-- END - WaniKani Stealth Mode CSS -->'].join(''));
    }

    init();
})(jQuery);