// ==UserScript==
// @name          Wikipedia 2 Wikiwand (Global)
// @version       1.11
// @run-at        document-start
// @description   A fork/expansion of the user script "Wikipedia 2 Wikiwand" <https://greasyfork.org/zh-TW/scripts/13400-wikipedia-2-wikiwand> to make the script applicable to most languages of Wikipedia (hopefully). Trying to do the similar thing to official browser addon/extentions of Wikiwand, an elegant and nicer frontend of Wikipedia.
// @include       http://*.wikipedia.org/wiki/*
// @include       https://*.wikipedia.org/wiki/*
// @exclude       http://*.wikipedia.org/wiki/*?oldformat=true
// @exclude       https://*.wikipedia.org/wiki/*?oldformat=true
// @author        GHSRobert Ciang
// @grant         drhouse
// @namespace https://greasyfork.org/users/64873
// @downloadURL https://update.greasyfork.org/scripts/23047/Wikipedia%202%20Wikiwand%20%28Global%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23047/Wikipedia%202%20Wikiwand%20%28Global%29.meta.js
// ==/UserScript==

var theurl = document.URL;
var res = theurl.replace(/([\w-]+).wikipedia.org\/wiki/gi, "www.wikiwand.com/$1");
var res = res.replace(/www.wikiwand.com\/zh(\/)/gi, "www.wikiwand.com/zh-tw$1");
window.location.href = (res);