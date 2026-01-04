// ==UserScript==
// @name        放牧的风 - 免费 SS/SSR/V2Ray 页面增加“所有链接”
// @description 提取放牧的风网站免费代理账号页面中的所有 SS/SSR/V2Ray 链接。
// @namespace   UnKnown
// @author      UnKnown
// @license     MIT
// @version     1.4
// @icon        
// @match       https://www.youneed.win/free-ss
// @match       https://www.youneed.win/free-ssr
// @match       https://www.youneed.win/free-v2ray
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/390864/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E%20-%20%E5%85%8D%E8%B4%B9%20SSSSRV2Ray%20%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%8A%A0%E2%80%9C%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/390864/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E%20-%20%E5%85%8D%E8%B4%B9%20SSSSRV2Ray%20%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%8A%A0%E2%80%9C%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E2%80%9D.meta.js
// ==/UserScript==

const base64 = (() => {
	if (unsafeWindow.CryptoJS && unsafeWindow.CryptoJS.enc) {
		const enc = unsafeWindow.CryptoJS.enc;
		return str => enc.Base64.stringify(enc.Utf8.parse(str));
	} else {
		// From https://en.wikibooks.org/wiki/Algorithm_Implementation/Miscellaneous/Base64#Javascript
		return s => {
			var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
			r = "", p = "", c = s.length % 3;
			if (c > 0) for (; c < 3; c++) { p += '='; s += "\0"; }
			for (c = 0; c < s.length; c += 3) {
				var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c + 1) << 8) + s.charCodeAt(c + 2);
				r += d[(n >>> 18) & 63] + d[(n >>> 12) & 63] + d[(n >>> 6) & 63] + d[n & 63];
			}
			return r.substring(0, r.length - p.length) + p;
		};
	}
})();

const getLinksFromTable = table => {

	const scopedSelectorAll = (parent, selector) => (
		Array.from(parent.querySelectorAll(":scope " + selector))
	);

	const getLinkFromAttribute = (selector, attrName) => (
		scopedSelectorAll(table, selector).map(a => a.getAttribute(attrName))
	);

	switch (location.pathname.slice(6)) {
		case "v2ray": return getLinkFromAttribute('a[data-raw^="vmess://"]', "data-raw");
		case "ssr": return getLinkFromAttribute('a[data^="ssr://"]', "data");
		case "ss": return scopedSelectorAll(table, "> tbody > tr").map(tr => {
			const _ = scopedSelectorAll(tr, "td").map(td => td.textContent);
			return 'ss://' + base64(`${_[4]}:${_[3]}@${_[1]}:${_[2]}`);
		});
		default: return "本脚本尚未支持此页面！";
	}

};

const css = `#AllLinks + div { max-width: 100%; min-height: 10em; max-height: 80vh; }
#AllLinks > button { width: 100%; height: 2em; font-size: large; transition: opacity .2s ease-in-out; }
#AllLinks > button:hover, #AllLinks > button:focus { opacity: .9; }
#AllLinks > button:active { opacity: .75; }
#AllLinks > textarea { min-height: 8em; margin: 10px 0; white-space: pre; font-family: monospace; }
#AllLinks > p { text-align: center; white-space: pre; font-weight: bold; }`;

const init = () => {

	const    style = document.createElement("style");  
	const   button = document.createElement("button");
	const textarea = document.createElement("textarea");
	const     info = document.createElement("p");

	style.textContent = css;
	button.textContent = "从表格中获取链接";
	textarea.readOnly = true;
	textarea.value = "先通过下方验证，再点击上方“从表格中获取链接”按钮，即可获取全部链接";

	const getLinks = table => {

		const links = getLinksFromTable(table);
		textarea.value = links.join("\n");
		info.textContent = "共获取到 " + links.length + " 条";

		button.removeEventListener("click", tryGetLinks);
		button.addEventListener("click", copy);
		button.textContent = "复制全部链接";

	}

	const tryGetLinks = () => {

		const table = document.querySelector(".context > div > table:only-child");

		if (table !== null) {
			getLinks(table);
		} else {
			alert("找不到表格元素，请先通过下方验证。");
		}

	};

	const copy = () => {

		if (navigator.clipboard) {
			navigator.clipboard.writeText(textarea.value);
		} else {
			textarea.select();
			document.execCommand("copy");
		}

		const copied = "\n已复制！";
		info.textContent += copied;
		setTimeout(() => info.textContent = info.textContent.replace(copied, ""), 3000);

	};

	button.addEventListener("click", tryGetLinks);

	const container = document.createElement("div");
	container.id = "AllLinks";
	container.getLinks = getLinks;
	container.append(style, button, textarea, info);

	return container;

};

const table = document.querySelector(".context > div > table:only-child");

if (table !== null) {

	const container = init();
	container.getLinks(table);
	table.parentElement.before(container);

} else {

	const passsterForm = document.querySelector(".context > .passster-form");

	if (passsterForm !== null) {

		// if (!document.cookie.includes("passster=captcha")) {
		// 	document.cookie = "passster=captcha; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax; Secure";
		// }

		const container = init();
		passsterForm.before(container);

	}

}
