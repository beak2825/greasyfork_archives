// ==UserScript==
// @name         jd秒杀购物车
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  jd秒杀购物车脚本
// @author       寻步
// @match        https://*.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469978/jd%E7%A7%92%E6%9D%80%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/469978/jd%E7%A7%92%E6%9D%80%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // Your code here...
    // GM_setValue("jd_clearCartPlan", init_plan())//购买状态
    GM_registerMenuCommand("前往购物车🛒", () => {
        location.href = `https://cart.jd.com/cart_index`;
    })
    if (location.href.startsWith("https://item.jd.com")) {
        console.log("商品页")
        //当前页的itemId
        const itemId = location.href.match(/com\/(\d+)\.html/)[1];

        GM_registerMenuCommand("将当前商品加入购物车💴🛒", () => {
            location.href = `//cart.jd.com/gate.action?pid=${itemId}&pcount=1&ptype=1`;
        })
    }
    else if (location.href.startsWith("https://cart.jd.com/cart_index")) {
        console.log("购物车页面");
        window.onload = () => {
            let jd_clearCartPlan = GM_getValue("jd_clearCartPlan", init_plan());//秒杀购物车计划信息{time:Date}
            console.log("jd_clearCartPlan:", jd_clearCartPlan);
            if (jd_clearCartPlan.type === "waiting") {
                /**@type {Date} */
                const time = new Date(jd_clearCartPlan.time);//计划秒杀购物车的时间
                const TIMEOUT = 5 * 1000
                if (new Date() - time > TIMEOUT) {
                    GM_setValue("jd_clearCartPlan", init_plan());
                    location.reload();
                }
                console.log("等待秒杀购物车");
                const setting = document.createElement('div');
                setting.innerHTML = `
                    <div>秒杀时间</div>
                    <div>${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}</div>
                    <div>倒计时</div>
                    <div id="GM_div_cd">?</div>
                    <button id="GM_btn_cancel" >取消</button>
                `;
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
                document.body.append(setting);
                let select_all = document.querySelector(`[name="select-all"]`);//全选checkbox
                let submitButton = document.querySelector(`.common-submit-btn`);//提交按钮
                console.log(select_all,submitButton);
                const GM_div_cd = document.querySelector('#GM_div_cd');
                const GM_btn_cancel = document.querySelector('#GM_btn_cancel');
                let now;//记录setTimeout与当前时间
                let timeFlag = true//是否setTimeOut
                let canClicktoUnchecked = true//如果在0~3秒内发现全选勾上就点击一次取消勾选
                setTimeout(function run() {
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
                            const deltime = time - now;//计划购买时间-当前时间
                            let delay;//间隔时间
                            if (deltime <= 0) {
                                //时间到了开始秒杀购物车
                                console.log("开始秒杀");
                                timeFlag = false;
                                //要求此时应该是非全选状态
                                select_all.addEventListener("change", selectAll)
                                let timer;
                                timer = setTimeout(() => {
                                    alert("全选购物车失败");
                                    GM_setValue("jd_clearCartPlan", init_plan());
                                }, 3000);
                                function selectAll() {
                                    console.log("全选成功");
                                    if (timer) clearTimeout(timer);
                                    GM_setValue("jd_clearCartPlan", { ...jd_clearCartPlan, type: "orderWaiting", time: new Date().toISOString() });
                                    setTimeout(()=>{
                                        console.log("点击提交");
                                        submitButton.click();
                                    },400)
                                    setTimeout(()=>{
                                        console.log("点击提交");
                                        submitButton.click();
                                    },450)
                                    setTimeout(()=>{
                                        console.log("点击提交");
                                        submitButton.click();
                                    },500)
                                    setTimeout(()=>{
                                        console.log("点击提交");
                                        submitButton.click();
                                    },600)
                                    setTimeout(()=>{
                                        console.log("点击提交");
                                        submitButton.click();
                                    },800)      
                                }
                                select_all.click();
                                //进入结算页面
                            } else if (deltime > 0 && deltime < 3 * 1000) {
                                if (select_all.checked && canClicktoUnchecked) {
                                    select_all.click();
                                    canClicktoUnchecked = false;
                                }
                                delay = 62.5;
                                GM_div_cd.textContent = `${deltime / 1000}秒`;
                            } else {
                                delay = 500;
                                GM_div_cd.textContent = `${deltime / 1000}秒`;
                            }
                            if (timeFlag) setTimeout(run, delay);
                        },
                    });

                })

                GM_btn_cancel.onclick = () => {
                    //取消秒杀购物车
                    GM_setValue("jd_clearCartPlan", init_plan());
                    location.reload();
                };

            } else {
                console.log("未等待秒杀购物车");
                const setting = document.createElement('div');
                setting.innerHTML = `
                    <div>计划购买时间</div>
                    <div>时：<input type="number" min="0" id="GM_input_hour" style="width:3rem;border:solid black 1px;margin:2px;"></div>
                    <div>分：<input type="number" min="0" id="GM_input_min"  style="width:3rem;border:solid black 1px;margin:2px;"></div>
                    <button id="GM_btn_sunbmit">秒杀购物车</button>
                `;
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
                document.body.append(setting);
                const GM_input_hour = document.querySelector("#GM_input_hour");
                const GM_input_min = document.querySelector("#GM_input_min");
                const GM_btn_sunbmit = document.querySelector("#GM_btn_sunbmit");
                GM_btn_sunbmit.onclick = () => {
                    const [hour, minutes] = [parseFloat(GM_input_hour.value), parseFloat(GM_input_min.value)];
                    if (isNaN(hour) || isNaN(minutes)) {
                        alert("请输入计划购买时间");
                        return
                    }
                    const time = new Date();
                    time.setSeconds(0);
                    time.setMilliseconds(0);
                    time.setHours(hour);
                    time.setMinutes(minutes);
                    if (new Date() - time >= 0) {
                        alert("购买时间不能小于当前时间");
                        return
                    }
                    GM_setValue("jd_clearCartPlan", { ...init_plan(), type: "waiting", time: time.toISOString() });

                    location.reload();
                }
            }
        };
    } else if (location.href.startsWith(`https://trade.jd.com/shopping/order/getOrderInfo.action`)) {
        console.log("结算界面");
        const jd_clearCartPlan = GM_getValue("jd_clearCartPlan", init_plan());
        const TIMEOUT = 10 * 1000;
        const time = new Date(jd_clearCartPlan.time)
        if (jd_clearCartPlan.type === "orderWaiting") {
            if ((new Date() - time) >= 0 && (new Date() - time) <= TIMEOUT) {
                window.onload = () => {
                    setTimeout(
                        () => {
                            console.log("结算");
                            let btn = document.querySelector("#order-submit");
                            if (!btn) btn = document.querySelector("#order-submit");
                            btn.click();
                        }
                    )
                }
            }
            GM_setValue("jd_clearCartPlan", init_plan());
        }
    }      
})()

function init_plan() {
    return {
        type: "none",//type:"none"无计划,"waiting"表示等待秒杀购物车,"orderWaiting"表示等待结算
        time: null,//计划秒杀购物车时间（jd时间）或等待结算的验证时间（本地机器时间）
    }
}