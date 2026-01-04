// ==UserScript==
// @name        TikTok Video URL Extractor
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @version     1.21
// @license     GPLv2
// @author      Flop7534
// @description Logs video links from a TikTok profile to your browsers console.
// @downloadURL https://update.greasyfork.org/scripts/446695/TikTok%20Video%20URL%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/446695/TikTok%20Video%20URL%20Extractor.meta.js
// ==/UserScript==

// IMPORTANT: You may need to edit the class which gets selected in var "x"
// If needed, change it to the common class associated with each individual video element on the profile.

setTimeout(() => {
    var b = document.getElementsByClassName("css-1lmt8q1-SpanCopyright")
    var myButton = document.createElement("button")
    myButton.style = "background-color:red;display:block"
    myButton.innerHTML = "Log links"

  myButton.addEventListener("click", function () {
    var x = document.getElementsByClassName("tiktok-x6y88p-DivItemContainerV2");
    var i = 0;
    var y = x.length;
    var links = "";

    while (i < y) {
      var link = x[i].children[0].children[0].children[0].children[0].attributes.href.value;
      links += link + "\n";
      i++;
    }

    var url = new URL(window.location.href);
    var username = url.pathname.split("/")[1].replace("@", "");
    var currentDate = new Date().toISOString().split("T")[0];
    var fileName = username + "-" + currentDate + ".txt";

    var blob = new Blob([links], { type: "text/plain" });
    var fileUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(fileUrl);
  });

  b[0].appendChild(myButton);
}, 5000);