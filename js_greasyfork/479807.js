// ==UserScript==
// @name         Chrome New Webstore make available for all web browsers which support it
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPL v3
// @author       jcunews
// @description  Make extensions in the new version of Google Chrome Webstore be available for all web browsers which support it
// @match        https://chromewebstore.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479807/Chrome%20New%20Webstore%20make%20available%20for%20all%20web%20browsers%20which%20support%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/479807/Chrome%20New%20Webstore%20make%20available%20for%20all%20web%20browsers%20which%20support%20it.meta.js
// ==/UserScript==

(t => {
  function chk(a, b, c) {
    if ((a = location.pathname.match(/^\/detail\/([^\/]+)\/(.*)/)) && (b = document.querySelector('section div[data-is-touch-wrapper]>button:not([data-forall]):disabled'))) {
      b.dataset.forall = 1;
      b.disabled = false;
      b.addEventListener("click", () => c.click());
      b.appendChild(c = document.createElement("A"));
      c.style.display = "none";
      c.href = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=100.0&acceptformat=crx2,crx3&x=id%3D${a[2]}%26uc`
    }
  }
  (new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(chk, 200)
  })).observe(document.body, {childList: true, subtree: true});
  document.documentElement.insertAdjacentHTML("beforeend", `\
<style>
  div[role="dialog"][aria-labelledby="promo-header"],
  main>div:first-child>section:first-child>div[jscontroller][jsaction]:first-child {
    display: none;
  }
</style>`);
  chk()
})()