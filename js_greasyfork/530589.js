// ==UserScript==
// @name         🔥任何网页下完成🔥52破解论坛&吾爱破解论坛自动签到
// @namespace    https://greasyfork.org/zh-CN/users/690532-xht1810
// @version      1.0.1.0
// @description  在任何网页下完成吾爱破解论坛签到, 使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @author       雷锋
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/530589/%F0%9F%94%A5%E4%BB%BB%E4%BD%95%E7%BD%91%E9%A1%B5%E4%B8%8B%E5%AE%8C%E6%88%90%F0%9F%94%A552%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530589/%F0%9F%94%A5%E4%BB%BB%E4%BD%95%E7%BD%91%E9%A1%B5%E4%B8%8B%E5%AE%8C%E6%88%90%F0%9F%94%A552%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/* global Swal */
const url = "https://www.52pojie.cn/home.php?mod=task&do=apply&id=2"; // https://www.52pojie.cn/home.php?mod=task&do=draw&id=2

const checkNewDay = (ts) => {
    const t = new Date(ts);
    t.setMinutes(t.getMinutes());
    t.setHours(0, 0, 0, 0);
    const d = new Date();
    d.setMinutes(t.getMinutes());
    return (d - t > 86400e3);
};

const sign = () => {
    if (GM_getValue("notified")) {
        sendRequest();
    } else {
        Swal.fire(`由于脚本使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"`).then(() => {
            GM_setValue("notified", true);
            sendRequest();
        });
    }
};

const sendRequest = () => {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: 10e3,
        onload: response => {
            response = response.response;
            if (response.match("任务已完成") !== null) {
                Swal.fire({
                    icon: 'success',
                    title: '52破解论坛自动签到',
                    html: `<strong>成功!</strong>`
                });
                GM_setValue("ts", Date.now());
            } else if (response.match("您已申请过此任务") !== null) {
                Swal.fire({
                    icon: 'warning',
                    title: '52破解论坛自动签到',
                    text: '您已经签到过了!'
                });
                GM_setValue("ts", Date.now());
            } else if (response.match("您需要先登录才能继续本操作") !== null) {
                Swal.fire({
                    icon: 'error',
                    title: '52破解论坛自动签到',
                    text: '您需要先登录才能继续本操作!'
                });
            } else {
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: '52破解论坛自动签到',
                    text: '未知返回信息❗ 请打开控制台查看详情。',
                    cancelButtonText: '取消',
                    confirmButtonText: '手动打开',
                    focusConfirm: true,
                    showCancelButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(res => {
                    if (res.isConfirmed) {
                        GM_openInTab(url, {
                            loadInBackground: true
                        });
                    }
                    Swal.fire({
                        icon: 'info',
                        title: '52破解论坛自动签到',
                        text: '今日是否不再尝试签到?',
                        cancelButtonText: '否',
                        confirmButtonText: '是',
                        focusConfirm: true,
                        showCancelButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(res => {
                        if (res.isConfirmed) {
                            GM_setValue("ts", Date.now());
                        }
                    });
                });
            }
        },
        onerror: function () {
            Swal.fire({
                icon: 'error',
                title: '52破解论坛自动签到',
                text: '请求签到时发生错误, 请检查网络或代理, 防火墙等',
            });
        }
    });
};

window.onload = () => {
    if (!window.location.href.match("52pojie.cn") && (!GM_getValue("ts") || checkNewDay(GM_getValue("ts")))) {
        sign();
    }
};