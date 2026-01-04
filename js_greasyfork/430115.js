// ==UserScript==
// @name        *.d3..ru
// @namespace   d3
// @match		*://d3.ru/*
// @match		*://*.d3.ru/*
// @icon		https://d3.ru/static/i/logo_main_beta.png
// @version		0.1
// @description	demo!
// @author	 	stylok
// @run-at      document-start
// @grant		GM_setValue
// @grant		GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430115/%2Ad3ru.user.js
// @updateURL https://update.greasyfork.org/scripts/430115/%2Ad3ru.meta.js
// ==/UserScript==

(function() {

    'use strict';

    if (GM_getValue('var_2') != undefined) {
        console.log( 'TRUE: ' + GM_getValue('var_2') );
    } else {
         console.log( 'FALSE: ' + GM_getValue('var_2') );
    }

    // Default. Create and check variable — var_1
    GM_setValue('var_1', 'DATA...');
    //console.log( 'default: ' + GM_getValue('var_1') );

    // replace DOM
    document.write();
    document.close();

    // Checking the data — var_1. WORK
    console.log( '1. test: ' + GM_getValue('var_1') );

    // Does not work. Create and add a new variable.
    GM_setValue('var_2', 'NEW DATA');
    console.log( '2. test: ' + GM_getValue('var_2') );

})();