// ==UserScript==
// @name         MAL Summary+Profile Stats With Percentages + Hours
// @namespace    http://tampermonkey.net/
// @version      6
// @description  See your profile stats in % + Hours, and see the Summary Stats in %
// @author       Only_Brad (& commented by hacker09)
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)\/[\d]+\/.*\/stats/
// @match        https://myanimelist.net/profile/*
// @exclude      https://myanimelist.net/*/*/clubs
// @exclude      https://myanimelist.net/*/*/reviews
// @exclude      https://myanimelist.net/*/*/friends
// @exclude      https://myanimelist.net/*/*/recommendations
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407739/MAL%20Summary%2BProfile%20Stats%20With%20Percentages%20%2B%20Hours.user.js
// @updateURL https://update.greasyfork.org/scripts/407739/MAL%20Summary%2BProfile%20Stats%20With%20Percentages%20%2B%20Hours.meta.js
// ==/UserScript==

// Functions to select the days txt and day numbers to convert then to txt hours and numbers in hours later
(function() {
  if (location.href.match('profile') !== null) //If the current url is the profile of some user
  { //Starts the if condition
    GM_addStyle(".profile .user-statistics .stats-status{width: 200px;}");
    document.head.insertAdjacentHTML('afterend', '<style>span.di-ib.fl-r.lh10 {position: absolute!important; text-indent: 10px!important;}</style>'); //Fixes new dark mode bug
    const days = document.querySelector(".di-tc.al.pl8.fs12.fw-b"),
      hours = days.cloneNode(true),
      hoursText = hours.querySelector("span"),
      hoursValueNode = hoursText.nextSibling,
      hoursValue = parseFloat(hoursValueNode.textContent.replace(/,/g, ""));

    // Add the symbol // On the beginning the 2 lines below "disable" the total hours,then you can have just the mal percentages feature
    hoursText.textContent = "Hours: ";
    hoursValueNode.textContent = (hoursValue * 24).toFixed(1);
    days.insertAdjacentElement("afterend", hours);

    // Functions to select all the animes stats and the Total stats
    const total = parseInt(document.querySelector(".stats-data.fl-r span:nth-child(2)").textContent.replace(/,/g, ""));
    const [watching, completed, onHold, dropped, planToWatch] = document.querySelectorAll(".di-ib.fl-r.lh10");

    // Functions to add the percentage after the total number of each watching,completed,onHold,dropped,planToWatch
    [watching, completed, onHold, dropped, planToWatch].forEach(addPercentage);

    // Functions that do the math
    function getPercentage(node) {
      const value = parseInt(node.textContent.replace(/,/g, ""));
      if (total === 0) return "0.00";
      return (value * 100 / total).toFixed(2);
    }

    // Functions to show and append the scores after each watching,completed,onHold,dropped,planToWatch
    function addPercentage(node) {
      const percentage = getPercentage(node);
      node.textContent = `${node.textContent} (${percentage}%)`;
    }
  } //Finishes the if condition
  else //If the user is on the summary page
  { //Starts the else condition
    const [, , , watching, completed, onHold, dropped, planToWatch, total] = document.querySelectorAll("#content > table > tbody > tr > td:nth-child(2) > div.js-scrollfix-bottom-rel > div");
    const totalValue = getValue(total);

    [watching, completed, onHold, dropped, planToWatch].forEach(addPercentage);

    //Uncomment the below code to swap "Watching" and "Completed" positions
    //watching.before(completed);

    function getValue(node) {
      const text = node.querySelector("span");
      return parseInt(text.nextSibling.textContent.replace(/,/g, ""));
    }

    function getPercentage(node) {
      if (totalValue === 0) return "0.00";
      const value = getValue(node);
      return (value * 100 / totalValue).toFixed(2);
    }

    function addPercentage(node) {
      const text = node.querySelector("span");
      const valueNode = text.nextSibling;
      const percentage = getPercentage(node);
      valueNode.textContent = `${valueNode.textContent} (${percentage}%)`;
      addBar(node, percentage);
    }

    function addBar(node, percentage) {
      const percentageText = convertTextNodeToSpan(node);
      percentageText.style = "font-weight: normal";

      const textNode = node.querySelector(".dark_text");
      textNode.appendChild(percentageText);

      const bar = document.createElement("div");
      bar.setAttribute("class", "updatesBar");
      bar.style = `display: block; height: 15px; width: ${percentage}%;`;

      textNode.after(bar);
    }

    function convertTextNodeToSpan(node) {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          child.remove();
          const span = document.createElement("span");
          span.textContent = text;
          node.appendChild(span);
          return span;
        }
      }
    }
  } //Finishes the else condition
})()