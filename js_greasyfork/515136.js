// ==UserScript==
// @name              炫咖淘宝天猫领隐藏优惠券省钱小助手【20241215】持续更新中，自动显示历史哪天价格最低、哪天领券销量最高，淘宝|天猫隐藏优惠券。简无广，有则显，一目了然，让您告别虚假降价。
// @namespace         http://shop.xuankaba.com
// @version           1.0.4
// @description       自动显示淘宝(taobao.com)、天猫(tmall.com)、天猫超市隐藏优惠券与历史价格。
// @description:zh    自動顯示淘寶(taobao.com)、天貓(tmall.com)、天貓超市隱藏優惠券與歷史價格。
// @description:zh-TW 自動顯示淘寶(taobao.com)、天貓(tmall.com)、天貓超市隱藏優惠券與歷史價格。

// @author            炫咖
// @license           MIT
// @icon              data:image/png;base64,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
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @exclude           *://login.taobao.com/*
// @exclude           *://login.tmall.com/*
// @exclude           *://uland.taobao.com/*
// @require           https://lib.baomitu.com/jquery/1.8.3/jquery.min.js
// @require           https://lib.baomitu.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @antifeature       referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/515136/%E7%82%AB%E5%92%96%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%A2%86%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%9020241215%E3%80%91%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E5%93%AA%E5%A4%A9%E4%BB%B7%E6%A0%BC%E6%9C%80%E4%BD%8E%E3%80%81%E5%93%AA%E5%A4%A9%E9%A2%86%E5%88%B8%E9%94%80%E9%87%8F%E6%9C%80%E9%AB%98%EF%BC%8C%E6%B7%98%E5%AE%9D%7C%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E7%AE%80%E6%97%A0%E5%B9%BF%EF%BC%8C%E6%9C%89%E5%88%99%E6%98%BE%EF%BC%8C%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E8%AE%A9%E6%82%A8%E5%91%8A%E5%88%AB%E8%99%9A%E5%81%87%E9%99%8D%E4%BB%B7%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/515136/%E7%82%AB%E5%92%96%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%A2%86%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%9020241215%E3%80%91%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E5%93%AA%E5%A4%A9%E4%BB%B7%E6%A0%BC%E6%9C%80%E4%BD%8E%E3%80%81%E5%93%AA%E5%A4%A9%E9%A2%86%E5%88%B8%E9%94%80%E9%87%8F%E6%9C%80%E9%AB%98%EF%BC%8C%E6%B7%98%E5%AE%9D%7C%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E7%AE%80%E6%97%A0%E5%B9%BF%EF%BC%8C%E6%9C%89%E5%88%99%E6%98%BE%EF%BC%8C%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E8%AE%A9%E6%82%A8%E5%91%8A%E5%88%AB%E8%99%9A%E5%81%87%E9%99%8D%E4%BB%B7%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('link');
    style.href = 'https://shop.xuankaba.com/CSS/style.css';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.getElementsByTagName('head').item(0).appendChild(style);
    var Api_interface = 'https://shop.xuankaba.com/Browser_plugin.php';
    var url = location.href;
    function ewmxs(url,sl){
      // console.log(url);
        const ewmxs_time_id = setInterval( function () {
            if ($('#qrcode').length) {
                $("#qrcode").qrcode({
                    width:sl,
                    height:sl,
                    text:url
                })
                clearInterval(ewmxs_time_id);
            }
        }, 100);
    }
    if (url.indexOf("//item.taobao.com/item") != -1 || url.indexOf("//detail.tmall.com/item") != -1 || url.indexOf("//chaoshi.detail.tmall.com/item") != -1 || url.indexOf("//detail.tmall.hk/hk/item") != -1 || url.indexOf("//detail.tmall.hk/item") != -1) {
        function QueryString(item){
            var sValue = location.search.match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)", "i"))
            return sValue?sValue[1]:sValue
        }
        function yhxs(xl_class_arr,yhq,wyh,lsj,ewm,data){
          // console.log(data);
            const yhxs_time_id = setInterval( function () {
                for (let i = 0; i < xl_class_arr.length; i++) {
                    var xl_class = xl_class_arr[i];
                    if ($('div').is(xl_class)) {
                        clearInterval(yhxs_time_id);
                        if (data.coupon_amount) {
                            return $(xl_class).after(yhq + lsj + ewm)
                        } else if (url.indexOf(data.sign) != -1 || !data.urltz) {
                            if (data.shorturl) {
                                return $(xl_class).after(wyh + lsj + ewm)
                            } else if(data.zuidijia){
                                return $(xl_class).after(wyh + lsj)
                            }else {
                                return $(xl_class).after(wyh )
                            }
                        } else {
                            return window.location.replace(data.urltz)
                        }
                    }
                }
            }, 100);
        }
        $.get(Api_interface+'?id='+QueryString("id")+'&m=shangpin', function(data) {
          var data = JSON.parse(data);
             var yhq = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">优惠券 ' + data.coupon_amount + '元</div><div class="coupon-info2">' + data.coupon_info + '</div></div>'+
                    '<a class="coupon-get" href="' + data.coupon_click_url + '">立即领取</a></div><div class="coupon-time">优惠券截止时间：' + data.coupon_end_time + ' <b>剩余：'+ data.coupon_remain_count +'张</b></div>';

            var lsj = '<div class="coupon-time"><b>历史最低价：'+ data.zuidijia +'</b><br> 单日领券销量最高：'+ data.danrigaoxiao +'</div>';

            var wyh = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">未查询到隐藏优惠券</div><div class="coupon-info2">' + data.qun + '</div></div>'+
                    '<a class="coupon-get" target="blank" href="' + data.search + '">搜索类似商品</a></div>';
            var ewm = '<div id="qrcode" style="position: fixed;bottom: 10px;right:50px;z-index: 9999;"><p class="coupon-time"><b>使用淘宝APP扫码购买此商品</b></p></div>';
            yhxs(data.class_arr,yhq,wyh,lsj,ewm,data)
            ewmxs(data.shorturl,159)
        })
    } else {
        var objs = {};
        objs.initSearchItem = function (selector) {
            var $tmthis = $(selector);
            if ($tmthis.hasClass("tb-cool-box-already")) {
                return;
            } else {
                $tmthis.addClass("tb-cool-box-already")
            }
            var nid = $tmthis.attr("data-id");
            if (!nid || parseInt(nid) != nid || nid <= 10000) {
                nid = $tmthis.attr("data-itemid");
            }
            if (!nid || parseInt(nid) != nid || nid <= 10000) {
                if ($tmthis.attr("href")) {
                    nid = location.protocol + $tmthis.attr("href");
                } else {
                    var $tma = $tmthis.find("a");
                    if (!$tma.length) {
                        return;
                    }
                    nid = $tma.attr("data-nid");
                    if (!nid || parseInt(nid) != nid || nid <= 10000) {
                        if ($tma.hasClass("j_ReceiveCoupon") && $tma.length > 1) {
                            nid = location.protocol + $($tma[1]).attr("href");
                        } else {
                            nid = location.protocol + $tma.attr("href");
                        }
                    }
                }
            }
            var ssqun = '<div class="tb-cool-box-area tb-cool-box-wait" data-nid="' + nid + '"><a class="tb-cool-box-info tb-cool-box-info-default" title="点击查询">待查询</a></div>'
            if (nid.indexOf('http') != -1) {
                if (nid.indexOf("//detail.ju.taobao.com/home") != -1 || nid.indexOf("//item.taobao.com/item") != -1 || nid.indexOf("//detail.tmall.com/item") != -1 || nid.indexOf("//chaoshi.detail.tmall.com/item") != -1 || nid.indexOf("//detail.tmall.hk/hk/item") != -1 || nid.indexOf("//detail.tmall.hk/item") != -1) {
                    $tmthis.append(ssqun);
                }
            } else if (nid) {
                $tmthis.append(ssqun);
            }
        };
        objs.basicQueryItem = function (selector) {
            var $tmthis = $(selector);
            $tmthis.removeClass("tb-cool-box-wait");
            var nid = $tmthis.attr("data-nid");
            if (nid.indexOf("?") != -1) {
                var sValue = nid.match(new RegExp("[\?\&]id=([^\&]*)(\&?)","i"));
                nid = sValue?sValue[1]:sValue;
            }
            $.get(Api_interface+'?id='+nid+'&m=sousuo',function(data) {
                var data = JSON.parse(data);
                if (data.coupon_amount) {
                    $tmthis.html('<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="点击领取">有券（减' + data.coupon_amount + '元）</a>');
                } else {
                    $tmthis.addClass("tb-cool-box-info-translucent");
                    $tmthis.html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" title="点击领取">暂无优惠</a>');
                }
            })
        };
        $.get(Api_interface,function(data) {
            var data = JSON.parse(data);
            var tmselectorList = data.tmselectorList;
            if (tmselectorList && tmselectorList.length != -1) {
                setInterval(function () {
                    tmselectorList.forEach(function (selector) {
                        $(selector).each(function () {
                            objs.initSearchItem(this);
                        });
                    });
                }, 1500);
                $(document).on("click", ".tb-cool-box-area", function () {
                    var $tmthis = $(this);
                    if ($tmthis.hasClass("tb-cool-box-wait")) {
                        objs.basicQueryItem(this);
                    } else if ($tmthis.hasClass("tb-cool-box-info-translucent")) {
                        $tmthis.removeClass("tb-cool-box-info-translucent");
                    } else {
                        $tmthis.addClass("tb-cool-box-info-translucent");
                    }
                });
                setInterval(function () {
                    $(".tb-cool-box-wait").each(function () {
                        objs.basicQueryItem(this);
                    });
                }, 1500);
            }
        })
    }
})();