// ==UserScript==
// @name        Anti-swear
// @namespace   This script automatically censors cursing by changing it to something else.
// @match       https://sploop.io/
// @grant       none
// @version     1.0
// @author      -
// @description 11/01/2023, 11:40:55
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/458049/Anti-swear.user.js
// @updateURL https://update.greasyfork.org/scripts/458049/Anti-swear.meta.js
// ==/UserScript==
const { fillText } = CanvasRenderingContext2D.prototype;
const cursing = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"],
  replace = ["cxxx", "wxxxx", "fxxx", "sxxx", "fxxxxx", "nxxxxx", "nxxxx", "dxxx", "vxxxxx", "mxxxx", "cxxx", "rxxx", "cxx", "sxx", "txxx", "pxxxx", "cxxx", "pxxxx", "jxxx", "pxxxx", "dxxxxx", "wxxxxx", "dxxx", "bxxxx", "dxxx", "fxx", "bxxxxxx"];
CanvasRenderingContext2D.prototype.fillText = function (word) {
  if (typeof word == "string") {
    var tmpString;
    for (var i = 0; i < cursing.length; ++i) {
      if (word.toLowerCase().indexOf(cursing[i]) > -1) {
        tmpString = replace[i];
        var re = new RegExp(cursing[i], "ig");
        word = word.replace(re, tmpString);
      }
    }
  }
  fillText.call(this, ...arguments);
};
