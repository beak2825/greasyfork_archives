// ==UserScript==
// @name            The Epoch Times - Ads & Paywall Removal
// @namespace       The Epoch Times - Ads & Paywall Removal
// @version         1.2
// @description     Removes ads and paywall on The Epoch Times.
// @author          asheroto
// @license         MIT
// @match           https://www.theepochtimes.com/*
// @icon            https://www.theepochtimes.com/favicon.ico
// @grant           GM_addElement
// @grant           GM_log
// @downloadURL https://update.greasyfork.org/scripts/430508/The%20Epoch%20Times%20-%20Ads%20%20Paywall%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/430508/The%20Epoch%20Times%20-%20Ads%20%20Paywall%20Removal.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          asheroto
// ==/OpenUserScript==

/* jshint esversion: 8 */

(function () {

  // Prefix for console log
  const logPrefix = "[Ads & Paywall Removal]";

  // Console logging function
  function doLog(msg) {
    console.log(logPrefix + " " + msg);
  }

  // Function to wait until an element exists
  async function waitForElement(selector, callback, checkFrequencyInMs, timeoutInMs) {
    doLog("Waiting for element: " + selector);
    let startTimeInMs = Date.now();
    while (document.querySelector(selector) == null) {
      await new Promise(resolve => setTimeout(resolve, checkFrequencyInMs));
      if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
        doLog("Completed timeout waiting for element: " + selector);
        return;
      }
    }
    doLog("Element found: " + selector);
    callback();
  }

  // List of CSS changes (instant ad removal)
  const css = `
    #ad_right_top_300x250_1 { display: none !important; }
    #article_ad_right_middle_300x250_1,
    #article_ad_right_middle_300x250_2,
    #article_ad_right_top_300x250_1,
    #article_ad_right_top_300x250_2,
    #in_article_ads_0,
    #in_article_ads_1,
    #in_article_ads_2,
    #in_article_ads_3,
    #in_article_ads_4,
    #in_article_ads_5,
    #in_article_ads_6,
    #in_article_ads_7,
    #in_article_ads_8,
    #inside_ad_336x280_1,
    #inside_ad_336x280_2,
    #landing-page { display: none !important; }
    #main { height: unset !important; overflow: unset !important; }
    #main > div { border-top: unset; margin-top: 0px; }
    #modal-COMMON { display: none !important; }
    #partnership { display: none !important; }
    .home-wall { display: none !important; }
    .login_wrapper { display: none !important; }
    .right_col.noprint > div { margin: unset !important; }
    .soft_stikcy { display: none !important; }
    .top_ad { display: none !important; }
    #footer { display: block !important; }
  `;

  // Apply the styles above to document stylesheet
  async function applyStyles(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
    doLog("Applied styles");
  }

  // Every 0.5 seconds, check if any item from the blacklist array is included in the src value of an item, and if so, hide that item, ends loop after 5 seconds
  async function removeElements() {
    const blacklist = ["doubleclick.", "amazon-adsystem", "adnxs", "ads."];
    const tags = ["script", "iframe"];

    let repeat = setInterval(function () {
      tags.forEach(function (item) {
        const elements = Array.from(document.getElementsByTagName(item));
        elements.forEach(function (src) {
          blacklist.forEach(function (b) {
            if (src.src.includes(b)) {
              src.style.setProperty('display', 'none', 'important');
              doLog("Hidden: " + item + " " + src.src);
            }
          });
        });
      });
    }, 500);

    // Clear tag removal after 5 seconds
    setTimeout(function () {
      clearInterval(repeat);
      doLog("Stopped removal loop");
    }, 5000);
  }

  // Modal will be hidden in CSS above, but this will help it out a little and enable the scrollbars again
  async function modalHelper() {
    waitForElement("#modal-COMMON", function () {
      const modal = document.querySelector("#modal-COMMON");
      modal.className = modal.className.replaceAll("is-open", "is-closed");
      document.body.classList.remove("free_user", "hidden");
      document.body.style.overflow = "";
      doLog("Removed modal, enabled scrollbars");
    }, 250, 5000);
  }

  // Hide any items that have a prefix listed in the adListIds array
  async function hideElements() {
    const adListIds = ["in_article", "inside_ad", "article_ad", "ad_"];
    let repeat = setInterval(function () {
      adListIds.forEach(function (adId) {
        const selector = '[id^="' + adId + '"], [class^="' + adId + '"]';
        const isId = selector.startsWith('[id=');
        const elements = Array.from(document.querySelectorAll(selector));
        elements.forEach(function (element) {
          element.style.setProperty('display', 'none', 'important');
          doLog("Hidden: " + (isId ? "ID " : "Class ") + adId);
        });
      });
    }, 500);

    // Clear tag removal after 5 seconds
    setTimeout(function () {
      clearInterval(repeat);
      doLog("Stopped removal loop");
    }, 5000);
  }

  applyStyles(css);
  removeElements();
  modalHelper();
  hideElements();

})();
