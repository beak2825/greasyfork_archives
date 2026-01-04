// ==UserScript==
// @name         SNH商城票务信息统计
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  抓取竞价页面信息并导出为Excel
// @author       You
// @match        https://shop.48.cn/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522988/SNH%E5%95%86%E5%9F%8E%E7%A5%A8%E5%8A%A1%E4%BF%A1%E6%81%AF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/522988/SNH%E5%95%86%E5%9F%8E%E7%A5%A8%E5%8A%A1%E4%BF%A1%E6%81%AF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

/* global XLSX */

(function() {
    'use strict';

    // Your code here...

    // 确保 XLSX 已经加载
    if (typeof XLSX === 'undefined') {
        console.error('XLSX library not loaded!');
        return;
    }

    function parseBidsData(bidListElement, totalBids) {
        const liElements = bidListElement.querySelectorAll("li");
        liElements.forEach(li => {
            try {
                const bidStatus = li.querySelector(".jl_1")?.innerText.trim(); // 竞价状态
                const jl2Elements = li.querySelectorAll(".jl_2");
                const bidder = jl2Elements[0]?.innerText.trim(); // 出价人
                const bidTime = jl2Elements[1]?.innerText.trim(); // 出价时间
                const bidAmount = li.querySelector(".jl_3")?.innerText.trim(); // 出价金额

                if (bidStatus?.includes("竞价成功")) {
                    totalBids.push({
                        "出价状态": bidStatus,
                        "出价人": bidder,
                        "出价时间": bidTime,
                        "出价金额": bidAmount
                    });
                } else if (!bidStatus?.includes("竞价成功") && checkBidExist(totalBids, bidder)) {
                    totalBids.push({
                        "出价状态": "竞价失败",
                        "出价人": bidder,
                        "出价时间": bidTime,
                        "出价金额": bidAmount
                    });
                }
            } catch (e) {
                // 忽略异常
            }
        });
        return totalBids;
    }

    // 检查某个出价人在已有的竞价数据中是否存在
    function checkBidExist(bidsData, bidder) {
        if (bidsData.length === 0) {
            return true;
        }
        for (const bid of bidsData) {
            if (bid["出价人"] && bid["出价人"].includes(bidder)) {
                // 如果出价人已经存在，则返回 false
                return false;
            }
        }
        // 如果出价人不存在，则返回 true
        return true;
    }

    // 模拟点击翻页按钮
    function clickNextPage() {
        const element = document.querySelector("#a_b_n");
        if (element) {
            //console.log("找到元素，准备模拟点击。");
            // 模拟点击
            element.click();
        } else {
            console.log("未找到目标元素。");
        }
    }

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selectorFunc, timeout = 10000, interval = 100) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = selectorFunc();
            if (el) return el;
            await sleep(interval);
        }
        throw new Error("元素加载超时");
    }

    // 从竞价列表中提取成功竞价的信息
    async function autoBidUntilEnd(targetSuccessfulCount, bidType, theaterName) {
        const totalBidsData = [];

        // 等待实际竞价人数元素加载
        const actualBidNumberElement = await waitForElement(() =>
                                                            document.evaluate('/html/body/div[2]/div/div[2]/div[3]/div[1]/ul/li[7]/span/span[3]',
                                                                              document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, 10000);

        if (parseInt(actualBidNumberElement?.innerText || "0") === 0) {
            return totalBidsData;
        }

        // 等待最大页码元素加载
        let maxPageElement = await waitForElement(() => document.querySelector(".pink.b_c"), 10000);
        while (maxPageElement.innerText.trim() === '') {
            location.reload(); // 相当于 driver.refresh()
            maxPageElement = await waitForElement(() => document.querySelector(".pink.b_c"), 10000);
        }
        const maxPage = parseInt(maxPageElement.innerText.trim());
        let nowPage = 1;
        while (nowPage <= maxPage) {
            
            updateOverlayMessage(`正在抓取第 ${nowPage} 页数据`);
            
            const uBlist = document.getElementById("u_blist");
            if (uBlist) {
                parseBidsData(uBlist, totalBidsData);
            }

            const uBlistM = document.getElementById("u_blistM");
            if (uBlistM) {
                parseBidsData(uBlistM, totalBidsData);
            }

            // 点击下一页按钮
            const nextButton = await waitForElement(() => document.querySelector("#a_b_n"), 10000);
            if (nextButton) {
                nextButton.click();
                console.log(`加载第 ${nowPage} 页...`);
                nowPage++;
                await sleep(1000); // 模拟 time.sleep(0.15)
            } else {
                break; // 找不到下一页按钮，跳出循环
            }
        }
        
        updateOverlayMessage("数据抓取完毕，正在整理座位信息...");

        // 获取座位数组
        const seats = getSeatPosition(theaterName, bidType, targetSuccessfulCount);

        // 分配座位号
        totalBidsData.forEach((bid, idx) => {
            bid["座位类型"] = bidType;
            bid["座位号"] = (idx >= seats.length) ? "竞价失败" : seats[idx];
        });

        return totalBidsData;
    }

    // 获取座位类型
    function getSeatType(itemName) {
        if (itemName.includes("超级")) {
            return "超级";
        } else if (itemName.includes("SVIP")) {
            return "SVIP";
        } else if (itemName.includes("摄影")) {
            return "摄影";
        } else if (itemName.includes("杆位")) {
            return "杆位";
        } else if (itemName.includes("普站")) {
            return "普站";
        } else if (itemName.includes("VIP")) {
            return "VIP";
        } else if (itemName.includes("普座")) {
            return "普座";
        } else if (itemName.includes("MINILIVE")) {
            return "MINILIVE";
        } else if (itemName.includes("拍立得") || itemName.includes("百场徽章粉丝纪念礼盒")) {
            return "拍立得";
        } else if (itemName.includes("生日会")) {
            return "生日会";
        } else if (itemName.includes("全纪录")) {
            return "全纪录";
        } else {
            return "其他";
        }
    }

    // 获取座位号
    function getSeatPosition(theaterName, bidType, bidCount = 0) {
        if (theaterName.includes("SNHbirthday") && bidCount === 71 && bidType === "普站") {
            return getSeatPositionSNHBirthday(bidType);
        } else if (theaterName.includes("SNHbirthday") && bidCount === 76 && bidType === "普站") {
            return getSeatPositionSNH(bidType);
        } else if (theaterName.includes("SNHbirthday")) {
            return getSeatPositionSNHBirthday(bidType);
        } else if (theaterName.includes("SNH")) {
            return getSeatPositionSNH(bidType);
        } else if (theaterName.includes("HGH")) {
            return getSeatPositionHGH(bidType);
        } else if (theaterName.includes("BEJ")) {
            return getSeatPositionBEJ(bidType);
        } else if (theaterName.includes("MINILIVE")) {
            return getSeatPositionMiniLive(bidCount);
        } else if (theaterName.includes("拍立得")) {
            return getSeatPositionPLD(bidCount);
        } else if (theaterName.includes("生日会")) {
            return getSeatPositionBirthParty(bidCount);
        } else if (theaterName.includes("全纪录")) {
            return getSeatPositionXiezhen(bidCount);
        } else if (theaterName.includes("其它")) {
            return getSeatPositionOther(bidCount);
        }
    }

    // 特殊公演+兑换生公
    function getSeatPositionSNH(bidType) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];

        // 普座
        if (bidType === "普座") {
            // 6排1到6排18
            let rows6Col1To18 = [];
            for (let j = 1; j <= 18; j++) {
                rows6Col1To18.push(`6排${j}`);
            }
            // 5排18、19 | 6排18、19
            let rows5_6Col19To20 = [];
            for (let i = 5; i <= 6; i++) {
                for (let j = 19; j <= 20; j++) {
                    rows5_6Col19To20.push(`${i}排${j}`);
                }
            }
            // 4排21、22 | 5排21、22 | 6排21、22
            let rows4_6Col21To22 = [];
            for (let i = 4; i <= 6; i++) {
                for (let j = 21; j <= 22; j++) {
                    rows4_6Col21To22.push(`${i}排${j}`);
                }
            }
            // 3排23、24 | 4排23、24 | 5排23、24 | 6排23、24
            let rows3_6Col23To24 = [];
            for (let i = 3; i <= 6; i++) {
                for (let j = 23; j <= 24; j++) {
                    rows3_6Col23To24.push(`${i}排${j}`);
                }
            }
            // 7排到10排
            let rows7To10 = [];
            for (let i = 7; i <= 10; i++) {
                for (let j = 1; j <= 24; j++) {
                    rows7To10.push(`${i}排${j}`);
                }
            }

            seats = rows6Col1To18.concat(rows5_6Col19To20, rows4_6Col21To22, rows3_6Col23To24, rows7To10);
        }
        else if (bidType === "SVIP") {
            seats = [];
            for (let i = 1; i <= 24; i++) {
                seats.push(`1排${i}`);
            }
        }
        else if (bidType === "VIP") {
            seats = [];
            for (let i = 2; i <= 5; i++) {
                for (let j = 1; j <= (25 - 2 * (i - 2)); j++) {
                    seats.push(`${i}排${j}`);
                }
            }
        }
        else if (bidType === "摄影") {
            seats = [];
            for (let i = 1; i <= 24; i++) {
                seats.push(`1排${i}`);
            }
        }
        else if (bidType === "杆位") {
            seats = [];
            for (let i = 1; i <= 24; i++) {
                seats.push(`${i}`);
            }
        }
        else if (bidType === "普站") {
            seats = [];
            for (let i = 25; i <= 100; i++) {
                seats.push(`${i}`);
            }
        }
        else if (bidType === "超级") {
            seats = ["中", "左", "右"];
        }

        return seats;
    }

    // 上海剧场圈内生公
    function getSeatPositionSNHBirthday(bidType) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];

        // 普座
        if (bidType === "普座") {
            // 6排1到6排18
            let rows6Col1To18 = [];
            for (let j = 1; j <= 18; j++) {
                rows6Col1To18.push(`6排${j}`);
            }
            // 5排18、19 | 6排18、19
            let rows5_6Col19To20 = [];
            for (let i = 5; i <= 6; i++) {
                for (let j = 19; j <= 20; j++) {
                    rows5_6Col19To20.push(`${i}排${j}`);
                }
            }
            // 4排21、22 | 5排21、22 | 6排21、22
            let rows4_6Col21To22 = [];
            for (let i = 4; i <= 6; i++) {
                for (let j = 21; j <= 22; j++) {
                    rows4_6Col21To22.push(`${i}排${j}`);
                }
            }
            // 3排23、24 | 4排23、24 | 5排23、24 | 6排23、24
            let rows3_6Col23To24 = [];
            for (let i = 3; i <= 6; i++) {
                for (let j = 23; j <= 24; j++) {
                    rows3_6Col23To24.push(`${i}排${j}`);
                }
            }
            // 7排1、3、5、7、9、11、13、15、17、19
            let rows7Col1To19 = [];
            for (let j = 1; j <= 20; j++) {
                if (j % 2 !== 0) rows7Col1To19.push(`7排${j}`);
            }
            // 7排21、22、23、24
            let rows7Col21To24 = [];
            for (let j = 21; j <= 24; j++) {
                rows7Col21To24.push(`7排${j}`);
            }
            // 8排到10排
            let rows8To10 = [];
            for (let i = 8; i <= 10; i++) {
                for (let j = 1; j <= 24; j++) {
                    rows8To10.push(`${i}排${j}`);
                }
            }

            seats = rows6Col1To18.concat(rows5_6Col19To20, rows4_6Col21To22, rows3_6Col23To24, rows7Col1To19, rows7Col21To24, rows8To10);
        }
        else if (bidType === "VIP") {
            let rows2Col2To10 = [];
            for (let j = 1; j <= 10; j++) {
                if (j % 2 === 0) rows2Col2To10.push(`2排${j}`);
            }
            let rows2Col11To24 = [];
            for (let j = 11; j <= 24; j++) {
                rows2Col11To24.push(`2排${j}`);
            }
            let rows3To5 = [];
            for (let i = 3; i <= 5; i++) {
                for (let j = 1; j <= (25 - 2 * (i - 2)); j++) {
                    rows3To5.push(`${i}排${j}`);
                }
            }
            seats = rows2Col2To10.concat(rows2Col11To24, rows3To5);
        }
        else if (bidType === "摄影") {
            seats = [];
            for (let i = 1; i <= 24; i++) {
                seats.push(`1排${i}`);
            }
        }
        else if (bidType === "杆位") {
            seats = [];
            for (let i = 1; i <= 24; i++) {
                seats.push(`${i}`);
            }
        }
        else if (bidType === "普站") {
            let stand25To30 = [];
            for (let i = 25; i <= 30; i++) {
                stand25To30.push(`${i}`);
            }
            let stand31To100 = [];
            for (let i = 36; i <= 100; i++) {
                stand31To100.push(`${i}`);
            }
            seats = stand25To30.concat(stand31To100);
        }
        else if (bidType === "超级") {
            seats = ["中", "左", "右"];
        }

        return seats;
    }

    // 杭州剧场
    function getSeatPositionHGH(bidType) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];

        // 普座
        if (bidType === "超级") {
            // 1排1到1排25
            let rows1Col1To25 = [];
            for (let j = 1; j <= 25; j++) {
                rows1Col1To25.push(`1排${j}`);
            }
            // 2排1到2排29
            let rows2Col1To29 = [];
            for (let j = 1; j <= 29; j++) {
                rows2Col1To29.push(`2排${j}`);
            }
            seats = rows1Col1To25.concat(rows2Col1To29); // 普座座位
        }
        else if (bidType === "摄影") {
            // 摄影座位
            seats = [];
            for (let i = 1; i <= 19; i++) {
                seats.push(`11排${i}`);
            }
        }

        return seats;
    }

    // 北京剧场
    function getSeatPositionBEJ(bidType) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];
        // 普座
        if (bidType === "超级") {
            seats = ["中", "左", "右"];
        }
        else if (bidType === "VIP") {
            // VIP座位
            let rows1to4 = [];
            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 17; j++) {
                    rows1to4.push(`${i}排${j}`);
                }
            }
            let rows5 = ["5排3"];
            for (let j = 5; j <= 17; j++) {
                rows5.push(`5排${j}`);
            }
            let rows6 = ["6排13"];
            for (let j = 15; j <= 17; j++) {
                rows6.push(`6排${j}`);
            }
            seats = rows1to4.concat(rows5).concat(rows6); // 限制为84个
        }
        else if (bidType === "摄影") {
            seats = ["6排3", "6排6", "6排5", "6排8", "6排7", "6排10", "6排9", "6排12", "6排11", "6排14"];
        }
        return seats;
    }

    // MiniLice
    function getSeatPositionMiniLive(bidNumber) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];
        for (let i = 1; i <= bidNumber; i++) {
            seats.push(i.toString()); // MINILIVE座位
        }
        return seats;
    }

    // 拍立得
    function getSeatPositionPld(bidNumber) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];
        for (let i = 1; i <= bidNumber; i++) {
            seats.push(i.toString()); // 拍立得位置
        }
        return seats;
    }
    
    // 冷餐
    function getSeatPositionBirthParty(bidNumber) {
        // 根据竞价类型和索引为每个竞价分配座位号
        let seats = [];
        for (let i = 1; i <= bidNumber; i++) {
            seats.push(i.toString()); // 冷餐座位
        }
        return seats;
    }


    function calculateSeatCount(pattern1, pattern2, text) {
        // 匹配单一区间
        const matches1 = [...text.matchAll(pattern1)];
        // 匹配多个区间
        const matches2 = [...text.matchAll(pattern2)];

        let totalSeats = 0;

        // 如果有单一区间
        if (matches1.length > 0) {
            matches1.forEach(match => {
                const start = parseInt(match[1]);
                const end = parseInt(match[2]);
                totalSeats += (end - start + 1);
            });
        }
        // 如果有多个区间
        else if (matches2.length > 0) {
            matches2.forEach(match => {
                const start1 = parseInt(match[1]);
                const end1 = parseInt(match[2]);
                totalSeats += (end1 - start1 + 1);

                // 处理第二个区间（如果存在）
                if (match[3] && match[4]) {
                    const start2 = parseInt(match[3]);
                    const end2 = parseInt(match[4]);
                    totalSeats += (end2 - start2 + 1);
                }
            });
        }
        return totalSeats;
    }

    function getBidNumberSNH(bidType) {
        // 获取竞价区域的信息
        let itemInfo = "";
        const element = document.querySelector("#TabTab03Con1");
        itemInfo = element.textContent.trim();

        // 如果是“普站”
        if (bidType.includes("普站")) {
            const seatPattern1 = /站区序号(\d{3})至(\d{3})/g; // 单一区间（如：025至100）
            const seatPattern2 = /站区序号(\d{3})至(\d{2})(?:、(\d{2})至(\d{3}))?/g; // 多个区间（如：025至30、36至100）
            const seatCount = calculateSeatCount(seatPattern1, seatPattern2, itemInfo);
            return seatCount;
        }

        // 如果是生日会
        if (itemInfo.includes("生日潮流包")) {
            if (bidType.includes("SVIP")) return 24;
            if (bidType.includes("VIP")) return 79;
            if (bidType.includes("摄影")) return 24;
            if (bidType.includes("杆位")) return 24;
            if (bidType.includes("超级")) return 3;
            if (bidType.includes("普座")) return 122;
            return 0;
        } else {
            // 通用配置
            if (bidType.includes("SVIP")) return 24;
            if (bidType.includes("VIP")) return 84;
            if (bidType.includes("摄影")) return 24;
            if (bidType.includes("杆位")) return 24;
            if (bidType.includes("超级")) return 3;
            if (bidType.includes("普座")) return 132;
            return 0;
        }
    }

    function getBidNumberHGH(bidType) {
        if (bidType.includes("超级")) {
            return 54;
        } else if (bidType.includes("摄影")) {
            return 19;
        }
        return 0;
    }

    function getBidNumberBEJ() {
        let itemInfo = "";
        const element = document.querySelector("#TabTab03Con1");
        itemInfo = element.textContent.trim();

        // 使用正则表达式提取所有票数信息，只需包含 "演出门票"
        const ticketCounts = itemInfo.match(/.*?演出门票.*?(\d+)张/);

        // 如果找到了票数信息
        if (ticketCounts) {
            return parseInt(ticketCounts[1]); // 取第一个匹配的票数
        } else {
            return 0;
        }
    }

    function getBidNumberMiniLive() {
        let itemInfo = "";
        const element = document.querySelector("#TabTab03Con1");
        itemInfo = element.textContent.trim();

        // 使用正则表达式提取所有票数信息，只需包含 "入场资格"
        const ticketCounts = itemInfo.text.match(/入场资格(\d+)位/g);

        // 如果找到了票数信息
        if (ticketCounts) {
            return parseInt(ticketCounts[1]); // 取第一个匹配的票数
        } else {
            return 0;
        }
    }

    function getBidNumberPLD() {
        let itemInfo = "";
        const element = document.querySelector("#TabTab03Con1");
        itemInfo = element.textContent.trim();

        // 使用正则表达式提取所有票数信息，只需包含 "共"
        const ticketCounts = itemInfo.match(/.*?共.*?(\d+)套/);

        // 如果找到了票数信息
        if (ticketCounts) {
            return parseInt(ticketCounts[1]); // 取第一个匹配的票数
        } else {
            return 0;
        }
    }

    function getBidNumberBirthParty(theaterName) {
        let itemInfo = "";
        const element = document.querySelector("#TabTab03Con1");
        itemInfo = element.textContent.trim();

        if (theaterName.includes("SNH")) {
            // 使用正则表达式提取所有票数信息，只需包含 "名额"
            const ticketCounts = itemInfo.match(/.*?名额：.*?(\d+)名/);
            // 如果找到了票数信息
            if (ticketCounts) {
                return parseInt(ticketCounts[1]); // 取第一个匹配的票数
            } else {
                return 0;
            }
        } else if (theaterName.includes("BEJ")) {
            // 使用正则表达式提取所有票数信息，只需包含 "竞拍数量"
            const ticketCounts = itemInfo.match(/.*?竞拍数量：.*?(\d+)张/);
            // 如果找到了票数信息
            if (ticketCounts) {
                return parseInt(ticketCounts[1]); // 取第一个匹配的票数
            } else {
                return 0;
            }
        }
        return 0;
    }
    
    function getSeatPositionXiezhen(bidNumber) {
        const seats = [];
        for (let i = 1; i <= bidNumber; i++) {
            seats.push(String(i));
        }
        return seats;
    }
    
    function getSeatPositionOther(bidNumber) {
        const seats = [];
        for (let i = 1; i <= bidNumber; i++) {
            seats.push(String(i));
        }
        return seats;
    }




    function getItemId() {
        const url = window.location.href; // 获取当前页面的完整 URL
        const path = new URL(url).pathname; // 获取 URL 的路径部分
        const itemId = path.split('/').pop(); // 获取路径中的最后一部分作为 item_id
        return itemId;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function updateMinMaxInfo(data, wsData) {
        // 过滤出 "竞价成功" 的记录
        const successfulBids = data.filter(bid => bid['出价状态'] === '竞价成功');

        // 转换 '出价时间' 为 Date 类型，并将 '出价金额' 转换为数字
        successfulBids.forEach(bid => {
            bid['出价时间'] = new Date(bid['出价时间']);
            bid['出价金额'] = parseFloat(bid['出价金额']);
        });

        // 提取最早出价时间、最晚出价时间、最高出价、最低出价
        const earliestBid = successfulBids.reduce((a, b) => (a['出价时间'] < b['出价时间'] ? a : b));
        const latestBid = successfulBids.reduce((a, b) => (a['出价时间'] > b['出价时间'] ? a : b));
        const highestBid = successfulBids.reduce((a, b) => (a['出价金额'] > b['出价金额'] ? a : b));
        const lowestBid = successfulBids.reduce((a, b) => (a['出价金额'] < b['出价金额'] ? a : b));

        // 插入数据到 wsData
        wsData.push([]); // 空行
        wsData.push(['最早出价者', earliestBid['出价人'], formatDate(earliestBid['出价时间']), earliestBid['出价金额'], earliestBid['座位类型'], earliestBid['座位号']]);
        wsData.push(['最晚出价者', latestBid['出价人'], formatDate(latestBid['出价时间']), latestBid['出价金额'], latestBid['座位类型'], latestBid['座位号']]);
        wsData.push(['最高出价者', highestBid['出价人'], formatDate(highestBid['出价时间']), highestBid['出价金额'], highestBid['座位类型'], highestBid['座位号']]);
        wsData.push(['最低出价者', lowestBid['出价人'], formatDate(lowestBid['出价时间']), lowestBid['出价金额'], lowestBid['座位类型'], lowestBid['座位号']]);

        //console.log("已更新最早、最晚、最高、最低出价信息");
        return wsData;
    }


    function saveExcel(successfulBidsData, itemName, outputFile = "bidding_results.xlsx") {
        // 创建 Excel 工作簿
        const wb = XLSX.utils.book_new();
        let wsData = [];

        // 写入商品名称
        wsData.push([itemName]);

        // 写入表头
        const header = ["出价状态", "出价人", "出价时间", "出价金额", "座位类型", "座位号"];
        wsData.push(header);

        // 写入竞价数据
        successfulBidsData.forEach(bid => {
            wsData.push([bid["出价状态"], bid["出价人"], bid["出价时间"], bid["出价金额"], bid["座位类型"], bid["座位号"]]);
        });

        wsData = updateMinMaxInfo(successfulBidsData, wsData)

        // 将数据转换为工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 格式化表头，设置加粗
        for (let i = 0; i < header.length; i++) {
            // eslint-disable-next-line dot-notation
            ws['A1'].font = { bold: true }; // 表头加粗
        }

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, "Bidding Results");

        // 生成 Excel 文件并下载
        const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        // 创建一个 Blob 对象并触发下载
        const blob = new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = outputFile;
        link.click();

        console.log(`竞价信息已下载为 ${outputFile}`);
    }
    
    //霸屏信息框
    function showOverlayMessage() {
        let overlay = document.createElement("div");
        overlay.id = "tampermonkey-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
        overlay.style.color = "#fff";
        overlay.style.fontSize = "24px";
        overlay.style.zIndex = "99999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
    
        overlay.innerHTML = `
            <div id="overlay-message" style="margin-bottom: 20px;">脚本正在运行中，请稍候...</div>
            <button id="overlay-close-btn" style="
                display: none;
                padding: 10px 20px;
                font-size: 18px;
                background-color: #4CAF50;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 6px;
            ">关闭</button>
        `;
    
        document.body.appendChild(overlay);
    
        // 添加点击关闭功能
        document.getElementById("overlay-close-btn").addEventListener("click", hideOverlayMessage);
    }
    
    function updateOverlayMessage(msg) {
        const now = new Date().toLocaleTimeString();
        const messageElement = document.getElementById("overlay-message");
        if (messageElement) {
            messageElement.textContent = `[${now}] ${msg}`;
        }
    }
    
    function hideOverlayMessage() {
        const overlay = document.getElementById("tampermonkey-overlay");
        if (overlay) {
            overlay.remove();
        }
    }

    async function statsOneGood() {
        
        showOverlayMessage(); // 显示霸屏提示
        
        // 更新信息
        updateOverlayMessage("正在初始化脚本...");
        
        // 获取剧场名称和 Excel 文件名
        const theaterNameElement = document.querySelector("body > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(2) > p");
        const excelNameElement = document.querySelector("body > div.body-content > div > div:nth-child(2) > div.i_txt.ma_b10 > ul > li.i_tit");
        let theaterName = theaterNameElement ? theaterNameElement.textContent.trim() : "";
        const excelName = excelNameElement ? excelNameElement.textContent.trim() : "";

        // 获取商品名称
        const titleNameElement = document.querySelector("body > div.body-content > div > div:nth-child(2) > div.i_txt.ma_b10 > ul > li.i_tit");
        const titleName = titleNameElement ? titleNameElement.textContent.trim() : "";

        // 获取商品详细信息并判断是否为生日潮流包
        const itemInfoElement = document.querySelector("#TabTab03Con1");
        const itemInfoText = itemInfoElement ? itemInfoElement.innerText : "";
        const birthday = itemInfoText.includes("生日潮流包");

        // 获取竞价类型
        const bidType = getSeatType(titleName);

        let maxBidNum = 46;
        let bidNumber = 0;
        
        if (theaterName.includes("SNH") && titleName.includes("星梦剧院") && 
            !titleName.includes("MINILIVE") && titleName.includes("礼包")) {
            bidNumber = getBidNumberSNH(bidType);
            if (birthday) theaterName = "SNHbirthday";
        } else if (theaterName.includes("SNH") && titleName.includes("星梦空间") && 
                   !titleName.includes("MINILIVE") && titleName.includes("礼包")) {
            bidNumber = getBidNumberHGH(bidType);
            theaterName = "HGH";
        } else if (theaterName.includes("BEJ") && !titleName.includes("生日会")) {
            bidNumber = getBidNumberBEJ();
        } else if (titleName.includes("MINILIVE")) {
            bidNumber = getBidNumberMiniLive();
            theaterName = "MINILIVE";
        } else if (titleName.includes("拍立得") || titleName.includes("百场徽章粉丝纪念礼盒")) {
            bidNumber = getBidNumberPLD();
            theaterName = "拍立得";
        } else if (titleName.includes("生日会")) {
            bidNumber = getBidNumberBirthParty(theaterName);
            theaterName = "生日会";
        } else if (titleName.includes("全纪录")) {
            bidNumber = getBidNumberXiezhen();
            theaterName = "全纪录";
        } else {
            bidNumber = getBidNumberOther();
            theaterName = "其它";
        }
        
        // 获取座位数后更新显示
        updateOverlayMessage(`一共有 ${maxBidNum} 个位置，正在加载数据...`);
        console.log(`一共有 ${maxBidNum} 个位置`);

        let totalBidsData = []; // 用于存储所有竞价成功信息
        totalBidsData = await autoBidUntilEnd(maxBidNum, bidType, theaterName);

        //console.log(totalBidsData);
        // 获取商品 ID
        //const itemId = getItemId();
        
        updateOverlayMessage("完成数据处理，准备保存 Excel...");
        saveExcel(totalBidsData, excelName, excelName);
        
        // 更新提示信息
        updateOverlayMessage("数据已保存完毕，您可以点击下方按钮关闭提示框");
        
        // 显示关闭按钮
        const closeBtn = document.getElementById("overlay-close-btn");
        if (closeBtn) {
            closeBtn.style.display = "block";
        }
        
        // 设置自动关闭（60秒后）
        setTimeout(() => {
            hideOverlayMessage();
        }, 60000);
        
    }


    // 示例调用
    (async function() {
        // 创建按钮
        const button = document.createElement('button');
        button.innerText = '开始统计';
        button.style.position = 'absolute'; // 使用 absolute 定位
        button.style.zIndex = '1000';

        // 设置按钮样式
        //button.style.border = '2px solid black'; // 边框为黑色
        button.style.backgroundColor = '#59c4ec'; // 底色为蓝色
        button.style.color = 'white'; // 字体为黑色
        button.style.fontSize = '13px'; // 按钮字体大一号
        button.style.padding = '2px 5px'; // 添加内边距让按钮更美观
        button.style.cursor = 'pointer'; // 鼠标悬停时显示手型

        // 设置按钮点击事件
        button.onclick = function() {
            statsOneGood(); // 调用 statsOneGood 函数
        };

        // 获取目标元素
        const targetElement = document.querySelector('.i_tit');
        if (targetElement) {
            // 获取目标元素的位置
            const rect = targetElement.getBoundingClientRect();

            // 设置按钮的位置（上方展示）
            button.style.top = `${rect.top - 13}px`; // 距离目标元素上方 30px
            button.style.left = `${rect.left}px`; // 左对齐

            // 将按钮添加到页面上
            document.body.appendChild(button);
        } else {
            console.error('未找到目标元素 .i_tit');
        }
    })();
})();