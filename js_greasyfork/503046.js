// ==UserScript==
// @name         显示网站ip
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  在所有网站右下角显示ip，增加鼠标穿透，通过谷歌dns查询ip,兼容ipv4，ipv6，通过百度查询归属地，保存查询成功的ip与归属地，在最新查询失败时获取，在右下角显示ipv4/ipv6与归属地
// @author       Rakiwine
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503046/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%AB%99ip.user.js
// @updateURL https://update.greasyfork.org/scripts/503046/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%AB%99ip.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let button_style = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',// 黑色半透明
        color: 'white',// 文字颜色
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', // 增加文字阴影，提升可读性
        border: 'none',// 去掉边框
        borderRadius: '16px',// 圆角
        height: '50px',// 高度
        padding: '0 20px',// 左右内边距
        fontSize: '16px',// 字体大小
        cursor: 'pointer',// 鼠标悬停时显示手型光标
        outline: 'none',// 去掉焦点时的轮廓
        position: 'fixed',// 固定定位
        bottom: '10px',// 距离顶部 10px
        right: '10px',// 距离右边 10px
        zIndex: '1000',// 确保按钮在最上层
        pointerEvents: 'none',// 点击穿透
    }

    // 显示加载提示
    let buttonId = "ip_button_id_" + generateRandomID(10);
    let ip_button = document.createElement('button');
    ip_button.id = buttonId; // 设置按钮的 ID 为唯一标识符
    Object.assign(ip_button.style, button_style);
    ip_button.textContent = '加载中...';
    document.body.appendChild(ip_button);

    // 生成随机ID
    function generateRandomID(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_$';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    // 跨域 获取 IP 地址
    function getIP(domain) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://dns.google/resolve?name=${domain}`,
                onload: function (response) {
                    const data = JSON.parse(response.responseText);

                    if (data.Comment) {
                        resolve(data.Comment)
                    } else {
                        reject("失败72");
                    }
                },
                onerror: function (error) {
                    reject("失败76");
                }
            });
        });
    }

    // 跨域 获取归属地
    function getLocation(ip, ipv6) {
        return new Promise((resolve, reject) => {
            ip = encodeURIComponent(ip);
            let url;

            if (ipv6) {
                url = `https://qifu-api.baidubce.com/ip/geo/v1/ipv6/district?ip=${ip}`
            } else {
                url = `https://qifu-api.baidubce.com/ip/geo/v1/district?ip=${ip}`
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data && data.data && data.data.country) {
                            resolve(`${data.data.country} | ${data.data.isp}`);
                        } else {
                            reject("失败104");
                        }
                    } catch (error) {
                        reject("失败107");
                    }
                },
                onerror: function (error) {
                    reject("失败111");
                }
            });
        });
    }

    let cachedIp = GM_getValue(location.origin + '_cachedIp', "失败117");
    let cachedDistrict = GM_getValue(location.origin + '_cachedDistrict', "失败118");

    getIP(location.origin).then(Comment => {

        // 匹配 IPv4 地址
        const ipv4Regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
        // 匹配 IPv6 地址
        const ipv6Regex = /\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;

        const ipv4Matches = Comment.match(ipv4Regex);
        const ipv6Matches = Comment.match(ipv6Regex);

        let ip;
        // 先尝试匹配 IPv4，如果没有匹配到，再尝试匹配 IPv6
        if (ipv4Matches && ipv4Matches.length > 0) {
            ip = ipv4Matches[0]

            GM_setValue(location.origin + '_cachedIp', ip); // 更新缓存

            // 获取归属地信息
            getLocation(ip, false).then(district => {
                ip_button.textContent = `${ip} | ${district}`;

                GM_setValue(location.origin + '_cachedDistrict', district); // 更新缓存

                GM_log("143", location.origin, buttonId, ip, district)
            }).catch(error => {
                GM_log("145", error, location.origin, buttonId, ip, cachedDistrict)

                ip_button.textContent = `${ip} | ${cachedDistrict}`;
            });

        } else if (ipv6Matches && ipv6Matches.length > 0) {
            ip = ipv6Matches[0]

            GM_setValue(location.origin + '_cachedIp', ip); // 更新缓存

            // 获取归属地信息
            getLocation(ip, true).then(district => {
                ip_button.textContent = `${ip} | ${district}`;

                GM_setValue(location.origin + '_cachedDistrict', district); // 更新缓存

                GM_log("161", location.origin, buttonId, ip, district)
            }).catch(error => {
                GM_log("163", error, location.origin, buttonId, ip, cachedDistrict)

                ip_button.textContent = `${ip} | ${cachedDistrict}`;
            });

        } else {
            ip_button.textContent = `${cachedIp} | ${cachedDistrict}`;

            GM_log("171", location.origin, cachedIp, cachedDistrict)
        }

    }).catch(error => {

        ip_button.textContent = `${cachedIp} | ${cachedDistrict}`;

        GM_log("178", location.origin, error, cachedIp, cachedDistrict)
    });

})();