// ==UserScript==
// @name         BingChat Unlimited Searchbox Size
// @version      1.0
// @description  Change the maxlength of the searchbox element to 9999999
// @match        https://www.bing.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1071946
// @downloadURL https://update.greasyfork.org/scripts/465397/BingChat%20Unlimited%20Searchbox%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/465397/BingChat%20Unlimited%20Searchbox%20Size.meta.js
// ==/UserScript==

// There is still a limit to the maximum length of the searchbox (on OpenAI's backend)
// However, it is way larger than 2000 characters.
(function () {
  "use strict";
  console.log("BingChat Unlimited Searchbox Size: Activated");
  // Wait for 3 seconds before changing the maxlength attribute
  setTimeout(function () {
    var element =
      document.getElementsByClassName("cib-serp-main")[0].shadowRoot;
    var element2 = element.getElementById("cib-action-bar-main").shadowRoot;
    var root = element2.querySelector(".root");
    var searchbox = root.querySelector(".text-area");

    console.log(searchbox);
    // Set the maxlength attribute to 9999999
    searchbox.setAttribute("maxlength", "9999999");
  }, 3000); // 3000 milliseconds = 3 seconds
})();
