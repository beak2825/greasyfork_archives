// ==UserScript==
// @name         洛谷自动签到
// @namespace    https://greasyfork.org/zh-CN/users/412790
// @version      1.0.0.2
// @description  在任何网页下完成洛谷签到
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @author       Permission
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440624/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/440624/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/* global Swal */
const tz_offset = new Date().getTimezoneOffset() + 480;

const checkNewDay = (ts) => {
    // 检查是否为新的一天，以UTC+8为准
    const t = new Date(ts);
    t.setMinutes(t.getMinutes() + tz_offset);
    t.setHours(0, 0, 0, 0);
    const d = new Date();
    d.setMinutes(t.getMinutes() + tz_offset);
    return (d - t > 86400e3);
};

const sign = () => {
    if (GM_getValue("notified")) {
        sendRequest();
    }
    else {
        Swal.fire(`由于脚本使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"`).then(() => {
            GM_setValue("notified", true);
            sendRequest();
        })
    }
};

const sendRequest = () => {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.luogu.com.cn/index/ajax_punch",
        timeout: 10e3,
        onload: function (response) {
            response = JSON.parse(response.response);
            console.log(response);
            switch (parseInt(response.code)) {
                case 200: {
                    Swal.fire({
                        icon: 'success',
                        title: '洛谷自动签到',
                        text: '成功!'
                    });
                    GM_setValue("ts", Date.now());
                    break;
                }
                case 201: {
                    Swal.fire({
                        icon: 'error',
                        title: '洛谷自动签到',
                        html: `签到失败, 原因: <strong>${response.message}</strong>`
                    });
                    if (response.message.indexOf("已经打过卡") > -1) {
                        GM_setValue("ts", Date.now());
                    }
                    break;
                }
                default: {
                    Swal.fire({
                        icon: 'error',
                        title: '洛谷自动签到',
                        text: '未知错误, 打开控制台查看详情',
                    });
                    console.log(response);
                }
            }
        },
        onerror: function () {
            Swal.fire({
                icon: 'error',
                title: '洛谷自动签到',
                text: '请求签到时发生错误, 请检查网络或代理, 防火墙等',
            });
        }
    });
};

window.onload = () => {
    if (!GM_getValue("ts") || checkNewDay(GM_getValue("ts"))) {
        sign();
    }
};