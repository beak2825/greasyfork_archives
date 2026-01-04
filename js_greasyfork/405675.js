// ==UserScript==
// @name         [kesai]steam创意工坊wallpaper下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       kesai
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405675/%5Bkesai%5Dsteam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8Awallpaper%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/405675/%5Bkesai%5Dsteam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8Awallpaper%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.noConflict();
    var btn = jQuery('<div class="workshopItemControlCtn" style="margin-top:5px;"><div class="vertical_divider_container"><img class="vertical_divider" src="https://steamcommunity-a.akamaihd.net/public/images/trans.gif"></div><span class="general_btn share tooltip"><span>下载</span></span></div>');
    //var btn = jQuery('<div class="workshopItemControlCtn"><div class="vertical_divider_container"><img class="vertical_divider" src="https://steamcommunity-a.akamaihd.net/public/images/trans.gif"></div><span class="general_btn share tooltip" onclick="alert()" id="DownLoadBtn" class="general_btn share tooltip" data-tooltip-text="下载"><span>下载</span></span></div>');
    jQuery('#ItemControls').children(':eq(3)').after(btn)
    btn.click(function() {
        if (/\?id=(\d+)\&/.test(window.location.href)) {
            window.open(`http://steamworkshop.download/download/view/${RegExp.$1}`)
        }

    });
})();