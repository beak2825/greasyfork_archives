// ==UserScript==
// @name        lor-colornicks
// @include     https://www.linux.org.ru/*/*/*
// @include     https://www.linux.org.ru/search.*
// @version     1.4
// @grant       none
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @namespace https://greasyfork.org/users/134966
// @description colorize nicks @ LOR
// @downloadURL https://update.greasyfork.org/scripts/30836/lor-colornicks.user.js
// @updateURL https://update.greasyfork.org/scripts/30836/lor-colornicks.meta.js
// ==/UserScript==

const USE_BORDER = true;
const THIN_BORDERS = false;
const STARS_SAME_AS_NICK = false;
const MIN = 127;  // Minimum value of color component (R, G and B)

String.prototype.toColor = function() {
  hash = this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  c = Math.abs(hash).toString(16);
  r = parseInt(c.substring(0,2), 16);
  g = parseInt(c.substring(2,4), 16);
  b = parseInt(c.substring(4,6), 16);
  if (g < MIN && r < MIN && b < MIN) {
    g += MIN;
    r += MIN;
    b += MIN;
  }
  if (isNaN(r)) r = 128;
  if (isNaN(g)) g = 128;
  if (isNaN(b)) b = 128;
  if (r < 16) r += 16;
  if (g < 16) g += 16;
  if (b < 16) b += 16;
  
  return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

$(".sign").each(function(i, elem) {
  var e = $(elem);
  var nick = e.children("a:first").text();
  var color1 = nick.toColor();
  var color2 = nick.substring(1).toColor();
  var div = e.closest("article");
  if (USE_BORDER) {
   div.css('border-color', color2);
   div.css('border-style', "solid");
  }
  if (THIN_BORDERS) {
   div.css('border-width', 1);
  }
  e.children("a").css('color', color1);
  
  if (STARS_SAME_AS_NICK) {
   e.children(".stars").css('color', color1);
  } else {
   e.children(".stars").css('color', color2);
  }
});