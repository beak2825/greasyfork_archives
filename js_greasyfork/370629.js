// ==UserScript==
// @name         Toggl - Weekly report
// @namespace    https://github.com/fabiencrassat
// @version      0.8.6
// @description  Calculate and display the work day percentages
// @author       Fabien Crassat <fabien@crassat.com>
// @include      https://toggl.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370629/Toggl%20-%20Weekly%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/370629/Toggl%20-%20Weekly%20report.meta.js
// ==/UserScript==

/* global $ */

/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */

'use strict';

const weekDaySunday = 0;
const weekDayMonday = 1;
const weekDayTuesday = 2;
const weekDayWednesday = 3;
const weekDayThursday = 4;
const weekDayFriday = 5;
const weekDaySaturday = 6;

const weekDays = [
  weekDaySunday,
  weekDayMonday,
  weekDayTuesday,
  weekDayWednesday,
  weekDayThursday,
  weekDayFriday,
  weekDaySaturday
];
// eslint-disable-next-line max-len, prefer-named-capture-group
const urlToFollow = /^https:\/\/toggl\.com\/app\/reports\/weekly\/\d+\/period\/([a-z])\w+/u;
// eslint-disable-next-line max-len
const apiTimeEntriesUrlToFollow = 'https://toggl.com/reports/api/v3/workspace/2294752/weekly/time_entries';
const apiProjectsUrlToFollow = 'https://toggl.com/api/v9/me/projects';
const decimalLenght = 2;

let projects = [];

// Must be on the global scope
const oldFetch = fetch;

const buildFetch = function buildFetch(doSomethingWithResponse) {
  // We want to overwrite fetch with our new one
  // eslint-disable-next-line no-global-assign
  fetch = function fetch(url, options) {
    const promise = oldFetch(url, options);
    // Do something with the promise
    promise.then(doSomethingWithResponse).catch(error => {
      console.error('Error in fetch processing', error);
    });
    return promise;
  };
};
const backFetch = function backFetch() {
  // eslint-disable-next-line no-global-assign
  fetch = oldFetch;
};

