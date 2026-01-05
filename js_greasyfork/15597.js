// ==UserScript==
// @name        WaniKani 50 shades of kelth.
// @author      tomboy
// @namespace   japanese
// @description Wouldn't the forums be a better place if we had more of kelth?
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http*://*wanikani.com/chat/*
// @version     1.0
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/15597/WaniKani%2050%20shades%20of%20kelth.user.js
// @updateURL https://update.greasyfork.org/scripts/15597/WaniKani%2050%20shades%20of%20kelth.meta.js
// ==/UserScript==

/*
 * Helper Functions/Variables
 */
$ = unsafeWindow.$;

/*
 * Global Variables/Objects/Classes
 */

var WKUsername = "kelth";
var WKSect = "Sect 脱税 Circa 1948";
var WKAvatar = "https://cdn.wanikani.com/default-avatar-300x300-20121121.png";
var WKClass = "forum-post-author-says premium";

/*
 * Main
 */
window.addEventListener("load", function (e) {
  $(".username").html(WKUsername);
  $(".group").html(WKSect);
  $(".forum-post-author").find("img").attr("src", WKAvatar);
  $(".forum-post-author-says").attr("class", WKClass);
});
