// ==UserScript==
// @name            Remove YouTube Share Identifier
// @name:vi         Xóa Định Danh Chia Sẻ YouTube
// @namespace       https://greasyfork.org/en/users/1240674-anhkhoakz
// @version         1.1.2
// @match           *://*.youtube.com/watch?v=*
// @license         GPLv3; https://www.gnu.org/licenses/gpl-3.0.html#license-text
// @icon            https://i.imgur.com/f1OgZDI.png
// @grant           none
// @description     Remove the "si" parameter from YouTube share links.
// @description:vi  Xóa tham số "SI" khỏi các liên kết chia sẻ YouTube.
// @author          anhkhoakz; https://www.anhkhoakz.dev/
// @downloadURL https://update.greasyfork.org/scripts/532043/Remove%20YouTube%20Share%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/532043/Remove%20YouTube%20Share%20Identifier.meta.js
// ==/UserScript==

(()=>{"use strict";const e={DEBOUNCE_DELAY:300,PARAMETER_TO_REMOVE:"si",SELECTORS:{URL_FIELD:"input#share-url",COPY_LINK_RENDERER:"yt-copy-link-renderer"}},n=(e,t)=>{let n;return function(...s){const o=()=>{clearTimeout(n),e(...s)};clearTimeout(n),n=setTimeout(o,t)}},s=e=>{const t=new URL(e);return new URLSearchParams(t.search)},t=t=>{const n=s(t);n.delete(e.PARAMETER_TO_REMOVE);const o=new URL(t);return o.search=n.toString(),o.toString()},o=s=>{if(!s||!(s instanceof HTMLInputElement))return;let o=s.value;const i=n(()=>{if(!s)return;if(s.value===o)return;const e=t(s.value);e!==s.value&&(s.value=e,o=e)},e.DEBOUNCE_DELAY),a=new MutationObserver(i);a.observe(s,{attributes:!0,characterData:!0,subtree:!0})},i=n=>{if(!n||!(n instanceof HTMLElement))return;if(n.tagName.toLowerCase()===e.SELECTORS.COPY_LINK_RENDERER.toLowerCase())return;const s=n.querySelector(e.SELECTORS.URL_FIELD);if(!s)return;s.value=t(s.value),o(s)},a=new MutationObserver(e=>{for(const n of e){const t=n.addedNodes[0];if(!t)continue;i(t)}});a.observe(document.documentElement,{childList:!0,subtree:!0})})();
