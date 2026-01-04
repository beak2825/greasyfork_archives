// ==UserScript==
// @name         OSU change default discussion type to total
// @namespace    http://tampermonkey.net/
// @version      2024-07-08.2
// @description  Set default type of beatmapsets discussion page to 'total'
// @author       Kinomi
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499984/OSU%20change%20default%20discussion%20type%20to%20total.user.js
// @updateURL https://update.greasyfork.org/scripts/499984/OSU%20change%20default%20discussion%20type%20to%20total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

let previousUrl = "";
let init = false;
let intervel = null;

const handleNavigationChange = function (checkInit) {
  const btns = document.querySelectorAll("a.header-nav-v4__link");
  if (btns) {
    if (checkInit) {
      if (!init) {
        init = true;
        if (intervel !== null) clearInterval(intervel);
      } else return;
    }
    console.log(btns);
    btns.forEach((i) => {
      if (i.href && i.href.endsWith("discussion")) {
        i.href = `${i.href}/-/generalAll/total`;
      }
    });
    console.log(Array.from(btns).map((i) => i.href));
  }
};

const config = { attributes: true, childList: false, subtree: true };

const observer = new MutationObserver(() => {
  if (document.URL !== previousUrl) {
    previousUrl = document.URL;
    handleNavigationChange();
  }
});

observer.observe(document, config);

intervel = setInterval(() => {
  handleNavigationChange(true);
}, 200);

})();