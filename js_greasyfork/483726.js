// ==UserScript==
// @name         Foodmandu Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A usercript to scrape Food Menu from Foodmandu!
// @author       kaley-bhai
// @match        https://foodmandu.com/Restaurant/Details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=foodmandu.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483726/Foodmandu%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/483726/Foodmandu%20Scraper.meta.js
// ==/UserScript==

// This Userscript requires jquery to run, If you wanna run it as a Node JS application, you can use Cheerio

(function () {
  ("use strict");

  console.log("Foodmandu Scraper Script has started!");

  $(document).ready(function () {
    /** @type {Array} */
    const categoryItems = [];
    let dataDownloaded = false;
    /** @type {String} */
    const title = $("h1.text-white").text().trim().replace(/ /g, "_");
    /**
     * DOM Mutation Observer, With Angular and React,
     * Dynamic Content might be added after the page load/scroll, this tracks that
     *
     */
    observer = new MutationObserver(function (mutations) {
      clearTimeout(window.mutationTimeout);

      // Set a new timeout to wait for changes to settle
      window.mutationTimeout = setTimeout(function () {
        console.log("DOM changes settled");

        $(".list-header").each((index, element) => {
          const category = $(element).find("div:first-child").text().trim();

          $(element)
            .next("ul")
            .find("li")
            .each((i, e) => {
              const name = $(e).find(".small-title.ng-binding").text().trim();
              const price = $(e)
                .find(".menu__price span.ng-binding:not(.discount)")
                .text()
                .trim();
              const description = $(e).find(".small.dim").text().trim();

              categoryItems.push({
                category,
                name,
                description,
                price,
              });
            });
        });
        if (!dataDownloaded) {
          saveCategoryItems(categoryItems, title);
          dataDownloaded = true;
        }
        //downloadCSV(convertToCSV(categoryItems), 'foodmandu')
      }, 500);
    });
    //Log all the Menu Items
    console.log(categoryItems);

    // Observe changes to the entire document body
    observer.observe(document.body, { subtree: true, childList: true });
  });

  /**
   * Download the menu file to JSON
   *
   * @param {Array} data Menu Item Data to download
   * @param {String} name Name of the File to be saved as
   */
  function saveCategoryItems(data, name) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + ".json";
    a.textContent = "Download Data";
    //Simulating a click to start download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Download the menu file to CSV
   * Currently Bug with the Key-Value Spacing
   *
   * @param {*} data
   */
  function saveCategoryItemsCSV(data) {
    let csvContent =
      "data:text/csv;charset=utf-8," + "Category,Name,Description,Price\n";

    // Convert data to CSV format // Concating err when desc is empty
    data.forEach((item) => {
      csvContent += `${item.category},${item.name},${item.description},${item.price}\n`;
    });

    const encodedUri = encodeURI(csvContent);

    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = "foodmandu_data.csv";
    a.textContent = "Download Data";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Function to convert the given Arrray of KV pair to CSV Format
   *
   * @param {Array} arr
   * @return {*}
   */
  function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  }
  /**
   * Function to download CVS, different from the fn: saveCategoryItemsCSV
   *
   * @param {*} data
   * @param {*} filename
   */
  function downloadCSV(data, filename) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
})();
