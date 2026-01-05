// ==UserScript==
// @name         Easy Goal Easy 膠
// @namespace    Easy Goal Easy 膠
// @version      0.1
// @description  BETA
// @author       ISCO
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @match        http://forum14.hkgolden.com/topics.aspx?type=BW
// @match        http://forum14.hkgolden.com/ProfilePage.aspx?userid=384093
// @downloadURL https://update.greasyfork.org/scripts/13002/Easy%20Goal%20Easy%20%E8%86%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/13002/Easy%20Goal%20Easy%20%E8%86%A0.meta.js
// ==/UserScript==

http://forum14.hkgolden.com/topics.aspx?type=BW

$("div.Topic_FunctionPanel").append("<iframe src='http://forum14.hkgolden.com/ProfilePage.aspx?userid=384093' width='0' height='0' border='0'></iframe>");
$("input.ctl00_ContentPlaceHolder1_GiftKauTextBox").val("洗左機又要寫多次派膠器,麻鬼煩");
SendKau();