// ==UserScript==
// @name        AMZ - SKU Delete 0.2
// @namespace   Violentmonkey Scripts
// @match       https://sellercentral.amazon.*/myinventory/inventory*
// @match       https://sellercentral-japan.amazon.com/myinventory/inventory*
// @match       https://sellercentral-europe.amazon.com/myinventory/inventory*
// @grant       none
// @version     2.0.3
// @author      -
// @description 2024/8/4 13:45:24
// @downloadURL https://update.greasyfork.org/scripts/438762/AMZ%20-%20SKU%20Delete%2002.user.js
// @updateURL https://update.greasyfork.org/scripts/438762/AMZ%20-%20SKU%20Delete%2002.meta.js
// ==/UserScript==

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
if (window.onload != null) {
    const observer = new MutationObserver(function (mutations) {
        if (document.querySelector('#header_favorite')) {
            observer.disconnect(); // 停止观察
            _deletesku(); // 元素存在后执行
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    window.onload = function () {
        _deletesku();
    };
}

function _deletesku() {
    // 替换弹窗 直接确定
    confirm = function () { return 1 }
    // 等待5秒后执行
    setTimeout(function () {
        try {
            var xx = document.getElementsByTagName("kat-checkbox")[0]
            xx.shadowRoot.querySelector(".checkbox").click();
        } catch (err) {
            // alert("1")
        }
    }, 5 * 1000)

    setTimeout(function () {
        try {
            var element = getElementByXpath("//kat-dropdown-button[@single-target-label='选择组操作']");
            element.shadowRoot.querySelector(".indicator").click();
        } catch (err) {
            // alert("2")
        }

        try {
            var element = getElementByXpath("//kat-dropdown-button[@single-target-label='Select group action']");
            element.shadowRoot.querySelector(".indicator").click();
        } catch (err) {
            // alert("2")
        }
    }, 7 * 1000)

    setTimeout(function () {
        try {
            var element2 = getElementByXpath("//kat-dropdown-button[@single-target-label='选择组操作']");
            var but2 = element2.shadowRoot.querySelectorAll("button");
            for (var i = 0; i < but2.length; i++) {
                if (but2[i].innerText.includes("删除商品")) {
                    but2[i].click()
                }
            }
        } catch (err) {
            // alert("3")
        }

        try {
            var element2 = getElementByXpath("//kat-dropdown-button[@single-target-label='Select group action']");
            var but2 = element2.shadowRoot.querySelectorAll("button");
            for (var i = 0; i < but2.length; i++) {
                if (but2[i].innerText.includes("Delete listing")) {
                    but2[i].click()
                }
            }
        } catch (err) {
            // alert("3")
        }
    }, 9 * 1000)


    setTimeout(function () {
        try {
            XRLayer = document.querySelectorAll("kat-button")
            for (var i = 0; i < XRLayer.length; i++) {
                var xtx = XRLayer[i].getAttribute("label");
                if (xtx) {
                    if (xtx.includes("Delete listing") || xtx.includes("删除商品")) {
                        XRLayer[i].shadowRoot.querySelector("button").click();
                    };

                }
            }
        } catch (err) {
            // alert("4")
        }
    }, 11 * 1000)


    setTimeout(function () {
        var inputX = getElementByXpath("//kat-input[@min=1]");
        var MaxNum = parseInt(inputX.getAttribute("max"))

        var searchl = location.search.split("&")
        for (var i = 0; i < searchl.length; i++) {
            key_val = searchl[i].split("=")
            if (key_val[0] == "page") {
                var npage = parseInt(key_val[1]) + 1
            }
        }
        if (npage > MaxNum) {
            npage = 1
        }
        window.location.href = location.origin + location.pathname + "?fulfilledBy=all&page=" + npage + "&pageSize=250&sort=date_created_desc&status=all"
    }, 15 * 1000)
}