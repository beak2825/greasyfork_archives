// ==UserScript==
// @name         KissThumbnails
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Adds Thumbnails to diverse Kiss sites lists and bookmarks
// @author       lolamtisch@gmail.com
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/

// @run-at       document-start 

// @match        *://kissanime.ru/BookmarkList*
// @match        *://kissanime.ru/AnimeList*
// @match        *://kissanime.ru/Genre*
// @match        *://kissanime.ru/Status*
// @match        *://kissanime.ru/Search*

// @match        *://kissmanga.com/BookmarkList*
// @match        *://kissmanga.com/MangaList*
// @match        *://kissmanga.com/Genre*
// @match        *://kissmanga.com/Status*
// @match        *://kissmanga.com/Search*

// @match        *://readcomiconline.to/BookmarkList*
// @match        *://readcomiconline.to/ComicList*
// @match        *://readcomiconline.to/Genre*
// @match        *://readcomiconline.to/Status*
// @match        *://readcomiconline.to/Search*

// @match        *://kisscartoon.se/BookmarkList*
// @match        *://kisscartoon.se/CartoonList*
// @match        *://kisscartoon.se/Genre*
// @match        *://kisscartoon.se/Status*
// @match        *://kisscartoon.se/Search*

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26297/KissThumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/26297/KissThumbnails.meta.js
// ==/UserScript==

(function(funcName, baseObj) {
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    function ready() {
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            readyList.push({fn: callback, ctx: context});
        }
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

GM_addStyle(".listing tr td:nth-child(1){height: 150px;}");

docReady(function() {
    (function() {
        'use strict';
        $( document ).ready(function() {
            if($('.listing tr td').css('vertical-align') != 'top'){
                $(".head").prepend("<th style='width:120px'></th>");
                $( ".listing tr td:nth-child(1)" ).css("height","150px");
                $( ".listing tr td:nth-child(1)" ).before("<td></td>");
                var i=0;
    
                $( ".listing tr td:nth-child(2)" ).bind('inview', function (event, visible) {
                    if ($(this).parent("tr").css("display") != "none"){
                        if (visible === true) {
                            $(this).tooltip().show();
                            $('.tooltip').css('cssText','opacity: 0 !important');
                            var title = $(".tooltip").last().find("img")[0].outerHTML;
                            $(this).prev().append(title);
                            $(this).tooltip().hide();
                            $(this).unbind('inview');
                            i++;
                        }
                    }
                });
                $(window).scroll();
            }
        });
    })();
    
    /**
     * External Script
     * author Remy Sharp
     * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
     */
    (function ($) {
        function getViewportHeight() {
            var height = window.innerHeight; // Safari, Opera
            var mode = document.compatMode;
    
            if ( (mode || !$.support.boxModel) ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                document.documentElement.clientHeight : // Standards
                document.body.clientHeight; // Quirks
            }
    
            return height;
        }
    
        $(window).scroll(function () {
            var vpH = getViewportHeight() + 500,
                scrolltop = (document.documentElement.scrollTop ?
                    document.documentElement.scrollTop :
                    document.body.scrollTop),
                elems = [];
            
            // naughty, but this is how it knows which elements to check for
            $.each($.cache, function () {
                if (this.events && this.events.inview) {
                    elems.push(this.handle.elem);
                }
            });
    
            if (elems.length) {
                $(elems).each(function () {
                    var $el = $(this),
                        top = $el.offset().top,
                        height = $el.height(),
                        inview = $el.data('inview') || false;
    
                    if (scrolltop > (top + height) || scrolltop + vpH < top) {
                        if (inview) {
                            $el.data('inview', false);
                            $el.trigger('inview', [ false ]);                        
                        }
                    } else if (scrolltop < (top + height)) {
                        if (!inview) {
                            $el.data('inview', true);
                            $el.trigger('inview', [ true ]);
                        }
                    }
                });
            }
        });
        
        // kick the event to pick up any elements already in view.
        // note however, this only works if the plugin is included after the elements are bound to 'inview'
        $(function () {
            $(window).scroll();
        });
    })(jQuery);
});