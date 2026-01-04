// ==UserScript==
// @name         CSGO 批量下架商品
// @namespace    http://tampermonkey.net/
// @version      2025-06-19
// @description  作者有点懒...
// @author       早睡早起，QQ:728097735
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541048/CSGO%20%E6%89%B9%E9%87%8F%E4%B8%8B%E6%9E%B6%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/541048/CSGO%20%E6%89%B9%E9%87%8F%E4%B8%8B%E6%9E%B6%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 样式
    const style = document.createElement("style");
    style.innerHTML = `
        #csgoToolContain {
            width: 20%;
            height: 350px;
            background-color: rgba(216,214,214,0.32);
            position: fixed;
            top: 30%;
            right: 1%;
            margin: 0 auto;
            padding: 4px;
            border: 1px dashed;
            overflow-y: auto;
            color: aliceblue;
        }
        #itemsTable > thead , #itemsTable > tfoot{
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: rgba(50,50,50,0.82);
            color: aliceblue;
            text-align: center
        }
        /* 弹窗样式 */
        .modal {
            display: none; /* 默认不显示 */
            position: fixed;
            z-index: 1000; /* 确保弹窗在最上层 */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4); /* 半透明背景 */
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px; /* 最大宽度 */
            border-radius: 5px;
            /*font-weight: bold;*/
            font-size: 20px;
        }

        .modal-content input {
            width: 30%;
            padding: 10px;
            margin: 0;
            font-size: 20px;
            border: 1px solid #ccc;
        }

        .modal-content button{
            background-color: #4CAF50;
            border: none;
            color: white;
            cursor: pointer;
            width: 10%;
            padding: 5px;
            border-radius: 5px;
            margin: auto;
            font-size: 16px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 18px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
`
    document.querySelector("head").appendChild(style)

    // 页面
    const div = document.createElement("div")
    div.innerHTML = `
<div id="csgoToolContain">
    <table id="itemsTable">
        <thead >
            <tr>
                <th style="width: 10%">序号</th>
                <th style="width: 30%">商品名称</th>
                <th style="width: 13%">单价</th>
                <th style="width: 10%">数量</th>
                <th style="width: 15%">小计</th>
                <th style="width: 14%">操作</th>
            </tr>
        </thead>
        <tbody id="itemsBody" style="text-align: center">

        </tbody>
        <tfoot>
            <tr>

            </tr>
        </tfoot>
    </table>
</div>

<div id="myModal" class="modal">
    <div class="modal-content" id="myModelContent">
        <span class="close" onclick="closeModal()">&times;关闭</span>
    </div>
</div>
`
    document.querySelector("#BG_bottom").appendChild(div)



    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function sleep() {
        return new Promise(resolve => setTimeout(resolve, getRandomInt(800,1000)));
    }

    // 获取弹窗和按钮
    const modal = document.getElementById('myModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function () {
        closeModal();
    };
    function closeModal() {
        console.log("关闭弹窗")
        modal.style.display = 'none';
        document.querySelector("#myModelContent").innerHTML = `<span class="close">&times;关闭</span>`;

        //绑定事件
        document.querySelector("#myModelContent span").addEventListener("click", function () {
            closeModal();
        })
    }

    // 监听点击事件
    function batchSaleOut(key) {
        let split = key.split(" - ");
        createModal(split[0], split[1], map.get(key).length);
        modal.style.display = 'block';
    }

    // 批量下架
    async function confirm(name, price, quantity) {
        // 获取输入的值
        const batchQuantity = document.getElementById('batchQuantityInput').value;
        console.log(batchQuantity);
        if (!batchQuantity || batchQuantity <= 0) {
            alert('请输入正确的数量');
            return;
        } else if (batchQuantity > quantity) {
            alert('数量不能大于商品数量');
            return;
        }
        closeModal();
        for (let i = 0; i < batchQuantity; i++) {
            console.log(name + " - " + price)
            let goods = map.get(name + " - " + price);
            console.log(goods)
            await removeItem(goods[0])
            goods.shift();
            await sleep();
        }
        alert(name + "下架成功!");
        init()
    }


    // 撤销单个商品
    async function removeItem(id) {
        console.log('要撤销的商品id', id)
        let elementById = document.getElementById(id);
        if (!elementById) {
            return;
        }
        // 撤销商品
        elementById.querySelector("div.market_listing_edit_buttons.actual_content > div > a > span.item_market_action_button_contents").click();
        await sleep()
        // 确认
        document.querySelector("#market_removelisting_dialog_accept").click();
    }


    const map = new Map();

    // 初始化数据
    function init() {
        map.clear();
        document.querySelectorAll("#tabContentsMyActiveMarketListingsRows > div.market_listing_row").forEach((elem, index) => {
            const id = elem.id
            let goodName = elem.querySelector("div.market_listing_item_name_block > span > a").textContent;
            let payment = elem.querySelector("span.market_listing_price > span > span[title=这是买家所要支付的价格。]").textContent.match(/\s*\d+\.\d+/)[0];
            // let actual = elem.querySelector("span.market_listing_price > span > span[title=这是您的所收金额。]").textContent.match(/\s*\d+\.\d+/)[0];
            // console.log(index, goodName, payment, actual)
            const key = goodName + " - " + payment;
            // 构建商品map
            if (map.has(key)) {
                map.get(key).push(id);
            } else {
                map.set(key, [id]);
            }
        })
        document.querySelector("#itemsBody").innerHTML = "";
        document.querySelector("#itemsTable > tfoot").innerHTML = "";
        let index = 1, count = 0, totalPrice = 0;
        map.forEach((value, key) => {
            let split = key.split(" - ");
            createTableRow(index++, key, value.length)
            count += value.length;
            totalPrice += value.length * split[1];
        })
        creatFoot(count, totalPrice)
        console.log("初始化完成", map);
    }

    function createTableRow(id, key, quantity) {
        let split = key.split(" - ");
        let tr = document.createElement("tr");
        tr.innerHTML = `
                <td class="item-id">${id}</td>
                <td class="item-name">${split[0]}</td>
                <td class="item-price">${split[1]}</td>
                <td class="item-quantity">${quantity}</td>
                <td class="item-subtotal">¥ ${Math.round(split[1] * quantity * 100) / 100}</td>
                <td class="item-actions">
                    <button class="item-remove">批量下架</button>
                </td>`
        document.querySelector("#itemsBody").appendChild(tr);

        // 绑定事件监听器
        const removeButton = tr.querySelector('.item-remove');
        removeButton.addEventListener('click', () => {
            batchSaleOut(key);
        });
    }

    function creatFoot(count, totalPrice) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td colspan="1"> 总计 </td>
            <td colspan="2"  id="actualPrice">实际收入：¥ ${Math.round(totalPrice * 0.85 * 100) / 100}</td>
            <td id="totalQuantity">${count}</td>
             <td id="totalPrice">¥${Math.round(totalPrice)}</td>

        `
        document.querySelector("#itemsTable > tfoot").appendChild(tr);
    }

    function createModal(name, price, quantity) {
        const modalContent = document.createElement("div");
        modalContent.innerHTML = `
                <p>商品：${name}</p>
                <p>单价：¥${price}</p>
                <p>数量：${quantity}</p>
                <label for="batchQuantityInput">
                    下架数量：
                </label>
                <input type="number" id="batchQuantityInput" placeholder="请输入数量" min="1" max="9999999" value="${quantity}"/>
                <button id="batchRemoveBtn">确认</button>
            `
        document.querySelector("#myModelContent").appendChild(modalContent);
        // 绑定事件监听器
        document.querySelector("#batchRemoveBtn").addEventListener('click', () => {
            confirm(name, price, quantity);
        });
    }


    window.onload = () => {
        init();
    }


    // Your code here...
})();



