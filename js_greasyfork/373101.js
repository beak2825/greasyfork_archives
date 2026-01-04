// ==UserScript==
// @name         Single Page Everything
// @namespace    @leesei/userscripts
// @version      2.0.0
// @description  Load single page version of page for supported sites
// @author       leesei@gmail.com
// @license      MIT
// @supportURL   https://github.com/leesei/userscripts/issues
// @match        http*://*.howstuffworks.com/*
// @match        http*://www.anandtech.com/show/*
/// @match        http*://www.tomshardware.com/reviews/*.html
// @match        http*://learn.adafruit.com/*
// @match        http*://learn.sparkfun.com/tutorials/*
// @match        http*://arstechnica.com/*
// @run-at       document-start
// @grant        GM_log
// @grant        GM_info
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373101/Single%20Page%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/373101/Single%20Page%20Everything.meta.js
// ==/UserScript==

function log(level, text) {
  GM_log(level + ": " + text);
}

const handlers = {
  howstuffworks: function (params) {
    if (!location.pathname.endsWith(".htm")) return;

    const links = document.querySelectorAll("a[rel='nofollow']");
    for (const link of links) {
      if (link.innerText == "Print") {
        return location.replace(link.href);
      }
    }
  },
  anandtech: function (params) {
    location.replace(location.pathname.replace("/show", "/print"));
  },
  // tomshardware: function (params) {
  //   location.replace(
  //     location.pathname.replace("/reviews", "/print").replace(",", ",reviews-")
  //   );
  // },
  adafruit: function (params) {
    const links = document.querySelectorAll(
      "ul[aria-label='Guide resources'] li a"
    );
    for (const link of links) {
      if (link.innerText == "Single page") {
        return location.replace(link.href);
      }
    }
  },
  sparkfun: function (params) {
    const links = document.querySelectorAll("a.list-group-item");
    for (const link of links) {
      if (link.innerText == "Single Page") {
        return location.replace(link.href);
      }
    }
  },
  arstechnica: function (params) {
    const link = document.querySelector("link[rel='amphtml']");
    if (link) location.replace(link.href);
  },
};

(function () {
  "use strict";

  log(
    "info",
    ">>> [" + GM_info.script.namespace + "] " + GM_info.script.name + " <<<"
  );

  const params = new URLSearchParams(location.search);
  // log("info", JSON.stringify(params.entries()));

  for (const domain in handlers) {
    if (location.hostname.includes(domain)) {
      handlers[domain](params);
      break;
    }
  }
})();
