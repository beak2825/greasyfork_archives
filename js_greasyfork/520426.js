// ==UserScript==
// @name         [银河奶牛]公会数据上传·重制版
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  登录时将公会所有成员的数据上传到飞书文档
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/game?characterId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/520426/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%85%AC%E4%BC%9A%E6%95%B0%E6%8D%AE%E4%B8%8A%E4%BC%A0%C2%B7%E9%87%8D%E5%88%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520426/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%85%AC%E4%BC%9A%E6%95%B0%E6%8D%AE%E4%B8%8A%E4%BC%A0%C2%B7%E9%87%8D%E5%88%B6%E7%89%88.meta.js
// ==/UserScript==


'use strict';
const secureData = {
    app_id: "cli_a60588a069f0100b",
    secret: "KuseXxV5TSRt8NZynnRb7to71ymWQ7BZ",
    baseToken: "G23vsnQpKhVlxmtnBqAcfanwn1c",
    tableID: "",
};

const GuildTextTranslation = {
    "ironcow": "铁牛",
    "standard": "标准",
    "leader":"会长",
    "general":"将军",
    "member":"成员",
    "officer":"官员",
};

const actionTypeTranslations = {
    milking: "挤奶",
    foraging: "采集",
    woodcutting: "伐木",
    cheesesmithing: "锻造",
    crafting: "制作",
    tailoring: "裁缝",
    cooking: "烹饪",
    brewing: "冲泡",
    enhancing: "强化",
    combat: "战斗",
    alchemy: "炼金"
}
let lastUploadTimestamps = GM_getValue('lastUploadTimestamps', {});

let tenant_access_token = "";
let storedData = {};
let guildName

let newSheetId = null;
let SheetId = null;

const defaultSettings = {
    showToastEnabled: true, // 默认启用 Toast 提示
};

let settings = GM_getValue('userSettings', defaultSettings);

const toastQueues = Array.from({ length: 5 }, () => []);
const maxVisibleToasts = Math.floor(window.innerHeight / 2 / 50);
let isToastVisible = Array(5).fill(false);

function showToast(message, duration = 3000) {
    if (settings.showToastEnabled) {
        const queueIndex = toastQueues.findIndex(queue => queue.length < maxVisibleToasts);
        if (queueIndex === -1) return;

        toastQueues[queueIndex].push({ message, duration });
        displayNextToast(queueIndex);
    }
}

function displayNextToast(queueIndex) {
    if (isToastVisible[queueIndex] || toastQueues[queueIndex].length === 0) return;

    const { message, duration } = toastQueues[queueIndex].shift();
    isToastVisible[queueIndex] = true;

    const toast = createToastElement(message, queueIndex);
    toast.style.opacity = '0';

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
            isToastVisible[queueIndex] = false;
            displayNextToast(queueIndex);
        }, 500);
    }, duration);
}

function createToastElement(message, queueIndex) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = `${20 + queueIndex * 60}px`;
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    toast.style.textAlign = 'center';
    toast.style.transition = 'opacity 0.5s';
    toast.textContent = message;
    document.body.appendChild(toast);
    return toast;
}

function shouldUpload(guildID) {
    const currentTime = Date.now();
    const twelveHoursInMs = 12 * 60 * 60 * 1000; // 12小时的毫秒数

    const lastUploadTimestamp = lastUploadTimestamps[guildID] || 0;
    return (currentTime - lastUploadTimestamp) > twelveHoursInMs;
}

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
        handleMessage(message);
        return message;
    }
}

hookWS();


function constructRangeString(sheetId, ranges) {
    return ranges.map(range => `${sheetId}!${range}`).join(',');
}

function fetchSpreadsheetData(sheetId) {
    const ranges = ["C2:C", "H2:K"];
    const rangeString = constructRangeString(sheetId, ranges);
    const req_url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${secureData.baseToken}/values_batch_get?ranges=${rangeString}`;
    const get_header = {
        Authorization: `Bearer ${tenant_access_token}`,
        "Content-Type": "application/json; charset=utf-8",
    };

    GM_xmlhttpRequest({
        method: "GET",
        url: req_url,
        headers: get_header,
        onload: function (response) {
            try {
                const data = parseSpreadsheetData(JSON.parse(response.responseText));
                //console.log("成功从表格获取数据", data);
                updateStoredData(storedData,data,sheetId)

            } catch (error) {
                console.error("解析获取数据响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("获取数据时出错:", error);
        },
    });
}



function parseSpreadsheetData(data) {
    const valueRanges = data.data.valueRanges;
    const namesArray = valueRanges[0].values;
    const dataArray = valueRanges[1].values;

    let resultDict = {};

    for (let i = 0; i < namesArray.length; i++) {
        const playerName = namesArray[i][0];
        const playerData = dataArray[i];
        resultDict[playerName] = {
            "经验值·旧": playerData[0],
            "经验值·新": playerData[1],
            "更新时间·旧": playerData[2],
            "更新时间·新": playerData[3]
        };
    }

    return resultDict;
}


async function getSheetIdByGuildName(Guild_Name) {
    const query_url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${secureData.baseToken}/sheets/query`;
    const post_header_query = {
        Authorization: `Bearer ${tenant_access_token}`,
    };

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: query_url,
            headers: post_header_query,
            onload: function (response) {
                //console.log('Raw response:', response.responseText);

                try {
                    const data = JSON.parse(response.responseText);
                    // 查找 title = Guild_Name 的 sheet
                    const sheet = data.data.sheets.find(sheet => sheet.title === Guild_Name);
                    if (sheet) {
                        //console.log(`已有列表，正在更新。`);
                        fetchSpreadsheetData(sheet.sheet_id);
                    } else {
                        //console.log('正在创建新列表。');
                        AddNewSheet(Guild_Name);
                    }
                    resolve();
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                    reject(jsonError);
                }
            },
            onerror: function (error) {
                console.error('Error fetching sheets:', error);
                reject(error);
            }
        });
    });
}



