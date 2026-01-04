// ==UserScript==
// @name         Wanikani Workload Distribution
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display the workload on the bottom of your dashboard
// @author       abdullahalt
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377803/Wanikani%20Workload%20Distribution.user.js
// @updateURL https://update.greasyfork.org/scripts/377803/Wanikani%20Workload%20Distribution.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const wkof = window.wkof;
  const scriptId = "workloadDistribution";

  wkof.include("ItemData,Settings");
  wkof
    .ready("ItemData,Settings")
    .then(loadItems)
    .then(proccessItems)
    .then(createChart);

  function loadItems() {
    console.log("loadItems");
    return wkof.Settings.load(scriptId, {});
  }

  function proccessItems(cache) {
    console.log("cache");
    console.log(cache);
    return cache.cached ? cache.dataset : downloadItems().then(orgnize);
  }

  function downloadItems() {
    console.log("downloadItems");
    return wkof.ItemData.get_items({
      wk_items: {
        filters: {
          item_type: ["kan", "rad", "voc"]
        }
      }
    });
  }

  function orgnize(items) {
    console.log("orgnize");
    const kanji = distrbuteToLevels(
      items.filter(item => item.object === "kanji")
    );
    const radical = distrbuteToLevels(
      items.filter(item => item.object === "radical")
    );
    const vocabulary = distrbuteToLevels(
      items.filter(item => item.object === "vocabulary")
    );

    const dataset = {};
    dataset.radical = getTotalToEachLevel(radical);
    dataset.kanji = getTotalToEachLevel(kanji);
    dataset.vocabulary = getTotalToEachLevel(vocabulary);

    console.log(dataset);
    saveCashe(dataset);
    return dataset;
  }

  function distrbuteToLevels(items) {
    console.log("distrbuteToLevels");
    const object = {};
    items.forEach(item => {
      if (!object[item.data.level]) object[item.data.level] = [];
      object[item.data.level].push(item);
    });
    return object;
  }

  function saveCashe(dataset) {
    console.log("saveCashe");
    wkof.settings[scriptId] = {
      cached: true,
      dataset: dataset
    };
    wkof.Settings.save(scriptId).then(() => console.log("saved"));
  }

  function createChart(dataset) {
    console.log("createChart");
    const canvas = document.createElement("canvas");
    document.querySelector("body").append(canvas);

    const labels = getLabels();

    var myChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "radicals",
            data: dataset.radical,
            fill: "origin",
            backgroundColor: "#0098e4"
          },
          {
            label: "kanji",
            data: dataset.kanji,
            fill: "origin",
            backgroundColor: "#f500a3"
          },
          {
            label: "vocabulary",
            data: dataset.vocabulary,
            fill: "origin",
            backgroundColor: "#9d34b7"
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  function getLabels() {
    console.log("getLabels");
    const labels = [];
    for (let i = 1; i <= 60; i++) {
      labels.push(i);
    }
    return labels;
  }

  function getTotalToEachLevel(items) {
    console.log("getTotalToEachLevel");
    let totalToEachLevel = [];
    for (let i = 1; i <= 60; i++) {
      totalToEachLevel[i - 1] = items[i + ""] ? items[i + ""].length : 0;
    }
    return totalToEachLevel;
  }
})();
