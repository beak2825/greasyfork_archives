// ==UserScript==
// @name        Codeforces Match Enhancer.
// @namespace   Violentmonkey Scripts
// @match       https://m1.codeforces.com/contest/*/submit
// @match       https://m2.codeforces.com/contest/*/submit
// @match       https://m3.codeforces.com/contest/*/submit
// @grant       none
// @version     1.2
// @author      dianhsu
// @license     MIT
// @run-at      document-idle
// @homepageURL https://greasyfork.org/zh-CN/scripts/484960-codeforces-match-enhancer
// @supportURL  https://github.com/dianhsu/cf-code/issues
// @description auto insert problem id and language in match.
// @downloadURL https://update.greasyfork.org/scripts/484960/Codeforces%20Match%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/484960/Codeforces%20Match%20Enhancer.meta.js
// ==/UserScript==

$(function () {
  'use strict';
  // get problem id from referrer url.
  const re = new RegExp("^https://[0-9a-z]+.codeforces.com/contest/[0-9]+/problem/([0-9a-zA-Z]+)$");
  if (re.test(document.referrer)) {
    let arr = re.exec(document.referrer);
    document.getElementById("problemIndex").value = arr[1];
  } else {
    console.debug("No valid referrer found.")
  }

  // load language from local storage and update selector.
  let lid = localStorage.getItem("programTypeId");
  document.getElementById("programTypeId").value = lid;
  // add event listener to watch selector changes.
  document.getElementById("programTypeId").addEventListener('change', function() {
    console.log('You selected: ', this.value);
    localStorage.setItem("programTypeId", this.value);
  });
});

