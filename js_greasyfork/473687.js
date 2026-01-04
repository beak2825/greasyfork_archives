// ==UserScript==
// @name        Copy URL
// @namespace   http://tampermonkey.net/
// @description 當滑鼠移動到文字連結時，並按下`⌘ C`，即可將網址連結複製到剪貼簿中.
// @match       *://*/*
// @version     0.1.6
// @author      Nick Lin
// @grant       GM_setClipboard
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMiAxMiI+CiAgPHBhdGggZD0iTTkuMzggMS41aC0xLjdhMi4yMzcgMi4yMzcgMCAwIDAtMy4xNy0uMThsLS4xOC4xOGgtMS43Yy0uNDEgMC0uNzUuMzQtLjc1Ljc1djcuODhjMCAuNDEuMzQuNzUuNzUuNzVoNi43NWMuNDEgMCAuNzUtLjM0Ljc1LS43NVYyLjI1YzAtLjQxLS4zNC0uNzUtLjc1LS43NVpNNiAxLjVjLjgzIDAgMS41LjY3IDEuNSAxLjVoLTNjMC0uODMuNjctMS41IDEuNS0xLjVabTMuMzggOC42MkgyLjYyVjIuMjVoMS4yNWMtLjA5LjI0LS4xMy40OS0uMTMuNzV2LjM4YzAgLjIxLjE3LjM4LjM4LjM4aDMuNzVjLjIxIDAgLjM4LS4xNy4zOC0uMzhWM2MwLS4yNi0uMDQtLjUxLS4xMy0uNzVoMS4yNXY3Ljg4WiIvPgogIDxwYXRoIGQ9Ik04LjEyIDIuMjVoMS4yNXY3Ljg4SDIuNjJWMi4yNWgxLjI1Yy0uMDkuMjQtLjEzLjQ5LS4xMy43NXYuMzhjMCAuMjEuMTcuMzguMzguMzhoMy43NWMuMjEgMCAuMzgtLjE3LjM4LS4zOFYzYzAtLjI2LS4wNC0uNTEtLjEzLS43NVpNNiAxLjVjLS44MyAwLTEuNS42Ny0xLjUgMS41aDNjMC0uODMtLjY3LTEuNS0xLjUtMS41WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPgogIDxwYXRoIGQ9Ik02LjI0IDguNjhjLjEzLjEzLjEzLjM1IDAgLjQ4bC0uMTcuMTdjLS42Ni42Ni0xLjc0LjY2LTIuNCAwLS42Ni0uNjYtLjY2LTEuNzQgMC0yLjRsLjY4LS42OGMuNjQtLjY0IDEuNjYtLjY3IDIuMzMtLjA3LjE0LjEzLjE1LjM0LjAzLjQ4cy0uMzQuMTUtLjQ4LjAzYy0uNC0uMzYtMS4wMi0uMzQtMS40LjA0bC0uNjguNjhjLS40LjQtLjQgMS4wNCAwIDEuNDQuNC40IDEuMDQuNCAxLjQ0IDBsLjE3LS4xN2MuMTMtLjEzLjM1LS4xMy40OCAwWm0yLjEtNC4wMkM3LjY4IDQgNi42IDQgNS45NCA0LjY2bC0uMTcuMTdjLS4xMy4xMy0uMTMuMzUgMCAuNDhzLjM1LjEzLjQ4IDBsLjE3LS4xN2MuNC0uNCAxLjA0LS40IDEuNDQgMHMuNCAxLjA0IDAgMS40NGwtLjY4LjY4Yy0uMzguMzgtLjk5LjQtMS40LjA0LS4xNC0uMTMtLjM2LS4xMS0uNDguMDNzLS4xMS4zNi4wMy40OGMuNjcuNiAxLjY5LjU3IDIuMzMtLjA3bC42OC0uNjhjLjY2LS42Ni42Ni0xLjc0IDAtMi40WiIgc3R5bGU9ImZpbGw6IzJmODhmZiIvPgo8L3N2Zz4=
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473687/Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/473687/Copy%20URL.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", () => {
    const evOpts = {
      capture: true,
      passive: true,
    };
    let hoveredLink = null;
    const linkElements = document.getElementsByTagName("a");
    for (const link of linkElements) {
      link.addEventListener(
        "mouseenter",
        () => {
          hoveredLink = link;
        },
        evOpts
      );
      link.addEventListener(
        "mouseleave",
        () => {
          hoveredLink = null;
        },
        evOpts
      );
    }
    function eventKeyDown(ev) {
      if (hoveredLink && (ev.metaKey || ev.ctrlKey) && ev.key === "c") {
        const linkUrl = hoveredLink.href;
        if (linkUrl !== null) {
          GM_setClipboard(linkUrl);
          console.log("Link Copied!", linkUrl);
        }
      }
    }
    window.addEventListener("keydown", eventKeyDown, evOpts);
  });
})();
