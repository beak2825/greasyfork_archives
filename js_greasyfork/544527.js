// ==UserScript==
// @name         V2Chat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  基于 $V2EX 销毁机制的聊天室
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @require      https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544527/V2Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/544527/V2Chat.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const { Connection, PublicKey, Transaction, TransactionInstruction } = solanaWeb3;

    const V2EX_TOKEN_MINT = "9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump";
    const BURN_ATA_ADDRESS = "5Q9cjTsKBhm29KwUKFwsAiKFBT263ASBb1LiHdXFWYKW";  // 1nc1nerator11111111111111111111111111111111
    const RPC_URL = "https://solana-rpc.publicnode.com";
    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const MAX_LOAD_COUNT = 15;

    const styleMap = {
        1: 'color:#ffffff;',
        10: 'color:#1eff00;',
        100: 'color:#0070dd;',
        1000: 'color:#a335ee;',
        10000: 'color:#ff8000;'
    };

    const chatBox = document.createElement('div');
    chatBox.id = 'geek-chat';
    chatBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 400px;
        background: rgba(0,0,0,0.85);
        border-radius: 8px;
        color: white;
        box-shadow: 0 0 12px rgba(0,0,0,0.6);
        z-index: 9999;
        overflow: hidden;
      `;

    chatBox.innerHTML = `
        <div id="chat-header" style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:#111;border-bottom:1px solid #333;font-weight:bold;">
          <div>V2EX Chat</div>
          <button id="minimize-btn" style="cursor:pointer;font-size:16px;color:#aaa;background:none;border:none;">−</button>
        </div>
        <div id="chat-body">
          <div id="chat-messages" style="max-height:300px;overflow-y:auto;padding:10px;background:#111;"></div>
          <div id="chat-input" style="display:flex;gap:6px;border-top:1px solid #333;padding:8px;background:#111;align-items:center;">
            <div id="value-select-wrapper" style="position:relative;" title="Select message value">
              <button id="current-value-btn" data-value="1" style="border:none;border-radius:4px;padding:6px 10px;font-size:14px;font-weight:bold;cursor:pointer;color:black;min-width:50px;text-align:center;background:white;">1</button>
              <div id="value-buttons" style="position:absolute;bottom:36px;left:0;border-radius:4px;display:flex;gap:4px;opacity:0;pointer-events:none;transition:opacity 0.15s;white-space:nowrap;z-index:10;">
                ${[1, 10, 100, 1000, 10000].map(v => `
                  <button class="value-btn" data-value="${v}" style="border:1px solid transparent;border-radius:4px;padding:6px 10px;font-size:14px;cursor:pointer;color:black;font-weight:bold;background-${styleMap[v]}${v === 1 ? 'border-color:white;' : ''}">${v}</button>
                `).join('')}
              </div>
            </div>
            <input type="text" id="message-text" placeholder=">_ Type your message..." maxlength="200" style="flex:1;padding:6px 8px;background:transparent;border:1px solid #444;color:white;outline:none;font-size:14px;" autocomplete="off" />
            <button class="send-btn" style="background:#333;border:1px solid #555;color:white;padding:6px 12px;cursor:pointer;font-size:14px;">Send</button>
          </div>
        </div>
      `;

    document.body.appendChild(chatBox);

    const chatHeader = chatBox.querySelector('#chat-header');
    const currentValueBtn = chatBox.querySelector('#current-value-btn');
    const valueBtns = chatBox.querySelectorAll('.value-btn');
    const valuePanel = chatBox.querySelector('#value-buttons');
    const wrapper = chatBox.querySelector('#value-select-wrapper');
    const input = chatBox.querySelector('#message-text');
    const msgArea = chatBox.querySelector('#chat-messages');
    const sendBtn = chatBox.querySelector('.send-btn');
    const minimizeBtn = chatBox.querySelector('#minimize-btn');
    const chatBody = chatBox.querySelector('#chat-body');

    let selectedValue = 1;

    function showValuePanel() {
        valuePanel.style.opacity = '1';
        valuePanel.style.pointerEvents = 'auto';
    }
    function hideValuePanel() {
        valuePanel.style.opacity = '0';
        valuePanel.style.pointerEvents = 'none';
    }

    wrapper.addEventListener('mouseenter', showValuePanel);
    wrapper.addEventListener('mouseleave', () => {
        // 延迟判断，避免快速切换时闪烁
        setTimeout(() => {
            if (!wrapper.matches(':hover') && !valuePanel.matches(':hover')) {
                hideValuePanel();
            }
        }, 100);
    });

    valuePanel.addEventListener('mouseenter', showValuePanel);
    valuePanel.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!wrapper.matches(':hover') && !valuePanel.matches(':hover')) {
                hideValuePanel();
            }
        }, 100);
    });

    valueBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            valueBtns.forEach(b => b.style.borderColor = 'transparent');
            btn.style.borderColor = 'white';
            selectedValue = parseInt(btn.dataset.value);
            currentValueBtn.dataset.value = selectedValue;
            currentValueBtn.textContent = selectedValue;
            currentValueBtn.style = `border:none;border-radius:4px;padding:6px 10px;font-size:14px;font-weight:bold;cursor:pointer;min-width:50px;text-align:center;background-${styleMap[selectedValue]}`;
        });
    });

    let sendLoadingIntervalId = null;
    function startSendLoading() {
        if (sendLoadingIntervalId) return;
        const states = ['Send', 'Send.', 'Send..', 'Send...'];
        let index = 0;
        sendLoadingIntervalId = setInterval(() => {
            index = (index + 1) % states.length;
            sendBtn.textContent = states[index];
        }, 500);
    };

    function stopSendLoading(buttonId) {
        if (sendLoadingIntervalId) {
            clearInterval(sendLoadingIntervalId);
            sendLoadingIntervalId = null;
        }
        sendBtn.textContent = 'Send'
    };

    let myUserName = null;
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        if (sendLoadingIntervalId) return;

        startSendLoading();

        if (!myUserName) {
            const names = await findMemberName();
            if (!names || names.length == 0) {
                alert('发送失败');
                stopSendLoading();
                return;
            }
            myUserName = names[0];
        }

        if (!confirm(`确定消耗 ${currentValueBtn.dataset.value} $V2EX 发送消息吗\n${myUserName}\n${text}`)) {
            stopSendLoading();
            return;
        }

        const memo = {
            u: myUserName,
            m: text
        };
        const success = await burnWithMessage(currentValueBtn.dataset.value, JSON.stringify(memo));
        if (success) {
            alert('发送成功');
            input.value = '';
            input.focus();
            updateAndShowMessage();
            msgArea.scrollTop = msgArea.scrollHeight;
        }
        stopSendLoading();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
    });

    minimizeBtn.addEventListener('click', () => {
        if (chatBody.style.display === 'none') {
            chatBody.style.display = 'block';
            minimizeBtn.textContent = '−';
        } else {
            chatBody.style.display = 'none';
            minimizeBtn.textContent = '+';
        }
    });

    async function connectWallet() {
        const provider = window.phantom?.solana;
        if (!provider?.isPhantom) {
            return null;
        }
        try {
            const resp = await provider.connect();
            return { provider, publicKey: new PublicKey(resp.publicKey.toString()) };
        } catch (err) {
            return null;
        }
    }

    async function getAssociatedTokenAddress(walletPublicKey, mintPublicKey) {
        const connection = new Connection(RPC_URL, "confirmed");
        try {
            const response = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
                filters: [
                    { dataSize: 165 },
                    { memcmp: { offset: 0, bytes: mintPublicKey.toBase58() } },
                    { memcmp: { offset: 32, bytes: walletPublicKey.toBase58() } },
                ],
            });
            return response.length > 0 ? response[0].pubkey.toBase58() : null;
        } catch (err) {
            console.error(err);
            console.log("query ata address failed: " + err.message);
        }
    }

    function createTransferInstructionData(amount) {
        const data = new Uint8Array(9);
        data[0] = 3;

        const amountBigInt = BigInt(amount);
        for (let i = 0; i < 8; i++) {
            data[i + 1] = Number((amountBigInt >> BigInt(i * 8)) & BigInt(0xff));
        }

        return data;
    }

    async function burnWithMessage(tokenAmount, message) {
        try {
            await connectWallet();
        } catch (e) {
            alert('Phantom 钱包初始化失败');
            return false;
        }

        const connection = new Connection(RPC_URL, "confirmed");
        const mintAddress = V2EX_TOKEN_MINT;
        let success = false;
        try {
            const { provider, publicKey } = await connectWallet();

            const amount = Math.floor(tokenAmount * Math.pow(10, 6));

            let fromATA = await getAssociatedTokenAddress(publicKey, new PublicKey(mintAddress));
            if (!fromATA) {
                throw new Error('你暂未创建 $V2EX 代币地址');
            }

            const instructions = [];

            instructions.push(
                new TransactionInstruction({
                    keys: [
                        { pubkey: new PublicKey(fromATA), isSigner: false, isWritable: true },
                        { pubkey: new PublicKey(BURN_ATA_ADDRESS), isSigner: false, isWritable: true },
                        { pubkey: publicKey, isSigner: true, isWritable: false },
                    ],
                    programId: TOKEN_PROGRAM_ID,
                    data: createTransferInstructionData(amount),
                })
            );

            instructions.push(
                new TransactionInstruction({
                    keys: [],
                    programId: MEMO_PROGRAM_ID,
                    data: new TextEncoder().encode(message)
                })
            )

            const transaction = new Transaction();
            instructions.forEach((instruction) => transaction.add(instruction));
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const { signature } = await provider.signAndSendTransaction(transaction);
            const timestamp = Math.floor(Date.now() / 1000);
            allMessage[signature] = {
                signature: signature,
                amount: tokenAmount,
                blockTime: timestamp,
                memo: JSON.parse(message),
                _isTemp: true
            };
            success = true;
        } catch (err) {
            console.log('send message failed: ' + err.message);
            alert('发送失败: ' + err.message);
        }
        return success;
    }

    async function fetchMemoTokenTransfersRaw(address, limit = 10, before = null) {
        const endpoint = RPC_URL;

        // JSON-RPC 请求函数
        async function rpc(method, params) {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method,
                    params
                })
            });
            const json = await res.json();
            return json.result;
        }

        // 尝试从 memo 中提取 JSON 段
        function extractValidMemo(memoStr) {
            if (!memoStr) return null;

            // 尝试提取所有可能的 JSON 段（第一个 { 到最后一个 }）
            const start = memoStr.indexOf("{");
            const end = memoStr.lastIndexOf("}");
            if (start === -1 || end === -1 || end <= start) return null;

            const possibleJson = memoStr.slice(start, end + 1);
            try {
                const parsed = JSON.parse(possibleJson);
                delete parsed.size;
                return parsed;
            } catch {
                return null;
            }
        }

        // 计算 token 转账数量
        function getTransferredTokenAmount(meta) {
            const pre = meta?.preTokenBalances || [];
            const post = meta?.postTokenBalances || [];

            for (let i = 0; i < pre.length; i++) {
                const preBal = pre[i];
                const postBal = post.find(pb =>
                    pb.accountIndex === preBal.accountIndex &&
                    pb.mint === preBal.mint &&
                    pb.owner === preBal.owner
                );

                if (postBal) {
                    const delta =
                        parseFloat(postBal.uiTokenAmount.uiAmount) -
                        parseFloat(preBal.uiTokenAmount.uiAmount);
                    if (delta !== 0) {
                        return Math.abs(delta);
                    }
                }
            }
            return 0;
        }

        // Step 1: 获取签名列表
        const sigParams = [address, { limit }];
        if (before) sigParams[1].before = before;

        const signatures = await rpc("getSignaturesForAddress", sigParams);
        const filtered = signatures.filter(s => s.memo && extractValidMemo(s.memo));

        const results = [];

        // Step 2: 遍历有效交易
        for (const sig of filtered) {
            if (allMessage[sig.signature] && !allMessage[sig.signature]._isTemp) continue;

            const tx = await rpc("getTransaction", [sig.signature, { encoding: "jsonParsed" }]);
            if (!tx || !tx.meta || tx.meta.err) continue;

            const memoJson = extractValidMemo(sig.memo);
            if (!memoJson) continue;

            const amount = getTransferredTokenAmount(tx.meta);



            results.push({
                signature: sig.signature,
                memo: memoJson,
                amount,
                blockTime: sig.blockTime
            });
        }

        return results;
    }

    async function findMemberName() {
        const url = `${window.location.protocol}//${window.location.host}/`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const toolsElement = doc.querySelector('.tools');
            if (toolsElement) {
                const memberLinks = Array.from(toolsElement.querySelectorAll('a'))
                    .filter(link => link.getAttribute('href').startsWith('/member/'))
                    .map(link => link.textContent);
                console.log('find member name', memberLinks);
                return memberLinks;
            } else {
                return [];
            }
        } catch (err) {
            console.log('find member name error: ' + err.message);
            return [];
        }
    }

    function getColorByAmount(amount) {
        if (amount < 10) return styleMap[1];
        if (amount < 100) return styleMap[10];
        if (amount < 1000) return styleMap[100];
        if (amount < 10000) return styleMap[1000];
        return styleMap[10000];
    }

    function getTimeFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    let allMessage = {};

    function updateAndShowMessage(data) {
        data?.forEach(newMsg => {
            allMessage[newMsg.signature] = newMsg;
        });
        msgArea.innerHTML = '';
        const entries = Object.entries(allMessage);
        entries.sort((a, b) => a[1].blockTime - b[1].blockTime);
        entries.forEach(entry => {
            const msg = entry[1];
            const chat = document.createElement('div');
            chat.style = `margin:2px 0;${getColorByAmount(msg.amount)}word-break: break-word;line-height: 1.4;`;
            chat.innerHTML = `[ ${getTimeFromTimestamp(msg.blockTime * 1000)} ][ <a href="/member/${msg.memo.u}" target="_blank" style="color: inherit;">${msg.memo.u}</a> ] ${msg.memo.m}`;
            msgArea.appendChild(chat);
        });
    }

    async function loadNewMessage() {
        const chatMessages = await fetchMemoTokenTransfersRaw(BURN_ATA_ADDRESS, MAX_LOAD_COUNT);
        updateAndShowMessage(chatMessages);
    }

    let isLoadingMore = false;
    msgArea.addEventListener('scroll', async () => {
        if (msgArea.scrollTop === 0 && !isLoadingMore) {
            isLoadingMore = true;
            const entries = Object.entries(allMessage);
            entries.sort((a, b) => a[1].blockTime - b[1].blockTime);
            const chatMessages = await fetchMemoTokenTransfersRaw(BURN_ATA_ADDRESS, MAX_LOAD_COUNT, entries[0][0]);
            updateAndShowMessage(chatMessages);
            isLoadingMore = false;
        }
    });

    chatBody.style.display = 'none';
    minimizeBtn.textContent = '+';

    const initMsgDiv = document.createElement('div');
    initMsgDiv.style = `margin:2px 0;color:grey;word-break: break-word;line-height: 1.4;`;
    initMsgDiv.textContent = `[System] Loading message...`;
    msgArea.appendChild(initMsgDiv);

    const firstMessage = await fetchMemoTokenTransfersRaw(BURN_ATA_ADDRESS, MAX_LOAD_COUNT);
    updateAndShowMessage(firstMessage);
    msgArea.scrollTop = msgArea.scrollHeight;

    setInterval(() => {
        loadNewMessage();
    }, 15 * 1000);
})();