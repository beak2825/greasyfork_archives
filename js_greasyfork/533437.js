// ==UserScript==
// @name         SillyDev Downtime Checker
// @namespace    https://discopika.tk
// @version      1.0.0
// @description  Prompt when the node is rate limited or down
// @author       mallusrgreat
// @match        https://panel.sillydev.co.uk/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panel.sillydev.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533437/SillyDev%20Downtime%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/533437/SillyDev%20Downtime%20Checker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function checkStatus() {
    console.log("e");
    const match = location.href.match(
      /^https?:\/\/panel\.sillydev\.co\.uk\/server\/([a-z0-9]{8})/
    );
    console.log(match);
    if (!match) return;

    const serverId = match[1];

    try {
      const data = await fetch("https://silly.darklegacymc.tk/data").then(
        (res) => res.json()
      );
      const serverData = await fetch(
        `https://panel.sillydev.co.uk/api/client/servers/${serverId}`
      ).then((res) => res.json());
      const node = serverData.attributes.node;
      const nodeData = data[node];

      if (!nodeData) {
        console.log(`No data for node ${node}`);
        return;
      }

      let message = "";

      if (nodeData.rateLimitTime) {
        message += `The ${node} node is currently rate-limited on Discord! Expires ${formatRateLimitTime(
          nodeData.rateLimitTime
        )} (${nodeData.rateLimitTime.toLocaleString()} seconds).`;
      }

      if (nodeData.down) {
        message += `${
          message.length ? "\n" : ""
        }The ${node} node is currently down!`;
      }

      if (message) alert(message);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  checkStatus();
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      checkStatus();
    }
  }).observe(document, { subtree: true, childList: true });
})();
function formatRateLimitTime(seconds) {
  if (seconds >= 3600) {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      Math.floor(seconds / 3600),
      "hour"
    );
  } else if (seconds >= 60) {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      Math.floor(seconds / 60),
      "minute"
    );
  } else {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      seconds,
      "second"
    );
  }
}
