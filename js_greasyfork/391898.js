// ==UserScript==
// @name        test reddit vids change a link
// @description lol idunnno
// @namespace   test1
// @include     http*://www.reddit.com/r/Animemes/top/?sort=top&t=week
// @include     http*://www.reddit.com/r/anime/search?sort=top&q=flair%3AClip&restrict_sr=on&t=week
// @include     http*://www.reddit.com/r/anime/search?sort=top&q=flair%3AVideo&restrict_sr=on&t=week
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/391898/test%20reddit%20vids%20change%20a%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/391898/test%20reddit%20vids%20change%20a%20link.meta.js
// ==/UserScript==

var href, links = document.querySelectorAll('a[href$="/download"]');

for (var i = 0, l = links.length; i < l; i++) {
    href = links[i].getAttribute("href").replace("reddit.com/r/", "https://myvid.download/?url=reddit.com/r/").replace("/files/", "/").replace(/\/download$/, "");
    links[i].setAttribute("href", href);
}