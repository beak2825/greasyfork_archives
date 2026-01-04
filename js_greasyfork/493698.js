// ==UserScript==
// @name         me专用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Run code directly from browser console using Tampermonkey
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493698/me%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493698/me%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stopFlag = false; // 停止标志
    let interval; // 定义循环定时器

    // 定义一个函数，用于运行你想要执行的代码
    window.runMyCode = function() {
        // 这里放入你想要在浏览器中执行的代码

        (async function() {
            'use strict';
            // 代理池，存储多个代理 IP 地址和端口号
            const proxyPool = [
                '127.0.0.1:8888',
                '192.168.1.100:8080',
                'proxy.example.com:8000',
                // 添加更多代理地址...
            ];

            // 随机选择一个代理
            function getRandomProxy() {
                const randomIndex = Math.floor(Math.random() * proxyPool.length);
                return proxyPool[randomIndex];
            }

            // 设置（您可以直接修改这些变量，或创建UI来设置它们）
            const collectionSymbol = 'cosmogenesis'; // 集合符号
            const price = 768000; // 价格
            const feerateTier = 'fastestFee'; // 费率等级

            // 将Base64编码的PSBT转换为十六进制格式的辅助函数
            function base64ToHex(str) {
                const raw = atob(str);
                let result = '';
                for (let i = 0; i < raw.length; i++) {
                    const hex = raw.charCodeAt(i).toString(16);
                    result += (hex.length === 2 ? hex : '0' + hex);
                }
                return result;
            }

            // 函数：使用OKX钱包签名PSBT
            async function signPSBT(psbtHex) {
                try {
                    // 使用OKX钱包签名PSBT
                    const signedPSBT = await window.okxwallet.bitcoin.signPsbt(psbtHex);
                    console.log('Signed PSBT:', signedPSBT);
                    return signedPSBT;
                } catch (error) {
                    console.error('Error signing PSBT:', error);
                    throw error;
                }
            }

            // 函数：广播已签名的PSBT
            async function broadcastPSBT(signedPSBT) {
                try {
                    // 广播已签名的交易
                    const proxy = getRandomProxy(); // 获取随机代理
                    const response = await fetch('https://blockstream.info/api/tx', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: signedPSBT, // 这里可能需要将已签名的PSBT转换为原始交易
                        mode: 'cors', // 使用代理
                        // proxy: 'http://' + proxy // 使用代理
                    });

                    // 检查广播是否成功
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    } else {
                        const result = await response.json();
                        console.log('Broadcast result:', result);
                    }
                } catch (error) {
                    console.error('Error broadcasting transaction:', error);
                    throw error;
                }
            }

            // 函数：使用动态构建的URL获取数据
            async function fetchData() {
                try {
                    // 构建API URL
                    const buyerAddress = await window.okxwallet.bitcoin.getAccounts();
                    const buyerTokenReceiveAddress = buyerAddress; // 购买者代币接收地址
                    const publicKey = await window.okxwallet.bitcoin.getPublicKey(); // 购买者公钥
                    const apiUrl = `https://api-mainnet.magiceden.io/v2/ord/launchpad/psbt/minting?collectionSymbol=${collectionSymbol}&price=${price}&buyerAddress=${buyerAddress}&buyerTokenReceiveAddress=${buyerTokenReceiveAddress}&buyerPublicKey=${publicKey}&feerateTier=${feerateTier}`;
                    console.log("Attempting to fetch data from:", apiUrl);

                    // 发起网络请求获取数据
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error('Problem with fetch operation: Network response was not ok');
                    }
                    // 解析响应数据
                    const data = await response.json();
                    console.log('Data fetched successfully:', data);
                    const psbtHex = base64ToHex(data.unsignedBuyingPSBTBase64);
                    const signedPSBT = await signPSBT(psbtHex);

                    // 如果签名失败，则停止循环
                    if (!signedPSBT) {
                        stopFlag = true;
                        console.log('Signing failed. Script stopped.');
                        throw error;
                        return; // 立即停止循环
                    }

                    // await broadcastPSBT(signedPSBT); // 广播千万别开
                } catch (error) {
                    console.error('Problem with fetch operation:', error);
                    throw error;
                }

                // 如果签名成功，继续执行循环
                if (!stopFlag) {
                    loop(); // 继续循环
                }
            }

            // 函数：循环执行 fetchData
            async function loop() {
                while (!stopFlag) {
                    try {
                        await fetchData();
                    } catch (error) {
                        console.error('Error in loop:', error);
                        return
                    }
                    await new Promise(resolve => {
                        interval = setTimeout(resolve, 1000); // 30秒后再次执行
                    });
                }
            }

            // 启动脚本
            loop();
        })();

        console.log('My code is running!');
    };

    // 手动控制台命令启动和停止脚本
    window.start = function() {
        if (stopFlag) {
            stopFlag = false;
            loop();
            console.log('Script started.');
        } else {
            console.log('Script is already running.');
        }
    };

    window.stop = function() {
        stopFlag = true;
        console.log('Script stopped.');
        clearInterval(interval); // 清除循环定时器
    };
})();
