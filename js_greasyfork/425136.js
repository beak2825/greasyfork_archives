// ==UserScript==
// @name         Auto Agree+Skip YouTube Consent/Sign-in Pages
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.2
// @license      AGPLv3
// @author       jcunews
// @description  Automatically click on the "I Agree" button on YouTube's consent page, the "No thanks" link on YouTube's sign-in popup, or the "I understand and wish to proceed" button on YouTube's video page.
// @match        https://consent.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425136/Auto%20Agree%2BSkip%20YouTube%20ConsentSign-in%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/425136/Auto%20Agree%2BSkip%20YouTube%20ConsentSign-in%20Pages.meta.js
// ==/UserScript==

((a, t) => {

  let waitTime = 10; //how many seconds to wait for any sign-in popup to appear after fresh-loading a web page

  switch (location.hostname) {
    case "consent.youtube.com":
      if (a = document.querySelector('[type="submit"]')) a.click();
      break;
    case "www.youtube.com":
      addEventListener("load", h => {
        t = (new Date).getTime();
        h = setInterval(() => {
          if (a = document.querySelector('\
yt-upsell-dialog-renderer tp-yt-paper-button[aria-label="No thanks"],\
.yt-player-error-message-renderer tp-yt-paper-button[aria-label="I understand and wish to proceed"]'
          )) a.click();
          if (((new Date).getTime() - t) > (waitTime * 1000)) clearInterval(h)
        }, 100);
      })
  }
})()
