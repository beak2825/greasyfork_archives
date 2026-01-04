// ==UserScript==
// @name         购物返利、优惠券自动查询工具。更多功能开发中...
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  购物省钱小助手，自动显示京东、淘宝、聚划算、天猫隐藏优惠券，购物成功返利，更多功能开发中...
// @author       phpchina@foxmail.com
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @exclude           *://wq.jd.com/*

// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*


// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODA4M0E3N0FDRjkyRTk2QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MUQxMjg3RUEwOEExMUUyQUJBMzlGNjZGOTMwNjI3RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MUQxMjg3REEwOEExMUUyQUJBMzlGNjZGOTMwNjI3RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDM4MDExNzQwNzIwNjgxMTgwODNBNzdBQ0Y5MkU5NkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgwODNBNzdBQ0Y5MkU5NkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4D5RQIAAAAyElEQVR42mL8//8/AyWAiYFCwILM2cTIKACkCqDcBX7//z+AijsAKRD+ABX/gNUAkCQQ+0PZB4D4AZQN0lwPZYMsacDlBZhmQ6AtB2CCQDZIQyKSYfjDAKjhAhbhBzQJRCakAIQ5+SEOtSAXfARie6BarGGggM+p0Bh4gKYWYQDQ3zBBexwGGACxPhBfBKpNoCQMPhAMRKAfFbAICxATCweh9H1o6oMZCAq09djCCD0lFkBTmQCaUx9ADX+AlNTBgHHAcyNAgAEA+Ns7Dl9wvSAAAAAASUVORK5CYII=
// @grant        unsafeWindow
// @license MIT
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @antifeature       referral-link
// @downloadURL https://update.greasyfork.org/scripts/437140/%E8%B4%AD%E7%89%A9%E8%BF%94%E5%88%A9%E3%80%81%E4%BC%98%E6%83%A0%E5%88%B8%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E5%B7%A5%E5%85%B7%E3%80%82%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%BC%80%E5%8F%91%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/437140/%E8%B4%AD%E7%89%A9%E8%BF%94%E5%88%A9%E3%80%81%E4%BC%98%E6%83%A0%E5%88%B8%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E5%B7%A5%E5%85%B7%E3%80%82%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%BC%80%E5%8F%91%E4%B8%AD.meta.js
// ==/UserScript==




