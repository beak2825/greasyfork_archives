// ==UserScript==
// @name         去哪拨打电话
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://fuwu.qunar.com/index.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421196/%E5%8E%BB%E5%93%AA%E6%8B%A8%E6%89%93%E7%94%B5%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/421196/%E5%8E%BB%E5%93%AA%E6%8B%A8%E6%89%93%E7%94%B5%E8%AF%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.allOrderNumberLi = [];
    window.zvpRefundTicket = {};    // zvp 退票
    window.zvpChangeTicket = {};    // zvp 改签
    window.lmjRefundTicket = {};    // lmj 退票
    window.lmjChangeTicket = {};    // lmj 改签
    window.vwlRefundTicket = {};    // vwl 退票
    window.vwlChangeTicket = {};    // vwl 改签

    /*
    打电话
     */
    window.callPhone = function (content) {
        console.log("成功拨打电话");
        $.ajax({
            url: "http://micro-service.spider.htairline.com/mobile/callPhone?phone=18075193789&content=" + content,
            type: "GET",
            success: function (data) {
                console.log(data);
            }
        });
    };

    window.getDate = function () {
        var myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        let day = myDate.getDate();
        return [year, month, day].join("-")
    };

    // -----------------------ZVP退票----------------------------------------------
    /*
    刷新列表,是否打电话
     */
    window.zvpRefundTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let tabPannerl = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementById("J_Form"));
        tabPannerl.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = tabPannerl.find("button");
        if (J_Search.length === 0) {
            console.log("打电话");
            // 打电话
            window.callPhone("1111");
            // 暂停刷新
            window.zvpRefundTicket.endFunction();
            return
        }

        J_Search.eq(0).click();

        setTimeout(
            window.zvpRefundTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.zvpRefundTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("退款待确认") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("1111");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.zvpRefundTicket.startFunction = function () {
        if (!window.zvpRefundTicket.zvpRefundTicketIntervalId) {
            window.zvpRefundTicket.zvpRefundTicketIntervalId = setInterval(
                window.zvpRefundTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.zvpRefundTicket.endFunction = function () {
        clearInterval(
            window.zvpRefundTicket.zvpRefundTicketIntervalId
        );
        window.zvpRefundTicket.zvpRefundTicketIntervalId = null;
        alert("成功暂停");
    };


    // -----------------------ZVP改签----------------------------------------------
    /*
    刷新列表,是否打电话
     */
    window.zvpChangeTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let J_Form = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementById("J_Form"));
        J_Form.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = J_Form.find("button");

        if (!J_Search) {
            console.log("打电话");
            // 打电话
            window.callPhone("2222");
            // 暂停刷新
            window.zvpChangeTicket.endFunction();
            return
        }
        J_Search.click();

        setTimeout(
            window.zvpChangeTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.zvpChangeTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("已支付") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("2222");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.zvpChangeTicket.startFunction = function () {
        if (!window.zvpChangeTicket.zvpChangeTicketIntervalId) {
            window.zvpChangeTicket.zvpChangeTicketIntervalId = setInterval(
                window.zvpChangeTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.zvpChangeTicket.endFunction = function () {
        clearInterval(
            window.zvpChangeTicket.zvpChangeTicketIntervalId
        );
        window.zvpChangeTicket.zvpChangeTicketIntervalId = null;
        alert("成功暂停");
    };

    // -----------------------LMJ退票----------------------------------------------
    /*
    刷新列表,是否打电话
     */
    window.lmjRefundTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let tabPannerl = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementById("J_Form"));
        tabPannerl.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = tabPannerl.find("button");

        if (J_Search.length === 0) {
            console.log("打电话");
            // 打电话
            window.callPhone("1111");
            // 暂停刷新
            window.lmjRefundTicket.endFunction();
            return
        }
        J_Search.eq(0).click();

        setTimeout(
            window.lmjRefundTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.lmjRefundTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("退款待确认") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("1111");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.lmjRefundTicket.startFunction = function () {
        if (!window.lmjRefundTicket.lmjRefundTicketIntervalId) {
            window.lmjRefundTicket.lmjRefundTicketIntervalId = setInterval(
                window.lmjRefundTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.lmjRefundTicket.endFunction = function () {
        clearInterval(
            window.lmjRefundTicket.lmjRefundTicketIntervalId
        );
        window.lmjRefundTicket.lmjRefundTicketIntervalId = null;
        alert("成功暂停");
    };

    // -----------------------LMJ改签----------------------------------------------
    /*
    刷新列表,是否打电话
     */
    window.lmjChangeTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let J_Form = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementById("J_Form"));
        J_Form.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = J_Form.find("button");
        if (!J_Search) {
            console.log("打电话");
            // 打电话
            window.callPhone("2222");
            // 暂停刷新
            window.lmjChangeTicket.endFunction();
            return
        }
        J_Search.click();

        setTimeout(
            window.lmjChangeTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.lmjChangeTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("已支付") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("2222");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.lmjChangeTicket.startFunction = function () {
        if (!window.lmjChangeTicket.lmjChangeTicketIntervalId) {
            window.lmjChangeTicket.lmjChangeTicketIntervalId = setInterval(
                window.lmjChangeTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.lmjChangeTicket.endFunction = function () {
        clearInterval(
            window.lmjChangeTicket.lmjChangeTicketIntervalId
        );
        window.lmjChangeTicket.lmjChangeTicketIntervalId = null;
        alert("成功暂停");
    };

    // -----------------------VWL退票----------------------------------------------
    /*
    刷新列表,是否打电话
     */
    window.vwlRefundTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let tabPannerl = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementById("J_Form"));
        tabPannerl.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = tabPannerl.find("button");
        if (J_Search.length === 0) {
            console.log("打电话");
            // 打电话
            window.callPhone("1111");
            // 暂停刷新
            window.vwlRefundTicket.endFunction();
            return
        }

        J_Search.eq(0).click();

        setTimeout(
            window.vwlRefundTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.vwlRefundTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_RETURN_RECORD").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("退款待确认") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("1111");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.vwlRefundTicket.startFunction = function () {
        if (!window.vwlRefundTicket.vwlRefundTicketIntervalId) {
            window.vwlRefundTicket.vwlRefundTicketIntervalId = setInterval(
                window.vwlRefundTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.vwlRefundTicket.endFunction = function () {
        clearInterval(
            window.vwlRefundTicket.vwlRefundTicketIntervalId
        );
        window.vwlRefundTicket.vwlRefundTicketIntervalId = null;
        alert("成功暂停");
    };


    // -----------------------VWL改签----------------------------------------------
    /*
        刷新列表,是否打电话
         */
    window.vwlChangeTicket.refreshOrderList = function () {
        // 刷新列表
        console.log("刷新了");
        let J_Form = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementById("J_Form"));
        J_Form.find("input[name='orderStartDate']").val(window.getDate());
        let J_Search = J_Form.find("button");
        if (!J_Search) {
            console.log("打电话");
            // 打电话
            window.callPhone("2222");
            // 暂停刷新
            window.vwlChangeTicket.endFunction();
            return
        }

        J_Search.click();

        setTimeout(
            window.vwlChangeTicket.viewOrder, 2000
        );
    };
    /*
    查看订单详情,是否拨打电话
     */
    window.vwlChangeTicket.viewOrder = function () {
        let tableBd = $(document.getElementById("tabpanel_nav_FN_CHANGE").children[0].contentWindow.document.getElementsByClassName("table-bd")[0]);
        let trTabEvenList = tableBd.find("tr");

        for (let index = 0; index < trTabEvenList.length; index++) {
            let _nowTdTab = trTabEvenList.eq(index);

            if (_nowTdTab.text().indexOf("已支付") !== -1) {
                // 获取订单号
                let orderNumber = _nowTdTab.find("div").eq(0).attr("title");
                if (window.allOrderNumberLi.indexOf(orderNumber) === -1) {
                    console.log(_nowTdTab.text());
                    console.log("orderNumber: ", orderNumber);
                    console.log("打电话");
                    window.callPhone("2222");
                    window.allOrderNumberLi.push(orderNumber);
                } else {
                    console.log("打过了,不打");
                }
            }

        }
    };

    window.vwlChangeTicket.startFunction = function () {
        if (!window.vwlChangeTicket.vwlChangeTicketIntervalId) {
            window.vwlChangeTicket.vwlChangeTicketIntervalId = setInterval(
                window.vwlChangeTicket.refreshOrderList, 10000
            );
            alert("启动成功, 预计10秒加载完毕");
        }
    };

    window.vwlChangeTicket.endFunction = function () {
        clearInterval(
            window.vwlChangeTicket.vwlChangeTicketIntervalId
        );
        window.vwlChangeTicket.vwlChangeTicketIntervalId = null;
        alert("成功暂停");
    };


    // 添加 弹框
    function addSpringBox() {
        let _UserInfoStr = "<div>\n" +
            "    <span>zvp退票</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.zvpRefundTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.zvpRefundTicket.endFunction()\">暂停</button>\n" +
            "</div>\n" +
            "<div>\n" +
            "    <span>zvp改签</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.zvpChangeTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.zvpChangeTicket.endFunction()\">暂停</button>\n" +
            "</div>\n" +
            "<div>\n" +
            "    <span>lmj退票</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.lmjRefundTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.lmjRefundTicket.endFunction()\">暂停</button>\n" +
            "</div>\n" +
            "<div>\n" +
            "    <span>lmj改签</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.lmjChangeTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.lmjChangeTicket.endFunction()\">暂停</button>\n" +
            "</div>\n" +
            "<div>\n" +
            "    <span>vwl退票</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.vwlRefundTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.vwlRefundTicket.endFunction()\">暂停</button>\n" +
            "</div>\n" +
            "<div>\n" +
            "    <span>vwl改签</span>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.vwlChangeTicket.startFunction()\">开始</button>\n" +
            "    <button style=\"margin: 5px;\" onclick=\"window.vwlChangeTicket.endFunction()\">暂停</button>\n" +
            "</div>";

        $($("#main")[0]).append($('<div id="myDiv" style="font-family: \'Open Sans\', sans-serif;text-align: center;background-image: linear-gradient(0deg, #02abcbeb 10%, #2631e4 100%);border: 1px solid #00a1de;-webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);border-radius: 25px;position: absolute;top: 20%;right: 0;transform: translate(-50%, -50%);padding: 10px;     color: #ffffff;width: 20%;">' + _UserInfoStr + "</div>"));

    }

    addSpringBox()
})();