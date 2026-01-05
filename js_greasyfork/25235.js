// ==UserScript==
// @name         IDOS – uložení spojení do Google Kalendáře
// @namespace    http://idos.cz/
// @version      1.0.3
// @description  Skript přidá do výpisu spojení z IDOSu vedle odkazu „Přidat do kalendáře“ nový odkaz „Přidat do Google Kalendáře“, který umožní dané spojení přidat do Google Kalendáře přímo.
// @author       Filip Jirsák
// @match        http://pid.idos.cz/spojeni/*
// @match        http://jizdnirady.idnes.cz/*/spojeni/*
// @connect      self
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25235/IDOS%20%E2%80%93%20ulo%C5%BEen%C3%AD%20spojen%C3%AD%20do%20Google%20Kalend%C3%A1%C5%99e.user.js
// @updateURL https://update.greasyfork.org/scripts/25235/IDOS%20%E2%80%93%20ulo%C5%BEen%C3%AD%20spojen%C3%AD%20do%20Google%20Kalend%C3%A1%C5%99e.meta.js
// ==/UserScript==

var CALENDAR_ID = "calendar.id";

(function() {
    'use strict';

    function datumSpojeni(text) {
        return text.replace(/(\d{1,2})\.(\d{1,2})\./, '2016$2$1');
    }

    function casSpojeni(text) {
        return text.replace(/(\d{2}):(\d{2})/, '$1$2')+'00';
    }

    function kalendarniDatum(datum, casOd, casDo) {
        return datum+'T'+casOd+'/'+datum+'T'+casDo;
    }

    function title(text) {
        return 'spojení ' + text.replace('»', '→');
    }

    function parseTime(text) {
        if (text.match(/\d{2}:\d{2}/)) {
            return text;
        }
    }

    function trimDown(text) {
        if (text) {
            text = text.trim();
            if (text) {
                return text;
            }
        }
    }

    function exportCalendar(icalLink) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: icalLink,
            onload: function(data) {
                var lines = data.responseText.split(/\n/);
                var ical = {};
                $.each(lines, function() {
                    var cols = this.trim().match(/(.*?):(.*)/);
                    if (cols) {
                        ical[cols[1]] = cols[2];
                    }
                });
                var params = {
                    action: 'TEMPLATE',
                    text: ical.SUMMARY.replace(/>>/, '→'),
                    details: ical.DESCRIPTION.replace(/\\n/g, '\n'),
                    dates: ical.DTSTART+'/'+ical.DTEND
                };
                var calendarId = GM_getValue(CALENDAR_ID);
                if (calendarId) {
                    params.src = calendarId;
                }

                window.open('http://www.google.com/calendar/event?' + jQuery.param(params), '_blank');
            }
        });
    }

    function createCalendarLink(node, icalLink) {
        var link = $('<a href="#">Přidat do Google Kalendáře</a>')
            .click($.proxy(exportCalendar, undefined, icalLink));
        $('p.links', node).append(' | ', link);
    }

    function appendLinks() {
        $('.results').each(function() {
            var icalLink = new URL($('p.links > a:contains("Přidat do kalendáře")', this).attr('href'), window.location.href);
            createCalendarLink(this, icalLink);
        });
    }

    appendLinks();
})();

GM_registerMenuCommand("Zvolit uživatelský kalendář", function() {
    var calendarId = GM_getValue(CALENDAR_ID);
    if (!calendarId) {
        calendarId = "@group.calendar.google.com";
    }
    calendarId = window.prompt("Zadejte ID uživatelského Google kalendáře:", calendarId);
    if (calendarId) {
        GM_setValue(CALENDAR_ID, calendarId);
    }
});
