// ==UserScript==
// @name         New Plan: Webtoon viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removeing Webtoons ridiculous adult filter made easier
// @author       RAVEN
// @include      http://www.webtoons.com/*
// @include      https://www.webtoons.com/*
// @include      http://m.webtoons.com/*
// @include      https://m.webtoons.com/*
// @icon         https://static.wikia.nocookie.net/logopedia/images/4/49/Old_webtoons_logo.png/revision/latest?cb=20190831200032
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535407/New%20Plan%3A%20Webtoon%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535407/New%20Plan%3A%20Webtoon%20viewer.meta.js
// ==/UserScript==

//notes you may change the website by adding a include of the site

// Made on 5/8/25

/* Webtoon - Disable Loginfra tracking by RandomUsername404 */

// I did not ask for permission

function findLink(el) {
    if (el.tagName == 'A' && el.href) {
        return el.href;
    } else if (el.parentElement) {
        return findLink(el.parentElement);
    } else {
        return null;
    }
};

function callback(e) {
    const link = findLink(e.target);
    if ((link == null || link.slice(link.length - 1) == "#") || link.id == "btnLogIn") {
        return;
    }
    e.preventDefault();
    window.location.href = link;

};

document.addEventListener('click', callback, false);

/* Webtoon - Disable Loginfra tracking by RandomUsername404 */

/* Allow scroling */

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function runSixteenTimes() {
  for (let i = 0; i < 16; i++) {
    document.body.style.overflow = "visible";
    document.querySelectorAll('div.ly_wrap.fixed.on').forEach(el => el.remove());
    document.querySelectorAll('div.ly_dim').forEach(el => el.remove());
    console.log(`Run ${i + 1}: overflow set to visible`);

    if (i < 15) {
      await wait(1000); // Wait 10 seconds between runs, but not after the last one
    }
  }
}

runSixteenTimes();