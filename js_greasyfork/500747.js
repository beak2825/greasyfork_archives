// ==UserScript==
// @name         [银河奶牛]数据库操作测试
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  测试操作飞书表格数据
// @author       Trutn_Light
// @license      Trutn_Light
// @match        https://www.milkywayidle.com/game?characterId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500747/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%95%B0%E6%8D%AE%E5%BA%93%E6%93%8D%E4%BD%9C%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500747/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%95%B0%E6%8D%AE%E5%BA%93%E6%93%8D%E4%BD%9C%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==


'use strict';
const secureData = {
    app_id: "cli_a60588a069f0100b",
    secret: "iX1AKQrtNzGHL1PG9SqjLgmKhRkXtz3z",
    baseToken: "LrVnbwU4aagxWnsGYHtcImEZnEc",
    tableID: "tblcMXWSffVJWLd3",
};
let tenant_access_token = "";
let Guild_Data = {};
let storedData = {};
const updataDealy = 24*60*60*1000;

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

async function handleMessage(message) {
    try {
        let obj = JSON.parse(message);
        let timeDifference = null;
        let newUpdatedAt = null;
        if (obj && obj.type === "guild_updated") {
            const Guild_ID = obj.guild.id;

            await fetchAllRecords();
            if (Guild_Data.code !== 0) {
                console.error("从表格获取数据出错,code:", Guild_Data.code);
                return;
            }
            const guildData = Guild_Data.data.items.find(item => item.fields["公会ID"] == Guild_ID);
            if (guildData && guildData.fields && guildData.fields["旧·更新时间"]) {
                storedData = guildData.fields;
                const oldUpdatedAt = new Date(storedData["旧·更新时间"]);
                newUpdatedAt = new Date(obj.guild.updatedAt);

                timeDifference = newUpdatedAt - oldUpdatedAt;
                console.log("timeDifference",timeDifference >= updataDealy)
                if (timeDifference >= updataDealy) {
                    storedData = {
                        "公会ID": Guild_ID,
                        "公会名称": obj.guild.name,
                        "旧·公会总经验": storedData["新·公会总经验"],
                        "旧·公会等级": storedData["新·公会等级"],
                        "旧·更新时间": storedData["新·更新时间"],
                        "新·公会总经验": obj.guild.experience,
                        "新·公会等级": obj.guild.level,
                        "新·更新时间": obj.guild.updatedAt
                    };
                } else {
                    // 仅更新新数据
                    storedData = {
                        "公会ID": Guild_ID,
                        "公会名称": obj.guild.name,
                        "新·公会总经验": obj.guild.experience,
                        "新·公会等级": obj.guild.level,
                        "新·更新时间": obj.guild.updatedAt,
                        "旧·公会总经验": storedData["旧·公会总经验"],
                        "旧·公会等级": storedData["旧·公会等级"],
                        "旧·更新时间": storedData["旧·更新时间"],
                        "更新时间差值": ((newUpdatedAt - new Date(storedData["旧·更新时间"])) / 1000),
                        "公会总经验差值": storedData["新·公会总经验"]-storedData["旧·公会总经验"],
                    };
                }
                const record_id = guildData.record_id
                await updateRecord(storedData,record_id)
            } else {
                storedData = {
                    "公会ID": Guild_ID,
                    "公会名称": obj.guild.name,
                    "旧·公会总经验": obj.guild.experience,
                    "旧·公会等级": obj.guild.level,
                    "旧·更新时间": obj.guild.updatedAt
                };
                await RecordInfo(storedData)
            }
            console.log("目前的数据", storedData);
        }
    } catch (error) {
        console.error("Error processing message:", error);

    }
    return message;
}


async function updateRecord(info,record_id) {

    const req_url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${secureData.baseToken}/tables/${secureData.tableID}/records/${record_id}`;
    const post_header = {
        Authorization: `Bearer ${tenant_access_token}`,
        "Content-Type": "application/json",
    };

    // Build record payload
    const payload = {
        fields: {
            公会ID: info["公会ID"] ? info["公会ID"].toString() : undefined,
            公会名称: info["公会名称"] ? info["公会名称"].toString() : undefined,
            新·更新时间: info["新·更新时间"] ? info["新·更新时间"].toString() : undefined,
            旧·更新时间: info["旧·更新时间"] ? info["旧·更新时间"].toString() : undefined,
            新·公会等级: info["新·公会等级"] ? info["新·公会等级"].toString() : undefined,
            旧·公会等级: info["旧·公会等级"] ? info["旧·公会等级"].toString() : undefined,
            新·公会总经验: info["新·公会总经验"] ? info["新·公会总经验"].toString() : undefined,
            旧·公会总经验: info["旧·公会总经验"] ? info["旧·公会总经验"].toString() : undefined,
            更新时间差值: info["更新时间差值"] ? info["更新时间差值"].toString() : undefined,
            公会总经验差值: info["公会总经验差值"] ? info["公会总经验差值"].toString() : undefined,
        },
    };
    console.log("payload",payload)
    // Send POST request to record information
    GM_xmlhttpRequest({
        method: "PUT",
        url: req_url,
        headers: post_header,
        data: JSON.stringify(payload),
        onload: function (response) {
            console.log("记录信息响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.code === 0) {
                    console.log("成功更新信息:", responseData.data);
                } else {
                    console.error("记录信息失败或数据格式不正确");
                }
            } catch (error) {
                console.error("解析记录信息响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("Error recording information:", error);
        },
    });
}

async function RecordInfo(info) {

    const req_url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${secureData.baseToken}/tables/${secureData.tableID}/records`;
    const post_header = {
        Authorization: `Bearer ${tenant_access_token}`,
        "Content-Type": "application/json",
    };

    // Build record payload
    const payload = {
        fields: {
            公会ID: info["公会ID"] ? info["公会ID"].toString() : undefined,
            公会名称: info["公会名称"] ? info["公会名称"].toString() : undefined,
            新·更新时间: info["新·更新时间"] ? info["新·更新时间"].toString() : undefined,
            旧·更新时间: info["旧·更新时间"] ? info["旧·更新时间"].toString() : undefined,
            新·公会等级: info["新·公会等级"] ? info["新·公会等级"].toString() : undefined,
            旧·公会等级: info["旧·公会等级"] ? info["旧·公会等级"].toString() : undefined,
            新·公会总经验: info["新·公会总经验"] ? info["新·公会总经验"].toString() : undefined,
            旧·公会总经验: info["旧·公会总经验"] ? info["旧·公会总经验"].toString() : undefined,
        },
    };
    console.log("payload",payload)
    // Send POST request to record information
    GM_xmlhttpRequest({
        method: "POST",
        url: req_url,
        headers: post_header,
        data: JSON.stringify(payload),
        onload: function (response) {
            console.log("记录信息响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.code === 0) {
                    console.log("成功更新信息:", responseData.data);
                } else {
                    console.error("记录信息失败或数据格式不正确");
                }
            } catch (error) {
                console.error("解析记录信息响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("Error recording information:", error);
        },
    });
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





getTenantToken();