// ==UserScript==
// @name        Enhanced hwr-berlin.de Timetable/Stundenplan ⏱️📚
// @description Mobile friendly and improved desktop view. Focus on the current day, lightly suppress past events. Source code: https://github.com/bucherfa/enhanced-hwr-timetable
// @namespace   https://github.com/bucherfa/enhanced-hwr-timetable
// @homepageURL https://github.com/bucherfa/enhanced-hwr-timetable
// @supportURL  https://github.com/bucherfa/enhanced-hwr-timetable/issues
// @author      bucherfa
// @include     https://ipool.lehre.hwr-berlin.de/data/stundenplan/*
// @include     https://moodle.hwr-berlin.de/fb2-stundenplan/stundenplan.php
// @license     GPL-3.0-or-later
// @version     1.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/410664/Enhanced%20hwr-berlinde%20TimetableStundenplan%20%E2%8F%B1%EF%B8%8F%F0%9F%93%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/410664/Enhanced%20hwr-berlinde%20TimetableStundenplan%20%E2%8F%B1%EF%B8%8F%F0%9F%93%9A.meta.js
// ==/UserScript==

const monthAbbreviation = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const STORAGE_KEY_IGNORED = 'ENHANCED_TIMETABLE_IGNORED';

function main() {
  const days = parseEvents();
  const today = todayString();
  const ignoredStrings = getIgnoredStrings();
  for (const key of Object.keys(days)) {
    if (key < today) {
      for (const event of days[key]) {
        event.style.borderStyle = 'dashed';
        event.style.opacity = '40%';
      }
    } /*else if (key === today) {
      for (const event of days[key]) {
        // :)
      }
    } else {
      for (const event of days[key]) {
        //event.style.borderWidth = '0';
      }
    }*/
    for (const event of days[key]) {
      for (const string of ignoredStrings) {
        if (event.textContent.includes(string)) {
          event.style.borderWidth = '0';
          event.style.opacity = '20%';
        }
      }
    }
  }
  const todayColumn = todayColumnElements();
  for (const element of todayColumn.greenish) {
    element.style.backgroundColor = '#EDEDE9';
  }
  for (const element of todayColumn.purple) {
    element.style.backgroundColor = '#E9E9ED'
  }
  if (window.location.href.includes('https://ipool.lehre.hwr-berlin.de/data/stundenplan/informatik/')) {
    buildMobileFriendlyPage(days);
  }
}

// for https://moodle.hwr-berlin.de/fb2-stundenplan/stundenplan.php
const courseSelector = document.querySelector('select[name="course"]');
if (courseSelector) {
  courseSelector.addEventListener('change', () => { setTimeout(main, 500) });
}

function buildMobileFriendlyPage(days) {
  addMobileMetaTag();
  addMobileStyle();
  toggleMobileView();
  const daysElement = buildDays(days);
  document.body.appendChild(daysElement);
}

function addMobileMetaTag() {
  const meta = document.createElement('meta');
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1";
  document.getElementsByTagName('head')[0].appendChild(meta);
}

function toggleMobileView() {
  document.body.classList.toggle('mobile--js');
}

function buildDays(days) {
  const root = document.createElement('div');
  root.classList.add('custom');
  const today = todayString();
  for (const dayString of Object.keys(days)) {
    const events = days[dayString];
    if (dayString >= today && events.length > 0) {
      const day = document.createElement('div');
      day.classList.add('day');
      root.appendChild(day);
      const dateElement = document.createElement('div');
      dateElement.innerText = new Date(dayString).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
      dateElement.classList.add('day__date');
      day.appendChild(dateElement);
      const eventsElement = document.createElement('div');
      day.appendChild(eventsElement);
      for (const event of events) {
        const eventElement = document.createElement('div');
        eventElement.innerText = event.innerHTML.split('<br>').join(' ⋅ ').replace('<span style="color:#0000ff">', '').replace('</span>', '');
        eventElement.classList.add('day__event');
        eventsElement.appendChild(eventElement);
      }
    }
  }
  return root;
}

