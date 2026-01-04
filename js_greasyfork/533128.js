// ==UserScript==
// @name         MONAD大全
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  完全自定义的手动网页跳转控制面板（可手动关闭）
// @author       Your Name
// @match        *://*/*
// @exclude      https://www.hcaptcha.com/*
// @exclude      https://hcaptcha.com/*
// @exclude      https://www.cloudflare.com/*
// @exclude      https://cloudflare.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533128/MONAD%E5%A4%A7%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533128/MONAD%E5%A4%A7%E5%85%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前URL是否在排除列表中
    const currentUrl = window.location.href;
    if (currentUrl.includes('hcaptcha.com') || currentUrl.includes('cloudflare.com')) {
        return; // 不执行脚本
    }

    // 自定义跳转列表（在此处添加你的目标网址）
    const customSiteSequence = [
        "https://monad.rhombis.app/",
        "https://kintsu.xyz/staking",
        "https://testnet.swaps.mace.ag/",
        "https://bebop.xyz/trade?network=monad&sell=MON",
        "https://app-monad-testnet.azaar.com/",
        "https://monad-test.kinza.finance/#/details/MON",
        "https://monad.ambient.finance/trade/market/chain=0x279f&tokenA=0x0000000000000000000000000000000000000000",
        "https://testnet.mudigital.net/?utm_source=x&utm_medium=organic&utm_campaign=testnet",
        "https://www.kuru.io/swap?from=0x0000000000000000000000000000000000000000",
        "https://pandaria.lfj.gg/monad-testnet/trade",
        "https://pancakeswap.finance/swap",
        "https://app.nad.domains/",
        "https://monad-test.kinza.finance/#/dashboard",
        "https://owlto.finance/deploy/?chain=MonadTestnet",
        "https://magiceden.io/mint-terminal/monad-testnet",
        "https://morkie.xyz/monad",
        "https://testnet.xlmeme.com/monad",
        "https://monad.nostra.finance/lend-borrow/WMON/deposit",
        "https://app.crystal.exchange/swap",
        "https://alpha.clober.io/trade",
        "https://app.zona.finance/trade"
    ];

    // 添加控制面板样式
    GM_addStyle(`
        #manualJumpPanel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            min-width: 250px;
        }
        #manualJumpPanel h3 {
            margin: 0 0 10px 0;
            padding: 0;
            font-size: 14px;
            color: #4CAF50;
        }
        #manualJumpPanel button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 5px 0;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
            text-align: left;
        }
        #manualJumpPanel button:hover {
            background: #45a049;
        }
        #manualJumpPanel .current-site {
            font-size: 12px;
            color: #ccc;
            margin-bottom: 10px;
            word-break: break-all;
        }
        #manualJumpPanel .error-notice {
            color: #ff6b6b;
            font-size: 12px;
            margin-bottom: 10px;
        }
        #manualJumpPanel .progress {
            font-size: 12px;
            color: #4CAF50;
            margin-bottom: 10px;
        }
        #manualJumpPanel .close-btn {
            background: #f44336 !important;
            margin-top: 10px;
        }
    `);

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'manualJumpPanel';
    panel.innerHTML = `
        <h3>自定义网站跳转控制</h3>
        <div class="current-site">当前网址: ${window.location.href}</div>
        <div class="progress" id="progressInfo"></div>
        <div class="error-notice" id="errorNotice" style="display:none;">页面加载可能出错，但您仍可强制跳转</div>
        <button id="nextSiteBtn">跳转到下一个网站</button>
        <button id="closePanelBtn" class="close-btn">关闭控制面板</button>
    `;

    // 直接添加到body
    const root = document.documentElement || document.body;
    root.appendChild(panel);

    // 初始化访问记录
    let visitedSites = GM_getValue('visitedSites', {});

    // 更新进度显示
    function updateProgress() {
        const totalSites = customSiteSequence.length;
        const visitedCount = Object.keys(visitedSites).length;
        document.getElementById('progressInfo').textContent =
            `进度: ${visitedCount}/${totalSites} (${Math.round((visitedCount/totalSites)*100)}%)`;
    }

    updateProgress();

    // 监听可能的错误
    window.addEventListener('error', function() {
        document.getElementById('errorNotice').style.display = 'block';
    });

    // 跳转逻辑，改为随机跳转
    document.getElementById('nextSiteBtn').addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * customSiteSequence.length);
        const randomSite = customSiteSequence[randomIndex];

        // 记录已访问的网站
        visitedSites[randomSite] = true;
        GM_setValue('visitedSites', visitedSites);

        updateProgress();
        window.location.href = randomSite;
    });

    // 关闭面板按钮 - 仅移除面板，不重置记录
    document.getElementById('closePanelBtn').addEventListener('click', function() {
        panel.remove();
    });

    // 即使页面完全加载失败也确保面板可见
    setTimeout(() => {
        document.getElementById('errorNotice').style.display = 'block';
    }, 3000);

    console.log('自定义跳转脚本已加载，控制面板将显示');
})();