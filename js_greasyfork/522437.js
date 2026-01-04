// ==UserScript==
// @author      IanDesuyo
// @name        CPE Auto exam selector
// @namespace   https://github.com/IanDesuyo/userscripts/cpe-auto-exam-selector
// @description Automatically select your exam site in CPE exam registration page.
// @match       https://cpe.cse.nsysu.edu.tw/cpe/newest
// @version     1.0
// @grant       none
// @noframes
// @homepageURL https://github.com/IanDesuyo/userscripts
// @supportURL  https://github.com/IanDesuyo/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/522437/CPE%20Auto%20exam%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/522437/CPE%20Auto%20exam%20selector.meta.js
// ==/UserScript==

const EXAM_SITE_KEYWORD = "逢甲";
const AUTO_SUBMIT = false;

(() => {
  const schoolOption = [...document.querySelectorAll("select[name='site'] option")].filter(option =>
    option.innerText.includes(EXAM_SITE_KEYWORD)
  );
  const schoolValue = schoolOption[0].getAttribute("value");

  document.querySelector("select[name='site']").value = schoolValue;

  if (AUTO_SUBMIT) {
    const button = document.querySelector("table:last-child tr.info button");
    button.click();
  }
})();
