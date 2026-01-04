// ==UserScript==
// @name              (最新完美版)百度网盘下载助手
// @namespace         jh.idey.cn
// @version           6.1.9
// @author            免费王子
// @description       【最新完美版】百度网盘下载，IDM,Aria2,Motrix，无需SVIP满速下载.淘宝·京东优惠劵查询。
// @match      *://item.taobao.com/*
// @match             *://yun.baidu.com/share/*
// @match      *://*detail.tmall.com/*
// @match             *://pan.baidu.com/share/*
// @match      *://*detail.tmall.hk/*
// @match      *://*.jkcsjd.com/*
// @match        *://*.taobao.com/*
// @match             *://yun.baidu.com/s/*
// @match        *://*.tmall.com/*
// @match             *://pan.baidu.com/s/*
// @match        *://*.tmall.hk/*
// @match             *://yun.baidu.com/disk/home*
// @match      *://*.liangxinyao.com/*
// @match             *://pan.baidu.com/disk/home*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match    *://*.yiyaojd.com/*
// @match        *://*.liangxinyao.com/*
// @exclude       *://login.taobao.com/*
// @exclude       *://pages.tmall.com/*
// @exclude       *://uland.taobao.com
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require         https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require 	https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @connect     	  azkou.cn
// @connect     	  idey.cn
// @connect     	  localhost
// @connect           baidu.com
// @connect           *
// @run-at            document-body
// @connect           baidupcs.com
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_cookie
// @license           AGPL
// @antifeature referral-link 内部隐藏优惠卷
// @antifeature  membership
// @downloadURL https://update.greasyfork.org/scripts/449564/%28%E6%9C%80%E6%96%B0%E5%AE%8C%E7%BE%8E%E7%89%88%29%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449564/%28%E6%9C%80%E6%96%B0%E5%AE%8C%E7%BE%8E%E7%89%88%29%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var html = '';

	let conf = {},tools = {};
	var uw = unsafeWindow,doc = document;
	var index_num = 0;
	var item = [];
	var urls = [];
	var selectorList = [];
	var obj = {};
	var userinfo={};
	var apihost='';
    var userkey='';
	var hosturl='https://jd.idey.cn/red.html?url=';
	var hostdom="jd.idey.cn";

	//--------------------公共方法----------------------//
	const headerPost = async (url, data, headers, type) => {
		return new Promise((resolve, reject) => {
			let option = {
				method: "POST",
				url: url,
				headers: headers,
				data: data,
				responseType: type || 'json',
				onload: (res) => {
					type === 'blob' ? resolve(res) : resolve(res.response || res
						.responseText);
				},
				onerror: (err) => {
					reject(err);
				},
			}
			try {
				let req = GM_xmlhttpRequest(option);
			} catch (error) {
				console.error(error);
			}
		});
	};
	const headerGet = async (url, headers, type, extra) => {
		return new Promise((resolve, reject) => {
			let req = GM_xmlhttpRequest({
				method: "GET",
				url,
				headers,
				responseType: type || 'json',
				onload: (res) => {
					if (res.status === 204) {
						req.abort();
						idm[extra.index] = true;
					}
					if (type === 'blob') {
						baiduTools.openIdm(res.response, extra
							.filename);
						console.log('调用');
						resolve(res);
					} else {
						resolve(res.response || res.responseText);
					}
				},
				onprogress: (res) => {
					if (extra && extra.filename && extra.index) {
						res.total > 0 ? progress[extra.index] = (res.loaded * 100 /
							res.total).toFixed(2) : progress[extra.index] = 0.00;
					}
				},
				onloadstart() {
					extra && extra.filename && extra.index && (request[extra.index] =
						req);
				},
				onerror: (err) => {
					reject(err);
				},
			});

		});
	};
	const hGet = function(url) {
		let res = null;
		$.ajaxSettings.async = false;
		$.getJSON(url, function(result) {
			res = result;
		});
		$.ajaxSettings.async = true;
		return res;
	}

	function down() {
		flag = true;
		var touch;
		if (event.touches) {
			touch = event.touches[0];
		} else {
			touch = event;
		}
		cur.x = touch.clientX;
		cur.y = touch.clientY;
		dx = div2.offsetLeft;
		dy = div2.offsetTop;
	}

	

	
	

	obj.onclicks = function(link) {
		if (document.getElementById('redirect_form')) {
			var form = document.getElementById('redirect_form');
			form.action =hosturl+ encodeURIComponent(link);
		} else {
			var form = document.createElement('form');
			form.action = hosturl+ encodeURIComponent(link);
			form.target = '_blank';

			form.method = 'POST';
			form.setAttribute("id", 'redirect_form');
			document.body.appendChild(form);

		}
		form.submit();
		form.action = "";
		form.parentNode.removeChild(form);
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



		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


			var u = urls[index_num].join(',');
			$.getJSON('https://s.idey.cn/jd.php', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('target', '');
						item[res.num][i].find("a").unbind("click");
						item[res.num][i].find("a").bind("click", function(e) {
							if ($(this).attr('data-ref')) {
								e.preventDefault();
								obj.onclicks($(this).attr('data-ref'));

							}
						})

					}

				}
			})


		}
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



		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


			var u = urls[index_num].join(',');
			$.getJSON('https://s.idey.cn/jd.php', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('href', "javascript:void(0);");
						item[res.num][i].find("a").attr('target', '');
						//	item[res.num][i].find("a").unbind("click");

						item[res.num][i].find("a").click(function(e) {
							e.preventDefault();
							obj.onclicks($(this).attr('data-ref'));
						})

					}

				}
			})


		}
		index_num += 1;
	};
	var domhtml = $(`<div class='downbox'>
		    <div class='item_text'>
		        <div class="box"><a id="down">文库下载</a></div></div></div>`);
	const style =
		`
  			.gwd_taobao .gwd-minibar-bg, .gwd_tmall .gwd-minibar-bg {
  			    display: block;
  			}

  			.idey-minibar_bg{
  			    position: relative;
  			    min-height: 40px;
  			    display: inline-block;
  			}
  			#idey_minibar{
  			    width: 525px;
  			    background-color: #fff;
  			    position: relative;
  			    border: 1px solid #e8e8e8;
  			    display: block;
  			    line-height: 36px;
  			    font-family: 'Microsoft YaHei',Arial,SimSun!important;
  			    height: 36px;
  			    float: left;
  			}
  			#idey_minibar .idey_website {
  			    width: 48px;
  			    float: left;
  			    height: 36px;
  			}
  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    text-align: center;
  			}

  			#idey_minibar .idey_website em {
  			    background-position: -10px -28px;
  			    height: 36px;
  			    width: 25px;
  			    float: left;
  			    margin-left: 12px;
  			}

  			.setting-bg {
  			    background: url(https://cdn.gwdang.com/images/extensions/xbt/new_wishlist_pg5_2.png) no-repeat;
  			}

  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    width: 134px;
  			}
  			#idey_price_history span {
  			    float: left;
  			    width: 100%;
  			    text-align: center;
  			    line-height: 36px;
  			    color: #666;
  			    font-size: 14px;
  			}

  			#mini_price_history .trend-error-info-mini {
  			    position: absolute;
  			    top: 37px;
  			    left: 0px;
  			    width: 100%;
  			    background: #fff;
  			    z-index: 99999999;
  			    height: 268px;
  			    box-shadow: 0px 5px 15px 0 rgb(23 25 27 / 15%);
  			    border-radius: 0 0 4px 4px;
  			    width:559px;
  			    border: 1px solid #ddd;
  			    border-top: none;
  				display:none;

  			}
  			.minibar-btn-box {
  			    display: inline-block;
  			    margin: 0 auto;
  			    float: none;
  			}
  			#mini_price_history .error-p {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			 #mini_price_history:hover .trend-error-info-mini {
  			      display: block;
  			    }

  			.collect_mailout_icon {
  			    background-position: -247px -134px;
  			    width: 18px;
  			}

  			#idey_mini_compare_detail li *, .mini-compare-icon, .minibar-btn-box * {
  			    float: left;
  			}
  			.panel-wrap{
  				width: 100%;
  				height: 100%;
  			}
  			.collect_mailout_icon, .mini-compare-icon {
  			    height: 18px;
  			    margin-right: 8px;
  			    margin-top: 9px;
  			}
  			.all-products ul li {
  			    float: left;
  			    width: 138px;
  			    height: 262px;
  			    overflow: hidden;
  			    text-align: center;
  			}
  			.all-products ul li .small-img {
  			    text-align: center;
  			    display: table-cell;
  			    vertical-align: middle;
  			    line-height: 90px;
  			    width: 100%;
  			    height: 100px;
  			    position: relative;
  			    float: left;
  			    margin-top: 23px;
  			}
  			.all-products ul li a img {
  			    vertical-align: middle;
  			    display: inline-block;
  			    width: auto;
  			    height: auto;
  			    max-height: 100px;
  			    max-width: 100px;
  			    float: none;
  			}
  			.all-products ul li a.b2c-other-info {
  			    text-align: center;
  			    float: left;
  			    height: 16px;
  			    line-height: 16px;
  			    margin-top: 13px;
  			}

  			.b2c-other-info .gwd-price {
  			    height: 17px;
  			    line-height: 17px;
  			    font-size: 16px;
  			    color: #E4393C;
  			    font-weight: 700;
  				width: 100%;
  				display: block;
  			}
  			.b2c-other-info .b2c-tle {
  			    height: 38px;
  			    line-height: 19px;
  			    margin-top: 8px;
  			    font-size: 12px;
  			    width: 138px;
  			    margin-left: 29px;
  			}
  			 .bjgext-mini-trend span {
  			      float: left;
  			      /*width: 100%;*/
  			      text-align: center;
  			      line-height: 36px;
  			      color: #666;
  			      font-size: 14px;
  			    }
  			    .bjgext-mini-trend .trend-error-info-mini {
  			      position: absolute;
  			      top: 37px;
  			      left: 0px;
  			      width: 100%;
  			      background: #fff;
  			      z-index: 99999999;
  			      height: 268px;
  			      display: none;
  			      box-shadow: 0px 5px 15px 0 rgba(23,25,27,0.15);
  			      border-radius: 0 0 4px 4px;
  			      width: 460px;
  			      border: 1px solid #ddd;
  			      border-top: none;
  			    }
  			    .bjgext-mini-trend .error-p {
  			      width: 100%;
  			      float: left;
  			      text-align: center;
  			      margin-top: 45px;
  			      font-size: 14px;
  			      color: #666;
  			    }
  			    .bjgext-mini-trend .error-sp {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			    .bjgext-mini-trend:hover .trend-error-info-mini {
  			      display: block;
  			    }


  			    #coupon_box.coupon-box1 {
  			      width: 525px;
  			      height: 125px;
  			      background-color: #fff;
  			      border: 1px solid #e8e8e8;
  			      border-top: none;
  			      position: relative;
  			      margin: 0px;
  			      padding: 0px;
  			      float: left;
  			      display: block;
  			    }
  			    #coupon_box:after {
  			      display: block;
  			      content: "";
  			      clear: both;
  			    }
  			    .idey_tmall #idey_minibar {
  			      float: none;
  			    }


  			    .minicoupon_detail {
  			      position: absolute;
  			      top: 35px;
  			      right: -1px;
  			      height: 150px;
  			      width: 132px;
  			      display: none;
  			      z-index: 99999999999;
  			      background: #FFF7F8;
  			      border: 1px solid #F95774;
  			    }
  			    #coupon_box:hover .minicoupon_detail {
  			      display: block;
  			    }
  			    .minicoupon_detail img {
  			      width: 114px;
  			      height: 114px;
  			      float: left;
  			      margin-left: 9px;
  			      margin-top: 9px;
  			    }
  			    .minicoupon_detail span {
  			      font-size: 14px;
  			      color: #F95572;
  			      letter-spacing: 0;
  			      font-weight: bold;
  			      float: left;
  			      height: 12px;
  			      line-height: 14px;
  			      width: 100%;
  			      margin-top: 6px;
  			      text-align: center;
  			    }
  			    .coupon-box1 * {
  			      font-family: 'Microsoft YaHei',Arial,SimSun;
  			    }
  			    .coupon-icon {
  			      float: left;
  			      width: 20px;
  			      height: 20px;
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_icon.png') 0px 0px no-repeat;
  			      margin: 50px 8px 9px 12px;
  			    }
  			    #coupon_box .coupon-tle {
  			      color: #FF3B5C;
  			      font-size: 24px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 114px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 375px;
  			      line-height: 114px;
  			      text-decoration: none!important;
  			    }
  			    #coupon_box .coupon-row{
  			         color: #FF3B5C;
  			      font-size: 12px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 60px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 100%;
  			      line-height: 60px;
  			      text-decoration: none!important;
  			        text-align: center;
  			    }
  			    #coupon_box .coupon-tle * {
  			      color: #f15672;
  			    }
  			    #coupon_box .coupon-tle span {
  			      margin-right: 5px;
  			      font-weight: bold;
  			      font-size: 14px;
  			    }
  			    .coupon_gif {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/turn.gif') 0px 0px no-repeat;
  			      float: right;
  			      height: 20px;
  			      width: 56px;
  			      margin-top: 49px;
  			    }
  			    .click2get {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_01.png') 0px 0px no-repeat;
  			      float: left;
  			      height: 30px;
  			      width: 96px;
  			      margin-top: 43px;
  			    }
  			    .click2get span {
  			      height: 24px;
  			      float: left;
  			      margin-left: 1px;
  			    }
  			    .c2g-sp1 {
  			      width: 50px;
  			      color: #FF3B5C;
  			      text-align: center;
  			      font-size: 14px;
  			      line-height: 24px!important;
  			    }
  			    .c2g-sp2 {
  			      width: 44px;
  			      line-height: 24px!important;
  			      color: #fff!important;
  			      text-align: center;
  			    }
  			    div#idey_wishlist_div.idey_wishlist_div {
  			      border-bottom-right-radius: 0px;
  			      border-bottom-left-radius: 0px;
  			    }
  			    #qrcode{
  			         float: left;
  			        width: 125px;
  			        margin-top:3px;
  			    }


  			    .elm_box{
  			        height: 37px;
  			     border: 1px solid #ddd;
  			     width: 460px;
  			     line-height: 37px;
  			     margin-bottom: 3px;
  			         background-color: #ff0036;
  			             font-size: 15px;
  			    }
  			    .elm_box span{
  			            width: 342px;
  			    text-align: center;
  			    display: block;
  			    float: left;
  			    color: red;
  			    color: white;
  			    }`


	const stylecss =
		`.downbox {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
    .downbox a{cursor:pointer;}
			.downbox .box { position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: deepskyblue;}
  			`

	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	function removeEvent(that, href) {
		that.find("a").attr('target', '');
		that.find("a").unbind("click");
		that.find("a").bind("click", function(e) {
			e.preventDefault();
			if (href != undefined) {
				obj.onclicks(href);
			} else {
				obj.onclicks($(this).attr('href'));
			}

		})
	}
	obj.initStyle = function() {
		var styles = document.createElement('style')
		styles.type = 'text/css'
		styles.innerHTML = style;
		document.getElementsByTagName('head').item(0).appendChild(styles)
	}


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
		$.get('https://s.idey.cn/tb.php?act=recovelink&itemid=' + nid, function(data) {
			if (data.type == 'success') {
				var vhtml =
					'<div style="position: absolute;top: 18px;right: 5px;"><a href="javascript:void(0);" style="padding:10px;border-radius: 15px;background-color:#f40;color:#FFF;text-decoration:none;" >有劵(' +
					data.data + ')</a></div>';
				$this.find('.pic-box .pic-box-inner').append(vhtml);
				//obj.changeUrl($this, data.data);
			} else {
				var vhtml =
					'<div style="position: absolute;top: 18px;right: 5px;opacity:0.33" ><a href="javascript:void(0);" style="padding:10px;border-radius: 15px;background-color:#ccc;text-decoration:none;" >暂无优惠劵</a></div>';
				$this.find('.pic-box .pic-box-inner').append(vhtml);
			}
		}, 'json')
	};

	obj.changeUrl = function(selector, data) {

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
			return_data = productId;
		}
		return return_data;
	}

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
			url.indexOf("//item.yiyaojd.com") > 0 ||
			url.indexOf("//item.jkcsjd.com") > 0
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
		} else if (
			url.indexOf("//pan.baidu.com") > 0 ||
			url.indexOf("//yun.baidu.com") > 0
		) {
			return 'baidu_disk';
		}

	}

	var pageurl = location.href;
	var pagetype = obj.get_type_url(pageurl);
	$.getJSON("https://s.idey.cn/api.php", function(res) {
		hosturl=res.hosturl;
		hostdom=res.hostdom;
	})
	if (pagetype == 'taobao_item') {
		var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);
		if (productId) {
			if (!obj.GetQueryString('mm_')) {
				$.getJSON("https://tbao.idey.cn/tbs.php?act=redlink&itemid=" + productId, function(res) {
					var data = res.data;
					if (data) {
						window.location.href = data.itemUrl;
					}
				})
			}
		}

		obj.initStyle(style);
		//	var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);
		var couponurl = "https://s.idey.cn/tb.php?act=item&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' +
			productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://taobao.idey.cn">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1">当前价:<span style="color:red" id="now_price">加载中...</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">最低价：<span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
				if (data.couponAmount > 0) {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" href="https://www.zbhui.cn/coupon.php?itemurl=' +
						encodeURIComponent(location.href) + '&itemid='+productId+'">';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
						'元</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
						'</span><span class="c2g-sp2">领取</span></div>';
					couponArea += '</a>';
				}

			} else {
				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';
				couponArea += '</a>';
			}


			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}

			if (location.href.indexOf("//detail.tmall") != -1) {
				$(".tm-fcs-panel").after(couponArea);
			} else {
				$("ul.tb-meta").after(couponArea);
			}
			if (data.item_link.originalPrice) {
				$("#now_price").html('¥' + data.item_link.originalPrice);
			}
			if (data.item_link.actualPrice) {
				$("#coupon_price").html('¥' + data.item_link.actualPrice);
			}
			if (res.type == 'error' && data.item_link.itemUrl) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 110,
					height: 110,
					text: data.item_link.itemUrl
				});
			} else {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 110,
					height: 110,
					text: data.item_link.pageurl
				});
			}


		});

	} else if (pagetype == 'jd_item') {
		obj.initStyle(style);
		var productId = /(\d+)\.html/.exec(window.location.href)[1];
		var couponurl = "https://s.idey.cn/jd.php?act=recovelink&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' + productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;
			if (!obj.GetQueryString(hostdom) && data) {
				window.location.href = hosturl + encodeURIComponent(data);
			}

		});
		var couponurls = "https://s.idey.cn/jd.php?act=item&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' + productId;

		$.getJSON(couponurls, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://www.idey.cn">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1">当前价:<span style="color:red" id="now_price">加载中...</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">最低价：<span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
				if (data.couponLinkType == 1) {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" href="' + data.couponLink + '">';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
						'元</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
						'</span><span class="c2g-sp2">领取</span></div>';
					couponArea += '</a>';
				} else {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" >';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>立减' + data.couponAmount +
						'元(京东扫码领取)</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div id="qrcode"></div>';
					couponArea += '</a>';
				}

			} else {

				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';

				couponArea += '</a>';


			}

			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}

			$(".summary-price-wrap").after(couponArea);

			if (data.couponLink) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.couponLink
				});

			} else if (data.item_link.shortUrl) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.shortUrl
				});
			} else {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.longUrl
				});
			}
			if (data.item_link.originalPrice) {
				$("#now_price").html('¥' + data.item_link.originalPrice);
			}
			if (data.item_link.actualPrice) {
				$("#coupon_price").html('¥' + data.item_link.actualPrice);
			}
		});

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

	} else if (pagetype == 'taobao_list') {
		/*var url = location.href;
		if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0) {
		    selectorList.push(".items .item");
		}
		else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
		    selectorList.push(".product");
		    selectorList.push(".chaoshi-recommend-list .chaoshi-recommend-item");
		}
		else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
		    selectorList.push("#J_ItemList .product");
		} else if (document.getElementById('J_ShopSearchResult')) {
		    selectorList.push("#J_ShopSearchResult .item");
		}
		if (selectorList && selectorList.length > 0) {
		    obj.initSearchHtml(selectorList);
		}*/

	} else if (pagetype == 'baidu_disk') {
		var isHome = '',
			downType = '',
			file = '',
			request = {},
			baiduPan = {},
			baiduTools = {},
			idm = {},
			ins = {},
			ua='',
			rest = '',
			version='',
			vername='',
			vtk='',
			vtoken='',
			progress = {},
			config = {
				"pcs": {
					"0": "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1",
					"1": "https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528",
					"2": "https://pan.baidu.com/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0",
					"3": "https://pan.baidu.com/share/wxlist?clienttype=25"
				},
				"api": {
					"0": "Idm下载,满速下载",
					"1": "点击复制链接到IDM,UA设置为:<span style=\"color:#09AAFF\" id=\"uaset\"></span>,如有问题请 <a href=\"http://inews.gtimg.com/newsapp_bt/0/15169367723/641\" target=\"_blank\">关注软件代码公众号反馈</a>。"
				},
				"aria": {
					"0": "Aria下载（适用于XDown 及Linux Shell命令行）",
                    "1": "点击复制链接到支持 aria2c 协议的下载器中,UA设置为:<span style=\"color:#09AAFF\" id=\"uaset\"></span>,如有问题请 <a href=\"http://inews.gtimg.com/newsapp_bt/0/15169367723/641\" target=\"_blank\">关注软件代码公众号反馈</a>。"
				},
				"rpc": {
					"0": "RPC下载（适用于 Motrix，Aria2 ToolsAriaNgGUI）",
					"1": "点击按钮发送链接至本地或远程 RPC 服务，如有问题请 <a href=\"http://inews.gtimg.com/newsapp_bt/0/15169367723/641\" target=\"_blank\">关注软件代码公众号反馈</a>。"
				}

			};
		let share = {
			sign: "",
			timestamp: "",
			bdstoken: "",
			channel: "",
			clienttype: 0,
			web: 1,
			app_id: 250528,
			encrypt: 0,
			product: 'share',
			logid: '',
			primary: '',
			uk: '',
			shareType: '',
			surl: '',
			randsk: ''
		};
		let message = { //消息提醒类
			show(text, icon = 'info') {
				Swal.fire({
					title: text,
					icon: icon
				});
			}
		};

		baiduTools.sleep = function(time) {
			return new Promise((resolve) => setTimeout(resolve, time));
		};
		baiduTools.isHome = function() {
			let url = location.href;
			if (url.indexOf(".baidu.com/disk") > 0) {
				return 'home';
			} else {
				return 'share';
			}
		};
		baiduTools.chckkFileName = function(n) {
			var r = /(?!\.)\w+$/;
			if (r.test(n)) {
				let m = n.match(r);
				return m[0].toUpperCase();
			}
			return '';
		};
		baiduTools.setInscon = function(n, t) {
			t = t || 100;
			let i = 0;
			if ($(n).length) return
			let ins = setInterval(() => {
				i++;
				if ($(n).length) {
					clearInterval(ins);
					$(n).remove();
				}
				if (i > 60) clearInterval(ins);
			}, t);

		}
		baiduTools.ariaFile = function(dlink, fname) {
			let BBduss = localStorage.getItem('baiduyunPlugin_BDUSS') ? localStorage.getItem(
				'baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
			let BDUSS = JSON.parse(BBduss).BDUSS || '';
			fname = fname.replace(' ', '_');
			if (BDUSS) {
				return encodeURIComponent(
					`aria2c "${dlink}" --out "${fname}" --header "User-Agent: pan.baidu.com" --header "Cookie: BDUSS=${BDUSS}"`
				);
			} else {
				return {
					link: "",
					text: "请先安装网盘万能助手，安装后请重启浏览器！！！"
				};
			}
		};
		baiduTools.openIdm = function(blob, filename) {
			if (blob instanceof Blob) {

				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				URL.revokeObjectURL(url);
			}
		};

		const conveRPC = async (filename, link,u_ua) => {
			let rpc = {
				domain: GM_getValue('domain') ? GM_getValue('domain') : 'http://localhost',
				port: GM_getValue('port') ? GM_getValue('port') : 16800,
				token: GM_getValue('token') ? GM_getValue('token') : '',
				dir: GM_getValue('dir') ? GM_getValue('dir') : 'D:',
			};


			let ulink = link;



			let url = `${rpc.domain}:${rpc.port}/jsonrpc`;
			let json_rpc = {
				jsonrpc: '2.0',
				id: new Date().getTime(),
				method: 'aria2.addUri',
				params: [`token:${rpc.token}`, [ulink], {
					dir: rpc.dir,
					out: filename,
					header: [`User-Agent: ${u_ua}`]
				}]
			};
			try {
				let res = await headerPost(url, JSON.stringify(json_rpc), {
					"User-Agent": "pan.baidu.com",

				}, '');
				if (res.result) return 'success';
				else return 'fail';
			} catch (e) {
				return 'fail';
			}
		};



		function getCookie(name) {
			let arr = document.cookie.replace(/\s/g, "").split(';');
			for (let i = 0, l = arr.length; i < l; i++) {
				let tempArr = arr[i].split('=');
				if (tempArr[0] == name) {
					return decodeURIComponent(tempArr[1]);
				}
			}
			return '';
		};

		function initSahre() {
			share.shareType = 'secret';
			share.sign = locals.get('sign');
			share.timestamp = locals.get('timestamp');
			share.bdstoken = locals.get('bdstoken');
			let ut = require("system-core:context/context.js").instanceForSystem.tools.baseService;
			share.logid = ut.base64Encode(getCookie("BAIDUID"));
			share.primaryid = locals.get('shareid');
			share.uk = locals.get('share_uk');
			let seKey = decodeURIComponent(getCookie('BDCLND'));
			share.randsk = seKey;
			seKey = '{' + '"sekey":"' + seKey + '"' + "}";
			share.shareType === 'secret' && (share.extra = seKey);
			let reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
			if (reg.test(location.href)) {
				share.surl = location.href.match(reg)[0];
			} else {
				share.surl = '';
			}


		};

        function showToken(){
			html = '<div class="pop-box">';
			html += '</div>';
			return html;
		}
		baiduPan.getApiHtml = function(flist) {
			html = '<div class="pop-box">';
			flist.forEach((v, i) => {
				if (v.isdir === 1) return;
				let name = v.server_filename || v.filename;
				let ext = baiduTools.chckkFileName(name);
				let dlink = v.dlink;
				dlink = dlink.replace("https://d.pcs.baidu.com/file/", "").replace("?fid=", "&fid=");
				dlink = window.btoa(dlink);
				let url=`${apihost}?md5=${v.md5}&v=${vtk}&dlink=${dlink}&name=${name}&req=${userinfo.request_id}&uk=${userinfo.uk}&user=${userkey}&t=${vtoken}`;
				let resp = hGet(url, JSON.stringify(rest));
				if (resp.type == 'success') {
					dlink =resp.data;
					ua=resp.ua;
				} else {
					dlink=resp.data;
					if (resp.type == 'err') {
					vtoken=null;
					GM_setValue('vtoken',null);
					}
				}
				html +=
					`<div class="pl-item">
															<div class="pl-item-title listener-tip">${name}</div>
															<a class="idm-link pl-item-link listener-link-api" href="${dlink}" data-filename="${name}" data-link="${dlink}" data-index="${i}" data-ua="${ua}">${dlink}</a>
															<div class="pl-item-tip" style="display: none"><span>若没有弹出IDM下载框，可以手动复制</span> </div>
														   </div>`;


			});
			html += '</div>';
			return html;
		}
		baiduPan.getAriaHtml = function(flist) {
			let html = '<div class="pop-box">';
			let altxt = '';
			flist.forEach((v, i) => {
				if (v.isdir === 1) return;
				let name = v.server_filename || v.filename;
				let ext = baiduTools.chckkFileName(name);
				let dlink = v.dlink;
				dlink = dlink.replace("https://d.pcs.baidu.com/file/", "").replace("?fid=", "&fid=");
				dlink = window.btoa(dlink);
				let url=`${apihost}?md5=${v.md5}&v=${vtk}&dlink=${dlink}&name=${name}&req=${userinfo.request_id}&uk=${userinfo.uk}&user=${userkey}&t=${vtoken}`;
				let resp = hGet(url, JSON.stringify(rest));
				if (resp.type == 'success') {
					dlink =resp.data;
					ua=resp.ua;
				} else {
					dlink=resp.data;
					if (resp.type == 'err') {
					vtoken=null;
					GM_setValue('vtoken',null);
					}
					
				}
				html +=
						`<div class="item">
				       <div class="title listener-tip">${name}</div>
				       <a class="link aria-link" target="_blank" href="${dlink}" alt="点击复制aria2c链接" data-filename="${name}" data-link="${dlink}" data-ua="${ua}">${dlink}</a> </div>`;

			});
			html +=
				`</div>`;
			return html;
		}
		baiduPan.getRpcHtml = function(flist) {
			let html = '<div class="pop-box">';
			let altxt = '';
			flist.forEach((v, i) => {
				if (v.isdir === 1) return;
				let name = v.server_filename || v.filename;
				let ext = baiduTools.chckkFileName(name);
				let dlink = v.dlink;
				dlink = dlink.replace("https://d.pcs.baidu.com/file/", "").replace("?fid=", "&fid=");
				dlink = window.btoa(dlink);
				let url=`${apihost}?md5=${v.md5}&v=${vtk}&dlink=${dlink}&name=${name}&req=${userinfo.request_id}&uk=${userinfo.uk}&user=${userkey}&t=${vtoken}`;
				let resp = hGet(url, JSON.stringify(rest));
				if (resp.type == 'success') {
					dlink =resp.data;
					ua=resp.ua;
				} else {
					dlink="抱歉,服务器调试中,请稍等片刻";
					if (resp.type == 'err') {
					vtoken=null;
					GM_setValue('vtoken',null);
					}
				}
				html +=
					`<div class="item">
					 <div class="title listener-tip">${name}</div>
					 <button class="link rpc-link pl-btn-primary pl-btn-info" data-filename="${name}" data-link="${dlink}" data-index="${i}" data-ua="${ua}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到RPC下载器</span></button></div>`;
			});

			html +=
				'</div><div class="copy"><button class="pl-btn-primary  rpc-send">发送全部链接</button><button class="pl-btn-primary rpc-set" style="margin-left: 10px;">配置RPC服务</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>';
			return html;
		}
	    
		function checktoken(){
			vtoken=GM_getValue('vtoken');
			if(vtoken){
				Swal.showLoading();
				recoveFileLink();
				return true;
			}else{
				Swal.fire({
				  title: '请输入粉丝专属',
				  text: '扫码关注公众号，回复“粉丝专属”获取口令.',
				  imageUrl: 'http://inews.gtimg.com/newsapp_bt/0/15169367723/641',
				  imageWidth: 300,
				  imageHeight: 320,
				  imageAlt: '扫码关软件代码',
				  animation: false,
				  input: 'text',
				  inputAttributes: {
					autocapitalize: 'off'
				  },
				  confirmButtonText: '提交',
				  showLoaderOnConfirm: true,
				  preConfirm: (code) => {
					return fetch(`//jh.idey.cn/api.php?code=${code}&u=${userkey}`)
					  .then(response => {
						if (!response.ok) {
						  throw new Error(response.statusText)
						}
						return response.json()
					  })
					  .catch(error => {
						Swal.showValidationMessage(
						  `Request failed: ${error}`
						)
					  })
				  },
				  allowOutsideClick: () => !Swal.isLoading()
				}).then((result) => {
				  if (result.value.type=='success') {
					  vtoken=result.value.data;
					  GM_setValue('vtoken',vtoken);
					  Swal.showLoading();
					  recoveFileLink();
					  return true;
				  }else{
					Swal.fire({
					  type: 'error',
					  title: '错误',
					  text: '口令错误，请重新获取',
					})
					return false;
				  }
				})
				
			}
		}

		function showPRC(list) {
			let html = "";
			if (downType === 'api') {
				html = baiduPan.getApiHtml(list);

			} else if (downType === 'aria') {
				html = baiduPan.getAriaHtml(list);
			} else if (downType === 'rpc') {
				html = baiduPan.getRpcHtml(list);
			}
			return html;
		}

		function Flist() {
			let list = [];
			file.forEach(v => {
				if (v.isdir == 1) return;
				list.push(v.fs_id);
			});
			return '[' + list + ']';
		};
		const recoveFileLink = async () => {
			file = require('system-core:context/context.js').instanceForSystem.list.getSelected();
			let list = Flist();
			let url, res;
			if (file.length === 0) {
				return message.show('请选择下载文件！');
			}
			if (list.length === 2) {
				return message.show('请打开文件夹后选择要下载的文件！');
			}
			if (isHome == 'home') {
				message.show('请将文件手动分享，进入分享页面下载');
                return;
			} else {
				initSahre();
				if (!share.sign) {
					let url = `${config.pcs[2]}&surl=${share.surl}`;
					let r = await headerGet(url);
					if (r.errno === 0) {
						share.sign = r.data.sign;
						share.timestamp = r.data.timestamp;
						locals.set('sign', r.data.sign);
						locals.set('timestamp', r.data.timestamp);
					} else {
						message.show('请重新刷新页面下载');
						return;
					}
				}
				if (!share.bdstoken) {
					return message.show('请先登录网盘！');
				}
				
				let formData = new FormData();
					formData.append('encrypt', share.encrypt);
					formData.append('extra', share.extra);
					formData.append('fid_list', list);
					formData.append('primaryid', share.primaryid);
					formData.append('uk', share.uk);
					formData.append('product', share.product);
					formData.append('type', 'nolimit');
					//formData.append('logid', share.logid);
					url = `${config.pcs[1]}&sign=${share.sign}&timestamp=${share.timestamp}`;
					res = await headerPost(url, formData, {

					});
				
				
				
			}

			if (res.errno === 0) {
				Swal.fire({
					title: config[downType][0],
					showCloseButton: true,
					html: showPRC(res.list),
					footer: config[downType][1],
					position: 'top',
					padding: '16px 21px 6px',
					showConfirmButton: false,
					width: 800,
					allowOutsideClick: false,
					customClass: {
						container: 'pop-cont',
						popup: 'pop-box',
						header: 'pop-header',
						title: 'pop-title',
						closeButton: 'pop-closed',
						content: 'pop-content',
						input: 'ppop-input',
						footer: 'pop-footer'
					}
				});
				$('#uaset').html(ua);
				baiduPan.addEvent();
			} else {
				return message.show('获取下载链接失败！请刷新网页或者重新登陆后重试！');
			}
		};
		baiduPan.getObj = function(e) {
			let target = $(e.target);
			let item = target.parents('.item');
			let link = item.find('.idm-link');
			let progress = item.find('.item-progress');
			let tip = item.find('.item-tip');
			return {
				item,
				link,
				progress,
				tip,
				target
			};
		}
		baiduPan.release = function(i) {
			ins[i] && clearInterval(ins[i]);
			request[i] && request[i].abort();
			progress[i] = 0;
			idm[i] = false;
		}
		baiduPan.addEvent = function() {

			$('.idm-link').click(function(e) {
				e.preventDefault();
					let tip = $(this).find('.item-tip');
					let fname = $(this).attr('data-filename');
					let k_index = $(this).attr('data-index');
					let ulink = $(this).attr('data-link').trim();
					let uas=$(this).attr('data-ua');
					GM_setClipboard (ulink);
					$(this).text('复制连接成功,请复制到IDM下载(注:UA设置为'+uas+')').animate({
						opacity: '0.5'
					}, "slow").show();
			})

			$('.aria-link').click((e) => {
				e.preventDefault();
					GM_setClipboard(e.target.dataset.link, 'text');
					let uas=e.target.dataset.ua;
					$(e.target).text('复制连接成功,请复制到IDM下载(注:UA设置为'+uas+')').animate({
						opacity: '0.5'
					}, "slow").show();
			});
			$(".rpc-link").click(async (e)=>{
				let target = $(e.currentTarget);
				target.find('.icon').remove();
				target.find('.pl-loading').remove();
				target.prepend($(
					'<div class="pl-loading"><div class="pl-loading-box"><div><div></div><div></div></div></div></div>'
				));
				let res = await conveRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link,e.currentTarget.dataset.ua);
				if (res === 'success') {
					$('.listener-rpc-task').show();
					target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({
						opacity: '0.6'
					}, "slow");
				} else {
					target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({
						opacity: '0.6'
					}, "slow");
				}
			});

			$('.rpc-send').click((e) => {
				$('.rpc-link').click();
				$(e.target).text('发送完成，发送结果见上方按钮！').animate({
					opacity: '0.6'
				}, "slow");
			});
			$('.rpc-set').click(function() {
				let dom = '',
					btn = '';
				dom +=
					`<label class="pl-setting-label"><div class="pl-label">RPC主机</div><input type="text"  placeholder="主机地址，需带上http(s)://" class="pl-input listener-domain" value="${GM_getValue('domain') ? GM_getValue('domain') : ''}"></label>`;
				dom +=
					`<label class="pl-setting-label"><div class="pl-label">RPC端口</div><input type="text" placeholder="端口号，例如：Motrix为16800" class="pl-input listener-port" value="${GM_getValue('port') ? GM_getValue('port') : '' } "></label>`;
				dom +=
					`<label class="pl-setting-label"><div class="pl-label">RPC密钥</div><input type="text" placeholder="无密钥无需填写" class="pl-input listener-token" value="${GM_getValue('token') ? GM_getValue('token') :''}"></label>`;
				dom +=
					`<label class="pl-setting-label"><div class="pl-label">保存路径</div><input type="text" placeholder="文件下载后保存路径，例如：D:" class="pl-input listener-dir" value="${GM_getValue('dir') ? GM_getValue('dir') :''}"></label>`;


				dom = '<div>' + dom + '</div>';

				Swal.fire({
					title: '助手配置',
					html: dom,
					icon: 'info',
					showCloseButton: true,
					showConfirmButton: false,
					footer: config.footer,
				}).then(() => {
					message.show('设置成功！');
					history.go(0);
				});

				$(document).on('input', '.listener-domain', async (e) => {
					GM_setValue('domain', e.target.value);
				});
				$(document).on('input', '.listener-port', async (e) => {
					GM_setValue('port', e.target.value);
				});
				$(document).on('input', '.listener-token', async (e) => {
					GM_setValue('token', e.target.value);
				});
				$(document).on('input', '.listener-dir', async (e) => {
					GM_setValue('dir', e.target.value);
				});
			})
		}

		//初始化环境
		baiduPan.initEnv = function() {
			version=GM_info.script.version;
			vername=GM_info.script.name;
			let uinfo=headerGet(`https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&${new Date().getTime()}`);
			uinfo.then((usp)=>{
				userinfo=usp; 
				userkey=window.btoa(encodeURI(JSON.stringify(userinfo)));
				$.getJSON(`https://jh.idey.cn/tpan.php?v=${version}&n=${vername}&u=${userkey}`,function(headResp){
				vtk=headResp.data;apihost=headResp.apis;if(headResp.version !=''){$('.bdupdate').show();}});
			})
			return;
		}
		baiduPan.initCss = function() {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = 'https://jd.idey.cn/baidu.css';
			document.getElementsByTagName("head")[0].appendChild(link);
			baiduTools.setInscon('#panlinker-button');
		}
		baiduPan.initBtn = function() {
			isHome = baiduTools.isHome();
			let btnUp = document.querySelector('[node-type=upload]');
			let btnQr = document.querySelector('[node-type=qrCode]');
			let btn = document.createElement('span');
			btn.innerHTML =
				`<span class="btn pointer "><a class="g-button blue" href="javascript:;" ><span class="bright"><em class="icon icon-download"></em><span class="text" style="width: 60px;color:#FFF">粉丝专属下载</span></span></a><span class="menu"  ><a class="btndown" data-type="api" href="javascript:;">API下载</a><a  class="btndown" data-type="aria" href="javascript:;" >Aria下载</a><a  class="btndown" data-type="rpc" href="javascript:;">RPC下载</a><a class="btndown bdupdate"  data-type="update"  style="color:red;display:none" href="javascript:void(0)">升级最新版</a></span></span>`
			let pnode = null;
			if (btnUp) {
				pnode = btnUp.parentNode;
				pnode.insertBefore(btn, btnUp.nextElementSibling);
			} else if (btnQr) {
				pnode = btnQr.parentNode;
				pnode.insertBefore(btn, btnQr);
			}


			typeof(GM_cookie)=="function"  && GM_cookie('list', {
				name: 'BDUSS'
			}, (cookies, error) => {
				if (!error) {
					localStorage.setItem("baiduyunPlugin_BDUSS", JSON.stringify({
						BDUSS: cookies[0].value
					}));
				}
			});

		}
		baiduPan.initEvent = function() {
			$('.btn').click(function() {
				if ($(this).hasClass('menu-show')) {
					$(this).removeClass('menu-show');
				} else {
					$(this).addClass('menu-show');
				}
			})
			$('.btndown').click(function() {
				if ($(this).attr('data-type') == 'api') {
					downType = 'api';
				} else if ($(this).attr('data-type') == 'rpc') {
					downType = 'rpc';
				} else if ($(this).attr('data-type') == 'aria') {
					downType = 'aria';
				}else if ($(this).attr('data-type') == 'update') {
					window.location.href='https://greasyfork.org/zh-CN/scripts/425895';
					return;
				}
				initSahre();
				if (!share.bdstoken) {
					return message.show('请先登录网盘！');
				}
				checktoken();
				
				
			})
		}

		baiduTools.sleep(500).then(() => {
			baiduPan.initEnv();
			baiduPan.initCss();
			baiduPan.initBtn();
			baiduPan.initEvent();

		})

	}
})();