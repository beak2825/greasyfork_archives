// ==UserScript==
// @name mikanime 蜜柑计划 优化
// @namespace userstyles.world/user/liweishu
// @version 1.0.0
// @description 解决概况介绍不换行问题，网格页方便选择链接文本。
// @author vveishu
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://mikanime\.tv/(|Home(|/MyBangumi|/Bangumi/.+|/Search\?.+)))$/
// @include /^(?:https://mikanime\.tv/(|Home(|/MyBangumi)))$/
// @include /^(?:https://mikanime\.tv/Home/(Classic|Episode/.+))$/
// @include /^(?:https://mikanime\.tv/Home/Bangumi/.+)$/
// @include /^(?:https://mikanime\.tv/Home/(Bangumi|Episode)/.+)$/
// @downloadURL https://update.greasyfork.org/scripts/518834/mikanime%20%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/518834/mikanime%20%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https://mikanime\\.tv/(|Home(|/MyBangumi|/Bangumi/.+|/Search\\?.+)))\$").test(location.href)) {
		css += `
			/*主页 订阅 节目PC&Phone 搜索PC -广告*/
			div[style^="margin-top: 10p"] {
				display: none;
			}
		`;
}
if (new RegExp("^(?:https://mikanime\\.tv/(|Home(|/MyBangumi)))\$").test(location.href)) {
		css += `
			/*主页 订阅*/
			/*方便选择链接文本*/
			.sk-bangumi,
			.central-container {
				.list-inline.an-ul .an-info {
					padding-left: 0;
					/*信息组加宽*/
					& > .an-info-group {
						width: auto;
						max-width: 146px;
						& > * {
							margin-left: 12px;
						}
						/*更新时间缩进*/
						& > .date-text {
							text-indent: 0.5em;
						}
						/*链接*/
						& > .an-text {
							white-space: normal!important;
							width: auto!important;
							/*border-right:1px dotted silver;*/
						}
					}
				}
			}
			/*Phone -广告*/
			div[style^="margin-top: 0p"] {
				display: none;
			}
		`;
}
if (new RegExp("^(?:https://mikanime\\.tv/Home/(Classic|Episode/.+))\$").test(location.href)) {
		css += `
			/*列表 节目 -广告*/
			div[style^="margin-top: -10px; m"] {
				display: none;
			}
		`;
}
if (new RegExp("^(?:https://mikanime\\.tv/Home/Bangumi/.+)\$").test(location.href)) {
		css += `
			/*节目- 概况介绍 换行兼容*/
			.header2-desc {
				white-space: pre-wrap;
			}
		`;
}
if (new RegExp("^(?:https://mikanime\\.tv/Home/(Bangumi|Episode)/.+)\$").test(location.href)) {
		css += `
			/*节目 集*/
			/*左栏边距*/
			#sk-container>.leftbar-container{
				margin-right: 3px;
				margin-left: 10px;
			}
			/*海报去边框*/
			.bangumi-poster {
				border: 0;
				margin: 0;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
