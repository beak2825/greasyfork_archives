// ==UserScript==
// @name         获取竞价数据（48.gnz48.com）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动提取 Cookie 并请求竞价数据接口
// @author       GPT
// @match        https://48.gnz48.com/pai/item/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541314/%E8%8E%B7%E5%8F%96%E7%AB%9E%E4%BB%B7%E6%95%B0%E6%8D%AE%EF%BC%8848gnz48com%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541314/%E8%8E%B7%E5%8F%96%E7%AB%9E%E4%BB%B7%E6%95%B0%E6%8D%AE%EF%BC%8848gnz48com%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 获取起竞价
    function getStartingBid() {
        const container = document.querySelector("#TabTab03Con1");
        if (!container) return null;
    
        const html = container.innerHTML;
        const match = html.match(/起竞价：<span>(\d+)<\/span>元/);
    
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    
        return null;
    }

    // ✅ 获取 URL 中的商品 ID
    function getItemIdFromURL() {
        const match = window.location.href.match(/item\/(\d+)/);
        return match ? match[1] : null;
    }

    // ✅ 构建 POST 参数
    function buildParams(itemId) {
        return new URLSearchParams({
            id: itemId,
            numPerPage: 100,
            pageNum: 0,
            r: Math.random().toString()
        });
    }

    // ✅ 获取指定 Cookie 值
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    // ✅ 构建 Cookie 请求头
    function buildCookieHeader() {
        const cookieNames = [
            "Hm_lvt_f32737cfa62ed971bb3185792d3204eb",
            "route",
            ".AspNet.ApplicationCookie",
            "HMACCOUNT",
            "__RequestVerificationToken",
            "Hm_lpvt_f32737cfa62ed971bb3185792d3204eb"
        ];

        const cookieMap = {};
        cookieNames.forEach(name => {
            const value = getCookie(name);
            if (value) {
                cookieMap[name] = value;
            } else {
                console.warn(`未找到 cookie: ${name}`);
            }
        });

        if (Object.keys(cookieMap).length === 0) return null;

        return Object.entries(cookieMap)
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");
    }

    // ✅ 发起 POST 请求
    async function fetchBidAmountAtIndex(targetIndex, itemId, cookieHeader, initialLimit = 100, maxLimit = 1000, pageSize = 100) {
        let validList = [];
    
        // 第一阶段：逐步放大 numPerPage
        // for (let numPerPage = initialLimit; numPerPage <= maxLimit; numPerPage += 100) {
        //     const params = new URLSearchParams({
        //         id: itemId,
        //         numPerPage: numPerPage.toString(),
        //         pageNum: "0",
        //         r: Math.random().toString()
        //     });
    
        //     const response = await fetch("https://48.gnz48.com/pai/GetShowBids", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/x-www-form-urlencoded",
        //             "Cookie": cookieHeader
        //         },
        //         body: params
        //     });
    
        //     if (!response.ok) {
        //         throw new Error(`请求失败，状态码 ${response.status}`);
        //     }
    
        //     const data = await response.json();
        //     validList = data.list.filter(entry => entry.auction_status === 1);
    
        //     if (validList.length >= targetIndex) {
        //         return validList[targetIndex - 1].bid_amt;
        //     }
    
        //     // 如果这一页返回的数据已经小于请求条数，说明数据到底了，提前退出
        //     if (data.list.length < numPerPage) {
        //         return 0;
        //     }
        // }
    
        // 第二阶段：开始翻页 pageNum 从 1 往后翻
        let pageNum = 1;
        initialLimit = 20
        
        while (true) {
            const params = new URLSearchParams({
                id: itemId,
                numPerPage: initialLimit.toString(),
                pageNum: pageNum.toString(),
                r: Math.random().toString()
            });
    
            const response = await fetch("https://48.gnz48.com/pai/GetShowBids", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": cookieHeader
                },
                body: params
            });
    
            if (!response.ok) {
                throw new Error(`请求失败，状态码 ${response.status}`);
            }
    
            const data = await response.json();
            const dataList = data.list.slice(0, 20);
            const pageValid = dataList.filter(entry => entry.auction_status === 1);
            validList = validList.concat(pageValid);
    
            if (validList.length >= targetIndex) {
                return validList[targetIndex - 1].bid_amt;
            }
    
            if (data.PageCount < pageNum) {
                // 已到达最后一页
                break;
            }
    
            if (pageNum % 3 === 0){
                await sleep(900)
            }
            pageNum++;
        }
    
        return 0;
    }

    // 出价接口调用
    async function placeBid(uid, amt, num = 1, code = "") {
        const formData = new URLSearchParams({
            id: uid,
            amt: Math.ceil(amt).toString(),  // 金额向上取整
            num: num.toString(),
            code: code,
            r: Math.random().toString()
        });
    
        try {
            const response = await fetch("https://48.gnz48.com/pai/ToBids", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });
    
            const data = await response.json();
    
            // 页面提示和信息更新
            if (!data.HasError) {
                layer?.msg?.(data.Message || "出价成功！");
                const el1 = document.querySelector("#sp_auction_count_1");
                if (el1) el1.innerText = data.ErrorCode;
                
                const el0 = document.querySelector("#sp_auction_count_0");
                if (el0) el0.innerText = data.ErrorCode;
    
                // 可选函数（你可以取消注释）
                // SetInfoB(uid, 20, 0);
                // getInfoByTime();
    
                return true;
            } else {
                layer?.msg?.(data.Message || "出价失败！");
                const el1 = document.querySelector("#sp_auction_count_1");
                if (el1) el1.innerText = data.ErrorCode;
                
                const el0 = document.querySelector("#sp_auction_count_0");
                if (el0) el0.innerText = data.ErrorCode;
                
                sleep(1000);
                return false;
            }
        } catch (error) {
            console.error("出价异常：", error);
            layer?.msg?.("出价接口调用失败");
            return false;
        }
    }

    

    // 创建按钮
    function createFetchButton() {
        // 1. 创建容器
        const container = document.createElement("div");
        container.id = "bid-fetch-container";
        Object.assign(container.style, {
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: "9999",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "white",
            padding: "12px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            cursor: "move", // 设置鼠标样式
            userSelect: "none"
        });
    
        // 2. 拖动逻辑
        let isDragging = false;
        let offsetX, offsetY;
    
        container.addEventListener("mousedown", function (e) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            document.body.style.userSelect = "none"; // 禁止文本选中
        });
    
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                const left = e.clientX - offsetX;
                const top = e.clientY - offsetY;
                container.style.left = `${left}px`;
                container.style.top = `${top}px`;
                container.style.right = "auto"; // 防止初始 right 冲突
            }
        });
    
        document.addEventListener("mouseup", function () {
            isDragging = false;
            document.body.style.userSelect = ""; // 恢复文本选中
        });
    
        // 3. 输入框
        // 目标名次输入框 + 标签
        const rankLabel = document.createElement("label");
        rankLabel.innerText = "目标名次：";
        rankLabel.style.fontSize = "14px";
        rankLabel.style.marginRight = "5px";

        const rankInput = document.createElement("input");
        rankInput.type = "number";
        rankInput.id = "positionInput";
        rankInput.placeholder = "输入第几位";
        rankInput.min = "1";
        Object.assign(rankInput.style, {
            padding: "6px",
            width: "140px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc"
        });
        
        // 预算金额输入框 + 标签
        const budgetLabel = document.createElement("label");
        budgetLabel.innerText = "预算金额（不填默认无限）：";
        budgetLabel.style.fontSize = "14px";
        budgetLabel.style.marginRight = "5px";
        
        const budgetInput = document.createElement("input");
        budgetInput.type = "number";
        budgetInput.placeholder = "¥";
        budgetInput.style.width = "80px";
        budgetInput.style.marginRight = "20px";
    
        // 4. 按钮
        const btn = document.createElement("button");
        btn.innerText = "📥 获取竞价数据";
        btn.id = "fetchBidsBtn";
        Object.assign(btn.style, {
            padding: "10px 16px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
        });
    
        // 5. 显示框
        const output = document.createElement("div");
        output.id = "bidAmtOutput";
        output.innerText = "等待结果...";
        Object.assign(output.style, {
            marginTop: "4px",
            fontSize: "14px",
            color: "#333"
        });
    
        // 6. 按钮点击逻辑（保持原样，不变）
        btn.addEventListener("click", async () => {
            btn.innerText = "⏳ 正在获取...";
            btn.disabled = true;
    
            try {
                const index = parseInt(rankInput.value);
                const budget = parseFloat(budgetInput.value);
            
                if (isNaN(index) || index <= 0) {
                    layer?.msg?.("请输入有效的目标名次！");
                    return;
                }
            
                if (budget <= 0) {
                    layer?.msg?.("请输入有效的预算金额！");
                    return;
                }
    
                const itemId = getItemIdFromURL();
                const params = buildParams(itemId);
                const cookieHeader = buildCookieHeader();
    
                if (!cookieHeader) {
                    output.innerText = "未获取到 cookie";
                    return;
                }
    
                // 获取出价金额
                let bidAmt = await fetchBidAmountAtIndex(index, itemId, cookieHeader);
        
                // 如果获取失败，使用起竞价
                if (bidAmt === 0) {
                    const startingBid = getStartingBid();
                    if (startingBid !== null) {
                        bidAmt = startingBid;
                        output.innerText = `第 ${index} 位无人出价，使用起竞价 ¥${startingBid}`;
                    } else {
                        output.innerText = `第 ${index} 位无人出价，且未能获取起竞价`;
                        return;
                    }
                } else {
                    output.innerText = `第 ${index} 位出价金额：¥${bidAmt}`;
                }
                
                //自动出价
                if (cbInput.checked) {
                    const finalBid = Math.ceil(bidAmt) + 1;
            
                    if (!isNaN(budget) && finalBid > budget) {
                        layer?.msg?.(`⚠️ 出价 ¥${finalBid} 超出预算 ¥${budget}，不执行出价`);
                        return;
                    }
            
                    const success = await placeBid(itemId, finalBid);
                    if (success) {
                        console.log("自动出价成功");
                    } else {
                        layer?.msg?.("❌ 自动出价失败！");
                    }
                }
                
            } catch (err) {
                console.error(err);
                output.innerText = "请求出错，请查看控制台";
            } finally {
                btn.innerText = "📥 获取竞价数据";
                btn.disabled = false;
            }
        });
        
        // 7. 添加复选框
        const checkbox = document.createElement("label");
        checkbox.style.fontSize = "14px";
        checkbox.style.cursor = "pointer";
        
        const cbInput = document.createElement("input");
        cbInput.type = "checkbox";
        cbInput.id = "autoBidCheckbox";
        cbInput.style.marginRight = "4px";
        
        checkbox.appendChild(cbInput);
        checkbox.appendChild(document.createTextNode("自动 +1 元出价"));
        
        const warning = document.createElement("div");
        warning.innerText = "⚠️ 自动出价在测试阶段 慎用 勾选了则自动出价 未勾选仅做查询";
        warning.style.color = "red";
        warning.style.fontWeight = "bold";
        warning.style.margin = "8px 0";
    
        // 8. 加入页面
        container.appendChild(rankLabel);
        container.appendChild(rankInput);
        container.appendChild(budgetLabel);
        container.appendChild(budgetInput);
        container.appendChild(warning);  // 警告文本
        container.appendChild(checkbox); // 自动+1元
        container.appendChild(btn);      // 获取按钮
        container.appendChild(output);   // 输出结果
        document.body.appendChild(container);
    }



    // ✅ 主执行函数
    async function run() {
        const itemId = getItemIdFromURL();
        if (!itemId) {
            console.warn("未找到商品 ID");
            return;
        }

        const params = buildParams(itemId);
        const cookieHeader = buildCookieHeader();

        if (!cookieHeader) {
            console.error("未能获取必要的 cookie，可能是未登录");
            return;
        }

        try {
            const data = await fetchBids(params, cookieHeader);
            console.log("竞价数据：", data);
        } catch (error) {
            console.error("竞价请求失败：", error);
        }
    }
    
    // 主入口
    function init() {
        createFetchButton(); // 添加按钮
    }
    
    // ✅ 启动脚本
    init();

})();