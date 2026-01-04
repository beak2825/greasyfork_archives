// ==UserScript==
// @name         挤爆了
// @namespace    mine
// @version      0.1.1
// @description  辅助购买大麦网演唱会门票
// @author       cx
// @match        https://buy.damai.cn/multi/flow?http_referer=*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391947/%E6%8C%A4%E7%88%86%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/391947/%E6%8C%A4%E7%88%86%E4%BA%86.meta.js
// ==/UserScript==


var original_str = window.location.href;
var dest_url = original_str.replace("https://buy.damai.cn/multi/flow?http_referer=", "");

window.location.href = dest_url;