// ==UserScript==
// @name         即科金融Geek
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Geek 即科金融 批量导出数据
// @author       Bor1s
// @match        https://oc.geexfinance.com/collectionTask
// @icon         https://oc.geexfinance.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493559/%E5%8D%B3%E7%A7%91%E9%87%91%E8%9E%8DGeek.user.js
// @updateURL https://update.greasyfork.org/scripts/493559/%E5%8D%B3%E7%A7%91%E9%87%91%E8%9E%8DGeek.meta.js
// ==/UserScript==

//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);

// window.onload = function () {
//     console.log('页面加载完成，油猴开始加载...')
//     var targetElement = document.querySelector("#container > div.top > div.user")
//     if (targetElement) {
//         const buttonHTML = '<span id="exportEXCEL" style="margin-right:10px"><i class="el-icon-download"></i></span>';
//         targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
//         const button = document.querySelector("#exportEXCEL");
//         button.addEventListener("click", function () {
//             document.querySelector("#exportEXCEL").innerHTML = `<i class="el-icon-loading"></i>`;
//             fetchData();
//         });
//         button.oncontextmenu = function (e) {
//             return false
//         }

//     }
// }

setTimeout(function () {
    console.log('页面加载完成，油猴开始加载...')
    var targetElement = document.querySelector("#container > div.top > div.user")
    if (targetElement) {
        const buttonHTML = '<span id="exportEXCEL" style="margin-right:10px"><i class="el-icon-download"></i></span>';
        targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
        const button = document.querySelector("#exportEXCEL");
        button.addEventListener("click", function () {
            document.querySelector("#exportEXCEL").innerHTML = `<i class="el-icon-loading"></i>`;
            fetchData();
        });
        button.oncontextmenu = function (e) {
            return false
        }

    }
},5000)

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

