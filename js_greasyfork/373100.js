// ==UserScript==
// @name         Clean URL Query
// @namespace    https://github.com/leesei/userscripts
// @version      1.3.5
// @description  Trim tracking query params from URL
// @author       leesei@gmail.com
// @license      MIT
// @supportURL   https://github.com/leesei/userscripts/issues
// @match        http*://detail.tmall.com/item.htm*
// @match        http*://*.tmall.com/shop/view_shop.htm
// @match        http*://item.taobao.com/item.htm*
// @match        http*://*.taobao.com/shop/view_shop.htm
// @match        http*://*.carousell.com/p/*
// @match        http*://*.computerworld.com/*
// @match        http*://*.networkworld.com/*
// @match        http*://*.infoworld.com/*
// @match        http*://*.itprotoday.com/*
// @match        http*://*.makeuseof.com/*
// @run-at       document-start
// @grant        GM_log
// @grant        GM_info
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373100/Clean%20URL%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/373100/Clean%20URL%20Query.meta.js
// ==/UserScript==

function log(level, text) {
  GM_log(level + ": " + text);
}

function query2json(querystring) {
  // remove any preceding url and split
  const queries = querystring
    .substring(querystring.indexOf("?") + 1)
    .split("&");
  const params = {},
    d = decodeURIComponent;
  // match and parse
  for (let i = queries.length - 1; i >= 0; i--) {
    if (queries[i].length === 0) continue;
    const pair = queries[i].split("=");
    params[d(pair[0])] = d(pair[1]);
  }

  return params;
}

function json2query(json) {
  const query = Object.keys(json)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
    .join("&");

  return query ? "?" + query : "";
}

// Convert sensible strings to Boolean, useful for parsing URL queries
function string2Boolean(string, defaultTrue) {
  // console.log('2bool:', String(string).toLowerCase());
  switch (String(string).toLowerCase()) {
    case "":
      return defaultTrue === undefined ? false : defaultTrue;
    case "true":
    case "1":
    case "yes":
    case "y":
      return true;
    case "false":
    case "0":
    case "no":
    case "n":
      return false;
    default:
      // you could throw an error, but 'undefined' seems a more logical value
      return undefined;
  }
}

(function () {
  "use strict";

  log(
    "info",
    ">>> [" + GM_info.script.namespace + "] " + GM_info.script.name + " <<<"
  );

  const queries = query2json(location.search);
  log("debug", "queries: " + JSON.stringify(queries));

  if (
    queries._skip_clean !== undefined &&
    string2Boolean(queries._skip_clean)
  ) {
    return;
  }

  // retain these query params
  const WHITE_LIST = [
    "id", // for taobao items
    "skuId", // for taobao items
    "page", // for article pages
  ];
  const copy = Object.assign({}, queries);
  WHITE_LIST.forEach((key) => delete copy[key]);
  log("debug", "copy: " + JSON.stringify(copy));

  // remove non-whitelisted queries
  if (Object.keys(copy).length) {
    const _q = {};
    WHITE_LIST.forEach((key) => {
      if (queries[key]) _q[key] = queries[key];
    });
    log("debug", "_q: " + JSON.stringify(_q));
    location.replace(location.pathname + json2query(_q));
  }
})();
