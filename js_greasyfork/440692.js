// ==UserScript==
// @name         Airbnb sort by total price [Fixed for 2022]
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  You should select the dates in order to allow script to work
// @author       a.karelin
// @match        https://www.airbnb.com/s/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440692/Airbnb%20sort%20by%20total%20price%20%5BFixed%20for%202022%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/440692/Airbnb%20sort%20by%20total%20price%20%5BFixed%20for%202022%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.logPrices = () => {
    const positions = Array.from(document.querySelectorAll("#site-content > div:nth-child(2) > div > div:nth-child(4) > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div > div"))
      .map(el => {
        const match = el.textContent.match(/[\$]?([\d,]+)? total/);
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
      })

    positions.forEach(a => console.log(a.price + " " + a.link));

    if (positions.length === 0) {
      alert("(Airbnb total sort by price): Most likely you did not specify the dates of a trip. In other cases check the code for bugs.");
    } else {
      alert("(Airbnb total sorted by price): " + positions.length + ". Check console to see sorted list. Execute 'window.logPrices()' to run sort again.");
    }
  };

  window.replaceState = history.replaceState;
  let prevHref;

  window.wrapReplace = (func) => (...args) => {
    func.apply(history, args);
    if (args[2] !== prevHref) {
      window.logPrices();
      prevHref = args[2];
    }
  };

  history.replaceState = window.wrapReplace(window.replaceState);

  if (document.readyState === "complete") {
      window.logPrices();
  } else {
      window.addEventListener("load", window.logPrices);
  }
})();