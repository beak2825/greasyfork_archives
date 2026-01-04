// ==UserScript==
// @name         抖店达人助手
// @namespace    https://github.com/yourusername
// @version      2.3.7
// @author       WechatID：fmtprint
// @description  抖店达人拓展好帮手
// @license      MIT
// @match        https://buyin.jinritemai.com/dashboard/servicehall/business-homepage?sec_shop_id*
// @connect      shop_api.uinstall.eu.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520931/%E6%8A%96%E5%BA%97%E8%BE%BE%E4%BA%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520931/%E6%8A%96%E5%BA%97%E8%BE%BE%E4%BA%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const n = {
	templates: [],
	productSettings: {},
	productIds: [],
	contactInfo: {
	phone: "",
	wechat: ""
	},
	activeTemplateId: ""
	}, t = "INVITE_CARD_CONFIG";

	function o() {
	const o = GM_getValue(t, n);
	return {
	templates: o.templates || n.templates,
	productSettings: o.productSettings || {},
	productIds: o.productIds || [],
	contactInfo: {
	phone: o.contactInfo?.phone || "",
	wechat: o.contactInfo?.wechat || ""
	},
	activeTemplateId: o.activeTemplateId || n.activeTemplateId
	};
	}

	function e(n) {
	GM_setValue(t, n);
	}

	function i(n, t) {
	let o;
	return (...e) => {
	clearTimeout(o), o = window.setTimeout((() => n(...e)), t);
	};
	}

	function c() {
	const n = document.querySelector(".shop-config-overlay");
	if (n) n.style.display = "block", n.querySelector(".shop-config-panel").style.display = "flex"; else {
	const n = (function() {
	const n = document.createElement("div");
	n.className = "shop-config-overlay", n.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:none;";
	const t = document.createElement("div");
	t.className = "shop-config-panel", t.style.cssText = "position:fixed;top:0;right:0;width:960px;height:100vh;background:white;box-shadow:-2px 0 8px rgba(0,0,0,0.15);z-index:1001;display:flex;flex-direction:column;font-size:14px;";
	const c = document.createElement("style");
	c.textContent = "\n        .shop-config-panel .header { padding:16px 24px; border-bottom:1px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center; background:white; }\n        .shop-config-panel .content { flex:1; overflow-y:auto; padding:16px; background-color:#fafbfc; display:flex; gap:16px; }\n        .shop-config-panel .footer { padding:16px 24px; border-top:1px solid #f0f0f0; text-align:right; background:white; }\n        .shop-config-panel h3 { margin:0; color:#000000d9; font-weight:500; font-size:16px; }\n        .shop-config-panel .form-block { background:white; border-radius:2px; padding:16px; margin-bottom:16px; }\n        .shop-config-panel .highlight-text { font-size:14px; font-weight:500; color:#000000d9; margin-bottom:16px; display:flex; align-items:center; }\n        .shop-config-panel .form-row { display:flex; margin-bottom:16px; }\n        .shop-config-panel .form-label { width:120px; text-align:right; padding-right:16px; color:#898b8f; line-height:32px; }\n        .shop-config-panel .form-content { flex:1; }\n        .shop-config-panel input[type=\"text\"], .shop-config-panel textarea { width:288px; padding:4px 11px; border:1px solid #d9d9d9; border-radius:2px; font-size:14px; }\n        .shop-config-panel textarea.large { width:100%; height:160px; resize:none; }\n        .shop-config-panel .checkbox-group { display:flex; flex-wrap:wrap; gap:16px; }\n        .shop-config-panel .checkbox-wrapper { display:inline-flex; align-items:center; cursor:pointer; user-select:none; }\n        .shop-config-panel .checkbox-inner { position:relative; width:16px; height:16px; border:1px solid #d9d9d9; border-radius:2px; margin-right:8px; }\n        .shop-config-panel .checkbox-wrapper.checked .checkbox-inner { background:#1966ff; border-color:#1966ff; }\n        .shop-config-panel .checkbox-wrapper.checked .checkbox-inner:after { content:''; position:absolute; left:4px; top:1px; width:6px; height:9px; border:2px solid #fff; border-top:0; border-left:0; transform:rotate(45deg); }\n        .shop-config-panel .table { width:100%; border-collapse:collapse; }\n        .shop-config-panel .table th, .shop-config-panel .table td { padding:12px 16px; border-bottom:1px solid #f0f0f0; text-align:left; vertical-align:middle; }\n        .shop-config-panel .table th { background:#fafafa; font-weight:500; color:#000000d9; }\n        .shop-config-panel .product-card { display:flex; align-items:center; gap:12px; }\n        .shop-config-panel .product-image { width:32px; height:32px; border-radius:2px; object-fit:cover; }\n        .shop-config-panel .product-info { flex:1; min-width:0; }\n        .shop-config-panel .product-title { font-size:13px; margin-bottom:4px; color:#252931; }\n        .shop-config-panel .product-meta { color:#898b8f; font-size:12px; }\n        .shop-config-panel .switch { position:relative; display:inline-block; width:28px; height:16px; background:#ccc; border-radius:100px; cursor:pointer; vertical-align:middle; }\n        .shop-config-panel .switch.checked { background:#1966ff; }\n        .shop-config-panel .switch-handle { position:absolute; top:2px; left:2px; width:12px; height:12px; background:white; border-radius:50%; transition:left 0.2s; }\n        .shop-config-panel .switch.checked .switch-handle { left:14px; }\n        .shop-config-panel .btn { padding:4px 15px; border-radius:2px; border:1px solid #d9d9d9; background:white; cursor:pointer; font-size:14px; }\n        .shop-config-panel .btn-primary { background:#1966ff; border-color:#1966ff; color:white; }\n        .shop-config-panel .btn-link { border:none; padding:0; color:#1966ff; }\n        .shop-config-panel .set-end-time { min-width:80px; text-align:left; }\n    ", 
	document.head.appendChild(c);
	const r = document.createElement("div");
	r.className = "header", r.innerHTML = '\n        <h3>\u9080\u8bf7\u914d\u7f6e</h3>\n        <button style="font-size:20px;line-height:1;padding:0 8px;border:none;background:none;">\xd7</button>\n    ';
	const a = document.createElement("div");
	a.className = "content";
	const s = document.createElement("div");
	s.style.flex = "1";
	const l = document.createElement("div");
	l.className = "form-block", l.innerHTML = '\n        <div class="highlight-text">\u9080\u7ea6\u4fe1\u606f</div>\n        <div class="form-row">\n            <div class="form-label">\u9080\u7ea6\u5185\u5bb9</div>\n            <div class="form-content">\n                <textarea class="large" placeholder="\u8bf7\u8f93\u5165\u9080\u7ea6\u5185\u5bb9"></textarea>\n            </div>\n        </div>\n        <div class="form-row">\n            <div class="form-label">\u4e13\u5c5e\u6743\u76ca</div>\n            <div class="form-content">\n                <div class="checkbox-group">\n                    <label class="checkbox-wrapper checked">\n                        <span class="checkbox-inner"></span>\n                        <span>\u4e13\u5c5e\u9ad8\u4f63</span>\n                    </label>\n                    <label class="checkbox-wrapper checked">\n                        <span class="checkbox-inner"></span>\n                        <span>\u514d\u8d39\u7533\u6837</span>\n                    </label>\n                    <label class="checkbox-wrapper">\n                        <span class="checkbox-inner"></span>\n                        <span>\u89c6\u9891\u7d20\u6750\u652f\u6301</span>\n                    </label>\n                    <label class="checkbox-wrapper">\n                        <span class="checkbox-inner"></span>\n                        <span>\u4f18\u8d28\u89c6\u9891\u6295\u6d41</span>\n                    </label>\n                </div>\n            </div>\n        </div>\n    ';
	const p = document.createElement("div");
	p.className = "form-block", p.innerHTML = '\n        <div class="highlight-text">\u8054\u7cfb\u65b9\u5f0f</div>\n        <div class="form-row">\n            <div class="form-label">\u624b\u673a\u53f7</div>\n            <div class="form-content">\n                <input type="text" placeholder="\u8bf7\u8f93\u5165\u624b\u673a\u53f7" maxlength="11">\n            </div>\n        </div>\n        <div class="form-row">\n            <div class="form-label">\u5fae\u4fe1\u53f7</div>\n            <div class="form-content">\n                <input type="text" placeholder="\u8bf7\u8f93\u5165\u5fae\u4fe1\u53f7" maxlength="20">\n            </div>\n        </div>\n    ';
	const f = document.createElement("div");
	f.className = "form-block", f.innerHTML = '\n        <div class="highlight-text">\u5546\u54c1\u914d\u7f6e</div>\n        <div style="margin-bottom:16px">\n            <button type="button" class="btn btn-primary">\u6dfb\u52a0\u5546\u54c1</button>\n        </div>\n        <table class="table">\n            <thead>\n                <tr>\n                    <th>\u5546\u54c1\u4fe1\u606f</th>\n                    <th style="width:120px">\u4e13\u5c5e\u4f63\u91d1</th>\n                    <th style="width:100px">\u514d\u5ba1\u7533\u6837</th>\n                    <th style="width:160px">\u7b56\u7565\u7ed3\u675f\u65f6\u95f4</th>\n                    <th style="width:80px">\u64cd\u4f5c</th>\n                </tr>\n            </thead>\n            <tbody></tbody>\n        </table>\n    ', 
	s.appendChild(l), s.appendChild(p), s.appendChild(f), a.appendChild(s);
	const h = document.createElement("div");
	h.style.cssText = "width:286px;flex-shrink:0;", h.innerHTML = '\n        <div class="highlight-text" style="margin:4px 0 8px 4px">\u6548\u679c\u9884\u89c8</div>\n        <img width="286" src="https://p3-infra.elabpic.com/tos-cn-i-ax5x5hote5/3343d634a25844368fe5ec79df459dc0~tplv-ax5x5hote5-image.image">\n    ', 
	a.appendChild(h);
	const u = document.createElement("div");
	u.className = "footer", u.innerHTML = '<button type="button" class="btn">\u53d6\u6d88</button>';
	const x = document.createElement("button");
	x.textContent = "\u9884\u89c8\u914d\u7f6e", x.className = "btn", x.style.marginRight = "8px", 
	x.onclick = () => (function() {
	const n = d("preview_account_id"), t = JSON.stringify(n, null, 2), o = document.createElement("div");
	o.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:24px;border-radius:2px;box-shadow:0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08);z-index:1002;width:800px;max-height:90vh;display:flex;flex-direction:column;", 
	o.innerHTML = `\n        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">\n            <h3 style="margin:0">\u914d\u7f6e\u9884\u89c8</h3>\n            <button style="font-size:20px;line-height:1;padding:0 8px;border:none;background:none;cursor:pointer;">\xd7</button>\n        </div>\n        <pre style="flex:1;overflow:auto;background:#f5f5f5;padding:16px;border-radius:2px;margin:0;font-family:monospace;font-size:12px;">${t}</pre>\n    `, 
	o.querySelector("button").onclick = () => document.body.removeChild(o), document.body.appendChild(o);
	})(), u.insertBefore(x, u.firstChild), t.appendChild(r), t.appendChild(a), t.appendChild(u), 
	n.appendChild(t), [ r.querySelector("button"), u.querySelector(".btn:last-child") ].forEach((o => {
	o.onclick = () => {
	n.style.display = "none", t.style.display = "none";
	};
	})), n.onclick = o => {
	o.target === n && (n.style.display = "none", t.style.display = "none");
	};
	const g = o(), m = l.querySelector("textarea");
	m.value = g.templates[0]?.content || "", m.onchange = i((n => {
	const t = o(), i = n.target.value, c = "template_" + Date.now();
	0 === t.templates.length ? (t.templates.push({
	id: c,
	name: "\u9080\u7ea6\u6a21\u677f",
	content: i,
	rights: [ {
	right: 1
	}, {
	right: 2
	} ]
	}), t.activeTemplateId = c) : t.templates[0].content = i, e(t);
	}), 300), l.querySelectorAll(".checkbox-wrapper").forEach(((n, t) => {
	const i = [ 1, 2, 4, 3 ][t];
	(g.templates[0]?.rights || [ {
	right: 1
	}, {
	right: 2
	} ]).some((n => n.right === i)) && n.classList.add("checked"), n.onclick = () => {
	const t = o();
	n.classList.contains("checked") ? (n.classList.remove("checked"), t.templates[0].rights = t.templates[0].rights.filter((n => n.right !== i))) : (n.classList.add("checked"), 
	t.templates[0].rights.push({
	right: i
	})), e(t);
	};
	}));
	const [b, v] = p.querySelectorAll("input");
	b.value = g.contactInfo.phone, v.value = g.contactInfo.wechat, b.onchange = i((n => {
	const t = n.target.value;
	if (!/^1[3-9]\d{9}$/.test(t)) return void window.alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801");
	const i = o();
	i.contactInfo.phone = t, e(i);
	}), 300), v.onchange = i((n => {
	const t = n.target.value;
	if (!/^[a-zA-Z0-9_-]{6,20}$/.test(t)) return void window.alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u5fae\u4fe1\u53f7\uff086-20\u4f4d\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\uff09");
	const i = o();
	i.contactInfo.wechat = t, e(i);
	}), 300);
	const w = f.querySelector("tbody");
	function y() {
	const n = o();
	w.innerHTML = n.productIds.map((t => {
	const o = n.productSettings[t], e = o?.validTime && "end" === o.timeRadio ? o.validTime.split(" ")[0] : "\u957f\u671f";
	return `\n                <tr>\n                    <td>\n                        <div class="product-card">\n                            <img class="product-image" src="https://placeholder.com/32x32" alt="">\n                            <div class="product-info">\n                                <div class="product-title">\u5546\u54c1ID: ${t}</div>\n                                <div class="product-meta">\n                                    <span>\u4f63\u91d1\uff1a${o?.cosRatio || 0}%</span>\n                                </div>\n                            </div>\n                        </div>\n                    </td>\n                    <td>\n                        <button type="button" class="btn btn-link set-ratio" data-id="${t}">\n                            ${o?.cosRatio ? o.cosRatio + "%" : "\u8bbe\u7f6e"}\n                        </button>\n                    </td>\n                    <td>\n                        <div class="switch ${3 === o?.sampleStatus ? "checked" : ""}" data-id="${t}">\n                            <div class="switch-handle"></div>\n                        </div>\n                    </td>\n                    <td>\n                        <button type="button" class="btn btn-link set-end-time" data-id="${t}">\n                            ${e}\n                        </button>\n                    </td>\n                    <td>\n                        <button type="button" class="btn btn-link delete-product" data-id="${t}">\u5220\u9664</button>\n                    </td>\n                </tr>\n            `;
	})).join(""), w.querySelectorAll("[data-id]").forEach((n => {
	const t = n.getAttribute("data-id");
	n.classList.contains("set-ratio") ? n.onclick = () => {
	const n = o(), i = prompt("\u8bf7\u8f93\u5165\u4e13\u5c5e\u4f63\u91d1\u6bd4\u4f8b\uff08%\uff09", "" + (n.productSettings[t]?.cosRatio || 40));
	if (null !== i) {
	const o = parseInt(i);
	isNaN(o) || 0 > o || o > 100 ? window.alert("\u8bf7\u8f93\u51650-100\u4e4b\u95f4\u7684\u6709\u6548\u6570\u5b57") : (n.productSettings[t].cosRatio = o, 
	e(n), y());
	}
	} : n.classList.contains("switch") ? n.onclick = () => {
	const n = o();
	n.productSettings[t].sampleStatus = 3 === n.productSettings[t].sampleStatus ? 1 : 3, 
	e(n), y();
	} : n.classList.contains("set-end-time") ? n.onclick = () => {
	const n = o(), i = n.productSettings[t];
	if ("long" === i.timeRadio) {
	if (confirm("\u662f\u5426\u8bbe\u7f6e\u7b56\u7565\u675f\u65f6\u95f4\uff1f")) {
	const t = new Date, o = new Date(t.getTime() + 6048e5), c = document.createElement("input");
	c.type = "date", c.value = o.toISOString().split("T")[0], c.min = t.toISOString().split("T")[0], 
	c.style.cssText = "\n                                position: fixed;\n                                top: 50%;\n                                left: 50%;\n                                transform: translate(-50%, -50%);\n                                padding: 8px;\n                                border: 1px solid #d9d9d9;\n                                border-radius: 2px;\n                                font-size: 14px;\n                                z-index: 1003;\n                            ", 
	document.body.appendChild(c);
	const r = document.createElement("div");
	r.style.cssText = "\n                                position: fixed;\n                                top: 0;\n                                left: 0;\n                                right: 0;\n                                bottom: 0;\n                                background: rgba(0,0,0,0.5);\n                                z-index: 1002;\n                            ", 
	document.body.appendChild(r), r.onclick = () => {
	document.body.removeChild(c), document.body.removeChild(r);
	}, c.onchange = t => {
	const o = t.target.value;
	i.timeRadio = "end", i.validTime = o + " 23:59:59", e(n), y(), document.body.removeChild(c), 
	document.body.removeChild(r);
	}, setTimeout((() => {
	c.focus();
	}), 100);
	}
	} else confirm("\u662f\u5426\u6539\u4e3a\u957f\u671f\uff1f") && (i.timeRadio = "long", 
	i.validTime = "3000-01-01 00:00:00", e(n), y());
	} : n.classList.contains("delete-product") && (n.onclick = () => {
	if (confirm("\u786e\u5b9a\u5220\u9664\u8be5\u5546\u54c1\u5417\uff1f")) {
	const n = o();
	n.productIds = n.productIds.filter((n => n !== t)), delete n.productSettings[t], 
	e(n), y();
	}
	});
	}));
	}
	return f.querySelector(".btn-primary").onclick = () => {
	const n = prompt("\u8bf7\u8f93\u5165\u5546\u54c1ID");
	if (!n) return;
	if (!(function(n) {
	return /^\d{6,20}$/.test(n);
	})(n)) return void window.alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u5546\u54c1ID\uff086-20\u4f4d\u6570\u5b57\uff09");
	const t = o();
	t.productIds.includes(n) ? window.alert("\u8be5\u5546\u54c1\u5df2\u6dfb\u52a0") : (t.productIds.push(n), 
	t.productSettings[n] = {
	sampleStatus: 1,
	cosRatio: 40,
	timeRadio: "long",
	validTime: "3000-01-01 00:00:00"
	}, e(t), y());
	}, y(), n;
	})();
	document.body.appendChild(n), n.style.display = "block", n.querySelector(".shop-config-panel").style.display = "flex";
	}
	}

	const r = {}, a = {}, s = {
	name: "",
	avatar: "",
	shopId: ""
	};

	function d(n) {
	const t = o(), e = t.templates.find((n => n.id === t.activeTemplateId));
	if (!e) throw Error("Template not found");
	return {
	account_id: n,
	account_type: 1,
	invite_card: {
	content: e.content,
	rights: e.rights,
	product_ids: t.productIds,
	product_setting: t.productIds.filter((n => t.productSettings[n])).map((n => {
	const o = t.productSettings[n];
	return {
	product_id: n,
	author_sample_status: o.sampleStatus,
	orient_cos_ratio_detail: {
	orient_kol_cos_ratio: o.cosRatio,
	time_radio: o.timeRadio,
	valid_time: o.validTime || "3000-01-01 00:00:00",
	suggest_orient_kol_cos_ratio: 53,
	...o.cosRatio ? {} : {
	cos_ratio_range: {
	low: 0,
	high: 80
	}
	}
	}
	};
	}))
	},
	contact_info: t.contactInfo
	};
	}

	function l(n) {
	const t = (function(n) {
	const t = a[n];
	if (!t) return null;
	const o = r[t];
	return o?.data?.author_list ? o.data.author_list.find((t => t.avatar === n)) : null;
	})(n);
	return t || null;
	}

	function p(n) {
	const t = n.querySelector(".card-info__avatar img");
	return t?.getAttribute("src") || null;
	}

	function f(n) {
	const t = p(n);
	return t ? l(t) : null;
	}

	async function h(n) {
	return new Promise(((t, o) => {
	"undefined" != typeof GM_xmlhttpRequest ? GM_xmlhttpRequest({
	method: "POST",
	url: "https://shop_api.uinstall.eu.org:888/shop/api/v1/douyin/contact",
	headers: {
	"Content-Type": "application/json",
	"User-Agent": window.navigator.userAgent,
	Accept: "application/json",
	Origin: "https://buyin.jinritemai.com",
	Referer: "https://buyin.jinritemai.com/",
	Cookie: document.cookie
	},
	data: JSON.stringify(n),
	onload(n) {
	try {
	const e = JSON.parse(n.responseText);
	200 === n.status && 200 === e.code ? t(e) : o(Error(e.message || "\u8bf7\u6c42\u5931\u8d25"));
	} catch (n) {
	o(n);
	}
	},
	onerror(n) {
	o(Error("\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25"));
	}
	}) : o(Error("GM_xmlhttpRequest \u4e0d\u53ef\u7528"));
	}));
	}

	async function u(n) {
	try {
	const t = await fetch("https://buyin.jinritemai.com/connection/pc/im/invite/card/send", {
	method: "POST",
	headers: {
	"Content-Type": "application/json",
	"User-Agent": window.navigator.userAgent,
	Accept: "application/json",
	Origin: "https://buyin.jinritemai.com",
	Referer: "https://buyin.jinritemai.com/"
	},
	body: JSON.stringify(n),
	credentials: "include"
	});
	if (!t.ok) throw Error("HTTP error! status: " + t.status);
	const o = await t.json();
	if (0 === o.code) return o;
	if (!o.msg) throw Error(`\u8bf7\u6c42\u5931\u8d25 | \u9519\u8bef\u7801: ${o.code} || '\u65e0'}`);
	throw Error(o.msg);
	} catch (n) {
	throw n;
	}
	}

	function x(n) {
	try {
	return new Date(n).toLocaleString("zh-CN", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: !1
	});
	} catch (t) {
	return n;
	}
	}

	function g(n) {
	return 1e8 > n ? 1e4 > n ? "" + n : (n / 1e4).toFixed(0) + "W" : (n / 1e8).toFixed(0) + "E";
	}

	const m = [ {
	key: "name",
	title: "\u8fbe\u4eba\u540d\u79f0"
	}, {
	key: "level",
	title: "\u7b49\u7ea7"
	}, {
	key: "fans_num",
	title: "\u7c89\u4e1d\u6570",
	format(n) {
	if (null == n) return "";
	const t = 100 * Math.floor(n / 100);
	return 1e4 > t ? 1e3 > t ? "" + t : (t / 1e3).toFixed(1) + "K" : (t / 1e4).toFixed(1) + "W";
	}
	}, {
	key: "sale_range",
	title: "\u5e97\u94fa\u63a8\u5e7f\u9500\u552e\u989d",
	getValue(n) {
	return n;
	},
	format(n) {
	const t = n.sale?.low, o = n.sale?.high;
	return null == t || null == o ? "" : 0 === t && 0 === o ? "0" : t === o ? g(t) : `${g(t)}-${g(o)}`;
	}
	}, {
	key: "live_num",
	title: "\u5173\u8054\u76f4\u64ad\u573a\u6b21"
	}, {
	key: "video_num",
	title: "\u5173\u8054\u77ed\u89c6\u9891\u6570"
	}, {
	key: "promotion_num",
	title: "\u63a8\u5e7f\u5546\u54c1\u6570"
	}, {
	key: "wechat_id",
	title: "Wechat"
	} ], b = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.5 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.2-3.5-7.7-7.7-7.7zm18.6-251.7L765 393.7c-5.3-4.2-13-.4-13 6.3v76H438c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z"/></svg>', v = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"/><path d="M391 391h252v252H391z"/></svg>';

	let w = null, y = null;

	const k = new Map;

	function z() {
	const n = document.createElement("div");
	n.className = "shop-log-panel", n.style.cssText = "\n        position: fixed;\n        left: 0;\n        bottom: 0;\n        width: 360px;\n        background: white;\n        border-radius: 8px 8px 0 0;\n        box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n        z-index: 1000;\n        font-size: 12px;\n        display: flex;\n        flex-direction: column;\n        max-height: 400px;\n        transition: transform 0.3s ease;\n    ";
	const t = document.createElement("div");
	t.style.cssText = "\n        padding: 12px 16px;\n        border-bottom: 1px solid #f0f0f0;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        border-radius: 8px 8px 0 0;\n        background: linear-gradient(to right, var(--progress-color, #e6f7ff) 0%, var(--progress-color, #e6f7ff) var(--progress, 0%), transparent var(--progress, 0%));\n        cursor: move;\n    ";
	const o = document.createElement("div");
	o.style.cssText = "\n        display: flex;\n        align-items: center;\n        gap: 8px;\n    ";
	const e = document.createElement("span");
	e.textContent = "\u64cd\u4f5c\u65e5\u5fd7", e.style.cssText = "\n        font-weight: 500;\n        color: #333;\n        font-size: 13px;\n    ";
	const i = document.createElement("div");
	i.style.cssText = "\n        display: flex;\n        gap: 8px;\n    ";
	const c = document.createElement("button");
	c.innerHTML = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"/></svg>', 
	c.style.cssText = "\n        padding: 0 8px;\n        height: 24px;\n        background: none;\n        border: 1px solid #d9d9d9;\n        border-radius: 4px;\n        cursor: pointer;\n        color: #666;\n        display: inline-flex;\n        align-items: center;\n        transition: all 0.3s;\n        &:hover {\n            color: #40a9ff;\n            border-color: #40a9ff;\n        }\n    ";
	const r = document.createElement("button");
	r.innerHTML = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-.3 1.5-.4 3-.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-.1 4.4-.4 14.2-2.4 23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4-0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z"/></svg><span style="margin-left:4px">\u6e05\u7a7a</span>', 
	r.style.cssText = "\n        padding: 0 8px;\n        height: 24px;\n        background: none;\n        border: 1px solid #d9d9d9;\n        border-radius: 4px;\n        cursor: pointer;\n        color: #666;\n        display: inline-flex;\n        align-items: center;\n        transition: all 0.3s;\n        &:hover {\n            color: #40a9ff;\n            border-color: #40a9ff;\n        }\n    ";
	let a = !1;
	c.onclick = () => {
	a = !a, n.style.transform = a ? `translateY(${n.offsetHeight - t.offsetHeight}px)` : "translateY(0)";
	}, r.onclick = M, o.appendChild(e), i.appendChild(c), i.appendChild(r), t.appendChild(o), 
	t.appendChild(i);
	const s = document.createElement("div");
	s.style.cssText = "\n        flex: 1;\n        overflow-y: auto;\n        padding: 8px 0;\n        max-height: 320px;\n    ", 
	n.appendChild(t), n.appendChild(s), w = n, y = s;
	let d, l, p, f, h = !1;
	return t.addEventListener("mousedown", (t => {
	h = !0, p = t.clientX - n.offsetLeft, f = t.clientY - n.offsetTop;
	})), document.addEventListener("mousemove", (t => {
	if (h) {
	t.preventDefault(), d = t.clientX - p, l = t.clientY - f;
	const o = window.innerWidth - n.offsetWidth, e = window.innerHeight - n.offsetHeight;
	d = Math.max(0, Math.min(d, o)), l = Math.max(0, Math.min(l, e)), n.style.left = d + "px", 
	n.style.bottom = window.innerHeight - l - n.offsetHeight + "px";
	}
	})), document.addEventListener("mouseup", (() => {
	h = !1;
	})), n;
	}

	function _(n) {
	if (!w) return;
	const t = w.querySelector("div");
	t && (t.style.setProperty("--progress", n + "%"), t.style.setProperty("--progress-color", 100 === n ? "#f6ffed" : "#e6f7ff"));
	}

	function $(n, t, o) {
	if (!y) return;
	const e = document.createElement("div");
	e.style.cssText = "\n        padding: 4px 16px;\n        display: flex;\n        align-items: flex-start;\n        gap: 8px;\n        line-height: 1.6;\n        &:hover {\n            background: #f5f5f5;\n        }\n    ";
	const i = document.createElement("span");
	i.style.cssText = `\n        margin-top: 2px;\n        flex-shrink: 0;\n        color: ${"info" === t.type ? "#1890ff" : "success" === t.type ? "#52c41a" : "#ff4d4f"};\n    `, 
	i.innerHTML = "info" === t.type ? '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/></svg>' : '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"/></svg>';
	const c = document.createElement("span");
	c.style.cssText = "\n        color: #999;\n        font-size: 11px;\n        flex-shrink: 0;\n        min-width: 50px;\n    ", 
	c.textContent = (new Date).toLocaleTimeString("zh-CN", {
	hour12: !1
	});
	const r = document.createElement("span");
	if (r.className = "log-message", r.style.cssText = "\n        flex: 1;\n        word-break: break-all;\n        white-space: pre-wrap;\n    ", 
	r.textContent = n, t.details) {
	const n = document.createElement("span");
	n.style.cssText = "\n            color: #999;\n            font-size: 11px;\n            flex-shrink: 0;\n            margin-left: 8px;\n        ";
	const o = [];
	"db" === t.details.source && t.details.savedAt && o.push("DB:" + x(t.details.savedAt)), 
	"api" === t.details.source && void 0 !== t.details.remaining && o.push("API:" + t.details.remaining), 
	t.details.errorMessage && o.push(t.details.errorMessage), n.textContent = o.join(" | "), 
	e.appendChild(n);
	}
	e.appendChild(i), e.appendChild(c), e.appendChild(r), y.appendChild(e), y.scrollTop = y.scrollHeight;
	}

	function M() {
	y && (y.innerHTML = "", k.clear());
	}

	function C(n, t) {
	w || document.body.appendChild(z()), $(n, {
	type: "info"
	});
	}

	function H(n, t) {
	w || document.body.appendChild(z()), $(n, {
	type: "success",
	details: t
	});
	}

	function j(n, t) {
	w || document.body.appendChild(z()), $(n, {
	type: "error",
	details: t
	});
	}

	async function I(n, t, o) {
	const e = Math.floor(1901 * Math.random()) + 100;
	try {
	await new Promise((n => setTimeout(n, e)));
	const i = d(n.sec_author_id), c = await u(i);
	return 0 === c.code ? (o.inviteSuccessCount++, t + ` | \u2705 \u9080\u7ea6\u6210\u529f | \u5ef6\u8fdf${e}ms`) : (o.inviteFailCount++, 
	t + ` | \u274c \u9080\u7ea6\u5931\u8d25: ${c.msg} | \u5ef6\u8fdf${e}ms`);
	} catch (n) {
	return o.inviteFailCount++, t + ` | \u274c \u9080\u7ea6\u5931\u8d25: ${n.message} | \u5ef6\u8fdf${e}ms`;
	}
	}

	function A(n, t = !1) {
	const o = document.createElement("div");
	o.style.cssText = "\n        display: flex;\n        align-items: center;\n        gap: 4px;\n        margin-right: 12px;\n    ";
	const e = document.createElement("input");
	e.type = "checkbox", e.checked = t, e.style.cssText = "\n        margin: 0;\n        cursor: pointer;\n    ";
	const i = document.createElement("label");
	return i.textContent = n, i.style.cssText = "\n        cursor: pointer;\n        user-select: none;\n    ", 
	o.appendChild(e), o.appendChild(i), o;
	}

	function T(n) {
	const t = document.querySelectorAll('.shop-card-checkbox input[type="checkbox"]:checked').length;
	n.innerHTML = `${b}<span style="margin-left:4px">\u64cd\u4f5c\u9009\u4e2d(${t})</span>`;
	}

	const S = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"/></svg>', V = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8z"/><path d="M824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 01-37.5-90.5c0-34.2 13.3-66.3 37.5-90.5 24.2-24.2 56.3-37.5 90.5-37.5s66.3 13.3 90.5 37.5c24.2 24.2 37.5 56.3 37.5 90.5s-13.3 66.3-37.5 90.5z"/></svg>';

	((function(n, t) {
	document.querySelector(".shop-control-panel") || document.body.appendChild((function() {
	const n = document.createElement("div");
	n.className = "shop-control-panel", n.style.cssText = "\n        position: fixed;\n        bottom: 0;\n        right: 60px;\n        background: white;\n        padding: 16px;\n        border-radius: 8px 8px 0 0;\n        box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n        z-index: 1000;\n        display: flex;\n        flex-direction: column;\n        gap: 12px;\n        font-size: 12px;\n    ";
	const t = document.createElement("div");
	t.style.cssText = "\n        padding: 4px 8px;\n        margin: -16px -16px 8px -16px;\n        background: #fafafa;\n        border-radius: 8px 8px 0 0;\n        border-bottom: 1px solid #f0f0f0;\n        font-weight: 500;\n        color: #333;\n        font-size: 13px;\n    ", 
	t.textContent = "\u6279\u91cf\u64cd\u4f5c";
	const e = document.createElement("div");
	e.style.cssText = "\n        display: flex;\n        align-items: center;\n        margin-bottom: 8px;\n    ";
	const i = A("\u9080\u7ea6", !0), r = A("\u67e5\u8be2", !0), a = i.querySelector("input"), d = r.querySelector("input");
	a.addEventListener("change", (() => {
	a.checked || d.checked || (d.checked = !0);
	})), d.addEventListener("change", (() => {
	a.checked || d.checked || (a.checked = !0);
	})), e.appendChild(i), e.appendChild(r);
	const f = document.createElement("button");
	f.innerHTML = v + '<span style="margin-left:4px">\u5168\u9009</span>', f.style.cssText = "\n        padding: 0 12px;\n        height: 28px;\n        background-color: #fff;\n        color: #1890ff;\n        border: 1px solid #1890ff;\n        border-radius: 4px;\n        cursor: pointer;\n        font-size: 12px;\n        transition: all 0.3s;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        &:hover {\n            background-color: #1890ff;\n            color: #fff;\n        }\n    ";
	const u = document.createElement("button");
	u.innerHTML = b + '<span style="margin-left:4px">\u64cd\u4f5c\u9009\u4e2d(0)</span>', 
	u.style.cssText = "\n        padding: 0 12px;\n        height: 28px;\n        background-color: #52c41a;\n        color: white;\n        border: none;\n        border-radius: 4px;\n        cursor: pointer;\n        font-size: 12px;\n        transition: all 0.3s;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        &:hover {\n            background-color: #73d13d;\n        }\n    ";
	const g = document.createElement("button");
	g.innerHTML = '<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a352.34 352.34 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"/></svg><span style="margin-left:4px">\u9080\u8bf7\u914d\u7f6e</span>', 
	g.style.cssText = "\n        padding: 0 12px;\n        height: 28px;\n        background-color: #f7f7f7;\n        color: #666;\n        border: 1px solid #d9d9d9;\n        border-radius: 4px;\n        cursor: pointer;\n        font-size: 12px;\n        transition: all 0.3s;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        &:hover {\n            color: #40a9ff;\n            border-color: #40a9ff;\n        }\n    ";
	const w = document.createElement("div");
	w.style.cssText = "\n        display: flex;\n        flex-direction: column;\n        gap: 8px;\n    ";
	let y = !1;
	return f.addEventListener("click", (() => {
	y = !y, f.innerHTML = `${v}<span style="margin-left:4px">${y ? "\u53d6\u6d88\u5168\u9009" : "\u5168\u9009"}</span>`, 
	document.querySelectorAll('.shop-card-checkbox input[type="checkbox"]').forEach((n => {
	n.checked = y;
	})), T(u);
	})), u.addEventListener("click", (() => {
	const n = a.checked, t = d.checked;
	if (0 !== document.querySelectorAll('.shop-card-checkbox input[type="checkbox"]:checked').length) {
	if (n) {
	const n = o();
	if (!n.templates.length || !n.activeTemplateId) return void alert("\u8bf7\u5148\u914d\u7f6e\u9080\u7ea6\u6a21\u677f");
	if (!n.productIds.length) return void alert("\u8bf7\u5148\u914d\u7f6e\u5546\u54c1");
	if (!n.contactInfo.phone || !n.contactInfo.wechat) return void alert("\u8bf7\u5148\u914d\u7f6e\u8054\u7cfb\u65b9\u5f0f");
	}
	!(async function(n = !0, t = !0) {
	const e = Array.from(document.querySelectorAll('.shop-card-checkbox input[type="checkbox"]:checked')).map((n => n.closest(".shop-card"))).filter((n => null !== n));
	if (0 === e.length) return void alert("\u8bf7\u5148\u9009\u62e9\u8981\u64cd\u4f5c\u7684\u8fbe\u4eba");
	if (n) {
	const n = o();
	if (!n.templates.length || !n.activeTemplateId) return void alert("\u8bf7\u5148\u914d\u7f6e\u9080\u7ea6\u6a21\u677f");
	if (!n.productIds.length) return void alert("\u8bf7\u5148\u914d\u7f6e\u5546\u54c1");
	if (!n.contactInfo.phone || !n.contactInfo.wechat) return void alert("\u8bf7\u5148\u914d\u7f6e\u8054\u7cfb\u65b9\u5f0f");
	}
	M();
	const i = e.length;
	C(`\u5f00\u59cb\u5904\u7406 | \u5171\u9009\u4e2d ${i} \u4e2a\u8fbe\u4eba`);
	const c = e.map(p).filter((n => null !== n)).map((n => l(n))).filter((n => null !== n));
	if (0 === c.length) return void j("\u672a\u627e\u5230\u8fbe\u4eba\u6570\u636e");
	let r = 0;
	const a = {
	inviteSuccessCount: 0,
	inviteFailCount: 0
	};
	let d = 0;
	C("------------------------");
	const f = [];
	for (const o of c) {
	d++;
	try {
	let e = "", c = `[${d}/${i}] ${o.name || o.nickname || "\u672a\u77e5\u8fbe\u4eba"}`, s = [];
	if (t) {
	const n = await h(o);
	200 !== n.code && 0 !== n.code || !n.data?.wechat_id ? (c += " | \u274c \u67e5\u8be2\u5931\u8d25: " + (n.message || "\u672a\u627e\u5230\u8054\u7cfb\u65b9\u5f0f"), 
	"api" === n.source && void 0 !== n.remaining && s.push("API:" + n.remaining)) : (r++, 
	e = n.data.wechat_id, c += " | \u2705 \u67e5\u8be2\u6210\u529f: " + e, "db" === n.source && n.saved_at && s.push("DB:" + x(n.saved_at)), 
	"api" === n.source && void 0 !== n.remaining && s.push("API:" + n.remaining));
	}
	n && (c = await I(o, c, a)), s.length > 0 && (c += " | " + s.join(" | ")), c.includes("\u274c") ? j(c) : H(c), 
	t && f.push({
	...o,
	wechat_id: e
	});
	} catch (n) {
	j(`[${d}/${i}] ${o.name || o.nickname || "\u672a\u77e5\u8fbe\u4eba"} | \u274c \u64cd\u4f5c\u5931\u8d25: ${n.message}`), 
	t && f.push({
	...o,
	wechat_id: ""
	});
	}
	_(Math.round(d / i * 100));
	}
	C("------------------------");
	let u = "\u2728 \u5904\u7406\u5b8c\u6210";
	if (t && (u += ` | \u67e5\u8be2\u6210\u529f\u7387: ${r}/${i} (${Math.round(r / i * 100)}%)`), 
	n && (u += ` | \u9080\u7ea6\u6210\u529f\u7387: ${a.inviteSuccessCount}/${i} (${Math.round(a.inviteSuccessCount / i * 100)}%)`), 
	C(u), t && r > 0) {
	const n = (g = f, [ m.map((n => n.title)).join(","), ...g.map((n => m.map((t => {
	let o;
	if (t.getValue) o = t.getValue(n); else if (t.key.startsWith("sale_")) {
	const e = t.key.replace("sale_", "");
	o = n.sale?.[e];
	} else o = n[t.key];
	return (function(n) {
	return null == n ? "" : "boolean" == typeof n ? n ? "\u662f" : "\u5426" : "number" == typeof n ? "" + n : ("object" != typeof n || Array.isArray(n) || (n = JSON.stringify(n)), 
	"string" == typeof n && (n.includes(",") || n.includes("\n") || n.includes('"')) ? `"${n.replace(/"/g, '""')}"` : n + "");
	})(t.format ? t.format(o) : o);
	})).join(","))) ].join("\n")), t = new Blob([ "\ufeff" + n ], {
	type: "text/csv;charset=utf-8;"
	}), o = URL.createObjectURL(t), e = document.createElement("a");
	e.href = o;
	const {name: i} = {
	...s
	}, c = (new Date).toISOString().split("T")[0];
	e.download = i ? `${i}_\u8fbe\u4eba\u6570\u636e_${c}.csv` : `\u8fbe\u4eba\u6570\u636e_${c}.csv`, 
	document.body.appendChild(e), e.click(), document.body.removeChild(e), URL.revokeObjectURL(o), 
	H("\u6587\u4ef6\u5bfc\u51fa\u5b8c\u6210");
	}
	var g;
	})(n, t);
	} else alert("\u8bf7\u5148\u9009\u62e9\u8981\u64cd\u4f5c\u7684\u8fbe\u4eba");
	})), g.addEventListener("click", c), document.addEventListener("checkbox-change", (() => {
	T(u);
	})), w.appendChild(f), w.appendChild(u), w.appendChild(g), n.appendChild(t), n.appendChild(e), 
	n.appendChild(w), n;
	})()), document.querySelector(".shop-log-panel") || document.body.appendChild(z());
	const e = document.body;
	new MutationObserver((() => {
	document.querySelectorAll(n).forEach((n => {
	n.querySelector(".shop-card-checkbox") || t(n);
	}));
	})).observe(e, {
	childList: !0,
	subtree: !0
	}), document.querySelectorAll(n).forEach((n => {
	n.querySelector(".shop-card-checkbox") || t(n);
	}));
	}))(".shop-card", (function(n) {
	const t = (function() {
	const n = document.createElement("div");
	n.className = "shop-card-checkbox", n.style.cssText = "\n        display: flex;\n        align-items: center;\n        padding: 0 10px;\n        margin-right: 10px;\n    ";
	const t = document.createElement("input");
	return t.type = "checkbox", t.style.cssText = "\n        width: 16px;\n        height: 16px;\n        cursor: pointer;\n    ", 
	t.addEventListener("change", (n => {
	n.stopPropagation(), document.dispatchEvent(new CustomEvent("checkbox-change"));
	})), t.addEventListener("click", (n => {
	n.stopPropagation();
	})), n.appendChild(t), n;
	})(), e = (function(n) {
	const t = document.createElement("div");
	t.style.cssText = "\n        display: flex;\n        gap: 8px;\n        margin-left: 10px;\n    ";
	const e = document.createElement("button");
	e.innerHTML = S + '<span style="margin-left:4px">\u67e5\u8be2</span>';
	const i = S + '<span style="margin-left:4px">\u67e5\u8be2</span>', c = S + '<span style="margin-left:4px">\u67e5\u8be2\u4e2d...</span>';
	e.style.cssText = "\n        padding: 0 12px;\n        font-size: 12px;\n        border-radius: 4px;\n        cursor: pointer;\n        border: 1px solid #1890ff;\n        background-color: #fff;\n        color: #1890ff;\n        transition: all 0.3s;\n        outline: none;\n        font-weight: normal;\n        height: 24px;\n        line-height: 22px;\n        box-shadow: 0 2px 0 rgba(0,0,0,0.015);\n        white-space: nowrap;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        min-width: 48px;\n    ";
	const r = document.createElement("button");
	r.innerHTML = V + '<span style="margin-left:4px">\u9080\u7ea6</span>';
	const a = V + '<span style="margin-left:4px">\u9080\u7ea6</span>', s = V + '<span style="margin-left:4px">\u53d1\u9001\u4e2d...</span>';
	r.style.cssText = "\n        padding: 0 12px;\n        font-size: 12px;\n        border-radius: 4px;\n        cursor: pointer;\n        border: 1px solid #52c41a;\n        background-color: #52c41a;\n        color: #fff;\n        transition: all 0.3s;\n        outline: none;\n        font-weight: normal;\n        height: 24px;\n        line-height: 22px;\n        box-shadow: 0 2px 0 rgba(0,0,0,0.015);\n        white-space: nowrap;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        min-width: 64px;\n    ";
	const l = (n, t) => {
	t ? (n.style.opacity = "0.65", n.style.cursor = "not-allowed", n.disabled = !0) : (n.style.opacity = "1", 
	n.style.cursor = "pointer", n.disabled = !1);
	};
	return e.addEventListener("mouseover", (() => {
	e.disabled || (e.style.backgroundColor = "#40a9ff", e.style.borderColor = "#40a9ff", 
	e.style.color = "#fff");
	})), e.addEventListener("mouseout", (() => {
	e.disabled || (e.style.backgroundColor = "#fff", e.style.borderColor = "#1890ff", 
	e.style.color = "#1890ff");
	})), r.addEventListener("mouseover", (() => {
	r.disabled || (r.style.backgroundColor = "#73d13d", r.style.borderColor = "#73d13d");
	})), r.addEventListener("mouseout", (() => {
	r.disabled || (r.style.backgroundColor = "#52c41a", r.style.borderColor = "#52c41a");
	})), e.addEventListener("mousedown", (() => {
	e.disabled || (e.style.backgroundColor = "#096dd9", e.style.borderColor = "#096dd9");
	})), e.addEventListener("mouseup", (() => {
	e.disabled || (e.style.backgroundColor = "#40a9ff", e.style.borderColor = "#40a9ff");
	})), r.addEventListener("mousedown", (() => {
	r.disabled || (r.style.backgroundColor = "#389e0d", r.style.borderColor = "#389e0d");
	})), r.addEventListener("mouseup", (() => {
	r.disabled || (r.style.backgroundColor = "#73d13d", r.style.borderColor = "#73d13d");
	})), e.addEventListener("click", (async t => {
	if (!e.disabled) {
	t.stopPropagation(), t.preventDefault();
	try {
	l(e, !0), e.innerHTML = c;
	const t = f(n);
	if (!t) return void alert("\u672a\u627e\u5230\u8fbe\u4eba\u8d44\u6599");
	const o = await h(t);
	if (200 !== o.code && 0 !== o.code || !o.data?.wechat_id) alert("\u67e5\u8be2\u5931\u8d25: " + (o.message || "\u672a\u627e\u5230\u8054\u7cfb\u65b9\u5f0f")); else {
	const n = [ "\u8fbe\u4eba\u540d\u79f0: " + (t.name || t.nickname || "\u672a\u77e5"), "\u8054\u7cfb\u65b9\u5f0f: " + o.data.wechat_id, "\u6570\u636e\u6765\u6e90: " + ("db" === o.source ? "\u6570\u636e\u5e93" : "API\u67e5\u8be2"), o.remaining ? "API\u5269\u4f59\u6b21\u6570: " + o.remaining : "", "db" === o.source && o.saved_at ? "\u6570\u636e\u5e93\u66f4\u65b0\u65f6\u95f4: " + x(o.saved_at) : "" ].filter(Boolean).join("\n");
	alert(n);
	}
	} catch (n) {
	alert("\u67e5\u8be2\u8054\u7cfb\u65b9\u5f0f\u5931\u8d25: " + n.message);
	} finally {
	l(e, !1), e.innerHTML = i;
	}
	}
	})), r.addEventListener("click", (async t => {
	if (!r.disabled) {
	t.stopPropagation(), t.preventDefault();
	try {
	l(r, !0), r.innerHTML = s;
	const t = f(n);
	if (!t) return void alert("\u672a\u627e\u5230\u8fbe\u4eba\u8d44\u6599");
	const e = o();
	if (!e.templates.length || !e.activeTemplateId) return void alert("\u8bf7\u5148\u914d\u7f6e\u9080\u7ea6\u6a21\u677f");
	if (!e.productIds.length) return void alert("\u8bf7\u5148\u914d\u7f6e\u5546\u54c1");
	if (!e.contactInfo.phone || !e.contactInfo.wechat) return void alert("\u8bf7\u5148\u914d\u7f6e\u8054\u7cfb\u65b9\u5f0f");
	const i = d(t.sec_author_id), c = await u(i);
	0 === c.code ? alert("\u9080\u7ea6\u53d1\u9001\u6210\u529f\uff01") : alert("\u9080\u7ea6\u53d1\u9001\u5931\u8d25: " + c.msg);
	} catch (n) {
	alert("\u53d1\u9001\u9080\u7ea6\u5931\u8d25: " + n.message);
	} finally {
	l(r, !1), r.innerHTML = a;
	}
	}
	})), t.appendChild(e), t.appendChild(r), t;
	})(n);
	n.insertBefore(t, n.firstChild), n.appendChild(e);
	})), window.addEventListener("load", (function() {
	const n = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(t, o, e, i, c) {
	return "string" == typeof o && (o.includes("/square_pc_api/shop/shopProfileAuthorList") ? this.addEventListener("load", (function() {
	try {
	const n = JSON.parse(this.response), t = this.responseURL;
	r[t] = n, n.data?.author_list?.forEach((n => {
	n.avatar && (a[n.avatar] = t);
	}));
	} catch (n) {}
	})) : o.includes("/square_pc_api/shop/shopProfile") && this.addEventListener("load", (function() {
	try {
	const n = JSON.parse(this.response);
	if (0 === n.code && n.data?.basic_info) {
	const {basic_info: t} = n.data;
	s.name = t.name || "", s.avatar = t.avatar || "", s.shopId = t.shop_id?.toString() || "";
	}
	} catch (n) {}
	}))), n.call(this, t, o, e ?? !0, i, c);
	};
	}));

})();