// ==UserScript==
// @name         Coub Full Width Timeline and Videos
// @namespace    https://github.com/FireEmerald
// @version      1.1.2
// @description  Videos inside timeline are displayed in full width
// @author       FireEmerald
// @license      MIT
// @match        http*://coub.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375530/Coub%20Full%20Width%20Timeline%20and%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/375530/Coub%20Full%20Width%20Timeline%20and%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var coubFullWidthScript = (function CoubFullWidthScript () {
        // Private member
        var runOnce = false;

        // https://stackoverflow.com/a/26831113/4300087
        var inViewport = function( el ) {
            var elH = $(el).outerHeight(),
                H = $(window).height(),
                r = $(el)[0].getBoundingClientRect(), t=r.top, b=r.bottom;
            return Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H));
        };

        // https://stackoverflow.com/a/115492/4300087
        var calcScaledWidth = function( height, width, maxHeight ) {
            var ratio = Math.max(width / width, maxHeight / height);
            width = ratio * width;
            height = ratio * height;

            return Math.floor(width);
        };

        return {
            // Public member
            attachMaxWidthToViewer: function( viewer ) {
                // Detect available height
                var pageContainer = document.querySelector('.page-container');
                var header = document.querySelector('header');
                var menu = document.querySelector('.page-menu');
                if (!pageContainer || !header || !menu)
                    return;

                var viewHeight = inViewport(pageContainer);
                var availableHeight = viewHeight - header.offsetHeight - menu.offsetHeight - 120; // 120 = description of coubs / better scrolling

                var maxWidth = calcScaledWidth( viewer.offsetHeight, viewer.offsetWidth, availableHeight );

                // Remove existing css of viewer
                $(viewer).removeAttr('style');

                $(viewer).css({
                    'max-width': maxWidth + 'px'
                });

                console.log('FullWidthTL::Restricted to: ...x' + maxWidth);
            },
            removeBanner: function() {
                var banners = document.querySelectorAll('.coub.timeline-banner');
                for(var banner of banners) {
                    //console.log("Removed Banner!");
                    banner.remove();
                }
            }
        };
    })();

    // Execute
    $(window).bind("load", function() {
        GM_addStyle('.coubs-list,.page__body.grid-container,.story__container { width: 100% !important; }');
        GM_addStyle('.page-container,.page__content { width: 90%; }');

        var sidebarExists = document.querySelectorAll('.timeline-right-block').length > 0;
        var exludeSidebar = ' - 330px';
        if (!sidebarExists)
            exludeSidebar = '';

        GM_addStyle(".coubs-list[view='list'] .coub--timeline,.coubs-list[view='listWithoutScroll'] .coub--timeline,.coubs-list[data-type='stories'] .story-card { width: calc(calc(100%)" + exludeSidebar + ") !important; }");

        // https://stackoverflow.com/a/16726669/4300087
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes)
                    return;

                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];

                    if (addedNode.className && addedNode.classList.contains('viewer')) {
                        //console.log('FullWidthTL::Viewer added: "' + addedNode.className + '"' + addedNode.offsetHeight + "x" + addedNode.offsetWidth);
                        coubFullWidthScript.attachMaxWidthToViewer(addedNode);
                    }
                }
                coubFullWidthScript.removeBanner();
            });
        });

        observer.observe(document.body, {
            childList: true
            , subtree: true
            , attributes: false
            , characterData: false
        });
    });
})();