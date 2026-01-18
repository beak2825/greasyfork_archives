// ==UserScript==
// @name YouTube Polymer Disable
// @match *://www.youtube.com/*
// @exclude *://www.youtube.com/embed/*
// @grant none
// @run-at document-start
// ==/UserScript==
var url = window.location.href;
if (url.indexOf("disable_polymer") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "disable_polymer=1";
  window.location.href = url;
}