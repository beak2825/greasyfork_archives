// ==UserScript==
// @name         OC Monitor
// @namespace    ocMonitor
// @version      1.1.3
// @description  Provides a link to the organized crimes page if the player is part of an OC that is ready
// @include      *.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://greasyfork.org/scripts/21221/code/Script%20Lib.js
// @downloadURL https://update.greasyfork.org/scripts/27482/OC%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/27482/OC%20Monitor.meta.js
// ==/UserScript==
/* jshint -W097 */

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    try {
        // Don't even bother if there's no sidebar.
        if ($('#menu-list-accordion').length === 0) {
            return;
        }
        
        var userProfileUrl = $('.menu-info-wrapper > .menu-info-row > .menu-info-row-value > a').attr('href');
        var userIdMatch = userProfileUrl.match(/^\/profiles.php\?XID=(\d+)$/);
        if (!userIdMatch) {
            console.error('OC Monitor: Could not find user id in sidebar!');
            return;
        }
        var userId = userIdMatch[1];
        
        
        /*
         * Adds a green notification to the top of the page.
         *
         * @param {string} the HTML to put inside the notification box
         */
        var addNotificationInPage = function(notificationHtml) {
            $('div.content-wrapper').prepend('<div class="m-top10" id="display-request-state"><div class="info-msg-cont green border-round"><div class="info-msg border-round">' +
                                             '<i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><div class="change-logger">' +
                                             '<p>' + notificationHtml + '</p>' +
                                             '</div></div></div></div></div><hr class="delimiter-999 m-top10 m-bottom10"></div>');
        };

                
        var checkOc = true;
        var lastCallString = localStorage.ocMonitorLastCall || null;
        if (lastCallString !== null) {
            var lastCallDate = new Date(JSON.parse(lastCallString));
            if (Date.now() - lastCallDate < 10 * 60 * 1000) {
                // We checked the server within the last tenminutes, don't bother doing it again since it only
                // updates every hour. User will get a false-positive result after the OC was completed or canceled
                // until the server updates. Solution TBD.
                checkOc = false;
            }
        }
        
        
        /*
         * Notifies the user via a sidebar button and/or a notification message if an OC is ready or almost ready.
         *
         * @param {Date} the date that the OC will be ready
         */
        var notifyIfOcReady = function(ocReadyDate) {
            console.debug('OC will be ready at ' + ocReadyDate + '.');
            
            var destinationUrl = '/factions.php?step=your#/tab=crimes';
            
            var timeToOcReadySeconds = (Date.now() - ocReadyDate) / 1000;
            var ocIsReady = timeToOcReadySeconds >= 0;
            if (ocIsReady) {
                // The organized crime is ready; add a button to the sidebar and highlight it.
                var sidebarSectionSelector = 'li.m-account';
                var $ocIcon = $('<i class="crimes-navigation-icons left iconPulseExpiring"></i>');
                var $ocElement = $('<span class="list-link-name">OC Ready!</span>').css('padding-top', '4px');
                
                CreateSidebarButton(sidebarSectionSelector, $ocIcon, $ocElement, destinationUrl);
                $ocElement.parent().parent().parent().attr('class', 'bg-red act');
            }
            
            if (document.URL.includes('travelagency.php') && timeToOcReadySeconds >= -7 * 3600) {
                // The user is on the travel agency page and there's less than 7 hours to go until the OC is ready,
                // so give them a big notification so they're aware before they fly.
                if (ocIsReady) {
                    addNotificationInPage('Your organized crime is ready! Go to <a href="' + destinationUrl +
                                          '">Organized Crimes</a> to initiate it before you fly.');
                } else {
                    addNotificationInPage('Your organized crime will be ready in ' +
                                          new Date(-timeToOcReadySeconds * 1000).toISOString().substr(11, 8) +
                                          '. Please be back in Torn in time to initiate it.');
                }
            }
        };
        
        
        if (!checkOc) {
            var lastReadyTimeString = localStorage.ocMonitorLastReadyTime || null;
            if (lastReadyTimeString !== null) {
                var lastReadyTimeDate = new Date(JSON.parse(lastReadyTimeString));
                notifyIfOcReady(new Date(JSON.parse(lastReadyTimeString)));
            } else {
                console.debug('User is not currently involved in a planned OC.');
            }
            return;
        }
        
        
        $.ajax({
            url: 'https://lt.relentless.pw/members/crimes.php',
            type: "POST",
            data: {id: userId}
        }).done(function(response) {
            try {
                localStorage.ocMonitorLastCall = Date.now();
                console.debug(response);
                if (response.time_completed === -1) {
                    console.debug('User is not currently involved in a planned OC.');
                    localStorage.removeItem('ocMonitorLastReadyTime');
                    return;
                }

                var readyDate = new Date(response.time_completed);
                localStorage.ocMonitorLastReadyTime = readyDate.getTime();
                notifyIfOcReady(readyDate);
                return;
            } catch (error) {
                console.log(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
})();