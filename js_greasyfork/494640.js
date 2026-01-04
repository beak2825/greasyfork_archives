// ==UserScript==
// @name         AutoPrice
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  try to take over the world!
// @author       NoAuthor
// @match        https://trophymanager.com/players/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494640/AutoPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/494640/AutoPrice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let name = localStorage.getItem("AutoPrice_Name") || "提瓦特元素反应";
    let max_price = "";
    let t = -1;

    // 动态创建输入框并插入页面
    const inputContainer = document.createElement('div');
    inputContainer.id = 'custom-input-container';
    inputContainer.style.position = 'fixed'; // 或其他位置样式，根据需要调整
    inputContainer.style.top = '10px';
    inputContainer.style.right = '10px';
    inputContainer.style.zIndex = '9999';
    inputContainer.innerHTML = `
        <label for="name-input">Name:</label>
        <input type="text" id="name-input" value="${name}">
        <label for="max-price-input">Max Price:</label>
        <input type="text" id="max-price-input" value="${max_price}"><br>
        <p id="price_display"></p>
    `;
    document.body.appendChild(inputContainer);

    // 添加事件监听器以更新name和max_price
    document.getElementById("name-input").addEventListener("input", () => {
        name = event.target.value;
        localStorage.setItem("AutoPrice_Name", name);
    });

    document.getElementById("max-price-input").addEventListener("input", () => {
        max_price = parseInt(event.target.value.replace(/,/g, ""), 10); // 移除逗号并转换为整数
    });



    function sendPrice(){
        console.log("现在加价");
        document.querySelector("#tlpop_form .button_border").click();
    }

    document.querySelector("#price_display").innerHTML = "请设置最大价格";

    // Mutation Observer 实例化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            let leftTime = document.querySelector('#tl_pop_countdown').textContent.split(':');
            let nowPrice = parseInt(document.querySelector('#minbid').textContent.replace(new RegExp(",","g"),""));

            let now = document.querySelector("#clubform_0") ? document.querySelector("#clubform_0").innerText : "";

            document.querySelector("#price_display").innerHTML = max_price == "" ? "请设置最大价格" : ("剩余时间:" + leftTime + " 当前价格: " + nowPrice + " 领先人:" + now + " 冷却:" + t + "<br>最大价格:" + max_price);

            if(t > 0){
                t--; return;
            }

            if(nowPrice < max_price && t == -1 && now != name && leftTime.length == 2 && leftTime[0] === "01" && (leftTime[1] == "40" || leftTime[1] == "41" || leftTime[1] == "42")){
                t = 30;
                sendPrice(nowPrice);
            }

            if(nowPrice < max_price && leftTime.length == 2 && leftTime[0] === "00" && now != name && (leftTime[1] == "05" || leftTime[1] == "04" || leftTime[1] == "03")){
                t = 30;
                sendPrice(nowPrice);
            }

        });
    });

    // 监视整个文档的变化
    mutationObserver.observe(document.querySelector('#modal .inner'), {
        childList: true,
        subtree: true,
    });
})();