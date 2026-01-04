// ==UserScript==
// @name         Temu发货台助手
// @namespace    http://tampermonkey.net/
// @version      0.40
// @description  一键加入发货台,备货单,备货单发货,跳过发货教程
// @author       menkeng
// @license      GPLv3
// @match        https://seller.kuajingmaihuo.com/main/order-manage
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-list
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @downloadURL https://update.greasyfork.org/scripts/502372/Temu%E5%8F%91%E8%B4%A7%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502372/Temu%E5%8F%91%E8%B4%A7%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
const 备货单 = "https://seller.kuajingmaihuo.com/main/order-manage"
const 发货台 = "https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk"
const 发货单列表 = "https://seller.kuajingmaihuo.com/main/order-manager/shipping-list"

// 监听 popstate 事件
window.addEventListener("popstate", function () {
    checkUrl()
})
window.addEventListener("hashchange", function () {
    checkUrl()
})
window.onload = function () {
    checkUrl()
}

function checkUrl() {
    var button_box = tool.createButtonBox(10, 200)
    var url = window.location.href
    clearTimeout(cleartimer)
    tool.removeButtons()
    if (url == 备货单) {
        console.log("备货单页面")
        tool.createButton("开始抢发货台", toggle_get_ship, button_box)
        setTimeout(() => {
            skip_guide()
        }, 2000)
        return
    } else if (url == 发货台) {
        console.log("发货台页面")
        tool.createButton("最大数量", shipping_addnum, button_box)
    } else if (url == 发货单列表) {
        console.log("发货单列表页面")
        tool.createButton("发货", query_shipnum, button_box)
    }
    var cleartimer = setTimeout(() => {
        clearInterval(get_shipping_interval)
    }, 5 * 60 * 1000)
}
var isGettingShipping = false
var get_shipping_interval
var cleartimer
function toggle_get_ship() {
    isGettingShipping = !isGettingShipping
    var text = isGettingShipping ? "正在抢...点击停止" : "开始抢发货台"
    document.querySelector("#开始抢发货台").innerText = text
    get_shipping()
}
function get_shipping() {
    get_shipping_interval = setInterval(() => {
        if (!isGettingShipping) {
            clearInterval(get_shipping_interval)
            const masks = document.querySelectorAll(".MDL_mask_5-111-0")
            masks.forEach((mask) => {
                mask.remove()
            })
            const masks2 = document.querySelectorAll(".MDL_alert_5-111-0")
            masks2.forEach((mask) => {
                mask.remove()
            })
            const masks3 = document.querySelectorAll(".MDL_withLogo_5-111-0")
            masks3.forEach((mask) => {
                mask.remove()
            })
            return
        }
        $("tbody a:contains('加入发货台')").each(function () {
            $(this).click()
            var button = $(this)
            var disabled = button.is("[disabled]")
            if (!disabled) {
                tool.simulateMouseClick($(this).get(0)).then(function () {
                    let buttons = $('div[data-testid="beast-core-portal-main"]').find("button")
                    tool.simulateMouseClick(buttons.get(0))
                })
            }
        })
        const masks = document.querySelectorAll(".MDL_mask_5-111-0")
        masks.forEach((mask) => {
            mask.remove()
        })
        let time = document.querySelectorAll(".MDL_alert_5-111-0").length
        tool.showPopup("已抢" + time + "次")
    }, 1000)
}
function skip_guide() {
    var guide_dom = $(".guide-steps_box__2jPgE")
    if (guide_dom !== null) {
        $(guide_dom).find("span:contains('下一步')").click()
        $(guide_dom).find("span:contains('下一步，打印商品打包标签')").click()
        $(guide_dom).find("span:contains('下一步，去发货')").click()
        $(guide_dom).find("span:contains('发货完成，查看物流信息')").click()
        $(guide_dom).find("span:contains('完成')").click()
    }
}
function shipping_addnum() {
    var stockName_Now
    var list = $("tbody tr")
    var stockName = $(list[0]).find("td:nth-child(3)").text()
    for (var i = 0; i < list.length; i++) {
        var stock_ele_length = $(list[i]).children().length
        if (stock_ele_length !== 4) {
            stockName_Now = $(list[i]).find("td:nth-child(3)").text()
        }
        if (stockName_Now == stockName) {
            $(list[i]).find("span:contains('修改')").click()
            setTimeout(() => {
                shipping_addnum_add()
            }, 500 * i)
        }
    }
}
function shipping_addnum_add() {
    var input = $("div.PP_popoverTitle_5-111-0:contains('实际发货数（件）')").parent().find(".IPT_reunitBlock_5-111-0 input")
    if (input.length > 0) {
        var max = input.attr("max")
        tool.changeReactInputValue(input[0], max)
        $("span:contains('确认')").click()
        setTimeout(() => {
            shipping_addnum_add()
        }, 200)
    } else {
        return
    }
}
class tool {
    static createButtonBox(top, left) {
        var existingBox = document.getElementById("js_buttonbox")
        if (existingBox) {
            return existingBox
        }
        var box = document.createElement("div")
        box.className = "js_buttonbox"
        box.id = "js_buttonbox"
        box.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; z-index: 9999; display: flex; min-width: 30px; flex-direction: row; align-items: center; border-radius: 5px; transition: width 0.3s ease;`
        document.body.appendChild(box)
        return box
    }
    static createButton(text, executeFunction, box) {
        var button = document.createElement("button")
        button.classList.add("fixed-button")
        button.textContent = text
        button.id = text
        button.classList.add("js_fixed-button")
        button.style.cssText = "background-color: rgba(251, 119, 1, 0.5); color: white; padding: 8px 10px; border: none; cursor: pointer;border-radius: 5px;"
        button.addEventListener("click", executeFunction)
        box.appendChild(button)
    }
    static fn_dispatchEvent(element, eventType) {
        const event = new MouseEvent(eventType, {
            view: document.defaultView,
            bubbles: true,
            cancelable: true,
        })
        element.dispatchEvent(event)
    }
    static removeButtons() {
        var buttons = document.querySelectorAll(".js_fixed-button")
        buttons.forEach(function (button) {
            button.remove()
        })
    }
    static setReactValue_textarea(el, value) {
        const previousValue = el.value
        if (el.type === "checkbox" || el.type === "radio") {
            if ((!!value && !el.checked) || (!!!value && el.checked)) {
                el.click()
            }
        } else el.value = value
        const tracker = el._valueTracker
        if (tracker) {
            tracker.setValue(previousValue)
        }
        tool.fn_dispatchEvent(el, "change")
    }
    static changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value
        inputDom.value = newText
        event.simulated = true
        let tracker = inputDom._valueTracker
        if (tracker) {
            tracker.setValue(lastValue)
        }
        tool.fn_dispatchEvent(inputDom, "input")
        tool.fn_dispatchEvent(inputDom, "change")
        tool.fn_dispatchEvent(inputDom, "blur")
    }
    static simulateMouseClick(element) {
        return new Promise(function (resolve, reject) {
            if (!element) {
                console.error("Element not found")
                return
            }
            tool.fn_dispatchEvent(element, "mousedown")
            tool.fn_dispatchEvent(element, "mouseup")
            tool.fn_dispatchEvent(element, "click")
            tool.fn_dispatchEvent(element, "mouseenter")
            tool.fn_dispatchEvent(element, "mouseleave")
            resolve()
        })
    }
    static copy(text) {
        var textarea = document.createElement("textarea")
        textarea.textContent = text
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand("copy")
            console.log("复制成功")
        } catch (err) {
            console.error("复制失败: ", err)
        } finally {
            document.body.removeChild(textarea)
        }
    }
    static showPopup(message, duration = 2000, color = "pink") {
        if (document.getElementById("js_popup")) {
        }
        const popup = document.createElement("div")
        popup.id = "js_popup"
        popup.style.cssText = `position: fixed; top: 50%; left: 50%; color: white; font-size: 16px; font-weight: bold; text-align: center; transform: translate(-50%, -50%); background-color: ${color}; padding: 20px; z-index: 99999;`
        popup.textContent = message
        document.body.appendChild(popup)
        setTimeout(() => {
            document.body.removeChild(popup)
        }, duration)
    }
    static sleep (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

// upgrade
// 发货单自动改重量
