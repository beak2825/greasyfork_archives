// ==UserScript==
// @name        Redirect fakeptt to Ptt
// @namespace   Violentmonkey Scripts
// @description Redirect some fakeptt pages which couldn't replace by regular expression to Ptt
// @match       https://ptthito.com/*
// @match       https://pttview.com/*
// @match       http://pttweb.com/*
// @match       https://pttweb.tw/*
// @match       http://pttread.com/*
// @match       http://hotptt.com/*
// @version     0.2.4
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/378617/Redirect%20fakeptt%20to%20Ptt.user.js
// @updateURL https://update.greasyfork.org/scripts/378617/Redirect%20fakeptt%20to%20Ptt.meta.js
// ==/UserScript==

"use strict"

let url = window.location.href;
let pattern = /https?:\/\/(?:(?:pttview|pttweb|ptthito|pttread)\.com|pttweb\.tw)\/([\w\-]+)\/m-(\d+)-a-([0-9a-z]{3}).*/i;
let match_group = url.match(pattern);

if (match_group !== null) {
  url = `https://www.ptt.cc/bbs/${match_group[1]}/M.${match_group[2]}.A.${match_group[3].toUpperCase()}.html`;
  window.location.replace(url);
}

document.addEventListener("DOMContentLoaded", function () {
  let pttUrl = '';
  let elements = document.querySelectorAll(".f2");

  for (let i = 0; i < elements.length; i++) {
    let pattern = /(https:\/\/www\.ptt\.cc\/bbs\/[\w\-]+\/M\.\d{10}\.A\.[0-9A-Z]{3}.html)/i;
    let match_group = elements[i].innerText.match(pattern);
    if (match_group) {
      pttUrl = match_group[0];
    }
  }
  if (pttUrl) {
    window.location.replace(pttUrl);
  }
})
