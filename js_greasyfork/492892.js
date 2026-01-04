// ==UserScript==
// @name         WhatsApp group events to ICS
// @license      Unlicense
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @description  Searches for messages containing a date(s) and a hyperlink in the currently open whatsapp chat (or rather, in messages that have been scrolled past), and lets you download them as an .ics for import into your favourite calendar app.
// @author       You
// @match        http://web.whatsapp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492892/WhatsApp%20group%20events%20to%20ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/492892/WhatsApp%20group%20events%20to%20ICS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 23-27 July 2024
    // 11 July to 25 August 2024(
    // 20 May to 19 June
    // 9-13 September
    // 19 July to 14 August 2024
    // 6-12 October 2024
    // 17-21 September
    //
    // "Mohamed Eladly
    // +20 114 558 3074
    // 209 kB
    // Open call for volunteers from European and non European countries to join one month summer volunteering project in Bulgaria  from 8 July - 8 August 2024 (fully funded)
    //
    //
    // All details and how to apply are available on our website from the following link
    // https://www.opportunit4u.com/2024/04/next-chapter-esc-teams-volunteering-in-bulgaria.html
    //
    // Best wishes
    // 2:11 pm"

    function scrape()
    {
        let events = {};    // We use a dictionary because it means that events encountred multiple times will not be duplicated.

        // Divs that are probably chat bubbles
        let bubbles = Array.from(document.getElementsByTagName('div'))
        .filter(e => e.hasAttribute('data-pre-plain-text'));

        // Go through them
        for (let i = 0; i < bubbles.length; i++)
        {
            let div = bubbles[i];

            let url   = undefined;
            let start = new Date();
            let end   = new Date();

            // Find dates
            const names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            let matches = div.innerText.matchAll(/(\d\d?)(st|nd|rd|th)?\s?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s?(-|to)?\s?(\d\d?)?(st|nd|rd|th)? (Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/g);
            let match   = matches.next().value;

            if (!match) continue;

            // Parse dates
            start.setDate(parseInt(match[1]));
            end  .setDate(parseInt(match[5] ?? start.getDate() + 1));

            end  .setMonth(names.indexOf(match[7].toLowerCase().slice(0,3)))
            start.setMonth(match[3] ? names.indexOf(match[3].toLowerCase().slice(0,3)) : end.getMonth())

            // Parse link
            let link = (div.innerText.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g) ?? [])[0];

            events[link] = {start: start, end: end};
        }

        return events;
    }

    function toICSDate(d)
    {
        let t = "";
        t += d.getUTCFullYear().toString();
        t += ("0" + d.getUTCMonth().toString()).slice(-2);
        t += ("0" + d.getUTCDate().toString()).slice(-2);
        t += "T000000Z";
        return t;
    }

    function makeICS(events)
    {
        let text = (
            "BEGIN:VCALENDAR\n" +
            "VERSION:2.0\n" +
            "PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n"
        );

        for (let [url, date] of Object.entries(events))
        {
            text += "BEGIN:VEVENT\n";
            text += `SUMMARY:${url.split('/').at(-1)}\n`;
            text += `URL:${url}\n`; // https://en.wikipedia.org/wiki/ICalendar
            text += `DTSTART:${toICSDate(date.start)}\n`;
            text += `DTEND:${toICSDate(date.end)}\n`;
            text += "END:VEVENT\n";
        }

        text += "END:VCALENDAR\n";
        return text;
    }

    // Create button
    let b = document.createElement('button');
    b.style.position="absolute";
    b.style.right="20px";
    b.style.top="50%";
    b.style.zIndex=10000;

    b.style.background="lightgreen";
    b.style.padding="40px"

    document.body.appendChild(b);

    // Call scraper
    document._scraped = scrape();

    setInterval(() => {
        document._scraped = Object.assign({}, document._scraped, scrape());     // Merge newly scraped events with existing ones
        b.innerText = `Scrape ${Object.entries(document._scraped).length} events`;
    }, 200);

    b.onclick = () => {
        // https://stackoverflow.com/a/48968694/6130358

        let blob = new Blob([makeICS(document._scraped)]);

        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'events.ics';
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    };
})();
