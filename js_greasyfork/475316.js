// ==UserScript==
// @name          kemono.su links for ppixiv
// @author        EnergoStalin
// @description   Add kemono.su patreon & fanbox & fantia links into ppixiv
// @license       AGPL-3.0-only
// @version       1.8.12
// @namespace     https://pixiv.net
// @match         https://*.pixiv.net/*
// @run-at        document-body
// @icon          https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @connect       gumroad.com
// @connect       fanbox.cc
// @connect       www.patreon.com
// @connect       kemono.cr
// @connect       nekohouse.su
// @connect       t.co
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475316/kemonosu%20links%20for%20ppixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/475316/kemonosu%20links%20for%20ppixiv.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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

  // src/databases/kemono.ts
  function toApiUrl(u) {
    const url = new URL(u);
    url.hostname = url.hostname.replace(".su", ".cr");
    url.pathname = `/api/v1${url.pathname.replace(/\/$/, "")}/profile`;
    return url.toString();
  }
  __name(toApiUrl, "toApiUrl");
  function getCreatorData(u) {
    return __async(this, null, function* () {
      const url = toApiUrl(u);
      const response = yield GM.xmlHttpRequest({
        url,
        headers: {
          Accept: "text/css"
        }
      });
      switch (response.status) {
        case 200: {
          const data = JSON.parse(response.responseText);
          return {
            lastUpdate: data.updated.split("T")[0]
          };
        }
        case 0:
          throw new Error("Timeout");
        default:
          throw new Error(`${response.status}`);
      }
    });
  }
  __name(getCreatorData, "getCreatorData");
  function getPostData(u) {
    return getCreatorData(u);
  }
  __name(getPostData, "getPostData");

  // src/databases/nekohouse.ts
  var CREATOR_LAST_UPDATE_TIME_REGEX = /datetime="(.+)?"/;
  var POST_LAST_UPDATE_TIME_REGEX = /datetime="(.+)?"/;
  function fetchPage(url) {
    return __async(this, null, function* () {
      let response;
      try {
        response = yield GM.xmlHttpRequest({
          method: "HEAD",
          url
        });
      } catch (e) {
        response = yield GM.xmlHttpRequest({
          method: "GET",
          url
        });
      }
      if (response.finalUrl !== url) throw new Error(`creator does not exist ${url}`);
      switch (response.status) {
        case 200:
          return (yield GM.xmlHttpRequest({
            method: "GET",
            url
          })).responseText;
        case 0:
          throw new Error("Timeout");
        default:
          throw new Error(`${response.status}`);
      }
    });
  }
  __name(fetchPage, "fetchPage");
  function getCreatorData2(url) {
    return __async(this, null, function* () {
      var _a, _b;
      const html = yield fetchPage(url);
      return {
        lastUpdate: (_b = (_a = html.match(CREATOR_LAST_UPDATE_TIME_REGEX)) == null ? void 0 : _a[1]) == null ? void 0 : _b.split(" ")[0]
      };
    });
  }
  __name(getCreatorData2, "getCreatorData");
  function getPostData2(url) {
    return __async(this, null, function* () {
      var _a, _b;
      const html = yield fetchPage(url);
      return {
        lastUpdate: (_b = (_a = html.match(POST_LAST_UPDATE_TIME_REGEX)) == null ? void 0 : _a[1]) == null ? void 0 : _b.split(" ")[0]
      };
    });
  }
  __name(getPostData2, "getPostData");

  // src/databases/index.ts
  function getCreatorData3(url) {
    return __async(this, null, function* () {
      if (url.includes("kemono")) return url.includes("post") ? getPostData(url) : getCreatorData(url);
      if (url.includes("nekohouse")) return url.includes("post") ? getPostData2(url) : getCreatorData2(url);
      throw new Error(`unknown url ${url}`);
    });
  }
  __name(getCreatorData3, "getCreatorData");

  // src/links/url.ts
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  __name(capitalize, "capitalize");
  function makeUrl(service, site, userId, postId) {
    const post = postId ? `/post/${postId}` : "";
    return {
      url: new URL(`https://${service}/${site}/user/${userId}/${post}`),
      icon: "mat:money_off",
      type: `${service}_${site}#${userId}`,
      label: `${capitalize(service)} ${site}`
    };
  }
  __name(makeUrl, "makeUrl");
  function makeUrls(array, site, userId, postId) {
    array.push(makeUrl("kemono.cr", site, userId, postId), makeUrl("nekohouse.su", site, userId, postId));
  }
  __name(makeUrls, "makeUrls");
  function normalizeUrl(url) {
    let normalized = url.trim();
    if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
    return normalized;
  }
  __name(normalizeUrl, "normalizeUrl");

  // src/ppixiv.ts
  var BODY_LINK_REGEX = /[\W\s]((?:https?:\/\/)?(?:\w+[\.\/])+(?:\w?)+)/g;
  var labelMatchingMap = {
    patreon: "patreon.com",
    fanbox: "Fanbox",
    fantia: "fantia.jp",
    gumroad: "gumroad.com",
    twitter: "t.co"
  };
  function preprocessMatches(matches) {
    return matches.map((e) => {
      try {
        const url = new URL(normalizeUrl(e));
        return {
          label: labelMatchingMap[Object.entries(labelMatchingMap).find(([k, v]) => url.host.includes(v) || url.host.includes(k))[0]],
          url
        };
      } catch (e2) {
      }
      return void 0;
    });
  }
  __name(preprocessMatches, "preprocessMatches");
  function getLinksFromDescription(extraLinks) {
    const desc = document.body.querySelector(".description");
    const normalized = desc.innerText.replaceAll(/\/\s+/g, "/").replaceAll("(dot)", ".");
    return removeDuplicates(preprocessMatches(Array.from(normalized.matchAll(BODY_LINK_REGEX)).map((e) => e[1])).filter((e) => e), extraLinks);
  }
  __name(getLinksFromDescription, "getLinksFromDescription");
  function removeDuplicates(links, extraLinks) {
    const labels = new Set(extraLinks.map((e) => e.label));
    const urls = /* @__PURE__ */ new Set();
    return links.filter((e) => {
      const url = e.url.toString();
      if (urls.has(url) || labels.has(e.label)) return false;
      urls.add(url);
      return true;
    });
  }
  __name(removeDuplicates, "removeDuplicates");
  function notifyUserUpdated(userId) {
    unsafeWindow.ppixiv.userCache.callUserModifiedCallbacks(userId);
  }
  __name(notifyUserUpdated, "notifyUserUpdated");

  // src/avalibility.ts
  function fastHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
    }
    return hash;
  }
  __name(fastHash, "fastHash");
  var cachedRequests = {};
  function cacheRequest(url) {
    return __async(this, null, function* () {
      try {
        const data = yield getCreatorData3(url);
        cachedRequests[url] = {
          lastUpdate: data.lastUpdate
        };
      } catch (error) {
        console.error(error);
        cachedRequests[url] = {
          error: `${error}`
        };
      }
    });
  }
  __name(cacheRequest, "cacheRequest");
  function clampString(s, max) {
    let end = s.length;
    let postfix = "";
    if (s.length > max) {
      end = max - 3;
      postfix = "...";
    }
    return s.slice(0, Math.max(0, end)) + postfix;
  }
  __name(clampString, "clampString");
  var pending = /* @__PURE__ */ new Set();
  function checkAvalibility(links, userId) {
    const hash = fastHash(JSON.stringify(links));
    if (!pending.has(hash)) {
      pending.add(hash);
      Promise.all(links.filter((e) => cachedRequests[e.url.toString()] === void 0).map((e) => cacheRequest(e.url.toString()))).then((e) => {
        pending.delete(hash);
        if (e.length > 0) {
          notifyUserUpdated(userId);
        }
      }).catch(console.error);
    }
    for (const l of links) {
      const request = cachedRequests[l.url.toString()];
      if (request === void 0) {
        l.disabled = true;
      } else if (request.error) {
        l.label += ` (${clampString(request.error, 15)})`;
        l.disabled = true;
      } else {
        l.label += ` (${request.lastUpdate})`;
      }
    }
    return links;
  }
  __name(checkAvalibility, "checkAvalibility");

  // src/links/memo.ts
  function memoize(fn) {
    const cache = /* @__PURE__ */ new Map();
    let mutex = false;
    return function(onHit, userId, ...args) {
      if (mutex) return;
      mutex = true;
      const key = args[0];
      if (cache.has(key)) {
        mutex = false;
        return onHit(cache.get(key));
      }
      fn.apply(this, args).then((e) => {
        cache.set(key, e);
        notifyUserUpdated(userId);
        mutex = false;
      });
    };
  }
  __name(memoize, "memoize");
  var memoizedRegexRequest = memoize((url, regex, _default = "undefined") => __async(void 0, null, function* () {
    return GM.xmlHttpRequest({
      method: "GET",
      timeout: 5e3,
      url
    }).then((r) => {
      var _a, _b;
      return (_b = (_a = r.responseText.match(regex)) == null ? void 0 : _a[1]) != null ? _b : _default;
    }).catch(console.error);
  }));

  // src/links/fanbox.ts
  var fanboxId = memoize((creatorId) => __async(void 0, null, function* () {
    return GM.xmlHttpRequest({
      url: `https://api.fanbox.cc/creator.get?creatorId=${creatorId}`,
      headers: {
        Origin: "https://fanbox.cc"
      }
    }).then((r) => JSON.parse(r.responseText).body.user.userId).catch(console.error);
  }));
  function makeFanboxUrls(extraLinks, id) {
    makeUrls(extraLinks, "fanbox", id);
  }
  __name(makeFanboxUrls, "makeFanboxUrls");
  function fanbox(link, extraLinks, userId) {
    var _a;
    const url = new URL(link.url);
    if (url.host.includes("pixiv.net")) {
      makeFanboxUrls(extraLinks, (_a = url.pathname.split("/").pop()) != null ? _a : "0");
    } else {
      let creatorId = url.host.split(".").shift();
      if (creatorId && (creatorId === "fanbox" || creatorId === "www")) {
        creatorId = url.pathname.replace(/^[/@]*/, "");
        if (creatorId.length === 0) return;
      }
      fanboxId((id) => makeUrls(extraLinks, "fanbox", id), userId, creatorId);
    }
  }
  __name(fanbox, "fanbox");

  // src/links/fantia.ts
  function fantia(link, extraLinks) {
    const id = link.url.toString().split("/").pop();
    makeUrls(extraLinks, "fantia", id);
  }
  __name(fantia, "fantia");

  // src/links/gumroad.ts
  var GUMROAD_ID_REGEX = /"external_id":"(\d+)"/;
  function gumroad(link, extraLinks, userId) {
    memoizedRegexRequest((id) => {
      if (!id) {
        link.disabled = true;
        return;
      }
      makeUrls(extraLinks, "gumroad", id);
    }, userId, link.url.toString(), GUMROAD_ID_REGEX);
  }
  __name(gumroad, "gumroad");

  // src/links/patreon.ts
  function normalizePatreonLink(link) {
    if (typeof link.url === "string") link.url = new URL(normalizeUrl(link.url));
    link.url.protocol = "https";
    if (!link.url.host.startsWith("www.")) link.url.host = `www.${link.url.host}`;
  }
  __name(normalizePatreonLink, "normalizePatreonLink");
  var PATREON_ID_REGEX = new RegExp('"creator":{"data":{"id":"(\\d+)"', "s");
  function patreon(link, extraLinks, userId) {
    normalizePatreonLink(link);
    const url = link.url.toString();
    memoizedRegexRequest((id) => {
      if (!id) {
        link.disabled = true;
        return;
      }
      makeUrls(extraLinks, "patreon", id);
    }, userId, url, PATREON_ID_REGEX);
  }
  __name(patreon, "patreon");

  // src/links/twitter.ts
  var URL_REGEX = /URL=(.+?)"/;
  function twitter(link, newLinks, userId) {
    return __async(this, null, function* () {
      memoizedRegexRequest((url) => {
        if (!url) return;
        genLinks(preprocessMatches([
          url
        ]).filter((e) => e), userId).forEach((e) => newLinks.push(e));
      }, userId, link.url.toString(), URL_REGEX);
    });
  }
  __name(twitter, "twitter");

  // src/links/index.ts
  function genLinks(extraLinks, userId) {
    const newLinks = [];
    for (const link of extraLinks) {
      switch (link.label) {
        case "Fanbox":
          fanbox(link, newLinks, userId);
          break;
        case "patreon.com":
          patreon(link, newLinks, userId);
          break;
        case "gumroad.com":
          gumroad(link, newLinks, userId);
          break;
        case "fantia.jp":
          fantia(link, newLinks);
          break;
        case "t.co":
          twitter(link, newLinks, userId);
          break;
        default:
      }
    }
    return newLinks;
  }
  __name(genLinks, "genLinks");

  // src/index.ts
  var addUserLinks = /* @__PURE__ */ __name(({ extraLinks, userInfo }) => {
    const toBeChecked = genLinks([
      ...extraLinks,
      ...getLinksFromDescription(extraLinks)
    ], userInfo.userId);
    const reachableLinks = checkAvalibility(toBeChecked, userInfo.userId);
    extraLinks.push(...reachableLinks);
  }, "addUserLinks");
  unsafeWindow.vviewHooks = {
    addUserLinks
  };
})();