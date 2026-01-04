// ==UserScript==
// @name         ヤフオクの入札件数順表示を更に終了時刻順番で並び替え
// @namespace    https://hisaruki.ml/
// @version      2
// @description  ヤフオクの検索結果が入札件数順で表示されている時に、その内容を更に終了時刻順番で並び替える
// @author       hisaruki
// @match        https://auctions.yahoo.co.jp/*
// @icon         https://www.google.com/s2/favicons?domain=yahoo.co.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435500/%E3%83%A4%E3%83%95%E3%82%AA%E3%82%AF%E3%81%AE%E5%85%A5%E6%9C%AD%E4%BB%B6%E6%95%B0%E9%A0%86%E8%A1%A8%E7%A4%BA%E3%82%92%E6%9B%B4%E3%81%AB%E7%B5%82%E4%BA%86%E6%99%82%E5%88%BB%E9%A0%86%E7%95%AA%E3%81%A7%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435500/%E3%83%A4%E3%83%95%E3%82%AA%E3%82%AF%E3%81%AE%E5%85%A5%E6%9C%AD%E4%BB%B6%E6%95%B0%E9%A0%86%E8%A1%A8%E7%A4%BA%E3%82%92%E6%9B%B4%E3%81%AB%E7%B5%82%E4%BA%86%E6%99%82%E5%88%BB%E9%A0%86%E7%95%AA%E3%81%A7%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const Append = function(products){
        $("ul.Products__items").css("filter", "grayscale(1)");
        if(products.filter(x => ($(x).find(".Product__bid").text() - 0) == 0).length == 0){
            let a = $(".Pager__list a").eq(0);
            let href = a.attr("href");
            a.remove();
            console.log(href);
            fetch(href)
                .then(response => response.text())
                .then(function (html) {
                    $(html).find(".Product").each(function(){
                        $("ul.Products__items").append($(this));
                    });
                    Append(Array.from($(html).find("ul.Products__items li.Product")));
                });
        }else{
            Sort();
        }
    }

    const Sort = function(){
        let root = $("ul.Products__items");
        let products = [];
        root.find("li.Product").each(function(){
            products.push($(this).clone());
            $(this).remove();
        });
        products.filter(x => {
            return (x.find(".Product__bid").text() - 0) > 0;
        })
        .sort((a, b) => {
            a = a.find("[data-auction-endtime]").attr("data-auction-endtime") - 0;
            b = b.find("[data-auction-endtime]").attr("data-auction-endtime") - 0;
            return a - b;
        }).map(x => {
            root.append(x);
            return true;
        });
        products.filter(x => {
            return (x.find(".Product__bid").text() - 0) == 0;
        }).map(x => {
            root.append(x);
            return true;
        });
        $("ul.Products__items").css("filter", "grayscale(0)");
    }

    let u = new URLSearchParams(document.URL);
    if(u.get("s1") == "bids" && u.get("o1") == "a"){
        Append(Array.from($("ul.Products__items li.Product")));
    }

    // Your code here...
})();