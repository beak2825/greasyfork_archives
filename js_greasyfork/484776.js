// ==UserScript==
// @name        Good o'l Lemmy
// @description Makes sure you're using Good o'l Lemmy. (C) YourName 2023. License WTFPLV2
// @version     1.0
// @match       *://*.lemmy.world/*
// @match       *://*.lemmy.ml/*
// @match       *://*.lemmy.dbzer0.com/*
// @match       *://*.sh.itjust.works/*
// @match       *://*.hexbear.net/*
// @match       *://*.lemmy.one/*
// @match       *://*.lemmy.ninja/*
// @match       *://*.programming.dev/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/1247638
// @downloadURL https://update.greasyfork.org/scripts/484776/Good%20o%27l%20Lemmy.user.js
// @updateURL https://update.greasyfork.org/scripts/484776/Good%20o%27l%20Lemmy.meta.js
// ==/UserScript==

const excludedPaths = [
  "/pictrs/",
  "/communities",
  "/signup",
  "/instances",
  "/modlog",
];

const domainMap = {
  "lemmy.world": "o.opnxng.com/lemmy.world",
  "lemmy.ml": "o.opnxng.com/lemmy.ml",
  "lemmy.dbzer0.com": "o.opnxng.com/lemmy.dbzer0.com",
  "sh.itjust.works": "o.opnxng.com/sh.itjust.works",
  "hexbear.net": "o.opnxng.com/hexbear.net",
  "lemmy.one": "o.opnxng.com/lemmy.one",
  "lemmy.ninja": "o.opnxng.com/lemmy.ninja",
  "programming.dev": "o.opnxng.com/programming.dev",
};

const currentDomain = window.location.host.replace(/^www\./, '');
const currentPath = window.location.pathname;

const isExcludedPath = excludedPaths.some((path) => currentPath.startsWith(path));

if (isExcludedPath) {
  // If the current path is one of the excluded paths, do not perform any redirection
} else if (domainMap.hasOwnProperty(currentDomain)) {
  const redirectTo = "https://" + domainMap[currentDomain] + currentPath + window.location.search;
  window.location.replace(redirectTo);
}