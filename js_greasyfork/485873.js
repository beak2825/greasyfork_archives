// ==UserScript==
// @name         AVV/MoBY Save to Calendar
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  adds a button to save a connection to your calendar
// @author       Kiki
// @match        https://fahrtauskunft.avv-augsburg.de/sl3+/trip*
// @match        https://bahnland-bayern.de/de/moby/efa/app/trip*
// @icon         https://cdn-icons-png.flaticon.com/512/45/45533.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485873/AVVMoBY%20Save%20to%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/485873/AVVMoBY%20Save%20to%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.debug('AVV Save to Calendar');

    window.setTimeout(startTimer, 2000);
    //window.onbeforeunlaod = function() { console.log('unload'); };

    console.debug('AVV Save to Calendar - done');
})();


function startTimer()
{
    console.debug('startTimer');
    unsafeWindow.myTimer = function()
    {
        //console.debug('myTimer');
        unsafeWindow.doIt();
        window.setTimeout(unsafeWindow.myTimer, 1000);
        //console.debug('myTimer - done');
    };
    window.setTimeout(unsafeWindow.myTimer, 1000);
    console.debug('startTimer - done');
}

unsafeWindow.doIt = function()
{
    console.debug('doIt');

    var loc = window.location.href;
    //var buttonBoxSelector = 'div > main div > div:nth-child(3) > div > div > section > div > div + section + div > div > div > button + div';
    var buttonBoxSelector = 'div#root button + div';

    if(getSiteName() == "unknown")
    {
        console.debug('url not relevant: ' + loc);
        unsafeWindow.oldUrl = null;
        return;
    }
    if(!document.querySelector(buttonBoxSelector))
    {
        console.debug('relevant element not found');
        return;
    }
    /* url change does not happen when Aktuualisieren is pressed
       we need to check presence of our own button instead
    if(unsafeWindow.oldUrl && unsafeWindow.oldUrl == loc)
    {
        console.debug('URL has not changed');
        return;
    }*/
    if(document.getElementById(myCalendarButtonId) != null)
    {
        console.debug('calendar button already created, nothing to do');
        return;
    }
    else
    {
        unsafeWindow.oldUrl = loc;
    }

    createCalendarButton(document.querySelector(buttonBoxSelector));
    console.info('Calendar button created');
}

