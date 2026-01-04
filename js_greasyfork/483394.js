// ==UserScript==
// @name         砍Temu999刀（一键拒绝降价）
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Temu网页端一键拒绝所有降价，是兄弟就来砍我
// @author       menkeng
// @license      GPLv3
// @match        https://kuajing.pinduoduo.com/*
// @match        https://seller.kuajingmaihuo.com/*
// @downloadURL https://update.greasyfork.org/scripts/483394/%E7%A0%8DTemu999%E5%88%80%EF%BC%88%E4%B8%80%E9%94%AE%E6%8B%92%E7%BB%9D%E9%99%8D%E4%BB%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/483394/%E7%A0%8DTemu999%E5%88%80%EF%BC%88%E4%B8%80%E9%94%AE%E6%8B%92%E7%BB%9D%E9%99%8D%E4%BB%B7%EF%BC%89.meta.js
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
console.log("砍Temu999刀（一键拒绝降价）已加载");
var check_price_flag = false
var check_price_interval
window.onload = function () {
    check_price_cut()
}
function check_price_cut() {
    var check_price_time = 0
    check_price_interval = setInterval(() => {
        check_price_time++
        var flexs = document.querySelectorAll("div.MDL_header_5-111-0")
        flexs.forEach(function (pop) {
            if (pop.innerText == "商品降价提醒") {
                pop = pop.nextElementSibling
                console.log("捕捉到降价1")
                if (check_price_time > 10) {
                    clearInterval(check_price_interval)
                }
                check_price_flag = true
                clearInterval(check_price_interval)
                create_button()
            }
        })
        var flex_2 = document.querySelectorAll("div.MDL_innerWrapper_5-111-0")
        flex_2.forEach(function (pop) {
            if (pop.innerText.includes("降价")) {
                console.log("捕捉到降价2")
                clearInterval(check_price_interval)
                create_button()
            }
        })
    }, 1000)
}
setTimeout(() => {
    var kill = document.querySelectorAll('span[data-testid="beast-core-badge-count"]')
    kill.forEach((element) => {
        element.remove()
    })
}, 2000)

function price_cut() {
    document.querySelectorAll(".MDL_innerWrapper_5-111-0 tbody tr").forEach((element) => {
        element.querySelector("label:last-child").click()
        document.querySelector(".PT_outerWrapper_5-111-0 button").click()
    })
    var div = document.querySelector(".TB_body_5-111-0")
    if (div && ('scrollTop' in div)) {
        scrollAndClick(div)
    }
}
function scrollAndClick(dom) {
    var scrollAmount = 300
    var scrollInterval = 500
    var button_list = document.querySelectorAll(".RD_textWrapper_5-111-0.RD_prevRadio_5-111-0")
    var div = dom
    button_list.forEach((element) => {
        if (element.innerText == "我不接受") {
            element.click()
            try {
                document.querySelector(".BTN_outerWrapper_5-111-0.BTN_danger_5-111-0.BTN_medium_5-111-0.BTN_outerWrapperBtn_5-111-0").click()
            } catch (err) {}
        }
    })
    if (!div || !('scrollTop' in div)) {
        return;
    }
    div.scrollTop += scrollAmount
    var scrollEvent = new CustomEvent("scroll")
    div.dispatchEvent(scrollEvent)
    if (div.scrollTop + div.clientHeight < div.scrollHeight) {
        setTimeout(scrollAndClick, scrollInterval)
    } else {
        scrollAndClick()
        var button = document.getElementById("拒绝降价")
        if (button) {
            button.remove()
        }
        check_num()
    }
}
function create_button() {
    var reject_btn = document.createElement("div")
    reject_btn.innerText = "拒绝降价"
    reject_btn.id = "reject_btn"
    reject_btn.style.position = "fixed"
    reject_btn.style.top = "20%"
    reject_btn.style.right = "22%"
    reject_btn.style.zIndex = "9999"
    reject_btn.style.display = "flex"
    reject_btn.style.borderRadius = "5px"
    reject_btn.style.backgroundColor = "rgba(251, 119, 1,1)"
    reject_btn.style.color = "white"
    reject_btn.style.padding = "10px 15px"
    reject_btn.style.border = "none"
    reject_btn.style.cursor = "pointer"
    reject_btn.addEventListener("click", function () {
        price_cut()
    })
    document.body.appendChild(reject_btn)
}

function check_num() {
    var color
    var text = document.querySelectorAll(".MDL_footer_5-111-0")
    for (var i = 0; i < text.length; i++) {
        if (text[i].innerText.includes("接受")) {
            console.log(text[i].innerText)
            var num = text[i].innerText.match(/\d+/)[0]
            if (num == 0) {
                color = "YellowGreen"
            } else {
                color = "Red"
            }
            showPopup("接受" + num + "个商品", 4000, color)
        }
    }
}

function showPopup(message, duration = 5000, color = "red") {
    const popup = document.createElement("div")
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        transform: translate(-50%, -50%);
        background-color: ${color};
        padding: 20px;
        z-index: 99999;
    `
    popup.textContent = message
    document.body.appendChild(popup)
    setTimeout(() => {
        document.body.removeChild(popup)
    }, duration)
}
