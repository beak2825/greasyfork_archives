// ==UserScript==
// @name        YouTube: Hide Channel Logo Annotation
// @description Hides the channel logo annotation in videos
// @author      Challenger
// @namespace   https://greasyfork.org/users/11442
// @version     2
// @match       http://www.youtube.com/watch*
// @match       https://www.youtube.com/watch*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10431/YouTube%3A%20Hide%20Channel%20Logo%20Annotation.user.js
// @updateURL https://update.greasyfork.org/scripts/10431/YouTube%3A%20Hide%20Channel%20Logo%20Annotation.meta.js
// ==/UserScript==
GM_addStyle(".branding-img-container {display: none;}");