// ==UserScript==
// @name        lor-colornicks_2
// @name:ru     lor-colornicks_2
// @include     https://www.linux.org.ru/*/*/*
// @include     https://www.linux.org.ru/search.*
// @version     0.1
// @grant       none
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @namespace   https://greasyfork.org/ru/users/135534
// @description colorize nicks @ LOR - forked from https://greasyfork.org/scripts/30836
// @description:ru colorize nicks @ LOR - forked from https://greasyfork.org/scripts/30836
// @downloadURL https://update.greasyfork.org/scripts/30891/lor-colornicks_2.user.js
// @updateURL https://update.greasyfork.org/scripts/30891/lor-colornicks_2.meta.js
// ==/UserScript==

const THIN_BORDERS = true;
const MIN = 127;  // Minimum value of color component ®

String.prototype.toColor = function() {
    hash = this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
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
};

$(".sign").each(function(i, elem) {
    var e = $(elem);
    var nick = e.children("a:first").text();
    var color1 = nick.toColor();
    var div = e.closest("article");
    div.css('border-color', color1);
    div.css('border-style', "solid");
    if (THIN_BORDERS) {
        div.css('border-width', 1);
    }
});