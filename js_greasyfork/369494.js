// ==UserScript==
// @name         P2P Usage Progressbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show unused bandwidth
// @author       You
// @match        https://portal.ptpbroadband.com/datausage.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369494/P2P%20Usage%20Progressbar.user.js
// @updateURL https://update.greasyfork.org/scripts/369494/P2P%20Usage%20Progressbar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(function () {

    var xhr = new XMLHttpRequest(),
      formData = new FormData();

    formData.append("action", "getDailyUsage");
    formData.append("customerId", "8730600");
    xhr.open('POST', 'https://portal.ptpbroadband.com/webService.php');

// LINE ADDED
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send('action=getDailyUsage&customerId=8730600');

    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.response);
          update(JSON.parse(xhr.response).data);
        }
      }
    };

    function update(data) {
      console.log(data);
      let progressBarDiv = document.querySelector(".progress-bar");
      let parentDiv = document.querySelector(".progress-bar").parentElement;

      progressBarDiv.remove();

      let expectedUsage = new Date(Date.now()).getDate() / data.recentUsage.length;
      let totalGB = data.recentUsage.reduce(function (count, it) {return count + it.y}, 0);
      let currentUsage = totalGB / 400;

      if (currentUsage < expectedUsage) {
        parentDiv.appendChild(createProgressbar(currentUsage, "#47a447"));
        parentDiv.appendChild(createProgressbar(expectedUsage - currentUsage, "#80918c"));
      }
      else {
        parentDiv.appendChild(createProgressbar(expectedUsage, "#a49c20"));
        parentDiv.appendChild(createProgressbar(currentUsage - expectedUsage, "#a42911"));
      }
      
      parentDiv.insertAdjacentHTML("afterend","<p>Your daily bandwidth budget is <strong>" + (400 / data.recentUsage.length).toFixed(1) + "GB</strong></p>" );

      function createProgressbar(percentage, bg) {
        let percent100 = (percentage * 100).toFixed(3);
        let div = document.createElement("div");
        div.classList.add("progress-bar");
        div.setAttribute("role", "progressbar");
        div.setAttribute("aria-valuenow", percent100);
        div.setAttribute("aria-valuemin", "0");
        div.setAttribute("aria-valuemax", "100");
        div.style.width = percent100 + "%";
        div.style.borderRadius = "0";
        div.style.background = bg;

        return div;
      }
    }
  }, 1000);
})();