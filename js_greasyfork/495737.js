// ==UserScript==
// @name         淘工厂自动发货脚本
// @namespace    http://tampermonkey.net/
// @version      0.8
// @license MIT
// @description  淘工厂自动发货脚本!
// @author       WinterSun
// @match        https://tgc.tmall.com/ds/page/supplier/order-manage?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495737/%E6%B7%98%E5%B7%A5%E5%8E%82%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495737/%E6%B7%98%E5%B7%A5%E5%8E%82%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        //执行添加按钮
        addButton();
    }, 1500)

})();
let index1 = 0
let hits = []
let v1;
let v2;
const oneClickDelivery = (pid) => {
    // const searchInput = document.getElementById('sourceTradeId');
    // searchInput.value = pid;
    //
    // const form = searchInput.closest('form');
    // form.submit()
    index1 = 0
    hits = []
    console.log("查找修改发货信息")
    const spans1 = document.querySelectorAll('span');
    const hit1 = []
    // 遍历所有的<span>元素
    for (let i = 0; i < spans1.length; i++) {
        const spanContent = spans1[i].innerText || spans1[i].textContent; // 获取元素的文本内容

        // 使用正则表达式检查内容是否包含“申明发货”
        if (spanContent.match(/修改发货信息/gi)) { // 'gi'标志表示全局搜索和不区分大小写
            hit1.push(spans1[i])
        }
    }
    const button = hit1[0].closest("button");
    button.click()
    setTimeout(() => {
        v1 = getEmValue()
        v2 = getValue1("运单号")
        //关闭弹窗
        closeThePopUpWindow()
        setv()
    }, 1000)

}

const closeThePopUpWindow = () => {
    console.log("关闭窗口")
    const spans = document.querySelectorAll('span');
    const sp = []

    for (let i = 0; i < spans.length; i++) {
        const spanContent = spans[i].innerText || spans[i].textContent; // 获取元素的文本内容
        // 使用正则表达式检查内容是否包含“申明发货”
        if (spanContent.match(/修改发货信息/gi)) { // 'gi'标志表示全局搜索和不区分大小写
            sp.push(spans[i])
        }
    }
    const nes1 = sp[sp.length - 1].nextElementSibling;
    const nes2 = nes1.nextElementSibling;
    nes2.getElementsByTagName("button")[0].click()
}


const determineShipment = () => {
    console.log("确定发货")
    const spans = document.querySelectorAll('span');
    const sp = []

    for (let i = 0; i < spans.length; i++) {
        const spanContent = spans[i].innerText || spans[i].textContent; // 获取元素的文本内容
        // 使用正则表达式检查内容是否包含“申明发货”
        if (spanContent.match(/申明发货/gi)) { // 'gi'标志表示全局搜索和不区分大小写
            sp.push(spans[i])
        }
    }
    sp.forEach(i1 => {
        if (i1.className !== 'next-btn-helper') {
            const nes1 = i1.nextElementSibling;
            const nes2 = nes1.nextElementSibling;
            nes2.getElementsByTagName("button")[1].click()
            if (index1 < hits.length-1) {
                setTimeout(() => {
                    console.log("进入再次")
                    index1++
                    go()
                }, 1000)
            } else {
                console.log("未进入再次")
            }

        }
    })


}

const setv = () => {
    setTimeout(() => {
        console.log("查找申明发货")
        // 获取页面上所有<span>元素
        const spans = document.querySelectorAll('span');
        const hit = []
        // 遍历所有的<span>元素
        for (let i = 0; i < spans.length; i++) {
            const spanContent = spans[i].innerText || spans[i].textContent; // 获取元素的文本内容

            // 使用正则表达式检查内容是否包含“申明发货”
            if (spanContent.match(/申明发货/gi)) { // 'gi'标志表示全局搜索和不区分大小写
                hit.push(spans[i])
            }
        }
        hits = hit
        go()
    }, 1000)
}

const go = () => {
    if (!v1 && !v2) {
        console.log(v1, v2)
    }
    const button = hits[index1].closest("button");
    button.click()
    setTimeout(() => {
        modifyShipmentQuantity()
        setValue1("快递公司", v1)
        setValue1("运单号", v2)
        setTimeout(() => {
            const elementNodeListOf = document.querySelectorAll("label");
            elementNodeListOf.forEach(i1 => {
                if (i1.innerText.match(/快递公司/gi)) {
                    determineShipment()
                }
            })
        }, 1000)
    }, 1000)
}

