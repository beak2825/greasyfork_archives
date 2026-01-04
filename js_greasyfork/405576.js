// ==UserScript==
// @name         屏蔽必应广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cn.bing.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/405576/%E5%B1%8F%E8%94%BD%E5%BF%85%E5%BA%94%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405576/%E5%B1%8F%E8%94%BD%E5%BF%85%E5%BA%94%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

$("[class='sb_add sb_adTA']").parentsUntil("li.b_ad").parent().remove();
