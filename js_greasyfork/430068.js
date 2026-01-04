// ==UserScript==
// @name         episodes dropdown for vidcloud9.com
// @description  dropdown adds a dropdown menu to navigate between episodes faster
// @match        https://vidcloud9.com/videos/*
// @version 0.0.1.20210801224626
// @namespace https://greasyfork.org/users/798407
// @downloadURL https://update.greasyfork.org/scripts/430068/episodes%20dropdown%20for%20vidcloud9com.user.js
// @updateURL https://update.greasyfork.org/scripts/430068/episodes%20dropdown%20for%20vidcloud9com.meta.js
// ==/UserScript==

let vidLeft = document.querySelector(".video-info-left");
let videoElem = document.querySelector(".watch_play");
let episodesUrls = new Array();
let episodesRaw = document.querySelector(".lists").querySelectorAll("a");
episodesRaw.forEach(function (e, i) {
    episodesUrls[i] = e.href;
  });
episodesUrls.reverse();
let currentEpisode = episodesUrls.indexOf(window.location.href);
let select = document.createElement("select");
function createOptions(url, i) {
  let option = document.createElement("option");
  option.value = url;
  option.text = "Episode " + (i + 1);
  if (i === currentEpisode) option.selected = "selected";
  return option;
};
episodesUrls.forEach(function (e, i) {
  select.add(createOptions(e, i), null);
});
let br = document.createElement("br");
vidLeft.insertBefore(br, videoElem);
vidLeft.insertBefore(select, videoElem);
select.addEventListener("change", function () {
  window.location.href = select.value;
});