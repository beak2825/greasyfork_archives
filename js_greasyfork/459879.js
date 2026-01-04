// ==UserScript==
// @name        Pornbub下载时复制标题
// @namespace   Violentmonkey Scripts
// @match       https://cn.pornhub.com/view_video.php?*
// @grant       none
// @version     1.5.1
// @description:zh-CN 需配合脚本https://greasyfork.org/zh-CN/scripts/410032-Pornbub显示下载按钮
// @author      Show
// @license     MIT
// @description 2023/3/3
// @require        https://cdn.staticfile.org/clipboard.js/2.0.11/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/459879/Pornbub%E4%B8%8B%E8%BD%BD%E6%97%B6%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/459879/Pornbub%E4%B8%8B%E8%BD%BD%E6%97%B6%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==


var usern22 = $("div[data-type='user'] > span > a.bolded:first").text();

console.log(usern22);

var inlineFree1 = $('span.inlineFree').text();
inlineFree1 = inlineFree1.replace(/\//g,'');
$('span.inlineFree').html(inlineFree1);





console.log(inlineFree1);

    $('span.inlineFree').append(" - " + usern22 + " ");

var clipboard = new ClipboardJS('#downloadbox a', {
	target: function() {
		return document.querySelector('span.inlineFree');
	},
});

let nTitle2 = document.title;

let nTitle = nTitle2 + " " + ad_player_id;

document.title = nTitle;