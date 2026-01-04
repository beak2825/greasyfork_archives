// ==UserScript==
// @name           Restore tcbscan disqus comments
// @description    Quick and dirty script to restore the disqus comment section on tcbscans.me chapter releases.
// @include        https://tcbscans.me/chapters/*
// @version        1
// @license        MIT
// @namespace https://greasyfork.org/users/1404752
// @downloadURL https://update.greasyfork.org/scripts/519406/Restore%20tcbscan%20disqus%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/519406/Restore%20tcbscan%20disqus%20comments.meta.js
// ==/UserScript==

var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
  if (scripts[i].src === "https://.disqus.com/embed.js") {
    console.log("Fixing bad disqus script link")
    var replacementScript = document.createElement("script");
        replacementScript.src = "//tcbscan.disqus.com/embed.js";
        scripts[i].parentNode.replaceChild(replacementScript, scripts[i]);
  }
}
