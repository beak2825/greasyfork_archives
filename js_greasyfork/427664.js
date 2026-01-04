// ==UserScript==
// @name        UpDown Mask - arca.live
// @namespace   Violentmonkey Scripts
// @match       https://arca.live/b/*
// @grant       none
// @version     1.0
// @author      nonong
// @description updown mask
// @downloadURL https://update.greasyfork.org/scripts/427664/UpDown%20Mask%20-%20arcalive.user.js
// @updateURL https://update.greasyfork.org/scripts/427664/UpDown%20Mask%20-%20arcalive.meta.js
// ==/UserScript==

var table = document.querySelectorAll(".col-rate");

var info = [
  document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-head > div.info-row > div.article-info > span:nth-child(2)"),
  document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-head > div.info-row > div.article-info > span:nth-child(5)"),
  document.querySelector("#ratingUp"),
  document.querySelector("#ratingUpIp"),
  document.querySelector("#ratingDown"),
  document.querySelector("#ratingDownIp")
];

function yay(arr) {
  for (var i=0; i<arr.length; i++){
    arr[i].innerHTML = "♬";
  }
}

function task() {
  yay(table);
  yay(info);
}

task();

var target = document.querySelector("#vote");

var config = {
  childList: true,
  attributes: false,
  characterData: false,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false
};

var observer = new MutationObserver(mutations => {
  observer.disconnect();
  task();
  observer.observe(target, config);
});

observer.observe(target, config);

