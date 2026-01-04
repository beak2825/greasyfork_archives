// ==UserScript==
// @name         哔哩哔哩漫画批量购买
// @namespace    dzj0821
// @version      1.0
// @description  在漫画购买界面点击拓展栏图标-批量购买漫画使用
// @author       dzj0821
// @include      http*://manga.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509551/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/509551/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==

GM_registerMenuCommand("批量购买漫画", function() {
    var regex = /https:\/\/manga\.bilibili\.com\/.*?\/(\d+).*/;
    var url = window.location.href;
    var match = url.match(regex);
    if (!match) {
        alert("请在漫画购买页面使用此脚本");
        return;
    }
    var ep_id = parseInt(match[1]);
    console.log("ep_id: " + ep_id);
    var count = parseInt(window.prompt("请输入需要购买的话数"));
    if (!count) {
        return;
    }
    var buy_method = parseInt(window.prompt("请输入购买方式，5通用券 2漫读券"));
    if (!buy_method) {
        return;
    }

    //获取漫画id
    GM_xmlhttpRequest({
        url: "https://manga.bilibili.com/twirp/comic.v1.Comic/GetEpisodeBuyInfo?device=pc&platform=web",
        method: "POST",
        data: JSON.stringify({
            "ep_id": ep_id
        }),
        headers: {
            "Content-Type": "application/json"
        },
        onerror: function (xhr) {
            console.log(xhr);
            alert("脚本发生错误");
        },
        onload: function (response) {
            let data = JSON.parse(response.responseText)
            if (data.code != 0) {
                alert("脚本发生错误，错误信息：" + data.msg);
                return;
            }
            var coupon_id = data.data.recommend_coupon_id;
            var comic_id = data.data.comic_id;
            console.log("coupon_id: " + coupon_id + ", comic_id: " + comic_id);
            getList(coupon_id, comic_id, ep_id, count, buy_method);
        }
    });
});

/**
 * 获取漫画话数列表（列表是倒序的）
 * @param {*} coupon_id 漫画id
 * @param {*} comic_id 漫画的另一个id
 * @param {*} ep_id 话数id
 * @param {*} count 购买数量
 */
function getList(coupon_id, comic_id, ep_id, count, buy_method) {
    GM_xmlhttpRequest({
        url: "https://manga.bilibili.com/twirp/comic.v2.Comic/ComicDetail?device=pc&platform=web",
        method: "POST",
        data: JSON.stringify({
            "comic_id": comic_id
        }),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            let data = JSON.parse(response.responseText)
            if (data.code != 0) {
                alert("getList 脚本发生错误，错误信息：" + data.msg);
                return;
            }
            var list = data.data.ep_list;
            var index;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == ep_id) {
                    console.log("从第" + i + "话开始购买");
                    index = i;
                    break;
                }
            }
            buy(coupon_id, list, index, count, buy_method);
        },
        error: function (xhr) {
            console.log(xhr);
            alert("脚本发生错误");
        }
    });
}

/**
 * 购买漫画
 * @param {*} coupon_id 漫画id
 * @param {*} list 话数列表
 * @param {*} index 购买的话数在列表中的下标
 * @param {*} count 剩余购买的话数
 * @param {*} buy_method 购买方式
 */
function buy(coupon_id, list, index, count, buy_method) {
    if (index < 0) {
        alert("所有话已购买完毕");
        return;
    }
    GM_xmlhttpRequest({
        url: "https://manga.bilibili.com/twirp/comic.v1.Comic/BuyEpisode?device=pc&platform=web",
        method: "POST",
        data: JSON.stringify({
            "buy_method": buy_method,
            "ep_id": list[index].id,
            "coupon_id": coupon_id,
            "auto_pay_gold_status": 2
        }),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            let data = JSON.parse(response.responseText)
            if (data.code != 0 || data.msg != "") {
                alert("buy 脚本发生错误，错误信息：" + data.msg);
                alert("剩余" + count + "话未购买");
                return;
            }
            count--;
            console.log("购买成功，还剩" + count + "话");
            if (count > 0) {
                buy(coupon_id, list, index - 1, count, buy_method);
            } else {
                alert("购买完成");
            }
        }
    })
}