// ==UserScript==
// @name         Kobo DRM in search results
// @namespace    http://ui3.info/d/
// @version      1.4
// @description  Mark up Kobo book search results with DRM status
// @author       Dino Morelli <dino@ui3.info>
// @source       https://github.com/dino-/tampermonkey
// @match        https://www.kobo.com/us/en/search?query=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/421355/Kobo%20DRM%20in%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/421355/Kobo%20DRM%20in%20search%20results.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $ = window.jQuery; // Avoid noisy warnings in Tampermonkey's editor

  // The values are for reducing a list of these to the "worst" (highest) one using Math.max()
  const DrmStatus = {
    UNKNOWN: 0,
    NO: 1,
    YES: 2
  }

  // Get the anchor tag for every book on this search results page.
  // This URL drills down into the book details.
  const books = $(".book-card-desktop a[data-testid='title']");

  // Color the book gray before the (possibly lenghty) checks below
  books.each((_i, bookElem) => $(bookElem).css("color", "gray"));

  Promise.all(books.each((_i, bookElem) =>
    $.get($(bookElem).attr("href")).then(styleBook(bookElem)))
  );

  function styleBook(bookElem) { return function(pageContents) {
    switch (checkForDRM(pageContents)) {
      case DrmStatus.NO:
        $(bookElem).css("color", "black");
        break;
      case DrmStatus.YES:
        $(bookElem)
          .css("color", "red")
          .css("text-decoration", "line-through");
        $(bookElem).parent().append("<span> (has DRM!)</span>");
        break;
      case DrmStatus.UNKNOWN:
      default:
        $(bookElem).css("color", "orange");
        $(bookElem).parent().append("<span> (DRM status unknown)</span>");
    }
  }}

  // Returns what we can determine about the DRM. Yes, no or unknown using the above "enum"
  function checkForDRM(pageContents) {
    return Math.max(...
      [ (/Adobe DRM/.test(pageContents)) ? DrmStatus.YES : DrmStatus.UNKNOWN
      , (/>Audio</.test(pageContents) && />Format</.test(pageContents)) ? DrmStatus.YES : DrmStatus.UNKNOWN
      , (/DRM-Free/.test(pageContents)) ? DrmStatus.NO : DrmStatus.UNKNOWN
      , (/sold without Digital Rights Management Software/.test(pageContents)) ? DrmStatus.NO : DrmStatus.UNKNOWN
      , (/This book is DRM-free/.test(pageContents)) ? DrmStatus.NO : DrmStatus.UNKNOWN
      , DrmStatus.UNKNOWN
      ]
    );
  }

  // Convenience function. Shorter to call and can be filtered in the console easily.
  function log(msg) { console.log("debug: " + msg); }

})();
