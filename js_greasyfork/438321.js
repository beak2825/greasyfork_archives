// ==UserScript==
// @name         TypingTube 動画を下に表示
// @namespace    http://tampermonkey.net/
// @version      1
// @description  動画の位置を変更
// @author       You
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?domain=typing-tube.net
// @downloadURL https://update.greasyfork.org/scripts/438321/TypingTube%20%E5%8B%95%E7%94%BB%E3%82%92%E4%B8%8B%E3%81%AB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438321/TypingTube%20%E5%8B%95%E7%94%BB%E3%82%92%E4%B8%8B%E3%81%AB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

const YOUTUBE = document.getElementById("youtube-movie");
const TYPING_AREA = document.getElementById("controlbox");
YOUTUBE.parentNode.insertBefore(YOUTUBE,TYPING_AREA.nextSibling);