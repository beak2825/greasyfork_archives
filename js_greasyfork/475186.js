// ==UserScript==
// @name         灰机wiki查看版本历史
// @namespace    https://github.com/gui-ying233/huijiHistory
// @version      2.3.2
// @description  以另一种方式查看灰机wiki版本历史（绕过权限错误）。
// @author       鬼影233, Honoka55
// @match        *.huijiwiki.com/*
// @icon         https://av.huijiwiki.com/site_avatar_www_l.png
// @license      MIT
// @supportURL   https://github.com/gui-ying233/huijiHistory/issues
// @downloadURL https://update.greasyfork.org/scripts/475186/%E7%81%B0%E6%9C%BAwiki%E6%9F%A5%E7%9C%8B%E7%89%88%E6%9C%AC%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/475186/%E7%81%B0%E6%9C%BAwiki%E6%9F%A5%E7%9C%8B%E7%89%88%E6%9C%AC%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==

(function () {
	"use strict";
	(async () => {
		await new Promise(resolve => {
			const intervId = setInterval(() => {
				if (
					typeof mw !== "undefined" &&
					typeof mw.Api !== "undefined"
				) {
					clearInterval(intervId);
					resolve();
				}
			}, 50);
		});
		if (!document.body.getElementsByClassName("permissions-errors")[0])
			return;
		const parseDate = timestamp => {
			const date = new Date(timestamp);
			return `${date.getFullYear()}年${
				date.getMonth() + 1
			}月${date.getDate()}日 (${
				["日", "一", "二", "三", "四", "五", "六"][date.getDay()]
			}) ${date.getHours().toString().padStart(2, 0)}:${date
				.getMinutes()
				.toString()
				.padStart(2, 0)}`;
		};
		switch (mw.config.get("wgAction")) {
			case "history":
				const pageName = mw.config.get("wgPageName").replace("_", " ");
				if (document.getElementsByTagName("h1")[0])
					document.getElementsByTagName(
						"h1"
					)[0].innerHTML = `“${pageName}”的版本历史`;
				document.title = document.title.replace(
					"权限错误",
					`“${pageName}”的版本历史`
				);
				document.getElementById(
					"mw-content-text"
				).innerHTML = `<form action="${mw.util
					.getUrl("", { "": "" })
					.replace(
						/\?=$/,
						""
					)}" id="mw-history-compare"><div><input class="historysubmit mw-history-compareselectedversions-button" title="查看该页面两个选定的版本之间的差异。[ctrl-option-v]" accesskey="v" type="submit" value="对比选择的版本"></div><ul id="pagehistory"></ul></form>`;
				const api = new mw.Api();
				const revisions = [];
				const getHistory = async rvcontinue => {
					api.get({
						action: "query",
						format: "json",
						prop: "revisions",
						titles: pageName,
						utf8: 1,
						formatversion: 2,
						rvprop: "ids|user|parsedcomment|timestamp|size",
						rvlimit: "max",
						rvcontinue,
					}).done(async d => {
						revisions.push(...d.query.pages[0].revisions);
						if (d.continue?.rvcontinue)
							await getHistory(d.continue?.rvcontinue);
						else {
							revisions.forEach(
								({
									revid,
									parentid: oldid,
									user,
									parsedcomment: comment,
									timestamp,
									size,
								}) => {
									const li = document.createElement("li");
									li.dataset.mwRevid = revid;
									const newestRev =
										mw.config.get("wgCurRevisionId") ===
										revid;
									li.innerHTML = `<span class="mw-history-histlinks">（${
										newestRev
											? "当前"
											: `<a href="${mw.util.getUrl("", {
													diff: mw.config.get(
														"wgCurRevisionId"
													),
													oldid: revid,
											  })}">当前</a>`
									} | ${
										oldid
											? `<a href="${mw.util.getUrl("", {
													diff: revid,
													oldid,
											  })}">之前</a>`
											: "之前"
									}）</span><input type="radio" value="${revid}" name="oldid" id="mw-oldid-${revid}"><input type="radio" value="${revid}" ${
										newestRev ? "checked='checked'" : ""
									} name="diff" id="mw-diff-${revid}"><a href="${mw.util.getUrl(
										"",
										{
											oldid: revid,
										}
									)}" class="mw-changeslist-date" title="${pageName}">${parseDate(
										timestamp
									)}</a>\u200E <span class="history-user"><a href="${mw.util.getUrl(
										`User:${user}`
									)}" class="mw-userlink" title="User:${user}" data-username="${user}"><bdi>${user}</bdi></a><span class="mw-usertoollinks">（<a href="${mw.util.getUrl(
										`User talk:${user}`
									)}" class="mw-usertoollinks-talk user-link" title="User talk:${user}">讨论</a> | <a href="${mw.util.getUrl(
										`Special:Contributions/${user}`
									)}" class="mw-usertoollinks-contribs user-link" title="Special:Contributions/${user}">贡献</a>）</span></span>\u200E <span class="mw-changeslist-separator">. .</span> <span class="history-size">（${size}字节）</span>\u200E <span class="mw-changeslist-separator">. .</span>  <span class="comment">（${comment}）</span>`;
									document
										.getElementById("pagehistory")
										.appendChild(li);
								}
							);
							document.getElementById(
								"mw-history-compare"
							).innerHTML +=
								'<div><input class="historysubmit mw-history-compareselectedversions-button" title="查看该页面两个选定的版本之间的差异。[ctrl-option-v]" accesskey="v" type="submit" value="对比选择的版本"></div>';
						}
					});
				};
				await getHistory("|");
				break;
			case "view":
				const searchParams = new URLSearchParams(
					window.location.search
				);
				if (searchParams.get("oldid") || searchParams.get("diff")) {
					const api = new mw.Api();
					if (searchParams.get("diff")) {
						const pageName = mw.config
							.get("wgPageName")
							.replace("_", " ");
						if (document.getElementsByTagName("h1")[0])
							document.getElementsByTagName(
								"h1"
							)[0].innerHTML = `“${pageName}”的版本间的差异`;
						document.title = document.title.replace(
							"权限错误",
							`“${pageName}”的版本间的差异`
						);
						mw.util.addCSS(
							`.diff{border:0;border-spacing:4px;margin:0;width:100%;table-layout:fixed}.diff td{padding:.33em .5em}.diff td.diff-marker{padding:.25em}.diff col.diff-marker{width:2%}.diff .diff-content{width:48%}.diff td div{word-wrap:break-word}.diff-title{vertical-align:top}.diff-multi,.diff-notice,.diff-ntitle,.diff-otitle{text-align:center}.diff-lineno{font-weight:700}td.diff-marker{text-align:right;font-weight:700;font-size:1.25em;line-height:1.2}.diff-addedline,.diff-context,.diff-deletedline{font-size:88%;line-height:1.6;vertical-align:top;white-space:-moz-pre-wrap;white-space:pre-wrap;border-style:solid;border-width:1px 1px 1px 4px;border-radius:.33em}.diff-addedline{border-color:#a3d3ff}.diff-deletedline{border-color:#ffe49c}.diff-context{background:#f8f9fa;border-color:#eaecf0;color:#222}.diffchange{font-weight:700;text-decoration:none}.diff-addedline .diffchange,.diff-deletedline .diffchange{border-radius:.33em;padding:.25em 0}.diff-addedline .diffchange{background:#d8ecff}.diff-deletedline .diffchange{background:#feeec8}.diff,.diff-currentversion-title{direction:ltr;unicode-bidi:embed}.diff-contentalign-right td{direction:rtl;unicode-bidi:embed}.diff-contentalign-left td{direction:ltr;unicode-bidi:embed}.diff-lineno,.diff-multi,.diff-ntitle,.diff-otitle{direction:ltr!important;unicode-bidi:embed}.mw-diff-movedpara-left,.mw-diff-movedpara-left:active,.mw-diff-movedpara-left:visited,.mw-diff-movedpara-right,.mw-diff-movedpara-right:active,.mw-diff-movedpara-right:visited{display:block;color:transparent}.mw-diff-movedpara-left:hover,.mw-diff-movedpara-right:hover{text-decoration:none;color:transparent}.mw-diff-movedpara-left:after,.mw-diff-movedpara-right:after{display:block;color:#222;margin-top:-1.25em}.mw-diff-movedpara-left:after,.rtl .mw-diff-movedpara-right:after{content:"↪"}.mw-diff-movedpara-right:after,.rtl .mw-diff-movedpara-left:after{content:"↩"}@media print{td.diff-addedline .diffchange,td.diff-context,td.diff-deletedline .diffchange{background-color:transparent}td.diff-addedline .diffchange{text-decoration:underline}td.diff-deletedline .diffchange{text-decoration:line-through}}`
						);
						if (searchParams.get("oldid")) {
							await api
								.get({
									action: "compare",
									format: "json",
									fromrev: searchParams.get("oldid"),
									torev: searchParams.get("diff"),
									prop: "diff|ids|parsedcomment|user|timestamp",
									utf8: 1,
									formatversion: 2,
								})
								.done(async d => {
									d = d.compare;
									var next;
									await api
										.get({
											action: "compare",
											format: "json",
											fromrev: d.torevid,
											torelative: "next",
											prop: "ids",
											utf8: 1,
											formatversion: 2,
										})
										.done(d => {
											next = d.compare.torevid;
										});
									var prev;
									await api
										.get({
											action: "compare",
											format: "json",
											fromrev: d.fromrevid,
											torelative: "prev",
											prop: "ids",
											utf8: 1,
											formatversion: 2,
										})
										.done(d => {
											prev = d.compare.fromrevid;
										});
									document.getElementById(
										"mw-content-text"
									).innerHTML = `<table class="diff diff-contentalign-left" data-mw="interface">${
										d.body
											? '<colgroup><col class="diff-marker"><col class="diff-content"><col class="diff-marker"><col class="diff-content"></colgroup>'
											: ""
									}<tbody><tr class="diff-title" lang="zh"><td colspan="2" class="diff-otitle"><div id="mw-diff-otitle1" class="mw-revslider-older-diff-column"><strong><a href="${mw.util.getUrl(
										"",
										{
											oldid: d.fromrevid,
										}
									)}" title="">${parseDate(
										d.fromtimestamp
									)}的版本</a> <span class="mw-diff-edit">（<a href="${mw.util.getUrl(
										"",
										{
											action: "edit",
											oldid: d.fromrevid,
										}
									)}" title="${pageName}">编辑</a>）</span></strong></div><div id="mw-diff-otitle2"><a href="${mw.util.getUrl(
										`User:${d.fromuser}`
									)}" class="mw-userlink" title="User:${
										d.fromuser
									}" data-username="${d.fromuser}"><bdi>${
										d.fromuser
									}</bdi></a><span class="mw-usertoollinks">（<a href="${mw.util.getUrl(
										`User talk:${d.fromuser}`
									)}" class="mw-usertoollinks-talk" title="User talk:${
										d.fromuser
									}">讨论</a> | <a href="${mw.util.getUrl(
										`Special:Contributions/${d.fromuser}`
									)}" class="mw-usertoollinks-contribs" title="Special:Contributions/${
										d.fromuser
									}">贡献</a>）</span></div><div id="mw-diff-otitle3"><span class="comment">（${
										d.fromparsedcomment
									}）</span></div><div id="mw-diff-otitle5"></div><div id="mw-diff-otitle4">${
										prev
											? `<a href="${mw.util.getUrl("", {
													diff: d.fromrevid,
													oldid: prev,
											  })}" title="" id="differences-prevlink">←上一编辑</a>`
											: ""
									}</div></td><td colspan="2" class="diff-ntitle"><div id="mw-diff-ntitle1" class="mw-revslider-newer-diff-column"><strong><a href="${mw.util.getUrl(
										"",
										{
											oldid: d.torevid,
										}
									)}" title="">${parseDate(d.totimestamp)}的${
										next ? "" : "最新"
									}版本</a><span class="mw-diff-edit">（<a href="${mw.util.getUrl(
										"",
										{
											action: "edit",
											oldid: d.torevid,
										}
									)}" title="${pageName}">编辑</a>）</span> <span class="mw-diff-undo">（<a href="${mw.util.getUrl(
										"",
										{
											action: "edit",
											undoafter: d.fromrevid,
											undo: d.torevid,
										}
									)}" title="">撤销</a>）</span></strong></div><div id="mw-diff-ntitle2"><a href="${mw.util.getUrl(
										`User:${d.touser}`
									)}" class="mw-userlink" title="" data-username="${
										d.touser
									}"><bdi>${
										d.touser
									}</bdi></a><span class="mw-usertoollinks">（<a href="${mw.util.getUrl(
										`User talk:${d.touser}`
									)}" class="mw-usertoollinks-talk" title="User talk:${
										d.touser
									}">讨论</a> | <a href="${mw.util.getUrl(
										`Special:Contributions/${d.touser}`
									)}" class="mw-usertoollinks-contribs" title="Special:Contributions/${
										d.user
									}">贡献</a>）</span> </div><div id="mw-diff-ntitle3"><span class="comment">（${
										d.toparsedcomment
									}）</span></div><div id="mw-diff-ntitle5"></div><div id="mw-diff-ntitle4">${
										next
											? `<a href="${mw.util.getUrl("", {
													diff: next,
													oldid: d.torevid,
											  })}" title="${pageName}" id="differences-nextlink">下一编辑→</a>`
											: ""
									}</div></td></tr>${
										d.body ||
										'<tr><td colspan="2" class="diff-notice" lang="zh"><div class="mw-diff-empty">（没有差异）</div></td></tr>'
									}</tbody></table>`;
								});
						} else {
							await api
								.get({
									action: "compare",
									format: "json",
									fromrev: searchParams.get("diff"),
									torelative: "prev",
									utf8: 1,
									formatversion: 2,
								})
								.done(d => {
									document.getElementById(
										"mw-content-text"
									).innerHTML = `<table class="diff diff-contentalign-left" data-mw="interface">${
										d.compare.body
											? `<colgroup><col class="diff-marker"><col class="diff-content"><col class="diff-marker"><col class="diff-content"></colgroup><tbody>${d.compare.body}`
											: '<tbody><tr><td colspan="2" class="diff-notice" lang="zh"><div class="mw-diff-empty">（没有差异）</div></td></tr>'
									}</tbody></table>`;
								});
						}
						if (searchParams.get("diffonly") === "1") return;
						await api
							.get({
								action: "query",
								format: "json",
								prop: "revisions",
								revids: searchParams.get("diff"),
								utf8: 1,
								formatversion: 2,
								rvprop: "content|timestamp",
							})
							.done(d => {
								document.getElementById(
									"mw-content-text"
								).innerHTML += `<h2 class="diff-currentversion-title">${parseDate(
									d.query.pages[0].revisions[0].timestamp
								)}的版本</h2>`;
								api.post({
									action: "parse",
									format: "json",
									title: pageName,
									text: d.query.pages[0].revisions[0].content,
									utf8: 1,
									formatversion: 2,
								}).done(d => {
									document.getElementById(
										"mw-content-text"
									).innerHTML += d.parse.text;
								});
							});
					} else {
						const pageName = mw.config
							.get("wgPageName")
							.replace("_", " ");
						if (document.getElementsByTagName("h1")[0])
							document.getElementsByTagName("h1")[0].innerHTML =
								pageName;
						document.title = document.title.replace(
							"权限错误",
							pageName
						);
						await api
							.get({
								action: "query",
								format: "json",
								prop: "revisions",
								revids: searchParams.get("oldid"),
								utf8: 1,
								formatversion: 2,
								rvprop: "ids|timestamp|user|parsedcomment|content",
							})
							.done(async d => {
								d = d.query.pages[0].revisions[0];
								let torevid;
								await api
									.get({
										action: "compare",
										format: "json",
										fromrev: searchParams.get("oldid"),
										torelative: "next",
										prop: "ids",
										utf8: 1,
										formatversion: 2,
									})
									.done(d => {
										torevid = d.compare.torevid;
									});
								const text = `<div id="contentSub"><div class="mw-revision"><div id="mw-revision-info"><a href="${mw.util.getUrl(
									`User:${d.user}`
								)}" class="mw-userlink" title="User:${
									d.user
								}" data-username="${d.user}"><bdi>${
									d.user
								}</bdi></a><span class="mw-usertoollinks">（<a href="${mw.util.getUrl(
									`User talk:${d.user}`
								)}" class="mw-usertoollinks-talk user-link" title="User talk:${
									d.user
								}">讨论</a> | <a href="${mw.util.getUrl(
									`Special:Contributions/${d.user}`
								)}" class="mw-usertoollinks-contribs user-link" title="Special:Contributions/${
									d.user
								}">贡献</a>）</span>${parseDate(
									d.timestamp
								)}的版本 <span class="comment">（${
									d.parsedcomment
								}）</span></div><div id="mw-revision-nav">${
									d.parentid
										? `(<a href="${mw.util.getUrl("", {
												diff: d.parentid,
												oldid: searchParams.get(
													"oldid"
												),
										  })}" title="Help:沙盒">差异</a>) <a href="${mw.util.getUrl(
												"",
												{ oldid: d.parentid }
										  )}" title="${pageName}">←上一版本</a>`
										: "(差异) ←上一版本"
								} | ${
									torevid
										? `<a href="${mw.util.getUrl(
												pageName
										  )}" title="${pageName}">最后版本</a> (<a href="${mw.util.getUrl(
												"",
												{
													diff: mw.config.get(
														"wgCurRevisionId"
													),
													oldid: searchParams.get(
														"oldid"
													),
												}
										  )}" title="${pageName}">差异</a>) | <a href="${mw.util.getUrl(
												"",
												{
													oldid: torevid,
												}
										  )}" title="${pageName}">下一版本→</a> (<a href="${mw.util.getUrl(
												"",
												{
													diff: torevid,
													oldid: searchParams.get(
														"oldid"
													),
												}
										  )}" title="${pageName}">差异</a>)</div></div></div>`
										: "最后版本 (差异) | 下一版本→ (差异)"
								}`;
								if (document.getElementById("firstHeading")) {
									document.getElementById(
										"firstHeading"
									).outerHTML = `${
										document.getElementById("firstHeading")
											.outerHTML
									}${text}`;
								} else {
									document.getElementById(
										"bodyContent"
									).parentNode.innerHTML = `${text}${
										document.getElementById("bodyContent")
											.parentNode.innerHTML
									}`;
								}
								api.post({
									action: "parse",
									format: "json",
									title: pageName,
									text: d.content,
									prop: "text",
									utf8: 1,
									formatversion: 2,
								}).done(d => {
									document.getElementById(
										"mw-content-text"
									).innerHTML = d.parse.text;
								});
							});
					}
				}
				break;
		}
	})();
})();
