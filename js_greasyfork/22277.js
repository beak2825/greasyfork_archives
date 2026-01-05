// ==UserScript==
// @name         Politics and War PPU Updater
// @namespace    https://greasyfork.org/users/60012
// @version      2.0.0
// @description  A simple script to automatically update the price of a resource to one minus the lowest offer when you create an offer. Only works for selling.
// @author       Yosodog
// @match        https://politicsandwar.com/nation/trade/create/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/22277/Politics%20and%20War%20PPU%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/22277/Politics%20and%20War%20PPU%20Updater.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const apiKey = ""; // <-- Insert your API key here. Required.
  if (!apiKey) {
    console.log("API Key missing. Edit the script and add your API Key.");
    throw new Error("API Key missing.");
  }

  const endpoint = `https://api.politicsandwar.com/graphql?api_key=${encodeURIComponent(apiKey)}`;


  const GQL_QUERY = `
    query LowestSell($resources: [String!]!) {
      trades(
        type: GLOBAL
        offer_resource: $resources
        buy_or_sell: "sell"
        accepted: false
        orderBy: [{ column: PRICE, order: ASC }]
        first: 1
      ) {
        data { price }
      }
    }
  `;

  const $resource = $("#resourceoption");
  const $ppu = $("#priceper");

  function getSelectedResource() {
    return String($resource.val() || "").trim().toLowerCase();
  }

  async function fetchLowestSellPrice(resource) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GQL_QUERY,
          variables: { resources: [resource] } // <<— array!
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join("; "));
      const rows = json?.data?.trades?.data ?? [];
      if (!rows.length) return null;
      return Number(rows[0].price);
    } catch (e) {
      console.error("GraphQL fetch failed:", e);
      return null;
    }
  }

  function setPPUFromLowest(lowest) {
    if (lowest == null || Number.isNaN(Number(lowest))) return;
    const adjusted = Math.max(1, Math.floor(Number(lowest) - 1));
    $ppu.val(adjusted);
  }

  async function updatePPUForSelected() {
    const resource = getSelectedResource();
    if (!resource) return;
    const lowest = await fetchLowestSellPrice(resource);
    setPPUFromLowest(lowest);
  }

  // Prefill and react to changes
  updatePPUForSelected();
  let t = null;
  $resource.on("change", () => {
    if (t) clearTimeout(t);
    t = setTimeout(updatePPUForSelected, 150);
  });
})();
