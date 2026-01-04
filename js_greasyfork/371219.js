// ==UserScript==
// @name                ExHentai thumbnail list title hover prompt
// @name:zh-CN          ExHentai缩略图列表标题悬浮提示
// @name:zh-TW          ExHentai縮略圖列表標題懸浮提示
// @namespace           moe.moekai.exhentai-tooltip
// @version             0.6
// @description         Add a hover hint to the ExHentai thumbnail list title to display the full title
// @description:zh-CN   给ExHentai缩略图列表标题添加悬浮提示来显示完整标题
// @description:zh-TW   給ExHentai縮略圖列表標題添加懸浮提示來顯示完整標題
// @author       YIU
// @icon         https://exhentai.org/favicon.ico
// @match        *://exhentai.org/
// @match        *://exhentai.org/?*
// @match        *://e-hentai.org/
// @match        *://e-hentai.org/?*
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @require      https://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371219/ExHentai%20thumbnail%20list%20title%20hover%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/371219/ExHentai%20thumbnail%20list%20title%20hover%20prompt.meta.js
// ==/UserScript==

(function() {

	var headlabel = `<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css">
<style>
.ui-tooltip,.arrow:after{background:#001a;border:1px solid #446}
.ui-tooltip{padding:8px 10px;color:white;font-size:11pt;box-shadow:0 0 7px #446;max-width:250px;z-index:9}
</style>`;

	$('head').append(headlabel);

	$('.gl3t').tooltip({
		position:{
			using:function(position){
				position.top += 25;
				position.left += 20;
				$(this).css(position);
				$("<div>").addClass("arrow").appendTo(this);
			}
		},
		track:true
	});

})();