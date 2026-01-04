// ==UserScript==
// @name         比价助手
// @description  精简的比价助手,查看价格曲线和比价,暂时只支持京东和天猫,其中天猫只支持价格曲线, 显示在商品详情页面的价格后面。本脚本为购物党比价脚本的精简版,数据均来源于购物党,如果需要完整版请使用购物党官方脚本或扩展。
// @namespace    https://greasyfork.org/zh-CN/scripts/373964-%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B
// @version      0.10
// @author       silentmoon
// @copyright    silentmoon
// @include      http*://item.jd.com*
// @include      http*://*detail.tmall.com*
// @grant        GM_xmlhttpRequest
// @connect      gwdang.com
// @require           https://cdn.bootcss.com/echarts/4.7.0/echarts.min.js
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373964/%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373964/%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var jq142 = jQuery.noConflict(true);
(function() {
    'use strict';
    var hideTimeout;
    var hideCompareTimeout;
    var obj;

    var bgInsertTo;

    var priceinsertTo;

    var priceLeft;
    var priceTop;
    var compareLeft;
    var compareTop;



    setTimeout(function() {
        init();
    }, 1000);

    function init() {
        if (location.hostname.indexOf("item.jd.com") == 0) {
            bgInsertTo = ".dd > .p-price";
            priceinsertTo = ".summary-price";
            priceLeft = -1;
            priceTop = 37;
            compareLeft = 150;
            compareTop = 37;
        } else if (location.hostname.indexOf("detail.tmall.com") >= 0) {

            if (jq142('.tm-promo-price > .tm-price').length > 0) {
                bgInsertTo = ".tm-promo-price > .tm-price";
            } else {
                bgInsertTo = ".tm-price";
            }
            priceinsertTo = ".tb-wrap > .tm-fcs-panel";
            priceLeft = 460;
            priceTop = 174;
            compareLeft = 600;
            compareTop = 174;
        }
        if (location.hostname.indexOf("item.jd.com") == 0) {

            jq142("<span  class='bj-bg3' style='display: none;' ><a href='#none' style='vertical-align: 2px ;text-decoration:underline;'>到手价:</a> <span class='bj-bg3-realPrice' style='color:red;vertical-align: 2px ;'>  ⠀⠀</span></span>").insertAfter(jq142(bgInsertTo));

            jq142("<div class='bj-realPrice'   style='box-shadow: 0 5px 15px 0 rgba(23,25,27,.15);display: none;background: #fff;position: absolute;clear: both;background-color: white;height: 150px; z-index: 999999;margin: 0;padding: 0;border-radius: 0 0 4px 4px;left: " + compareLeft + "px;top: " + compareTop + "px;width: 250px;border: 1px solid #ddd;border-top: none;'></div>").insertAfter(jq142(priceinsertTo));
            jq142(".bj-realPrice").append("<ul class='bj_realPrice_list'></ul>");

        }

        jq142("<span>&nbsp;&nbsp;</span><a class='bj-bg' href='#none' style='vertical-align: 2px ;text-decoration:underline '>价格曲线</a><span class='bj-bg1'>⠀⠀</span>").insertAfter(jq142(".bj-bg3"));

        jq142("<div class='bj-price'   style='box-shadow: 0 5px 15px 0 rgba(23,25,27,.15);display: none;background: #fff;position: absolute;clear: both;background-color: white;height: 400px; z-index: 999999;margin: 0;padding: 0;border-radius: 0 0 4px 4px;left: " + priceLeft + "px;top: " + priceTop + "px;width: 750px;border: 1px solid #ddd;border-top: none;'></div>").insertAfter(jq142(priceinsertTo));

        jq142(".bj-price").append("<div   style='margin-left:50px;margin-top:20px;display: block;'><a class='active-plot type-plot' id='plotAll'>全部</a><a class='type-plot' id='plotYear'>年线</a><a class='type-plot' id='plotMonth'>月线</a>");
        jq142(".bj-price").append("<div id='main-price' style='width: 720px;height:350px;margin: 0;padding: 0'></div>");

        if (location.hostname.indexOf("item.jd.com") == 0) {
            jq142("<a class='bj-bg2' href='#none' style='vertical-align: 2px ;text-decoration:underline '>价格比较</a><span>⠀⠀</span>").insertAfter(jq142(".bj-bg1"));

            jq142("<div class='bj-compare'   style='box-shadow: 0 5px 15px 0 rgba(23,25,27,.15);display: none;background: #fff;position: absolute;clear: both;background-color: white;height: 400px; z-index: 999999;margin: 0;padding: 0;border-radius: 0 0 4px 4px;left: " + compareLeft + "px;top: " + compareTop + "px;width: 250px;border: 1px solid #ddd;border-top: none;'></div>").insertAfter(jq142(priceinsertTo));
            jq142(".bj-compare").append("<ul class='bj_buy_list'></ul>");

        }
        jq142(".type-plot").css({ "cursor": "pointer", "padding-left": "10px", "padding-right": "10px", "text-decoration": "underline" });
        jq142(".active-plot").css({ "text-decoration": "none", "font-weight": "bold" });

        jq142(".bj-bg").mouseover(function() {
            jq142(".bj-price").show();
        }).mouseout(function() {
            hideTimeout = setTimeout(function() {
                jq142(".bj-price").hide();
            }, 200);

        });

        jq142(".bj-bg3").mouseover(function() {
            jq142(".bj-realPrice").show();
        }).mouseout(function() {
            jq142(".bj-realPrice").hide();

        });


        jq142(".bj-price").mouseenter(function() { clearTimeout(hideTimeout); }).mouseleave(function() {
            jq142(".bj-price").hide();
        });


        jq142(".bj-bg2").mouseover(function() {
            jq142(".bj-compare").show();
        }).mouseout(function() {
            hideCompareTimeout = setTimeout(function() {
                jq142(".bj-compare").hide();
            }, 200);

        });

        jq142(".bj-compare").mouseenter(function() { clearTimeout(hideCompareTimeout) }).mouseleave(function() {
            jq142(".bj-compare").hide();
        });
        jq142(".type-plot").click(function(e) {

            jq142(".type-plot").css({ "text-decoration": "underline", "font-weight": "normal" });
            jq142(e.target).css({ "text-decoration": "none", "font-weight": "bold" });
            var data1;

            if (e.target.id == "plotAll") {
                if (obj.store.length > 1) {
                    data1 = obj.store[1].all_line;
                }
                showChart(obj.store[0].all_line, obj.store[0].all_line_begin_time, data1);
            } else if (e.target.id == "plotYear") {
                if (obj.store.length > 1) {
                    data1 = obj.store[1].year_line;
                }
                showChart(obj.store[0].year_line, obj.store[0].year_line_time, data1);
            } else if (e.target.id == "plotMonth") {
                if (obj.store.length > 1) {
                    data1 = obj.store[1].month_line;
                }

                showChart(obj.store[0].month_line, obj.store[0].month_line_time, data1);
            }
        });
        var myChart = echarts.init(document.getElementById('main-price'));



        var url = location.href;

        var gwdUrl = "https://browser.gwdang.com/extension/price_towards?ver=1&format=jsonp&&url=" + encodeURIComponent(url);

        GM_xmlhttpRequest({
            url: "https://browser.gwdang.com/extension/price_towards?ver=1&format=jsonp&&url=" + encodeURIComponent(url),
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'public'
            },
            onload: function(data) {


                obj = JSON.parse(data.responseText);
                if (obj.is_ban == 1) {
                    console.log('ssss');
                    opWind(obj.action.to, '1', '请验证后刷新页面！', '');
                    return;
                }

                if (obj.store[0].all_line == null) {
                    jq142("#plotAll").hide();
                }
                if (obj.store[0].year_line == null) {
                    jq142("#plotYear").hide();
                }

                if (obj.store[0].month_line == null) {
                    jq142("#plotMonth").hide();
                }
                var data1;
                if (obj.store.length > 1) {
                    data1 = obj.store[1].all_line;
                }
                showChart(obj.store[0].all_line, obj.store[0].all_line_begin_time, data1);
                var realPriceData;
                var promo;
                if (obj.nopuzzle_promo) {
                    promo = obj.nopuzzle_promo;
                } else if (obj.promo) {
                    promo = obj.promo;
                } else {
                    return;
                }
                if (promo.length > 0) {
                    realPriceData = promo[promo.length - 1];


                    if (realPriceData.time == obj.now_day / 1000 - 28800) {

                        jq142(".bj-bg3-realPrice").text(realPriceData.price / 100);
                        jq142(".bj-bg3").show();


                        var html = "";
                        if (realPriceData.msg) {
                            if (realPriceData.msg.promotion && realPriceData.msg.promotion.indexOf("plus") < 0) {
                                html += "<li class='bj_li'> <span class='bj_gwd_title' style='padding-left:10px;'>促</span><span class='bj_c_price '>" + realPriceData.msg.promotion + "</span></li>";
                            }
                            if (realPriceData.msg.coupon) {
                                html += "<li class='bj_li'> <span class='bj_gwd_title' style='padding-left:10px;'>券</span><span class='bj_c_price '>" + realPriceData.msg.coupon + "</span></li>";
                            }
                        }
                        jq142(".bj_realPrice_list").append(html);
                    }
                }

            }
        });

        var compareUrl = "https://browser.gwdang.com/brwext/dp_query_latest?permanent_id=&union=union_gwdang&url=" + encodeURIComponent(url);
        GM_xmlhttpRequest({
            url: compareUrl,
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'public'
            },
            onload: function(data) {


                var jsonStr = data.responseText;

                if (!jsonStr) {
                    return;
                }
                var d = JSON.parse(jsonStr).b2c.store;

                for (var i = 0; i < d.length; i++) {
                    var html = "<li class='bj_li'><img class='bj_store' src='" + d[i].icon_url + "'><a href='" + getParam(d[i].url, "target_url") + "' title='" + d[i].site_name + "' target='_blank'><span class='bj_gwd_title '>" + d[i].site_name + "</span><span class='bj_c_price '>" + d[i].price / 100 + "</span></a></li>";
                    jq142(".bj_buy_list").append(html);
                }
                jq142(".bj_store").css({ "float": "left", "overflow": "hidden", "margin": "8px 7px 4px 14px", "width": "16px", "height": "16px" });
                jq142(".bj_gwd_title").css({ "height": "33px", "margin": "0", "float": "left", "font-size": "14px", "font-weight": "700", "max-width": "170px", "overflow": "hidden", "width": "auto" });
                jq142(".bj_c_price").css({ "color": "#E4393C", "font-weight": "700", "line-height": "33px", "height": "33px", "width": "auto", "float": "right", "font-size": "14px", "margin-right": "14px" });
                jq142(".bj_li").css({ "border-bottom": "1px solid #edf1f2", "overflow": "hidden", "width": "100%", "height": "33px", "line-height": "33px" });
            }
        });

        function showChart(data, beginTime, data1) {

            var dt = [];
            for (var i = 0; i < data.length; i++) {
                var d = new Date(beginTime);
                d.setDate(d.getDate() + i);
                dt.push(d.toLocaleDateString());
            }

            // 指定图表的配置项和数据
            var option = {

                tooltip: {
                    enterable: true,
                    trigger: 'axis',
                    formatter: function(params) {

                        return params[0].axisValue + "<br/>" + params[0].data;
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data: ['页面价', '到手价'],
                    selected: {
                        '到手价': false

                    }

                },
                xAxis: {
                    data: dt,
                    splitArea: { show: false },
                    boundaryGap: false,
                    splitLine: {
                        show: true,

                    },
                    axisLabel: {

                        interval: parseInt((data.length) / 10),
                        formatter: function(value) {

                            return value.substring(5);
                        }
                    },
                },
                yAxis: {
                    splitArea: { show: false },
                    splitLine: {
                        show: true,

                    }
                },
                series: [{
                        name: '页面价',
                        type: 'line',
                        data: data,
                        showSymbol: false,
                        hoverAnimation: false,
                        markPoint: {
                            symbol: 'pin',

                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '到手价',
                        type: 'line',
                        data: data1,
                        showSymbol: false,
                        hoverAnimation: false,
                        markPoint: {
                            symbol: 'pin',

                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }
                ]
            };


            myChart.setOption(option);
        }

    }

    function opWind(purl, pisweb, pname, phml) {
        var url = purl;
        var name = pname;
        var iWidth = 800;
        var iHeight = 450;
        var iTop = (window.screen.height - 30 - iHeight) / 2;
        var iLeft = (window.screen.width - 10 - iWidth) / 2;
        
        var insWind = document.createElement("iframe");
        // insWind.src = "javascript:(function(){document.write("+insWind+")})()";
        insWind.innerHTML = phml;
        document.body.appendChild(insWind);
    }

    function getParam(url, paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|jq142)", "i");
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


})();