function fetchData() {
    let arr = []; // 用于存放所有的 appId
    let username = ''; // 存用户名

    // 获取用户名的 Promise
    const getUsername = fetch("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/getUser", {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://oc.geexfinance.com/collectionTask",
        "method": "POST",
        "credentials": "include"
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch username');
        }
        return response.json();
    }).then(data => {
        document.querySelector("#exportEXCEL").innerHTML = `用户获取成功<i class="el-icon-loading"></i>`;
        username = data.username;
        return data.username;
    }).catch(error => {
        console.error('获取用户名出错：', error);
        throw error;
    });

    // 当用户名获取成功后，继续执行获取数据的操作
    getUsername.then(username => {
        return fetchGaiBuData(username);
    }).then(() => {
        document.querySelector("#exportEXCEL").innerHTML = `正在处理……<i class="el-icon-loading"></i>`;
        const concurrencyLimit = 8; // 线程数
        const batches = [];
        for (let i = 0; i < arr.length; i += concurrencyLimit) {
            batches.push(arr.slice(i, i + concurrencyLimit));
        }
        // 逐批发起并发请求
        const promiseChain = batches.reduce((chain, batch) => {
            return chain.then(() => {
                return Promise.all([
                    Promise.all(batch.map(item => fetchAddInfo(item.appId, item.encryptId))),
                    Promise.all(batch.map(item => fetchOverdueInfo(item.appId, item.encryptId))),
                    Promise.all(batch.map(item => fetchContractInfo(item.appId, item.encryptId, username)))
                ]);
            });
        }, Promise.resolve());
        return promiseChain;
    }).then(() => {
        // console.log(arr);
        // 导出数据到 Excel
        // debugger
        exportExcel();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // 定义获取数据的函数，接收用户名作为参数
    function fetchGaiBuData(username) {
        const paramJSON = {
            "appId": "",
            "operatorId": "",
            "repayAmtToday": "",
            "overdueStage": [],
            "overdueLabel": "",
            "sndLetterCntFrom": "",
            "sndLetterCntTo": "",
            "stopCollection": "",
            "city": "",
            "name": "",
            "mobile": "",
            "idNo": "",
            "productId": "",
            "storeCode": "",
            "storeLevel": "",
            "followDateFrom": "",
            "followDateTo": "",
            "actionCode": "",
            "cashOutLabel": "",
            "lostLabel": "",
            "op": username,
            "roleId": "0",
            "batchNumber": "",
            "curPage": 1,
            "rows": 20
        };

        const body = `key=doGetGaiBuListSearchAPI&param={"op":"${username}","roleId":"0","curPage":1,"rows":20}`;
        return fetch("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/gaiBuApi", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            referrer: "https://oc.geexfinance.com/collectionTask",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: body,
            mode: "cors",
            credentials: "include"
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            const resultData = JSON.parse(data.result);
            const rows = resultData.rows;
            const total = resultData.total;
            //第一页
            for (let i = 0; i < rows.length; i++) {
                arr.push({ 'appId': rows[i].appId, 'encryptId': rows[i].encryptId ,'createTime': rows[i].createTime,'operatorString': rows[i].operatorString, 'batchNumber': rows[i].batchNumber});
            }
            const remainingRequests = Math.ceil(total / 20) - 1;
            const promises = [];
            //remainingRequests 3
            for (let i = 1; i <= remainingRequests; i++) {
                const nextPageParams = { ...paramJSON, curPage: i + 1 };
                const nextPageBody = `key=doGetGaiBuListSearchAPI&param=${encodeURIComponent(JSON.stringify(nextPageParams))}`;
                const promise = fetch("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/gaiBuApi", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: nextPageBody
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    //后面的页
                    const nextPageRows = JSON.parse(data.result).rows;
                    for (let j = 0; j < nextPageRows.length; j++) {
                        arr.push({ 'appId': nextPageRows[j].appId, 'encryptId': nextPageRows[j].encryptId ,'createTime': nextPageRows[j].createTime,'operatorString': nextPageRows[j].operatorString,'batchNumber': nextPageRows[j].batchNumber});
                    }
                }).catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });

                promises.push(promise);
            }

            return Promise.all(promises);
        });
    }

    // 定义获取 addInfo 的函数，接收 appId 和用户名作为参数
    function fetchAddInfo(appId, encryptId) {
        const body = `key=doSecBasicInfoAPI&param=${encodeURIComponent(JSON.stringify({ "id": encryptId, "op": username }))}`;
        return fetch("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/gaiBuApi", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            "referrer": `https://oc.geexfinance.com/collectionDetails/${encryptId}?appId=${appId}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": body,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch addInfo for appId: ${appId}`);
            }
            return response.json();
        }).then(data => {
            // 将获取的 addInfo 写入到对应的 appId 中
            const index = arr.findIndex(item => item.appId === appId);
            if (index !== -1) {
                arr[index].addInfo = JSON.parse(data.result);
            }

        }).catch(error => {
            console.error(`There was a problem with the fetch operation for appId ${appId}:`, error);
        });
    }
    //逾期信息
    function fetchOverdueInfo(appId, encryptId) {
        const body = `key=doSecOverdueInfo&param=${encodeURIComponent(JSON.stringify({ "id": encryptId, "op": username }))}`;
        return fetch("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/gaiBuApi", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            "referrer": `https://oc.geexfinance.com/collectionDetails/${encryptId}?appId=${appId}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": body,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(overdueInfo => {
            // 将逾期信息写入到对应的 appId 中
            const overdueInfo1 = JSON.parse(overdueInfo.result);
            const item = arr.find(item => item.appId === appId);
            if (item) {
                item.overdueInfo = overdueInfo1;
            }
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    async function fetchContractInfo(appId, encryptId) {
        const body = `key=doSecContractlnfoAPI&param=${encodeURIComponent(JSON.stringify({ "id": encryptId, "op": username }))}`;
        try {
            const response = await fetchWithTimeout("https://oc.geexfinance.com/geex-yoyogi-web/gbApi/gaiBuApi", {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                "referrer": `https://oc.geexfinance.com/collectionDetails/${encryptId}?appId=${appId}`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": body,
                "method": "POST",
                "mode": "cors",
                "credentials": "include",
                timeout: 10000 // 设置超时时间为 10 秒
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch addInfo for appId: ${appId}`);
            }
            const data = await response.json();
            const index = arr.findIndex(item => item.appId === appId);
            if (index !== -1) {
                arr[index].contractInfo = JSON.parse(data.result);
            }
        } catch (error) {
            console.error(`There was a problem with the fetch operation for appId ${appId}:`, error);
            const index = arr.findIndex(item => item.appId === appId);
            if (index !== -1) {
                arr[index].contractInfo = [];
            }
        }
    }
    //导出excel
    function exportExcel(){
        const customHeader = ["申请编号","批次号","姓名","身份证","总欠款","剩余本金","逾期金额","家庭地址","户籍地址","联系方式1","联系方式2","联系方式3","联系方式4","联系方式5", "创建时间", "持有人"];
        const formattedData = arr.map(item => {
            const createTime = item.createTime ? new Date(item.createTime).toLocaleDateString() : '';
            const data = {
                "申请编号": item.appId || '',
                "批次号":item.batchNumber || '',
                "姓名": (item.addInfo && item.addInfo.cName) || '',
                "身份证": (item.addInfo && item.addInfo.idNo) || '',
                "总欠款": (item.overdueInfo && item.overdueInfo.loanBalance) || '',
                "剩余本金": (item.overdueInfo && item.overdueInfo.remainCorpus) || '',
                "逾期金额": (item.overdueInfo && item.overdueInfo.currPayAmount) || '',
                "家庭地址": (item.addInfo && item.addInfo.cHomeAddr) || '',
                "户籍地址": (item.addInfo && item.addInfo.ocrAddress) || '',
                "创建时间": createTime,
                "持有人": item.operatorString || ''
            };
            if (item.contractInfo && item.contractInfo.length >= 5) {
                data["联系方式1"] = (item.contractInfo[0] && item.contractInfo[0].cType) + "+" + (item.contractInfo[0] && item.contractInfo[0].cMobile) || '';
                data["联系方式2"] = (item.contractInfo[1] && item.contractInfo[1].cType) + "+" + (item.contractInfo[1] && item.contractInfo[1].cMobile) || '';
                data["联系方式3"] = (item.contractInfo[2] && item.contractInfo[2].cType) + "+" + (item.contractInfo[2] && item.contractInfo[2].cMobile) || '';
                data["联系方式4"] = (item.contractInfo[3] && item.contractInfo[3].cType) + "+" + (item.contractInfo[3] && item.contractInfo[3].cMobile) || '';
                data["联系方式5"] = (item.contractInfo[4] && item.contractInfo[4].cType) + "+" + (item.contractInfo[4] && item.contractInfo[4].cMobile) || '';
            } else {
                for (let i = 0; i < Math.min(item.contractInfo?.length || 0, 5); i++) {
                    data[`联系方式${i + 1}`] = (item.contractInfo[i] && item.contractInfo[i].cType) + "+" + (item.contractInfo[i] && item.contractInfo[i].cMobile) || '';
                }
            }
            return data;
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData,{header:customHeader});
        worksheet['!cols']=[
            {wch:16},//申请编号
            {wch:16},//批次号
            {wch:10},//姓名
            {wch:18},//身份证
            {wch:10},//总欠款
            {wch:10},//剩余本金
            {wch:10},//逾期金额
            {wch:20},//家庭地址
            {wch:20},//户籍地址
            {wch:23},//联系方式1
            {wch:23},//联系方式2
            {wch:23},//联系方式3
            {wch:23},//联系方式4
            {wch:23},//联系方式5
            {wch:10},//创建时间
            {wch:10},//持有人
        ];
        XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_即科金融Geek-导出数据.xlsx`);
        document.querySelector("#exportEXCEL").innerHTML = `<i class="el-icon-download"></i>`;
    }
}