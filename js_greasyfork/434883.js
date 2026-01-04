// ==UserScript==
// @name         Twitter Video Download
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  Adds a button to download video from a tweet
// @run-at       document-idle
// @author       naileD
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=x.com
// @grant        unsafeWindow
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/434883/Twitter%20Video%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/434883/Twitter%20Video%20Download.meta.js
// ==/UserScript==

'use strict';
setInterval(() => {
  var doc = unsafeWindow.document;
  if (unsafeWindow.wrappedJSObject) doc = unsafeWindow.wrappedJSObject.document; //Violentmonkey fix
  var main = doc.querySelector("main[role='main'] section[role='region']");
  if (!main) return;
  var react = Object.entries(main.parentElement).find(el => el[0].startsWith("__reactFiber"));
  if (!react || !react[1] || !react[1].memoizedProps.children.length) return;
  var tweet = [...react[1].memoizedProps.children].filter(el => (el || {})._owner).map(el => el._owner.memoizedProps.focalTweet).filter(el => el)[0];
  if (!tweet || !tweet.extended_entities || !tweet.extended_entities.media || ![...tweet.extended_entities.media].find(el => el.video_info)) return;
  var el = doc.querySelector(`a[href*="${tweet.id_str}"]`);
  if (!el) return;
  while (el.tagName !== "ARTICLE") { el = el.parentElement; }
  el = el.querySelector(`[id^="id"][role="group"]`);
  if (!el) return;
  if (el.lastElementChild.tagName === "A") return;
  var videoInfos = [...tweet.extended_entities.media].filter(el => el.video_info);
  var videos = videoInfos.map(el => [...el.video_info.variants].filter(v => v.content_type == "video/mp4").sort((a,b) => b.bitrate - a.bitrate)[0].url.replace(new RegExp("\\?tag=.*"), ""));
  var color = el.firstElementChild.style.color || "#536471";
  var svg = `<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs">
          <g><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>`;
  videos.forEach(video => el.insertAdjacentHTML("beforeend", `<a href="${video}" target="_blank" style="display: flex; place-self: center;  color: ${color};" title="Download Video">${svg}</a>`));
}, 1000);