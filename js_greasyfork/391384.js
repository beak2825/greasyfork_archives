// ==UserScript==
// @name         OpenReview Helper
// @name:en      OpenReview Helper
// @name:zh-CN   OpenReview Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @description:zh-CN  try to take over the world!
// @author       Han Yang
// @match        https://openreview.net/group?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391384/OpenReview%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/391384/OpenReview%20Helper.meta.js
// ==/UserScript==

!function(){"use strict";function e(e){console.log(e);let o=e.getAttribute("data-id"),t=`notes?forum=${o}&details=replyCount`;console.log(t),fetch(t).then(async t=>{let n=(await t.json()).count-1;console.log(o,n,e),document.querySelector(`li[data-id='${o}']`).append(`reply count: ${n}`)})}function o(){let o=document.querySelector("#all-submissions").querySelectorAll("li.note");console.log(o);for(let t=0;t<o.length;++t)console.log(t),e(o[t])}document.getElementById("notes").onchange=function(){setTimeout(o,1e3)}}();
