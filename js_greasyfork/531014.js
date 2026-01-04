// ==UserScript==
// @name         三角洲大收藏家
// @namespace    https://df.qq.com
// @version      2025-03-28
// @description  三角洲出红次数统计
// @author       none
// @match        https://df.qq.com/cp*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531014/%E4%B8%89%E8%A7%92%E6%B4%B2%E5%A4%A7%E6%94%B6%E8%97%8F%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531014/%E4%B8%89%E8%A7%92%E6%B4%B2%E5%A4%A7%E6%94%B6%E8%97%8F%E5%AE%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // 电子产品
    let dzcp_info = [
        { 'id': 1, 'img': 'dzcp/dj1.png', 'name': '笔记本电脑', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 2, 'img': 'dzcp/dj2.png', 'name': '飞行记录仪', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 3, 'img': 'dzcp/dj3.png', 'name': '军用电台', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 4, 'img': 'dzcp/dj4.png', 'name': '高速磁盘阵列', 'lock': true, 'class': 'dj_size_12', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 5, 'img': 'dzcp/dj5.png', 'name': '便携军用雷达', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 6, 'img': 'dzcp/dj6.png', 'name': '曼德尔超算单元', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 7, 'img': 'dzcp/dj7.png', 'name': '刀片服务器', 'lock': true, 'class': 'dj_size_12', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 8, 'img': 'dzcp/dj8.png', 'name': '军用信息终端', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 9, 'img': 'dzcp/dj9.png', 'name': '摄影机', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 10, 'img': 'dzcp/dj10.png', 'name': '军用无人机', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 11, 'img': 'dzcp/dj11.png', 'name': 'G.T.I卫星通信天线', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地'], 'purpose': ['升级特勤处'] },
        { 'id': 12, 'img': 'dzcp/dj12.png', 'name': '军用控制终端', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 13, 'img': 'dzcp/dj13.png', 'name': '显卡', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] }
    ]

    // 工业材料
    let gycl_info = [
        { 'id': 1, 'img': 'gycl/dj1.png', 'name': '火箭燃料', 'lock': true, 'class': 'dj_size_3_4', 'source': ['航天基地'], 'purpose': ['升级特勤处'] },
        { 'id': 2, 'img': 'gycl/dj2.png', 'name': '强化碳纤维板', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 3, 'img': 'gycl/dj3.png', 'name': '军用炮弹', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['兑换扩容箱'] }
    ]
    // 工艺藏品
    let gycp_info = [
        { 'id': 1, 'img': 'gycp/dj1.png', 'name': '非洲之心', 'lock': true, 'class': 'dj_size_1', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处'] },
        { 'id': 2, 'img': 'gycp/dj2.png', 'name': '主战坦克模型', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 3, 'img': 'gycp/dj3.png', 'name': '步战车模型', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 4, 'img': 'gycp/dj4.png', 'name': '克劳迪乌斯半身像', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 5, 'img': 'gycp/dj5.png', 'name': '滑膛枪展品', 'lock': true, 'class': 'dj_size_4_l', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 6, 'img': 'gycp/dj6.png', 'name': '黄金瞪羚', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 7, 'img': 'gycp/dj7.png', 'name': '棘龙爪化石', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 8, 'img': 'gycp/dj8.png', 'name': '万足金条', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 9, 'img': 'gycp/dj9.png', 'name': '赛伊德的怀表', 'lock': true, 'class': 'dj_size_1', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 10, 'img': 'gycp/dj10.png', 'name': '名贵机械表', 'lock': true, 'class': 'dj_size_1', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 11, 'img': 'gycp/dj11.png', 'name': '“纵横”', 'lock': true, 'class': 'dj_size_9', 'source': ['巴克什', '交易行'], 'purpose': [] },
        { 'id': 12, 'img': 'gycp/dj12.png', 'name': '万金泪冠', 'lock': true, 'class': 'dj_size_9', 'source': ['巴克什', '交易行'], 'purpose': [] },
        { 'id': 13, 'img': 'gycp/dj13.png', 'name': '雷斯的留声机', 'lock': true, 'class': 'dj_size_6_h', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': [] },
        { 'id': 14, 'img': 'gycp/dj14.png', 'name': '“天圆地方”', 'lock': true, 'class': 'dj_size_4', 'source': ['巴克什', '交易行'], 'purpose': [] }
    ]
    // 医疗道具
    let ylcp_info = [
        { 'id': 1, 'img': 'ylcp/dj1.png', 'name': '复苏呼吸机', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 2, 'img': 'ylcp/dj2.png', 'name': '自动体外除颤器', 'lock': true, 'class': 'dj_size_6_h', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 3, 'img': 'ylcp/dj3.png', 'name': '呼吸机', 'lock': true, 'class': 'dj_size_4', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 4, 'img': 'ylcp/dj4.png', 'name': '医疗机器人', 'lock': true, 'class': 'dj_size_6_h', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': [] }
    ]
    // 能源材料
    let nycl_info = [
        { 'id': 1, 'img': 'nycl/dj1.png', 'name': '微型反应炉', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': [] },
        { 'id': 2, 'img': 'nycl/dj2.png', 'name': '动力电池组', 'lock': true, 'class': 'dj_size_12', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': [] },
        { 'id': 3, 'img': 'nycl/dj3.png', 'name': '装甲车电池', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': [] }
    ]
    // 资料情报
    let zlqb_info = [
        { 'id': 1, 'img': 'zlqb/dj1.png', 'name': '绝密服务器', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['兑换扩容箱'] },
        { 'id': 2, 'img': 'zlqb/dj2.png', 'name': '云存储阵列', 'lock': true, 'class': 'dj_size_6', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['兑换扩容箱'] },
        { 'id': 3, 'img': 'zlqb/dj3.png', 'name': '阵列服务器', 'lock': true, 'class': 'dj_size_12', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 4, 'img': 'zlqb/dj4.png', 'name': '量子存储', 'lock': true, 'class': 'dj_size_1', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 5, 'img': 'zlqb/dj5.png', 'name': '实验数据', 'lock': true, 'class': 'dj_size_1', 'source': ['航天基地', '交易行', '零号大坝'], 'purpose': ['升级特勤处', '兑换扩容箱'] }
    ]
    // 家居物品
    let jjwp_info = [
        { 'id': 1, 'img': 'jjwp/dj1.png', 'name': '扫拖一体机器人', 'lock': true, 'class': 'dj_size_9', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['兑换扩容箱'] },
        { 'id': 2, 'img': 'jjwp/dj2.png', 'name': '强力吸尘器', 'lock': true, 'class': 'dj_size_6_h', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 3, 'img': 'jjwp/dj3.png', 'name': '奥莉薇娅香槟', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '交易行', '长弓溪谷'], 'purpose': ['升级特勤处', '兑换扩容箱'] },
        { 'id': 4, 'img': 'jjwp/dj4.png', 'name': '高级咖啡豆', 'lock': true, 'class': 'dj_size_2', 'source': ['航天基地', '长弓溪谷'], 'purpose': ['兑换生产材料'] }
    ]

    var itemidArray = {
        //电子物品
        '15030050007': dzcp_info[0],
        '15030050014': dzcp_info[1],
        '15030050004': dzcp_info[2],
        '15030050012': dzcp_info[3],
        '15080050031': dzcp_info[4],
        '15080050030': dzcp_info[5],
        '15030050008': dzcp_info[6],
        '15080050032': dzcp_info[7],
        '15030010012': dzcp_info[8],
        '15030050002': dzcp_info[9],
        '15030050013': dzcp_info[10],
        '15030050018': dzcp_info[11],
        '15030050001': dzcp_info[12],

        //工业材料
        '15020010033': gycl_info[0],//火箭燃料
        '15020010031': gycl_info[1],//强化碳纤维板
        '15030050017': gycl_info[2],//军用炮弹


        //工艺藏品
        '15080050006': gycp_info[0],//非洲之心
        '15080050040': gycp_info[1],//主战坦克模型
        '15080050041': gycp_info[2],//步战车模型
        '15040050002': gycp_info[3],//克劳迪乌斯半身像
        '15080050003': gycp_info[4],//滑膛枪展品
        '15010050001': gycp_info[5],//黄金瞪羚
        '15080040001': gycp_info[6],//棘龙爪化石
        '15080050010': gycp_info[7],//万足金条
        '15080050014': gycp_info[8],//赛伊德的怀表
        '15080050042': gycp_info[9],//名贵机械表
        // --------modify by zrl at 2025.02.11 补充开发
        '15080050123': gycp_info[10],//“纵横”
        '15080050121': gycp_info[11],//万金泪冠
        '15080050120': gycp_info[12],//雷斯的留声机
        '15080050122': gycp_info[13],//“天圆地方”

        //医疗道具
        '15080050097': ylcp_info[0],
        '15080050058': ylcp_info[1],
        '15060040004': ylcp_info[2],
        // --------modify by zrl at 2025.02.11 补充开发
        '15080050113': ylcp_info[3],//医疗机器人

        //能源燃料
        '15080050098': nycl_info[0],
        '15080050100': nycl_info[1],
        '15080050099': nycl_info[2],

        //资料情报
        '15080050044': zlqb_info[0],
        '15080050061': zlqb_info[1],
        '15080050062': zlqb_info[2],
        '15070050001': zlqb_info[3],
        '15070040003': zlqb_info[4],

        //家居物品
        '15080050066': jjwp_info[0],
        '15080050067': jjwp_info[1],
        '15060080015': jjwp_info[2],
        '15080050069': jjwp_info[3],
    }



    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (url.includes("https://comm.ams.game.qq.com/ide/")) {
            this.addEventListener("load", function () {
                let processedData;
                try {
                    const jsonData = JSON.parse(this.responseText);
                    processedData = jsonData;
                } catch (e) {
                    processedData = { jData: { itemidList: {} } };
                }

                console.clear();
                const itemList = processedData.jData.itemidList;
                let allcount = 0;
                let message = "<strong>📢 物品摸到次数统计：</strong><br><br>";

                Object.keys(itemList).forEach((item) => {
                    const itemData = itemidArray[item] || {};
                    const name = itemData.name || "未知物品";
                    const count = itemList[item];
                    allcount += Number(count);

                    message += `<span style="color:red">${name}</span> 摸到过的次数为 <strong style="color:blue">${count}</strong><br>`;
                });

                message += `<br><strong>📤 总计：<span style="color:red">${allcount}</span> 次</strong>`;

                // 调用函数创建弹窗
                createPopup(message);
            });
        }
        return originalOpen.apply(this, [method, url, ...args]);
    };

    // 创建弹窗
    function createPopup(content) {
        let existingPopup = document.getElementById("custom-popup");
        if (existingPopup) {
            existingPopup.remove(); // 先移除已存在的弹窗
        }

        // 创建弹窗外层
        let popup = document.createElement("div");
        popup.id = "custom-popup";
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.width = "400px";
        popup.style.maxWidth = "90%";
        popup.style.maxHeight = "80vh";
        popup.style.overflowY = "auto";
        popup.style.background = "#fff";
        popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        popup.style.borderRadius = "10px";
        popup.style.padding = "20px";
        popup.style.zIndex = "9999";
        popup.style.fontSize = "16px";
        popup.style.color = "#333";
        popup.style.lineHeight = "1.5";

        // 创建关闭按钮
        let closeButton = document.createElement("button");
        closeButton.textContent = "关闭";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.background = "#ff4d4d";
        closeButton.style.color = "#fff";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "5px";
        closeButton.style.padding = "5px 10px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function () {
            popup.remove();
        };

        // 创建内容区域
        let contentDiv = document.createElement("div");
        contentDiv.innerHTML = content;

        // 组装弹窗
        popup.appendChild(closeButton);
        popup.appendChild(contentDiv);
        document.body.appendChild(popup);
    }

})();
