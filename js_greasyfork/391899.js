// ==UserScript==
// @name        test reddit 2
// @description lol idunnno
// @namespace   test1
// @include     http*://www.reddit.com/r/Animemes/top/?sort=top&t=week*
// @include     http*://www.reddit.com/r/anime/search?sort=top&q=flair%3AClip&restrict_sr=on&t=week*
// @include     http*://www.reddit.com/r/anime/search?sort=top&q=flair%3AVideo&restrict_sr=on&t=week*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/391899/test%20reddit%202.user.js
// @updateURL https://update.greasyfork.org/scripts/391899/test%20reddit%202.meta.js
// ==/UserScript==

var href, links = document.querySelectorAll('a[href$="/download"]');

for (var i = 0, l = links.length; i < l; i++) {
    href = links[i].getAttribute("href").replace("https://v.redd.it/", "https://myvid.download/?url=https://v.redd.it/");
    links[i].setAttribute("href", href);
}