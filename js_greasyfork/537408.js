// ==UserScript==
// @name         BNB.LTC.SOL.TON.TRX.DOGE.POL Auto Claim (Enhanced Idle-Proof)
// @namespace    Pick.io Auto Claim 24H
// @version      5.2
// @description  24H fully automated Pick.io auto-claim across all Pick.io sites, humanized click, auto switch, auto refresh
// @author       ALEN
// @icon         https://i.imgur.com/tnqS60o.jpeg
// @match        https://dogepick.io/*
// @match        https://tronpick.io/*
// @match        https://bnbpick.io/*
// @match        https://litepick.io/*
// @match        https://solpick.io/*
// @match        https://tonpick.game/*
// @match        https://polpick.io/*
// @match        https://suipick.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537408/BNBLTCSOLTONTRXDOGEPOL%20Auto%20Claim%20%28Enhanced%20Idle-Proof%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537408/BNBLTCSOLTONTRXDOGEPOL%20Auto%20Claim%20%28Enhanced%20Idle-Proof%29.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const CLAIM_INTERVAL = 60 * 60 * 1000; // 60 分鐘
    const ERROR_WAIT     = 10 * 60 * 1000; // 錯誤等待 10 分鐘
    const JITTER_PCT     = 0.08;

    const siteList = [
        "litepick.io",
        "tronpick.io",
        "solpick.io",
        "dogepick.io",
        "bnbpick.io",
        "polpick.io",
        "tonpick.game",
        "suipick.io"
    ];

    const siteKey = window.location.hostname;
    const now     = ()=>Date.now();
    const jitter  = ms => ms + Math.round((Math.random()*2 - 1) * ms * JITTER_PCT);

    function getLastClaim(site){ return parseInt(localStorage.getItem("lastClaim_" + site) || "0"); }
    function setLastClaim(site, ts){ localStorage.setItem("lastClaim_" + site, ts); }

    function shouldClaim(){
        return now() - getLastClaim(siteKey) >= CLAIM_INTERVAL;
    }

    // ======== 初始化自動跳轉到 faucet.php ========
    if (!/faucet\.php/.test(location.pathname)) {
        window.location.href = "/faucet.php";
    }

    // ======== 狀態面板 ========
    function createPanel(){
        const panel = document.createElement("div");
        panel.id = "pickio-panel";
        panel.style.cssText = `
            position:fixed; right:20px; top:90px;
            background:rgba(0,0,0,0.85); color:#00ffcc;
            padding:10px 15px; border-radius:10px;
            font-size:15px; z-index:9999; font-family:monospace;
            max-height:420px; overflow-y:auto;
        `;
        let html = "<b>📋 Pick.io 狀態</b><br><div id='pickio-status'>";
        for(const site of siteList){
            html += `<div id='status-${site}'>${site}: loading...</div>`;
        }
        html += "</div>";
        panel.innerHTML = html;
        document.body.appendChild(panel);
    }

    function updatePanel(){
        const nowTime = now();
        for(const site of siteList){
            const last = getLastClaim(site);
            const remaining = Math.max(0, CLAIM_INTERVAL - (nowTime - last));
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            const el = document.getElementById(`status-${site}`);
            if(el) el.innerText = `${site}: ${mins}m ${secs}s`;
        }
    }

    // ======== 人性化點擊 ========
    function humanClick(btn){
        if (!btn || btn.disabled) return;
        const delay = 2000 + Math.random() * 4000; // 2~6 秒
        setTimeout(()=>{
            btn.scrollIntoView({behavior:"smooth",block:"center"});
            const rect = btn.getBoundingClientRect();
            const x = rect.left + Math.random()*rect.width;
            const y = rect.top  + Math.random()*rect.height;
            document.dispatchEvent(new MouseEvent("mousemove",{clientX:x,clientY:y,bubbles:true}));
            btn.dispatchEvent(new MouseEvent("mousedown",{bubbles:true}));
            btn.dispatchEvent(new MouseEvent("mouseup",{bubbles:true}));
            btn.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
            setLastClaim(siteKey, now());
            setTimeout(nextSite, 8000);
        }, delay);
    }

    // ======== 防重複點擊保護旗標 ========
    let claiming = false;
    function tryClaim(){
        if (claiming || !shouldClaim()) return;
        const btn = document.getElementById("process_claim_hourly_faucet");
        if (btn) {
            claiming = true;
            humanClick(btn);
            setTimeout(()=>claiming = false, 30000); // 30 秒後解鎖
        }
    }

    // ======== 錯誤檢測 ========
    function checkError(){
        const nodes = document.querySelectorAll("h2#info,.error,.alert,.alert-danger,.toast,.notice,.message,[role='alert']");
        for (const el of nodes){
            const txt = (el.innerText||"").trim();
            if (!txt) continue;

            // 驗證碼
            if (/recaptcha|captcha|驗證/i.test(txt)){
                setTimeout(()=>location.reload(), 3000);
                return;
            }

            // 需要等待的訊息
            let m = txt.match(/(\d+)\s*minute/i) || txt.match(/等\s*(\d+)\s*分鐘/);
            if (m){
                const waitMs = parseInt(m[1],10) * 60 * 1000;
                // 將最後領取時間回推，確保面板倒數正確
                setLastClaim(siteKey, now() - (CLAIM_INTERVAL - jitter(waitMs)));
                return;
            }

            // 一般錯誤
            if (/error|failed|please try again|something went wrong|出錯/i.test(txt)){
                setLastClaim(siteKey, now() - (CLAIM_INTERVAL - jitter(ERROR_WAIT)));
                setTimeout(()=>location.reload(), jitter(ERROR_WAIT));
                return;
            }
        }
    }

    // ======== 切換站點 ========
    function nextSite(){
        const idx = siteList.findIndex(url => window.location.hostname.includes(url));
        if (idx >= 0){
            window.location.href = "https://" + siteList[(idx + 1) % siteList.length] + "/faucet.php";
        }
    }

    // ======== 初始化 ========
    createPanel();
    setInterval(updatePanel, 3000);  // 每 3 秒更新狀態面板 (優化效能)
    setInterval(tryClaim, 15000);    // 每 15 秒嘗試領取
    setInterval(checkError, 5000);   // 每 5 秒檢查錯誤

    // 隨機自動刷新 6~8 小時
    setTimeout(()=>location.reload(), Math.floor(Math.random()*2*60*60*1000)+(6*60*60*1000));

})();