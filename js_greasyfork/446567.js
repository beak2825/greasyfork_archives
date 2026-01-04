// ==UserScript==
// @name         gurufocus ad-free
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Remove annoying ads from gurufocus :)
// @author       https://github.com/KamilKoso
// @match        https://www.gurufocus.com/*
// @icon         https://www.google.com/s2/favicons?domain=gurufocus.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446567/gurufocus%20ad-free.user.js
// @updateURL https://update.greasyfork.org/scripts/446567/gurufocus%20ad-free.meta.js
// ==/UserScript==

const observer = new MutationObserver(clearPage);

// This cookie is incremented each refresh, if value reaches 6 big ad shows and site is not being fully loaded
const pwcouCookie = {
  name: "pwcou1",
  domain: ".gurufocus.com",
  desiredValue: 0,
  expirationDays: 30,
};

// add here ads that are being displayed repeatedly
const adsToClear = ["div.el-dialog__wrapper.gf", "div.v-modal", "div.paywall-shadow", "div#business-description-non-logged", "section#notification-bar", "div#colorbox", "div#cboxOverlay", "div.ad-image-container"];

function clearPage() {
  let elems = document.querySelectorAll(adsToClear);
  setCookie(pwcouCookie.name, pwcouCookie.desiredValue, pwcouCookie.domain, pwcouCookie.expirationDays);
  elems.forEach((elem) => {
    elem.remove();
  });

  fixScroll();
}

function fixScroll() {
  const appContainer = document.querySelector(".app-wrapper .el-container");
  if (appContainer.getAttribute("style") == "height: auto;") {
    appContainer.setAttribute("style", "height: calc(100vh - 142px);");
  }
}

function setCookie(cName, cValue, cDomain, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; domain=" + cDomain + "; path=/";
}

(function () {
  observer.observe(document.body, { subtree: true, childList: true });
})();
