// ==UserScript==
// @name         24.03.02查询物流（个人使用）
// @version      2.5
// @description  获取物流信息（飞猪云）
// @author       menkeng
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @match        https://peyc5wz79b.feishu.cn/sheets/Kdv0slsCVhK5QGtMhyUcVhIyn3d*
// @namespace    https://greasyfork.org/users/935835
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @connect      yun.zhuzhufanli.com
// @connect      http://yun.zhuzhufanli.com/mini/create/
// @downloadURL https://update.greasyfork.org/scripts/488825/240302%E6%9F%A5%E8%AF%A2%E7%89%A9%E6%B5%81%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488825/240302%E6%9F%A5%E8%AF%A2%E7%89%A9%E6%B5%81%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
 
var login = "http://yun.zhuzhufanli.com/mini/welcome/?appid=257605&outerid=863BE260DF474CC8"
var app_id = "cli_a552fcd44272d00b";
var app_secret = "3ngFgRHTqfawejIx5QdekGDMkNufIXZ6";
var tenantAccessToken = "";
var spreadsheetId = "Kdv0slsCVhK5QGtMhyUcVhIyn3d";
var sheetId_taobao = "2CuMer!";
var sheetId_changjia = "3LaMxN!";
var sheetId_48 = "0RuUss!";
var appid = 257605
var outerid = "863BE260DF474CC8"
var sheet_read_result = {}; // 用于快递查询的对象
var sheet_read_shipcompany = [];
var sheet_read_shipid = [];
var query_list = [];
var resultArray = [];
var resultObject = {};
// 回调请求工具
function GM_xmlhttpRequestAsync(details) {
    return new Promise((resolve, reject) => {
        details.onload = function (response) {
            resolve(response);
        };
        details.onerror = function (error) {
            reject(error);
        };
        GM_xmlhttpRequest(details);
    });
}
// 请求token
async function get_tenant_access_token() {
    return new Promise((resolve, reject) => {
        const auth_url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
        const auth_headers = {
            "Content-Type": "application/json; charset=utf-8",
        };
        const body = JSON.stringify({
            app_id: app_id,
            app_secret: app_secret,
        });
        GM_xmlhttpRequest({
            method: "POST",
            url: auth_url,
            headers: auth_headers,
            data: body,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    var responseData = JSON.parse(response.responseText);
                    tenantAccessToken = responseData.tenant_access_token;
                    resolve(responseData.tenant_access_token); // Resolve with the token
                } else {
                    reject("获取 tenantAccessToken 失败: " + response.responseText);
                }
            },
            onerror: function () {
                reject("Request failed");
            },
        });
    });
}
// 读取表格
function sheet_read(range, tenantAccessToken) {
    return new Promise((resolve, reject) => {
        var spreadsheetId = "Kdv0slsCVhK5QGtMhyUcVhIyn3d";
        var sheet_read_url =
            "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" +
            spreadsheetId +
            "/values/" +
            range +
            "?valueRenderOption=FormattedValue";
        var headers = {
            Authorization: `Bearer ${tenantAccessToken}`,
            "Content-Type": "application/json; charset=utf-8",
        };
        GM_xmlhttpRequest({
            method: "GET",
            url: sheet_read_url,
            headers: headers,
            // data: body,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    var responseData = JSON.parse(response.responseText);
                    var responsearray = responseData.data.valueRange.values;
                    resolve(responsearray);
                } else {
                    reject("读取表格失败: " + response.responseText);
                }
            },
            onerror: function () {
                reject("Request failed");
            },
        });
    });
}
// 请求&读取表格
async function readSheetAndProcessData(range) {
    try {
        tenantAccessToken = await get_tenant_access_token();
        // console.log("tenant_access_token:", tenantAccessToken); // 调用 sheet_read 函数读取数据
        const sheetData = await sheet_read(range, tenantAccessToken);
        // console.log("sheetData:", sheetData);
        return sheetData; // 返回 sheetData
    } catch (error) {
        console.error(error);
    }
}
function processSheetData(shipIds, shipCompanies, ship_statu) {
    sheet_read_shipid = shipIds;
    sheet_read_shipcompany = shipCompanies;
    for (var i = 0; i < ship_statu.length; i++) {
        var bValue = sheet_read_shipcompany[i];
        var aValue = sheet_read_shipid[i];
        if (ship_statu[i] == "否") {
            continue;
        }
        if (ship_statu[i] !== "否") {
            if (bValue == "shunfeng") {
                aValue = aValue + "||9499";
            }
            if (bValue == ""||bValue==null||aValue==""||aValue==null) {
                continue;
            }
            if (bValue !== undefined && bValue !== null && aValue !== undefined && aValue !== null) {
                if (!query_list.hasOwnProperty(bValue)) {
                    query_list[bValue] = [aValue];
                } else if (!query_list[bValue].includes(aValue)) {
                    query_list[bValue].push(aValue);
                }
            }
        }
    }
}
// 更新表格
function sheet_update(range, data, tenantAccessToken) {
    return new Promise((resolve, reject) => {
        //   console.log(`写入范围: ${range}，数据: ${JSON.stringify(data)}`);
        var sheet_update_url = "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" + spreadsheetId + "/values";
        var headers = {
            Authorization: `Bearer ${tenantAccessToken}`,
            "Content-Type": "application/json; charset=utf-8",
        };
        var body = JSON.stringify({
            valueRange: {
                range: range,
                values: data,
            },
        });
        GM_xmlhttpRequest({
            method: "PUT",
            url: sheet_update_url,
            headers: headers,
            data: body,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    console.log("写入表格成功:", response.responseText);
                    resolve(response.responseText);
                } else {
                    reject("写入表格错误:", response.responseText);
                }
            },
            onerror: function () {
                reject("Request failed");
            },
        });
    });
}
// 请求任务
async function createTask() {
    const createurl = "http://yun.zhuzhufanli.com/mini/create/";
    for (const kdgs in query_list) {
        const response = await GM_xmlhttpRequestAsync({
            method: "POST",
            url: createurl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: "appid=" + appid +
                "&outerid=" + outerid +
                "&zffs=jinbi" +
                "&kdgs=" + kdgs +
                "&kddhs=" + query_list[kdgs].join(',') +
                "&isBackTaskName=yes",
            timeout: 60000
        });
        if (response.status !== 200) {
            throw new Error("请求失败，状态码为：" + response.status);
        }
    }
}
// 获取结果
async function query_task() {
    const query_url = 'http://yun.zhuzhufanli.com/mini/query/';
    for (const company in query_list) {
        var trackNumbers = query_list[company];
        for (var trackNumber of trackNumbers) {
            const data = new URLSearchParams();
            data.append('kdgs', company); 
            if (company === 'shunfeng') {
                trackNumber = trackNumber.replace('||9499', '');
            }
            data.append('kddh', trackNumber);
            const response = await GM_xmlhttpRequestAsync({
                method: 'POST',
                url: query_url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data.toString(),
            });
            const responseData = JSON.parse(response.responseText);
            if (responseData.msg.zuihouwuliu) {
                var parts = responseData.msg.zuihouwuliu.split("|");
                var extractedContent = parts[1]; // 提取分割后的第二部分内容
            
                resultObject[responseData.msg.kddh] = {
                    kddh: responseData.msg.kddh,
                    wuliuzhuangtai: responseData.msg.wuliuzhuangtai,
                    fachushijian: responseData.msg.fachushijian,
                    zuixinshijian: responseData.msg.zuixinshijian,
                    zuihouwuliu: extractedContent,
                    chaxunshijian: responseData.msg.chaxunshijian
                };
            }
        }
    }
}
// 参数查询
function findInfoByKddh(kddh, infoKey) {
    const result = resultObject[kddh];
    if (result) {
        return result[infoKey] || '无信息';
    } else {
        return '无信息';
    }
}
// 结果填写
async function input_task(range, data, query) {
    var data = []
    var sheet_date = await sheet_read(sheetId_changjia + 'G2:G150', tenantAccessToken)
    for (var i = 0; i < sheet_date.length; i++) {
        var info = findInfoByKddh(sheet_date[i], query);
        data.push([info]);
    }
    await sheet_update(range, data, tenantAccessToken);
}
async function createBatchQuery() {
    try {
        const shipIdsPromise = readSheetAndProcessData(sheetId_changjia + 'G2:G150');
        const shipCompaniesPromise = readSheetAndProcessData(sheetId_changjia + 'F2:F150');
        const ship_status = readSheetAndProcessData(sheetId_changjia + 'L2:L150');
        const [shipIds, shipCompanies, ship_statu] = await Promise.all([shipIdsPromise, shipCompaniesPromise, ship_status]);
        processSheetData(shipIds, shipCompanies, ship_statu);
        await createAndQueryTasks();
        await createBatchQuery();
        setInterval(function() {
            statusText.textContent = '下次查询时间：' + new Date(Date.now() + 60 * 60 * 1000).toLocaleString();
            createAndQueryTasks();
        }, querytime); 
    } catch (error) {
        console.error("Error processing data:", error);
        throw error;
    }
}
var queryInterval
async function createAndQueryTasks() {
    await createTask();
    await queryAndInputTasks();
    let queryCount = 1;
    queryInterval = setInterval(async () => {
        if (queryCount < 6) {
            try {
                await queryAndInputTasks();
                queryCount++;
            } catch (error) {
                console.error("Error querying task:", error);
                clearInterval(queryInterval);
            }
        } else {
            clearInterval(queryInterval);
        }
    }, 60 * 1000); // 1分钟
}
 
