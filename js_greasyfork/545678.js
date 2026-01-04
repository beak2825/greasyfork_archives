// ==UserScript==
// @name         Ed 4Rec  type transform
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545678/Ed%204Rec%20%20type%20transform.user.js
// @updateURL https://update.greasyfork.org/scripts/545678/Ed%204Rec%20%20type%20transform.meta.js
// ==/UserScript==


//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================


const ENABLE_SCRIPT = true; // set to false to disable

if (ENABLE_SCRIPT && (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads"))) {

  setInterval(() => {
    try {
      const pwds = document.querySelectorAll('input[type="password"]');
      if (pwds.length) {
        pwds.forEach((inp) => {
          try {
            if (inp.type === "password") {
              inp.setAttribute("type", "text");
            }
          } catch (e) {
            // Some inputs may throw when changing type
            console.warn("Failed to change input type", e);
          }
        });
      }
    } catch (e) {
      console.warn("Password unmask interval error", e);
    }
  }, 100);
}