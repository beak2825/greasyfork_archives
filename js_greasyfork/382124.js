// ==UserScript==
// @name         Airbnb sort by total price
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You should select the dates in order to allow script to work
// @author       a.karelin
// @match        https://www.airbnb.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382124/Airbnb%20sort%20by%20total%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/382124/Airbnb%20sort%20by%20total%20price.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const logPrices = () => {
    const positions = Array.from(document.querySelectorAll("[id^='listing-']"))
      .map(el => {
        const match = el.textContent.match(/Price:[\$€]?([\d,]+)₽? total/);
        if (!match) {
          return;
        }

        return {
          price: parseInt(match[1].replace(",", ""), 10),
          link: el.querySelector("a[href^='/rooms']").href,
        }
      })
      .filter(el => !!el)
      .sort((objA, objB) => {
        return objA.price - objB.price;
      });

    if (positions.length === 0) {
      console.error("(Airbnb total sort by price): Most likely you did not specify the dates of a trip. In other cases check the code for bugs.");
    } else {
      console.log("(Airbnb total sort by price): ", positions);
    }
  };

  const replaceState = history.replaceState;
  let prevHref;

  const wrapReplace = (func) => (...args) => {
    func.apply(history, args);
    if (args[2] !== prevHref) {
      logPrices();
      prevHref = args[2];
    }
  };

  history.replaceState = wrapReplace(replaceState);

  if (document.readyState === "complete") {
      logPrices();
  } else {
      window.addEventListener("load", logPrices);
  }
})();