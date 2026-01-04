// ==UserScript==
// @name        Select and copy lyrics from music.oricon.co.jp
// @namespace   StephenP
// @description Allows lyrics selection and copy on music.oricon.co.jp
// @version     1
// @grant       none
// @author      StephenP
// @match       https://music.oricon.co.jp/php/lyrics/LyricsDisp.php?*
// @downloadURL https://update.greasyfork.org/scripts/403754/Select%20and%20copy%20lyrics%20from%20musicoriconcojp.user.js
// @updateURL https://update.greasyfork.org/scripts/403754/Select%20and%20copy%20lyrics%20from%20musicoriconcojp.meta.js
// ==/UserScript==
var overlay=document.getElementsByClassName("lyric-contents")[0].children[0];
overlay.parentNode.removeChild(overlay);
var lyric=document.getElementsByClassName("lyric")[0];
lyric.removeAttribute("onmousemove");
lyric.removeAttribute("onmousedown");
lyric.removeAttribute("oncopy");
lyric.removeAttribute("oncontextmenu");
lyric.removeAttribute("onselectstart");
lyric.removeAttribute("style");