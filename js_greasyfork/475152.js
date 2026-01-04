// ==UserScript==
// @name         LinkedIn Clear Spam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filters out companies from job listings.
// @author       You
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475152/LinkedIn%20Clear%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/475152/LinkedIn%20Clear%20Spam.meta.js
// ==/UserScript==

const delay = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

const regexItems = [
    'brown & brown insurance',
    'dice',
    'lumen',
    'crypto',
    'TechTalent Squared',
    'Talentify.io',
    'SynergisticIT',
    'national general',
    'patterned learning ai',
    'get it recruit',
    'remoteworker us',
    'csc generation',
    'actalent',
    'piper companies',
    'braintrust',
    'cybercoders',
    'angi',
    'iboss',
    'oowlish',
    'kula\\.ai',
    'jobot',
    'motion recruitment',
    'cybercoder'
];

const regex = new RegExp(regexItems.join('|'), 'gim');

const filterResults = async () => {
  const list = document.querySelector(".jobs-search-results-list");

  for (let i = 0; i <= 6; ++i) {
    list.scroll(0, 500 * i);

    const results = document.querySelectorAll(
      ".jobs-search-results-list .scaffold-layout__list-container > li"
    );
    results.forEach((result, i) => {
      if (result.innerText.match(regex)) {
        result.remove();
        return;
      }

      if (result.innerText.match(/promoted/gim)) {
        result.remove();
        return;
      }
    });

    await delay(350);
  }

  const buttons = document.querySelectorAll(".artdeco-pagination__pages li");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      delay(350).then(() => {
          console.log('BEANS')
        filterResults();
      });
    });
  });

  list.scroll(0, 0);
};

(async () => {
  await delay(1500);

  await filterResults();
})();