async function queryAndInputTasks() {
    await query_task();
    await input_task(sheetId_changjia + 'H2:H150', resultArray, 'wuliuzhuangtai');
    await input_task(sheetId_changjia + 'I2:I150', resultArray, 'zuihouwuliu');
    await input_task(sheetId_changjia + 'J2:J150', resultArray, 'zuixinshijian');
    await input_task(sheetId_changjia + 'K2:K150', resultArray, 'chaxunshijian');
}
// 查询主入口------------------------
// 创建按钮
function main() {
    const button = document.createElement('button');
    button.textContent = '查询物流';
    document.body.insertBefore(button, document.body.firstChild);
 
    // 创建状态文本
    const statusText = document.createElement('p');
    document.body.insertBefore(statusText, document.body.firstChild);
 
    // 设置按钮点击事件
    button.addEventListener('click', function () {
        if (button.textContent === '查询物流') {
            button.textContent = '正在查询...点击停止';
            createBatchQuery()
                .then(() => {
                    statusText.textContent = '查询成功';
                })
                .catch(error => {
                    statusText.textContent = '错误: ' + error;
                });
        } else {
            button.textContent = '查询物流';
            clearInterval(queryInterval);
        }
    });
 
    // 定义按钮样式
    button.style.position = 'fixed';
    button.style.top = '30px';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.backgroundColor = '#ffffff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '4px';
    button.style.color = '#333333';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.zIndex = '9999';
    // 定义状态文本样式
    statusText.style.position = 'fixed';
    statusText.style.top = '20px';
    statusText.style.left = '50%';
    statusText.style.transform = 'translateX(-50%)';
    statusText.style.color = '#ffffff';
    statusText.style.backgroundColor = '#ffffff';
    statusText.style.padding = '10px';
    statusText.style.borderRadius = '4px';
}
main()
 
// 查询间隔  1小时
querytime = 60 * 60 * 1000   