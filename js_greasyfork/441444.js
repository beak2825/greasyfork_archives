// ==UserScript==
// @name         确幸小屋，尽量帮你省钱！
// @version      0.0.1
// @description  支持京东、淘宝无感知秒领券省钱，还会有更多省钱小功能
// @author        ZhangChenXi
// @run-       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://*.taobao.com/*
// @match        *://*.taobao.hk/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.liangxinyao.com/*
// @match             *://*.yiyaojd.com/*
// @exclude       *://login.taobao.com/*
// @exclude       *://pages.tmall.com/*
// @exclude       *://uland.taobao.com/*
// @license      MIT
// @namespace   https://rich.6s9s.cn
// @connect rich.6s9s.cn
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @original-author tuChanged
// @original-license MIT
// @antifeature referral-link 内部隐藏优惠卷
// @downloadURL https://update.greasyfork.org/scripts/441444/%E7%A1%AE%E5%B9%B8%E5%B0%8F%E5%B1%8B%EF%BC%8C%E5%B0%BD%E9%87%8F%E5%B8%AE%E4%BD%A0%E7%9C%81%E9%92%B1%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441444/%E7%A1%AE%E5%B9%B8%E5%B0%8F%E5%B1%8B%EF%BC%8C%E5%B0%BD%E9%87%8F%E5%B8%AE%E4%BD%A0%E7%9C%81%E9%92%B1%EF%BC%81.meta.js
// ==/UserScript==
/*jshint esversion:6 */
var obj = {};
var index_num = 0;

	var item = [];
	var urls = [];
	var selectorList = [];

	obj.onclicks = function(link) {

		if (document.getElementById('redirect_form')) {
			var form = document.getElementById('redirect_form');
			form.action = 'https://rich.6s9s.cn/index.php/v1/Changeurl/getVouchers?content=' + encodeURIComponent(link);
		} else {
			var form = document.createElement('form');
			form.action = 'https://rich.6s9s.cn/index.php/v1/Changeurl/getVouchers?content=' + encodeURIComponent(link);
			form.target = '_blank';

			form.method = 'POST';
			form.setAttribute("id", 'redirect_form');
			document.body.appendChild(form);

		}

		form.submit();
		form.action = "";
		form.parentNode.removeChild(form);
	};

	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	obj.get_url = function() {
		item[index_num] = [];
		urls[index_num] = [];
		$("#J_goodsList li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})

		$("#plist li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).find('.j-sku-item').attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})

		$(".m-aside .aside-bar li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var sku_c = $(this).attr('sku_c');
						if (sku_c == undefined) {
							var arr = [];
							var str = $(this).attr('onclick');
							arr = str.split(",");
							sku_c = trim(arr[6].replace(/\"/g, ""));
							itemurl = '//item.jd.com/' + sku_c + '.html';
						}

					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}



				}
			}

		})
		$(".goods-chosen-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';

					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}

				}




			}

		})

		$(".may-like-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';
					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})
		index_num += 1;
	};

	obj.get_miaosha = function() {
		item[index_num] = [];
		urls[index_num] = [];
		$(".seckill_mod_goodslist li").each(function(index) {

			if ($(this).attr('data-type') != 'yes') {

				var itemurl = $(this).find("a").attr('href');
				var skuid = $(this).attr('data-sku');
				var that = $(this);
				if (itemurl != '') {
					if (urls[index_num].length < 4) {

						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})


		index_num += 1;
	};

obj.GetQueryString = function(name) {
		var reg = eval("/" + name + "/g");
		var r = window.location.search.substr(1);
		var flag = reg.test(r);
		if (flag) {
			return true;
		} else {
			return false;
		}
	};


obj.initSearchHtml = function(selectorList) {
			setInterval(function() {
				selectorList.forEach(function(selector) {
					obj.initSearchItemSelector(selector);
				});
			}, 3000);
		};

		obj.initSearchEvent = function() {
			$(document).on("click", ".tb-cool-box-area", function() {
				var $this = $(this);
				if ($this.hasClass("tb-cool-box-wait")) {
					obj.basicQueryItem(this);
				} else if ($this.hasClass("tb-cool-box-info-translucent")) {
					$this.removeClass("tb-cool-box-info-translucent");
				} else {
					$this.addClass("tb-cool-box-info-translucent");
				}
			});
		};

		obj.basicQuery = function() {
			setInterval(function() {
				$(".tb-cool-box-wait").each(function() {
					obj.basicQueryItem(this);
				});
			}, 3000);
		};

		obj.initSearchItemSelector = function(selector) {
			$(selector).each(function() {
				obj.initSearchItem(this);
			});
		};

		obj.initSearchItem = function(selector) {
			var $this = $(selector);
			if ($this.hasClass("tb-cool-box-already")) {
				return;
			} else {
				$this.addClass("tb-cool-box-already")
			}

			var nid = $this.attr("data-id");
			if (!obj.isVailidItemId(nid)) {
				nid = $this.attr("data-itemid");
			}

			if (!obj.isVailidItemId(nid)) {
				if ($this.attr("href")) {
					nid = location.protocol + $this.attr("href");
				} else {
					var $a = $this.find("a");
					if (!$a.length) {
						return;
					}

					nid = $a.attr("data-nid");
					if (!obj.isVailidItemId(nid)) {
						if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
							nid = location.protocol + $($a[1]).attr("href");
						} else {
							nid = location.protocol + $a.attr("href");
						}
					}
				}
			}

			if (obj.isValidNid(nid)) {
				obj.basicQueryItem($this, nid);
			}
		};



		obj.basicQueryItem = function(selector, nid) {
			var $this = $(selector);

			$.get('https://rich.6s9s.cn/index.php/v1/Changeurl/getTaobao?goodsid=' + nid, function(data) {

				if (data.type == 'success') {
					obj.changeUrl($this, data.data);
				} else {

				}
			}, 'json')
		};

		obj.changeUrl = function(selector, data) {
			var $this = $(selector);
			var a = $this.find("a");
			$this.find("a").attr('href', data.itemUrl);
			$this.find("a").attr('data-href', data.itemUrl);
			$this.find("a").click(function(e){
							   e.preventDefault();
		            				 obj.onclicks($(this).attr('data-href'));
							})
		}


		obj.isDetailPageTaoBao = function(url) {
			if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 ||
				url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf(
					"//detail.tmall.hk/hk/item.htm") > 0) {
				return true;
			} else {
				return false;
			}
		};

		obj.isVailidItemId = function(itemId) {
			if (!itemId) {
				return false;
			}

			var itemIdInt = parseInt(itemId);
			if (itemIdInt == itemId && itemId > 10000) {
				return true;
			} else {
				return false;
			}
		};

		obj.isValidNid = function(nid) {
			if (!nid) {
				return false;
			} else if (nid.indexOf('http') >= 0) {
				if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		};
obj.get_page_url_id = function(pagetype, url, type) {
		var return_data = '';

		if (pagetype == 'taobao_item') {

			var params = location.search.split("?")[1].split("&");
			for (var index in params) {
				if (params[index].split("=")[0] == "id") {
					var productId = params[index].split("=")[1];
				}
			}
            if(window.location.href.indexOf("mm_")==-1){
                runAsync('https://rich.6s9s.cn/index.php/v1/Changeurl/getTaobao?goodsid=' + productId);
            }
            
		}
		return return_data;
	};
					obj.get_type_url = function(url) {
						if (
							url.indexOf("//item.taobao.com/item.htm") > 0 ||
							url.indexOf("//detail.tmall.com/item.htm") > 0 ||
							url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
							url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
							url.indexOf("//world.tmall.com") > 0 ||
							url.indexOf("//detail.liangxinyao.com/item.htm") > 0 ||
							url.indexOf("//detail.tmall.hk/item.htm") > 0
						) {
							return 'taobao_item';
						} else if (
							url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0 ||
							url.indexOf("//list.tmall.com/search_product.htm") > 0 ||
							url.indexOf("//s.taobao.com/search") > 0 ||
							url.indexOf("//list.tmall.hk/search_product.htm") > 0
						) {
							return 'taobao_list';
						} else if (
							url.indexOf("//search.jd.com/Search") > 0 ||
							url.indexOf("//search.jd.com/search") > 0 ||
							url.indexOf("//search.jd.hk/search") > 0 ||
							url.indexOf("//search.jd.hk/Search") > 0 ||
							url.indexOf("//www.jd.com/xinkuan") > 0 ||
							url.indexOf("//list.jd.com/list.html") > 0 ||
							url.indexOf("//search.jd.hk/Search") > 0 ||
							url.indexOf("//coll.jd.com") > 0
						) {
							return 'jd_list';
						} else if (
							url.indexOf("//item.jd.hk") > 0 ||
							url.indexOf("//pcitem.jd.hk") > 0 ||
							url.indexOf("//i-item.jd.com") > 0 ||
							url.indexOf("//item.jd.com") > 0 ||
							url.indexOf("//npcitem.jd.hk") > 0 ||
 url.indexOf("//item.yiyaojd.com") > 0
						) {
							return 'jd_item';
						} else if (
							url.indexOf("//miaosha.jd.com") > 0
						) {
							return 'jd_miaosha';
						} else if (
							url.indexOf("//www.jd.com") > 0 ||
							url.indexOf("//jd.com") > 0
						) {
							return 'jd_index';
						}

					}
					var pageurl = location.href;
					var pagetype = obj.get_type_url(pageurl);


					if (pagetype == 'taobao_item') {
								var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);
								
								var couponurl = "https://rich.6s9s.cn/index.php/v1/Changeurl/getTaobao?goodsid=" + encodeURIComponent(location.href) +
									'&itemid=' +
									productId;

					} else if (pagetype == 'jd_item') {
							'&itemid=' + productId;
							if(window.location.href.indexOf("utm_source")==-1){
								runAsync('https://rich.6s9s.cn/index.php/v1/Changeurl/getVouchers?type=1&content=' + window.location.href);
							}
// 限制推广位
							// if (!obj.GetQueryString('kong')) {
							// 	runAsync('https://rich.6s9s.cn/index.php/v1/Changeurl/getVouchers?content=' + window.location.href);
							// }



					} else if (pagetype == 'jd_list') {
						setInterval(obj.get_url, 300);

					} else if (pagetype == 'jd_miaosha') {
						$(".seckill_mod_goodslist li").find("a").click(function(e) {
							if ($(this).attr('data-ref')) {
								e.preventDefault();
								obj.onclicks($(this).attr('data-ref'));
							}
						})

						setInterval(obj.get_miaosha, 300);

					} else if(pagetype == 'taobao_list'){
                        
						var url = location.href;

						if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0) {
							selectorList.push(".items .item");
						} else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
							selectorList.push(".product");
							selectorList.push(".chaoshi-recommend-list .chaoshi-recommend-item");
						} else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
							selectorList.push("#J_ItemList .product");
						} else if (document.getElementById('J_ShopSearchResult')) {
							selectorList.push("#J_ShopSearchResult .item");
						}
						if (selectorList && selectorList.length > 0) {
							obj.initSearchHtml(selectorList);
						}

                 }
                 function runAsync(url_text){
                    GM_xmlhttpRequest({
                    method: "GET",
                    url: url_text,
                    data:"",
                     headers: {
                          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                     },
                    onload: function(response) {
                        isChange(response.responseText);
                    }
                    });
                }
                function isChange(result_text) {
                    if(result_text!=-1){
                        window.location.href = result_text;
                    }
                }