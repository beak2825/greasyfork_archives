// ==UserScript==
// @name         24.2.22旺销王订单计时器
// @version      2.2
// @description  旺销王订单计时器
// @author       menkeng
// @match        https://www.wxwerp.com/erp/order/*
// @match        https://2.wxwerp.com/erp/order/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @namespace    https://greasyfork.org/users/935835
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @downloadURL https://update.greasyfork.org/scripts/488021/24222%E6%97%BA%E9%94%80%E7%8E%8B%E8%AE%A2%E5%8D%95%E8%AE%A1%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/488021/24222%E6%97%BA%E9%94%80%E7%8E%8B%E8%AE%A2%E5%8D%95%E8%AE%A1%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

window.onload = function () {
    setInterval(() => {
        checkUrl();
    }, 2000);
}
list = ['俄罗斯', '哈萨克斯坦', '白俄罗斯', '亚美尼亚', '阿塞拜疆', '格鲁吉亚', '吉尔吉斯斯坦', '摩尔多瓦', '塔吉克斯坦', '土库曼斯坦', '乌兹别克斯坦']
function checkUrl() {
    var paymentRegex = /付款：\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/;
    var rows = document.querySelectorAll("table.items.unlocked tr.row");
    rows.forEach(function (element) {
        var td = element.querySelectorAll("td")[4];
        var country = element.querySelectorAll("td")[3].textContent;
        var includesCountry = list.some(item => country.includes(item))
        // console.log("是否包含国家: " + includesCountry);
        var textWithLineBreaks = td.textContent.replace(/\s+/g, '\n');
        var paymentMatch = textWithLineBreaks.match(paymentRegex);
        if (paymentMatch) {
            var paymentTime = paymentMatch[1];
            var paymentDate = new Date(paymentTime);
            var currentDate = new Date();
            var timeDiff = currentDate - paymentDate;
            var hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            var color = '';
            if (hoursDiff < 10) {
                color = 'orange';
            } else if (hoursDiff < 18) {
                color = 'orange';
            } else {
                color = 'red';
            }
            var dom = element.querySelectorAll("td")[4].querySelector(".p.pitem");
            var existingTimecal = dom.querySelector("#timecal");
            if (existingTimecal) {
                existingTimecal.remove();
            }
            var existingTimecal2 = dom.querySelector("#timecal2");
            if (existingTimecal2) {
                existingTimecal2.remove();
            }
            var existingTimecal3 = dom.querySelector("#timecal3");
            if (existingTimecal3) {
                existingTimecal3.remove();
            }
            var newElement1 = document.createElement("div");
            newElement1.id = "timecal";
            newElement1.style.color = color;
            newElement1.style.fontSize = "20px"
            if (hoursDiff > 48) {
                newElement1.textContent = "已经罚款已经罚款已经罚款已经罚款";
            } else {
                newElement1.textContent = "距离付款已 " + hoursDiff + "小时";
            }
            dom.appendChild(newElement1);
            if (hoursDiff < 48) {
                var remainingHours = 48 - hoursDiff;
                var newElement2 = document.createElement("div");
                newElement2.id = "timecal2";
                newElement2.style.color = color;
                newElement2.style.fontSize = "20px"
                newElement2.textContent = "距离发货还剩 " + remainingHours + "小时";
                dom.appendChild(newElement2);
            }
            if (includesCountry) {
                var newElement3 = document.createElement("div");
                newElement3.id = "timecal3";
                newElement3.style.color = color;
                newElement3.style.fontSize = "20px"
                newElement3.textContent = "该国家不在48小时考核内";
                dom.appendChild(newElement3);
            }
            create_buttons()
        } else {
            console.log("未找到付款时间");
        }
    });
}



var app_id = "cli_a552fcd44272d00b"
var app_secret = "3ngFgRHTqfawejIx5QdekGDMkNufIXZ6"
var tenantAccessToken = ""
var spreadsheetId = "Kdv0slsCVhK5QGtMhyUcVhIyn3d"
var sheetId_taobao = "2CuMer!"
var sheetId_changjia = "3LaMxN!"
var sheetId_48 = "0RuUss!"

function create_buttons() {
    if ($(".copyButton").length > 0) {
        return
    }
    $(".items.unlocked > tbody > tr.row").each(function () {
        var thirdTd = $(this).find("td:eq(3)");
        var copyButton = $("<div>");
        copyButton.text("一键上传");
        copyButton.addClass("copyButton");
        copyButton.css({
            "cursor": "pointer",
            "padding": "5px 10px",
            "background-color": "lightblue",
            "border-radius": "5px",
            "margin-top": "10px"
        });
        copyButton.on("click", function () {
            var tr = $(this).closest("tr");
            var id = tr.find(".btncopyorderid").text().replace(/[\r\n\s]+/g, "");
            var time = tr.find("#time_cnt div:contains('付款')").text().replace("付款：", "")
            var price = tr.find("div.item.money").eq(0).text().replace(/[\r\n\s]+/g, "").replace("USD", "");
            var shop = tr.next().find("li[title^='店铺名称']").text().replace(/[\r\n\s]+/g, "");
            var ship = tr.next().find("li.memo span").eq(0).text().replace(/[\r\n\s]+/g, "");
            var country = tr.find("#buyer_cnt div:eq(2)").text().replace(/[\r\n\s]+/g, "");
            var shipid = tr.next().find(".track_no.list_track_no").text().replace(/[\r\n\s]+/g, "");
            var datatime = getCurrentDateTime();

            // 创建确认对话框
            var confirmed = confirm("确认上传至在线表格");
            if (confirmed) {
                var data = [[datatime, shop, time, id, price, country, ship, shipid]];
                processData(data);
            } else {
                console.log("用户取消了上传。");
            }
        });
        if ($(this).find(".copyButton").length === 0) {
            thirdTd.append(copyButton);
        }
    });
}

async function processData(data) {
    // let tenantAccessToken = await get_tenant_access_token();
    try {
        let tenantAccessToken = await get_tenant_access_token();
        await sheet_append(sheetId_48 + "B1:I1", data, tenantAccessToken);
    } catch (error) {
        console.error("写入表格错误:", error);
    }
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
                    // console.log("获取 tenantAccessToken 成功:", tenantAccessToken);
                    resolve(responseData.tenant_access_token); 
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

// 追加数据
async function sheet_append(range, data, tenantAccessToken) {
    return new Promise((resolve, reject) => {
        // console.log(`写入范围: ${range}，数据: ${JSON.stringify(data)}`);
        var sheet_append_url = "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" + spreadsheetId + "/values_append"
        var headers = {
            Authorization: `Bearer ${tenantAccessToken}`,
            "Content-Type": "application/json; charset=utf-8",
        };;
        var body = JSON.stringify({
            valueRange: {
                range: range,
                values: data,
            },
        });
        GM_xmlhttpRequest({
            method: "POST",
            url: sheet_append_url,
            headers: headers,
            data: body,
            onload: function (response) {
                console.log(":", response.responseText);
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

