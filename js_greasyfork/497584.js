// ==UserScript==
// @name        Clear History
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      LovingObserver
// @license     GNU GPLv3
// @icon        https://icons.duckduckgo.com/ip2/reddit.com.ico
// @description 6/10/2024
// @downloadURL https://update.greasyfork.org/scripts/497584/Clear%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/497584/Clear%20History.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
  let purgeBtn = document.createElement("button");
  purgeBtn.type = "button";
  purgeBtn.textContent = "Clear History";
  purgeBtn.style.paddingLeft = "0.5rem";
  purgeBtn.style.paddingRight = "0.5rem";
  purgeBtn.style.alignSelf = "center";

  purgeBtn.addEventListener("click", (event) => {
    //clear recent searches and recently visited subreddits
    localStorage.removeItem("recent-searches-store");
    localStorage.removeItem("recent-subreddits-store");
    localStorage.removeItem("recent_subreddits.recent_subreddits");

    //clear your recently visited posts if you are on a page that displays them
    if (document.querySelector("recent-posts")) {
      document.querySelector("recent-posts").shadowRoot.querySelector("button").dispatchEvent(new Event("click"));
    }

    //refresh the page for changes to take effect
    location.reload();
  });

  //add the purgeBtn to the top nav bar
  document.querySelector("header nav div:nth-child(3) div").prepend(purgeBtn);
});