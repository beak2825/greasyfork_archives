// ==UserScript==
// @name         Favicon Changer
// @description  A script to change the favicon of a website dynamically.
// @icon         https://lh3.googleusercontent.com/HCZN-e46WVjQuhNwXMvqYgi7N-nBBX-u4CMxBj2B15vYqeFF12YTHvE9ECeZ2FuzGWvB1PT03-uCDXGRl_Erjt_-XWc=s120
// @version      0.0.6
// @author       foomango
// @match        *microstrategy.atlassian.net/*
// @match        *strategyagile.atlassian.net/*
// @match        *cloudnext-dev-quarterly-upgrade.trial.cloud.microstrategy.com/*
// @match        *cloudnext-dev-quarterly-upgrade.trial.cloud.*strategy.com/*
// @match        *cloudnext-qa-quarterly-upgrade.trial.cloud.microstrategy.com/*
// @match        *cloudnext-qa-quarterly-upgrade.trial.cloud.strategy.com/*
// @match        *deploy-stg.cloud.microstrategy.com/*
// @match        *deploy-stg.cloud.strategy.com/*
// @match        *provision.customer.cloud.microstrategy.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539789/Favicon%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/539789/Favicon%20Changer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let newFaviconUrl = "";
  if (window.location.hostname.includes("microstrategy.atlassian.net")) {
    newFaviconUrl =
      "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png";
  } else if (window.location.hostname.includes("strategyagile.atlassian.net")) {
    newFaviconUrl = "https://cdn-icons-png.flaticon.com/128/5968/5968875.png";
  } else if (
    window.location.hostname.includes(
      "provision.customer.cloud.microstrategy.com"
    )
  ) {
    newFaviconUrl =
      "https://cdn-1.webcatalog.io/catalog/microstrategy/microstrategy-icon-filled-256.webp?v=1714775136585";
  } else if (/^cloudnext-dev-quarterly-upgrade.trial.cloud.*strategy.com$/.test(window.location.hostname)) {
    newFaviconUrl = 'https://cdn-icons-png.flaticon.com/128/3242/3242257.png';
  } else if (/^cloudnext-qa-quarterly-upgrade.trial.cloud.*strategy.com$/.test(window.location.hostname)) {
    newFaviconUrl = 'https://cdn-icons-png.flaticon.com/128/10061/10061767.png';
  } else if (/^deploy-stg.cloud.*strategy.com$/.test(window.location.hostname)) {
    newFaviconUrl = 'https://cdn-icons-png.flaticon.com/128/2299/2299834.png';
  }

  // Function to dynamically update the favicon
  function changeFavicon(url) {
    if (!url) {
      console.warn("No favicon URL provided.");
      return;
    }
    // Provide the URL of the desired favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;

    // Remove existing favicon if it exists
    ['link[rel="icon"]', 'link[rel="shortcut icon"]'].forEach((rel) => {
      const existingLink = document.querySelector(rel);
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    });

    // Append the new favicon
    document.head.appendChild(link);
  }

  // Call the function when the page loads
  changeFavicon(newFaviconUrl);

  // Optional: You can add more logic here to change the favicon dynamically
})();
