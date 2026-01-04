// ==UserScript==
// @name        NHK NEWS WEB EASY Hide Furigana Show on Hover Only
// @namespace   Violentmonkey Scripts
// @include     https://www3.nhk.or.jp/news/easy/
// @match       https://*.nhk.or.jp/news/easy*
// @grant       none
// @version     1.0
// @author      -
// @license     WTFPL
// @description There's no toggle I don't care just turn the script off if you don't like it. You should get yomitan configured anyways this is mainly to hide it.
// @downloadURL https://update.greasyfork.org/scripts/495075/NHK%20NEWS%20WEB%20EASY%20Hide%20Furigana%20Show%20on%20Hover%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/495075/NHK%20NEWS%20WEB%20EASY%20Hide%20Furigana%20Show%20on%20Hover%20Only.meta.js
// ==/UserScript==

var furigana = document.createElement("style");
furigana.setAttribute("id", "furigana");
furigana.innerHTML = "                     \n \
                                           \n \
rt {                                       \n \
  visibility: hidden;                      \n \
}                                          \n \
                                           \n \
ruby:hover > rt {                          \n \
  visibility: visible;                     \n \
}";
document.head.appendChild(furigana);