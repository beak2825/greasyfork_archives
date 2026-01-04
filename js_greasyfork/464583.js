// ==UserScript==
// @name         JustMoeComments
// @namespace    https://github.com/gui-ying233/JustMoeComments
// @version      2.16.2
// @description  萌娘百科看Lih的镜像站的评论，同时集成了作品讨论的评论
// @author       鬼影233
// @license      MIT
// @match        zh.moegirl.org.cn/*
// @match        mzh.moegirl.org.cn/*
// @match        mobile.moegirl.org.cn/*
// @match        moegirl.icu/*
// @match        cube.moegirl.icu/*
// @match        zh.moegirl.tw/*
// @match        zh.moegirl.tw/*
// @match        mzh.moegirl.tw/*
// @match        mobile.moegirl.tw/*
// @icon         https://moegirl.uk/images/a/a2/%E7%B2%89%E8%89%B2%E5%A4%A7%E7%8C%9B%E5%AD%97.png
// @supportURL   https://github.com/gui-ying233/JustMoeComments/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464583/JustMoeComments.user.js
// @updateURL https://update.greasyfork.org/scripts/464583/JustMoeComments.meta.js
// ==/UserScript==

(async () => {
	"use strict";
	if (new URLSearchParams(window.location.search).get("safemode")) return;
	await new Promise(resolve => {
		const intervId = setInterval(
			() => window?.mw?.Api && (clearInterval(intervId), resolve()),
			50
		);
	});
	window.wgULS ??= (hans, hant, cn, tw, hk, sg, zh, mo, my) =>
		({
			zh: zh || hans || hant || cn || tw || hk || sg || mo || my,
			"zh-hans": hans || cn || sg || my,
			"zh-hant": hant || tw || hk || mo,
			"zh-cn": cn || hans || sg || my,
			"zh-sg": sg || hans || cn || my,
			"zh-tw": tw || hant || hk || mo,
			"zh-hk": hk || hant || mo || tw,
			"zh-mo": mo || hant || hk || tw,
		}[mw.config.get("wgUserLanguage")] ||
		zh ||
		hans ||
		hant ||
		cn ||
		tw ||
		hk ||
		sg ||
		mo ||
		my);
	if (
		mw.config.get("wgAction") !== "view" ||
		![0, 2, 4, 12, 274].includes(mw.config.get("wgNamespaceNumber"))
	)
		return;
	const api = new mw.Api();
	const generatePost = ({ username, text, timestamp, like }) => {
		let _timestamp;
		if (typeof timestamp === "number") {
			const diff = Date.now() - timestamp * 1000;
			if (diff > 0 && diff < 86400000) {
				_timestamp = moment(timestamp * 1000)
					.locale(mw.config.get("wgUserLanguage"))
					.fromNow();
			} else {
				_timestamp = moment(timestamp * 1000)
					.locale(mw.config.get("wgUserLanguage"))
					.format("LL, HH:mm:ss");
			}
		} else {
			_timestamp = timestamp;
		}
		const postDiv = document.createElement("div");
		postDiv.className = "comment-thread";
		postDiv.innerHTML = `<div class="comment-post"><div class="comment-avatar"><a href="//moegirl.uk/U:${username}"><img src="//moegirl.uk/extensions/Avatar/avatar.php?user=${username}" decofing="async" loading="lazy" fetchpriority="low"></a></div><div class="comment-body"><div class="comment-user"><a href="//moegirl.uk/U:${username}">${username}</a></div><div class="comment-text">${text}</div><div class="comment-footer"><span class="comment-time">${_timestamp}</span>${
			like ? `<span class="comment-like">赞 ${like}</span>` : ""
		}</div></div></div>`;
		postDiv.querySelector(".comment-avatar > a > img").onerror =
			function () {
				if (new URL(this.src).host === "moegirl.uk")
					this.src = `//commons.moegirl.org.cn/extensions/Avatar/avatar.php?user=${username}`;
			};
		[...postDiv.querySelectorAll("img[src^='/images/']")].forEach(i => {
			i.src = `//img.moegirl.org.cn/common/${new URL(
				i.src
			).pathname.slice(8)}`;
			i.srcset = i.srcset.replaceAll(
				"/images/",
				"//img.moegirl.org.cn/common/"
			);
		});
		[
			...postDiv.querySelectorAll(
				'img[src*="thumb"][src$=".svg.png"], img[src*="thumb"][data-lazy-src$=".svg.png"], img[src*="thumb"][src$=".gif"], img[data-lazy-src*="thumb"][data-lazy-src$=".gif"]'
			),
		].forEach(i => {
			try {
				const _i = i.cloneNode();
				if (
					new mw.Uri(_i.src || _i.dataset.lazySrc).host ===
					"img.moegirl.org.cn"
				) {
					_i.src = _i.src
						.replace("/thumb/", "/")
						.replace(/\.svg\/[^/]+\.svg\.png$/, ".svg")
						.replace(/\.gif\/[^/]+\.gif$/, ".gif");
					_i.removeAttribute("srcset");
					_i.removeAttribute("data-lazy-src");
					_i.removeAttribute("data-lazy-srcset");
					_i.removeAttribute("data-lazy-state");
					_i.classList.remove("lazyload");
					_i.onload = function () {
						i.replaceWith(_i);
					};
				}
			} catch {}
		});
		[
			...postDiv.querySelectorAll(
				"a.extiw[title^='moe:'], a.extiw[title^='zhmoe:']"
			),
		].forEach(a => {
			a.classList.remove("extiw");
			api.get({
				action: "query",
				format: "json",
				titles: decodeURI(a.pathname.slice(1)),
				utf8: 1,
				formatversion: 2,
			}).done(b => {
				if (b.query.pages[0].missing) {
					a.href = `/index.php?title=${a.pathname.slice(
						1
					)}&action=edit&redlink=1`;
					a.title += wgULS(" (页面不存在)", "（頁面不存在）");
					a.classList += "new";
				} else if (
					b.query.pages[0].pageid === mw.config.get("wgArticleId")
				) {
					a.href = "";
					a.title = "";
					a.classList += "mw-selflink selflink";
				} else {
					a.href = a.pathname;
					a.title = a.title.replace(/moe:|zhmoe:/, "");
				}
			});
		});
		[...postDiv.getElementsByTagName("script")].forEach(s => {
			const _s = document.createElement("script");
			_s.innerHTML = s.innerHTML;
			[...s.attributes].forEach(a => {
				_s.setAttribute(a.name, a.value);
			});
			s.parentNode.replaceChild(_s, s);
		});
		return postDiv;
	};
	mw.loader.using(["moment"]).done(() => {
		const commentCSS = document.createElement("style");
		commentCSS.innerHTML =
			"#flowthread{clear:both;padding:1.5em}body.skin-moeskin #flowthread{background-color:var(--theme-background-color)}.comment-container-top:not(:empty){border:1px #ccc solid;border-radius:5px}body.skin-vector .comment-container-top{background-color:rgb(191 234 181 / 20%)}body.skin-moeskin .comment-container-top{background-color:var(--theme-card-background-color)}.comment-container-top>div:first-child{height:24px;line-height:24px;text-indent:1em;font-size:small;border-radius:5px 5px 0 0;font-weight:bold}body.skin-vector .comment-container-top>div:first-child{background-color:rgb(18 152 34 / 47%);color:#fff}body.skin-moeskin .comment-container-top>div:first-child{background-color:var(--theme-accent-color);color:var(--theme-accent-link-color)}.comment-thread{border-top:1px solid rgba(0,0,0,0.13)}.comment-thread .comment-thread{margin-left:40px}.comment-post{padding:10px}.comment-avatar{float:left}.comment-avatar img{width:50px;height:50px}.comment-body{padding-left:60px}.comment-thread>div:not(:first-of-type) .comment-avatar img{width:30px;height:30px}.comment-thread>div:not(:first-of-type) .comment-body{padding-left:40px}.comment-user,.comment-user a{color:#777;font-size:13px;margin-right:8px}.post-content .comment-text{position:static}.comment-text{font-size:13px;line-height:1.5em;margin:.5em 0;word-wrap:break-word;position:relative;overflow:hidden;min-height:1em}.comment-footer{font-size:12px;margin-right:8px;color:#999}.comment-like{margin-left:5px}";
		document.head.appendChild(commentCSS);
		const containerTop = document.createElement("div");
		containerTop.className = "comment-container-top";
		const container = document.createElement("div");
		container.className = "comment-container";
		const postContent = document.createElement("div");
		postContent.id = "flowthread";
		postContent.className = "post-content";
		postContent.appendChild(containerTop);
		postContent.appendChild(container);
		document
			.getElementById(
				mw.config.get("skin") === "vector"
					? "footer"
					: "moe-global-footer"
			)
			.appendChild(postContent);
		fetch(
			`https://moegirl.uk/api.php?${new URLSearchParams({
				action: "query",
				format: "json",
				prop: "pageprops",
				titles: mw.config.get("wgPageName"),
				utf8: 1,
				formatversion: 2,
				origin: "*",
			})}`
		)
			.then(a => a.json())
			.then(a => {
				if (a.query.pages[0].missing) return;
				(function getComment(offset) {
					fetch(
						`https://moegirl.uk/api.php?${new URLSearchParams({
							action: "flowthread",
							format: "json",
							type: "list",
							pageid: a.query.pages[0].pageid,
							limit: 15,
							offset,
							utf8: 1,
							formatversion: 2,
							origin: "*",
						})}`
					)
						.then(b => b.json())
						.then(b => {
							if (b.flowthread.popular.length) {
								document.body.getElementsByClassName(
									"comment-container-top"
								)[0].innerHTML = "<div>热门评论</div>";
								for (const post of b.flowthread.popular) {
									const _post = generatePost(post);
									_post.classList.add("comment-popular");
									document.body
										.getElementsByClassName(
											"comment-container-top"
										)[0]
										.appendChild(_post);
								}
							}
							for (const post of b.flowthread.posts) {
								const _post = generatePost(post);
								_post.id = `comment-${post.id}`;
								if (post.parentid) {
									document
										.getElementById(
											`comment-${post.parentid}`
										)
										.appendChild(_post);
								} else {
									document
										.getElementsByClassName(
											"comment-container"
										)[0]
										.appendChild(_post);
								}
							}
							if (b.flowthread.count > offset + 15) {
								new IntersectionObserver(
									(entries, observer) => {
										entries.forEach(entry => {
											if (entry.isIntersecting) {
												getComment(offset + 15);
												observer.unobserve(
													entry.target
												);
											}
										});
									}
								).observe(
									document.querySelector(
										".comment-container > div.comment-thread:last-of-type"
									)
								);
							}
						});
				})(0);
			})
			.catch(() => {
				fetch(
					"https://testingcf.jsdelivr.net/gh/gui-ying233/JustMoeComments/flowthread.json"
				)
					.then(a => a.json())
					.then(a => {
						let f = 0;
						for (const t of a) {
							if (
								t.title !==
								mw.config.get("wgPageName").replace("_", " ")
							)
								continue;
							a = t.posts;
							f = 1;
							break;
						}
						if (!f) return;
						for (const b of a) {
							if (+b.status) continue;
							const _post = generatePost({
								username: b.username,
								text: b.text,
								timestamp: "",
							});
							_post.id = `comment-${b.id}`;
							(b.parentid
								? document.getElementById(
										`comment-${b.parentid}`
								  )
								: document.getElementsByClassName(
										"comment-container"
								  )[0]
							).appendChild(_post);
						}
					});
			});
		if (mw.config.get("skin") !== "moeskin") return;
		setTimeout(() => {
			if (
				![
					(mw.config.get("wgPageName"),
					mw.config.get("wgPageName").replace(/^(.+)\(.+?\)$/, "$1"),
					document.getElementById("firstHeading").innerText),
				].includes(
					document.body.getElementsByClassName("artwork-title")[0]
						?.innerText
				)
			)
				return;
			document.body.getElementsByClassName("comment-item").forEach(c => {
				if (
					!c.getElementsByClassName("comment-title")[0].innerText &&
					!c.getElementsByClassName("comment-content")[0].innerText
				)
					return;
				const post = {
					like: +c
						.getElementsByClassName("n-button-group")[0]
						.innerText.split("\n")[0],
					username:
						c.getElementsByClassName("comment-author")[0].innerText,
					text:
						c.getElementsByClassName("comment-title")[0].innerText +
						(c.getElementsByClassName("comment-title")[0]
							.innerText &&
						c.getElementsByClassName("comment-content")[0].innerText
							? document.createElement("br").outerHTML
							: "") +
						c.getElementsByClassName("comment-content")[0]
							.innerText,
					timestamp:
						c.getElementsByClassName("comment-time")[0].innerText,
				};
				document
					.getElementsByClassName("comment-container")[0]
					.appendChild(generatePost(post));
			});
		}, 5000);
	});
})();
