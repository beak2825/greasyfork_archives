// ==UserScript==
// @name Amazon - Goodreads metadata
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Shows the ratings from Goodreads on Amazon book pages
// @license MIT
// @version 0.0.2
// @match https://amazon.com/*
// @match https://*.amazon.com/*
// @match https://amazon.co.uk/*
// @match https://*.amazon.co.uk/*
// @match https://amazon.ca/*
// @match https://*.amazon.ca/*
// @match https://amazon.de/*
// @match https://*.amazon.de/*
// @match https://amazon.fr/*
// @match https://*.amazon.fr/*
// @match https://amazon.es/*
// @match https://*.amazon.es/*
// @match https://amazon.it/*
// @match https://*.amazon.it/*
// @match https://amazon.co.jp/*
// @match https://*.amazon.co.jp/*
// @match https://amazon.cn/*
// @match https://*.amazon.cn/*
// @match https://amazon.com.br/*
// @match https://*.amazon.com.br/*
// @match https://amazon.in/*
// @match https://*.amazon.in/*
// @match https://amazon.com.mx/*
// @match https://*.amazon.com.mx/*
// @match https://amazon.com.au/*
// @match https://*.amazon.com.au/*
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @downloadURL https://update.greasyfork.org/scripts/468322/Amazon%20-%20Goodreads%20metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/468322/Amazon%20-%20Goodreads%20metadata.meta.js
// ==/UserScript==



/* jshint esversion: 6 */
"use strict";
(() => {
  // src/main/amazon-goodreads-meta/amazon-goodreads-meta.user.ts
  (() => {
    const asinRegex = /\/([A-Z0-9]{10})/;
    const findASIN = () => {
      const asinArray = [];
      const array = asinRegex.exec(document.location.pathname);
      const asin = array && array.length > 1 ? array[1] : "";
      console.log(`ASIN in pathname: ${asin}`);
      const dp = document.getElementById("dp");
      if (dp == null ? void 0 : dp.className.includes("book")) {
        asinArray.push(asin);
      } else {
        const images = document.getElementsByTagName("img");
        const coverImages = Array.from(images).filter((item) => item.classList.contains("cover-image"));
        coverImages.forEach((image) => {
          const parentElem = image.parentElement;
          if (parentElem instanceof HTMLAnchorElement) {
            const link = parentElem.href;
            const ciArray = asinRegex.exec(link);
            const ciAsin = ciArray && ciArray.length > 1 ? ciArray[1] : "";
            console.log(`ASIN on book image: ${ciAsin}`);
            asinArray.push(ciAsin);
          }
        });
      }
      return asinArray;
    };
    const findInsertPoint = () => {
      const insertPoint = [];
      const reviewElement = document.getElementById("averageCustomerReviews");
      if (reviewElement) {
        insertPoint.push(reviewElement);
      } else {
        const reviewArray = document.getElementsByClassName("pf-image-w");
        insertPoint.push(...Array.from(reviewArray));
      }
      return insertPoint;
    };
    const insertElement = (isbn, insertPoint) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: `https://www.goodreads.com/book/isbn/${isbn}`,
        onload(response) {
          const node = new DOMParser().parseFromString(response.responseText, "text/html");
          const head = document.getElementsByTagName("head")[0];
          const styles = Array.from(node.getElementsByTagName("link")).filter((item) => item.rel === "stylesheet");
          styles.forEach((item) => {
            item.href = item.href.replace("amazon", "goodreads");
            head.appendChild(item);
          });
          const meta = node.getElementById("ReviewsSection");
          if (meta) {
            const rating = meta.querySelector("div.RatingStatistics");
            if (rating) {
              Array.from(rating.getElementsByTagName("a")).forEach((item) => {
                item.href = response.finalUrl + item.href.replace(item.baseURI, "");
                return item;
              });
              Array.from(rating.getElementsByTagName("span")).forEach((item) => {
                item.classList.replace("RatingStar--medium", "RatingStar--small");
                item.classList.replace("RatingStars__medium", "RatingStars__small");
              });
              Array.from(rating.getElementsByTagName("div")).filter((item) => item.classList.contains("RatingStatistics__rating")).forEach((item) => {
                item.style.marginBottom = "-0.8rem";
                item.style.fontSize = "2.2rem";
              });
              const labelCol = document.createElement("div");
              labelCol.classList.add("a-column", "a-span12", "a-spacing-top-small");
              const labelRow = document.createElement("div");
              labelRow.classList.add("a-row", "a-spacing-small");
              labelRow.textContent = "Goodreads";
              const lineBreak = document.createElement("br");
              labelCol.appendChild(labelRow);
              labelRow.appendChild(lineBreak);
              labelRow.appendChild(rating);
              insertPoint.appendChild(labelCol);
            }
          }
        }
      });
    };
    const main = () => {
      const ASIN = findASIN();
      const insertPoint = findInsertPoint();
      for (let i = 0; i < ASIN.length && i < insertPoint.length; i++) {
        const insertPointElement = insertPoint[i].parentElement;
        if (insertPointElement) {
          insertElement(ASIN[i], insertPointElement);
        }
      }
    };
    main();
  })();
})();
//# sourceMappingURL=amazon-goodreads-meta.user.js.map
