// ==UserScript==
// @name         京东图书豆瓣评分
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  京东图书详情页及购物车图书类商品显示豆瓣评分
// @author       罗辣耳朵
// @include      http*://cart.jd.com/*
// @include      http*://item.jd.com/*
// @grant        GM_xmlhttpRequest
// @require       http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393956/%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/393956/%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isbnReg = new RegExp('<li title="([-0-9]+)">ISBN：\\1</li>', "gi");
    var bookRatedURL = "http://111.229.55.106/isbn/";
    var rankInfoCache = {};

    // 获取填充的背景颜色
    function getBackground(star) {
        var background = "#869B74";
        if (star >= 9.0){
            background = "#EACF02";
        }
        else if (star >= 8.5) {
            background = "#6C890B";
        }
        else if (star >= 8.0) {
            background = "#ABC327";
        }

        return background;
    }

    // 获取填充的文字
    function getStarText(star, persons) {
        return star == "0.0" ? "评价人数不足，暂无评分" : "评分：" + star + "（" + persons + "人评价）";
    }

    // 设置填充的背景颜色
    function setBackground($item, star, persons) {
        star = parseInt(star);
        persons = parseInt(persons);
        if (star >= 7.5 && persons > 999) {
            var background = getBackground(star);
            $item.css({"background":background});
        }
    }

    // ISBN服务的回调方法
    function isbnServiceCallback(data, params) {
        var $item = params["item"];
        var $backgroundItem = params["backgroundItem"];
        var isAppend = params["isAppend"] || false;
        var result = data.response;
        var persons = parseInt(result.persons);
        var rankInfo = {
            url: result.url,
            star: result.star,
            originalPersons: result.persons,
            persons: persons
        };

        addDoubanRankInfo($item, rankInfo, isAppend);
        setBackground($backgroundItem, rankInfo.star, rankInfo.persons);
    }

    // 添加豆瓣评分信息
    function addDoubanRankInfo($addedItem, data, isAppend) {
        var $star = $("<div class='plus' style='color:#5FD9CD'></div>");

        try {
            $star.text(getStarText(data.star, data.persons));
            isAppend ? $addedItem.append($star) : $addedItem.after($star);
        }
        catch (e) {
            $star.text(data.star + data.persons);
            isAppend ? $addedItem.append($star) : $addedItem.after($star);
            console.log(e);
        }

        // 添加直达豆瓣评价链接
        var $link = $("<a href='" + data.url + "' style='color:#00B51D; text-decoration:underline' target='_blank'>直达豆瓣</a>");
        $star.append($link);

        // 添加直达价格趋势链接
        var url = isAppend ? window.location.href : "http:" + $addedItem.parent().find(".item-form .goods-item .p-img a").attr("href");
        var $priceLink = $("<a href='http://p.zwjhl.com/price.aspx?url=" + encodeURI(url) + "' style='color:#f60; text-decoration:underline; margin-left:10px;' target='_blank'>价格趋势</a>");
        $star.append($priceLink);
    }

    // 调用图书评分服务
    function invokeISBNService(href, callback, params) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            responseType: "json",
            synchronous: true,
            headers: {
                'Accept': 'text/html, application/xhtml+xml, */*',
            },
            onload: (data) => {
                if (data.status != 200) {
                    console.log("isbn service error!");
                    return;
                }

                callback(data, params);
            },
            onerror:function () {
                console.log("get book detail html error");
            }
        });
    }

    // 购物车处理逻辑
    function cart() {
        var $items = $(".item-form");
        $.each($items, (i, e) => {
            var $item = $(e);
            var $itemInfo = $item.find(".goods-item .p-name a");
            var href = "https:" + $itemInfo.attr("href");
            GM_xmlhttpRequest({
                method: 'GET',
                url: href,
                overrideMimeType: "text/xml",
                synchronous: true,
                headers: {
                    'User-agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)',
                    'Accept': 'text/html, application/xhtml+xml, */*',
                },
                onload: (data) => {
                    var content = data.responseText;
                    if (isbnReg.test(content)) {
                        var isbn = RegExp.$1;
                        console.log($item);
                        invokeISBNService(bookRatedURL + isbn, isbnServiceCallback, { "item": $item, "backgroundItem": $item.parent() });
                        isbnReg.lastIndex = 0;
                    }
                    else {
                        console.log(href + " not found isbn");
                    }
                },
                onerror: function () {
                    console.log("get book detail html error");
                }
            });
        });
    }

    // 详情页处理逻辑
    function detail() {
        var parameters = $(".p-parameter ul li");
        for (var i = 0; i < parameters.length; i++) {
            var $parameter = $(parameters[i]);
            if ($parameter.text().startsWith("ISBN")) {
                var isbn = $parameter.text();
                isbn = isbn.substring("ISBN：".length);
                var params = { "item": $(".sku-name"), "backgroundItem": $(".sku-name .plus"), "isAppend": true};
                invokeISBNService(bookRatedURL + isbn, isbnServiceCallback, params);
                break;
            }
        }
    }

    // 加载豆瓣评分
    function loadDoubanRank() {
        location.hostname.startsWith("cart") ? cart() : detail();
    }

    loadDoubanRank();

    $(".jdcheckbox").on("click", function(e) {
        // setTimeout(function () {loadDoubanRank();}, 2000);
    });
})();