// ==UserScript==
// @name         国人公会助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  测试操作飞书表格数据
// @author       Stella
// @license      Trutn_Light
// @match        https://www.milkywayidle.com/game?characterId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/500883/%E5%9B%BD%E4%BA%BA%E5%85%AC%E4%BC%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/500883/%E5%9B%BD%E4%BA%BA%E5%85%AC%E4%BC%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


'use strict';
const secureData = {
    app_id: "cli_a60588a069f0100b",
    secret: "iX1AKQrtNzGHL1PG9SqjLgmKhRkXtz3z",
    baseToken: "KryeszWNPhMjmFtbqbhcSDS3n5V",
    tableID: "",
};
let tenant_access_token = "";
let Guild_Data = {};
let storedData = {};

let needaNewSheetCalled = false;
let newSheetId = null;
let SheetId = null;

function hookWS() {
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const oriGet = dataProperty.get;

    dataProperty.get = hookedGet;
    Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

    function hookedGet() {
        const socket = this.currentTarget;
        if (!(socket instanceof WebSocket)) {
            return oriGet.call(this);
        }
        if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
            return oriGet.call(this);
        }

        const message = oriGet.call(this);
        Object.defineProperty(this, "data", { value: message }); // Anti-loop
        if (!needaNewSheetCalled) {
            needaNewSheetCalled = true;
            NeedaNewSheet();
        }
        handleMessage(message);
        return message;
    }
}
getTenantToken();

hookWS();

// 获取今天的日期

function formatDate(date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

today = formatDate(today);
yesterday = formatDate(yesterday);

console.log("Today: " + today);
console.log("Yesterday: " + yesterday);

async function NeedaNewSheet() {
    await delay(1000);
    const query_url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${secureData.baseToken}/sheets/query`;
    const post_header_query = {
        Authorization: `Bearer ${tenant_access_token}`,
    };

    try {
        // 发送请求获取响应体
        GM_xmlhttpRequest({
            method: 'GET',
            url: query_url,
            headers: post_header_query,
            onload: function(response) {
                console.log('Raw response:', response.responseText); // 添加日志记录原始响应文本

                try {
                    const data = JSON.parse(response.responseText);

                    // 查找 index=0 的 sheet
                    const sheet = data.data.sheets.find(sheet => sheet.index === 0);

                    if (sheet) {
                        const title = sheet.title;
                        SheetId = sheet.sheet_id;
                        console.log(`Title: ${title}`);
                        console.log(`Sheet ID: ${SheetId}`);

                        if (title === today) {

                            console.log('今天已经读取过数据了');
                            return;
                        } else {
                            console.log('创建今日数据');

                            AddNewSheet(today);
                        }
                    } else {
                        console.log('No sheet with index 0 found.');
                    }
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                }
            },
            onerror: function(error) {
                console.error('Error fetching sheets:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching sheets:', error);
    }
}

// 定义 AddNewSheet 函数
async function AddNewSheet(today) {
    console.log('New sheet is being added...');
    const add_url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${secureData.baseToken}/sheets_batch_update`;
    const post_header_add = {
        Authorization: `Bearer ${tenant_access_token}`,
        "Content-Type": "application/json",
    };

    const payload = {
        requests: [
            {
                addSheet: {
                    properties: {
                        title: today,
                    }
                }
            }
        ]
    };

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: add_url,
            headers: post_header_add,
            data: JSON.stringify(payload),
            onload: function(response) {
                console.log('Raw response:', response.responseText); // 添加日志记录原始响应文本

                try {
                    const result = JSON.parse(response.responseText);

                    if (result.code === 0) {
                        newSheetId = result.data.replies[0].addSheet.properties.sheetId;
                        console.log('New sheet added:', result);
                        console.log('New Sheet ID:', newSheetId);

                        // 这里可以记录新的 sheetId，比如存储在某个变量或发送到某个服务
                    } else {
                        console.error('Error adding new sheet:', result.msg);
                    }
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                }
            },
            onerror: function(error) {
                console.error('Error adding new sheet:', error);
            }
        });
    } catch (error) {
        console.error('Error adding new sheet:', error);
    }
}

