// ==UserScript==
// @name     Quota Check Option Highlighter
// @version  1.01
// @grant    none
// @locale  en
// @description Highlights answer options if they are not contained within the quota
// @include  /.+/index.php/admin/quotas/sa/index/surveyid/.+/
// @namespace https://greasyfork.org/users/560069
// @downloadURL https://update.greasyfork.org/scripts/404250/Quota%20Check%20Option%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/404250/Quota%20Check%20Option%20Highlighter.meta.js
// ==/UserScript==

(function () {
  console.log("Starting Quota Highlighter...");

  let quotaElements = document.querySelectorAll("table.items.table tr.odd,tr.even");
  
  // populate quota names and quota option elements
  quotaElements.forEach(e => {
    
    let quotaName = e.children[1].innerText.toLowerCase().replace(/ /g, "");
    let optionElements = e.querySelectorAll("table tbody>tr");

    optionElements.forEach(e2 => {
      let optionName = e2.children[1].innerText.toLowerCase().replace(/\(.*\)/g, "").replace(/ /g, "").trim();

      if (quotaName.includes(optionName)) {
        console.log(quotaName + " contains " + optionName);
      } else {
        console.log(quotaName + " does not contain " + optionName);

        e2.style["box-shadow"] = "inset 0 0 10px 0 red";
      }
    });
  });
})();