// ==UserScript==
// @name   bilibili关注分组弹窗大小修改
// @match  https://space.bilibili.com/*
// @grant    GM_addStyle
// @run-at   document-End
// @description 修改分组的弹窗太tm小了!!!!!!!!!
// @version 0.1.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://update.greasyfork.org/scripts/476008/1255570/waitForKeyElements%20gist%20port.js
// @namespace https://greasyfork.org/users/302232
// @downloadURL https://update.greasyfork.org/scripts/527335/bilibili%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%BC%B9%E7%AA%97%E5%A4%A7%E5%B0%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/527335/bilibili%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%BC%B9%E7%AA%97%E5%A4%A7%E5%B0%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
/* globals jQuery， $， waitForKeyElements */


waitForKeyElements (
    "div.vui_dialog--root",
    longerFuckingList
);

function longerFuckingList (jNode) {
    GM_addStyle ( `
    .pc-follow-btn__modify-relationship .modify-relationship-list{
    height: 800px;
    }
` );
    GM_addStyle ( `
    .pc-follow-btn__modify-relationship .modify-relationship-list .tag-item{
    height: 35px;
    }
` );
}