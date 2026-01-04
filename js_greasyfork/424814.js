// ==UserScript==
// @name         【隐藏优惠券助手】自动获取天猫、淘宝隐藏优惠券
// @namespace    https://xianbao.huoxingsou.com
// @version      1.0.2
// @description  自动查询淘宝天猫商品隐藏优惠券，商品列表和商品详情页自动显示是否有可用优惠券，如果有优惠券会在商品详情页【价格下方出现】优惠券金额和领券入口，如果没有表示该商品没有可用优惠券
// @author       runningcat
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.liangxinyao.com/*
// @exclude      *://login.taobao.com/*
// @exclude      *://pages.tmall.com/*
// @connect      xianbao.huoxingsou.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424814/%E3%80%90%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%E3%80%91%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/424814/%E3%80%90%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%E3%80%91%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('link');
    style.href = 'https://xianbao.huoxingsou.com/assets/css/coupon.css';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.getElementsByTagName('head').item(0).appendChild(style);

    function getcoupon(url){
        GM_xmlhttpRequest({
         method:'get',
         url:url,
         headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
         },
         onload:function(res){
             if(res.status == 200 && res.response){
                var response = JSON.parse(res.response);
                 console.log(response)
                if(response.code == 200){
                    console.log('couponPrice',response.data.couponPrice)
                    var couponArea = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc" style="font-weight: bold;"><br>发现隐藏优惠券 ' + response.data.couponPrice + '<br /><br /></div></div>'+
                    '<div id="coupon-get" style="padding:10px;cursor: pointer;" onclick="window.open(\'' + response.data.couponClickUrl + '\');"><div style="padding: 40px 10px 0;"><div style="position: relative;font-size: 25px;margin: -14px 20px 0 20px;color: #dbf508;">领券</div></div></div></div></div>';
                    if (location.href.indexOf('//detail.tmall') != -1) {
                        $('.tm-fcs-panel').after(couponArea);
                    } else {
                        $('ul.tb-meta').after(couponArea);
                    }
                }else{
                    console.log('没有可用优惠券');
                }
            }
         }
     })
    }

    function initSearchList(selectorList) {
        setInterval(function () {
            selectorList.forEach(function (selector) {
                initSearchItemSelector(selector);
            });
        }, 800);
    };

    function initEventClick() {
        $(document).on("click", ".tb-cool-box-area", function () {
            var $this = $(this);
            if ($this.hasClass("tb-cool-box-wait")) {
                basicQueryItem(this);
            } else if ($this.hasClass("tb-cool-box-info-translucent")) {
                $this.removeClass("tb-cool-box-info-translucent");
            } else {
                $this.addClass("tb-cool-box-info-translucent");
            }
        });
    };

   function basicQuery() {
        setInterval(function () {
            $(".tb-cool-box-wait").each(function () {
                basicQueryItem(this);
            });
        }, 2000);
    };

    function initSearchItemSelector(selector) {
        $(selector).each(function () {
            initSearchItem(this);
        });
    };

    function initSearchItem(selector) {
        var $this = $(selector);
        if ($this.hasClass("tb-cool-box-already")) {
            return;
        } else {
            $this.addClass("tb-cool-box-already")
        }

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
                        nid = location.protocol + $($a[1]).attr("href");
                    } else {
                        nid = location.protocol + $a.attr("href");
                    }
                }
            }
        }

        if (isValidNid(nid)) {
            appenBasicQueryHtml($this, nid);
        }
    };

    function appenBasicQueryHtml(selector, nid) {
        selector.append('<div class="tb-cool-box-area tb-cool-box-wait" data-nid="' + nid + '"><a class="tb-cool-box-info tb-cool-box-info-default" title="查询中">查询中</a></div>');
    };

    function basicQueryItem(selector) {
        var $this = $(selector);
        $this.removeClass("tb-cool-box-wait");
        var nid = $this.attr("data-nid");
        GM_xmlhttpRequest({
            method:'get',
            url:'https://xianbao.huoxingsou.com/api/Coupon/productDetail?productId='+nid,
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload:function(res){
                if(res.status == 200 && res.response){
                    var response = JSON.parse(res.response);
                    if(response.code == 200){
                        console.log(response);
                        showBasicQueryFind($this, response.data.couponPrice);
                    }else{
                        console.log('没有优惠券');
                        showBasicQueryEmpty($this);
                    }
                }
            }
        })
    };

    function showBasicQueryFind(selector, couponMoney) {
        selector.html('<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="有券">有券（减' + couponMoney + '）</a>');
    };

    function showBasicQueryEmpty(selector) {
        selector.addClass("tb-cool-box-info-translucent");
        selector.html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" title="暂无优惠券">暂无优惠</a>');
    };

    function isVailidItemId(itemId) {
        if (!itemId) {
            return false;
        }

        var itemIdInt = parseInt(itemId);
        if (itemIdInt == itemId && itemId > 10000) {
            return true;
        }
        else {
            return false;
        }
    };

    function isValidNid(nid) {
        if (!nid) {
            return false;
        }
        else if (nid.indexOf('http') >= 0) {
            if (isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };

	function isDetailPageTaoBao(url) {
        if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
            return true;
        } else {
            return false;
        }
    };

	if (isDetailPageTaoBao(location.href)) {
        var productId = 0;
        var params = location.search.split('?')[1].split('&');
        for (var index in params) {
            if (params[index].split('=')[0] == 'id') {
                productId = params[index].split('=')[1];
                break;
            }
        }
        getcoupon('https://xianbao.huoxingsou.com/api/Coupon/productDetail?productId='+productId)
	}else{
        var selectorList = [];
        var url = location.href;
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
            initSearchList(selectorList);
            initEventClick();
            basicQuery();
        }
    }
})();