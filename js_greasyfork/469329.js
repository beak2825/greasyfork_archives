// ==UserScript==
// @name         淘宝代拍辅助
// @namespace    https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm
// @version      2.2.9
// @description  淘宝代发辅助：SKU选择，地址填充；订单数据导出；售后整理；
// @author       You
// @match        https://trade.taobao.com/trade/detail/trade_order_detail.htm*
// @match        https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @match        https://refund2.taobao.com/dispute/buyerDisputeList.htm*
// @match        https://member1.taobao.com/*
// @match        https://item.taobao.com/*
// @match        https://buy.taobao.com/auction/buy_now.jhtml*
// @icon         https://img.alicdn.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/469329/%E6%B7%98%E5%AE%9D%E4%BB%A3%E6%8B%8D%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/469329/%E6%B7%98%E5%AE%9D%E4%BB%A3%E6%8B%8D%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const SHOPS = ["喵狗狗", "疯癫4891"];
    const STOP_TRADE_ID = "3466491444384286147";

    // 包装用于缩进
    (() => {
        if (document.URL.includes("https://trade.taobao.com/trade/detail/trade_order_detail.htm")) {
            setTimeout(saveTrade, 1000);
        } else if (document.URL.includes("https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm")) {
            GM_registerMenuCommand("遍历订单列表", listTrade);
            GM_registerMenuCommand("复制回传物流", getTrade);
            GM_registerMenuCommand("导出订单统计", exportTrades);
            GM_registerMenuCommand("导出指定订单", exportTrade);
            GM_registerMenuCommand("添加下单按钮", addDealButton);
            GM_registerMenuCommand("开启/关闭自动刷新", () => {
                const auto_reload_tb = GM_getValue("auto_reload_tb", false);
                GM_setValue("auto_reload_tb", !auto_reload_tb);
                if (auto_reload_tb) {
                    alert("自动刷新已关闭");
                }else{
                    alert("自动刷新已开启");
                }
                location.reload();
            });
        } else if (document.URL.includes("https://refund2.taobao.com/dispute/buyerDisputeList.htm")) {
            GM_registerMenuCommand("复制退款单号", refundTrade);
        } else if (document.URL.includes("https://member1.taobao.com")) {
            setTimeout(fillAddress, 1000);
        } else if (document.URL.includes("https://item.taobao.com")) {
            setTimeout(selectTaoBaoSKU, 2000);
        } else if (document.URL.includes("https://buy.taobao.com/auction/buy_now.jhtml")) {
            setTimeout(privateTrade, 1000);
        }
        setTimeout(addDealButton, 1500);
        setTimeout(() => {
            if (!document.URL.includes("https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm")) {
                return;
            }
            if (!GM_getValue("auto_reload_tb", false)) {
                return;
            }
            try {
                const title = document.querySelector("#tp-bought-root").firstChild.innerText;
                for (let t of title.split('\n|\n')) {
                    if (t.includes("待发货")) {
                        if(t.length > 3){
                            const count = t.replace('待发货', '');
                            ttsplay("淘宝未发货订单" + count + '个');
                        }else{
                            GM_setValue("auto_reload_tb", true)
                            setInterval(()=>{
                                ttsplay("淘宝订单发货完成");
                            },10000);
                        }
                        break;
                    }
                }
            } catch (error) {
                console.log("获取已买的宝贝列表标题失败", error)
            }
            setTimeout(() => {
                location.reload();
            }, 60000 * 3);
            console.log("3分钟后刷新页面");
        }, 5000)
    })();

    // 添加按钮
    function addDealButton() {
        if (document.querySelector("#deal666")) { return; }
        document.querySelector("#J_MtMainNav").appendChild(function () {
            let li = document.createElement("li");
            li.id = "deal666"
            li.innerText = "剪贴板下单";
            li.onclick = parseTrade;
            li.style = "color:white;";
            return li;
        }());
    }

    // 读取剪贴板订单信息，打开对应链接
    async function parseTrade() {
        // 剪贴板读取
        let trade_str = "";
        try {
            trade_str = await navigator.clipboard.readText();
        } catch (error) {
            console.log("获取剪贴板失败: ", error);
            return;

        }
        console.log(trade_str);
        // 转JSON
        let trade, goods;
        try {
            trade = JSON.parse(trade_str);
            goods = trade.GoodsArray[0].Code;
        } catch (error) {
            console.log("剪贴板转JSON错误：", error);
            alert("剪贴板内不是JSON订单信息/信息缺失");
            return;
        }
        console.log(trade);
        // 商品配置
        const url_list = [
            {
                description: "蒲草猫窝基础款、趣味款",
                code: ['WB058501', 'WB058502', 'WB058503', 'WB058505', 'WB058506', 'WB058507', 'WB058508', 'WB058509', 'WB058510', 'WB058511', 'WB058512', 'WB058513', 'WB058515', 'WB058516', 'WB058517', 'WB058521', 'WB058522', 'WB058523', 'WB058525', 'WB058526', 'WB058527', 'WB058528', 'WB058529', 'WB058530', 'WB058531', 'WB058532', 'WB058533', 'WB058535', 'WB058536', 'WB058537'],
                url: "https://item.taobao.com/item.htm?id=712105258301",
            },
            {
                description: "蒲草猫窝全草款",
                code: ['WB058551', 'WB058552', 'WB058553', 'WB058555', 'WB058556', 'WB058557', 'WB058558', 'WB058559', 'WB058560', 'WB058561', 'WB058562', 'WB058563', 'WB058565', 'WB058566', 'WB058567', 'WB058575', 'WB058576', 'WB058577', 'WB058578', 'WB058579', 'WB058580', 'WB058581', 'WB058582', 'WB058583', 'WB058585', 'WB058586', 'WB058587'],
                url: "https://item.taobao.com/item.htm?id=674234561880",
            }
        ];
        // 遍历配置，打开对应网页
        for (let url of url_list) {
            console.log(url);
            if (url.code.includes(goods)) {
                GM_setValue("current_trade", trade);
                GM_setValue("auto_order", true);
                window.open(url.url, "_blank");
                return;
            }
        }
        // 没有匹配提示
        alert(`商品未配置对应链接：\n${trade.GoodsString}`);
    }

    // 淘宝SKU选择
    function selectTaoBaoSKU() {
        if (!GM_getValue("auto_order", false)) {
            return;
        }
        let url = null;
        if (document.URL.includes("674234561880")) {
            url = {"蒲草猫窝全草款-S":{"color":"猫耳裸窝/","size":"S-小型"},"蒲草猫窝全草款-M":{"color":"猫耳裸窝/","size":"M-中型"},"蒲草猫窝全草款-L":{"color":"猫耳裸窝/","size":"L-大型"},"蒲草猫窝全草款-S+蓝垫子":{"color":"猫耳+蓝垫子/","size":"S-小型"},"蒲草猫窝全草款-M+蓝垫子":{"color":"猫耳+蓝垫子/","size":"M-中型"},"蒲草猫窝全草款-L+蓝垫子":{"color":"猫耳+蓝垫子/","size":"L-大型"},"蒲草猫窝全草款-S+蓝垫子+蓝靠枕":{"color":"猫耳+蓝垫子+抱枕/","size":"S-小型"},"蒲草猫窝全草款-M+蓝垫子+蓝靠枕":{"color":"猫耳+蓝垫子+抱枕/","size":"M-中型"},"蒲草猫窝全草款-L+蓝垫子+蓝靠枕":{"color":"猫耳+蓝垫子+抱枕/","size":"L-大型"},"蒲草猫窝全草款-S+蓝垫子+蓝靠枕+凉席":{"color":"猫耳+蓝垫子+抱枕+凉席/","size":"S-小型"},"蒲草猫窝全草款-M+蓝垫子+蓝靠枕+凉席":{"color":"猫耳+蓝垫子+抱枕+凉席/","size":"M-中型"},"蒲草猫窝全草款-L+蓝垫子+蓝靠枕+凉席":{"color":"猫耳+蓝垫子+抱枕+凉席/","size":"L-大型"},"蒲草猫窝全草款-S+蓝垫子+凉席":{"color":"猫耳+蓝垫子+凉席/","size":"S-小型"},"蒲草猫窝全草款-M+蓝垫子+凉席":{"color":"猫耳+蓝垫子+凉席/","size":"M-中型"},"蒲草猫窝全草款-L+蓝垫子+凉席":{"color":"猫耳+蓝垫子+凉席/","size":"L-大型"},"蒲草猫窝全草款-S+白垫子":{"color":"猫耳+白垫子/","size":"S-小型"},"蒲草猫窝全草款-M+白垫子":{"color":"猫耳+白垫子/","size":"M-中型"},"蒲草猫窝全草款-L+白垫子":{"color":"猫耳+白垫子/","size":"L-大型"},"蒲草猫窝全草款-S+白垫子+白靠枕":{"color":"猫耳+白垫子+抱枕/","size":"S-小型"},"蒲草猫窝全草款-M+白垫子+白靠枕":{"color":"猫耳+白垫子+抱枕/","size":"M-中型"},"蒲草猫窝全草款-L+白垫子+白靠枕":{"color":"猫耳+白垫子+抱枕/","size":"L-大型"},"蒲草猫窝全草款-S+白垫子+白靠枕+凉席":{"color":"猫窝+白垫子+抱枕+凉席/","size":"S-小型"},"蒲草猫窝全草款-M+白垫子+白靠枕+凉席":{"color":"猫窝+白垫子+抱枕+凉席/","size":"M-中型"},"蒲草猫窝全草款-L+白垫子+白靠枕+凉席":{"color":"猫窝+白垫子+抱枕+凉席/","size":"L-大型"},"蒲草猫窝全草款-S+白垫子+凉席":{"color":"猫耳+白垫子+凉席/","size":"S-小型"},"蒲草猫窝全草款-M+白垫子+凉席":{"color":"猫耳+白垫子+凉席/","size":"M-中型"},"蒲草猫窝全草款-L+白垫子+凉席":{"color":"猫耳+白垫子+凉席/","size":"L-大型"}};
        } else if (document.URL.includes("712105258301")) {
            url = { "蒲草猫窝基础款-S": { "color": "玫白色裸窝", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝基础款-M": { "color": "玫白色裸窝", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝基础款-L": { "color": "玫白色裸窝", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝基础款-S+棉垫": { "color": "玫白+蓝色棉垫", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝基础款-M+棉垫": { "color": "玫白+蓝色棉垫", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝基础款-L+棉垫": { "color": "玫白+蓝色棉垫", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝基础款-S+棉垫+靠枕": { "color": "玫白+蓝色棉垫+靠枕", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝基础款-M+棉垫+靠枕": { "color": "玫白+蓝色棉垫+靠枕", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝基础款-L+棉垫+靠枕": { "color": "玫白+蓝色棉垫+靠枕", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝基础款-S+棉垫+靠枕+凉席": { "color": "玫白+蓝色棉垫+靠枕+竹凉席", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝基础款-M+棉垫+靠枕+凉席": { "color": "玫白+蓝色棉垫+靠枕+竹凉席", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝基础款-L+棉垫+靠枕+凉席": { "color": "玫白+蓝色棉垫+靠枕+竹凉席", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝基础款-S+棉垫+凉席": { "color": "玫白+蓝色棉垫+竹凉席", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝基础款-M+棉垫+凉席": { "color": "玫白+蓝色棉垫+竹凉席", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝基础款-L+棉垫+凉席": { "color": "玫白+蓝色棉垫+竹凉席", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝趣味款-S": { "color": "玫白色趣味款", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝趣味款-M": { "color": "玫白色趣味款", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝趣味款-L": { "color": "玫白色趣味款", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝趣味款-S+棉垫": { "color": "玫白趣味款+蓝色棉垫", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝趣味款-M+棉垫": { "color": "玫白趣味款+蓝色棉垫", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝趣味款-L+棉垫": { "color": "玫白趣味款+蓝色棉垫", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝趣味款-S+棉垫+靠枕": { "color": "玫白趣味款+蓝色棉垫+靠枕", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝趣味款-M+棉垫+靠枕": { "color": "玫白趣味款+蓝色棉垫+靠枕", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝趣味款-L+棉垫+靠枕": { "color": "玫白趣味款+蓝色棉垫+靠枕", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝趣味款-S+棉垫+靠枕+凉席": { "color": "玫白趣味款+蓝色棉垫+靠枕+竹凉席", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝趣味款-M+棉垫+靠枕+凉席": { "color": "玫白趣味款+蓝色棉垫+靠枕+竹凉席", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝趣味款-L+棉垫+靠枕+凉席": { "color": "玫白趣味款+蓝色棉垫+靠枕+竹凉席", "size": "L-大型（适合18斤内猫）" }, "蒲草猫窝趣味款-S+棉垫+凉席": { "color": "玫白趣味款+蓝色棉垫+竹凉席", "size": "S-小型（适合小奶猫）" }, "蒲草猫窝趣味款-M+棉垫+凉席": { "color": "玫白趣味款+蓝色棉垫+竹凉席", "size": "M-中型（适合12斤内猫）" }, "蒲草猫窝趣味款-L+棉垫+凉席": { "color": "玫白趣味款+蓝色棉垫+竹凉席", "size": "L-大型（适合18斤内猫）" } };
        } else {
            alert("未配置此链接");
            return;
        }
        // 从缓存提取订单信息
        const trade = GM_getValue("current_trade", null);
        if (trade === null) { return; }
        const goods = url[trade.GoodsArray[0].Name];
        if (goods === undefined) {
            alert(`商品/页面不匹配或页面有更新:${trade.GoodsArray[0].Name}`);
            return;
        }
        console.log(goods);
        const skus = document.querySelectorAll("div.tb-skin ul");
        const color = skus[0];
        const size = skus[1];
        let temp = ``;
        for (let s of color.querySelectorAll("li")) {
            let sp = s.querySelector("span");
            if (sp.innerText === goods.color) {
                s.click();
                break;
            }
            // console.log(sp.innerText);
            temp += `${sp.innerText}\n`;
        }
        for (let s of size.querySelectorAll("li")) {
            let sp = s.querySelector("span");
            if (sp.innerText === goods.size) {
                s.click();
                break;
            }
            // console.log(sp.innerText);
            temp += `${sp.innerText}\n`;
        }
        console.log(temp);
    }

    // 淘宝地址填充
    function fillAddress() {
        if (!GM_getValue("auto_order", false)) {
            return;
        }
        let addr = GM_getValue("current_trade", null);
        if (addr === null) {
            return;
        }
        GM_setValue("current_trade", null);
        GM_setValue("auto_order", false);
        setTimeout(fillAddress2(addr), 1000);
        async function fillAddress2(addr) {
            let newAddress = document.querySelector("div.page-buy");
            if (newAddress === null) {
                newAddress = document.querySelector("div.page-index");
            }
            if (newAddress === null) { console.log("地址编辑框获取失败"); return; }
            // 地址选择区域
            let selectBox = newAddress.querySelector("div.cndzk-entrance-division-box");
            if (selectBox === null) {
                // 地址信息选择框
                const addressBox = newAddress.querySelector("div.cndzk-entrance-division-header-click");
                addressBox.click();
                selectBox = newAddress.querySelector("div.cndzk-entrance-division-box");
            }
            const cityType = selectBox.querySelectorAll("ul.cndzk-entrance-division-box-title li");
            if (cityType.length < 4) { console.log("省市区tab获取失败"); return; }
            const cityTabs = {
                sheng: cityType[0],
                shi: cityType[1],
                qu: cityType[2],
                jie: cityType[3]
            }
            // console.log(cityTabs);
            class CityContent {
                box = {};
                cityContent = [];
                constructor(box) {
                    this.box = box;
                }
                reload() {
                    this.cityContent = this.box.querySelectorAll("ul.cndzk-entrance-division-box-content div li");
                }
                select(city) {
                    console.log(city);
                    for (let c of this.cityContent) {
                        if (c.innerText.includes(city.slice(0, 3)) || city.includes(c.innerText)) {
                            c.click();
                            console.log("clicked", c.innerText)
                            return true;
                        }
                    }
                    return false;
                }
            }
            const cities = new CityContent(selectBox);
            console.log(cities);
            // 点击省tab
            await new Promise((resolve) => {
                cityTabs.sheng.click();
                setTimeout(() => {
                    resolve(true);
                }, 600);
            });
            // 获取省列表，点击省，自动跳转下一级
            await new Promise((resolve) => {
                cities.reload();
                const done = cities.select(addr.Sheng);
                setTimeout(() => {
                    resolve(done);
                }, 600);
            });
            await new Promise((resolve) => {
                if (!cityTabs.shi.classList.toString().includes("active")) {
                    resolve(false);
                }
                cities.reload();
                const done = cities.select(addr.Shi);
                setTimeout(() => {
                    resolve(done);
                }, 600);
            });
            await new Promise((resolve) => {
                if (!cityTabs.qu.classList.toString().includes("active")) {
                    resolve(false);
                }
                cities.reload();
                const done = cities.select(addr.Qu);
                setTimeout(() => {
                    resolve(done);
                }, 600);
            });
            await new Promise((resolve) => {
                if (!cityTabs.jie.classList.toString().includes("active")) {
                    resolve(false);
                }
                cities.reload();
                const done = cities.select(addr.Other);
                const ipt = document.createElement("input");
                ipt.style.background = "green";
                ipt.style.width = "22%";
                ipt.style.marginLeft = "80px";
                ipt.style.fontSize = "15px";
                ipt.value = "匹配完成";
                if (!done) {
                    ipt.style.background = "red";
                    ipt.value = "需要手工确认";
                }
                newAddress.querySelector("div.cndzk-entrance-division-header-click").parentElement.appendChild(ipt);
                newAddress.querySelector("div.cndzk-entrance-division-header-click").parentElement.appendChild(function () {
                    const ipt2 = document.createElement("span");
                    ipt2.style.background = "yellow";
                    ipt2.style.fontSize = "15px";
                    ipt2.innerText = "请核对[绿色区域]=[对应数据框]一致";
                    return ipt2;
                }());
                resolve(0);
            });

            // 详细地址
            const area_textarea = newAddress.querySelector("textarea.cndzk-entrance-associate-area-textarea");
            changeReactInputValue(area_textarea, addr.Other);
            area_textarea.parentElement.appendChild(function () {
                const ipt = document.createElement("input");
                ipt.style.background = "green";
                ipt.style.width = "100%";
                ipt.style.height = "20px";
                ipt.readOnly = true;
                ipt.value = addr.Other;
                return ipt;
            }());

            // 名称填充
            const fullName = newAddress.querySelector("#fullName");
            if (!isNaN(addr.Ext)) {
                addr.Name = `${addr.Name}-${addr.Ext}`;
            }
            changeReactInputValue(fullName, addr.Name);
            fullName.parentElement.appendChild(function () {
                const ipt = document.createElement("input");
                ipt.style.background = "green";
                ipt.style.width = "100%";
                ipt.readOnly = true;
                ipt.value = addr.Name;
                return ipt;
            }());

            // 手机号填充
            const mobile = newAddress.querySelector("#mobile");
            changeReactInputValue(mobile, addr.Mobile);
            mobile.parentElement.appendChild(function () {
                const ipt = document.createElement("input");
                ipt.style.background = "green";
                ipt.style.width = "100%";
                ipt.readOnly = true;
                ipt.value = addr.Mobile;
                return ipt;
            }());

            // 邮编清空
            const postid = newAddress.querySelector('#post');
            changeReactInputValue(postid, "");
        }
    }

    // 打开匿名购买，关闭隐私保护
    function privateTrade() {
        const anonymousIpt = document.querySelector("#anonymousPC_1 input");
        if (!anonymousIpt.checked) {
            anonymousIpt.click();
            console.log("已勾选匿名下单");
        }
        const privateIpt = document.querySelector("#privacyPC_1 input");
        if (privateIpt.checked) {
            privateIpt.click();
            console.log("已取消隐私保护");
        }
        // 缓存提取订单信息
        const trade = GM_getValue("current_trade", null);
        if (trade === null) { return; }
        const textareas = document.querySelectorAll("textarea");
        for (let txt of textareas) {
            if (txt.id.startsWith("textarea_memoPC")) {
                changeReactInputValue(txt, trade.SysId);
                txt.focus();
                break;
            }
        }
        // 1秒后，自动点击修改地址
        setTimeout(() => {
            document.querySelector("a.modify-operation").click();
        }, 1000);
    }

    // 复制退款单号金额
    function refundTrade() {
        const tradesHead = document.querySelectorAll("div.mod-dispute-header");
        const tradesBody = document.querySelectorAll("div.mod-dispute-body");
        let results = ``;
        for (let i = 0; i < tradesHead.length; i++) {
            const temp = { "id": "", "money": 0 };
            const header = tradesHead[i];
            const shop = header.innerText.split("\n")[4];
            console.log("店铺：", shop)
            if (!SHOPS.includes(shop)) {
                console.log("店铺：", shop, "跳过")
                continue;
            }
            console.log("店铺：", shop, "统计");
            const id = header.querySelector("div.copy-container em");
            temp.id = id.innerText;
            const body = tradesBody[i];
            for (let sp of body.querySelectorAll("span")) {
                if (sp.innerText.startsWith("￥")) {
                    const reg = /\b[\\.@0-9]*/g;
                    temp.money = reg.exec(sp.innerText)[0];
                } else if (sp.innerText.startsWith("20") && sp.innerText.includes("-") && sp.innerText.includes(":")) {
                    temp.date = sp.innerText;
                }
            }
            console.log(temp);
            results += `${temp.date}\t${temp.id}\t${temp.money}\n`;
        }
        results += "\n";
        results = results.replace("\n\n", "");
        GM_setClipboard(results);
        console.log(results);
        showToast("已复制到剪贴板");
    }

    // 从缓存导出指定订单统计
    function exportTrade() {
        let key = prompt("输入淘宝订单号");
        for (let k of [" ", "\'", "\t", "\n"]) {
            key = key.replace(k, "");
        }
        if (key.length !== 19 && isNaN(Number(key))) {
            showToast("订单号不符合验证规则");
        }
        const temp = GM_getValue(key, null);
        if (temp === null) {
            showToast(`订单${key}未缓存`);
            return;
        }
        const results = `${temp.dateCreate}\t${temp.datePay}\t${temp.tbid}\t${temp.address}\t${temp.color}\t${temp.size}\t${temp.cost}\t${temp.number}\t${temp.express}\t${temp.sysid}`;
        console.log(results);
        GM_setClipboard(results);
        showToast("已导出到剪贴板");
    }

    // 从缓存导出订单统计
    function exportTrades() {
        const keys = GM_listValues();
        const exportAll = confirm("导出所有？");
        let dateInput = "";
        if (!exportAll) {
            dateInput = prompt("请输入日期（5-20格式）");
            if (dateInput === null) {
                return;
            }
        }
        let results = ``;
        for (let k of keys) {
            if (k.length === 19 && !isNaN(Number(k))) {
                const temp = GM_getValue(k, null);
                if (temp !== null) {
                    if (exportAll || temp.datePay.includes(dateInput)) {
                        results += `${temp.dateCreate}\t${temp.datePay}\t${temp.tbid}\t${temp.address}\t${temp.color}\t${temp.size}\t${temp.cost}\t${temp.number}\t${temp.express}\t${temp.sysid}\n`;
                    }
                }
            }
        }
        results += "\n";
        results = results.replace("\n\n", "");
        console.log(results);
        GM_setClipboard(results);
        showToast("已导出到剪贴板");
    }

    // 从缓存获取物流回传
    function getTrade() {
        const keys = GM_listValues();
        const exportAll = confirm("导出所有？");
        let dateInput = "";
        if (!exportAll) {
            dateInput = prompt("请输入日期（5-20格式）");
            if (dateInput === null) {
                return;
            }
        }
        let results = ``;
        for (let k of keys) {
            if (k.length === 19 && !isNaN(Number(k))) {
                const temp = GM_getValue(k, null);
                console.log(temp);
                if (temp.express !== undefined && temp.express !== "—") {
                    if (exportAll || temp.datePay.includes(dateInput)) {
                        results += `${temp.sysid}\t\t${temp.express}\t${temp.number}\n`;
                    }
                }
            }
        }
        results += "\n";
        results = results.replace("\n\n", "");
        console.log(results);
        GM_setClipboard(results);
        showToast("复制成功");
    }

    // 订单列表查看，自动点击订单详情，打开订单详情页
    async function listTrade() {
        const trades = document.querySelectorAll("div.js-order-container");
        GM_setValue("autoclosetab", true);
        GM_setValue("clicktabs_count", 0);
        GM_setValue("openedtabs_count", 0);
        console.log("autoclosetab => true");
        for (let trade of trades) {
            // 判断指定店铺，只统计缓存中的店铺
            // 获取店铺名所在行
            let shop = trade.innerText.split("\n")[0].split("\t")[1];
            console.log("店铺名称：", shop);
            if (SHOPS.includes(shop)) {
                // 获取订单号
                const [, id] = trade.dataset.reactid.split("-");
                // 抵达分割线订单，结束遍历
                if (id === STOP_TRADE_ID) {
                    break;
                }
                // 打印店铺、订单，方便后期debug
                console.log(shop, id);
                // 缓存中获取订单信息
                const temp = GM_getValue(id, null);
                // 如果缓存中不存在
                if (temp === null || temp.express === "—") {
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            console.log(shop, id, "进入详情");
                            const viewDetail = trade.querySelector("#viewDetail");
                            if (viewDetail !== null) {
                                console.log("点击：", GM_getValue("clicktabs_count", -1), GM_getValue("openedtabs_count", -1))
                                viewDetail.click();
                                const clicktabs_count = GM_getValue("clicktabs_count", 0);
                                GM_setValue("clicktabs_count", clicktabs_count + 1);
                            }
                            resolve(true);
                        }, 1000);
                    });
                } else {
                    console.log("订单已统计，跳过..")
                }
            }
        }
        const open_misson_id = setInterval(() => {
            console.log("等待完成中...")
            const clicktabs_count = GM_getValue("clicktabs_count", -1);
            const openedtabs_count = GM_getValue("openedtabs_count", -1);
            console.log("tags:", clicktabs_count, openedtabs_count)
            if (clicktabs_count <= openedtabs_count) {
                GM_setValue("autoclosetab", false);
                clearInterval(open_misson_id);
                console.log("autoclosetab => false");
            }
        }, 1000);
    }

    // 订单详情页面，复制信息到缓存
    function saveTrade() {
        const openedtabs_count = GM_getValue("openedtabs_count", 0);
        GM_setValue("openedtabs_count", openedtabs_count + 1);
        const area = document.querySelector("#detail-panel");
        if (area === null) { return; }
        const field = [
            ["买家留言：\n", "买家留言：\t"],
            ["订单编号:\n", "订单编号:\t"],
            ["创建时间:\n", "创建时间:\t"],
            ["付款时间:\n", "付款时间:\t"],
            ["收货地址：\n", "收货地址：\t"],
            ["昵称：\n", "昵称：\t"],
        ];
        let text = area.innerText;
        for (let f of field) {
            text = text.replace(f[0], f[1]);
        }
        // console.log(text);
        const list = text.split("\n");
        const result = {};
        for (let v of list) {
            // console.log(v);
            if (v.includes("物流公司")) {
                result.express = v.split("\t")[1];
            } else if (v.includes("运单号码")) {
                result.number = v.split("\t")[1];
            } else if (v.includes("买家留言")) {
                result.sysid = v.split("\t")[1];
            } else if (v.includes("订单编号")) {
                result.tbid = v.split("\t")[1];
            } else if (v.includes("创建时间")) {
                result.dateCreate = v.split("\t")[1];
            } else if (v.includes("付款时间")) {
                result.datePay = v.split("\t")[1];
            } else if (v.includes("收货地址")) {
                result.address = v.split("\t")[1];
            } else if (v.includes("实付款")) {
                result.cost = v.replace("实付款：￥", "").replace(" 元", "");
            } else if (v.includes("颜色分类")) {
                result.color = v.split("：")[1];
            } else if (v.includes("适用尺码")) {
                result.size = v.split("：")[1];
            } else if (v.includes("昵称")) {
                result.ww = v.split("\t")[1];
            }
        }
        console.log(result);
        // GM_setClipboard(`${result.sysid}\t\t${result.express}\t${result.number}`);
        // 非指定店铺不统计
        if (!SHOPS.includes(result.ww)) {
            console.log(result.ww, "不在预设店铺，不保存订单");
            return;
        }
        // 未付款的不统计
        if (result.datePay !== undefined) {
            GM_setValue(result.tbid, result);
            console.log(`已添加/更新订单：${result.tbid}`);
        }
        console.log(GM_getValue("autoclosetab", false));
        if (GM_getValue("autoclosetab", false)) {
            window.close();
        }
    }

    // tts提示
    function ttsplay(text) {
        const msg = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    // 淘宝试用的是react，不能直接修改input值
    function changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }

    // 提示条
    function showToast(msg, duration) {
        duration = isNaN(duration) ? 1500 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "width:60%; min-width:100px; background:#6495ED; opacity:0.6; height:auto;min-height: 50px; color:#fff; line-height:50px; text-align:center; border-radius:4px; position:fixed; top:30%; left:20%; z-index:999999; font-size:36px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }
})();