// ==UserScript==
// @name         UploadrAr Auto Downloader
// @description  Automatically clicks download links for UploadrAr
// @author       Magic <magicoflolis@tuta.io>
// @license      MIT
// @namespace    https://github.com/magicoflolis/userscriptrepo/tree/master/UploadrAr
// @homepageURL  https://github.com/magicoflolis/userscriptrepo/tree/master/UploadrAr
// @supportURL   https://github.com/magicoflolis/userscriptrepo/issues/new
// @icon         https://uploadrar.com/uploadrar_style/images/favicon.png
// @match        https://uploadrar.com/*
// @exclude      https://uploadrar.com/?op=*
// @exclude      https://uploadrar.com/make_money.html
// @exclude      https://uploadrar.com/pages/*
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439643/UploadrAr%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439643/UploadrAr%20Auto%20Downloader.meta.js
// ==/UserScript==

// Options
let Version = "free", // free (default) / premium
fullAutoDownload = true, // true (default) / false
afterDelay = 0; // 0 (default) / any #

// Userscript Code
(() => {
  try {
    const delay = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    qs = async element => {
      while (document.querySelector(element) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      return (afterDelay !== 0) ? delay(afterDelay).then(() => document.querySelector(element)) : document.querySelector(element);
    };
    let firstSel,secondSel;
    (Version !== "free") ? (
      firstSel = "input.xfs-premium-download",
      secondSel = "input.mngez-premium-download"
      ) : (
        firstSel = "input.xfs-free-download",
        secondSel = "input.mngez-free-download"
        )
    if(fullAutoDownload) {
      qs(firstSel).then(btn => {
        btn.click();
      });
      qs(secondSel).then(btn => {
        btn.click();
      });
    } else {
      qs(secondSel).then(btn => {
        btn.click();
      });
    };
    qs("span#direct_link > a").then(link => {
      window.open(link.href, "_blank");
    });
  } catch (e) {
    console.log("[%cUAD%c] %cERROR","color: rgb(29, 155, 240);","","color: rgb(249, 24, 128);",e)
  }
})();
