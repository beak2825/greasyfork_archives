// ==UserScript==
// @name          🚀司机社论坛自动签到-懒人必备🚀
// @namespace     https://greasyfork.org/zh-CN/scripts/498242-%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87
// @version       1.4.6
// @description   在任何网页下完成sijishes论坛自动签到, 使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"
// @require       https://cdn.jsdelivr.net/npm/sweetalert2@9
// @author        皮皮鸡
// @match         http://*/*
// @match         https://*/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @license       MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/498242/%F0%9F%9A%80%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/498242/%F0%9F%9A%80%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87%F0%9F%9A%80.meta.js
// ==/UserScript==

/* global Swal */

const domains = [
    "https://sjs47.com",
    "https://sjs47.net",
    "https://sjslt.cc",
    "https://xsijishe.ink",
    "https://xsijishe.net"
];

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
        trySign(0);
    } else {
        Swal.fire({
            text: '由于脚本使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许域名"',
            confirmButtonText: '确定'
        }).then(() => {
            GM_setValue("notified", true);
            trySign(0);
        });
    }
};

const trySign = (index) => {
    if (index >= domains.length) {
        Swal.fire({
            icon: 'error',
            title: 'sijishes论坛自动签到',
            text: '所有域名均无法访问，请获取最新域名地址。',
            showCancelButton: true,
            cancelButtonText: '今日不再尝试签到',
            confirmButtonText: '重新尝试',
        }).then(result => {
            if (result.isConfirmed) {
                trySign(0); // 重新从第一个域名尝试
            } else {
                GM_setValue("ts", Date.now()); // 设置已处理日期，防止重复提示
                console.log('今日不再尝试签到');
            }
        });
        return;
    }

    // 获取 formhash
    GM_xmlhttpRequest({
        method: "GET",
        url: `${domains[index]}/plugin.php?id=k_misign:sign`,
        timeout: 10e3,
        onload: response => {
            const formhashMatch = response.responseText.match(/name="formhash" value="([a-zA-Z0-9]+)"/);
            if (formhashMatch) {
                const formhash = formhashMatch[1];
                sendRequest(index, formhash);
            } else {
                // 如果未找到 formhash，尝试下一个域名
                trySign(index + 1);
            }
        },
        onerror: function () {
            trySign(index + 1);
        }
    });
};

const sendRequest = (index, formhash) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: `${domains[index]}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty`,
        timeout: 10e3,
        onload: response => {
            response = response.responseText;
            if (response.match("签到成功") !== null) {
                Swal.fire({
                    icon: 'success',
                    title: 'sijishes论坛自动签到',
                    html: `<strong>成功!</strong>`
                });
                GM_setValue("ts", Date.now());
            } else if (response.match("今日已签") !== null) {
                Swal.fire({
                    icon: 'warning',
                    title: 'sijishes论坛自动签到',
                    text: '您已经签到过了!'
                });
                GM_setValue("ts", Date.now());
            } else if (response.match("请先登录") !== null) {
                Swal.fire({
                    icon: 'error',
                    title: 'sijishes论坛自动签到',
                    text: '您需要先登录才能继续本操作!'
                });
            } else if (response.match("Discuz! System Error") !== null) {
                Swal.fire({
                    icon: 'error',
                    title: 'sijishes论坛自动签到',
                    text: '请求包含非法字符，已被系统拒绝。'
                });
            } else {
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: 'sijishes论坛自动签到',
                    text: '未知返回信息❗ 请打开控制台查看详情。',
                    cancelButtonText: '取消',
                    confirmButtonText: '手动打开',
                    focusConfirm: true,
                    showCancelButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(res => {
                    if (res.isConfirmed) {
                        GM_openInTab(`${domains[index]}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty`, {
                            loadInBackground: true
                        });
                    }
                    Swal.fire({
                        icon: 'info',
                        title: 'sijishes论坛自动签到',
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
                        } else {
                            trySign(index + 1);
                        }
                    });
                });
            }
        },
        onerror: function () {
            trySign(index + 1);
        }
    });
};

window.onload = () => {
    if (!window.location.href.match("sijishes.com") && (!GM_getValue("ts") || checkNewDay(GM_getValue("ts")))) {
        sign();
    }
};
