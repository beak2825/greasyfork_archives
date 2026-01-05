// ==UserScript==
// @name        Tieba Keyword Filter
// @namespace   eight04.blogspot.com
// @description 依關鍵字摺疊樓層廣告
// @include     http://tieba.baidu.com/*
// @version     0.1.0
// @grant       GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/24624/Tieba%20Keyword%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24624/Tieba%20Keyword%20Filter.meta.js
// ==/UserScript==

var keywords;

GM_config.setup(
	{
		keywords: {
			label: "關鍵字（一行一個）",
			type: "textarea",
			default: "jiaoyimao.com/goods\n广告"
		}
	},
	function(){
		keywords = GM_config.get("keywords").split("\n");
	}
);

GM_addStyle(".tkf-hidden{height: 10px; overflow:hidden;} #j_p_postlist > div:not(.l_post):not(#j_p_postlist){display:none;} #thread_list > li:not(.thread_top_list_folder):not(.j_thread_list){display: none;}");

function toggle() {
	this.classList.toggle("tkf-hidden");
}

function hide() {
	var posts = document.querySelectorAll(".l_post");

	for (let post of posts) {
		for (let keyword of keywords) {
			if (post.textContent.includes(keyword)) {
				post.classList.add("tkf-hidden");
				post.addEventListener("click", toggle);
				break;
			}
		}
	}
}

hide();

new MutationObserver(hide).observe(
	document.querySelector("#j_p_postlist"),
	{
		childList: true
	}
);
