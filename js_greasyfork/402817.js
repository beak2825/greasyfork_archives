// ==UserScript==
// @name         IDOS – Uložit spojení do Google Kalendáře
// @description  Uloží spojení do Google kalendáře
// @version      1.3.0
// @icon         https://idos.cz/favicon.ico
// @author       Jan Cermak
// @match        https://idos.cz/*/spojeni/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @copyright    2022, Jan Cermak (https://jan-cermak.cz)
// @licence      MIT
// @homepageURL  https://github.com/cermakjn/idos-gcalendar-userscript
// @supportURL   https://github.com/cermakjn/idos-gcalendar-userscript/issues
// @contributionURL https://github.com/cermakjn/idos-gcalendar-userscript/pulls
// @namespace https://greasyfork.org/users/553587
// @downloadURL https://update.greasyfork.org/scripts/402817/IDOS%20%E2%80%93%20Ulo%C5%BEit%20spojen%C3%AD%20do%20Google%20Kalend%C3%A1%C5%99e.user.js
// @updateURL https://update.greasyfork.org/scripts/402817/IDOS%20%E2%80%93%20Ulo%C5%BEit%20spojen%C3%AD%20do%20Google%20Kalend%C3%A1%C5%99e.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author cermakjn
// ==/OpenUserJS==

(function() {
    'use strict';

    var shareLinkClass = 'add-to-google-calendar';
    var differentDayClass = 'color-red';
    var connectionNotesWithValues = ['stanoviště', 'nástupiště', 'nástupiště/kolej', 'kolej'];
    var connectionNotesWithoutValues = ['na znamení', 'vlak zastavuje jen na znamení nebo požádání'];

    function appendShareLink(element) {
        var links = element.find('ul.connection-expand__actions');
        links.css('width', '120%');

        var saveLink = jQuery('<li/>', {
            class: shareLinkClass
        }).append(jQuery("<a/>", {
            href: '#',
            class: 'ico-tt',
            title: 'Uložit do Google kalendáře',
            style: 'padding-left: 5px; opacity: 0.8;',
            html: '<span style="position: absolute; left: -9999px;">Uložit do Google kalendáře</span>'
        }).bind('click',function(e) {
            e.preventDefault();

            var eventSelector = jQuery(this).closest('div.detail-box');

            var connectionText = '';
            var startStation = null;
            var finishStation = null;
            var startTime = null;
            var finishTime = null;
            var startTimeMoved = false;
            var finishTimeMoved = false;

            var currentYear = new Date().getFullYear();

            var connectionDate = eventSelector.find('div.connection-head h2.date span.date-after').text().replace(/[a-z]/gi, '').split('.');
            var startDate = currentYear + connectionDate[1].padStart(2, '0') + connectionDate[0].padStart(2, '0');
            var startDateObject = new Date(currentYear, (connectionDate[1].padStart(2, '0') - 1), connectionDate[0].padStart(2, '0'));
            var finishDate = startDate;

            eventSelector.find('div.connection-details div.line-item div.outside-of-popup').each(function() {
                var connection = jQuery(this);

                var stations = connection.find('ul.stations li');
                var firstStation = stations.first();
                var lastStation = stations.last();
                var startTimeSelector = firstStation.find('p.time');
                var finishTimeSelector = lastStation.find('p.time');

                var connectionStartStation = getStationName(firstStation);
                var connectionStartTime = startTimeSelector.text();
                var connectionFinishStation = getStationName(lastStation);
                var connectionFinishTime = finishTimeSelector.text();
                var connectionStartNotes = buildStationNotes(firstStation);
                var connectionFinishNotes = buildStationNotes(lastStation);

                var transportTypeAndLine = connection.find('div.line-title h3 span').text();

                if (startStation === null) {
                    startStation = connectionStartStation;
                    startTime = getCalendarTime(connectionStartTime);

                    if (startTimeSelector.hasClass(differentDayClass)) {
                        startTimeMoved = true;
                    }
                }

                finishStation = connectionFinishStation;
                finishTime = getCalendarTime(connectionFinishTime);
                if (finishTimeSelector.hasClass(differentDayClass)) {
                    finishTimeMoved = true;
                }

                var walk = connection.find('div.walk');
                if (walk.length === 1) {
                    connectionText += walk.text().trim() + "\r\n\r\n";
                }

                connectionText += transportTypeAndLine + "\r\n";
                connectionText += connectionStartTime + ' ' + connectionStartStation + connectionStartNotes + "\r\n";
                connectionText += connectionFinishTime + ' ' + connectionFinishStation + connectionFinishNotes + "\r\n\r\n";
            });

            connectionText += eventSelector.find('div.connection-head p.total').text();

            // Increase the finish date in case of one of the time is in another day
            if ((startTimeMoved === true || finishTimeMoved === true) && !(startTimeMoved === true && finishTimeMoved === true)) {
                var finishDateObject = new Date(startDateObject.setDate(startDateObject.getDate() + 1));
                finishDate = finishDateObject.getFullYear().toString() + (finishDateObject.getMonth() + 1).toString().padStart(2, '0') + finishDateObject.getDate().toString().padStart(2, '0');
            }

            var eventName = startStation + ' - ' + finishStation;
            var eventDetail = connectionText;
            var eventDates = getCalendarDatetime(startDate, startTime) + '/' + getCalendarDatetime(finishDate, finishTime);
            var eventUrl = eventSelector.data('share-url');

            // Format: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/master/services/google.md
            var googleCalendarUrl = 'https://www.google.com/calendar/event?action=TEMPLATE&text=' + eventName;
            googleCalendarUrl += '&details=' + encodeURI(eventDetail);
            googleCalendarUrl += '&dates=' + eventDates;
            googleCalendarUrl += '&location=' + startStation;
            googleCalendarUrl += '&sprop=' + eventUrl;

            window.open(googleCalendarUrl);
        }));
        links.append(saveLink);
    }

    function getCalendarTime(time) {
        return time.replace(':', '').padStart(4, '0') + '00';
    }

    function getCalendarDatetime(date, time) {
        return date + 'T' + time;
    }

    function getStationName(station) {
        return station.find('strong.name').text();
    }

    function buildStationNotes(station) {
        var attrs = [];

        connectionNotesWithValues.forEach(function(attribute) {
            var value = station.find('span[title="' + attribute + '"]');
            if (value.length === 1) {
                attrs.push(attribute + ': ' + value.text());
            }
        });

        connectionNotesWithoutValues.forEach(function(attribute) {
            var value = station.find('span[title="' + attribute + '"]');
            if (value.length === 1) {
                attrs.push(attribute);
            }
        });

        if (attrs.length === 0) {
            return '';
        }

        return ' (' + attrs.join(', ') + ')';
    }

    function createShareLinks() {
        var connections = jQuery('div.connection-list>div.box');

        connections.each(function() {
            appendShareLink(jQuery(this));
        });
    }

    function init() {
        createShareLinks();

        jQuery('div.connection-list').bind('DOMNodeInserted', function () {
            jQuery(this).find('div.box').each(function() {
                if (jQuery(this).find('li.' + shareLinkClass).length === 0) {
                    appendShareLink(jQuery(this));
                }
            });
        });
    }

    init();
})();
