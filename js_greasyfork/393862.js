// ==UserScript==
// @name        Mapping Assist
// @namespace   Violentmonkey Scripts
// @match       *://*.ocv-sg-cloud-01.com/*
// @match       *://*.ocv-sg-cloud-02.com/*
// @match       *://*.ocv-sg-cloud-03.com/*
// @grant       none
// @version     1.4
// @author      - Frank
// @description 12/17/2019, 12:27:17 PM
// @downloadURL https://update.greasyfork.org/scripts/393862/Mapping%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/393862/Mapping%20Assist.meta.js
// ==/UserScript==

var wrongBoolean;
var hostname = window.location.hostname;
var wrongServer = [
  "ocv-sg-cloud-01.com",
  "ocv-sg-cloud-02.com",
  "ocv-sg-cloud-03.com"
];

function appendCreatedHref(element, tld) {
  var href = element.href;
  var hrefSub = href.search(tld) + 3;
  var hrefFinal = href.substring(hrefSub, href.length);
  text.value = text.value + "\n" + hrefFinal;
}
if (hostname.includes("ocv-sg-cloud")) {
  wrongServer.forEach(element => {
    if (element == hostname) {
      wrongBoolean = true;
    }
  });
  if (wrongBoolean != true && window.location.pathname.includes('administrator') === false) {
    var links = document.getElementsByTagName("a");
    var arr = [].slice.call(links);
    const tld = window.location.origin.split(".").pop();
    arr.forEach(element => {
      element.addEventListener("click", function(event) {
        if (event.ctrlKey) {
        } else {
          event.preventDefault();
          appendCreatedHref(element, tld);
        }
      });
    });
    var text = document.createElement("textarea");
    text.style.cssText =
      "position:fixed; top:35%; left:0; width:250px; height:100px;";
    document.body.appendChild(text);
  }
}
