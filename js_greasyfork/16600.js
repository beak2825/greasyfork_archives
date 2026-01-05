// ==UserScript==
// @name         Adjust Man1 Layout
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Benny Lutati
// @match        http://www.man-1.co.il/*
// @description  Adjust Man-1 site layout.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16600/Adjust%20Man1%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/16600/Adjust%20Man1%20Layout.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function(){

    var BLOCKING_DIV_SELECTOR = 'div.TopMediaCon.clearfix';
    var NAV_SIDE_BAR_SELECTOR = "div#navVerticalByID2.VerticalBarContainer.VerticalBarContainerByID2";
    
    function fixPageLayout() {
        $(BLOCKING_DIV_SELECTOR).height(0);
        $(NAV_SIDE_BAR_SELECTOR).css({
            right: '-205px',
            top: '35px'
        });
    }
    
    fixPageLayout();
    $(function() {
        fixPageLayout();
    });
    
})();