const sleep = function sleep() {
  const timeout = 1500;
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const cleanDisplay = function cleanDisplay() {
  $('.fcr-toggl').remove();
};

const percentage = function percentage(numerator, denumerator) {
  const denumeratorIsZero = 0;
  if (!numerator || !denumerator || denumerator === denumeratorIsZero) {
    return denumeratorIsZero;
  }
  return numerator / denumerator;
};

const getProjectName = function getProjectName(project) {
  if (project) {
    return project.name;
  }
  return null;
};

/**
 * The weeklyData argument in the V3 API has this values
 * [
 *   {
 *     'user_id': 2644339,
 *     'project_id': 150741509,
 *     'seconds': // Mon, Tue, Wed, Thu, Fri, Sat, Sun
 *       [0, 7200, 0, 0, 0, 0, 0],
 *   },
 *   {...}
 * ]
 *
 * The result:
 * [
 *   {
 *     client: '',
 *     project: 'name',
 *     data: // Mon, Tue, Wed, Thu, Fri, Sat, Sun
 *       [0, 0.23, 0, 0, 0, 0, 0],
 *     conso: sum(weeklyData[].seconds) / sum(allProjectsDays),
 *   },
 *   {...}
 * ]
 */
const calculate = function calculate(weeklyData) {
  const projectSum = {};
  const daysSum = [];
  weeklyData.forEach(line => {
    // Sum the line
    projectSum[line.project_id] = line.seconds.reduce((acc, cur) => acc + cur);
    // Sum the days
    weekDays.forEach(day => {
      const initialValue = 0;
      daysSum[day] = (daysSum[day] || initialValue) + line.seconds[day];
    });
  });

  // Sum the week
  const weekSum = daysSum.reduce((acc, cur) => acc + cur);

  const result = [];
  weeklyData.forEach(line => {
    const data = [];
    line.seconds.forEach((day, index) => {
      data.push(percentage(day, daysSum[index]));
    });
    const project = projects.find(prj => prj.id === line.project_id);
    result.push({
      client: '',
      conso: percentage(projectSum[line.project_id], weekSum),
      data,
      project: getProjectName(project)
    });
  });

  return result;
};

const filterDataFromProject = function filterDataFromProject(
  data,
  lineElement
) {
  const text = $(lineElement)
    .find('.css-70qvj9.efdmxuc2 > span:first-child')
    .text();
  if (text.trim() === 'Without project') {
    return data.find(value => value.project === null);
  }
  return data.find(value => value.project === text);
};

const displayValue = function displayValue(value) {
  return `<p class="fcr-toggl">${value}</p>`;
};

const defaultDataValue = 0;

const getDataValue = function getDataValue(columnsLength, indexColumn, data) {
  // eslint-disable-next-line no-magic-numbers
  if (columnsLength === indexColumn + 1) {
    return data.conso || defaultDataValue;
  }
  return data.data[indexColumn] || defaultDataValue;
};

const displayInTheLine = function displayInTheLine(lineElement, data) {
  // For each line, select only days and total columns
  const columns = $(lineElement).find('.euf6jrl1');
  // eslint-disable-next-line no-magic-numbers
  if (columns.length <= 0) {
    console.warn('There is no display column', columns);
    return;
  }
  columns.each(function displayColumn(indexColumn) {
    const dataInCeil = getDataValue(columns.length, indexColumn, data);
    if (dataInCeil !== defaultDataValue) {
      // eslint-disable-next-line no-invalid-this
      $(this).append(displayValue(dataInCeil.toFixed(decimalLenght)));
    }
  });
};

const display = function display(data = []) {
  // Select the data line in the tab
  const displayLines = $('.css-1v0lzu.euf6jrl0:not(:first, :last)');
  // eslint-disable-next-line no-magic-numbers
  if (!displayLines || displayLines.length === 0) {
    console.warn('There is no display line', displayLines);
    return;
  }
  displayLines.each(function displayLine() {
    // eslint-disable-next-line no-invalid-this
    displayInTheLine(this, filterDataFromProject(data, this));
  });
};

const calculateAndDisplay = async function calculateAndDisplay(data) {
  // Need to wait to the table built
  await sleep();
  cleanDisplay();
  display(calculate(data));
};

const fillProjects = async function fillProjects(data = []) {
  projects = await data.map(project => ({
    clientId: project.client_id,
    id: project.id,
    name: project.name
  }));
};

const checkResponseAndUrl = function checkResponseAndUrl(
  response,
  url,
  apiRUl
) {
  const responseStatus200 = 200;
  return response.ok &&
    response.status === responseStatus200 &&
    url &&
    url.startsWith(apiRUl);
};

const response = function response(responseToClone) {
  // Clone to consume json body stream response
  const responseClone = responseToClone.clone();
  const { url } = responseToClone;
  if (checkResponseAndUrl(responseClone, url, apiProjectsUrlToFollow)) {
    console.info('Url to follow found!', url);
    responseClone.json().then(fillProjects);
  }
  if (checkResponseAndUrl(responseClone, url, apiTimeEntriesUrlToFollow)) {
    console.info('Url to follow found!', url);
    responseClone.json().then(calculateAndDisplay);
  }
};

const fireOnChange = function fireOnChange(url = '') {
  // Check if we are in the good page
  if (urlToFollow.test(url)) {
    buildFetch(response);
    return true;
  }
  backFetch();
  return false;
};

console.info('== Toggl - Weekly report ==');
// Follow the HTML5 url change in the API browser
(function followUrl(old) {
  window.history.pushState = function pushState(...args) {
    old.apply(window.history, args);
    fireOnChange(window.location.href);
  };
}(window.history.pushState));
fireOnChange(location.href);

// Add CSS
const styleElement = document.createElement('style');
const textNode = '.fcr-toggl { padding-left: 8px; }';
styleElement.appendChild(document.createTextNode(textNode));

(document.body || document.head || document.documentElement)
  .appendChild(styleElement);