const modifyShipmentQuantity = () => {
    console.log("修改发货数量")
    const spans = document.querySelectorAll('span');
    const sp = []

    for (let i = 0; i < spans.length; i++) {
        const spanContent = spans[i].innerText || spans[i].textContent; // 获取元素的文本内容
        // 使用正则表达式检查内容是否包含“申明发货”
        if (spanContent.match(/申明发货/gi)) { // 'gi'标志表示全局搜索和不区分大小写
            sp.push(spans[i])
        }
    }
    sp.forEach(i1 => {
        if (i1.className !== 'next-btn-helper') {
            const nes1 = i1.nextElementSibling;
            const nodeListOf = nes1.querySelectorAll("input");
            // nodeListOf[nodeListOf.length - 1].value=1
            // changeReactInputValue(nodeListOf[nodeListOf.length - 1], 0)
        }
    })

}


const getEmValue = () => {
    const elementNodeListOf = document.querySelectorAll("label");
    let k = ''
    elementNodeListOf.forEach(i1 => {
        if (i1.innerText.match(/快递公司/gi)) {
            const currentElement = i1.closest("div");
            // 检查当前元素的前一个兄弟节点是否是div
            let firstDivSibling = currentElement.nextElementSibling;
            while (firstDivSibling && firstDivSibling.tagName.toLowerCase() !== 'div') {
                firstDivSibling = firstDivSibling.previousElementSibling;
            }
            // 如果找到了第一个div兄弟节点，可以进行操作
            if (firstDivSibling && firstDivSibling.tagName.toLowerCase() === 'div') {
                firstDivSibling.querySelectorAll("em").forEach(i2 => {
                    k = i2.innerText
                })
            } else {
                console.log('没有找到div兄弟节点');
            }
        }
    })
    return k
}

const getValue1 = (label) => {
    const elementNodeListOf = document.querySelectorAll("label");
    let d = ''
    elementNodeListOf.forEach(i1 => {
        if (i1.innerText.match(label)) {
            const currentElement = i1.closest("div");
            // 检查当前元素的前一个兄弟节点是否是div
            let firstDivSibling = currentElement.nextElementSibling;
            while (firstDivSibling && firstDivSibling.tagName.toLowerCase() !== 'div') {
                firstDivSibling = firstDivSibling.previousElementSibling;
            }
            // 如果找到了第一个div兄弟节点，可以进行操作
            if (firstDivSibling && firstDivSibling.tagName.toLowerCase() === 'div') {
                firstDivSibling.querySelectorAll("input").forEach(i2 => {
                    d = i2.value
                })
            } else {
                console.log('没有找到div兄弟节点');
            }
        }
    })
    return d
}


//调用下面这个函数可以给框架包装过的input框赋值
function changeReactInputValue(inputDom, newText) {
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event('input', {bubbles: true});
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
}

const setValue1 = (label, value) => {
    const elementNodeListOf = document.querySelectorAll("label");
    elementNodeListOf.forEach(i1 => {
        if (i1.innerText.match(label)) {
            const currentElement = i1.closest("div");
            // 检查当前元素的前一个兄弟节点是否是div
            let firstDivSibling = currentElement.nextElementSibling;
            while (firstDivSibling && firstDivSibling.tagName.toLowerCase() !== 'div') {
                firstDivSibling = firstDivSibling.previousElementSibling;
            }
            // 如果找到了第一个div兄弟节点，可以进行操作
            if (firstDivSibling && firstDivSibling.tagName.toLowerCase() === 'div') {
                let index = 1
                firstDivSibling.querySelectorAll("input").forEach(i2 => {
                    index++
                    if (label === '快递公司') {
                        changeReactInputValue(i2, value)
                        const nodeListOf = document.querySelectorAll("li");
                        nodeListOf[nodeListOf.length - 1].click()
                    } else {
                        changeReactInputValue(i2, value)
                    }
                })
            } else {
                console.log('没有找到div兄弟节点');
            }
        }
    })
}

const addButton = () => {
    const div = document.createElement("div");
    div.style.width = "300px";
    div.style.height = "100px";
    div.style.position = "fixed"
    div.style.top = "0"
    div.style.left = "0"
    div.style.zIndex = "1040"
    div.style.background = "rgba(0,0,0,0.5)"


    const input1 = document.createElement("input");
    input1.style.width = "100%"
    input1.style.height = "30px"
    const searchInput = document.getElementById('sourceTradeId');
    if (searchInput) {
        if (searchInput.value) {
            input1.value = searchInput.value
        }
    }
    // div.appendChild(input1)


    const button = createButton("一键发货", "10px", "50%", () => {
        oneClickDelivery(input1.value)
    })

    div.appendChild(button)

    document.getElementById("root").appendChild(div);

};

const createButton = (title, top, left, clickBotton) => {
    const button = document.createElement("button"); //创建一个按钮
    button.textContent = title; //按钮内容
    button.style.width = "90px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.marginTop = "10px"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    // button.style.position = 'fixed'
    // button.style.top = top
    // button.style.left = left
    button.style.zIndex = '1041'
    button.style.cursor = 'pointer'
    button.addEventListener("click", clickBotton) //监听按钮点击事件

    return button
}
