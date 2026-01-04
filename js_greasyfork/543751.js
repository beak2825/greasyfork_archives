// ==UserScript==
// @name         V2EX Solana Token Assistant
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在 V2EX 用户首页和评论列表中显示 $V2EX 代币持仓量，在评论中直接打赏 $V2EX
// @match        https://*.v2ex.com/member/*
// @match        https://v2ex.com/member/*
// @match        https://*.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @require      https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543751/V2EX%20Solana%20Token%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/543751/V2EX%20Solana%20Token%20Assistant.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const TOKEN_MINT = "9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump";
  const RPC_URL = "https://solana-rpc.publicnode.com";

  async function connectWallet() {
    const provider = window.phantom?.solana;
    if (!provider?.isPhantom) {
      return null;
    }
    try {
      const resp = await provider.connect();
      return { provider, publicKey: new solanaWeb3.PublicKey(resp.publicKey.toString()) };
    } catch (err) {
      return null;
    }
  }

  async function getAssociatedTokenAddress(walletPublicKey, mintPublicKey, rpcUrl) {
    const connection = new solanaWeb3.Connection(rpcUrl, "confirmed");
    const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

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
      console.log("查询 ATA 失败: " + err.message);
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

  async function calculateAssociatedTokenAddress(walletPublicKey, mintPublicKey) {
    const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

    const [ata] = await solanaWeb3.PublicKey.findProgramAddress(
      [
        walletPublicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPublicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return ata.toBase58();
  }

  async function createAssociatedTokenAccountInstruction(payer, walletAddress, mint) {
    const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
    const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ata = await calculateAssociatedTokenAddress(new solanaWeb3.PublicKey(walletAddress), new solanaWeb3.PublicKey(mint));

    return new solanaWeb3.TransactionInstruction({
      keys: [
        { pubkey: new solanaWeb3.PublicKey(payer), isSigner: true, isWritable: true },
        { pubkey: new solanaWeb3.PublicKey(ata), isSigner: false, isWritable: true },
        { pubkey: new solanaWeb3.PublicKey(walletAddress), isSigner: false, isWritable: false },
        { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: false },
        { pubkey: solanaWeb3.PublicKey.default, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      data: new Uint8Array(0),
    });
  }

  async function transferSPLToken(toAddress, inputAmount) {
    const rpcUrl = RPC_URL;
    const connection = new solanaWeb3.Connection(rpcUrl, "confirmed");
    const recipientAddress = toAddress;
    const mintAddress = TOKEN_MINT;
    const userInputAmount = inputAmount;

    try {
      const { provider, publicKey } = await connectWallet();
      const amount = Math.floor(userInputAmount * Math.pow(10, 6));

      let fromATA = await getAssociatedTokenAddress(publicKey, new solanaWeb3.PublicKey(mintAddress), rpcUrl);
      if (!fromATA) {
        alert("你暂未创建 $V2EX 代币地址");
        return;
      }

      const instructions = [];

      let toATA = await getAssociatedTokenAddress(new solanaWeb3.PublicKey(recipientAddress), new solanaWeb3.PublicKey(mintAddress), rpcUrl);
      if (!toATA) {
        toATA = await calculateAssociatedTokenAddress(new solanaWeb3.PublicKey(recipientAddress), new solanaWeb3.PublicKey(mintAddress));
        instructions.push(
          await createAssociatedTokenAccountInstruction(publicKey.toBase58(), recipientAddress, mintAddress)
        );
      }

      instructions.push(
        new solanaWeb3.TransactionInstruction({
          keys: [
            { pubkey: new solanaWeb3.PublicKey(fromATA), isSigner: false, isWritable: true },
            { pubkey: new solanaWeb3.PublicKey(toATA), isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
          ],
          programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          data: createTransferInstructionData(amount),
        })
      );

      const transaction = new solanaWeb3.Transaction();
      instructions.forEach((instruction) => transaction.add(instruction));
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const { signature } = await provider.signAndSendTransaction(transaction);
      alert('打赏成功！' + signature);
    } catch (err) {
      alert('打赏失败：' + err.message);
    }
  }


  async function getSplTokenAmountAndPubkey(owner, mint) {
    const url = "https://solana-rpc.publicnode.com";
    const payload = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTokenAccountsByOwner",
      "params": [
        owner,
        { "mint": mint },
        { "encoding": "jsonParsed" }
      ]
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    try {
      const value = data.result.value;
      if (value === null || value.length === 0) {
        return {
          amount: "0.0",
          pubkey: ""
        };
      } else {
        let amount = value[0].account.data.parsed.info.tokenAmount.uiAmount;
        amount = amount == 0 ? "0.0" : amount;
        return {
          amount: amount,
          pubkey: value[0].pubkey
        };
      }
    } catch (e) {
      return null;
    }
  }

  if (window.location.pathname.startsWith('/member/')) {
    const scripts = Array.from(document.querySelectorAll('script'));
    let address = null;

    for (const script of scripts) {
      const text = script.textContent.trim();
      const match = text.match(/const\s+address\s*=\s*"([^"]+)"/);
      if (match) {
        address = match[1];
        break;
      }
    }

    if (!address) {
      return;
    }

    const result = await getSplTokenAmountAndPubkey(address, TOKEN_MINT);
    if (result === null) {
      return;
    }

    const balance = result.amount;
    const linkAddress = result.pubkey ? address : result.pubkey;
    const newHtml = `
      <div class="sep5"></div>
      <div class="flex-one-row" style="display: inline-flex; gap: 5px;">
          <div class="badges">
              <div class="badge" style="background-color: #000; color: #fff;">$V2EX</div>
          </div>
          <span>持有 </span>
          <a href="https://solscan.io/account/${linkAddress}" target="_blank">${balance}</a>
      </div>
  `;

    let targetElement = document.querySelector('a[href="/top/dau"]');
    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', newHtml);
    } else {
      const span = [...document.querySelectorAll('span.gray')].find(el =>
        el.textContent.includes('号会员，加入于')
      );
      if (span) {
        span.insertAdjacentHTML('beforeend', newHtml);
      }
    }
  } else {
    document.querySelectorAll('div.thank_area').forEach(div => {
      if (/^thank_area_\w+$/.test(div.id)) {
        const aHodl = document.createElement('a');
        aHodl.href = '#;';
        aHodl.className = 'thank';
        aHodl.innerHTML = '查看持仓';
        aHodl.addEventListener('click', async (e) => {
          e.preventDefault();

          const td = div.closest('td');
          if (!td) {
            aHodl.innerHTML = '加载失败';
            return;
          }

          const userLink = td.querySelector('a.dark[href^="/member/"]');
          if (userLink) {
            aHodl.innerHTML = '加载中...';
            try {
              const res = await fetch(userLink.href);
              const html = await res.text();
              const match = html.match(/<script>\s*const address = "(.*?)";\s*<\/script>/);
              if (match && match[1]) {
                const result = await getSplTokenAmountAndPubkey(match[1], TOKEN_MINT);
                if (result === null) {
                  aHodl.innerHTML = '加载失败';
                } else {
                  aHodl.innerHTML = `持有 ${result.amount}`;
                }
              } else {
                aHodl.innerHTML = '未绑定 Solana 钱包';
              }
            } catch (err) {
              aHodl.innerHTML = '加载失败';
            }
          } else {
            aHodl.innerHTML = '加载失败';
          }

        });

        div.insertAdjacentHTML('beforeend', '&nbsp;&nbsp;');
        div.insertAdjacentElement('beforeend', aHodl);

        const aTip = document.createElement('a');
        aTip.href = '#;';
        aTip.className = 'thank';
        aTip.innerHTML = '打赏';
        aTip.addEventListener('click', async (e) => {
          e.preventDefault();

          const td = div.closest('td');
          if (!td) {
            aTip.innerHTML = '加载失败';
            return;
          }

          const userLink = td.querySelector('a.dark[href^="/member/"]');
          if (userLink) {
            aTip.innerHTML = '加载中...';
            try {
              const res = await fetch(userLink.href);
              const html = await res.text();
              const match = html.match(/<script>\s*const address = "(.*?)";\s*<\/script>/);
              if (match && match[1]) {
                const userInputAmount = prompt('请输入要打赏的数量', '1');
                if (userInputAmount !== null && userInputAmount.trim() !== "") {
                  const number = Number(userInputAmount);
                  if (Number.isInteger(number) && number > 0) {
                    if (confirm("确认向 " + userLink.innerHTML + " 打赏 " + number + " $V2EX 吗？")) {
                      aTip.innerHTML = '打赏中...';
                      await transferSPLToken(match[1], number);
                    }
                  }
                }
                aTip.innerHTML = '打赏';
              } else {
                alert('对方未绑定 Solana 钱包');
                aTip.innerHTML = '打赏';
              }
            } catch (err) {
              alert('打赏失败：' + err.message);
              aTip.innerHTML = '打赏';
            }

          } else {
            aTip.innerHTML = '加载失败';
          }
        });

        div.insertAdjacentHTML('beforeend', '&nbsp;&nbsp;');
        div.insertAdjacentElement('beforeend', aTip);
      }
    });
  }
})();

