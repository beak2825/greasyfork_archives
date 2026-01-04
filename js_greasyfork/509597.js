// ==UserScript==
// @name              ! 超简洁的网购省钱小助手，自动显示京东、淘宝、聚划算、天猫隐藏优惠券与历史价格。简洁无广告，一目了然，让您告别虚假降价。持续维护中...
// @name:zh           ! 超简洁的网购省钱小助手，自动显示京东、淘宝、聚划算、天猫隐藏优惠券与历史价格。简洁无广告，一目了然，让您告别虚假降价。持续维护中...
// @name:zh-TW        ! 超簡潔的網購省錢小助手，自動顯示京東、淘寶、聚劃算、天貓隱藏優惠券與歷史價格。簡潔無廣告，一目了然，讓您告別虛假降價。持續維護中...
// @namespace         http://shop.xuelg.com
// @version           2.1.5
// @description       或许是最简洁好用的购物小助手啦~ 自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)隐藏优惠券与历史价格。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。
// @description:zh    或許是最簡潔好用的購物小助手啦~ 自動顯示京東(jd.com)、淘寶(taobao.com)、天貓(tmall.com)、聚劃算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東電子書、京東工業品、京東大藥房(yiyaojd.com)隱藏優惠券與歷史價格。不止讓您省錢開心購物，更可以告別虛假降價，以最優惠的價格，把寶貝抱回家。
// @description:zh-TW 或許是最簡潔好用的購物小助手啦~ 自動顯示京東(jd.com)、淘寶(taobao.com)、天貓(tmall.com)、聚劃算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東電子書、京東工業品、京東大藥房(yiyaojd.com)隱藏優惠券與歷史價格。不止讓您省錢開心購物，更可以告別虛假降價，以最優惠的價格，把寶貝抱回家。
// @author            血莲
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAhFBMVEVHcEwDAgL68vLz5uWeBAXv5eT16unv4+Pr3t57Cg2XBQaOBQd/BAZqBAbs3961q6tuaGhHQUImIyTj0tEXERJhW1xUT08MCgodGxuWjo47Njd9dnaHgYExLS6gmJjfv7y/trWqoaGhFhePMDDOxMTIeXnVnpx2IiK2SUqrJylIDQ2ZYmHjbvk7AAAACnRSTlMA////////YWFjn3/5VwAABvVJREFUSMdlV4eWo7oSNCbsXoIiEkJCZBuH//+/VxKesOdpOPaMTdHVqbrnconnT5rneZrmKckTnC6JpxNcK+a0xMcpibeQ/M/l55yYeJHEJN+nM5Yz1vc9JyR+TcJV5F84fJafVy4T8YNLWgCVcsNC552EG9J4a5r+n72eudH9cG29ZpqxoQdw3wOm+Nx44vITl5ORMsVa680H2Bntxr7HNdNgtPi6NSLPhxSgr7j1nHvRnuaSRHvuRjrTZXZ4pbvM89OjHGT/pqfJPFfOWyUSY7pOn0CvlBpGCmuzCzapTL9s/o0ekvCQnfLWeABe79vBug5AoYKDYzBG2TwiRuREFojPx3pBKPe4t348s6y8v50AY6GcG4ZlAYIOfoSvNNoIiAs5Yem89/Yoq6zMAFwbxy0SynrXD2NPh3FeBgfjwx4DgutyJjW/HVUdIFk8VXo4bU3HKVXjOLJhmBfmUAtsJGcG0ksR3m5V+YUJ6KmumoFpK8RIOVwbnKJUM8Up63cQDSxDcLaqqqsPrnyEF3KdLFNWt/3SLYz2vWVzjydRxaj8UL1WgNVfwLVeb89gXL4M52ymvsW9CxPICYCj4suMSglUy6p63AGEnR+yWba9hG2HpffCDKgmY+dFuXZ2tp/JWa7lOycV0GWW/QaWjfbd0Dvhu9HqRPB50QpAPY6xUUD1eq1/cf0+B5WeD6ozCYA2sZRanvSMKxbKJyfoKfjYNAD+Q7W8jVRzNpgumbkYE4PE+MSylns2I6yIalVPtDmRPzAUT6tFL6Rpk1kL3fGROoumaXnL8gI/F0LkHnAnV5ROiG2oOiPJkrAE/CQxydLPOnQq552KPX1Bs4Dpt8UyWxEq0H74faBmZHLYr+R6JcOoejSN190YuwvBqT7Ab65l9pzuk1bFdb9K1omWL1LOo+vhqumNPAtgDwVQhrBWv73MUrlfr8PZv1LuEzTLLQKlzyQKoCAXQKKHdZb9k8kJeboWRMpQmHijKDzFLBMLPX2MPJumQkP9k8p7AJJpmu44eKOjpswJjphJCpOX5vSwjsF5ZHUdY1qWRzA43d9t25rXcbzuTC+uN1AJXeSkSGHxw/VTAc+1bNbnWgWq+dS3oZ/bNrEI1oLG8rbzvs9ZfjkjeobmQ/VeVc0D9q5EAq045/R1n4TWgzAJ43YQ+RKBoFeG8x2b8v68X1NEvSjcvivdd8d9F45rKCC3nKO5SKAaLGYftfmqVAkhK3AIud9u23a773rkPQrOC+GtJjEdwcHsH/FYN0Dy4go0kQipnOSiZs6M99x2xviiuHy79zsXt7koJEkjEDmUqZxGL63gKHIW1A8FUFVfJYOX9WOwkgVSKGEyQtG6V5lQTK5E2J53ZkGtps8YzYBc0RtrfN8xSsEwvwabcSwWiWB6cJYLNLeSUVeDOH14PqoKfz3uksSiiSYjVJqOMbawwaNhtMtRAPj0+ePc+qjKWykJEHSaQxojtnAePKHoS6+XMAdIEYD5lv2GNvgiIFLAY6XjCIx0RofOGzrCjzQHEFonfyOfbxgsArCIBsNLaxWdl2VsTdvbkUQljwM2Xb+T8byhwcPtSPsmSfw17Rim5MyY5ovWbEagi0t+7gPrtxInHUrtKo+jqY/tFugWU6IoBIByinxwdcVAPacVRIs8InRtMP15dO1xABd/m6aEzUoLocJK0o3R0iU9B2VKNgT3uQnTdq07u3+K5q7zdHTvETInxnFAi0RJgK5GJMYIBsFja8FEQYdDIvBFwLvtUTVaG29dJ3q6CBlXhnOwYkgWJGkrCK7AbnM38/AVUVU+1rpRNvFmEC1LEpMv6Tkf8zjX0yEsN1y0GlNp6yca3buO27q+twPib1uuWhEWoGEIunpSzYudQ20Twzs/uKraNj6N875MwE1VdYMQm5YP3gPYFj3c/NoBsMWFiKHZO66zUt7Wdka1NnV2h3C9GhGcTEQrgpgz/h3VnLRdF4D7yMd3k922FXSn17bK8jgeTc0ZGt90GJWIA6S1uJx7o5Q85KGjSz/SO+xMa/WYbtP6KBGao6oOZr0drHVhi03cUlz+hALIiTIGDc5VP2ALqqDP5Tt7p/WzzKrnA1L9wg5ilW59WGe5L/7GrTMnuxFWeKEdVqlxaJ7QvfS2PcobtKgM6gIg1kp1tB22Ni38uT3K2aHufeLdcAKDxds9e98mbAevEgpqtejw4KZq4m4pzgWZ5F1rEbGmx+o2jOx1KrRcoT4Q5/oFqkxg3rE37ONR9bkik7nFOgR1zRbgXK/9K0htvZZgHEYLJOlQBpNAbXHPqL6W8u0VR3lZYlvE1q9Mc4rttq3nYlHVPACNSAKw/vV/wH8BVtbCQYmYM2EOgS80vDpHWYNy61rUTVP/dyL+BwudtHVhVmwyAAAAAElFTkSuQmCC
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://*.yiyaojd.com/*
// @match             *://*.vip.com/*
// @match             *://*.vipglobal.hk/*
// @exclude           *://login.taobao.com/*
// @exclude           *://login.tmall.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://wq.jd.com/*
// @require           https://lib.baomitu.com/jquery/1.8.3/jquery.min.js
// @require           https://lib.baomitu.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @antifeature       referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/509597/%21%11%20%E8%B6%85%E7%AE%80%E6%B4%81%E7%9A%84%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%82%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E8%AE%A9%E6%82%A8%E5%91%8A%E5%88%AB%E8%99%9A%E5%81%87%E9%99%8D%E4%BB%B7%E3%80%82%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/509597/%21%11%20%E8%B6%85%E7%AE%80%E6%B4%81%E7%9A%84%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%82%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E8%AE%A9%E6%82%A8%E5%91%8A%E5%88%AB%E8%99%9A%E5%81%87%E9%99%8D%E4%BB%B7%E3%80%82%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E4%B8%AD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var style = document.createElement('link');
    style.href = 'https://cdn.xuelg.com/shop/style.css';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.getElementsByTagName('head').item(0).appendChild(style);
    var apijiekou = 'https://api.shop.xuelg.com/';
    var url = location.href;
    var lsj = '<div class="coupon-time"><b>历史最低价：<span id="zuidijia">加载中...</span></b> 历史最高价：<span id="zuigaojia">加载中...</span></div>';
    function lsjxs(url){
        const lsjxs_time_id = setInterval( function () {
            if ($('#zuidijia').length && $('#zuigaojia').length) {
                $.get(apijiekou+url, function(data) {
                    document.getElementById("zuidijia").innerHTML = data.zuidijia;
                    document.getElementById("zuigaojia").innerHTML = data.zuigaojia;
                })
                clearInterval(lsjxs_time_id);
            }
        }, 100);
    }
    function ewmxs(url,sl){
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
                            } else {
                                return $(xl_class).after(wyh + lsj)
                            }
                        } else {
                            return window.location.replace(data.urltz)
                        }
                    }
                }
            }, 100);
        }
        $.get(apijiekou+'?id='+QueryString("id")+'&m=shangpin', function(data) {
            var yhq = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">优惠券 ' + data.coupon_amount + '元</div><div class="coupon-info2">' + data.coupon_info + '</div></div>'+
                    '<a class="coupon-get" href="' + data.coupon_click_url + '">立即领取</a></div><div class="coupon-time">优惠券截止时间：' + data.coupon_end_time + ' <b>剩余：'+ data.coupon_remain_count +'张</b></div>';
            var wyh = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">未查询到优惠券</div><div class="coupon-info2">' + data.qun + '</div></div>'+
                    '<a class="coupon-get" target="blank" href="' + data.search + '">搜索类似商品</a></div>';
            var ewm = '<div id="qrcode" style="position: fixed;bottom: 10px;right:50px;z-index: 9999;"><p class="coupon-time"><b>使用淘宝APP扫码购买此商品</b></p></div>';
            yhxs(data.class_arr,yhq,wyh,lsj,ewm,data)
            ewmxs(data.shorturl,159)
            lsjxs('lsjg/?tbid='+QueryString("id"))
        })
    } else if (url.indexOf("item.jd.") != -1 || url.indexOf("item.m.jd.") != -1 || url.indexOf("//item.yiyaojd.com/") != -1 || url.indexOf("//e.jd.com/") != -1 || url.indexOf("//pro.jd.com/") != -1 || url.indexOf("//pro.m.jd.com/") != -1 || url.indexOf("//story.m.jd.com/") != -1 || url.indexOf("//prodev.m.jd.com/") != -1 || url.indexOf("//prodev.jd.com/") != -1) {
        if (url.indexOf("://item.jd.com/coupons?") < 0) {
            if (url.includes("?")) {
                url = url.split("?")[0];
            }
            function jd_yhxs(xl_class_arr,yhq,wyh,lsj,ewm,data){
                const jd_yhxs_time_id = setInterval( function () {
                    for (let i = 0; i < xl_class_arr.length; i++) {
                        var xl_class = xl_class_arr[i];
                        if ($('div').is(xl_class)) {
                            clearInterval(jd_yhxs_time_id);
                            if (data.coupon_money) {
                                $(xl_class).after(yhq + lsj + ewm);
                            } else if (location.href.indexOf(data.sign) != -1) {
                                if (data.shortURL) {
                                    $(xl_class).after(wyh + lsj + ewm);
                                } else {
                                    $(xl_class).after(wyh + lsj);
                                }
                            } else {
                                window.location.replace(data.urltz);
                            }
                        }
                    }
                }, 100);
            }
            $.get(apijiekou+'jd/?url='+url, function(data) {
                var yhq = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">优惠券 ' + data.coupon_money + '元</div><div class="coupon-info2">' + data.coupon_info + '</div></div>'+
                        '<a class="coupon-get" href="' + data.clickURL + '">立即领取</a></div><div class="coupon-time">优惠券截止时间：' + data.coupon_final + '</div>';
                var wyh = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">未查询到优惠券</div><div class="coupon-info2">' + data.qun + '</div></div>'+
                        '<a class="coupon-get" target="blank" href="' + data.search + '">搜索相关优惠</a></div>';
                var ewm = '<div id="qrcode" style="position: fixed;bottom: 3px;right:50px;z-index: 9999;"><p class="coupon-time"><b>使用京东APP扫码购买此商品</b></p></div>';
                jd_yhxs(data.class_arr,yhq,wyh,lsj,ewm,data)
                ewmxs(data.shortURL,159)
                lsjxs('lsjg/?jdurl='+url)
            })
        }
    } else if (url.indexOf("//detail.vip.com/detail") != -1 || url.indexOf("//www.vipglobal.hk/detail") != -1 || url.indexOf("//m.vip.com/product") != -1) {
        if (url.includes("?")) {
            url = url.split("?")[0];
        }
        $.get(apijiekou+'vip/?url='+url, function(data) {
            var ewm = '<div id="qrcode" style="position: fixed;bottom: 3px;right:50px;z-index: 9999;"><p class="coupon-time"><b>使用微信或唯品会APP扫码购买</b></p></div>';
            if (data.url) {
                $('.pi-title-box').after(ewm);
                ewmxs(data.url,168)
            }
        })
    }  else {
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
            $.get(apijiekou+'?id='+nid+'&m=sousuo',function(data) {
                if (data.coupon_amount) {
                    $tmthis.html('<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="切换透明度">有券（减' + data.coupon_amount + '元）</a>');
                } else {
                    $tmthis.addClass("tb-cool-box-info-translucent");
                    $tmthis.html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" title="切换透明度">暂无优惠</a>');
                }
            })
        };
        $.get(apijiekou,function(data) {
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