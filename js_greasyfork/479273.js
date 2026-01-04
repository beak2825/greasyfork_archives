// ==UserScript==
// @name         fanyusoft凡宇
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  凡宇催收管理系统导出客户信息为csv
// @author       Bor1s
// @license      MIT
// @match        http://cc.fanyusoft.com/
// @icon         http://cc.fanyusoft.com/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479273/fanyusoft%E5%87%A1%E5%AE%87.user.js
// @updateURL https://update.greasyfork.org/scripts/479273/fanyusoft%E5%87%A1%E5%AE%87.meta.js
// ==/UserScript==
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);
const customCSS = `
        .loading {
            animation: rotate 2s linear infinite;
        }
        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;
const style = document.createElement('style');
style.type = 'text/css';
style.textContent = customCSS;
document.head.appendChild(style);
var arr = '';
var listNum = 9999;
var targetElement = document.querySelector("body > div.layui-layout.layui-layout-admin > div.layui-header > ul.layui-nav.layui-layout-right > li:nth-child(2)");
if (targetElement) {
    targetElement.innerHTML = `<div id='statusBox' title='右击进入配置'><i class='fa fa-download' id='status'></i> <span id='statusText'>导出</span></div>`;
    var status = document.querySelector("#status");
    var statusText = document.querySelector("#statusText");
    var statusBox = document.querySelector("#statusBox");
    statusBox.addEventListener("click", function() {
        fetchData();
    });
    statusBox.oncontextmenu = function(e){
        return false
    }
    statusBox.onmouseup = function(e){
        if(e.button == 2){
            listNum=prompt("请输入数值，留空为全部",listNum);
            if(listNum==""||listNum==0){
                listNum=9999
            }
            console.log("当前设置数值为："+listNum)
        }
    }
}
async function fetchData() {
    status.classList.remove('fa-download');
    status.classList.add('fa-spinner', 'loading');
    statusText.innerText = "0%";
    const response = await fetch("http://cc.fanyusoft.com/collection/list", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: "pageNum=1&pageSize="+listNum
    });
    const data = await response.json();
    statusText.innerText ="5%";
    if (data && data.code === 0 && data.results && data.results.list) {
        arr = data.results.list.map(item => ({
            id: item.kpId,
            name: item.customerName,
            overdueStatus: item.overdueStatus,
            overdueTotal: item.overdueTotal
        }));
        statusText.innerText = "8%"
        var totalItems = arr.length;
        var completedItems = 0;
        for (const item of arr) {
            await getCardNum(item.id);
            completedItems++;
            var progressPercentage = Math.round((completedItems / totalItems) * 40) + 8;
            if (progressPercentage <= 50) {
                statusText.innerText = progressPercentage + "%";
            } else {
                statusText.innerText = "50%";
            }
        }
        statusText.innerText = "50%";
        var totalItems1 = arr.length;
        var completedItems1 = 0;
        for (const item of arr) {
            await getPhoneNum(item.id);
            completedItems1++;
            var progressPercentage1 = 50 + (completedItems1 / totalItems1) * 30;
            if (progressPercentage1 <= 98) {
                statusText.innerText = Math.round(progressPercentage1) + "%";
            } else {
                statusText.innerText = "98%";
            }
        }
        statusText.innerText = "98%";
        const headers = ['ID', '姓名','账龄','逾期总金额','银行卡号','身份证号','单位地址','家庭住址','户籍地址','联系人1','手机号1','联系人2','手机号2','联系人3','手机号3','联系人4','手机号4','联系人5','手机号5'];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        worksheet['!cols'] = [
            { wch: 5 },
            { wch: 8 },
            { wch: 5 },
            { wch: 10 },
            { wch: 20 },
            { wch: 18 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 }
        ];
        XLSX.utils.sheet_add_json(worksheet, arr, { skipHeader: true, origin: -1 });
        headers.forEach((header, columnIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: columnIndex });
            worksheet[cellAddress].t = 's';
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, '导出结果');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_导出数据.xlsx`);
        statusText.innerText = "成功！";
        status.classList.remove('fa-spinner', 'loading');
        status.classList.add('fa-check-square-o');
        setTimeout(function() {
            statusText.innerText = "导出";
            status.classList.remove('fa-check-square-o');
            status.classList.add('fa-download');
        }, 5000);
    } else {
        console.error("无法提取kpId值或数据格式不符合预期");
    }
}
async function getCardNum(id) {
    try {
        const response = await fetch(`http://cc.fanyusoft.com/collection/${id}/customerInfo`);
        const htmlContent = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const idNoElement = doc.getElementById("permissonIdNo");
        const bankCardElement = doc.querySelector(".layui-col-lg3:nth-child(7) p");
        const companyElement = doc.querySelector(".layui-col-lg3:nth-child(11) p");
        const homeElement = doc.querySelector(".layui-col-lg3:nth-child(12) p");
        const domicileElement = doc.querySelector(".layui-col-lg3:nth-child(13) p");
        const idNo = idNoElement.textContent;
        const bankCard = bankCardElement.textContent;
        const companyAdress = companyElement.textContent;
        const homeAdress = homeElement.textContent;
        const domicileAddress = domicileElement.textContent;
        const existingItem = arr.find(item => item.id === id);
        if (existingItem) {
            existingItem.bankCard = bankCard;
            existingItem.idCard = idNo;
            existingItem.companyAdress = companyAdress;
            existingItem.homeAdress = homeAdress;
            existingItem.domicileAddress = domicileAddress;
            //console.log("已更新信息（ID: " + id + "）:", existingItem);
        } else {
            console.error("未找到相同ID（ID: " + id + "）");
        }
    } catch (error) {
        console.error(`发生错误（ID: ${id}）:`, error);
    }
}
async function getPhoneNum(id) {
    try {
        const response = await fetch(`http://cc.fanyusoft.com/collection/${id}/queryAddNumber`, {
            "headers": {
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache"
            },
            "referrer": `http://cc.fanyusoft.com/collection/${id}`,
            "body": "pageNum=1&pageSize=5",
            "method": "POST"
        });

        const data = await response.json();

        if (data && data.code === 0 && data.results && data.results.list) {
            const total = data.results.total;
            if (total > 0) {
                const list = data.results.list;
                const existingItem = arr.find(item => item.id === id);

                if (existingItem) {
                    for (let i = 0; i < 5; i++) {
                        existingItem[`phoneRel${i + 1}`] = list[i].name+'-'+list[i].relationShipName;
                        existingItem[`phoneNum${i + 1}`] = list[i].phoneEn;
                    }
                    //console.log("已更新手机号信息:", existingItem);
                } else {
                    console.error(`未找到ID元素（ID: ${id}）`);
                }
            } else {
                console.error("没有可用的手机号数据");
            }
        } else {
            console.error("无法提取手机号或数据格式不符合预期");
        }
    } catch (error) {
        console.error("发生错误:", error);
    }
}