async function handleMessage(message) {
    try {
        let obj = JSON.parse(message);
        if (obj && obj.type === "leaderboard_updated" && obj.leaderboard && obj.leaderboard.type === "guild") {
            let guilds = obj.leaderboard.rows.map(row => ({
                name: row.guild,
                level: row.value1,
                experience: row.value2
            }));

            console.log('Guilds:', guilds);

            if (newSheetId) {
                await postGuildData(guilds, newSheetId, yesterday);
            } else {
                console.error('No valid sheet ID found.');
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
}

// 示例：将公会信息发送到 Feishu API
async function postGuildData(guilds, newSheetId, yesterday) {
    const post_url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${secureData.baseToken}/values_batch_update`;
    const post_header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tenant_access_token}`
    };

    // 构造 values 数组，包含公会名、等级和格式化后的经验值
    const values = guilds.map(guild => [
        guild.name,
        guild.level,
        Math.round(guild.experience)
    ]);

    // 构造 D 列的公式数组
    const diffFormulas = guilds.map((guild, index) => [
        `=FERROR( C${index + 2}- XLOOKUP(A${index + 2}, '${yesterday}'!A:A, '${yesterday}'!C:C,) , "")`
    ]);

    // 构造 E 列的公式数组
    const growthRateFormulas = guilds.map((guild, index) => [
        `=FERROR(D${index + 2}/(  G${index + 2}-'${yesterday}'!G${index + 2})/24, "")`
    ]);
     // 构造 F 列的公式数组
    const TimeFormulas = guilds.map((guild, index) => [
        `=FERROR(IF(E${index + 2}>E${index + 1},text(((C${index + 1}-C${index + 2})/(E${index +2 }-E${index + 1})/24),"[h]小时mm分"),"∞"), "")`
    ]);

    // 获取当前时间并格式化为 YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const formattedTime = now.toISOString().split('T').join(' ').split('.')[0];

    // 构造 G 列的时间数组
    const timeValues = Array(guilds.length).fill([formattedTime]);

    // 构造请求体
    const payload = {
        valueRanges: [
            {
                range: `${newSheetId}!A2:C${guilds.length + 1}`, // 使用 newSheetId，从第2行开始
                values: values
            },
            {
                range: `${newSheetId}!A1:G1`, // 标题行
                values: [["公会", "等级", "经验", "经验增长", "经验增长/小时", "追赶时间", "写入时间"]]
            },
            {
                range: `${newSheetId}!D2:D${guilds.length + 1}`, // 使用公式计算经验值差异
                values: diffFormulas
            },
            {
                range: `${newSheetId}!E2:E${guilds.length + 1}`, // 使用公式计算经验增长/小时
                values: growthRateFormulas
            },
            {
                range: `${newSheetId}!F2:F${guilds.length + 1}`,
                values: TimeFormulas
            },
             {
                range: `${newSheetId}!G2:G${guilds.length + 1}`, // 写入时间
                values: timeValues
            }
        ]
    };

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: post_url,
            headers: post_header,
            data: JSON.stringify(payload),
            onload: function(response) {
                console.log('Data posted successfully:', response.responseText);
            },
            onerror: function(error) {
                console.error('Error posting data:', error);
            }
        });
    } catch (error) {
        console.error('Error posting data:', error);
    }
    await delay(1000);
    replacefunction(newSheetId,guilds);
    await delay(1000);
    replacefunction2(newSheetId,guilds);
}
async function replacefunction(newSheetId,guilds) {
    const replace_url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${secureData.baseToken}/sheets/${newSheetId}/replace`;
    const post_header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tenant_access_token}`
    };

    // 构造请求体
    const payload = {
        find_condition: {
            range: `${newSheetId}!D2:E${guilds.length + 1}`,
            match_case: true,
            match_entire_cell: false,
            search_by_regex: false,
            include_formulas: false
        },
        find: "FERR",
        replacement: "IFERR"
    };

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: replace_url,
            headers: post_header,
            data: JSON.stringify(payload),
            onload: function(response) {
                console.log('Content replaced successfully:', response.responseText);
            },
            onerror: function(error) {
                console.error('Error replacing content:', error);
            }
        });
    } catch (error) {
        console.error('Error replacing content:', error);
    }
}


async function replacefunction2(newSheetId,guilds) {
    const replace_url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${secureData.baseToken}/sheets/${newSheetId}/replace`;
    const post_header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tenant_access_token}`
    };

    // 构造请求体
    const payload = {
        find_condition: {
            range: `${newSheetId}!F2:F${guilds.length + 1}`,
            match_case: true,
            match_entire_cell: false,
            search_by_regex: false,
            include_formulas: false
        },
        find: "FERR",
        replacement: "IFERR"
    };

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: replace_url,
            headers: post_header,
            data: JSON.stringify(payload),
            onload: function(response) {
                console.log('Content replaced successfully:', response.responseText);
            },
            onerror: function(error) {
                console.error('Error replacing content:', error);
            }
        });
    } catch (error) {
        console.error('Error replacing content:', error);
    }
}
async function getTenantToken() {
    const req_url = `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`;
    const payload = {
        app_id: secureData.app_id,
        app_secret: secureData.secret,
    };
    await post_api(req_url, payload);
}

// Utility function to make POST request
async function post_api(req_url, payload) {
    const payloadJson = JSON.stringify(payload);

    let post_header = {
        "Content-Type": "application/json",
    };

    // Send the POST request
    GM_xmlhttpRequest({
        method: "POST",
        url: req_url,
        headers: post_header,
        data: payloadJson,
        onload: function (response) {
            console.log(req_url);
            console.log("响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.tenant_access_token) {
                    tenant_access_token = responseData.tenant_access_token;
                    // Store tenant_access_token securely
                    console.log("获取的 tenant_access_token:", tenant_access_token);
                } else {
                    console.error("未能获取 tenant_access_token");
                }
            } catch (error) {
                console.error("解析响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("Error fetching data:", error);
        },
    });
}

function fetchAllRecords() {
    return new Promise((resolve, reject) => {
        const req_url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${secureData.baseToken}/tables/${secureData.tableID}/records`;
        const get_header = {
            Authorization: `Bearer ${tenant_access_token}`,
            "Content-Type": "application/json",
        };

        GM_xmlhttpRequest({
            method: "GET",
            url: req_url,
            headers: get_header,
            onload: function (response) {
                try {
                    Guild_Data = JSON.parse(response.responseText);
                    console.log("成功获取数据", Guild_Data);
                    resolve(Guild_Data);
                } catch (error) {
                    console.error("解析获取记录列表响应时出错:", error);
                    reject(error);
                }
            },
            onerror: function (error) {
                console.error("Error fetching records:", error);
                reject(error);
            },
        });
    });

}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


