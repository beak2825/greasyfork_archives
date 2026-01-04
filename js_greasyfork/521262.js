// ==UserScript==
// @name         Kemono
// @namespace    lander_scripts
// @version      1.02
// @description  Site improvements
// @author       You
// @match        https://kemono.su/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://kemono.su/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521262/Kemono.user.js
// @updateURL https://update.greasyfork.org/scripts/521262/Kemono.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    console.info('💗 Kemono - Site improvements: Script Loaded');

    setTimeout(function(){
        $( ".post__thumbnail .image-link" ).each(function(index) {
            $(this)[0].click();
            console.log($(this)[0]);
        });
    }, 2000);

})();