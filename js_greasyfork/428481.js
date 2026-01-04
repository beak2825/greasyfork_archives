// ==UserScript==
// @name         网易Buff计算Steam和buff大概的折扣
// @version      1.1.3
// @description  添加折扣
// @author       redbirdztc
// @match        *://buff.163.com/market/?game=*
// @icon         https://www.google.com/s2/favicons?domain=163.
// @grant        none
// @namespace https://greasyfork.org/users/787032
// @downloadURL https://update.greasyfork.org/scripts/428481/%E7%BD%91%E6%98%93Buff%E8%AE%A1%E7%AE%97Steam%E5%92%8Cbuff%E5%A4%A7%E6%A6%82%E7%9A%84%E6%8A%98%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/428481/%E7%BD%91%E6%98%93Buff%E8%AE%A1%E7%AE%97Steam%E5%92%8Cbuff%E5%A4%A7%E6%A6%82%E7%9A%84%E6%8A%98%E6%89%A3.meta.js
// ==/UserScript==



(function () {
    'use strict';
    // @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js

    function calcOff(goods_id) {
        $.ajax("https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=" + goods_id + "&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1&_=" + new Date().valueOf(), {
            "success": function (res) {
                var streamPrice = res.data.goods_infos[goods_id].steam_price_cny
                var buffPrice = res.data.items[0].price
                console.log(res.data.goods_infos[goods_id].name + "\nbuffPrice:" + buffPrice + "\noff:" + (buffPrice / (streamPrice * 0.85) * 10).toFixed(2) + "\n" + "https://buff.163.com/market/goods?goods_id=" + goods_id + "&from=market#tab=selling")
            }
        })
    }

    function calcPageOff(game, page_num) {
        var get_goods_url = "https://buff.163.com/api/market/goods?game=" + game + "&page_num=" + page_num + "&_=" + new Date().valueOf()
        $.ajax(get_goods_url, {
            "success": function (resp) {
                var sleepTime = 0
                for (var i = 0; i < resp.data.items.length; i++) {
                    sleepTime += Math.ceil(Math.random() * 1000 + 200)
                    setTimeout(function (index) {
                        var goods_id = resp.data.items[index].id
                        calcOff(goods_id)
                    }, sleepTime, i)
                }
            }
        })
    }

    function appendElement() {
        $(".market-list").find(".market-header.black").find(".criteria").append("<div class=\"l_Right\"> <div class=\"w-Search\" id=\"j_search\"> <span> <input type=\"text\" name=\"game_type_off\" class=\"i_Text\" placeholder=\"游戏类型\" size=\"30\" style=\"width: 68px;\"> </span> <span> <input type=\"text\" name=\"page_num_off\" class=\"i_Text\" placeholder=\"页码\" size=\"30\" style=\"width: 68px;\"> </span> <a href=\"javascript:;\" style=\"padding: 0 16px;\" name=\"calc_off_btn\"\"><i class=\"icon icon_search\"></i>搜索</a> </div> </div>")
    }
    appendElement();
    var criteria$ = $(".market-list").find(".market-header.black").find(".criteria")
    var calc_off_btn$ = criteria$.find("[name='calc_off_btn']")
    calc_off_btn$.on("click", function () {


        var game = criteria$.find("[name='game_type_off']").val()
        var page_num = criteria$.find("[name='page_num_off']").val()
        console.log("clicked")
        calcPageOff(game, page_num);
    })
})();
