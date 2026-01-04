// ==UserScript==
// @name        GitHub Hide Security Banners
// @version     1.0.1
// @description A userscript that removes non-closable security banners from GitHub project boards ("Single-sign on to see items ..."", "Connect from an allowed IP...").
// @license     MIT
// @author      Klaus Eckelt
// @namespace   https://github.com/keckelt
// @match       https://github.com/orgs/*/projects/*
// @icon        data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16' viewBox='0 0 16 16' width='16'%3E%3Cpath d='m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM9.5 6.5c0 .536-.286 1.032-.75 1.3v2.45a.75.75 0 0 1-1.5 0V7.8A1.5 1.5 0 1 1 9.5 6.5Z'%3E%3C/path%3E%3C/svg%3E
// @run-at      document-end
//
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
//
// @description 19/05/2025, 10:46:06
// @downloadURL https://update.greasyfork.org/scripts/536478/GitHub%20Hide%20Security%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/536478/GitHub%20Hide%20Security%20Banners.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const autoClose = GM_getValue("ghsb-autoclose", false);
  document
    .querySelectorAll(".color-bg-inset .octicon-shield-lock")
    .forEach((el) => {
      if (autoClose) {
        el.parentElement.parentElement.remove();
      } else {
        const buttonGroup = document.createElement("div");
        buttonGroup.style.display = "flex";
        buttonGroup.style.gap = "1em";
        buttonGroup.style.marginLeft = "auto";

        //  add a sibling element to the icon
        const close = document.createElement("a");
        close.innerText = "❌";
        close.style.fontWeight = "bold";
        close.style.cursor = "pointer";

        close.title = "Close once";
        // on click remove the parent element
        close.onclick = () => {
          el.parentElement.parentElement.remove();
        };

        // insert as last  child of the parent element
        buttonGroup.appendChild(close);

        //  add a sibling element to the icon
        const ban = document.createElement("a");
        ban.innerText = "🚫";
        ban.style.fontWeight = "bold";
        ban.style.cursor = "pointer";
        ban.title = "Close always";
        // on click remove the parent element
        ban.onclick = () => {
          GM_setValue("ghsb-autoclose", !autoClose);
          document
            .querySelectorAll(".color-bg-inset .octicon-shield-lock")
            .forEach((el) => {
              el.parentElement.parentElement.remove();
            });
        };

        // insert as last  child of the parent element
        buttonGroup.appendChild(ban);
        el.parentElement.appendChild(buttonGroup);
      }
    });

  // Add GM options
  GM_registerMenuCommand(
    `Click to close banners ${autoClose ? "manually" : "automatically"}`,
    () => {
      const newAutoClose = !GM_getValue("ghsb-autoclose", false);
      GM_setValue("ghsb-autoclose", newAutoClose);
    }
  );
})();
