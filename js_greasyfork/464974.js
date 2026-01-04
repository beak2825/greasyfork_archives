// ==UserScript==
// @name         Ringeal007的《我的世界》基岩版专用服务器下载按钮
// @namespace    Ringeal007
// @version      1.0
// @description  对中文Minecraft Wiki镜像站的基岩版专用服务器页面中的表格作出修改。每个版本对应的行的最右侧都增加一个单元格，包含两个下载按钮，第一个默认采用第一接口，第二个默认采用第二接口。如果该版本为测试版或未发布Linux版，则将按钮设置为不可点击。按钮名称分别为“下载（Windows）”和“下载（Ubuntu（Linux））”。
// @author       binjie09
// @match        *://wiki.biligame.com/mc/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%B8%93%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464974/Ringeal007%E7%9A%84%E3%80%8A%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E3%80%8B%E5%9F%BA%E5%B2%A9%E7%89%88%E4%B8%93%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464974/Ringeal007%E7%9A%84%E3%80%8A%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E3%80%8B%E5%9F%BA%E5%B2%A9%E7%89%88%E4%B8%93%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

//本脚本部分代码由ChatGPT生成

(function() {
    'use strict';

    // 定义四个不同接口的下载链接
    const apiUrls = [
        "https://minecraft.azureedge.net/bin-win/bedrock-server-%version%.zip",
        "https://minecraft.azureedge.net/bin-linux/bedrock-server-%version%.zip",
        "https://minecraft.azureedge.net/bin-win-preview/bedrock-server-%version%.zip",
        "https://minecraft.azureedge.net/bin-linux-preview/bedrock-server-%version%.zip"
    ];

    // 找到包含版本信息的表格，获取tbody元素
    const tbody = document.evaluate('/html/body/div[2]/div[2]/div[4]/div[5]/div/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // 遍历表格中的每个版本行
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];

        // 在该版本行最后增加一个单元格
        const cell = row.insertCell(-1);

        // 如果该版本介绍中含有 "测试版服务器软件升级至"，采用第三和第四接口
        const isPreview = row.cells[1].innerText.includes("测试版服务器软件升级至");

        // 如果该版本介绍中含有 "未发布Linux版"，则将按钮变色并设置为不可点击
        const isLinuxUnavailable = row.cells[1].innerText.includes("未发布Linux版");

        // 获取版本号
        const version = row.cells[0].innerText;

        // 给该单元格添加两个下载按钮
        const downloadBtnWin = document.createElement("a");
        downloadBtnWin.textContent = "下载（Windows）";
        downloadBtnWin.href = apiUrls[isPreview ? 2 : 0].replace("%version%", version);
        downloadBtnWin.style.marginRight = "10px";
        if (isLinuxUnavailable) {
            downloadBtnWin.style.color = "gray";
            downloadBtnWin.style.pointerEvents = "none";
        }
        cell.appendChild(downloadBtnWin);

        const downloadBtnLinux = document.createElement("a");
        downloadBtnLinux.textContent = "下载（Ubuntu（Linux））";
        downloadBtnLinux.href = apiUrls[isPreview ? 3 : 1].replace("%version%", version);
        if (isLinuxUnavailable) {
            downloadBtnLinux.style.color = "gray";
            downloadBtnLinux.style.pointerEvents = "none";
        }
        cell.appendChild(downloadBtnLinux);

        // 设置该单元格的样式
        cell.style.whiteSpace = "nowrap";
        cell.style.textAlign = "right";
        cell.style.verticalAlign = "middle";
    }
})();