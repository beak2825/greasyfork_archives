// ==UserScript==
// @name        Unshortcut links on twitter.com
// @description replace musky t.co links with actual links to actual web sites
// @namespace   Itsnotlupus Industries
// @author      itsnotlupus
// @license     MIT
// @version     1.2.1
// @match       https://twitter.com/*
// @match       https://platform.twitter.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js?version=1247001
// @require     https://greasyfork.org/scripts/472943-itsnotlupus-middleman/code/middleman.js?version=1239323
// @downloadURL https://update.greasyfork.org/scripts/473435/Unshortcut%20links%20on%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/473435/Unshortcut%20links%20on%20twittercom.meta.js
// ==/UserScript==

/* jshint esversion:11 */

log("This script is deprecated. Please switch to https://greasyfork.org/en/scripts/474045-twitter-prime to continue getting updates.");

function unshortcut(obj) {
  const map = {};
  // 1st pass: gather associations between t.co and actual URLs
  (function populateURLMap(obj) {
    if (obj.url && obj.expanded_url) map[obj.url] = obj.expanded_url;
    Object.keys(obj).forEach(k => obj[k] && typeof obj[k] == "object" && populateURLMap(obj[k]));
  })(obj);
  // 2d pass: replace (almost) any string that contains a t.co string
  (function replaceURLs(obj) {
    Object.keys(obj).forEach(key => ({
      string() { if (map[obj[key]] && key!=='full_text') obj[key] = map[obj[key]]; },
      object() { if (obj[key] != null) replaceURLs(obj[key]); }
    }[typeof obj[key]]?.()));
  })(obj);
  return obj;
}

async function responseHandler(req, res, err) {
  return Response.json(unshortcut(await res.json()), {
    status: res.status,
    headers: res.headers
  });
}


middleMan.addHook("https://twitter.com/i/api/graphql/*", { responseHandler });
middleMan.addHook("https://cdn.syndication.twimg.com/tweet-result?*", { responseHandler });
