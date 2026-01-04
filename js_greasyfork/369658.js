// ==UserScript==
// @name        pixivイラストページ改善
// @description pixivイラストページのタグに作者マーカーと百科事典アイコン、ユーザー名の列に作品タグを復活させます
// @namespace   Aime
// @match       https://www.pixiv.net/*
// @version     1.2.7
// @grant       none
// @run-at      document-end
// @noframes
// @note        2018/06/22 1.0.1 作者アイコンを大サイズに差し替え
// @note        2018/07/18 1.0.2 pixiv側のclass変更に対応
// @note        2018/07/26 1.0.3 アイコン差し替えを修正
// @note        2018/09/23 1.1.0 新プロフィールページのサムネイルをトリミングなしに差し替え。作品タグをapiから取得
// @note        2018/10/03 1.1.1 サムネイル差し替え修正
// @note        2018/12/28 1.1.2 アイコン差し替え修正
// @note        2019/01/16 1.1.3 アイコン差し替え修正等
// @note        2019/01/16 1.1.4 タグクラウドの広告ブロックフィルタ誤爆対策
// @note        2019/02/20 1.1.5 article→main
// @note        2019/04/23 1.2.0 いろいろ修正
// @note        2019/04/23 1.2.2 アイコン修正
// @note        2019/09/15 1.2.3
// @note        2019/09/24 1.2.4 member_illust.php?mode=medium&illust_id= → artworks/
// @note        2019/09/24 1.2.5 custom_thumb差し替え
// @note        2020/01/08 1.2.6 member.php?id= → users/ 等
// @note        2020/07/07 1.2.7 ページ遷移検出簡素化、ダークテーマ対応等
// @downloadURL https://update.greasyfork.org/scripts/369658/pixiv%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/369658/pixiv%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==
// jshint esversion:6
(function() {
"use strict";
const pixivService = {
	PixpediaIcon			: 1,		// 百科事典アイコンを付けるか？ (0:付けない, 1:付ける, 2:記事の有無でアイコンを変える)
	UseTagCloud				: true,		// 作品タグを表示するか？
	UseLargeIcon			: true,		// 作者アイコンを大きくする
	NonTrimThumbnail		: true,		// サムネイルをトリミングなしにする

	tagCloudDisplayCount	: 30,		// 作品タグの表示数(目安)
	tagCloudSortByName		: true,		// 作品タグのソート順 (true:名前順, false:多い順)

	_illustTagCache			: {},
	_existsPixpedia			: {},
	_currentAuthorId		: -1,
	_tagCloud				: null,


	run() {
		const root = document.getElementById("root");
		if (!root) return;

		const style = $C("style");
		style.textContent = this._style;
		document.querySelector("head").appendChild(style);

		root.addEventListener("click", this, true);

		this.delayTagMarking();

		delayExec(() => {
			return !!window.__ankpixiv_pushstate_override;
		}, 200, 5).then(() => {
			console.log("use AnkPixiv 3.0.13+ history message");
			window.addEventListener("message", event => {
				if (event.data.type === "AnkPixiv.onPushState" || event.data.type === "AnkPiviv.onReplaceState") {
					this.delayTagMarking();
				}
			});
			window.addEventListener("popstate", event => this.delayTagMarking());
		}).catch(() => {
			new HistoryChangeEmitter(type => this.delayTagMarking());
		});


		this._themeObserver = null;

		const options = {
			childList		: true,
			subtree			: true,
			attributes		: true,
			attributeFilter	: [ /*"href",*/ "src" ]
		};

		const ob = new MutationObserver(records => {
			let thumbs = [], iconChange = false;

			const parseImg = target => {
				if (target.nodeName === "IMG") {
					if (this.NonTrimThumbnail && (target.src.includes("_square1200.jpg") || target.src.includes("_custom1200.jpg"))) {
						thumbs.push(target);
					} else if (target.getAttribute("width") == 40 && (target.src.includes("/user-profile/") || target.src.includes("no_profile")) && target.closest("ASIDE")) {
						iconChange = true;
					}
				}
			};

			records.forEach(record => {
				switch (record.type) {
				case "attributes": {
					const target = record.target;
					switch (record.attributeName) {
/*					case "href":
						if (target.href.includes("/users/") && target.querySelector(':scope > [role="img"]') && target.closest("ASIDE")) {
							iconChange = true;
						}
						break;*/
					case "src":
						parseImg(target);
						break;
					}
					break; }

				default:
					record.addedNodes.forEach(node => parseImg(node));
					break;
				}
			});

			if (!this._themeObserver) this.installThemeObserver();
			if (thumbs.length || iconChange) {
				ob.disconnect();
				if (thumbs.length) this.replaceThumbnail(thumbs);
				if (iconChange) this.onAuthorChange();
				ob.observe(root, options);
			}
		});
		ob.observe(root, options);
	},

	handleEvent(event) {
		switch (event.type) {
			case "mouseover":
				event.stopPropagation();
				break;
			case "click":
				if (event.target.classList.contains("gm-profile-work-list-tag-filter-click")) {
					this.openTagPage(event);
				}
				break;
			default:
				console.log(event);
				break;
		}
	},

	openTagPage(event) {
		const url = location.href;
		for (let p of [
			{ re: /users\/(\d+)\/novels|novel\/member\.php\?id=(\d+)/,	url: "https://www.pixiv.net/novel/member_tag_all.php?id=" },
			{ re: /users\/(\d+)\/|member_illust\.php\?id=(\d+)/,	url: "https://www.pixiv.net/member_tag_all.php?id=" },
		]) {
			const match = p.re.exec(url);
			if (match) {
				event.stopPropagation();
				event.preventDefault();
				location.href = p.url + match[1];
				return;
			}
		}
	},

	installThemeObserver() {
		const theme = document.getElementById("gtm-var-theme-kind");
		if (theme) {
			this._themeObserver = new MutationObserver(records => this.checkTheme());
			this._themeObserver.observe(theme, { characterData: true, subtree: true });
			this.checkTheme();
		}
	},

	checkTheme() {
		const theme = document.getElementById("gtm-var-theme-kind");
		if (theme) {
			const html = document.documentElement;
			if (theme.textContent === "dark") {
				html.setAttribute("dark-theme", true);
			} else {
				html.removeAttribute("dark-theme");
			}
		}
	},

	getIllustId() {
		const m = /(?:\/artworks\/|illust_id=)(\d+)/.exec(location.href);
		return m? parseInt(m[1], 10): null;
	},
	getAuthorId() {
		const a = document.querySelector("main + aside h2 a");
		if (!a) return null;
		const m = /(?:\/users\/|\/member\.php\?id=)(\d+)/.exec(a.href);
		return m? parseInt(m[1], 10): null;
	},

	async delayTagMarking() {
		const url = location.href;
		setTimeout(() => {
			if (url === location.href) this.tagMarking();
		}, 1000);
	},
	async tagMarking() {
		const illustId = this.getIllustId();
		if (!illustId) return;

		const displayedTags = await delayExec(() => {
			const nodes =document.body.querySelectorAll("figcaption footer > ul a.gtm-new-work-tag-event-click");
			return nodes.length > 0? nodes: false;
		});

//		const displayedTags = document.body.querySelectorAll("figcaption footer > ul a.gtm-new-work-tag-event-click");
		if (displayedTags.length === 0) return;

		if (!(illustId in this._illustTagCache)) {
			try {
				this._illustTagCache[illustId] = await fetchJSON("https://www.pixiv.net/ajax/tags/illust/" + illustId);
			} catch (e) {
				console.error(e);
			}
		}

		let tagData = this._illustTagCache[illustId];
		if (!tagData) tagData = { authorId: 0, tags: [] };
		const authorId = tagData.authorId;

		for (let node of displayedTags) {
			const cls = node.parentElement.classList;
			const tag = node.textContent.trim();
			const find = tagData.tags.find(t => t.tag == tag);
			if (find && find.userId == authorId) {
				cls.add("author-tag-marker");
			} else {
				cls.remove("author-tag-marker");
			}

			this.appendPixpediaIcon(node);
		}
	},

	async appendPixpediaIcon(node) {
		if (!this.PixpediaIcon || node.hasAttribute("pixpedia")) return;

		node.setAttribute("pixpedia", true);
		node.addEventListener("mouseover", this, true);
		const eTag = encodeURIComponent(node.textContent.trim());
		let cls = "pixpedia-icon";

		if (this.PixpediaIcon === 2) {
			try {
				if (!(eTag in this._existsPixpedia)) {
					this._existsPixpedia[eTag] = !!await fetchJSON("https://www.pixiv.net/ajax/tag/info?tag=" + eTag);
				}
				if (!this._existsPixpedia[eTag]) cls += " pixpedia-icon-no-item";
			} catch (e) {
				console.error(e);
			}
		}

		$C("a", {
			class	: cls,
			href	: "https://dic.pixiv.net/a/" + eTag
		}, node.parentElement);
	},

	onAuthorChange() {
		if (this.UseLargeIcon) this.largeAuthorIcon();
		if (this.UseTagCloud) this.appendTagCloud();
	},

	async appendTagCloud() {
		const aside = document.querySelector("main + aside");
		if (!aside) return;

		const authorId = this.getAuthorId();
		if (!authorId) return;

		const tagAllUrl = "https://www.pixiv.net/member_tag_all.php?id=" + authorId;

		if (this._currentAuthorId !== authorId) {
			this._currentAuthorId = authorId;
			try {
				let tags = await fetchJSON("https://www.pixiv.net/ajax/user/" + authorId + "/illustmanga/tags");
				tags.sort(this.compareTagByCount);	// 多い順にソート

				const dispCnt = this.tagCloudDisplayCount;
				if (tags.length > dispCnt) {
					// とりあえず目安位置以下の値を破棄
					const lastCnt = tags[dispCnt - 1].cnt;
					tags = tags.filter(v => v.cnt >= lastCnt);
					const tags2 = tags.filter(v => v.cnt > lastCnt);
					// 目安位置と同数とそれより多いのがどちらが目安位置に近いか
					if (dispCnt - tags2.length < tags.length - dispCnt && tags2.length > 5) {
						tags = tags2;
					}
				}

				if (tags.length) {
					let lv = 1,
						cur = tags[0].cnt;
					tags.forEach(tag => {
						// レベル付け
						if (lv < 6 && cur !== tag.cnt) {
							cur = tag.cnt;
							lv++;
						}

						// <li class="level1"><a href="/member_illust.php?id=${authorId}&amp;tag=${tag.tag}">${tag.tag}<span class="cnt">(${tag.cnt})</span></a></li>
						tag.dom = $C("li", { class: "level" + lv, "data-cnt": tag.cnt, "data-tag": tag.tag });
						const a = $C("a", { href: "/member_illust.php?id=" + authorId + "&tag=" + encodeURIComponent(tag.tag) }, tag.dom);
						a.textContent = tag.tag;
						const span = $C("span", { class: "cnt" }, a);
						span.textContent = "(" + tag.cnt + ")";
					});
				}

				if (this.tagCloudSortByName) {
					tags.sort(this.compareTagByName);
				}

				const tagCloud = $C("ul", { class: "tagCloud" });
				tags.forEach(tag => tagCloud.appendChild(tag.dom));
				this._tagCloud = tagCloud;

			} catch (e) {
				console.error(e);
				this._tagCloud = null;
			}
		}

		let container = document.getElementById("author-tags");
		if (container) {
			container.parentElement.removeChild(container);
		}
		if (this._tagCloud) {
			container = $C("nav", {
				id:		"author-tags",
				class:	"sc-",
			});

			const header = $C("div", { class: "tags-header" }, container);
			header.innerHTML = `<h2><a href="${tagAllUrl}">作品タグ</a></h2>`;

			const sortBtn = $C("button", { class: "sort-button" }, header);
			sortBtn.textContent = "▼";
			sortBtn.addEventListener("click", event => {
				const tags = document.querySelector("#author-tags .tagCloud");
				if (tags) {
					const byName = this.tagCloudSortByName = !this.tagCloudSortByName;
					Array.from(tags.querySelectorAll("li"))
					.map(v => { return { dom: v, cnt: v.dataset.cnt, tag: v.dataset.tag }; })
					.sort(byName? this.compareTagByName: this.compareTagByCount)
					.forEach(v => tags.appendChild(v.dom));
				}
			});

			container.appendChild(this._tagCloud);

			/* 前後の作品の次に挿入 */
			let next = aside.querySelector("main + aside > section > nav");
			if (next) {
				next = next.parentElement;
				if (next) next = next.nextSibling;
			}
			aside.insertBefore(container, next);
		}
	},
	compareTagByCount(a, b) {
		const r = b.cnt - a.cnt;
		return r? r: pixivService.compareTagByName(a, b);
	},
	compareTagByName(a, b) {
		return a.tag.localeCompare(b.tag, {}, { numeric: true });
	},

	largeAuthorIcon() {
		const icon = document.querySelector('main + aside > section > h2 [role="img"] > img');
		if (icon) {
			const img = icon.src.replace("_50.", "_170.").replace("_s.", ".");
			if (icon.src !== img) {
				icon.src = img;
			}
			const p = icon.parentElement.closest("A");
			if (p) {
				p.parentElement.classList.add("icon170");
			}
		}
	},

	replaceThumbnail(elems) {
		elems.forEach(elem => {
			let img = elem.src;
			let img_r = img.replace(/(?:250x250_80_a2|360x360_70)\/(?:img-master|custom-thumb)(.+)(?:_square1200|_custom1200)/, "240x240/img-master$1_master1200");
			if (img_r.includes("_master1200.jpg") /* /240x240.+_master1200/.test(img_r) */) {
				elem.style.setProperty("object-fit", "contain");
				if (img !== img_r) {
					elem.src = img_r;
				}
			}
		});
	},


	_style: `
/* 百科事典 */
.pixpedia-icon {
	display: inline-block;
	margin-left: 2px;
	width: 15px;
	height: 14px;
	vertical-align: -2px;
	text-decoration: none;
	background: url(https://s.pximg.net/www/images/inline/pixpedia.png) no-repeat;
}
.pixpedia-icon-no-item {
	background: url(https://s.pximg.net/www/images/inline/pixpedia-no-item.png) no-repeat;
}
.pixpedia-icon::before {
	display: none;
}

/* 作者タグ */
.author-tag-marker::before {
	content: "＊" !important;
	color: #E66;
}
/* "#"を消す */
figcaption footer > ul > li a.gtm-new-work-tag-event-click::before {
	display: none !important;
}

/* tag cloud */
#author-tags {
	padding: 8px;
	margin-bottom: 8px;
	background-color: #FFF;
	border-radius: 8px;
}
#author-tags .tags-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}
#author-tags h2 {
	color: #333;
	font-size: 14px;
	margin: 0;
}
#author-tags h2 a {
	color: inherit;
	text-decoration: none;
}
#author-tags .sort-button {
	padding: 0;
	font-size: 14px;
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
}
.tagCloud {
	font-size: 12px;
	line-height: 1.6;
	padding: 0;
	margin: 0;
	word-break: break-all;
}
.tagCloud li {
	display: inline;
	font-size: 12px;
	padding: 0px 2px;
	margin: 0px;
}
.tagCloud li a {
	color: inherit;
	text-decoration: none;
}
.tagCloud li.level1 {
	font-size: 20px;
	font-weight: bold;
}
.tagCloud li.level1 a {
	color: #3E5B71;
}
.tagCloud li.level2 {
	font-size: 18px;
	font-weight: bold;
}
.tagCloud li.level2 a {
	color: #3E5B71;
}
.tagCloud li.level3 {
	font-size: 17px;
	font-weight: bold;
}
.tagCloud li.level3 a {
	color: #587C97;
}
.tagCloud li.level4 {
	font-size: 16px;
	font-weight: bold;
}
.tagCloud li.level4 a {
	color: #587C97;
}
.tagCloud li.level5 {
	font-size: 14px;
	font-weight: bold;
}
.tagCloud li.level5 a {
	color: #587C97;
}
.tagCloud li.level6 a {
	color: #5E9ECE;
}
.tagCloud li a:hover {
	background-color: #3E5B71;
	color: #FFF;
}
.tagCloud li .cnt {
	font-size: 11px;
	font-weight: normal;
	color: #999999;
}
[dark-theme] #author-tags { background-color: #333; }
[dark-theme] #author-tags h2 { color: #DDD; }
[dark-theme] #author-tags .level1 > a { color: Lightpink; }
[dark-theme] #author-tags .level2 > a { color: Coral; }
[dark-theme] #author-tags .level3 > a { color: Gold; }
[dark-theme] #author-tags .level4 > a { color: DarkTurquoise; }
[dark-theme] #author-tags .level5 > a { color: Lightskyblue; }
[dark-theme] #author-tags .level6 > a { color: Silver; }

/* 作者アイコンを大きく */
main + aside section {
	margin-top: 0;
}
.icon170 {
	display: block !important;
	text-align: center !important;
	margin-left: auto !important;
	margin-right: auto !important;
}
.icon170 [role="img"] {
	width: 170px !important;
	height: 170px !important;
	margin: 0 auto 4px !important;
	border-radius: 4px !important;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
}
.icon170 [role="img"] > img {
	width: 170px;
	height: 170px;
	object-position: center !important;
}
`
};

function fetchSameOrigin(url) {
	return fetch(url, { mode: "same-origin", credentials: "same-origin" });
}

async function fetchJSON(url) {
	const response = await fetchSameOrigin(url);
	const data = await response.json();
	if (data.error) throw new Error(url + " : " + data.message);
	return data.body;
}

function $C(tag, attrs, parent, before) {
	const e = document.createElement(tag);
	if (attrs) Object.entries(attrs).forEach(([key, value]) => e.setAttribute(key, value));
	if (parent) parent.insertBefore(e, before);
	return e;
}

async function delayExec(func, delay = 500, count = 10) {
	const ret = func();
	if (ret) return ret;
	return new Promise((resolve, reject) => {
		const t = setInterval(() => {
			const ret = func();
			if (ret) {
				clearInterval(t);
				resolve(ret);
			}
			if (--count <= 0) {
				clearInterval(t);
				reject(new Error("delayExec: retry over"));
			}
		}, delay);
	});
}

class HistoryChangeEmitter {
	constructor(callback) {
		this._callback = callback;
		this._pushState = window.history.pushState;
		this._replaceState = window.history.replaceState;
		window.history.pushState = this.pushState.bind(this);
		window.history.replaceState = this.replaceState.bind(this);
		window.addEventListener("popstate", this.popState.bind(this));
	}
	pushState(...args) {
		this._pushState.apply(window.history, args);
		this._callback("pushState", args);
	}
	replaceState(...args) {
		this._replaceState.apply(window.history, args);
		this._callback("replaceState", args);
	}
	popState(event) {
		this._callback("popState", [ event.state ]);
	}
}

pixivService.run();
})();