/////////////////////////////////////////////////////////////
var myCalendarButtonId = 'myCalendarButtonId';
function createCalendarButton(where)
{
    console.debug('createCalendarButton');

    var btn = where.firstChild.cloneNode(true);
    var newSvg = createElementFromHTML('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 506.49"><path fill-rule="nonzero" d="M294.24 17.11C294.24 7.69 303.53 0 315.1 0s20.87 7.65 20.87 17.11v74.85c0 9.42-9.3 17.11-20.87 17.11s-20.86-7.65-20.86-17.11V17.11zm145.02 345.22v19.94c0 4.69-3.91 8.61-8.6 8.61h-34.24v34.26c0 4.67-3.92 8.59-8.61 8.59h-19.96c-4.67 0-8.59-3.86-8.59-8.59v-34.26h-34.27c-4.69 0-8.61-3.87-8.61-8.61v-19.94c0-4.74 3.88-8.61 8.61-8.61h34.27v-34.26c0-4.73 3.86-8.59 8.59-8.59h19.96c4.74 0 8.61 3.92 8.61 8.59v34.26h34.24c4.74 0 8.6 3.97 8.6 8.61zm-61.44-124.22c36.98 0 70.56 15.04 94.83 39.35C496.96 301.7 512 335.25 512 372.31c0 36.99-15.04 70.56-39.3 94.83-24.32 24.31-57.89 39.35-94.88 39.35-37.03 0-70.56-15.04-94.84-39.3-24.32-24.27-39.34-57.86-39.34-94.88 0-37.06 15.04-70.61 39.31-94.89l.69-.63c24.24-23.9 57.53-38.68 94.18-38.68zm78.74 55.41c-20.09-20.11-47.96-32.58-78.74-32.58-30.5 0-58.14 12.25-78.19 32.02l-.55.6c-20.15 20.14-32.62 48-32.62 78.75s12.46 58.6 32.61 78.75c20.1 20.13 47.98 32.6 78.75 32.6 30.76 0 58.65-12.47 78.77-32.58 20.11-20.12 32.58-48.01 32.58-78.77 0-30.75-12.47-58.61-32.61-78.79zM56.81 242.28c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.94-11.53 2.24-11.53h56.94c1.19 0 2.25 5.2 2.25 11.53 0 6.39-.94 11.57-2.25 11.57H56.81zm90.78 0c-1.19 0-2.24-5.2-2.24-11.57 0-6.38.93-11.53 2.24-11.53h56.94c1.18 0 2.24 5.2 2.24 11.53 0 6.39-.94 11.57-2.24 11.57h-56.94zm90.77 0c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.93-11.53 2.24-11.53h56.94c1.18 0 2.24 5.15 2.24 11.49a175.09 175.09 0 0 0-16.44 11.61h-42.74zM56.94 308.52c-1.18 0-2.24-5.2-2.24-11.57 0-6.39.93-11.58 2.24-11.58h56.94c1.18 0 2.24 5.19 2.24 11.58 0 6.37-.93 11.57-2.24 11.57H56.94zm90.77 0c-1.18 0-2.24-5.2-2.24-11.57 0-6.39.93-11.58 2.24-11.58h56.94c1.18 0 2.24 5.19 2.24 11.58 0 6.37-.93 11.57-2.24 11.57h-56.94zM57.06 374.8c-1.18 0-2.24-5.2-2.24-11.59 0-6.36.94-11.56 2.24-11.56H114c1.19 0 2.25 5.2 2.25 11.56 0 6.39-.94 11.59-2.25 11.59H57.06zm90.78 0c-1.19 0-2.25-5.2-2.25-11.59 0-6.36.94-11.56 2.25-11.56h56.94c1.18 0 2.24 5.2 2.24 11.56 0 6.39-.94 11.59-2.24 11.59h-56.94zM106.83 17.11c0-9.42 9.29-17.11 20.86-17.11s20.86 7.65 20.86 17.11v74.85c0 9.42-9.32 17.11-20.86 17.11-11.57 0-20.86-7.65-20.86-17.11V17.11zM22.98 163.64h397.39V77.46c0-5.79-4.73-10.51-10.52-10.51h-38.1c-6.39 0-11.57-5.2-11.57-11.57 0-6.38 5.18-11.58 11.57-11.58h38.1c18.59 0 33.7 15.12 33.7 33.71v136.81c-7.59-2.62-15.41-4.73-23.44-6.29v-21.38h.26H22.98v223.16c0 5.78 4.72 10.51 10.51 10.51h188.86c2.15 8.02 4.86 15.84 8.12 23.36H33.71C15.13 443.68 0 428.61 0 410.02V77.55c0-18.6 15.1-33.71 33.71-33.71h40.67c6.38 0 11.58 5.21 11.58 11.57 0 6.39-5.2 11.59-11.58 11.59H33.71c-5.79 0-10.53 4.7-10.53 10.51v86.16h-.2v-.03zm158.94-96.69c-6.37 0-11.57-5.2-11.57-11.57 0-6.38 5.2-11.58 11.57-11.58h77.55c6.39 0 11.59 5.2 11.59 11.58 0 6.37-5.2 11.57-11.59 11.57h-77.55z"/></svg>');
    var oldSvg = btn.querySelector('path');
    var svgClass = oldSvg.getAttribute("class");
    oldSvg.replaceWith(newSvg);
    // we need to add the original class to the new SVG
    newSvg.setAttribute("class", svgClass)

    // todo: change click event handler

    where.insertBefore(btn, where.firstChild);

    btn.firstChild.setAttribute("title", "Fahrt in den Kalender eintragen");
    btn.firstChild.setAttribute("aria-label", "Fahrt in den Kalender eintragen");
    btn.firstChild.onclick = addToCalendar;
    btn.id = myCalendarButtonId;
}

