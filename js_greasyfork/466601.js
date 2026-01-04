// ==UserScript==
// @name         Vinted search followed brands
// @namespace    https://greasyfork.org/en/users/230946-odinbrood
// @version      2.1
// @description  Creates search URLs for your followed brands
// @include      http*://*vinted.*/member/personalization/brands/followed
// @grant        none
// @author       OdinBrood
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466601/Vinted%20search%20followed%20brands.user.js
// @updateURL https://update.greasyfork.org/scripts/466601/Vinted%20search%20followed%20brands.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function createButton() {
    const button = document.createElement('button');
    button.textContent = 'Generate search query for all brands you follow';
    button.addEventListener('click', handleButtonClick);
    return button;
  }

  function tryAppendingButton() {
    const bodyContent = document.querySelector('.body-content__sidebar');
    if (bodyContent && !bodyContent.querySelector('button')) {
      const button = createButton();
      bodyContent.appendChild(button);
    }
  }

  const intervalId = setInterval(tryAppendingButton, 1000);

  // Handle first button click event
  function handleButtonClick() {

    // Start logic
    const followNames = extractFollowNames();
    getBrandIds(followNames)
        .then(brandIds => {
          const searchURL = constructSearchURL(brandIds);
          addButton(searchURL, brandIds.length);
          window.open(searchURL, '_blank').focus();
        })
        .catch(error => {
          console.error('Error occurred:', error);
        });
    
    clearInterval(intervalId);
  }

  // Extract and return the contents of elements with the given CSS class
  function extractFollowNames() {
    // Find all <a> elements with the CSS class 'follow__name'
    const elements = document.querySelectorAll('.follow__name');
    const data = [];

    elements.forEach(element => {
      const content = element.textContent.trim();
      const href = element.getAttribute('href');
      data.push([content, href]);
    });

    return data;
  }

  // Find all IDs of brands
  async function getBrandIds(followNames) {
    const brandIds = [];
    const contents = followNames.map(item => item[1]);
    console.log(contents);

    // Regular expression to match the numeric ID in the URL format given
    const regex = /\/brand\/(\d+)-/;

    // Iterate over each URL and extract the brand ID numbers
    for (const url of contents) {
      const match = url.match(regex);
      if (match && match[1]) {
        // Convert the extracted string into a number and add to the brandIds array
        brandIds.push(parseInt(match[1], 10));
      }
    }

    brandIds.sort((a, b) => a - b);

    return brandIds;
  }

  // Construct search url from brand IDs
  function constructSearchURL(ids) {
    const baseURL = "/catalog?";
    const brandIds = ids.map(id => `brand_ids[]=${id}`).join("&");

    return `${baseURL}${brandIds}`;
  }

  // Add button for search url
  function addButton(url, range) {
    const anchor = document.createElement('a');
    const br = document.createElement("br");

    anchor.textContent = "Click to search for " + range + " brands";
    anchor.href = url;
    anchor.target = "_blank";

    const bodyContent = document.querySelector('.body-content__sidebar');
    if (bodyContent) {
      bodyContent.appendChild(br);
      bodyContent.appendChild(br);
      bodyContent.appendChild(anchor);
    }
  }

})();