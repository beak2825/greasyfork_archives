// ==UserScript==
// @name         Douban Movie ReleaseDate
// @namespace    https://greasyfork.org/users/34380
// @version      20200422
// @description  豆瓣电影我看，增加上映时间排序，移除修改按钮。
// @match        https://movie.douban.com/people/*/wish
// @match        https://movie.douban.com/people/*/collect
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397950/Douban%20Movie%20ReleaseDate.user.js
// @updateURL https://update.greasyfork.org/scripts/397950/Douban%20Movie%20ReleaseDate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.querySelector("head").insertAdjacentHTML("beforeend", `<style>
        .grid-view {
            display: flex;
            flex-direction: column;
        }
    </style>`);

    document.querySelector(".article").insertAdjacentHTML("afterbegin", `<div><a id="run-dmrd">运行上映排序脚本</a><span class="gray-dot">·</span><a id="reverse-order">排序反转</a></div>`);

    document.querySelector("#run-dmrd").addEventListener("click", runDmrd);
    document.querySelector("#reverse-order").addEventListener("click", reverseItemsOrder);

    var $grid_view = document.querySelector(".grid-view");
    var items_all = document.querySelectorAll(".grid-view > .item");

    function runDmrd () {
        orderItems(items_all);
        removeItemsEditButton(items_all);
        load_page_queue.next();
        document.querySelector("#run-dmrd").outerHTML = "";
    };
    function reverseItemsOrder () {
        items_all = document.querySelectorAll(".grid-view > .item");
        for (var item of items_all) {
            item.style.order = -item.style.order;
        }
    };

    function orderItems(items) {
        for (var item of items) {
            var intro = item.querySelector(".intro").innerText;
            var date = (intro.match(/\d{4}-\d{2}-\d{2}/) || ["0"])[0];
            item.style.order = parseInt(date.replace(/-/g, ""), 10);
        }
    }

    var total_page = document.querySelector(".thispage").getAttribute("data-total-page");
    var page_href = document.querySelector(".paginator > a").getAttribute("href");
    var parameters = page_href.match(/(.+start=)\d+(&sort=.+)$/);

    var load_page_queue = loadPageQueue();

    function* loadPageQueue() {
        for (var i = 0; i < total_page; i++) {
            console.log(i);
            yield loadPage(i + 1);
        }
    }

    function loadPage(index) {
        fetch("https://movie.douban.com" + parameters[1] + 15 * index + parameters[2])
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                var el = (new DOMParser()).parseFromString(text, 'text/html');
                var items = el.querySelectorAll(".grid-view > .item");
                orderItems(items);
                insertNodelist("beforeend", items, $grid_view);
                addItemsEvent(items);
                removeItemsEditButton(items);
                load_page_queue.next();
            });
    }

    function insertNodelist(position, nodelist, parentnode) {
        for (var node of nodelist) {
            parentnode.insertAdjacentElement(position, node);
        }
    }

    function delMovie () {
        $(this).parents("div.item").hide();
        var url = "/j/mine/j_cat_ui";
        if (/\/location\//.test(location.href)) {
            url = "/location" + url;
        }
        $.post_withck(url, {
            sid: this.rel
        }, function (sjson) {
            var ret = eval("(" + sjson + ")");
            if (!ret.result) {
                alert("出错了，请稍后重试!");
            }
        });
    }

    function addItemsEvent(items) {
        for (var item of items) {
            item.querySelector(".d_link").addEventListener("click", delMovie);
        }
    }

    function removeItemsEditButton(items) {
        for (var item of items) {
            item.querySelector(".j.a_collect_btn").outerHTML = "";
        }
    }
})();