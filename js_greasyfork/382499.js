// ==UserScript==
// @name         Job Spotter
// @namespace    https://github.com/Kadauchi
// @version      1.0.2
// @description  Custom script for @Hastings on MTC
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://jobspotter.indeed.com/mturk/*
// @include      https://jobspotter-mturk.indeed.com/mturk/*
// @hitsource    https://jobspotter.indeed.com/mturk/fast-queue?sk=892a0b11144c16fc&v=1&assignmentId=3TOK3KHVJTJIM2DX4Z15I93C3UKO7B
// @downloadURL https://update.greasyfork.org/scripts/382499/Job%20Spotter.user.js
// @updateURL https://update.greasyfork.org/scripts/382499/Job%20Spotter.meta.js
// ==/UserScript==

function clicker(...selectors) {
  selectors.forEach((selector) => {
    document.querySelector(selector).click();
  });
}

function prefillHiringSign() {
  clicker(`#input-language-yes`, `#input-clear-photo-yes`, `#input-recognizable-people-hirign-sign-no`, `#input-shot-from-vehicle-hiring-sign-no`);
}

function prefillStorefront() {
  clicker(`#input-predicted-store-name-yes`, `#input-recognizable-people-storefront-no`, `#input-shot-from-vehicle-storefront-no`);
}

function prefillSuspicious() {
  clicker(`#input-fraud-nothing-suspicious`);
}

function enterToSubmit() {
  document.addEventListener(`keydown`, ({ key }) => {
    if (key === `Enter`) {
      clicker(`.submit-button`);
    }
  });
}

function main() {
  window.focus();
  prefillHiringSign();
  prefillStorefront();
  prefillSuspicious();
  enterToSubmit();
}

main();