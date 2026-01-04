// ==UserScript==
// @name         TOPs Google Maps Sort by Reviews
// @name:zh-CN    TOPs Google Maps Sort by Reviews
// @namespace    https://github.com/new4u
// @version      1.3
// @description:  Sort Google Maps places to find TOPs,Unlock the Secret to Finding the Best Local Spots with Our Google Maps Hack! 
// @description:zh-CN  Sort Google Maps places to find TOPs,Unlock the Secret to Finding the Best Local Spots with Our Google Maps Hack! 
// @author       new4u
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @match        *www.google.com/maps*
// @grant        none
// @copyright    2015-2024, new4u
// @license      GPL-3.0-only
// @description Sort Google Maps places to find tops
// @downloadURL https://update.greasyfork.org/scripts/493527/TOPs%20Google%20Maps%20Sort%20by%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/493527/TOPs%20Google%20Maps%20Sort%20by%20Reviews.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let restaurantNameSelector = ".qBF1Pd.fontHeadlineSmall";
  let ratingSelector = ".UY7F9";
  let ratingCountSelector = ".e4rVHe.fontBodyMedium";
  let priceSelector = ".e4rVHe.fontBodyMedium > span:nth-child(3)";
  let cuisineSelector = ".W4Efsd span:first-child";
  let openHoursSelector = ".W4Efsd span:last-child";
  let restaurantTypeSelector = ".ah5Ghc.fontBodyMedium";
  let titleSelector = "head > title";

  function extractData() {
    let data = {};

    let targetElements = document.querySelectorAll(".TFQHme + *");
    for (let i = 0; i < targetElements.length; i++) {
      let element = targetElements[i];

      let name = element.querySelector(restaurantNameSelector);
      if (name) {
        name = name.innerText;
      } else {
        name = null;
      }

      let rating = element.querySelector(ratingSelector);
      if (rating) {
        rating = rating.innerText;
      } else {
        rating = null;
      }

      let ratingCount = element.querySelector(ratingCountSelector);
      if (ratingCount) {
        ratingCount = ratingCount.innerText;
      } else {
        ratingCount = null;
      }

      let price = element.querySelector(priceSelector);
      if (price) {
        price = price.innerText;
      } else {
        price = null;
      }

      let cuisine = element.querySelector(cuisineSelector);
      if (cuisine) {
        cuisine = cuisine.innerText;
      } else {
        cuisine = null;
      }

      let openHours = element.querySelector(openHoursSelector);
      if (openHours) {
        openHours = openHours.innerText;
      } else {
        openHours = null;
      }

      let restaurantType = element.querySelector(restaurantTypeSelector);
      if (restaurantType) {
        restaurantType = restaurantType.innerText;
      } else {
        restaurantType = null;
      }

      data[name] = {
        rating: rating,
        ratingCount: ratingCount,
        price: price,
        cuisine: cuisine,
        openHours: openHours,
        restaurantType: restaurantType
      };
    }

    let title = document.querySelector(titleSelector).innerText
    console.log(data);
    console.log(title);
    console.log(`Extracted ☆★${Object.keys(data).length}★☆ Spots`);


    // Create an array of restaurant names and ratings
    let ratingsArray = [];
    for (let name in data) {
      let rating = data[name].rating;
      if (rating) {
        // Remove all non-numeric characters except the decimal point from the rating string
        rating = rating.replace(/[^0-9.]/g, '');
        // Convert the rating string to a number
        rating = Number(rating);
      } else {
        // Assign a zero rating to restaurants with no rating
        rating = 0;
      }
      ratingsArray.push([name, rating]);
    }

    // Sort the array by rating in descending order
    ratingsArray.sort(function (a, b) {
      return b[1] - a[1];
    });

    // Slice the first 10 elements of the array
    let top10 = ratingsArray.slice(0, 10);

    // Print the names and ratings of the top 10 restaurants
    for (let i = 0; i < top10.length; i++) {
      console.log(top10[i][0] + ": " + top10[i][1]);
    }
  }

  // Monitor the specific DOM element for updates
  let targetElement = document.querySelector("#QA0Szd > div > div > div.w6VYqd > div:nth-child(2)");
  let previousInnerHTML = targetElement.innerHTML;
  setInterval(function () {
    let currentInnerHTML = targetElement.innerHTML;
    if (currentInnerHTML !== previousInnerHTML) {
      console.log("↓↓↓↓DOM element updated↓↓↓↓");
      previousInnerHTML = currentInnerHTML;
      extractData(); // Call the extractData function when the DOM element updates
    }
  }, 3000); // Check every 1 second

  // Initial call to extractData
  extractData();
})();