// 定义 AddNewSheet 函数
async function AddNewSheet(Guild_Name) {
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
                        title: Guild_Name,
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
                //console.log('Raw response:', response.responseText);
                try {
                    const result = JSON.parse(response.responseText);

                    if (result.code === 0) {
                        newSheetId = result.data.replies[0].addSheet.properties.sheetId;
                        postGuildData(storedData,newSheetId);
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

function updateStoredData(storedData, dataDict, sheetId) {
    const SIX_HOUR_MS = 6 * 60 * 60 * 1000; // 更新间隔
    const HALF_HOUR_MS = 500 * 60 * 60;
    storedData.forEach(item => {
        const name = item["名字"];
        const id = item["玩家ID"];
        const data = dataDict[name];

        item["经验值·新"] = "";
        item["更新时间·新"] = "";
        item["时间差（秒）"] = "";
        item["经验差"] = "";
        item["每天经验值"] = "";
        item["总经验排名"] = "";
        item["今日经验排名"] = "";

        if (data) {
            try {
                const oldUpdateTimeDict = new Date(data["更新时间·旧"]);
                const newUpdateTimeStored = new Date(item["更新时间·旧"]);
                const timeDifference = newUpdateTimeStored - oldUpdateTimeDict;
                if (timeDifference > SIX_HOUR_MS && timeDifference < (SIX_HOUR_MS + HALF_HOUR_MS)) {
                    //showToast(`${name} 的数据上传失败，请在${((HALF_HOUR_MS + SIX_HOUR_MS - timeDifference) / 1000 / 60).toFixed(1)}分钟后再试！`);
                    item["经验值·新"] = data["经验值·新"];
                    item["经验值·旧"] = data["经验值·旧"];
                    item["更新时间·新"] = new Date(data["更新时间·新"]);
                    item["更新时间·旧"] = new Date(data["更新时间·旧"]);

                    const difference_time = (item["更新时间·新"] - item["更新时间·旧"]);
                    item["时间差（秒）"] = (difference_time / 1000).toFixed(2);
                    item["经验差"] = (parseFloat(data["经验值·新"]) - parseFloat(data["经验值·旧"])).toFixed(2);

                    const dayDifference = difference_time / (1000 * 60 * 60 * 24); // 转换为天
                    item["每天经验值"] = dayDifference > 0 ? (parseFloat(item["经验差"]) / dayDifference).toFixed(2) : '0.00';

                    return; // 不更新数据
                }
                const oldExpStored = parseFloat(item["经验值·旧"]);
                const oldExpDict = parseFloat(data["经验值·旧"]);
                const expDifference = oldExpStored - oldExpDict;
                const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // 转换为天
                const xpPerDay = dayDifference > 0 ? expDifference / dayDifference : 0;

                if (timeDifference > SIX_HOUR_MS) {
                    item["经验值·新"] = item["经验值·旧"];
                    item["更新时间·新"] = item["更新时间·旧"];
                    item["经验值·旧"] = data["经验值·新"];
                    item["更新时间·旧"] = data["更新时间·新"];
                } else {
                    item["经验值·新"] = item["经验值·旧"];
                    item["更新时间·新"] = item["更新时间·旧"];
                    item["经验值·旧"] = data["经验值·旧"];
                    item["更新时间·旧"] = data["更新时间·旧"];
                }

                item["时间差（秒）"] = (timeDifference / 1000).toFixed(2);
                item["经验差"] = expDifference.toFixed(2);
                item["每天经验值"] = xpPerDay.toFixed(2);

            } catch (error) {
                console.error(`数据错误，来自： ${name}:`, error);
            }
        } else {
            console.log(`原表格中没有: ${name}`);
        }
    });

    const sortedByTotalExp = [...storedData].sort((a, b) => parseFloat(b["经验值·新"]) - parseFloat(a["经验值·新"]));
    const sortedByXpPerDay = [...storedData].sort((a, b) => parseFloat(b["每天经验值"]) - parseFloat(a["每天经验值"]));

    sortedByTotalExp.forEach((item, index) => {
        item["总经验排名"] = index + 1;
    });

    sortedByXpPerDay.forEach((item, index) => {
        item["今日经验排名"] = index + 1;
    });


    postGuildData(storedData, sheetId);
    //console.log(storedData);
}


async function handleMessage(message) {
    try {
        let obj = JSON.parse(message);
        if (
            obj &&
            obj.type === "init_character_data" &&
            obj.guild &&
            obj.guildCharacterMap &&
            obj.guildSharableCharacterMap &&
            Object.keys(obj.guildCharacterMap).length > 0 &&
            Object.keys(obj.guildSharableCharacterMap).length > 0
        ) {
            if (!shouldUpload(obj.guild.id)) {
                showToast('距离上次上传不足12小时，跳过上传', 3000);
                return;
            }

            guildName = obj.guild.name;
            storedData = formatGuildData(obj);
            getTenantToken();
        }
    } catch (error) {
        console.error("Error processing message:", error);
    }
    return message;
}
function formatGuildData(data) {
    const today = new Date().toISOString();
    const guildName = data.guild.name;
    const guildID = data.guild.id;
    const guildCharacterMap = data.guildCharacterMap;
    const guildSharableCharacterMap = data.guildSharableCharacterMap;

    const formattedData = Object.keys(guildCharacterMap)
    .filter(characterID => guildCharacterMap[characterID].role) // 过滤掉 role 为空的角色
    .map(characterID => {
        const character = guildCharacterMap[characterID];
        const sharableCharacter = guildSharableCharacterMap[characterID];

        return {
            名字: sharableCharacter.name,
            玩家ID: character.characterID,
            公会名: guildName,
            公会ID: guildID,
            职位: GuildTextTranslation[character.role] || character.role,
            游戏模式: GuildTextTranslation[sharableCharacter.gameMode] || sharableCharacter.gameMode,
            经验值·旧: character.guildExperience.toFixed(2),
            在线状态: sharableCharacter.isOnline ? "在线" : "离线",
            当前行动: sharableCharacter.actionType === ""
            ? "正在闲置"
            : actionTypeTranslations[sharableCharacter.actionType.split("/").pop()] || sharableCharacter.actionType,
            更新时间·旧: today,
            更新时间·新: "",
            经验值·新: "",
        };
    });

    return formattedData;
}

// 示例：将公会信息发送到 Feishu API
async function postGuildData(data, newSheetId) {
    const post_url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${secureData.baseToken}/values_batch_update`;
    const post_header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tenant_access_token}`
    };

    const values = data.map(guild => [
        guild["公会ID"] || "",
        guild["公会名"] || "",
        guild["名字"] || "",
        guild["职位"] || "",
        guild["游戏模式"] || "",
        guild["在线状态"] || "",
        guild["当前行动"] || "",
        guild["经验值·旧"] || "",
        guild["经验值·新"] || "",
        guild["更新时间·旧"] || "",
        guild["更新时间·新"] || "",
        guild["时间差（秒）"] || "",
        guild["经验差"] || "",
        guild["每天经验值"] || "",
        guild["总经验排名"] || "",
        guild["今日经验排名"] || "",
        guild["玩家ID"] || "",
    ]);

    const payload = {
        valueRanges: [
            {
                range: `${newSheetId}!A2:Q${values.length + 1}`,
                values: values
            },
            {
                range: `${newSheetId}!A1:Q1`,
                values: [["公会ID","公会名","名字","职位","游戏模式","在线状态", "当前行动","经验值·旧","经验值·新","更新时间·旧","更新时间·新","时间差（秒）","经验差","每天经验值","总经验排名","今日经验排名","玩家ID"]]
            },
        ]
    };

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: post_url,
            headers: post_header,
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status === 200) {
                    showToast('公会数据上传成功！', 1000);
                    lastUploadTimestamps[data[0].公会ID] = Date.now();
                    GM_setValue('lastUploadTimestamps', lastUploadTimestamps);
                } else {
                    console.error('数据更新失败:', response.statusText);
                    showToast('公会数据上传失败，请稍后再试！', 1000);
                }
            },
            onerror: function(error) {
                console.error('Error posting data:', error);
                showToast('网络错误，请检查连接！', 1000);
            }
        });
    } catch (error) {
        console.error('Error posting data:', error);
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
            //console.log(req_url);
            //console.log("响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.tenant_access_token) {
                    tenant_access_token = responseData.tenant_access_token;
                    //console.log("获取的 tenant_access_token:", tenant_access_token);
                    getSheetIdByGuildName(guildName)
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

let menuID;

function updateMenu() {
    if (menuID) GM_unregisterMenuCommand(menuID); // 注销之前的菜单
    menuID = GM_registerMenuCommand(`${settings.showToastEnabled ? '✅' : '❌'} 上传提示`, function() {
        settings.showToastEnabled = !settings.showToastEnabled;
        GM_setValue('userSettings', settings);
        updateMenu();
        showToast(`上传提示已${settings.showToastEnabled ? '开启' : '关闭'}`,1000);
    });

    // 添加手动重置时间戳
    GM_registerMenuCommand('🔄 强制上传', function() {
        lastUploadTimestamps = {}; // 重置所有公会的时间戳
        GM_setValue('lastUploadTimestamps', lastUploadTimestamps);
        showToast('所有公会的时间戳已重置，下次将强制上传', 1000);
    });
}

updateMenu();