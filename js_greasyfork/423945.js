// ==UserScript==

// @name         省神优惠券，全网最简单易用的淘宝天猫阿里大药房商品优惠券插件，无脑领券并提供商品跨平台优惠券比较！
// @namespace    https://www.itwashot.com/
// @version      0.3.4
// @description  简单易用的淘宝天猫阿里大药房优惠券。并提供同类商品大额优惠券推荐。脚本将持续更新，后面陆续支持拼多多，京东等平台。
// @author       Kevin Lelf

// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.liangxinyao.com/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://*.tmall.hk/*

// @connect      tsr.itwashot.com

// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/materialize/1.0.0-rc.2/js/materialize.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js

// @resource     lelf-materialcss https://cdn.jsdelivr.net/gh/lelf2005/cdn@master/material.css?v=20200630
// @resource     lelf-materialcss2 http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @run-at       document-end

// @grant        GM_addStyle
// @grant        GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/423945/%E7%9C%81%E7%A5%9E%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E7%AE%80%E5%8D%95%E6%98%93%E7%94%A8%E7%9A%84%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E5%A4%A7%E8%8D%AF%E6%88%BF%E5%95%86%E5%93%81%E4%BC%98%E6%83%A0%E5%88%B8%E6%8F%92%E4%BB%B6%EF%BC%8C%E6%97%A0%E8%84%91%E9%A2%86%E5%88%B8%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%95%86%E5%93%81%E8%B7%A8%E5%B9%B3%E5%8F%B0%E4%BC%98%E6%83%A0%E5%88%B8%E6%AF%94%E8%BE%83%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/423945/%E7%9C%81%E7%A5%9E%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E7%AE%80%E5%8D%95%E6%98%93%E7%94%A8%E7%9A%84%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E5%A4%A7%E8%8D%AF%E6%88%BF%E5%95%86%E5%93%81%E4%BC%98%E6%83%A0%E5%88%B8%E6%8F%92%E4%BB%B6%EF%BC%8C%E6%97%A0%E8%84%91%E9%A2%86%E5%88%B8%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%95%86%E5%93%81%E8%B7%A8%E5%B9%B3%E5%8F%B0%E4%BC%98%E6%83%A0%E5%88%B8%E6%AF%94%E8%BE%83%EF%BC%81.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var $ = $ || window.$;
    var materialcss = GM_getResourceText('lelf-materialcss');
    GM_addStyle(materialcss);
	var materialcss2 = GM_getResourceText('lelf-materialcss2');
    GM_addStyle(materialcss2);

    //var apiUrl = 'http://localhost:8080/';
	var apiUrl = 'https://honey-jewelry.com/taobao/'
	var apiTBQueryById = apiUrl + 'getCoupon/';
   	var tbDetailUrls = ["//item.taobao.com/item.htm","//detail.tmall.com/item.htm", "//chaoshi.detail.tmall.com/item.htm", "//detail.tmall.hk/hk/item.htm","//detail.tmall.hk/item.htm" ];

	var tbPageNo = 1;
    var	pddPageNo = 1;
	var pageSize = 50;
    var needQuery = [];
	needQuery[0] = true;
	needQuery[1] = true;
	initCss();

	var s = '  <div id="lelf_modal_rank" class="modal modal-fixed-footer">'+
		'    <div class="modal-content">'+
        '    '+
		'      <div class="row" style="margin-bottom: 0;"><div class="col s12 header h5" style="margin:0;">类似商品推荐<div class="input-field inline" style="margin-top: 0; margin-bottom: 0;margin-left: 100px;"><input id="keywordInput" type="text" class="validate input_text_srch"><label id="labelKeywordInput" for="keywordInput">请输入要搜索的关键词</label></div><a id="btnQuery" class="waves-effect waves-light btn">查询</a></div></div>'+
		'	<div id="tabs">'+
		'	<ul> '+
		'		<li><a href="#tab-tb">淘宝</a></li>'+
		'		<li><a href="#tab-pdd">拼多多</a></li>'+
		'	</ul>'+
		'	<div id="tab-tb">'+

		'	</div>'+
		'	<div id="tab-pdd">'+

		'	</div>'+
		'	</div>'+

		'    </div>'+
		'    <div class="modal-footer">'+
		'      <a id="loadMore" class="waves-effect waves-green btn-flat">更多优惠券</a>'+
		'      <a class="modal-close waves-effect waves-green btn-flat">关闭</a>'+
		'    </div>'+
		'  </div>';
    $("body").append(s);

    var ss = ' <div id="qrCodeDiv" style="position:fixed;top:10%;right:80px;background-color: white;;z-index:1000000000;display:none;font-size: 15px; text-align: center; color: blue;"> '+
        '请用微信扫码领取拼多多优惠券！ <div id="qrcode" style="width:200px; height:200px; margin:15px;"></div>'+
        '更多拼多多优惠券，进入小程序查询！ <div id="qrcode2" style="width:200px; height:200px; margin:15px;"><img width="150px" height="150px" src="https://honey-jewelry.com/plugin/ss.jpg"></div></div> ';
    $("body").append(ss);

    $("#btnQuery").click(function(){
        if ($("#keywordInput").val().trim() == '') {
           alert("请输入商品关键词进行优惠券查询！");
           return;
        }

        var active = $( "#tabs" ).tabs( "option", "active" );
        var tabId;
		pddPageNo = 1;
		tbPageNo = 1;
		needQuery[0] = true;
		needQuery[1] = true;
		$("#tab-tb").html("");
		$("#tab-pdd").html("");

		buildMoreCouponHtml(1);

    })

	$("#loadMore").click(function(){
        var active = $( "#tabs" ).tabs( "option", "active" );
		needQuery[active] = true;
		buildMoreCouponHtml(1);

    })

    var productId;
	if (isTBDetailPage(location.href)) {
		productId = window.location.href.split("id=")[1].split('&')[0];

		$.get(apiTBQueryById + productId, function(data) {
			var htmlCoupon = '';
            var htmlSimilarItems = '';
            if(data.otherRecommends.length > 0){
                for(let i in data.otherRecommends) {
                    htmlSimilarItems += '<p><a href="'+data.otherRecommends[i].coupon_share_url+'" target="_blank">'+data.otherRecommends[i].coupon_info+'</a></p>';
                }
            }
			if (data.coupon_amount) {
				htmlCoupon = '<div><div class="stamp stamp01"><div class="par"><sub class="sign">￥</sub><span>' + data.coupon_amount + '</span><sub>优惠券</sub><p>' + data.coupon_info + '</p></div><div class="copy"><a href="' + data.coupon_share_url + '" target="_blank">领取</a><p>剩余：' + data.coupon_remain_count + '</p></div><i></i></div><div class="similar">类似商品'+htmlSimilarItems+'<p><a id="lelf_rank" class="modal-trigger" href="#lelf_modal_rank">更多大额券...</a></p></div></div>';
			} else {
				htmlCoupon = '<div><div class="stamp stamp01"><div class="par"><span>暂无</span><p>' + data.coupon_info + '</p></div><div class="copy"><a id="lelf_rank" class="modal-trigger" href="#lelf_modal_rank">同类券</a><p>剩余：' + data.coupon_remain_count + '</p></div><i></i></div><div class="similar">类似商品'+htmlSimilarItems+'<p><a id="lelf_rank" class="modal-trigger" href="#lelf_modal_rank">更多大额券...</a></p></div></div>';
			}

			//if (data.coupon_amount) {
				if (location.href.indexOf('//detail.tmall.') != -1) {
					$('.tm-fcs-panel')
						.after(htmlCoupon);
				} else if (location.href.indexOf('//chaoshi.detail.tmall.') != -1) {
					$('.tm-fcs-panel')
						.after(htmlCoupon);
				} else {
					$('ul.tb-meta')
						.after(htmlCoupon);
				}
			//}
            $("[id=lelf_rank]").click(function(){

            $('#lelf_modal_rank').modal({
            onCloseStart:function() { $("#qrCodeDiv").hide(); }
            });

            $( "#tabs" ).tabs({
			activate: function( event, ui ) {
			  var active = $( "#tabs" ).tabs( "option", "active" );
                buildMoreCouponHtml(1);

			}
			}
			);
			getTopItems(false);
        });
	})
	} else {
		var selectorGroup = [];
		var locationUrl = location.href;
		if ( (locationUrl.indexOf("//list.tmall.com/coudan/search_product.htm") != -1) || (locationUrl.indexOf("//list.tmall.com/search_product.htm") != -1) || (locationUrl.indexOf("//list.tmall.com//search_product.htm") != -1) ) {
			selectorGroup.push(".product");
			selectorGroup.push(".chaoshi-recommend-list .chaoshi-recommend-item");
		} else if ( (locationUrl.indexOf("//s.taobao.com/search") != -1) || (locationUrl.indexOf("//s.taobao.com/list") != -1) ) {
			selectorGroup.push(".items .item");
		} else if (locationUrl.indexOf("//list.tmall.hk/search_product.htm") != -1) {
			selectorGroup.push("#J_ItemList .product");
		} else if (document.getElementById('J_ShopSearchResult')) {
			selectorGroup.push("#J_ShopSearchResult .item");
		}
		if (selectorGroup && selectorGroup.length > 0) {
			initSelectorGroup(selectorGroup);
			initSearchEvent();
			doQuery();
		}

	}
	if (location.href.indexOf('//www.taobao.com') != -1) {
        $(".search-button").append('<button id="btn_searchCoupon" type="button" href="#lelf_modal_rank" class="modal-trigger btn-search2 tb-bg">搜券</button>');
        $("#J_UploaderPanel").addClass("search-imgsearch-panel2");
        $("#btn_searchCoupon").click(function(){
            showPopup();
        })

    }

	function showPopup() {
		$('#lelf_modal_rank').modal({
            onCloseStart:function() { $("#qrCodeDiv").hide(); }
            });

		$( "#tabs" ).tabs({
		activate: function( event, ui ) {
		  var active = $( "#tabs" ).tabs( "option", "active" );
		  buildMoreCouponHtml(1);

		}
		}
		);
		getTopItems(true);
	}

     function getTopItems(fromQueryPage){
     //   toggleLoader(true);
        buildMoreCouponHtml(1, fromQueryPage);
    }

  	function buildMoreCouponHtml(from, fromQueryPage) {
		var active = $( "#tabs" ).tabs( "option", "active" );
		if (fromQueryPage) {
            pddPageNo = 1;
            tbPageNo = 1;
            needQuery[0] = true;
            needQuery[1] = true;
            $("#tab-tb").html("");
            $("#tab-pdd").html("");
        } else if (!needQuery[active])
			return;
		needQuery[active] = false;
        var tabId;
		var to;
		var pageNo;
		if (active == 0) {
			tabId = "tab-tb";
			to = 1;
			pageNo = tbPageNo++;
		} else if (active == 1) {
			tabId = "tab-pdd";
			to = 3;
			pageNo = pddPageNo++;
		}
        var url;
        if (fromQueryPage) {
            if ($("#q").val().trim() != '') {
                $("#keywordInput").val($("#q").val().trim());
                $("#labelKeywordInput").addClass("active");
                url = apiUrl + 'prodKeywordQuery/' + to + '/' +pageSize +'/' + pageNo + '?keyword='+ encodeURIComponent($("#q").val().trim());
            }
        } else {
            if ($("#keywordInput").val().trim() == '') {
                if (productId) {
                    url = apiUrl + 'prodQuery/' + from + '/' +to + '/' +productId+'/' +pageSize +'/' + pageNo;
                }
            } else {
                url = apiUrl + 'prodKeywordQuery/' + to + '/' +pageSize +'/' + pageNo + '?keyword='+ encodeURIComponent($("#keywordInput").val().trim());
            }
        }
		if (url) {
		$.get(url, function(data) {
			var colors = ["lelf-gold","lelf-silver","lelf-orange","lelf-blue"];
				var item_color = 0;
					//$("#itemcat").html("类似商品推荐");
					var topItems =data;
					if (topItems.length == 0) {
						alert("没有更多同类商品优惠券了！");
					}
					var htmlItems = $("#"+ tabId).html();;
					for(var i=0;i<topItems.length;i++){
						item_color = i<3?i:3;
						var strCoupon ='';
						if(topItems[i].coupon.coupon_amount > 0){
							strCoupon = '<span class="lelf-ribbon4">'+topItems[i].coupon.coupon_amount+'元券</span>';
						}
						var str_url = topItems[i].clickUrl;
						if(topItems[i].coupon.coupon_share_url){
						   str_url = topItems[i].coupon.coupon_share_url;
						   }
						var carAction = '';
						if (to == 1) {
							carAction = '        <div class="card-action">'+
							'<div class="btn-flat"  style="text-decoration:none;font-size:18px;">30天销售<span class="red-text">'+topItems[i].volume+'</span>件</div>'+
							'          <a href="'+str_url+'" target="_blank" class="btn waves-effect waves-light red lighten-2" style="text-decoration:none;font-size:20px;float: right;">领券购买</a>'+
							'        </div>';
						} else if (to == 3) {
							carAction = '        <div class="card-action">'+
							'<div class="btn-flat"  style="text-decoration:none;font-size:18px;">历史销售<span class="red-text">'+topItems[i].volume+'</span>件</div>'+
							'          <a id="pddPRcodeLink" data_goodsSign="'+topItems[i].goodsSign+'" class="btn waves-effect waves-light red lighten-2" style="text-decoration:none;font-size:20px;float: right;">领券购买</a>'+
							'        </div>';
						}
						htmlItems = htmlItems + '<div class="row">'+
							'<div class="col s1">'+
							'<div class="lelf-badge-container"><div class="lelf-badge '+colors[item_color]+'">'+
							'<div class="lelf-circle"> <div class="h5 strong" style="margin-top:3px;">'+((pageNo - 1) * pageSize + i+1)+'</div></div></div>'+
							'</div>'+
							'</div>'+
							'<div class="col s11">'+
							'<div class="card horizontal">'+
							'      <div class="card-image">'+
							'        <img src="'+topItems[i].picUrl+ (to == 1? '_200x200.jpg">':'" style="width:200px;height:200px">' )+
							'      </div>'+
							'      <div class="card-stacked">'+
							'        <div class="card-content">'+
							'          <p class="h6">'+topItems[i].title+'</p>'+
							'          <div style="margin-top:18px;">价格 <span class="h5 red-text"> ￥'+topItems[i].current_price+'</span>'+strCoupon+'</div>'+
							'        </div>'+
							carAction +
							'      </div>'+
							'    </div>'+
							'</div>'+
							'  </div>'
					}
					$("#"+ tabId).html(htmlItems);
			if (to ==3) {
				$("[id=pddPRcodeLink]").click(function(event){
					$.get(apiUrl + 'getPddUrl/' + event.target.attributes['data_goodsSign'].value , function(data) {
						$("#qrcode").html("");
						var qrcode = new QRCode(document.getElementById("qrcode"), {
						width : 200,
						height : 200
						});
						qrcode.clear();
						qrcode.makeCode(data);
						//$('#qrCodeDiv').modal();

						$("#qrCodeDiv").show();
					})

				})
            }

		})
		}

	}

    function toggleLoader(flag){
        if(flag){
            var strHtml='<div class="lelf-loader" id="loader"><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div></div>';
            $("#tab-tb").append(strHtml);
        }else{
            $("#loader").remove();
        }
    }

	function initSelectorGroup(selectorGroup) {
		setInterval(function() {
			selectorGroup.forEach(function(selector) {
				$(selector)
					.each(function() {
					initQueryItem(this);
				});

			});
		}, 2500);
	};

	function initSearchEvent() {
		$(document)
			.on("click", ".boxArea", function() {
				var $this = $(this);
				if ($this.hasClass("boxQuerying")) {
					$this.removeClass("boxQuerying");
				} else if ($this.hasClass("boxWaiting")) {
					doQueryItem(this);
				}  else {
					$this.addClass("boxQuerying");
				}
			});
	};



	function doQuery() {
		setInterval(function() {
			$(".boxWaiting")
				.each(function() {
					doQueryItem(this);
				});
		}, 2800);

	};


	function initQueryItem(selector) {
		var $this = $(selector);
		if ($this.hasClass("boxDone")) {
			return;
		}
		$this.addClass("boxDone")

		var nid = $this.attr("data-id");
		if (!isVailidItemId(nid)) {
			nid = $this.attr("data-itemid");
		}
		if (!isVailidItemId(nid)) {
			if ($this.attr("href")) {
				nid = location.protocol + $this.attr("href");
			} else {
				var $a = $this.find("a");
				if (!$a.length) {
					return;
				}
				nid = $a.attr("data-nid");
				if (!isVailidItemId(nid)) {
					if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
						nid = location.protocol + $($a[1])
							.attr("href");
					} else {
						nid = location.protocol + $a.attr("href");
					}
				}
			}
		}
		if (isValidNid(nid)) {
			appendQueryHtml($this, nid);
		}
	};


	function appendQueryHtml(selector, nid) {

		selector.append('<div class="boxArea boxWaiting" data-nid="' + nid + '"><a class="boxInfo boxInfo-default" title="点击查询">待查询</a></div>');

	};


	function doQueryItem(selector) {
		var $this = $(selector);
		$this.removeClass("boxWaiting");
		var nid = $this.attr("data-nid");
		$.get(apiTBQueryById + nid, function(data) {
			if (data.coupon_amount && data.coupon_amount > 0) {
				showQueryFound($this, data.coupon_amount);
			} else {
				showQueryNotFound($this);
			}
		})
	};

	function showQueryFound(selector, couponMoney) {
		selector.html('<a target="_blank" class="boxInfo boxInfo-find" title="优惠券">有券（减' + couponMoney + '元）</a>');
	};

	function showQueryNotFound(selector) {
		selector.addClass("boxQuerying");
		selector.html('<a href="javascript:void(0);" class="boxInfo boxInfo-empty" title="优惠券">暂无优惠</a>');
	};

	function isTBDetailPage(url) {
		for (var i = 0; i < tbDetailUrls.length; i++) {
			if (url.indexOf(tbDetailUrls[i]) > 0) {
				return true;
			}
		}
		return false;

	};

	function isVailidItemId(itemId) {
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

	function isValidNid(nid) {
		if (!nid) {
			return false;
		} else if (nid.indexOf('http') >= 0) {
			if (isTBDetailPage(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	function addCss(cssText) {
		var acss = document.createElement('style');
		acss.textContent = cssText;
		var doc = (document.head || document.documentElement);
		doc.appendChild(acss);
	}

	function initCss() {
		addCss(`.stamp * {
	padding: 0;
	margin: 0;
	list-style: none;
}

.stamp {
	width: 313px;
	padding: 0 10px;
	margin-top: 5px;
	position: relative;
	overflow: hidden;
    display: inline-block;
}

.stamp:before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 10px;
	right: 10px;
	z-index: -1;
}

.stamp:after {
	content: '';
	position: absolute;
	left: 10px;
	top: 10px;
	right: 10px;
	bottom: 10px;
	z-index: -2;
}

.stamp i {
	position: absolute;
	right: 20%;
	bottom: 45px;
	height: 190px;
	width: 390px;
	background-color: rgba(255,255,255,.15);
	transform: rotate(-30deg);
}

.stamp .par {
	float: left;
	padding: 16px 15px;
	width: 160px;
	border-right: 2px dashed rgba(255,255,255,.3);
	text-align: center;
}

.stamp .par p {
	color: #fff;
	font-size: 16px;
	line-height: 21px;
}

.stamp .par span {
	font-size: 50px;
	color: #fff;
	margin-right: 5px;
	line-height: 65px;
}

.stamp .par .sign {
	font-size: 34px;
}

.stamp .par sub {
	position: relative;
	top: -5px;
	color: rgba(255,255,255,.8);
}

.stamp .copy {
	display: inline-block;
	padding: 21px 14px;
	width: 90px;
	font-size: 30px;
	color: rgb(255,255,255);
	text-align: center;
}

.stamp .copy p {
	font-size: 14px;
	margin-top: 15px;
}

.stamp .copy a {
	color : white;
}

.similar {
	display: inline-block;
    vertical-align: top;
    font-size: 14px;
    background: #F39B00;
    margin-left: 5px;
    margin-top: 5px;
    padding: 9px 25px;
	color: white;
}

.similar a {
	color : white;
}

.stamp01 {
	background: #F39B00;
	background: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0) 5px, #F39B00 5px);
	background-size: 15px 15px;
	background-position: 9px 3px;
}

.stamp01:before {
	background-color: #F39B00;
}

#tb-cool-area {
	border: 1px solid #eee;
	margin: 0 auto;
	position: relative;
	clear: both;
	display: none;
}

#tb-cool-area .tb-cool-area-home {
	position: absolute;
	top: 5px;
	right: 10px;
	z-index: 10000;
}

#tb-cool-area .tb-cool-area-home a {
	cursor: pointer;
	color: #515858;
	font-size: 10px;
	text-decoration: none;
}

#tb-cool-area .tb-cool-area-home a.new-version {
	color: #ff0036;
}

#tb-cool-area .tb-cool-area-benefit {
	width: 240px;
	float: left;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode {
	text-align: center;
	min-height: 150px;
	margin-top: 40px;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode canvas,#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode img {
	margin: 0 auto;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title {
	margin-top: 20px;
	color: #000;
	font-size: 14px;
	font-weight: 700;
	text-align: center;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title span {
	color: #ff0036;
	font-weight: 700;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action {
	margin-top: 10px;
	text-align: center;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action a {
	text-decoration: none;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button {
	min-width: 120px;
	padding: 0 8px;
	line-height: 35px;
	color: #fff;
	background: #ff0036;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 1.5px;
	margin: 0 auto;
	text-align: center;
	border-radius: 15px;
	display: inline-block;
	cursor: pointer;
}

#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button.quan-none {
	color: #000;
	background: #bec5c5;
}

#tb-cool-area .tb-cool-area-history {
	height: 300px;
	overflow: hidden;
	position: relative;
}

#tb-cool-area .tb-cool-area-history #tb-cool-area-chart,#tb-cool-area .tb-cool-area-history .tb-cool-area-container {
	width: 100%;
	height: 100%;
}

#tb-cool-area .tb-cool-area-history .tb-cool-history-tip {
	position: absolute;
	margin: 0;
	top: 50%;
	left: 50%;
	letter-spacing: 1px;
	font-size: 15px;
	transform: translateX(-50%) translateY(-50%);
}

#tb-cool-area .tb-cool-area-table {
	margin-top: 10px;
	position: relative;
	overflow: hidden;
}

#tb-cool-area .tb-cool-quan-tip {
	position: absolute;
	margin: 0;
	top: 50%;
	left: 50%;
	letter-spacing: 1px;
	font-size: 15px;
	opacity: 0;
	transform: translateX(-50%) translateY(-50%);
}

#tb-cool-area .tb-cool-quan-tip a {
	color: #333;
	font-weight: 400;
	text-decoration: none;
}

#tb-cool-area .tb-cool-quan-tip a:hover {
	color: #ff0036;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table {
	width: 100%;
	font-size: 14px;
	text-align: center;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td {
	padding: 4px;
	color: #1c2323;
	border-top: 1px solid #eee;
	border-left: 1px solid #eee;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td span {
	color: #ff0036;
	font-weight: 700;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td:first-child {
	border-left: none;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link {
	width: 60px;
	line-height: 24px;
	font-size: 12px;
	background: #ff0036;
	text-decoration: none;
	display: inline-block;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-enable {
	cursor: pointer;
	color: #fff;
}

#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-disable {
	cursor: default;
	color: #000;
	background: #ccc;
}

#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-tip {
	opacity: 1;
}

#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-table {
	filter: blur(3px);
	-webkit-filter: blur(3px);
	-moz-filter: blur(3px);
	-ms-filter: blur(3px);
}

.boxArea {
	position: absolute;
	top: 10px;
	left: 5px;
	z-index: 9999;
}

.boxWaiting {
	cursor: pointer;
}

.boxDone {
	position: relative;
}

.boxInfo {
	width: auto!important;
	height: auto!important;
	padding: 6px 8px!important;
	font-size: 13px;
	color: #fff!important;
	border-radius: 16px;
	cursor: pointer;
}

.boxInfo,.boxInfo:hover,.boxInfo:visited {
	text-decoration: none!important;
}

.boxInfo-default {
	background: #3186fd!important;
}

.boxInfo-find {
	background: #f54848!important;
}

.boxInfo-empty {
	color: #000!important;
	background: #ccc!important;
}

.boxQuerying {
	opacity: .45;
}

.mui-zebra-module .boxInfo {
	font-size: 10px;
}

.import-shangou-itemcell .boxArea,.zebra-ziying-qianggou .boxArea {
	right: 10px;
	left: auto;
}

.item_s_cpb .boxArea {
	top: auto;
	bottom: 10px;
}

.j-mdv-chaoshi .m-floor .boxArea a {
	width: auto;
	height: auto;
}

.left-wider .proinfo-main {
	margin-bottom: 40px;
}

.detailHd .m-info {
	margin-bottom: 20px;
}

.tb-cool-quan-date {
	color: #233b3d;
	font-weight: 400;
	font-size: 12px;
}

.tb-cool-area-has-date .tb-cool-quan-qrcode {
	margin-top: 30px!important;
}

.tb-cool-area-has-date .tb-cool-quan-title {
	margin-top: 10px!important;
}

.input_text_srch{
background-color: transparent;
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-radius: 0;
    outline: none;
    height: 3rem;
    width: 100%;
    font-size: 1rem;
    margin: 0 0 20px 0;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 20px;
    margin-left: 0px;
    padding: 0;
    box-shadow: none;
    box-sizing: content-box;
    transition: all 0.3s;}


div.search-imgsearch-panel2 {
    right: 160px;
}
div.search-button {
    width: 148px !important;
}

.btn-search2 {
font-size: 18px;
    font-weight: 700;
    color: #FFF;
    background-color: #FF4200;
    cursor: pointer;
    height: 100%;
    border: none;
    width: 72px;
}

.btn-search {
    width: 72px !important;
}


`);
}

})();

var QRCode;

(function () {
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	function QR8bitByte(data) {
		this.mode = QRMode.MODE_8BIT_BYTE;
		this.data = data;
		this.parsedData = [];

		// Added to support UTF-8 Characters
		for (var i = 0, l = this.data.length; i < l; i++) {
			var byteArray = [];
			var code = this.data.charCodeAt(i);

			if (code > 0x10000) {
				byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
				byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
				byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[3] = 0x80 | (code & 0x3F);
			} else if (code > 0x800) {
				byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
				byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[2] = 0x80 | (code & 0x3F);
			} else if (code > 0x80) {
				byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
				byteArray[1] = 0x80 | (code & 0x3F);
			} else {
				byteArray[0] = code;
			}

			this.parsedData.push(byteArray);
		}

		this.parsedData = Array.prototype.concat.apply([], this.parsedData);

		if (this.parsedData.length != this.data.length) {
			this.parsedData.unshift(191);
			this.parsedData.unshift(187);
			this.parsedData.unshift(239);
		}
	}

	QR8bitByte.prototype = {
		getLength: function (buffer) {
			return this.parsedData.length;
		},
		write: function (buffer) {
			for (var i = 0, l = this.parsedData.length; i < l; i++) {
				buffer.put(this.parsedData[i], 8);
			}
		}
	};

	function QRCodeModel(typeNumber, errorCorrectLevel) {
		this.typeNumber = typeNumber;
		this.errorCorrectLevel = errorCorrectLevel;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = [];
	}

	QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col){throw new Error(row+","+col);}
	return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++){this.modules[row][col]=null;}}
	this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7){this.setupTypeNumber(test);}
	if(this.dataCache==null){this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);}
	this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r)continue;for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c)continue;if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}
	return pattern;},createMovieClip:function(target_mc,instance_name,depth){var qr_mc=target_mc.createEmptyMovieClip(instance_name,depth);var cs=1;this.make();for(var row=0;row<this.modules.length;row++){var y=row*cs;for(var col=0;col<this.modules[row].length;col++){var x=col*cs;var dark=this.modules[row][col];if(dark){qr_mc.beginFill(0,100);qr_mc.moveTo(x,y);qr_mc.lineTo(x+cs,y);qr_mc.lineTo(x+cs,y+cs);qr_mc.lineTo(x,y+cs);qr_mc.endFill();}}}
	return qr_mc;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null){continue;}
	this.modules[r][6]=(r%2==0);}
	for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null){continue;}
	this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null){continue;}
	for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}
	for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6){this.modules[i][8]=mod;}else if(i<8){this.modules[i+1][8]=mod;}else{this.modules[this.moduleCount-15+i][8]=mod;}}
	for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8){this.modules[8][this.moduleCount-i-1]=mod;}else if(i<9){this.modules[8][15-i-1+1]=mod;}else{this.modules[8][15-i-1]=mod;}}
	this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6)col--;while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length){dark=(((data[byteIndex]>>>bitIndex)&1)==1);}
	var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask){dark=!dark;}
	this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}
	row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}}}};QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}
	var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}
	if(buffer.getLengthInBits()>totalDataCount*8){throw new Error("code length overflow. ("
	+buffer.getLengthInBits()
	+">"
	+totalDataCount*8
	+")");}
	if(buffer.getLengthInBits()+4<=totalDataCount*8){buffer.put(0,4);}
	while(buffer.getLengthInBits()%8!=0){buffer.putBit(false);}
	while(true){if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD1,8);}
	return QRCodeModel.createBytes(buffer,rsBlocks);};QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++){dcdata[r][i]=0xff&buffer.buffer[i+offset];}
	offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}
	var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++){totalCodeCount+=rsBlocks[i].totalCount;}
	var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length){data[index++]=dcdata[r][i];}}}
	for(var i=0;i<maxEcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length){data[index++]=ecdata[r][i];}}}
	return data;};var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};var QRMaskPattern={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),G18:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),G15_MASK:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0){d^=(QRUtil.G15<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)));}
	return((data<<10)|d)^QRUtil.G15_MASK;},getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0){d^=(QRUtil.G18<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)));}
	return(data<<12)|d;},getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}
	return digit;},getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern.PATTERN000:return(i+j)%2==0;case QRMaskPattern.PATTERN001:return i%2==0;case QRMaskPattern.PATTERN010:return j%3==0;case QRMaskPattern.PATTERN011:return(i+j)%3==0;case QRMaskPattern.PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern.PATTERN101:return(i*j)%2+(i*j)%3==0;case QRMaskPattern.PATTERN110:return((i*j)%2+(i*j)%3)%2==0;case QRMaskPattern.PATTERN111:return((i*j)%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++){a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));}
	return a;},getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r){continue;}
	for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c){continue;}
	if(r==0&&c==0){continue;}
	if(dark==qrCode.isDark(row+r,col+c)){sameCount++;}}}
	if(sameCount>5){lostPoint+=(3+sameCount-5);}}}
	for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col))count++;if(qrCode.isDark(row+1,col))count++;if(qrCode.isDark(row,col+1))count++;if(qrCode.isDark(row+1,col+1))count++;if(count==0||count==4){lostPoint+=3;}}}
	for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)){lostPoint+=40;}}}
	for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)){lostPoint+=40;}}}
	var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col)){darkCount++;}}}
	var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;}};var QRMath={glog:function(n){if(n<1){throw new Error("glog("+n+")");}
	return QRMath.LOG_TABLE[n];},gexp:function(n){while(n<0){n+=255;}
	while(n>=256){n-=255;}
	return QRMath.EXP_TABLE[n];},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var i=0;i<8;i++){QRMath.EXP_TABLE[i]=1<<i;}
	for(var i=8;i<256;i++){QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];}
	for(var i=0;i<255;i++){QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;}
	function QRPolynomial(num,shift){if(num.length==undefined){throw new Error(num.length+"/"+shift);}
	var offset=0;while(offset<num.length&&num[offset]==0){offset++;}
	this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++){this.num[i]=num[i+offset];}}
	QRPolynomial.prototype={get:function(index){return this.num[index];},getLength:function(){return this.num.length;},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++){for(var j=0;j<e.getLength();j++){num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));}}
	return new QRPolynomial(num,0);},mod:function(e){if(this.getLength()-e.getLength()<0){return this;}
	var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++){num[i]=this.get(i);}
	for(var i=0;i<e.getLength();i++){num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);}
	return new QRPolynomial(num,0).mod(e);}};function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
	QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined){throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);}
	var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++){list.push(new QRRSBlock(totalCount,dataCount));}}
	return list;};QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};function QRBitBuffer(){this.buffer=[];this.length=0;}
	QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex){this.buffer.push(0);}
	if(bit){this.buffer[bufIndex]|=(0x80>>>(this.length%8));}
	this.length++;}};var QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];

	function _isSupportCanvas() {
		return typeof CanvasRenderingContext2D != "undefined";
	}

	// android 2.x doesn't support Data-URI spec
	function _getAndroid() {
		var android = false;
		var sAgent = navigator.userAgent;

		if (/android/i.test(sAgent)) { // android
			android = true;
			var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

			if (aMat && aMat[1]) {
				android = parseFloat(aMat[1]);
			}
		}

		return android;
	}

	var svgDrawer = (function() {

		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};

		Drawing.prototype.draw = function (oQRCode) {
			var _htOption = this._htOption;
			var _el = this._el;
			var nCount = oQRCode.getModuleCount();
			var nWidth = Math.floor(_htOption.width / nCount);
			var nHeight = Math.floor(_htOption.height / nCount);

			this.clear();

			function makeSVG(tag, attrs) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				for (var k in attrs)
					if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
				return el;
			}

			var svg = makeSVG("svg" , {'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': _htOption.colorLight});
			svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
			_el.appendChild(svg);

			svg.appendChild(makeSVG("rect", {"fill": _htOption.colorLight, "width": "100%", "height": "100%"}));
			svg.appendChild(makeSVG("rect", {"fill": _htOption.colorDark, "width": "1", "height": "1", "id": "template"}));

			for (var row = 0; row < nCount; row++) {
				for (var col = 0; col < nCount; col++) {
					if (oQRCode.isDark(row, col)) {
						var child = makeSVG("use", {"x": String(col), "y": String(row)});
						child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
						svg.appendChild(child);
					}
				}
			}
		};
		Drawing.prototype.clear = function () {
			while (this._el.hasChildNodes())
				this._el.removeChild(this._el.lastChild);
		};
		return Drawing;
	})();

	var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

	// Drawing in DOM by using Table tag
	var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};

		/**
		 * Draw the QRCode
		 *
		 * @param {QRCode} oQRCode
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var _el = this._el;
			var nCount = oQRCode.getModuleCount();
			var nWidth = Math.floor(_htOption.width / nCount);
			var nHeight = Math.floor(_htOption.height / nCount);
			var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

			for (var row = 0; row < nCount; row++) {
				aHTML.push('<tr>');

				for (var col = 0; col < nCount; col++) {
					aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
				}

				aHTML.push('</tr>');
			}

			aHTML.push('</table>');
			_el.innerHTML = aHTML.join('');

			// Fix the margin values as real size.
			var elTable = _el.childNodes[0];
			var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
			var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;

			if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
				elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
			}
		};

		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._el.innerHTML = '';
		};

		return Drawing;
	})() : (function () { // Drawing in Canvas
		function _onMakeImage() {
			this._elImage.src = this._elCanvas.toDataURL("image/png");
			this._elImage.style.display = "block";
			this._elCanvas.style.display = "none";
		}

		// Android 2.1 bug workaround
		// http://code.google.com/p/android/issues/detail?id=5141
		if (this._android && this._android <= 2.1) {
	    	var factor = 1 / window.devicePixelRatio;
	        var drawImage = CanvasRenderingContext2D.prototype.drawImage;
	    	CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
	    		if (("nodeName" in image) && /img/i.test(image.nodeName)) {
		        	for (var i = arguments.length - 1; i >= 1; i--) {
		            	arguments[i] = arguments[i] * factor;
		        	}
	    		} else if (typeof dw == "undefined") {
	    			arguments[1] *= factor;
	    			arguments[2] *= factor;
	    			arguments[3] *= factor;
	    			arguments[4] *= factor;
	    		}

	        	drawImage.apply(this, arguments);
	    	};
		}

		/**
		 * Check whether the user's browser supports Data URI or not
		 *
		 * @private
		 * @param {Function} fSuccess Occurs if it supports Data URI
		 * @param {Function} fFail Occurs if it doesn't support Data URI
		 */
		function _safeSetDataURI(fSuccess, fFail) {
            var self = this;
            self._fFail = fFail;
            self._fSuccess = fSuccess;

            // Check it just once
            if (self._bSupportDataURI === null) {
                var el = document.createElement("img");
                var fOnError = function() {
                    self._bSupportDataURI = false;

                    if (self._fFail) {
                        self._fFail.call(self);
                    }
                };
                var fOnSuccess = function() {
                    self._bSupportDataURI = true;

                    if (self._fSuccess) {
                        self._fSuccess.call(self);
                    }
                };

                el.onabort = fOnError;
                el.onerror = fOnError;
                el.onload = fOnSuccess;
                el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                return;
            } else if (self._bSupportDataURI === true && self._fSuccess) {
                self._fSuccess.call(self);
            } else if (self._bSupportDataURI === false && self._fFail) {
                self._fFail.call(self);
            }
		};

		/**
		 * Drawing QRCode by using canvas
		 *
		 * @constructor
		 * @param {HTMLElement} el
		 * @param {Object} htOption QRCode Options
		 */
		var Drawing = function (el, htOption) {
    		this._bIsPainted = false;
    		this._android = _getAndroid();

			this._htOption = htOption;
			this._elCanvas = document.createElement("canvas");
			this._elCanvas.width = htOption.width;
			this._elCanvas.height = htOption.height;
			el.appendChild(this._elCanvas);
			this._el = el;
			this._oContext = this._elCanvas.getContext("2d");
			this._bIsPainted = false;
			this._elImage = document.createElement("img");
			this._elImage.alt = "Scan me!";
			this._elImage.style.display = "none";
			this._el.appendChild(this._elImage);
			this._bSupportDataURI = null;
		};

		/**
		 * Draw the QRCode
		 *
		 * @param {QRCode} oQRCode
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _elImage = this._elImage;
            var _oContext = this._oContext;
            var _htOption = this._htOption;

			var nCount = oQRCode.getModuleCount();
			var nWidth = _htOption.width / nCount;
			var nHeight = _htOption.height / nCount;
			var nRoundedWidth = Math.round(nWidth);
			var nRoundedHeight = Math.round(nHeight);

			_elImage.style.display = "none";
			this.clear();

			for (var row = 0; row < nCount; row++) {
				for (var col = 0; col < nCount; col++) {
					var bIsDark = oQRCode.isDark(row, col);
					var nLeft = col * nWidth;
					var nTop = row * nHeight;
					_oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
					_oContext.lineWidth = 1;
					_oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
					_oContext.fillRect(nLeft, nTop, nWidth, nHeight);

					// 鞎堩嫲 鞎Μ鞏挫嫳 氚╈ 觳橂Μ
					_oContext.strokeRect(
						Math.floor(nLeft) + 0.5,
						Math.floor(nTop) + 0.5,
						nRoundedWidth,
						nRoundedHeight
					);

					_oContext.strokeRect(
						Math.ceil(nLeft) - 0.5,
						Math.ceil(nTop) - 0.5,
						nRoundedWidth,
						nRoundedHeight
					);
				}
			}

			this._bIsPainted = true;
		};

		/**
		 * Make the image from Canvas if the browser supports Data URI.
		 */
		Drawing.prototype.makeImage = function () {
			if (this._bIsPainted) {
				_safeSetDataURI.call(this, _onMakeImage);
			}
		};

		/**
		 * Return whether the QRCode is painted or not
		 *
		 * @return {Boolean}
		 */
		Drawing.prototype.isPainted = function () {
			return this._bIsPainted;
		};

		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
			this._bIsPainted = false;
		};

		/**
		 * @private
		 * @param {Number} nNumber
		 */
		Drawing.prototype.round = function (nNumber) {
			if (!nNumber) {
				return nNumber;
			}

			return Math.floor(nNumber * 1000) / 1000;
		};

		return Drawing;
	})();

	/**
	 * Get the type by string length
	 *
	 * @private
	 * @param {String} sText
	 * @param {Number} nCorrectLevel
	 * @return {Number} type
	 */
	function _getTypeNumber(sText, nCorrectLevel) {
		var nType = 1;
		var length = _getUTF8Length(sText);

		for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
			var nLimit = 0;

			switch (nCorrectLevel) {
				case QRErrorCorrectLevel.L :
					nLimit = QRCodeLimitLength[i][0];
					break;
				case QRErrorCorrectLevel.M :
					nLimit = QRCodeLimitLength[i][1];
					break;
				case QRErrorCorrectLevel.Q :
					nLimit = QRCodeLimitLength[i][2];
					break;
				case QRErrorCorrectLevel.H :
					nLimit = QRCodeLimitLength[i][3];
					break;
			}

			if (length <= nLimit) {
				break;
			} else {
				nType++;
			}
		}

		if (nType > QRCodeLimitLength.length) {
			throw new Error("Too long data");
		}

		return nType;
	}

	function _getUTF8Length(sText) {
		var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
		return replacedText.length + (replacedText.length != sText ? 3 : 0);
	}

	/**
	 * @class QRCode
	 * @constructor
	 * @example
	 * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
	 *
	 * @example
	 * var oQRCode = new QRCode("test", {
	 *    text : "http://naver.com",
	 *    width : 128,
	 *    height : 128
	 * });
	 *
	 * oQRCode.clear(); // Clear the QRCode.
	 * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
	 *
	 * @param {HTMLElement|String} el target element or 'id' attribute of element.
	 * @param {Object|String} vOption
	 * @param {String} vOption.text QRCode link data
	 * @param {Number} [vOption.width=256]
	 * @param {Number} [vOption.height=256]
	 * @param {String} [vOption.colorDark="#000000"]
	 * @param {String} [vOption.colorLight="#ffffff"]
	 * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
	 */
	QRCode = function (el, vOption) {
		this._htOption = {
			width : 256,
			height : 256,
			typeNumber : 4,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRErrorCorrectLevel.H
		};

		if (typeof vOption === 'string') {
			vOption	= {
				text : vOption
			};
		}

		// Overwrites options
		if (vOption) {
			for (var i in vOption) {
				this._htOption[i] = vOption[i];
			}
		}

		if (typeof el == "string") {
			el = document.getElementById(el);
		}

		if (this._htOption.useSVG) {
			Drawing = svgDrawer;
		}

		this._android = _getAndroid();
		this._el = el;
		this._oQRCode = null;
		this._oDrawing = new Drawing(this._el, this._htOption);

		if (this._htOption.text) {
			this.makeCode(this._htOption.text);
		}
	};

	/**
	 * Make the QRCode
	 *
	 * @param {String} sText link data
	 */
	QRCode.prototype.makeCode = function (sText) {
		this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
		this._oQRCode.addData(sText);
		this._oQRCode.make();
		this._el.title = sText;
		this._oDrawing.draw(this._oQRCode);
		this.makeImage();
	};

	/**
	 * Make the Image from Canvas element
	 * - It occurs automatically
	 * - Android below 3 doesn't support Data-URI spec.
	 *
	 * @private
	 */
	QRCode.prototype.makeImage = function () {
		if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
			this._oDrawing.makeImage();
		}
	};

	/**
	 * Clear the QRCode
	 */
	QRCode.prototype.clear = function () {
		this._oDrawing.clear();
	};

	/**
	 * @name QRCode.CorrectLevel
	 */
	QRCode.CorrectLevel = QRErrorCorrectLevel;
})();

if (typeof module != "undefined") {
  module.exports = QRCode;
}


