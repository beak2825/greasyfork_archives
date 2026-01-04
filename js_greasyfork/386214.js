// ==UserScript==
// @name Ancestry.com - Remove paid hints
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Removes paid hints on the "All Hints" page and on individual person pages
// @license MIT
// @version 0.0.3
// @match https://*.ancestry.com/hints/tree/*
// @match https://*.ancestry.de/hints/tree/*
// @match https://*.ancestry.com/cs/offers/join*
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=ancestry.com
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/468323/Ancestrycom%20-%20Remove%20paid%20hints.user.js
// @updateURL https://update.greasyfork.org/scripts/468323/Ancestrycom%20-%20Remove%20paid%20hints.meta.js
// ==/UserScript==



/* jshint esversion: 6 */
"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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

  // src/main/ancestry-remove-paid-hints/ancestry-remove-paid-hints.user.ts
  var require_ancestry_remove_paid_hints_user = __commonJS({
    "src/main/ancestry-remove-paid-hints/ancestry-remove-paid-hints.user.ts"(exports) {
      (() => {
        const familyTreeSources = [62476, 9289, 1030, 1006];
        const handleOfferPage = (db, link) => {
          const dbidRegex = /[?&]dbid=(\d+)/;
          const dbidMatch = RegExp(dbidRegex).exec(link.href);
          if (dbidMatch) {
            const dbid = parseInt(dbidMatch[1], 10);
            const getRequest = db.transaction("collections_os", "readonly").objectStore("collections_os").get(dbid);
            getRequest.onsuccess = (event) => {
              const target = event.target;
              if (target) {
                const result = target.result;
                const putOS = db.transaction("collections_os", "readwrite").objectStore("collections_os");
                if (result) {
                  putOS.put({ dbid, name: result.name, tree: result.tree, paid: true, visible: false });
                } else {
                  putOS.put({ dbid, name: "", tree: false, paid: true, visible: false });
                }
              }
            };
          }
        };
        const initDB = () => new Promise((resolve, reject) => {
          const openRequest = window.indexedDB.open("collections_db", 1);
          openRequest.onerror = (event) => {
            console.error("Database failed to open");
            reject(event);
          };
          openRequest.onsuccess = (_event) => {
            resolve(openRequest.result);
          };
          openRequest.onupgradeneeded = (event) => {
            const eventTarget = event.target;
            if (eventTarget) {
              const tmpDb = eventTarget.result;
              const objectStore = tmpDb.createObjectStore("collections_os", {
                keyPath: "dbid"
              });
              objectStore.createIndex("name", "name", { unique: true });
              objectStore.createIndex("paid", "paid", { unique: false });
              objectStore.createIndex("tree", "tree", { unique: false });
              objectStore.createIndex("visible", "visible", { unique: false });
              console.log("Database setup complete");
              resolve(tmpDb);
            }
          };
        });
        const evalLink = (db, link) => {
          const linkText = link.textContent;
          if (linkText) {
            if (linkText !== "Review" && linkText.indexOf("	") === -1 && linkText.indexOf("\n") === -1) {
              const dbidRegex = /[?&]dbid=(\d+)/;
              const dbidMatch = RegExp(dbidRegex).exec(link.href);
              if (dbidMatch) {
                const dbid = parseInt(dbidMatch[1], 10);
                const getRequest = db.transaction("collections_os", "readonly").objectStore("collections_os").get(dbid);
                getRequest.onsuccess = (event) => {
                  const target = event.target;
                  if (target) {
                    const result = target.result;
                    let hide = false;
                    if (!result) {
                      GM.xmlHttpRequest({
                        method: "GET",
                        url: link.href,
                        onreadystatechange(response) {
                          if (response.readyState === Tampermonkey.ReadyState.HeadersReceived) {
                            const location = response.finalUrl;
                            if (location) {
                              const denyRegex = /offers\/join/;
                              const denyMatch = RegExp(denyRegex).exec(location);
                              const putOS = db.transaction("collections_os", "readwrite").objectStore("collections_os");
                              const isTree = familyTreeSources.indexOf(dbid) !== -1;
                              if (denyMatch) {
                                putOS.add({ dbid, name: link.textContent, paid: true, visible: false, tree: isTree });
                                hide = true;
                              } else if (isTree) {
                                putOS.add({ dbid, name: link.textContent, paid: false, visible: false, tree: true });
                                hide = true;
                              } else {
                                putOS.add({ dbid, name: link.textContent, paid: false, visible: true, tree: false });
                              }
                            }
                          }
                        }
                      });
                    } else {
                      hide = !result.visible;
                    }
                    if (hide) {
                      const li = link.closest("li[role='group']");
                      const section = link.closest("section");
                      if (li) {
                        li.remove();
                        if (section && section.querySelectorAll("li[role='group']").length === 1) {
                          section.remove();
                        }
                      }
                    }
                  }
                };
              }
            }
          }
        };
        const scanHints = (db, element) => {
          const sseLinks = element.querySelectorAll("a[href*='sse.dll']");
          sseLinks.forEach((link) => evalLink(db, link));
          const familyTreeLinks = element.querySelectorAll("a[href*='/family-tree/tree/']");
          familyTreeLinks.forEach((link) => {
            const li = link.closest("li[role='group']");
            const section = link.closest("section");
            if (li) {
              li.remove();
              if (section && section.querySelectorAll("li[role='group']").length === 1) {
                section.remove();
              }
            }
          });
        };
        const mutationObserverSetup = (db) => {
          const config = { childList: true, subtree: true };
          const callback = (mutationList, _observer) => {
            for (const mutation of mutationList) {
              if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                  const element = node;
                  if (element.innerHTML && (element.innerHTML.indexOf("sse.dll") !== -1 || element.innerHTML.indexOf("/family-tree/tree/") !== -1)) {
                    scanHints(db, element);
                  }
                });
              }
            }
          };
          const observer = new MutationObserver(callback);
          observer.observe(document, config);
        };
        const main = () => __async(exports, null, function* () {
          const db = yield initDB();
          if (db instanceof IDBDatabase) {
            if (window.location.href.indexOf("offers/join") !== -1) {
              handleOfferPage(db, window.location);
            } else {
              mutationObserverSetup(db);
            }
          }
        });
        main().catch((_error) => ({}));
      })();
    }
  });
  require_ancestry_remove_paid_hints_user();
})();
//# sourceMappingURL=ancestry-remove-paid-hints.user.js.map
