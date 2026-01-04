// ==UserScript==
// @name        あにまんフォント
// @namespace   animanfont
// @description あにまんのフォントを変える
// @description:ja あにまんのフォントを変える
// @match        https://bbs.animanch.com/board/*/
// @match        https://www.dictionnaire-japonais.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animanch.com
// @version     1.3
// @author      aporiz
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/469372/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469372/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

GM_addStyle ( `
p {
font-weight: normal !important;
font-size:13px !important;
color: black !important;
}
.romaji {
visibility: hidden;
}

` );