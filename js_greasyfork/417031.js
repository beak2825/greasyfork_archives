// ==UserScript==
// @name         星巴克數位體驗自動完成
// @namespace    https://event.12cm.com.tw/starbucks/
// @version      0.3
// @description  自動完成沒意義的動作
// @author       ME
// @match        *://event.12cm.com.tw/starbucks/*
// @match        *://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/*
// @match        *://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/*/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/417031/%E6%98%9F%E5%B7%B4%E5%85%8B%E6%95%B8%E4%BD%8D%E9%AB%94%E9%A9%97%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/417031/%E6%98%9F%E5%B7%B4%E5%85%8B%E6%95%B8%E4%BD%8D%E9%AB%94%E9%A9%97%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
'use strict';
GM_config.init(
{
  'id': 'Startbucks', // The id used for this instance of GM_config
  'title': 'Script Settings',
  'fields': // Fields object
  {
    'debug': // This is the id of the field
    {
      'label': 'debug', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': true // Default value if user doesn't change it
    }
  }
});
GM_registerMenuCommand ("Config", openConfigPanel, "C");
function openConfigPanel () {
    GM_config.open();
}
var debug = GM_config.get('debug');
console.log("debug=" + debug);
//main page
if(window.location.href == "https://event.12cm.com.tw/starbucks/" || window.location.href == "https://event.12cm.com.tw/starbucks/#" || window.location.href == "https://event.12cm.com.tw/starbucks/#_=_") {
    if($('#tab-campaign > div > div > table > tbody > tr:nth-child(2) > td > div.campaign-list-item-action > a') != null) {
        window.location.replace($('#tab-campaign > div > div > table > tbody > tr:nth-child(2) > td > div.campaign-list-item-action > a').attr('href'));
    }
}
//event main page
if(window.location.href == "https://event.12cm.com.tw/starbucks/campaign/share_christmas_store/") {
    if($('#container > div.campaign-container > div > a') != null) {
        window.location.replace($('#container > div.campaign-container > div > a').attr('href'));
    }
}
if(window.location.href == "https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v2/") {
    if($('body > div.maincontainer > section > a') != null) {
        $('body > div.maincontainer > section > a').click();
    }
}
//jump to result
if(window.location.href == "https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v1/") {
    window.location.replace('https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v1/complete.html');
}
if(window.location.href == "https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v2/gift.html") {
    window.location.replace('https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v2/complete.html');
}
if(window.location.href == "https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v1/complete.html" || window.location.href == "https://event.12cm.com.tw/starbucks_external/brand/2020/share_christmas_store/v2/complete.html") {
    if($('#goCoupon') != null) {
        $('#goCoupon').click();
    }
}