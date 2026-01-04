// ==UserScript==
// @name         Show E-Hentai links on SauceNAO
// @description  A userscript that adds E-Hentai (or optionally ExHentai, your choice) links to images SauceNAO got from there originally.
// @namespace    https://easrng.net
// @match        https://saucenao.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @version      1.1
// @author       easrng
// @run-at       document-end
// @download-url https://easrng.github.io/saucenao-ehentai-links/saucenao-ehentai-links.user.js
// @license      be gay do crime
// @downloadURL https://update.greasyfork.org/scripts/463959/Show%20E-Hentai%20links%20on%20SauceNAO.user.js
// @updateURL https://update.greasyfork.org/scripts/463959/Show%20E-Hentai%20links%20on%20SauceNAO.meta.js
// ==/UserScript==
(function () {
  let useExhentai = Boolean(GM_getValue("useExhentai"));
  for (const img of document.querySelectorAll('img[src*="/ehentai/"]')) {
    const seggs = new URL(img.src).pathname.split("/");
    const hash = seggs[seggs.length - 1].split(".")[0];
    img
      .closest("tr")
      .querySelector(".resultmiscinfo")
      .insertAdjacentHTML(
        "beforeend",
        `<a class="__easrng_eh_link_to_update" href="https://e${
          useExhentai ? "x" : "-"
        }hentai.org/?f_shash=${encodeURIComponent(
          hash
        )}"><img alt="" src="/images/static/siteicons/e-hentai.ico" width="16" height="16" border="0"></a><br><br style="line-height:2px;">`
      );
  }
  let lastMenuId;
  function useExhentaiChanged() {
    for (const link of document.querySelectorAll(
      ".__easrng_eh_link_to_update"
    )) {
      const url = new URL(link.href);
      url.hostname = `e${useExhentai ? "x" : "-"}hentai.org`;
      link.href = url.href;
    }
    const checkbox = (bool) => (bool ? "✔️" : "　");
    if (lastMenuId) GM_unregisterMenuCommand(lastMenuId);
    lastMenuId = GM_registerMenuCommand(
      checkbox(useExhentai) + " Use exhentai.org",
      () => {
        useExhentai = !useExhentai;
        GM_setValue("useExhentai", useExhentai);
      }
    );
  }
  useExhentaiChanged();
  GM_addValueChangeListener(
    "useExhentai",
    (name, oldValue, newValue, remote) => {
      console.log("useExhentai changed from", oldValue, "to", newValue);
      useExhentai = Boolean(newValue);
      useExhentaiChanged();
    }
  );
})();
