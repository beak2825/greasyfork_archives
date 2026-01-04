// ==UserScript==
// @name TapTap  评论区标识楼主
// @namespace    https://github.com/mioagy
// @version      1.0.0
// @description  TapTap看帖时，在评论区显示楼主信息标识（高亮+解决子评论不显示）。
// @author       mioagy
// @match        *://www.taptap.com/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381287/TapTap%20%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A0%87%E8%AF%86%E6%A5%BC%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/381287/TapTap%20%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A0%87%E8%AF%86%E6%A5%BC%E4%B8%BB.meta.js
// ==/UserScript==

//获取楼主用户id
var LZid = $('.first-header-topic>.taptap-user').attr('data-user-id'),
	postDom = $('.show-main-posts .taptap-user[data-user-id=' + LZid + ']');

//原生显示不完整
$('.user-identify').hide()

//评论区JQuery Dom操作
for (var i=0; i < postDom.length; i++) {
	$(postDom[i]).append('<span class="showLZ" style="font-size:14px;vertical-align: middle;color: #12A7B4; border-style: solid; border-color: #12A7B4; border-width: 1px; padding-top: 2px; padding-bottom: 2px; padding-left: 4px; padding-right: 4px; border-radius: 4px;">楼主</span>')
}