function createElementFromHTML(htmlString)
{
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

//////////////////////////////////////////////////////////
function getSiteName()
{
  var loc = window.location.href;

  if(loc.match(/https:\/\/fahrtauskunft\.avv-augsburg\.de\/sl3\+\/trip\/\d+\?/))
  {
      return "avv";
  }
  else if(loc.match(/https:\/\/bahnland-bayern\.de\/de\/moby\/efa\/app\/trip\/\d+\?/))
  {
      return "moby";
  }
  else
  {
      return "unknown";
  }
}

//////////////////////////////////////////////////////////
function addToCalendar()
{
    console.info('addToCalendar');

    // main info
    var mainInfo = document.querySelector('section >h2 + div > div > div:has( > p)') || document.querySelector('section >h2 + div > div > div > div:has( > p)');
    var divs = mainInfo.querySelectorAll('p');
    var from = divs[0].innerText;
    var to = divs[1].innerText;
    from = from.replace(/^.*?:/g, 'Fahrt von');
    to = to.replace(/^.*?:/g, 'nach');
    var x = mainInfo.querySelectorAll('p')[2].innerText.matchAll(/(Abfahrt|Ankunft) am ([0-9\.]*) um ([0-9:]*)/gm);
    x = Array.from(x)[0];
    var dt = x[2];
    // here we still have a bug: if the user asked for an arrival time, the date of departure may actually be the previous day
    var tm = x[3];
    var ySelector = '';
    switch(getSiteName())
    {
      case "avv":
            //ySelector = 'main section section div > p:not([style*="color"]):not([aria-hidden])';
            ySelector = 'div[id^="trip-overview-description-"] > div > div > div > div > span';
            break;
      case"moby":
            ySelector = 'div[id*="trip-overview-description"] div[style*="flex-direction"] > span';
            break;
      default:
            console.error('Unknown site name: ' + getSiteName());
            return; // should never happen
    }
    var y = document.querySelectorAll(ySelector);
    var tStart = innerTextWithoutChildren(y[0]);
    var tEnd = innerTextWithoutChildren(y[1]);
    // duration is split across multiple tags, if over 59 minutes. One for hours, one for minutes. Todo: combine (text, not numbers!)
    // but it is not used anyway, so dump it
    // var duration = y[2].innerText;
    console.info(from + ' ' + to + ' ' + dt + ' ' + tStart + '-' + tEnd);

    var description = "";
    unsafeWindow.bAbAn = false; // false: ab, true: an

    // step-wise info
    divs = document.querySelectorAll('div:has(>h3) > div > div > div > div > div');
    divs.forEach((div) => {
        //console.log(div);
        var cls = div.getAttribute("class");
        var p = div.querySelector('div.' + cls + ' > div > div > p,div.' + cls + ' > div > div > span');
        if(p != null && div.querySelector('div.' + cls + ' > div > div >div > div > div > p') != null && div.querySelector('div.' + cls + ' > div > div > div > svg') == null)
        {
            // departure or arrival step
            var time = p.innerText;
            var station = div.querySelector('div.' + cls + ' > div > div >div > div > div > p').innerText;
            var platform = ""; // no platform can happen
            if(div.querySelector('div.' + cls + ' > div > div > div > div > div:nth-child(2) > p') != null)
            {
                platform = div.querySelector('div.' + cls + ' > div > div > div > div > div:nth-child(2) > p').innerText;
            }

            var means = "";
            if(div.nextSibling != null)
            {
                div.nextSibling.querySelectorAll('div > div > div > span:not(:has(+ p))').forEach(function(item) { means += item.innerText + " "; });
                div.nextSibling.querySelectorAll('div > div > div > span:has(+ p)').forEach(function(item) { means += item.nextSibling.innerText + " "; });
                means = means.trim();
            }

            description = description + genAbAn() + ' ' + time + ' ' + station + ' ' + platform + ' ' + means + '\r\n';
        }
        else
        {
            var walkElements = div.querySelectorAll('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div + button > span > div > div >div > p');
            //
            if(walkElements.length > 0)
            {
                //walk/wait step
                walkElements.forEach((walk) => {
                    description = description + walk.innerText + '\r\n';
                });
            }
            else if(div.querySelector('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p') != null)
            {
                // means of transport step
                means = div.querySelector('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p').innerText;
                var directionElement = div.querySelector('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p + div > p,div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p + div > span');
                var direction = "";
                if(directionElement != null)
                {
                    direction = directionElement.innerText;
                }
                //var direction = div.querySelector('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p + div > p,div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div > div > p + div > span').innerText;
                var durationElement = div.querySelector('div.' + cls + ' > div:nth-child(2) > div > div:nth-child(2) > div + button p');
                var duration = "";
                if(durationElement != null)
                {
                    duration = durationElement.innerText;
                }
                description = description + '  ' + means + ' ' + direction + ' ' + duration + '\r\n';
            }
        }
    });

    console.info(description);

    //console.info('start: ' + dt + ' - ' + tStart);
    //console.info('makeDate: ' + makeDate(dt, tStart));

    ical_download(from + ' ' + to, makeDate(dt, tStart), makeDate(dt, tEnd), description);
}

function innerTextWithoutChildren(element)
{
    return [].reduce.call(element.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
}

function genAbAn()
{
    var retVal = (unsafeWindow.bAbAn) ? "an" : "ab";
    unsafeWindow.bAbAn = !unsafeWindow.bAbAn;
    return retVal;
}


////////////////////////////////////////////////////////////
// helper functions to create and download ical
// based on https://gist.github.com/dudewheresmycode/ff1d364c1c6d787fe7ea

function ical_download(eventName, dtStart, dtEnd, description)
{
  //name of file to download as
  const fileName = 'fahrt.ics';

  var now = new Date();
  var ics_lines = [
  "BEGIN:VCALENDAR",
  "X-LOTUS-CHARSET:UTF-8",
  "VERSION:2.0",
  "PRODID:https://fahrtauskunft.avv-augsburg.de/",
  "METHOD:PUBLISH",
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "X-LIC-LOCATION:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10",
  "END:STANDARD",
  "END:VTIMEZONE",
  "BEGIN:VEVENT",
  "UID:fahrt-" + now.getTime() + "@avv-augsburg.com",
  "CLASS:PUBLIC",
  "SUMMARY:" + eventName,
  "DTSTART;TZID=Europe/Berlin:" + ISOdateString(dtStart),
  "DTEND;TZID=Europe/Berlin:" + ISOdateString(dtEnd),
  "DTSTAMP:" + ISOdateString(now),
  "DESCRIPTION:" + description.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n'),
  "LAST-MODIFIED:" + ISOdateString(now),
  "END:VEVENT",
  "END:VCALENDAR"
  ];

  //var dlurl = 'data:text/calendar;base64,' + btoa(ics_lines.join('\r\n'));
  var dlurl = 'data:text/calendar;base64,' + b64EncodeUnicode(ics_lines.join('\r\n'));

  try
  {
    saveCalendar(dlurl, fileName);
  }
  catch(e)
  {
    console.error(e);
  }
}

// instead of btoa(), we use this, because the strings are unicode
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded Unicode,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

//iso date for ical formats
function ISOdateString(d)
{
  if(typeof d != 'object' || d.constructor.name != 'Date')
  {
    throw new Error('Parameter is not a date!');
  }
  else
  {
    return d.getFullYear() + zeroPadding(d.getMonth() + 1) + zeroPadding(d.getDate()) + 'T' + zeroPadding(d.getHours()) + zeroPadding(d.getMinutes()) + zeroPadding(d.getSeconds());
  }
}

//zero padding for data fixes
function zeroPadding(s)
{
  return ("0"+s).slice(-2);
}

function saveCalendar(fileURL, fileName)
{
  var save = document.createElement('a');
  save.href = fileURL;
  save.target = '_blank';
  save.download = fileName || 'unknown';

  var evt = new MouseEvent('click',
  {
      //'view': window,
      'bubbles': true,
      'cancelable': false
  });
  save.dispatchEvent(evt);
}

function makeDate(sDate, sTime)
{
  var dateParts = sDate.split(".");
  var timeParts = sTime.split(":");

  // month is 0-based, that's why we need dataParts[1] - 1
  var retVal = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], +timeParts[0], +timeParts[1]);
  return retVal;
}

