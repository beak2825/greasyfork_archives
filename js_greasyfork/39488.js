// ==UserScript==
// @name        Web of Science GoTo Publisher
// @version     0.2
// @author      sincostandx
// @license     MIT
// @description Automatically redirect to publisher website for full text when you click on the title in the Web of Science search result list
// @namespace   https://greasyfork.org/users/171198
// @include     https://www.webofscience.com/wos/woscc/full-record/*
// @downloadURL https://update.greasyfork.org/scripts/39488/Web%20of%20Science%20GoTo%20Publisher.user.js
// @updateURL https://update.greasyfork.org/scripts/39488/Web%20of%20Science%20GoTo%20Publisher.meta.js
// ==/UserScript==


(() => {
  let trials = 0;

  function getDOI(resolve, reject) {
    const doiEl = document.getElementById("FullRTa-DOI");
    if (doiEl) {
      resolve(doiEl.innerHTML);
    } else {
      if (++trials < 30) {
      	setTimeout(() => getDOI(resolve, reject), 500);
      } else {
      	reject("DOI not found");
      }
    }
  }

  new Promise(getDOI).then(doi => {
    window.location.replace('https://doi.org/' + doi);
  })
  .catch(err => console.warn(err));
})();