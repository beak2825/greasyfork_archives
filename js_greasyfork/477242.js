// ==UserScript==
// @name         canvas days
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight day in weekprogramma
// @author       You
// @match        https://canvas.hu.nl/courses/39942
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hu.nl
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477242/canvas%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/477242/canvas%20days.meta.js
// ==/UserScript==

const weekProgramTdSelector = '#course_syllabus > table:first-of-type tbody td';

const startDate = new Date('2023-08-31');

const currentDate = new Date();

const timeDiff = currentDate.getTime() - startDate.getTime();

const dayDiff = Math.floor((timeDiff / (1000 * 3600 * 24)));

let dayOffset = parseInt(getCookie('dayOffset'));

let weekProgramTds;

if (!dayOffset) {
    dayOffset = 0
}

(function() {
    'use strict';

    weekProgramTds = $(weekProgramTdSelector);

    setDay();

    console.log(
`=============================================================
Use the function window.get_day_offset() to get the current day offset
Use the function set_day_offset() to offset the day
Example: set_day_offset(3) or set_day_offset(-2)
==============================================================`)

})();

function set_day_offset(offset) {
    weekProgramTds[dayDiff + dayOffset].style.background = '';
    setDayOffset(offset);
    setDay();
    return console.log(`Day offset set to: ${dayOffset}`);
}

function get_day_offset() {
    return console.log(`Current day offset: ${dayOffset}`);
}

function setDayOffset(offset) {
    dayOffset = offset;

    setCookie('dayOffset', offset, 9999);
}

function setDay() {
    $(weekProgramTds).css('background', '')

    weekProgramTds[dayDiff + dayOffset].style.background = 'yellow';
}

unsafeWindow.get_day_offset = get_day_offset;
unsafeWindow.set_day_offset = set_day_offset;

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
