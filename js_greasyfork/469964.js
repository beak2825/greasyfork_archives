// ==UserScript==
// @name         隐藏已屏蔽(隐藏)的推文, Hide blocked (hidden) tweets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏已屏蔽(隐藏)的推文, Hide blocked (hidden) tweets.
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469964/%E9%9A%90%E8%97%8F%E5%B7%B2%E5%B1%8F%E8%94%BD%28%E9%9A%90%E8%97%8F%29%E7%9A%84%E6%8E%A8%E6%96%87%2C%20Hide%20blocked%20%28hidden%29%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/469964/%E9%9A%90%E8%97%8F%E5%B7%B2%E5%B1%8F%E8%94%BD%28%E9%9A%90%E8%97%8F%29%E7%9A%84%E6%8E%A8%E6%96%87%2C%20Hide%20blocked%20%28hidden%29%20tweets.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function observeDom(targetNode, cb) {
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        cb(mutation);
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
    // observer.disconnect();
  }

  observeDom(document.body, function (mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length) {
      mutation.addedNodes.forEach((el) => {
        if (
          el &&
          el.getAttribute("data-testid") === "cellInnerDiv" &&
          (
            el.innerText.indexOf("这条推文来自一个你已") > -1 ||
            el.innerText.indexOf("此推文來自你設為") > -1 ||
            el.innerText.indexOf("This Tweet is from an account you") > -1)
        ) {
          // console.log("hit:", el);
          el.style.display = "none";
        }
      });
    }
  });
})();
