// ==UserScript==
// @name         交大运动场馆预约快速提交
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  快速提交交大运动场馆预约
// @author       danyang685
// @match        https://sports.sjtu.edu.cn/phone/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437640/%E4%BA%A4%E5%A4%A7%E8%BF%90%E5%8A%A8%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6%E5%BF%AB%E9%80%9F%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/437640/%E4%BA%A4%E5%A4%A7%E8%BF%90%E5%8A%A8%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6%E5%BF%AB%E9%80%9F%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.Date = new Proxy(Date, {
        construct: function (target, args) {
            if (args.length === 0) {
                let n = new target()
                n.setSeconds(n.getSeconds() + 15) // 该时间目前最大为30秒，提前看到结果列表
                return n
            }
            return new target(...args)
        }
    })

    alert = () => {}

    let last_alert_shown = false

    let last_scrolllength = 0

    function interval_mobile() {
        const now_alert_shown = $("#app > div.main > div.vux-x-dialog.showToastStyle > div.weui-dialog").css("display") == "table"
        if (last_alert_shown != now_alert_shown) {
            last_alert_shown = now_alert_shown
            if (now_alert_shown) {
                if ($("#app > div.main > div.vux-x-dialog.showToastStyle > div.weui-dialog > div > div.vux-check-icon > i.weui-icon.weui_icon_success.weui-icon-success").css("display") == "none") {
                    $("#app > div.main > div.vux-x-dialog.showToastStyle > div.weui-dialog > div > div.vux-check-icon > span").click()
                }
                $("#app > div.main > div.vux-x-dialog.showToastStyle > div.weui-dialog > div > div.btnStyle > button.weui-btn.btnisOk.btn.weui-btn_primary").click()
                setTimeout(function () {
                    $("#app > div.main > div.vux-tab-wrap > div > div > div.vux-tab-item.vux-center.vux-tab-selected").click()
                }, 1)
            }
        }

        {
            const date_items_1 = $("#app > div:nth-child(2) > div:nth-child(3) > div.vux-slider > div.vux-swiper > div")
            const date_items_2 = $("#app > div.main > div.vux-tab-wrap > div > div")
            let date_item_active = undefined

            if (date_items_1.find(".itemList").length > 5) {
                date_item_active = $(date_items_1[0])
            } else if (date_items_2.find(".itemList").length > 5) {
                date_item_active = $(date_items_2[0])
            } else {
                date_item_active = undefined
            }
            if (date_item_active) {
                const list = $(date_item_active[0])
                const date1 = convertDate(list.find("div:nth-child(1) p:nth-child(2)").html().trim().replaceAll("-", ""))
                const date2 = convertDate(list.find("div:nth-child(2) p:nth-child(2)").html().trim().replaceAll("-", ""))
                if (localStorage.getItem("my_setreversed") == "1" ? (date1 < date2) : (date1 > date2)) {
                    list.html(list.children().get().reverse())
                    $("#app > div.main > div.vux-tab-wrap > div > div > div.vux-tab-ink-bar").remove()
                }
            }

            if ((new RegExp(`${"&tension=[13]"}$`)).test(location.hash)) { // 超出预约时段限制进行预约
                let new_url = new URL(location)
                new_url.hash = new_url.hash.replace(new RegExp("&tension=[13]", 'g'), "&tension=0")
                location.replace(new_url)
                location.reload()
            }
        }
        if ($(".addressInfo").length) {
            const address_info = $(".addressInfo")
            if (address_info.children(".blue").length) {
                address_info.children(".blue").remove();
                address_info.append($('<div class="my-control"></div>'))
                $(".my-control")
                    .css("width", "80px")
                    .css("height", "100px")
                    .css("margin", "10px 20px")
                    .css("background-color", "#c0ffff")
                    .css("border-radius", "3px")
                    .css("padding", "3px 3px")
                    .append('<div class="my-control-button" id="control_reverse"></div>')
                $(".my-control-button")
                    .css("font-size", "15px")
                    .css("line-height", "15px")
                    .css("background-color", "#5affc2")
                    .css("border-radius", "1px")
                    .css("height", "20px")
                    .css("width", "fit-content")
                    .css("margin", "auto")
                $(".my-control>#control_reverse").text(localStorage.getItem("my_setreversed") == "1" ? "逆序" : "正序").click(function () {
                    if ($(".my-control>#control_reverse").text() == "正序") {
                        localStorage.setItem("my_setreversed", "1")
                        $(".my-control>#control_reverse").text("逆序")
                    } else {
                        localStorage.removeItem("my_setreversed")
                        $(".my-control>#control_reverse").text("正序")
                    }
                })

            }
        }


        if (location.hash == '#/orderList') {
            let shown_item_count = 0;
            let hidden_item = new Array()
            $(".mainList.list-main>.list-item").each(function (idx, el) {
                const status_str = $(el).find("div:nth-child(1) > span.fontSize26").text()
                if (status_str == '支付超时取消' || status_str == '已取消') {
                    hidden_item.push(el)
                }
                if ($(el).css("display") != "none") {
                    shown_item_count++
                }
            })
            hidden_item.forEach((el) => {
                if (shown_item_count <= 6) { // 至少显示6个项目，防止无法下滑翻页
                    return
                } else {
                    if ($(el).css("display") != "none") {
                        $(el).css("display", "none")
                        shown_item_count--
                    }
                }
            })

            let order_items = $(".mainList.list-main>.list-item").get()
            let order_list = $(".mainList.list-main")[0]
            let load = $(".mainList.list-main>.vux-loadmore").get()
            order_items.sort(function (a, b) {
                const t1 = parseInt($(a).find("div.padding10.flex.gray.fontSize26 > span:nth-child(1)").text().replaceAll('-', ''))
                const t2 = parseInt($(b).find("div.padding10.flex.gray.fontSize26 > span:nth-child(1)").text().replaceAll('-', ''))
                return t2 - t1
            })
            $('.mainList.list-main').prepend(order_items);

            if (order_list.scrollHeight != last_scrolllength) { // 新页面产生后，微微向上滑动，防止无限获取下一页
                if (order_list.scrollHeight - (order_list.scrollTop + order_list.clientHeight) < 300) {
                    order_list.scrollTop = (order_list.scrollHeight - order_list.clientHeight) - 100
                    last_scrolllength = order_list.scrollHeight
                }
            }


        } else {
            last_scrolllength = 0;
        }
    }

    function convertDate(date_str) { // 修复跨年问题
        if (date_str.startsWith("01")) {
            return '13' + date_str.slice(2, 5)
        } else {
            return date_str
        }
    }

    setInterval(function () {
        interval_mobile()
    }, 100)

    window.onload = function () {
        var bodyList = document.querySelector("body"),
            observer = new MutationObserver(function (mutations) {
                //interval_mobile()
            })
        var config = {
            childList: true,
            subtree: true
        }
        observer.observe(bodyList, config)
    }
})()