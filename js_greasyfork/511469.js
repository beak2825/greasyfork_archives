// ==UserScript==
// @name                Collapse WhatsApp
// @author              Rahatul Ghazi
// @description         Hide elements on WhatsApp Web using Alt+C (Channels) and Alt+S (Sidebar)
// @grant               none
// @homepage            https://github.com/rahaaatul/UserScripts
// @icon                data:image/png;base64,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
// @license             MIT License
// @match               *://*.whatsapp.com/*
// @namespace           rahaaatul
// @source              https://github.com/rahaaatul/UserScripts/raw/refs/heads/main/Collapse%20Whatsapp/collapse-whatsapp.js
// @supportURL          https://github.com/rahaaatul/UserScripts/issues/new
// @version             1
// @downloadURL https://update.greasyfork.org/scripts/511469/Collapse%20WhatsApp.user.js
// @updateURL https://update.greasyfork.org/scripts/511469/Collapse%20WhatsApp.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to toggle Channel Lists
  function toggleChannels() {
    let elements = document.querySelectorAll(
      "._aigs.two > ._aigw._aigv, ._aigu > ._aohf._aigv._aigw._aigx"
    );

    elements.forEach((el) => {
      if (el.style.display === "none") {
        el.style.display = "flex";
      } else {
        el.style.display = "none";
      }
    });
  }

  // Function to toggle Sidebar
  function toggleSidebar() {
    let element = document.querySelector(
      "._aigs.two > .xn6708d.x1ye3gou.x1a0jr7w.xu3j5b3.xm81vs4.x1acz5yr.x5yr21d.xbyj736.xl56j7k.x6s0dn4.x78zum5.x9f619.x1n2onr6.xa1v5g2"
    );
    let targetElement = document.querySelector(
      "._aigu > ._aohf._aigv._aigw._aigx"
    );

    if (element.style.display === "none") {
      element.style.display = "flex";
      targetElement.style.marginInlineStart = "var(--navbar-width)";
    } else {
      element.style.display = "none";
      targetElement.style.marginInlineStart = "unset";
    }
  }

  // Event listener to toggle functions
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      toggleChannels();
    } else if (e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      toggleSidebar();
    }
  });
})();
