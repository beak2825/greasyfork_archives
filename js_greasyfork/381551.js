// ==UserScript==
// @name         ZeeFilter+
// @namespace    none
// @version      2019.04.08.2154
// @description  A way to clear capture and deploy page filters
// @author       techncial13
// @supportURL   https://Discord.me/TheShoeStore
// @match        https://www.munzee.com/m/*/captures/*
// @match        https://www.munzee.com/m/*/deploys/*
// @match        https://www.munzee.com/m/*/undeploys/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381551/ZeeFilter%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/381551/ZeeFilter%2B.meta.js
// ==/UserScript==

( function() {
    'use strict';
    let strSubPage = document.location.pathname.split( '/' );
    $( 'div.types-icons.row.row-centered > p:last' )
        .before(
        '<div class="col-lg-1 col-xs-4 col-sm-1 col-md-1 col-centered">&nbsp;</div>' +// empty space
        '<div class="col-lg-1 col-xs-4 col-sm-1 col-md-1 col-centered">' +// start reset
        '<a href="/m/' + strSubPage[ 2 ] + '/' + strSubPage[ 3 ] + '/">' +// start reset link
        '<img class="type-0" src="https://gardenpainter.ide.sk/delete_munzee.png"></a></div>'// reset link image & close all
    );
} )();