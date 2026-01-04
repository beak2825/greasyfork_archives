// ==UserScript==
// @name         personal-stats-average
// @namespace    seintz.torn.personal-stats-average
// @version      5.3.1
// @author       seintz [2460991], finally [2060206], Anxiety [2149726]
// @description  shows the averages of the stat selected on top of the personalstats page
// @license      GNU GPLv3
// @source       https://update.greasyfork.org/scripts/437934/personal-stats-average.user.js
// @match        https://www.torn.com/personalstats.php*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437934/personal-stats-average.user.js
// @updateURL https://update.greasyfork.org/scripts/437934/personal-stats-average.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let personalStats;
  const fmt = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const showAverages = (startDate) => {
    if (!personalStats) return;
    startDate = startDate ? (/* @__PURE__ */ new Date(startDate + " 00:00:00Z")).toISOString().substring(0, 10) : startDate;
    const txtElemSel = "g > text[text-anchor='start']";
    const textElements = document.querySelectorAll(txtElemSel);
    let lineWidths = [0];
    for (const textElement of textElements) {
      const userName2 = textElement.textContent.split(" ")[0];
      const statName2 = textElement.textContent.split("(")[1].split(")")[0];
      const data2 = personalStats.data[Object.keys(personalStats.definitions).filter((key) => personalStats.definitions[key] == statName2)[0]].filter(
        (user) => user.uid == Object.keys(personalStats.definitions).filter((key) => personalStats.definitions[key] == userName2)[0]
      )[0].data;
      const startIndex2 = startDate ? data2.findIndex((e) => {
        return new Date(e.time * 1e3).toISOString().substring(0, 10) == startDate;
      }) : data2.length - 1;
      const totalDays = (new Date(data2[0].time * 1e3) - new Date(data2[startIndex2].time * 1e3)) / (86400 * 1e3);
      const startCount = data2[startIndex2].value;
      const endCount = data2[0].value;
      const average = ((endCount - startCount) / totalDays).toFixed(2);
      let headerText;
      switch (statName2) {
        case "Time played":
        case "Time spent traveling":
          headerText = `${parseInt(average / 60)} minutes daily`;
          break;
        case "Total networth":
        case "Rehabilitation fees":
        case "Value of received bounties":
        case "Money rewarded":
        case "Spent on bounties":
        case "Money mugged":
          headerText = `$${fmt(parseInt(average))} / day`;
          break;
        default:
          headerText = `${fmt(average)} / day`;
          break;
      }
      textElement.textContent = textElement.textContent.split(")")[0] + `) ${headerText}`;
      const gNode = textElement.parentNode.parentNode;
      const width = gNode.parentNode.parentNode.clientWidth;
      const gRect = gNode.getBoundingClientRect();
      if (lineWidths[lineWidths.length - 1] + gRect.width > width) lineWidths.push(0);
      lineWidths[lineWidths.length - 1] += gRect.width + 5;
    }
    let x = 0;
    let y = 0;
    let i = 0;
    for (const textElement of textElements) {
      const gNode = textElement.parentNode.parentNode;
      const width = gNode.parentNode.parentNode.clientWidth;
      const gRect = gNode.getBoundingClientRect();
      if (x == 0) x = (width - lineWidths[0]) / 2;
      else if (x + gRect.width > width) {
        i += 1;
        y += 16;
        x = (width - lineWidths[i]) / 2;
      }
      gNode.querySelector("path").setAttribute("d", `M${x},${y + 7}L${x + 24},${y + 7}`);
      textElement.setAttribute("x", `${x + 29}`);
      textElement.setAttribute("y", `${y + 12}`);
      x += gRect.width + 5;
    }
    const tooltip = document.querySelector("div.google-visualization-tooltip");
    if (!tooltip) return;
    const labels = tooltip.querySelectorAll("p[class^='player'");
    const userName = labels[0].innerText.split(" ")[0];
    const statName = labels[1].innerText;
    const data = personalStats.data[Object.keys(personalStats.definitions).filter((key) => personalStats.definitions[key] == statName)[0]].filter(
      (user) => user.uid == Object.keys(personalStats.definitions).filter((key) => personalStats.definitions[key] == userName)[0]
    )[0].data;
    const startIndex = startDate ? data.findIndex((e) => {
      return new Date(e.time * 1e3).toISOString().substring(0, 10) == startDate;
    }) : data.length - 1;
    const change = fmt(data[startIndex].value - data[startIndex - 1].value);
    const changeElement = tooltip.querySelector("#personalStatChange");
    if (changeElement) changeElement.innerText = `Change: ${change}`;
    else {
      tooltip.style.height = "101px";
      const html = `<p id="personalStatChange" style="margin-bottom: 3px">Change: ${change}</p>Value: `;
      tooltip.querySelector("p[class^='date']").insertAdjacentHTML("afterEnd", html);
    }
  };
  function observerFunction(mutationRecord) {
    for (const mutationEntry of mutationRecord) {
      if (mutationEntry.addedNodes) {
        for (const addedNode of mutationEntry.addedNodes) {
          if (addedNode.querySelector) {
            if (addedNode.querySelector("div > table")) showAverages();
            if (addedNode.querySelector("p[class^='date']"))
              showAverages(addedNode.querySelector("p[class^='date']").innerText);
          }
        }
      }
      if (mutationEntry.removedNodes) {
        for (const removedNode of mutationEntry.removedNodes) {
          if (removedNode.querySelector && removedNode.querySelector("p[class^='date']")) showAverages();
        }
      }
    }
  }
  const docObserver = new MutationObserver((mutationRecord) => {
    for (const mutationEntry of mutationRecord) {
      if (mutationEntry.addedNodes) {
        for (const addedNode of mutationEntry.addedNodes) {
          if (document.querySelector("div[class^='chartWrapper'")) {
            const target = document.querySelector("div[class^='chartWrapper'").firstElementChild;
            new MutationObserver(observerFunction).observe(target, {
              childList: true,
              subtree: true
            });
            docObserver.disconnect();
            return;
          }
        }
      }
    }
  });
  docObserver.observe(document, { childList: true, subtree: true });
  const oldFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = async (url, init) => {
    if (!url.includes("personalstats.php")) return oldFetch(url, init);
    let response = await oldFetch(url, init);
    let clone = response.clone();
    clone.json().then((json) => {
      if (!json.definitions) return;
      personalStats = json;
    });
    return response;
  };

})();