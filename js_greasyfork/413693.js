// ==UserScript==
// @name         SubsPlease Time Left Until Release
// @version      1.0.7
// @description  Time left until release of shows today and tomorrow
// @author       Hoshiburst
// @match        *://subsplease.org/
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @license      GPL-2.0+; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace    https://greasyfork.org/en/users/91364-hoshiburst
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/413693/SubsPlease%20Time%20Left%20Until%20Release.user.js
// @updateURL https://update.greasyfork.org/scripts/413693/SubsPlease%20Time%20Left%20Until%20Release.meta.js
// ==/UserScript==

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Sleep until the schedule table is loaded before we replace its contents.
 * Looking at the site's script, `load_schedule` will append a timer once the data is loaded so we can wait for that
 * to exist (instead of waiting until the schedule table has items - since it may be empty if a day has no shows)
 */
const sleepUntilTableLoads = async () => {
  let wcTimeElement = document.querySelector("#current-time .wc_time");
  while(!wcTimeElement) {
    await sleep(1000);
    wcTimeElement = document.querySelector("#current-time .wc_time");
  }
};

/**
 * Fetch the full schedule for a given timezone
 */
const getFullSchedule = async (timeZoneName) => {
  const response = await fetch(`https://subsplease.org/api/?f=schedule&tz=${timeZoneName}`);
  if (response.status !== 200) throw new Error(`Error fetching schedule: response status ${response.status}`);
  return (await response.json()).schedule;
}

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const zeroPad = (num) => num < 10 ? `0${num}` : `${num}`;

/**
 * Format milliseconds as +/-HH:mm
 */
const formatTimeMs = (ms) => {
  const duration = moment.duration(ms);
  const hoursFloat = Math.abs(duration.asHours());
  const hours = Math.trunc(hoursFloat);
  const minutes = Math.trunc((hoursFloat - hours) * 60);
  const sign = ms >= 0 ? '+' : '-';
  const timeLeft = `${sign}${zeroPad(hours)}:${zeroPad(minutes)}`;
  return timeLeft;
}

const addTimeLeftUntilShowtime = (show, showDate, now) => {
  const showTime = moment(`${showDate} ${show.time}`);
  const timeLeftMs = moment(showTime).diff(now);
  return {
    ...show,
    day: showTime.format('ddd'),
    aired: timeLeftMs < 0,
    timeLeft: formatTimeMs(timeLeftMs),
  }
};

/**
 * Build a html row for each schedule entry
 */
const buildRow = (show) => {
  const tr = document.createElement('tr');
  tr.className = 'schedule-widget-item';

  const showTd = document.createElement('td');
  const timeTd = document.createElement('td');
  showTd.className = 'schedule-widget-show';
  timeTd.className = 'schedule-widget-time';
  tr.appendChild(showTd);
  tr.appendChild(timeTd);

  const showLink = document.createElement('a');
  showLink.title = "Go to show";
  showLink.href = `/shows/${show.page}`;
  showLink.text = show.title;
  showLink.setAttribute('data-preview-image', show.image_url)
  showTd.appendChild(showLink);

  if (show.aired) {
    const timeImg = document.createElement('img');
    timeTd.appendChild(timeImg);
    timeImg.setAttribute('draggable', 'false');
    timeImg.setAttribute('role', 'img');
    timeImg.setAttribute('alt', '✔');
    timeImg.src = 'https://s.w.org/images/core/emoji/13.0.0/svg/2714.svg';
    timeImg.className = 'emoji';
  }
  const padding = show.aired ? ' ' : '';

  const timeTdText = document.createTextNode(`${padding}${show.day} ${show.time} (${show.timeLeft})`);
  timeTd.appendChild(timeTdText);

  return tr;
}

/**
 * Replace the old schedule table
 */
const populateScheduleTable = async (schedule) => {
  await sleepUntilTableLoads();
  const table = document.getElementById('schedule-table');
  table.innerHTML = "";
  const todayRows = schedule.today.map(buildRow);
  const tomorrowRows = schedule.tomorrow.map(buildRow);
  todayRows.forEach(row => table.appendChild(row));
  tomorrowRows.forEach(row => table.appendChild(row));
}

const run = async () => {
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fullSchedule = await getFullSchedule(timeZoneName);
  const now = moment();
  const todayDate = now.format('YYYY-MM-DD');
  const tomorrowDate = now.clone().add(1, 'day').format('YYYY-MM-DD');
  const todayAndTomorrowSchedule = {
    today: fullSchedule[weekday[now.day()]].map(show => addTimeLeftUntilShowtime(show, todayDate, now)),
    tomorrow: fullSchedule[weekday[(now.day() + 1) % 7]].map(show => addTimeLeftUntilShowtime(show, tomorrowDate, now))
  }
  await populateScheduleTable(todayAndTomorrowSchedule);
}

run();