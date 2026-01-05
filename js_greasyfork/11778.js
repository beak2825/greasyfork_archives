// ==UserScript==
// @name        Reversed 'title - artist' format on Last.fm's profile pages
// @namespace   last.fm
// @include     /last\.fm/
// @exclude    http://beta.last.fm/user/*/library
// @version     1.0
// @grant       none
// @description just like the title said
// @downloadURL https://update.greasyfork.org/scripts/11778/Reversed%20%27title%20-%20artist%27%20format%20on%20Lastfm%27s%20profile%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/11778/Reversed%20%27title%20-%20artist%27%20format%20on%20Lastfm%27s%20profile%20pages.meta.js
// ==/UserScript==

function swapElements(obj1, obj2) {
    // create marker element and insert it where obj1 is
    var temp = document.createElement("div");
    obj1.parentNode.insertBefore(temp, obj1);

    // move obj1 to right before obj2
    obj2.parentNode.insertBefore(obj1, obj2);

    // move obj2 to right before where obj1 used to be
    temp.parentNode.insertBefore(obj2, temp);

    // remove temporary marker node
    temp.parentNode.removeChild(temp);
}

var a = document.getElementsByClassName('chartlist-artists');
var b = document.getElementsByClassName('link-block-target');

var c = [];
var k = 10;

for (var i = 0; i < 10; i++) {
c[i] = b[i];
}

for (var i = 21; i < b.length; i++) {
c[k] = b[i];
k++;
}

for (var i = 0; i < a.length; i++) {
swapElements(a[i], c[i]);
}