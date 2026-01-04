// ==UserScript==
// @name        Lattice Goals - Add Ideal
// @namespace   Violentmonkey Scripts
// @match       http://*.latticehq.com/goals/*
// @match       https://*.latticehq.com/goals/*
// @grant       none
// @version     1.3
// @author      pedro-mass
// @description Determines ideal goal value based on Created on and Due dates
// @run-at      document-idle
// @require     http://code.jquery.com/jquery-3.5.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/402208/Lattice%20Goals%20-%20Add%20Ideal.user.js
// @updateURL https://update.greasyfork.org/scripts/402208/Lattice%20Goals%20-%20Add%20Ideal.meta.js
// ==/UserScript==

waitUntilTrue(shouldRun, run);

function isPercentageBasedGoal() {
  // todo: make this actually check if there is a percentage based check?
  return true;
}

function run() {
  console.log("Starting Lattice Goal Percentage calculations...");
  if (!isPercentageBasedGoal()) return;

  const Dates = getDates();
  const GoalStats = getGoalStats();
  const percentageByDate = getRelativePercentage(
    Dates.start,
    Dates.end,
    Dates.current
  );

  const idealValue = Math.round(
    getRelativeValue(GoalStats.start, GoalStats.goal, percentageByDate)
  );

  const goalDirection = GoalStats.start <= GoalStats.end ? 1 : -1;

  return insertIdeal(
    idealValue,
    GoalStats.unit,
    GoalStats.current,
    goalDirection
  );
}

function getRelativeValue(start, end, percentage) {
  const offset = start;
  return (end - offset) * percentage + offset;
}

function getDates() {
  const start = getDate(/^created\n\n/i);
  const end = getDate(/^due\n\n/i);
  const current = Date.now();

  return {
    start,
    end,
    current,
  };
}

function getGoalStats() {
  const unit = getValue(/^start: /i, "span").replace(/\d+/, "");
  const getNumber = (regex) =>
    Number(getValue(regex, "span").replace(unit, ""));
  const start = getNumber(/^start: /i);
  const current = getNumber(/^current: /i);
  const goal = getNumber(/^goal: /i);

  return {
    start,
    goal,
    current,
    unit,
  };
}

function getProgressIndicator(ideal, current) {
  if (current == null) return "";

  if (ideal <= current) {
    return "🎉";
  }

  return "😢";
}

function insertIdeal(ideal, unit, current, isAscendingGoal) {
  if (contains("span", /^ideally: /i).length > 0) {
    return;
  }

  const progressIndicator = isAscendingGoal
    ? getProgressIndicator(ideal, current)
    : getProgressIndicator(current, ideal);

  const idealElem = `<span class="css-1mddpa2">Ideally: <span>${ideal}${unit}</span> <span>${progressIndicator}</span></span>`;
  const goalsContainer = contains("div", /^start:/i);

  return $(goalsContainer).find("span").first().after(idealElem);
}

function shouldRun() {
  const pageCheck = contains("span", /^start: /i);
  return pageCheck != null && pageCheck.length > 0;
}

function getRelativePercentage(startDate, endDate, currentDate) {
  const offset = startDate;
  endDate = endDate - offset;
  currentDate = currentDate - offset;
  return currentDate / endDate;
}

function getDate(regex, selector = "div") {
  return new Date(getValue(regex, selector)).getTime();
}

function getValue(regex, selector) {
  return replaceString(getText(first(contains(selector, regex))), regex, "");
}

function replaceString(string, searchString, newString) {
  if (!string) {
    console.warn("Received bad params", { string, searchString, newString });
    return string;
  }

  return string.replace(searchString, newString);
}

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(getText(element));
  });
}

function getText(element) {
  return element.innerText;
}

function first(arr) {
  return arr[0];
}

function waitUntilTrue(checkFn, cb = (x) => x, timeout = 250) {
  const intervalId = setInterval(checkInterval, timeout);
  function checkInterval() {
    if (checkFn()) {
      clearInterval(intervalId);
      cb();
    }
  }
}
