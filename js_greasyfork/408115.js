// ==UserScript==
// @name         京淘购物助手【京东版】
// @namespace    https://www.jingtaozhushou.com/plugin?from=monkey
// @icon         https://www.jingtaozhushou.com/favicon.ico
// @version      1.0.3
// @run-at       document-end
// @description  京淘购物助手【京东版】是京淘助手简版，支持查询京东佣金比例、隐藏联盟券、真实库存、企业帐号价格、微信端和手Q端价格查询等；更多功能持续开发中，要使用完整版，请到官网下载！官方交流和反馈QQ群：633824817  问题反馈：https://www.jingtaozhushou.com/feedback?from=monkey
// @description:zh-CN  京淘购物助手【京东版】是京淘助手简版，支持查询京东佣金比例、隐藏联盟券、真实库存、企业帐号价格、微信端和手Q端价格查询等；更多功能持续开发中，要使用完整版，请到官网下载！官方交流和反馈QQ群：633824817  问题反馈：https://www.jingtaozhushou.com/feedback?from=monkey
// @author       jingtaozhushou.com
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @include	 https://*.jingtaozhushou.com/*
// @include	 *://*.jd.com/*
// @include	 *://*.paipai.com/*
// @include	 *://*.jd.hk/*
// @include	 *://*.yiyaojd.com/*
// @include	 *://*.jkcsjd.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      3.cn
// @connect      jd.com
// @connect      jingtaozhushou.com
// @downloadURL https://update.greasyfork.org/scripts/408115/%E4%BA%AC%E6%B7%98%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B%E3%80%90%E4%BA%AC%E4%B8%9C%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/408115/%E4%BA%AC%E6%B7%98%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B%E3%80%90%E4%BA%AC%E4%B8%9C%E7%89%88%E3%80%91.meta.js
// ==/UserScript==
(function() {
	'use strict';
	let gm_info = GM_info.script;
	console.log('%c京淘购物助手%c 欢迎您使用京淘助手油猴脚本【京东版】，脚本已加载成功！%c 版本：' + gm_info.version + ' %c Copyright © 2019-' + (new Date).getFullYear() + ' 京淘助手 jingtaozhushou\r.com all rights reserved.', 'background: #030307;color: #fadfa3;font:12px Microsoft YaHei;padding:10px 15px;', 'background: #fadfa3;color:#030307;font:12px Microsoft YaHei;padding:10px 15px;', 'background:#fff5bf;color:#8b7442;font:12px Microsoft YaHei;padding:10px 15px;', 'background:#fffbe5;color:#8b7442; font:12px Microsoft YaHei;padding:10px 15px;', );
	let domain = "https://www.jingtaozhushou.com";
	let jtzs = {
		mobj: "jt_jd_mbox",
		init: function() {
			let _this = this;
			if (this.isMobile()) {
				if ($("#buyArea").length > 0) {
					$("#buyArea").after('<div class="' + this.mobj + '"><div class="loading"><i></i>【京淘助手】加载中，请稍后...</div></div>')
				}
			}
			this.getCommssion();
			this.getJdPcPrice();
			setTimeout(function() {
				_this.getCompanyPrice();
				_this.getWqsPrice();
				_this.getRealStock()
			}, 1000)
		},
		appendCommssion: function(a) {
			let info = a, obj = {}, coupon = '', coupon_link = '';
			if (typeof a === 'object') {
				obj = {
					comm: a.wlCommission,
					ratio: a.wlCommissionRatio,
					plus_comm: parseFloat((a.plusCommissionShare * a.finalPrice / 100).toFixed(2)),
					plus_ratio: a.plusCommissionShare
				};
				coupon_link = domain + '/jump/url?url=' + encodeURIComponent(this.itemUrl()) + '&coupon=' + encodeURIComponent(a.couponLink)
			}
			if (this.isMobile() == false) {
				if (Object.keys(obj).length > 0) {
					info = '<div class="general_comm" title="京东【普通会员】佣金：￥' + obj.comm + '，比例：' + obj.ratio + '%">普通会员：￥<b>' + obj.comm + '</b>（' + obj.ratio + '%）</div>' + '<div class="plus_comm" title="京东【PLUS会员】佣金：￥' + obj.plus_comm + '，比例：' + obj.plus_ratio + '%">PLUS会员：￥<b>' + obj.plus_comm + '</b>（' + obj.plus_ratio + '%） </div>';
					if (a.hasCoupon == 1 && a.couponLink) {
						coupon = '<div class="jt_pc_coupon"><a href="' + coupon_link + '" target="_blank" class="jt_cp_price" title="京淘助手出品！点击领取【满' + a.couponQuota + '减' + a.couponDiscount + '元】">￥<b>' + a.couponDiscount + '</b>联盟券</a></div>'
					}
				}
				setTimeout(function() {
					$(".J-summary-price").eq(0).after('<div class="jt_jd_pc_comm" title="京东佣金信息，京淘助手出品，仅供参考！"><div class="dt">佣金比例</div><div class="dd jd_comm">' + info + '</div>' + coupon + '</div>')
				}, 1500)
			} else {
				if (Object.keys(obj).length > 0) {
					info = '<div class="list yj"><span class="jt_lab pt">普通会员</span><i>比例：<b>' + obj.ratio + '%</b></i><em>佣金：<b>￥' + obj.comm + '</b></em> </div>\n' + '<div class="list yj"><span class="jt_lab plus">PLUS会员</span><i>比例：<b>' + obj.plus_ratio + '%</b></i><em>佣金：<b>￥' + obj.plus_comm + '</b></em></div>\n';
					if (a.hasCoupon == 1 && a.couponLink) {
						$("." + this.mobj).append('<div class="jd_item"><div class="jt_tit">优惠</div><div class="jt_desc"><div class="list coupon"><a href="' + coupon_link + '" target="_blank">满' + a.couponQuota + '减' + a.couponDiscount + '元联盟券</a><span>点击领取</span></div></div></div></div>')
					}
				}
				$("." + this.mobj).find(".loading").hide();
				$("." + this.mobj).append('<div class="jd_item"><div class="jt_tit">佣金</div><div class="jt_desc">' + info + '</div></div>')
			}
		},
		appendWqsPrice: function(a) {
			let pcPrice = this.price;
			if (this.isMobile() == false) {
				$(".J-summary-price").eq(0).after('<div class="jt_jd_pc_price">' + '<div class="dt">微&nbsp;Q 价</div><div class="dd">' + '<span class="jt_p_price" title="京淘助手出品，提供微信端、手Q端价格查询，仅供参考！"><span>￥</span>' + '<span class="jt_price">' + a + '</span>' + '<span class="jt_discount">（便宜：<b>' + (pcPrice - a).toFixed(2) + '</b>元）</span>' + '</span></div></div>')
			} else {
				let wqUrl = domain + '/jump/url?url=' + encodeURIComponent("https://wqitem.jd.com/item/view?sku=" + this.skuid());
				let info = '<div class="list prices"><span class="jt_lab">微Q价</span>￥<em>' + a + '</em><i>（便宜：' + (pcPrice - a).toFixed(2) + '元）</i><a href="' + wqUrl + '" target="_blank" class="go_wqitem">去查看</a> </div>';
				$("." + this.mobj).find(".loading").hide();
				if ($("#jt-prices").length > 0) {
					$("#jt-prices").append(info)
				} else {
					$("." + this.mobj).append('<div class="jd_item"><div class="jt_tit">价格</div><div class="jt_desc" id="jt-prices">' + info + '</div></div>')
				}
			}
		},
		appendCompanyPrice: function(a) {
			let pcPrice = this.price;
			if (this.isMobile() == false) {
				$(".J-summary-price").eq(0).after('<div class="jt_jd_pc_price" title="疑似京东企业账号下单价格">' + '<div class="dt">企 业 价</div><div class="dd">' + '<span class="jt_p_price" title="京淘助手出品，提供企业价格查询，仅供参考！"><span>￥</span>' + '<span class="jt_price">' + a + '</span>' + '<span class="jt_discount">（便宜：<b>' + (pcPrice - a).toFixed(2) + '</b>元）</span>' + '</span></div></div>')
			} else {
				let info = '<div class="list prices"><span class="jt_lab">企业价</span>￥<em>' + a + '</em><i>（便宜：' + (pcPrice - a).toFixed(2) + '元）</i></div>';
				$("." + this.mobj).find(".loading").hide();
				if ($("#jt-prices").length > 0) {
					$("#jt-prices").append(info)
				} else {
					$("." + this.mobj).append('<div class="jd_item"><div class="jt_tit">价格</div><div class="jt_desc" id="jt-prices">' + info + '</div></div>')
				}
			}
		},
		appendStock: function(a) {
			if (this.isMobile() == false) {
				let msg = '<div class="jt_pc_stock jt_stock_more" title="京淘助手提醒您，当前库存5件以上！">库存：<b>' + a + '</b>件</div>';
				if (typeof a === 'number' && !isNaN(a)) {
					msg = '<div class="jt_pc_stock" title="京淘助手提醒您，当前仅剩' + a + '件了，有需要抓紧下手吧！">仅剩：<b>' + a + '</b>件</div>'
				}
				$("#store-prompt").after(msg)
			} else {
				let msg = '<span style="color: #666;">' + a + '件</span>';
				if (typeof a === 'number' && !isNaN(a)) {
					msg = '仅剩 <b>' + a + '</b> 件'
				}
				$("." + this.mobj).find(".loading").hide();
				$("." + this.mobj).append('<div class="jd_item"><div class="jt_tit">库存</div><div class="jt_desc"><div class="list stock">' + msg + '</div></div></div>')
			}
		},
		getCommssion: function() {
			let id = this.skuid();
			if (id > 0) {
				GM_xmlhttpRequest({
					method: "post",
					headers: {
						"jt-monkey": gm_info.version,
						uuid: gm_info.uuid
					},
					url: this.apiUrl.commssionApiUrl + "?skuid=" + id,
					onload: resp => {
						if (resp.readyState == 4 && resp.status == 200) {
							var a = JSON.parse(resp.responseText);
							if (a) {
								let info = "";
								if (a.code == 0 && a.data) {
									info = a.data
								} else {
									info = '暂无佣金信息！'
								}
								if (info) {
									this.appendCommssion(info)
								}
							} else {
								console.log("服务器错误！")
							}
						}
					}
				})
			}
		},
		getJdPcPrice: function() {
			let jdu = this.getCookie("__jdu"), pin = this.getCookie('pin'), area = this.getArea(), id = this.skuid();
			if (id > 0) {
				let param = 'skuIds=J_' + id + '&area=' + area + '&pduid=' + jdu + '&pdpin=' + pin + '&pin=' + pin + '&type=1&ext=11100000&source=item-pc';
				GM_xmlhttpRequest({
					method: "get",
					url: this.apiUrl.pcPriceUrl + "?" + param,
					onload: resp => {
						if (resp.readyState == 4 && resp.status == 200) {
							let pc = JSON.parse(resp.responseText);
							if (pc && pc.length > 0) {
								this.price = parseFloat(pc[0].p)
							}
						}
					}
				})
			}
		},
		getWqsPrice: function() {
			let jdu = this.getCookie("__jdu"), pin = this.getCookie('pin'), area = this.getArea(), id = this.skuid();
			if (id > 0) {
				let wqs_param = 'skuids=' + id + '&origin=5&pdbp=0&pduid=' + jdu + '&area=' + area + '&pdpin=' + pin + '&pin=' + pin;
				GM_xmlhttpRequest({
					method: "get",
					url: this.apiUrl.wqsPriceUrl + "?" + wqs_param,
					onload: resp => {
						if (resp.readyState == 4 && resp.status == 200) {
							let data = JSON.parse(resp.responseText);
							if (data && data.length > 0) {
								let wqsPrice = data[0].p;
								if (parseFloat(wqsPrice) < this.price) {
									this.appendWqsPrice(wqsPrice)
								}
							}
						}
					}
				})
			}
		},
		getCompanyPrice: function() {
			let id = this.skuid();
			if (id > 0) {
				GM_xmlhttpRequest({
					method: "get",
					url: this.apiUrl.pcPriceUrl + "?ext=000000001&pin=zyqyg&skuids=J_" + id,
					onload: resp => {
						if (resp.readyState == 4 && resp.status == 200) {
							let data = JSON.parse(resp.responseText);
							if (data && data.length > 0) {
								let qy = data[0];
								if (qy.epp != undefined && qy.epp) {
									if (qy.up != undefined && qy.up == 'epp') {
										this.appendCompanyPrice(qy.epp)
									}
								}
							}
						}
					}
				})
			}
		},
		getRealStock: function() {
			let id = this.skuid(), area = this.getArea(), fts_area = area.replace(/\_/g, ',');
			if (id > 0) {
				GM_xmlhttpRequest({
					method: "get",
					headers: {
						"content-type": "application/json;charset=UTF-8",
						"referer": "https://cart.jd.com/cart.action"
					},
					url: this.apiUrl.stockUrl + "?ch=1&skuNum=" + id + ",1;&area=" + fts_area + "&callback=",
					onload: resp => {
						if (resp.readyState == 4 && resp.status == 200) {
							if (resp.responseText != undefined && resp.responseText.indexOf("html") < 0) {
								let text = resp.responseText.replace(/\(/g, "").replace(/\)/g, "");
								let json = JSON.parse(text);
								if (json) {
									let stock = json[id].c == '-1' ? '5+' : parseInt(json[id].c);
									let status = parseInt(json[id].a);
									if (stock && status != 34) {
										this.appendStock(stock)
									}
								}
							} else {
								console.log('查询京东库存失败！')
							}
						}
					}
				})
			}
		},
		apiUrl: {
			domainApi: domain + "/api/plugin/monkey",
			commssionApiUrl: domain + "/api/plugin/get_jd_commssion",
			pcPriceUrl: "https://p.3.cn/prices/mgets",
			wqsPriceUrl: "https://pe.3.cn/prices/mgets",
			stockUrl: "https://fts.jd.com/areaStockState/mget",
		},
		reader: function() {
			GM_xmlhttpRequest({
				method: "post",
				url: this.apiUrl.domainApi,
				data: JSON.stringify({
					key: 'jd',
					version: gm_info.version,
					uuid: gm_info.uuid
				}),
				onload: resp => {
					if (resp.readyState == 4 && resp.status == 200 && resp.responseText != undefined) {
						let res = JSON.parse(resp.responseText);
						let data = res.data;
						if (data.status == true) {
							let cssUrl = domain + "/monkey/css/v1/static.css?v=" + data.csv;
							GM_xmlhttpRequest({
								method: "get",
								url: cssUrl,
								onload: res => {
									if (res.readyState == 4 && res.status == 200 && res.responseText != undefined) {
										this.appendCss(cssUrl);
										if (this.compareVersion(gm_info.version, data.minVersion) < 0) {
											console.log('此版本已下架了，请到官网下载最新版使用！下载地址：' + domain + '/plugin?from=monkey_jd')
										} else {
											this.init()
										}
									}
								}
							})
						}
					}
				}
			})
		},
		config: function() {
			if (typeof pageConfig != "undefined") {
				return pageConfig.product
			} else if (typeof window._itemOnly != 'undefined') {
				return window._itemOnly.item
			} else {
				return false
			}
		},
		getArea: function() {
			var a = this.getCookie("ipLoc-djd");
			if (a) {
				a = a.replace(/-/g, "_").split('.')[0]
			}
			return a ? a : 1
		},
		skuid: function() {
			let url = this.itemUrl();
			let id = 0;
			if (url.indexOf("wareId") > -1) {
				let match = url.match(/wareId=([0-9]+)/i);
				if (match) {
					id = match[1]
				}
			} else if (url.indexOf("sku") > -1) {
				let match = url.match(/sku=([0-9]+)/i);
				if (match) {
					id = match[1]
				}
			} else {
				let match = url.match(/([0-9]+).html/i);
				if (match) {
					id = match[1]
				}
			}
			return id
		},
		itemUrl: function() {
			let url = $("link[rel=canonical]").attr("href");
			if (!url) {
				url = window.location.href
			} else {
				if (url.indexOf("http") < 0) {
					url = "https:" + url
				}
			}
			return url
		},
		getCookie: function(a) {
			let arr = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
			if (arr != null) return unescape(arr[2]);
			return false
		},
		compareVersion: function(c, d) {
			let arr1 = c.split('.'), arr2 = d.split('.');
			let length1 = arr1.length, length2 = arr2.length;
			let minlength = Math.min(length1, length2);
			let i = 0;
			for (i; i < minlength; i++) {
				let a = parseInt(arr1[i]);
				let b = parseInt(arr2[i]);
				if (a > b) {
					return 1
				} else if (a < b) {
					return -1
				}
			}
			if (length1 > length2) {
				for (let j = i; j < length1; j++) {
					if (parseInt(arr1[j]) != 0) {
						return 1
					}
				}
				return 0
			} else if (length1 < length2) {
				for (let j = i; j < length2; j++) {
					if (parseInt(arr2[j]) != 0) {
						return -1
					}
				}
				return 0
			}
			return 0
		},
		isMobile: function() {
			if ($("meta[name='viewport']").length > 0) {
				return true
			}
			let userAgent = navigator.userAgent || "";
			userAgent = userAgent.toUpperCase();
			if (userAgent == "" || userAgent.indexOf("PAD") > -1) {
				return false
			}
			if (/MOBILE/.test(userAgent) && /(MICROMESSENGER|QQ\/)/.test(userAgent)) {
				return true
			}
			let mobilePhoneList = ["IOS", "IPHONE", "ANDROID", "WINDOWS PHONE"];
			for (var i = 0, len = mobilePhoneList.length; i < len; i++) {
				if (userAgent.indexOf(mobilePhoneList[i]) > -1) {
					return true;
					break
				}
			}
			return false
		},
		appendCss: function(a) {
			let obj = "";
			if (a.indexOf(".js") > -1) {
				obj = document.createElement('script');
				obj.setAttribute("type", "text/javascript");
				obj.setAttribute("charset", "utf-8");
				obj.setAttribute("src", a)
			} else {
				obj = document.createElement("link");
				obj.setAttribute("charset", "utf-8");
				obj.setAttribute("type", "text/css");
				obj.setAttribute("rel", "stylesheet");
				obj.setAttribute("href", a)
			}
			if (obj != "") {
				document.getElementsByTagName("head")[0].appendChild(obj)
			}
		}
	};
	let jt = function() {
		jtzs.reader();
		return jtzs
	};
	return new jt()
})();