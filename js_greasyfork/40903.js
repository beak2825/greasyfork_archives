// ==UserScript==
// @name         usunięcie href.li z kara
// @description  jebac zalgo jebana kurwa i psow zalgownika
// @namespace    karachan.org
// @version      1.0
// @match *://*.karachan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40903/usuni%C4%99cie%20hrefli%20z%20kara.user.js
// @updateURL https://update.greasyfork.org/scripts/40903/usuni%C4%99cie%20hrefli%20z%20kara.meta.js
// ==/UserScript==

for (var i = 0; i < document.links.length; i++) {
  linkx = document.links[i];
  switch(0) {
    case linkx.href.indexOf("https://href.li/?") : linkx.href = decodeURIComponent(unescape(linkx.href.substring(linkx.href.indexOf("") + 17)));break;
  }
}