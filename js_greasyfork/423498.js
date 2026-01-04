// ==UserScript==
// @name        Bandcamp extended album history
// @description Adds extended date history to Bandcamp release pages
// @author      cerebellum
// @version     0.2
// @match       https://*/*
// @grant       none
// @namespace https://greasyfork.org/users/748864
// @downloadURL https://update.greasyfork.org/scripts/423498/Bandcamp%20extended%20album%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/423498/Bandcamp%20extended%20album%20history.meta.js
// ==/UserScript==

if (document.querySelectorAll('meta[name="generator"][content="Bandcamp"]').length && document.head.innerHTML.includes("data-tralbum=")) {
  try {
    let ns = document.getElementById("name-section");
    let ext = document.createElement("h3");
    ext.style.font = "normal 14px/15px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    let info = document.head.innerHTML.split("data-tralbum=")[1].split("};")[0];
    ext.innerHTML = "<br>Released: " + info.split('&quot;release_date&quot;:&quot;')[1].split('&quot;')[0] + "<br>Published: " + info.split('&quot;publish_date&quot;:&quot;')[1].split('&quot;')[0] + "<br>Modified: " + info.split('&quot;mod_date&quot;:&quot;')[1].split('&quot;')[0] + "<br>Added: " + info.split('&quot;new_date&quot;:&quot;')[1].split('&quot;')[0];
    ns.appendChild(ext);
  } catch (e) {}
}