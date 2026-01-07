// ==UserScript==
// @name Amazon - Add to Goodreads widget
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Places an "Add to Goodreads" widget on Amazon book pages
// @license MIT
// @version 0.0.5
// @icon https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @match https://openuserjs.org/scripts/*
// @match http://localhost:8080/scripts/*
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
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/468321/Amazon%20-%20Add%20to%20Goodreads%20widget.user.js
// @updateURL https://update.greasyfork.org/scripts/468321/Amazon%20-%20Add%20to%20Goodreads%20widget.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
"use strict";
(() => {
  // src/main/amazon-add-to-goodreads/amazon-add-to-goodreads.user.ts
  var AmazonAddToGoodreads;
  ((AmazonAddToGoodreads2) => {
    const asinRegex = /\/([A-Z0-9]{10})/;
    const findASIN = () => {
      const array = asinRegex.exec(document.location.pathname);
      const asin = array && array.length > 1 ? array[1] : "";
      console.log(`ASIN in pathname: ${asin}`);
      const dp = document.getElementById("dp");
      return (dp == null ? void 0 : dp.className.includes("book")) ? asin : "";
    };
    const findInsertPoint = () => document.getElementById("averageCustomerReviews");
    const insertElement = (isbn, insertPoint) => {
      const elem = document.createElement("div");
      elem.id = "gr_add_to_books";
      elem.innerHTML = [
        '<div class="gr_custom_each_container_">',
        '<a target="_blank" style="border:none" rel="nofollow noopener noreferrer" href="https://www.goodreads.com/book/isbn/',
        isbn,
        '"><img src="https://www.goodreads.com/images/atmb_add_book-70x25.png" /></a>',
        "</div>"
      ].join("");
      const script = document.createElement("script");
      script.src = `https://www.goodreads.com/book/add_to_books_widget_frame/${isbn}?atmb_widget%5Glutton%5D=atmb_widget_1.png`;
      insertPoint.appendChild(elem);
      insertPoint.appendChild(script);
    };
    AmazonAddToGoodreads2.main = () => {
      const ASIN = findASIN();
      const insertPoint = findInsertPoint();
      if (ASIN && insertPoint) {
        insertElement(ASIN, insertPoint);
      }
    };
  })(AmazonAddToGoodreads || (AmazonAddToGoodreads = {}));
  AmazonAddToGoodreads.main();
})();
//# sourceMappingURL=amazon-add-to-goodreads.user.js.map
