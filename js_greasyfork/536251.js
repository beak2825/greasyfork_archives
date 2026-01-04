// ==UserScript==
// @name        Ground News Pro Max
// @match       https://ground.news/*
// @description Unlocks ownership and factuality data on Ground News.
// @run-at      document-start
// @version 0.0.1.20250517034819
// @namespace https://greasyfork.org/users/1386876
// @downloadURL https://update.greasyfork.org/scripts/536251/Ground%20News%20Pro%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/536251/Ground%20News%20Pro%20Max.meta.js
// ==/UserScript==
  
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // index.ts
  var exports_ground_news = {};
  __export(exports_ground_news, {
    default: () => ground_news_default
  });

  // console.ts
  var console = Object.assign({}, window.console);
  var console_default = console;

  // index.ts
  var ground_news_default = null;
  (function() {
    const patchRscPayload = (line) => {
      const rules = [
        {
          key: "showFactualityData",
          from: "false",
          to: "true"
        },
        {
          key: "showOwnershipData",
          from: "false",
          to: "true"
        },
        {
          key: "user",
          from: '"$undefined"',
          to: '{"subscriptionStatus":"vantage"}'
        },
        {
          key: "subscriptionStatus",
          from: '"free"',
          to: '"vantage"'
        },
        {
          key: '"id":"ownershipData","type":"binary","enabled"',
          rawKey: true,
          from: "false",
          to: "true"
        },
        {
          key: '"id":"canViewStoryLevelTimelines","type":"binary","enabled"',
          rawKey: true,
          from: "false",
          to: "true"
        }
      ];
      for (const rule of rules) {
        const rawKey = rule.rawKey ? rule.key : `"${rule.key}"`;
        const fromStr = `${rawKey}:${rule.from}`;
        const toStr = `${rawKey}:${rule.to}`;
        if (line.includes(fromStr)) {
          line = line.replaceAll(fromStr, toStr);
          console_default.log(`Applied rule ${fromStr} -> ${toStr}`);
        }
      }
      return line;
    };
    let currentChunk = "";
    const patchRscPush = (el) => {
      if (Array.isArray(el) && el.length === 2 && el[0] === 1) {
        let chunk = el[1];
        currentChunk += chunk;
        if (currentChunk.endsWith(`
`)) {
          const patched = patchRscPayload(currentChunk);
          currentChunk = "";
          console_default.log("Emitting payload", patched);
          return [1, patched];
        }
        return null;
      }
      return el;
    };
    if (!window.__next_f) {
      console_default.log("Early, no __next_f");
      window.__next_f = [];
    } else {
      console_default.log("Already has __next_f", JSON.parse(JSON.stringify(window.__next_f)));
      window.__next_f.forEach((el) => {
        patchRscPush(el);
      });
    }
    let nextFlightPush = Array.prototype.push;
    window.__next_f.push = (el) => {
      const transformed = patchRscPush(el);
      if (transformed) {
        return nextFlightPush.apply(window.__next_f, [transformed]);
      }
      return el;
    };
    window.__next_f = new Proxy(window.__next_f, {
      set(target, prop, newValue, receiver) {
        if (prop === "push") {
          nextFlightPush = newValue;
          return true;
        }
        return Reflect.set(target, prop, newValue, receiver);
      }
    });
    const realFetch = window.fetch;
    window.fetch = async function(input, init) {
      if (arguments.length >= 2) {
        let isRsc = false;
        if (arguments[0] === "") {
          isRsc ||= true;
        } else {
          const url = new URL(arguments[0]);
          isRsc ||= !!url.searchParams.get("_rsc");
          if (url.toString().includes("amplitude-events")) {
            console_default.log("Discarded amplitude-events");
            return new Response("");
          }
          if (url.pathname === "/api/v04/account/policies") {
            console_default.log("Patching policies");
            const res = await realFetch.apply(this, [input, init]);
            if (!res.ok) {
              return res;
            }
            let j = await res.json();
            if (Array.isArray(j)) {
              j = j.map((policy) => {
                if ([
                  "ownershipData",
                  "factualityData",
                  "canViewStoryLevelTimelines"
                ].includes(policy.id)) {
                  return Object.assign(policy, {
                    enabled: true
                  });
                }
                return policy;
              });
            }
            return new Response(JSON.stringify(j), {
              status: res.status,
              statusText: res.statusText,
              headers: res.headers
            });
          }
        }
        if (isRsc) {
          const res = await realFetch.apply(this, [input, init]);
          if (!res.ok || res.headers.get("content-type")?.includes("html")) {
            return res;
          }
          let text = await res.text();
          text = text.split(`
`).map((line) => {
            return patchRscPayload(line);
          }).join(`
`);
          return new Response(text, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
          });
        }
      }
      return realFetch.apply(this, [input, init]);
    };
    const style = document.createElement("style");
    style.innerText = `
    div.hideElementSiteWide:has(.w-full) { display: none !important; }
    div#subscribe-top { display: none !important; }
  `;
    document.head.appendChild(style);
  })();
})();
