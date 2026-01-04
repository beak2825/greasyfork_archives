// ==UserScript==
// @name         jd抢购
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  jd秒杀抢购脚本
// @author       寻步
// @match        https://item.jd.com/*
// @match        https://cart.jd.com/*
// @match        https://trade.jd.com/shopping/order/getOrderInfo.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469893/jd%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/469893/jd%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Your code here...


    const item = GM_getValue("jd_flash", {});//获取京东秒杀列表 {itemId: string ,flash_time:[hour,min]}
    console.log(item);
    if ("itemId" in item) {
        //正在抢购中
        let itemId = item["itemId"];
        console.log("itemid:", itemId);
        let flash_time = new Date();
        flash_time.setSeconds(0);
        flash_time.setMilliseconds(0);
        flash_time.setHours(item["flash_time"][0])
        flash_time.setMinutes(item["flash_time"][1])
        if (new Date() - flash_time > 5 * 1000) {//如果进入页面时超过抢购值三秒则不抢购
            console.log("抢购过时，恢复未抢购状态");
            GM_setValue("jd_flash", {});//加入购物车后恢复未抢购状态
            location.reload()
        }
        if (window.location.href.startsWith(`https://item.jd.com/${itemId}.html`)) {
            //商品页
            console.log("在抢购商品页");

            //设置面板
            const setting = document.createElement("div");
            setting.style.cssText = `
            z-index:999;
            position:fixed;
            width:100px;
            min-heigh:200px;
            padding:2px;
            top:1rem;
            right:1rem;
            border: solid black 2px;
            border-radius: 13px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:space-around;
            background-color:white;
        `;
            setting.innerHTML = `
        <div>抢购时间：</div>
        <div>${flash_time.getMonth() + 1}月${flash_time.getDate()}日 ${flash_time.getHours()}:${flash_time.getMinutes()}</div>
        <div>倒计时：</div>
        <div id="GM_div_cd">?秒</div>
        <button id="GM_btn_rmflash">取消抢购</button>
        `;
            document.body.append(setting);
            let btn = document.querySelector("#GM_btn_rmflash")
            btn.onclick = () => {
                GM_setValue("jd_flash", {});
                location.reload();
            }

            let cdElem = document.querySelector("#GM_div_cd")
            //抢购
            let now;
            
            let timer;
            function run(){
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://sgm-m.jd.com/h5/",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    onload: function (response) {
                        now = new Date(
                            response.responseHeaders.match(/date: (.+?)[\n\r]/)[1]
                        );
                    },
                });
                if (flash_time - now <= 0) {
                    if(timer)clearTimeout(timer)
                    window.location.href = `//cart.jd.com/gate.action?pid=${itemId}&pcount=1&ptype=1`;
                    return 
                } else {
                    cdElem.textContent = `${(flash_time - now) / 1000}秒`;
                    console.log(`时间还差${(flash_time - now) / 1000}秒`);
                }
                const relay =(flash_time - now)/1000>5?250:62.5//分段延时
                timer=setTimeout(run,relay)
            }
            run()

        } else if (window.location.href.startsWith(`https://item.jd.com`)) {
            //抢购了，但当前页非抢购物品页面
            console.log("正在抢购的itemId:", itemId);
            not_flash_page()
        }
        else if (
            window.location.href.startsWith(`https://cart.jd.com/addToCart.html`) &&
            window.location.href.includes(`${itemId}`)
        ) {
            //已加入购物车
            console.log("已加入购物车");
            window.location.href = `https://cart.jd.com/cart_index`;
        } else if (window.location.href.startsWith(`https://cart.jd.com/cart_index`)) {
            //购物车界面
            console.log("购物车界面");
            window.onload = () => {
                setTimeout(
                    () => {
                        let btn = document.querySelector("#cart-body div.options-box > div.right > div > div.btn-area > a")
                        if(!btn){
                            btn = document.querySelector("#cart-body div.options-box > div.right > div > div.btn-area > a")
                        }
                        console.log("btn:", btn);
                        btn.click();
                    }
                )
            }
        } else if (
            window.location.href.startsWith(`https://trade.jd.com/shopping/order/getOrderInfo.action`)
        ) {
            //结算页面（最后一个页面）
            console.log("结算页面");
            window.onload = () => {
                setTimeout(
                    () => {
                        let btn = document.querySelector("#order-submit");
                        if(!btn)btn = document.querySelector("#order-submit");
                        btn.click();
                    }
                )
            }

            GM_setValue("jd_flash", {});//加入购物车后恢复未抢购状态
        }
    } else if (window.location.href.startsWith(`https://item.jd.com`)) {
        //未抢购任何物品
        not_flash_page();
    } else {
        console.log("未匹配");
    }
})();


function not_flash_page() {
    //未抢购当前物品（包含未抢购物品与正在抢购但非当前物品两种情况）

    console.log("在未抢购商品页");
    let itemId_now = window.location.href.match(/com\/(\d+)\.html/)[1];
    const setting = document.createElement("div");
    setting.style.cssText = `
            z-index:999;
            position:absolute;
            width:100px;
            min-heigh:200px;
            padding:2px;
            top:1rem;
            right:1rem;
            border: solid black 2px;
            border-radius: 13px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:space-around;
            background-color:white;
        `;
    setting.innerHTML = `
        <div>未抢购</div>
        <div>时：<input type="text" id="GM_input_hour" style="width:3rem;"></div>
        <div>分：<input type="text" id="GM_input_min" style="width:3rem;"></div>
        <button id="GM_btn_flash">抢购</button>
        `;
    document.body.append(setting);

    let btn = document.querySelector("#GM_btn_flash");
    btn.onclick = () => {
        if (document.querySelector("#GM_input_hour").value == '' || document.querySelector("#GM_input_min").value === '') {
            alert("请输入抢购时间")
            return
        }
        let hour = new Number(document.querySelector("#GM_input_hour").value);
        let minutes = new Number(document.querySelector("#GM_input_min").value);
        console.log(hour, minutes);
        if (isNaN(hour) || isNaN(minutes)) {
            alert("请输入数字")
            return
        }
        let flash_time = new Date();
        flash_time.setHours(hour)
        flash_time.setMinutes(minutes)
        flash_time.setSeconds(0);
        flash_time.setMilliseconds(0);
        if (new Date() - flash_time >= 0) {
            alert("抢购时间不能小于当前时间")
            return
        }
        GM_setValue("jd_flash", { itemId: itemId_now, flash_time: [parseFloat(hour.toString()), parseFloat(minutes.toString())] });
        location.reload();
    }
}