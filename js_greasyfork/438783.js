// ==UserScript==
// @name               ViewOnYPMemoryHole
// @name:de            ViewOnYPMemoryHole
// @name:en            ViewOnYPMemoryHole
// @namespace          sun/userscripts
// @version            1.0.18
// @description        An add-on for ViewOnYP that adds support for Memory Hole.
// @description:de     Ein Add-on für ViewOnYP, das Unterstützung für Memory Hole hinzufügt.
// @description:en     An add-on for ViewOnYP that adds support for Memory Hole.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            *://www.patreon.com/*
// @match              *://www.patreon.com/*
// @connect            api.memoryhole.cc
// @run-at             document-end
// @inject-into        auto
// @grant              GM.deleteValue
// @grant              GM_deleteValue
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.registerMenuCommand
// @grant              GM_registerMenuCommand
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/ViewOnYPMemoryHole.png
// @copyright          2022-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/438783/ViewOnYPMemoryHole.user.js
// @updateURL https://update.greasyfork.org/scripts/438783/ViewOnYPMemoryHole.meta.js
// ==/UserScript==

(async () => {
  if (!(await GM.getValue("cache2"))) await GM.setValue("cache2", {});
  const cache = await GM.getValue("cache2");

  GM.registerMenuCommand("Clear cache", () => {
    GM.deleteValue("cache2").then(alert("Cache cleared successfully."));
  });

  window.addEventListener("load", () => {
    const campaign = unsafeWindow.patreon.bootstrap.campaign.data.id;

    if (cache[campaign]) {
      show(cache[campaign]);
    } else {
      get(campaign);
    }
  });

  function get(campaign) {
    GM.xmlHttpRequest({
      url: "https://api.memoryhole.cc/graphql",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        query: `query { getPatreonByCampaignId (campaignId: ${campaign}) { creator { id } } }`,
      }),
      onload: (response) => {
        const id = JSON.parse(response.responseText).data
          ?.getPatreonByCampaignId?.creator?.id;

        if (id) show(id);
      },
    });
  }

  function show(id) {
    if (document.getElementById("voyp")) {
      insert(id);
    } else {
      const observer = new MutationObserver(() => {
        if (document.getElementById("voyp")) insert(id);
      });
      observer.observe(document.body, { childList: true });
    }

    if (!cache[campaign]) cache[campaign] = id;
    GM.setValue("cache2", cache);
  }

  function insert(id) {
    document.getElementById("voyp").getElementsByTagName("span")[0]?.remove();

    document
      .getElementById("voyp")
      .insertAdjacentHTML(
        "beforeend",
        `<br><b>Memory Hole:</b> <a href="https://memoryhole.cc/creator/${id}">https://memoryhole.cc/creator/${id}</a>`,
      );

    insert = () => {};
  }
})();