(function() {
    'use strict';

    let loadcss = function(css) {
        var style = document.createElement("style");
        style.rel = 'stylesheet';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    };


    function QueryString(item) {
        var sValue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"))
        return sValue ? sValue[1] : sValue
    }


    var config = {
        "api": "https://www.calcw.com",
    };




    let coupon_css = `
    .coupon-wrap {
    	margin: 10px 0;
    	overflow: hidden;
    	color: #fff;
    }

    .coupon-wrap .coupon {
    	background-image: linear-gradient(150deg, rgb(255, 153, 0), rgb(255, 102, 153));
    	display: inline-flex;
    	color: white;
    	position: relative;
    	padding-left: 0.5rem;
    	padding-right: 0.5rem;
    	border-top-right-radius: 0.3rem;
    	border-bottom-right-radius: 0.3rem;
    	overflow: hidden;
    }

    .coupon-wrap .coupon::before {
    	left: -7px;
    	content: "";
    	position: absolute;
    	top: 0px;
    	height: 100%;
    	width: 14px;
    	background-image: radial-gradient(white 0px, white 4px, transparent 4px);
    	background-size: 14px 14px;
    	z-index: 1;
    	background-position: 0px 2px;
    	background-repeat: repeat-y;
    }

    .coupon-wrap .coupon .coupon-info {
    	border-right: 2px dashed white;
    	padding-left: 20px;
    	padding-top: 20px;
    	padding-bottom: 20px;
    	position: relative;
    	min-width: 200px;
    	font-size: 14px;
    }

    .coupon-wrap .coupon .coupon-info::before, .coupon-wrap .coupon .coupon-info::after {
    	content: "";
    	width: 20px;
    	height: 20px;
    	background-color: white;
    	position: absolute;
    	right: -11px;
    	border-radius: 50%;
    }

    .coupon-wrap .coupon .coupon-info::before {
    	top: -10px;
    }

    .coupon-wrap .coupon .coupon-info::after {
    	bottom: -10px;
    }

    .coupon-wrap .coupon .coupon-info .coupon-desc {
    	font-size: 18px;
    	font-weight: bold;
    }

    .coupon-wrap .coupon .coupon-get {
    	display: flex;
    	justify-content: center;
    	align-items: center;
    	flex-direction: column;
    	min-width: 100px;
    	position: relative;
    	font-size: 20px;
    	color: rgb(255, 255, 255);
    	padding: 20px;
    }

    .coupon-time {
    	color: #ff8440;
    	margin-top: 5px;
    }
    `;

    loadcss(coupon_css);

    var url = location.href;
    if (url.indexOf("item.jd.") != -1 || url.indexOf("item.m.jd.") != -1 || url.indexOf("//item.yiyaojd.com/") != -1 || url.indexOf("//e.jd.com/") != -1 || url.indexOf("//pro.jd.com/") != -1 || url.indexOf("//pro.m.jd.com/") != -1 || url.indexOf("//story.m.jd.com/") != -1 || url.indexOf("//prodev.m.jd.com/") != -1 || url.indexOf("//prodev.jd.com/") != -1) {
        if (url.indexOf("://item.jd.com/coupons?") < 0) {

            if (url.indexOf("?") != -1) {
                url = url.substr(0, url.indexOf("?"));
            }


            $.getJSON(config.api + '/api/v1/union/jd?materialId=' + url, function(d) {
                if(!d.ok){
                    return;
                }


                var data = d.data;
                var yhq = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">发现优惠券</div><div class="coupon-info2"></div></div>' +
                    '<a class="coupon-get" target="_blank" href="' + data.shortUrl + '">立即领取</a></div><div class="coupon-time"></div>';

                //var wyh = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">未查询到优惠券</div><div class="coupon-info2">' + data.qun + '</div></div>' +
                //    '<a class="coupon-get" target="blank" href="' + data.search + '">搜索相关优惠</a></div>';
                //var lsj = '<div class="coupon-time"><b>历史最低价：<span id="zuidijia">加载中...</span></b> 历史高最价：<span id="zuigaojia">加载中...</span></div>';
                //var ewm = '<div id="qrcode" style="position: fixed;bottom: 3px;right:39px;z-index: 9999;"><p class="coupon-time"><b>使用京东APP扫码购买此商品</b></p></div>';

                if (data.shortUrl) {
                    $('.summary-top').after(yhq);
                } else {
                    // window.location.replace(data.urltz);
                }


            });

        }


} else if (url.indexOf("//item.taobao.com/item.htm") != -1 || url.indexOf("//detail.tmall.com/item.htm") != -1 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") != -1 || url.indexOf("//detail.tmall.hk/hk/item.htm") != -1 || url.indexOf("//detail.tmall.hk/item.htm") != -1) {

    $.getJSON(config.api + '/api/v1/union/taoke?goods_id=' + QueryString("id"), function(d) {
        if (!d.ok) {
            return;
        }
        var data = d.data;
        var yhq = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">优惠券 ' + data.couponInfo + '</div></div>' +
            '<a class="coupon-get" href="' + data.couponClickUrl + '">立即领取</a></div><div class="coupon-time">优惠券截止时间：' + data.couponEndTime + ' <b>剩余：' + data.couponRemainCount + '张</b></div>';

        var wyh = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">未查询到优惠券</div><div class="coupon-info2">' + data.qun + '</div></div>' +
            '<a class="coupon-get" target="blank" href="' + data.search + '">搜索类似商品</a></div>';


        //tmall的特殊处理
        if (url.indexOf('//detail.tmall.') != -1 || url.indexOf('//chaoshi.detail.tmall.') != -1) {
            if (data.couponClickUrl) {
                $('.tm-fcs-panel').after(yhq);
            }else if(url.indexOf("bxsign") == -1 && data.shortUrl){
                window.location.replace(data.shortUrl);
            }
        } else {
            if (data.couponClickUrl) {
                $('ul.tb-meta').after(yhq);
            } else if (url.indexOf("bxsign") == -1  && data.shortUrl) {
                window.location.replace(data.shortUrl);
            }
        }

    })
}


})();
