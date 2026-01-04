// ==UserScript==
// @name         Reddit Visited Link Hider
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @description  Hide links on Reddit which are already have been visited.
// @author       jcunews
// @include      https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38448/Reddit%20Visited%20Link%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/38448/Reddit%20Visited%20Link%20Hider.meta.js
// ==/UserScript==

(function() {
  var i, eles, now = (new Date()).valueOf();
  var visitedUrls = JSON.parse(localStorage.visitedUrls || "[]");
  //each array element is an array which contains the timestamp then the URL
  
  var visitedLinkExpiry = 7*24*60*1000; //7 days. in milliseconds
  //visited link records which are equal or older than this will be removed

  //check if link has been visited
  function isLinkVisited(link) {
    for (var i = visitedUrls.length-1; i >= 0; i--) {
      if (visitedUrls[i][1] === link.href) {
        return true;
      }
    }
    return false;
  }

  //track link visit
  addEventListener("click", function(ev) {
    var link = ev.target, ele;
    if ((ev.button === 0) && (link.tagName === "A")) {
      ele = link.parentNode; //title P element
      if (ele) {
        ele = ele.parentNode; //entry DIV element
        if (ele) {
          ele = ele.parentNode; //thing DIV element
          if (ele && ele.classList.contains("thing")) {
            ev.preventDefault();
            if (!isLinkVisited(link)) {
              visitedUrls.push([(new Date()).valueOf(), link.href]);
              localStorage.visitedUrls = JSON.stringify(visitedUrls);
              ele.style.display = "none";
            }
          }
        }
      }
    }
  });

  //remove any visited link records which are too old
  for (i = visitedUrls.length-1; i >= 0; i--) {
    if ((now-visitedUrls[i][0]) >= visitedLinkExpiry) {
      visitedUrls.splice(i, 1);
    }
  }
  localStorage.visitedUrls = JSON.stringify(visitedUrls);

  //hide visited links when page has been loaded
  eles = document.querySelectorAll(".thing.link > .entry > .title > .title");
  for (i = eles.length-1; i >= 0; i--) {
    if (isLinkVisited(eles[i])) {
      eles[i].parentNode.parentNode.parentNode.style.display = "none";
    }
  }
})();
