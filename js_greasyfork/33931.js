// ==UserScript==
// @name         xHamster Enhancement - XE
// @locale       en
// @namespace    farami
// @version      0.1.3
// @description  Adds endless scroll and increases the default player size.
// @author       Genevera (original by farami)
// @require      http://code.jquery.com/jquery-latest.js
// @match       *://xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33931/xHamster%20Enhancement%20-%20XE.user.js
// @updateURL https://update.greasyfork.org/scripts/33931/xHamster%20Enhancement%20-%20XE.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function(){
    $.ajaxSettings.beforeSend=function(xhr){
        xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
    };
})(jQuery);
var xes = function() {
    var currentPage = 1;
    var totalPages = -1;
    var currentPageName = location.href;
    var endlessScrollRunning = false;
    var settingsMenuOpened = false;

    var config = {
        resizePlayer: true,
        removeAds: true,
        endlessScroll: {
            enabled: true,
            triggerAtPercent: 80
        }
    };

    var init = function() {
        if (config.resizePlayer) {
            adjustPlayerSize();
        }

        if (config.removeAds) {
            hideElements();
        }

        if (config.endlessScroll.enabled) {
            enableEndlessScroll();
        }
    };

    var hideElements = function() {
        if (location.href.indexOf('movies') === -1) {
            return;
        }

        $('.aspt,.sponsorBottom,.avdo.adVideo2,#supportAds,.avdo.fr').remove();
    };

    var adjustPlayerSize = function() {
        if (getCurrentPage() !== 'movies') {
            return;
        }

        $('#playerBox').width(1000);
        document.getElementById('playerSwf').style.height = '777px';
        document.getElementById('player').style.height = '777px';
        document.getElementById('commentBox').style.width = 'auto';
        $('video').height(777).width(980);
        $('#player').width(980);
    };

    var enableEndlessScroll = function() {
        var pager = $('.pager > table > tbody > tr > td > div');
        // totalPages = pager.find(':nth-last-child(2)').html();
        
        if (!getCurrentPage().contains("movies") && totalPages !== undefined) {
            //$('.box.boxTL > .head,.box > .head.gr').append('<span style="float: right">Total Pages: ' + totalPages  + '</span>');
        }
        
        currentPageName = pager.find('a').attr('href');
        if (!getCurrentPage().contains("user")) {
            $('.pager').remove();
        }

        var videoList = $(".boxC.videoList.clearfix");
        $(".fl").children().not(".clear").addClass("no-padding").prependTo(videoList);
        $(".related-categories").prependTo(videoList);
        $(".video").not(".no-padding").addClass("no-padding");
        $(".fl,.boxC > .clear,.category-description,.vDate").remove();

        document.addEventListener('scroll', triggerEndlessScroll);
    };

    var triggerEndlessScroll = function() {
        if (getScrollPercent() >= config.endlessScroll.triggerAtPercent) {
            if (endlessScrollRunning) {
                return;
            }

            endlessScrollRunning = true;
            // load next page
            $.get(currentPageName.replace('/'+currentPage, '/'+(currentPage + 1)), function(page) {
                var page;

                // for some reason xhamster displays search results differently to everything else
                if (currentPageName.contains('search.php')) {
                    page = $(page).find('.boxC > table > tbody > tr > td > *').not('.avdo.fr');
                    page.appendTo('.boxC > table > tbody > tr > td');
                }
                else if (currentPageName.contains('friends')) {
                    page = $(page).find('div .friendsList > *');
                    page.appendTo('div .friendsList');
                }
                else {
                    page = $(page).find('div .video');
                    var am = $('.pager').parent();
                    page.appendTo(am);
                }

                $(".fl,.boxC > .clear,.category-description,.vDate").remove();
                $(".video").not(".no-padding").addClass("no-padding");
                endlessScrollRunning = false;

                currentPageName = currentPageName.replace('/'+currentPage, '/'+(currentPage + 1));
                currentPage++;
            });
        }
    };

    var getCurrentPage = function() {
        return /xhamster.com\/(\w+)/i.exec(location.href)[1];
    }

    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };

    String.prototype.contains = function(text) {
        return this.toLowerCase().indexOf(text.toLowerCase()) > -1;
    };

    var getScrollPercent = function() {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return h[st]||b[st] / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    };

    return { init: init, config: config };
}();

$(document).ready(function() {
    xes.init();
});