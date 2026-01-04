// ==UserScript==
// @name              steam 网页语言切换小工具 (edited by zelda)
// @name:en           steam Webpage language switch widget (edited by zelda)
// @name:ja           steam ウェブ言語スイッチ (edited by zelda)
// @namespace         jasaj.me (edited by zelda)
// @match             https://store.steampowered.com/*
// @match             https://steamcommunity.com/*
// @version           3
// @description       这个脚本用于添加一个小按钮来 只更改网页前端语言设置，不更改用户的语言设置。并且使所有的链接指向指定的语言。
// @description:en    This script is used to add a small button to change only the front-end language setting of the web page, not the language set by the user. and make all links point to the specified language.
// @description:ja    このスクリプトは、（ユーザーの言語設定を変更せずに）WebページのUI言語のみを変更するスイッチをページに追加。そして、すべてのリンクが指定した言語に移動するようにする。
// @author            Jasaj
// @downloadURL https://update.greasyfork.org/scripts/489814/steam%20%E7%BD%91%E9%A1%B5%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28edited%20by%20zelda%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489814/steam%20%E7%BD%91%E9%A1%B5%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28edited%20by%20zelda%29.meta.js
// ==/UserScript==



{
	const add_lang_change_btn = (l_txt, l_URL, l_iso) => {
		let theURL = new URL(window.location);
		theURL.searchParams.set("l", l_URL);
		let ele = document.createElement('div');
		ele.classList.add('menuitem');
		let elle = ele.appendChild(document.createElement('a'));
		elle.style.padding = "0 5px";
		elle.classList.add('store_header_btn_content');
		elle.appendChild(document.createTextNode(l_txt));
		if (((new URL(window.location)).searchParams.get("l") == l_URL) || (document.documentElement.lang == l_iso)) {
			ele.style["background-color"] = "rgb(255 255 255 / 10%)";
			ele.style.cursor = "not-allowed";
			elle.style.color = "rgb(255 255 255 / 50%)";
		} else {
			ele.classList.add('store_header_btn_gray');
			ele.style.cursor = "pointer";
            ele.style.padding="0px 5px";
			elle.onclick = () => { window.location = theURL.href; };
		}
		document.getElementById("global_actions").append(ele);
	};

	const change_all_url_lang = (l_URL) => {
		let nodes = document.querySelectorAll('a[href]');
		for (let node of nodes) {
			let theURL = new URL(node.href);
			let hostmap = [ "store.steampowered.com"];
			if (hostmap.includes(theURL.host)) {
				theURL.searchParams.set("l", l_URL);
				node.href = theURL.href;
			}
		}
	};



	const hide_es_language_warning = () => {
		let es_language_warning_s = document.getElementsByClassName("es_language_warning");
		if (es_language_warning_s.length > 0) { es_language_warning_s[0].style.display = "none"; }
	};

	// label displayed on button, language tag for URL parameter, iso style language tag for <html lang="xxx">
	let steam_lang_btn_map = [["繁", "tchinese", "zh-tw"],["簡", "schinese", "zh-cn"], ["日", "japanese", "ja"], ["英", "english", "en"]];

	steam_lang_btn_map.forEach(v => { add_lang_change_btn(v[0], v[1], v[2]); });




}