function todayColumnElements() {
  const elements = { meta: [], purple: [], greenish: [] };
  const today = todayString();
  const weeksTables = document.querySelectorAll('table');
  for (const weekTable of weeksTables) {
    if (elements.length > 0) {
      break;
    }
    let minElementOffset;
    let maxElementOffset;
    const weekDayElements = weekTable.querySelectorAll('.t');
    for (const weekDayElement of weekDayElements) {
      const unparsedWeekDayText = weekDayElement.innerText.split(', ')[1];
      const parsedWeekDayText = parseDate(unparsedWeekDayText);
      if (parsedWeekDayText === today) {
        minElementOffset = Math.round(weekDayElement.getBoundingClientRect().x);
        maxElementOffset = minElementOffset + weekDayElement.offsetWidth;
      }
    }
    const EventElements = weekTable.querySelectorAll('td');
    for (const eventElement of EventElements) {
      const eventElementOffset = Math.round(eventElement.getBoundingClientRect().x);
      if (eventElementOffset >= minElementOffset && eventElementOffset < maxElementOffset) {
        switch(eventElement.classList[0]) {
          case 'rd2':
          case 'rdl2':
          case 'rdm2':
          case 'rdr2':
            elements.greenish.push(eventElement);
            break;
          case 'rd1':
          case 'rdl1':
          case 'rdm1':
          case 'rdr1':
            elements.purple.push(eventElement);
            break;
          case 't':
          case 'tf':
            elements.meta.push(eventElement);
            break;
          default:
            // nothing
        }
      }
    }
  }
  return elements;
}

function parseEvents() {
  const days = {};
  const weeksTables = document.querySelectorAll('table');
  for (const weekTable of weeksTables) {
    const weekDayElementOffsets = {};
    const weekDayElements = weekTable.querySelectorAll('.t');
    for (const weekDayElement of weekDayElements) {
      const weekDayElementOffset = Math.round(weekDayElement.getBoundingClientRect().x);
      const unparsedWeekDayText = weekDayElement.innerText.split(', ')[1];
      const parsedWeekDayText = parseDate(unparsedWeekDayText);
      weekDayElementOffsets[weekDayElementOffset] = parsedWeekDayText;
      days[parsedWeekDayText] = [];
    }
    const eventElements = weekTable.querySelectorAll('.v');
    for (const eventElement of eventElements) {
      const eventElementOffset = Math.round(eventElement.getBoundingClientRect().x);
      let dateString;
      for (let i = 0; i<200; i++) {
        dateString = weekDayElementOffsets[eventElementOffset - i];
        if (dateString) {
          break;
        }
      }
      days[dateString].push(eventElement);
    }
  }
  return days;
}

function parseDate(text) {
  const array = text.split(' ');
  const day = array[0].slice(0, -1);
  let month = monthAbbreviation.indexOf(array[1]) + 1;
  if (month < 10) {
    month = '0' + month;
  }
  const year = array[2];
  return `${year}-${month}-${day}`;
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

function addMobileStyle () {
  const newNode = document.createElement('style');
  newNode.textContent = `
.custom {
  display: none;
  font-family: Arial,Helvetica,sans-serif;
}

.day {
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin: 0.5rem 0;
}
.day__date {
  padding: 0.5rem;
  background-color: #5B8C5A;
  border-radius: 0.25rem 0.25rem 0 0;
  color: white;
}
.day__event {
  padding: 0.5rem;
  border-bottom: 1px solid #D4D8D4;
}

.day__event:last-child {
  border-bottom: 0;
}

@media only screen and (max-width: 767px) {
  .mobile--js > table,
  .mobile--js > .w1,
  .mobile--js > .w2,
  .mobile--js > .fz,
  .mobile--js > .fzl {
    display: none;
  }
  .mobile--js > .w1:first-child {
    display: block;
    margin: 0.5rem;
  }
  .mobile--js > .custom {
    display: block;
  }
}
    `;
  const target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(newNode);
}

function getIgnoredStrings() {
  const ignoredStringsString = localStorage.getItem(STORAGE_KEY_IGNORED);
  if (ignoredStringsString) {
    return JSON.parse(ignoredStringsString);
  }
  return [];
}

main();
