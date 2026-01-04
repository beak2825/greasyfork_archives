// ==UserScript==
// @name         PPF3
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  F3 Voucher
// @author       smallsun
// @match        *://www.flyadeal.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527548/PPF3.user.js
// @updateURL https://update.greasyfork.org/scripts/527548/PPF3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetUrl = "https://bookingapi2.flyadeal.com/api/fad/v1/Booking/Payment/GetAvailablePayments";
    const voucherApi = "https://digitalapi-akm.prod.0p.navitaire.com/0p/dotrez/api/nsk/v1/booking/payments/voucher";
    const redeemApi = "https://digitalapi-akm.prod.0p.navitaire.com/0p/dotrez/api/nsk/v4/booking/payments/voucher";
    const apiKey = "7650cf5976104e4e90fd457b3d9be789";

    // 初始化日志窗口
    createLogWindow();

    // 劫持 XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._isTarget = url.includes(targetUrl);
        return open.apply(this, [method, url, ...rest]);
    };

    const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (this._isTarget && header === "Authorization") {
            console.log(`Authorization: ${value}`);
            this._authToken = value;
        }
        return setRequestHeader.apply(this, [header, value]);
    };

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this._isTarget && this._authToken) {
            handleVoucherProcessing(this._authToken);
        }
        return send.apply(this, [body]);
    };

    // async function handleVoucherProcessing(authToken) {
    //     try {
    //         let userInput1 = await promptAsync("请输入优惠券 1:", "0000000000000000");
    //         let userInput2 = await promptAsync("请输入优惠券 2:", "0000000000000000");

    //         logMessage(`输入的优惠券: ${userInput1}, ${userInput2}`)
    //         console.log("输入的优惠券:", userInput1, userInput2);

    //         let amount1 = await getVoucherAmount(userInput1, authToken);
    //         let amount2 = await getVoucherAmount(userInput2, authToken);

    //         logMessage(`Voucher 1 可用金额: ${amount1}`);
    //         logMessage(`Voucher 2 可用金额: ${amount2}`);

    //         console.log("Voucher 1 可用金额:", amount1);
    //         console.log("Voucher 2 可用金额:", amount2);

    //         if (amount1 > 0) {
    //             await redeemVoucher(userInput1, amount1, authToken);
    //         }
    //         if (amount2 > 0) {
    //             await redeemVoucher(userInput2, amount2, authToken);
    //         }
    //     } catch (error) {
    //         logMessage(`处理优惠券时出错: ${error.message}`);
    //         console.error("处理优惠券时出错:", error);
    //     }
    // }

    async function handleVoucherProcessing(authToken) {
        try {
            let vouchers = [];
            while (true) {
                let input = await promptAsync("请输入优惠券 (取消结束输入):", "");
                if (!input) break;
                vouchers.push(input);
            }

            logMessage(`输入的优惠券: ${vouchers.join(", ")}`);
            console.log("输入的优惠券:", vouchers);

            for (let voucher of vouchers) {
                let amount = await getVoucherAmount(voucher, authToken);
                logMessage(`Voucher ${voucher} 可用金额: ${amount}`);
                console.log(`Voucher ${voucher} 可用金额:`, amount);

                if (amount > 0) {
                    await redeemVoucher(voucher, amount, authToken);
                }
            }
        } catch (error) {
            logMessage(`处理优惠券时出错: ${error.message}`);
            console.error("处理优惠券时出错:", error);
        }
    }

    /**
     * 发送异步 `prompt`，避免 UI 阻塞
     * @param {string} message 提示信息
     * @param {string} defaultValue 默认值
     * @returns {Promise<string>}
     */
    function promptAsync(message, defaultValue) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(prompt(message, defaultValue));
            }, 100);
        });
    }


    function getVoucherAmount(referenceCode, authToken) {
        let url = `${voucherApi}?referencecode=${encodeURIComponent(referenceCode)}`;
        return sendRequest("GET", url, null, authToken)
            .then(response => response?.data?.redeemableAmount || 0)
            .catch(error => {
                logMessage(`获取 Voucher 失败: ${error.message}`);
                console.error("获取 Voucher 失败:", error);
                return 0;
            });
    }

    /**
     * 兑换 Voucher
     * @param {string} referenceCode
     * @param {number} amount
     * @param {string} authToken
     * @returns {Promise<void>}
     */
    function redeemVoucher(referenceCode, amount, authToken) {
        let body = JSON.stringify({ Amount: amount, ReferenceCode: referenceCode });
        return sendRequest("POST", redeemApi, body, authToken)
            .then(response => {
                logMessage(`兑换成功: ${JSON.stringify(response)}`)
                console.log("兑换成功:", response)
            })
            .catch(error => {
                logMessage(`兑换失败: ${error.message}`)
                console.error("兑换失败:", error)
            });
    }

    /**
     * 发送 XHR 请求
     * @param {"GET" | "POST"} method 请求方法
     * @param {string} url 请求 URL
     * @param {string | null} body 请求体（POST 需要）
     * @param {string} authToken Authorization 令牌
     * @returns {Promise<any>}
     */
    function sendRequest(method, url, body, authToken) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader("Authorization", authToken);
            xhr.setRequestHeader("ocp-apim-subscription-key", apiKey);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Accept-Encoding", "identity");
            xhr.setRequestHeader("User-Agent", "Dalvik/2.1.0 (Linux; U; Android 11; Pixel 3 Build/RQ3A.210905.001)");
            xhr.setRequestHeader("Host", "digitalapi-akm.prod.0p.navitaire.com");
            xhr.setRequestHeader("Connection", "Keep-Alive");

            if (method === "POST") {
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(`请求失败: ${xhr.status} ${xhr.statusText}`));
                    }
                }
            };

            xhr.send(body);
        });
    }

    function createLogWindow() {
        let logContainer = document.createElement("div");
        logContainer.id = "logWindow";
        logContainer.style.position = "fixed";
        logContainer.style.bottom = "10px";
        logContainer.style.right = "10px";
        logContainer.style.width = "400px";
        logContainer.style.height = "300px";
        logContainer.style.overflowY = "auto";
        logContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        logContainer.style.color = "#fff";
        logContainer.style.padding = "10px";
        logContainer.style.borderRadius = "5px";
        logContainer.style.fontSize = "12px";
        logContainer.style.zIndex = "9999";
        logContainer.style.whiteSpace = "pre-wrap";
        logContainer.style.fontFamily = "monospace";
        document.body.appendChild(logContainer);
    }

    function logMessage(message) {
        console.log(message);
        let logContainer = document.getElementById("logWindow");
        if (logContainer) {
            let logEntry = document.createElement("div");
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight; // 滚动到底部
        }
    }
})();
