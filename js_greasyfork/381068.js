// ==UserScript==
// @name     Github anchor enhance
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description Enhance github repository link with badges
// @grant    GM.xmlHttpRequest
// @run-at   document-end
// @include	 *
// @version   2023.08.27+d1f0a919
// @downloadURL https://update.greasyfork.org/scripts/381068/Github%20anchor%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/381068/Github%20anchor%20enhance.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/github-anchor-enhance.user.ts
  var reservedUsername = /* @__PURE__ */ new Set([
    "topics",
    "search",
    "ghost",
    "pulls",
    "issues",
    "marketplace",
    "explore",
    "discover",
    "notifications",
    "new",
    "organizations",
    "settings",
    "site",
    "about",
    "contact",
    "pricing",
    "apps",
    "features",
    "password_reset",
    "trending",
    "collections",
    "events",
    "stars",
    "codespaces",
    "sponsors",
    "logout",
    "account"
  ]);
  var allBadgeClasses = ["added-stars-badge", "added-last-commit-badge"];
  var current = parseURL(location.href);
  function parseURL(rawURL) {
    const u = new URL(rawURL, document.baseURI);
    if (u.hostname !== "github.com") {
      return;
    }
    const match = /^\/([^/]+?)\/([^/]+?)(?:.git)?\/?$/.exec(u.pathname);
    if (!match) {
      return;
    }
    const owner = match[1];
    const repo = match[2];
    if (owner === (current == null ? void 0 : current.owner) && repo === current.repo) {
      return;
    }
    if (reservedUsername.has(owner)) {
      return;
    }
    return {
      owner,
      repo
    };
  }
  function appendBadge(el, className, url) {
    return __async(this, null, function* () {
      if (el.classList.contains(className)) {
        return;
      }
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url,
          onload: (resp) => {
            if (resp.status === 200) {
              if (!el.classList.contains(className)) {
                const img = document.createElement("img");
                img.src = `data:image/svg+xml;base64,${btoa(resp.response)}`;
                const containerClassNames = [
                  "natescarlet-gmail-com",
                  "badge-container"
                ];
                const selector = containerClassNames.map((i) => "." + i).join("");
                const container = el.querySelector(selector) || document.createElement("span");
                el.appendChild(container);
                container.classList.add(...containerClassNames);
                container.append(img);
                img.style.order = allBadgeClasses.indexOf(className).toString();
                container.style.display = "inline-flex";
                el.classList.add(className);
              }
              resolve();
            }
            reject(`${resp.status}: ${url}`);
          },
          onerror: reject
        });
      });
    });
  }
  function appendStarsBadge(el, res) {
    return __async(this, null, function* () {
      yield appendBadge(
        el,
        "added-stars-badge",
        `https://img.shields.io/github/stars/${res.owner}/${res.repo}.svg?style=social`
      );
    });
  }
  function appendLastCommitBadge(el, res) {
    return __async(this, null, function* () {
      yield appendBadge(
        el,
        "added-last-commit-badge",
        `https://img.shields.io/github/last-commit/${res.owner}/${res.repo}.svg`
      );
    });
  }
  (function() {
    return __async(this, null, function* () {
      document.addEventListener(
        "mouseover",
        (e) => __async(this, null, function* () {
          if (e.target instanceof HTMLAnchorElement) {
            const el = e.target;
            const res = parseURL(el.href);
            if (!res) {
              return;
            }
            try {
              yield Promise.all([
                appendStarsBadge(el, res),
                appendLastCommitBadge(el, res)
              ]);
            } catch (err) {
              console.error(err);
            }
          }
        }),
        {}
      );
    });
  })();
})();
