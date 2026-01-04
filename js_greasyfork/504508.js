// ==UserScript==
// @name         Temu一键爆单（仅限娱乐）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  安装脚本即可爆单，仅限娱乐，严禁用于任何商业盈利或非法用途。使用本脚本产生的任何后果，均由用户自行承担，与脚本提供者无关。
// @author       menkeng
// @license      GPLv3
// @match        https://seller.kuajingmaihuo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuajingmaihuo.com
// @downloadURL https://update.greasyfork.org/scripts/504508/Temu%E4%B8%80%E9%94%AE%E7%88%86%E5%8D%95%EF%BC%88%E4%BB%85%E9%99%90%E5%A8%B1%E4%B9%90%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/504508/Temu%E4%B8%80%E9%94%AE%E7%88%86%E5%8D%95%EF%BC%88%E4%BB%85%E9%99%90%E5%A8%B1%E4%B9%90%EF%BC%89.meta.js
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383   
const img_html =
    '<img class="sales-block_goImg__yXSfd" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2ElEQVR4nOXVuwrCQBCF4anFQkRRxEi8EjRqCgsL9UXEe/T9H8EZYrHMWs2ZLoEfUn1s2MkuUe2fBnfkTlzTAzxwn19nroWC6wCULlwbRcNVSjeui6J7hd65PoruFPrkBii6VeiLG6HoSqElN0bRjHsHqLzPUFSAUqEZiqYKlXIUTajanBAtUFTG56HQDgIOqZpLF1DmUH/yxopNKN6UpRWbUzyLCyumB1tWObViOcW/XmrFCoXJziZWTB9fMnfm4+vfAduzYvoKuBIwtO6XlPs16n7R1+D5AnpdLQToPUXkAAAAAElFTkSuQmCC">'
function generateRandomArray() {
    const multipliers = [10, 20, 140, 560, 1, 3, 0, 0, 0, 25, 9, 0, 35, 45, 15, 10, 12]
    const firstNumber = Math.floor(Math.random() * 8) + 1
    const numbers = multipliers.map((multiplier, index) => {
        if (multiplier === 0) return 0
        const base = firstNumber * multiplier
        const fluctuation = base * (Math.random() * 0.2 - 0.1)
        return Math.round(base + fluctuation)
    })
    const qualityRate = `${(Math.random() * (1.36 - 0.56) + 0.56).toFixed(2)}%`
    const result = [
        "在售商品数",
        numbers[0],
        "今日销量",
        numbers[1],
        "近7日销量",
        numbers[2],
        "近30天销量",
        numbers[3],
        "近90天品质售后率",
        qualityRate,
        "即将售罄",
        numbers[4],
        "建议备货",
        numbers[5],
        "商品信息待修改",
        numbers[6],
        "开款价格待确认",
        numbers[7],
        "调价待确认",
        numbers[8],
        "未发布",
        numbers[9],
        "待寄样",
        numbers[10],
        "审版中",
        numbers[11],
        "价格申报中",
        numbers[12],
        "待创建首单",
        numbers[13],
        "已创建首单",
        numbers[14],
        "已发布到站点",
        numbers[15],
        "已下架/终止",
        numbers[16],
    ]
    return result
}

let data = generateRandomArray()
window.addEventListener("load", function () {
    let Interval = setInterval(() => {
        change()
    }, 100);
    setTimeout(() => {
        clearInterval(Interval)
    }, 5000);
})

function change() {
    try {
        let data_board = document.querySelectorAll("div[class^='sales-block_dataText']")
        if (data_board.length === 0) {
            setTimeout(change, 100)
            return
        }
        for (let i = 0; i < data_board.length; i++) {
            data_board[i].innerText = data[i * 2 + 1]
            if (i === 4 || i === 5 || i === 6 || i === 7 || i === 8) {
                // insetimg(data_board[i]);
            }
        }
        let temp = 0
        let data_board2 = document.querySelectorAll("div[class^='goods-cycle-block_dataText']")
        for (let i = 0; i < data_board2.length; i++) {
            if (i == 5) {
                temp = 1
            }
            // console.log(data[(i - temp) * 2 + 20])
            data_board2[i].innerText = data[i * 2 + 21]
        }
        let name = document.querySelector(".elli_outerWrapper_5-114-0.elli_limitWidth_5-114-0")
        if (name !== null) {
            name.innerText = "\u5b9a\u5236qq\uff1a605011383";
        }
    } catch {
        setTimeout(change, 100)
    }
}

function insetimg(dom) {
    let oldhtml = dom.innerHTML
    dom.innerHTML = oldhtml
}
