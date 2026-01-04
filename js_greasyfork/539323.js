// ==UserScript==
// @name         Only Faucet
// @namespace    http://tampermonkey.net/
// @version      4.20
// @description  Auto-claim
// @author       KukuModZ
// @match        https://onlyfaucet.com/faucet/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539323/Only%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/539323/Only%20Faucet.meta.js
// ==/UserScript==

(function() {
'use strict';

let claimInProgress = false;
let suspiciousActive = false;

// ===== TIME UTILITY =====
function getGreeceTime() {
    const now = new Date();
    const greeceOffset = 3 * 60;
    const localOffset = now.getTimezoneOffset();
    return new Date(now.getTime() + (greeceOffset + localOffset) * 60000);
}

// ===== BANNER =====
const banner = document.createElement('div');
banner.style.cssText = `
    position: fixed; bottom: 15px; left: 50%;
    transform: translateX(-50%);
    border-radius: 12px; padding: 8px 20px;
    text-align: center; color: black; z-index: 999999;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 0 14px rgba(0,0,0,0.5);
    backdrop-filter: blur(6px); background: silver;
    border: 1px solid rgba(200,200,200,0.6); text-shadow: 0 0 2px #fff;
    font-size: 12px; animation: psychedelic 8s infinite linear;
`;
document.body.appendChild(banner);

// ===== GLYPH (TOP SYMBOL) =====
const glyphLabel = document.createElement('div');
glyphLabel.textContent = '𓉴';
glyphLabel.style.cssText = `
    font-size: 22px; font-weight: bold;
    position: absolute; bottom: calc(80% + 5px);
    left: 49%; transform: translateX(-50%);
    z-index: 999999;
    text-shadow: 0 0 8px rgba(0,0,0,0.7), 0 0 12px rgba(255,255,255,0.5);
`;
banner.appendChild(glyphLabel);

// ===== LABELS =====
const nameLabel = document.createElement('div');
nameLabel.style.cssText = "font-size:12px; font-weight:bold; text-align:center;";
nameLabel.textContent = " Kuku👽Modz ";

const freeLtcLabel = document.createElement('div');
freeLtcLabel.style.cssText = `
    font-size:11px; font-weight:bold; letter-spacing:1px;
    color:#111; display:flex; align-items:center; justify-content:center; gap:3px;
`;
const prefixSpan = document.createElement('span');
prefixSpan.textContent = '</>';
prefixSpan.style.animation = "pulseFloat 1s ease-in-out infinite";
freeLtcLabel.appendChild(prefixSpan);
const freeText = document.createElement('span');
freeText.textContent = '0nlyFaucet';
freeLtcLabel.appendChild(freeText);

// ===== DATE/TIME =====
const dateWrapper = document.createElement('div');
const timeEmoji = document.createElement('span');
timeEmoji.textContent = '💻';
timeEmoji.style.marginRight = '3px';
const dateText = document.createElement('span');
dateWrapper.appendChild(timeEmoji);
dateWrapper.appendChild(dateText);

// ===== TELEGRAM BUTTON (2 LOGOS) =====
const telegramLink = document.createElement('a');
telegramLink.href = 'https://t.me/+CKt0ZiZ-3GEwZTA0';
telegramLink.target = '_blank';
telegramLink.style.cssText = `
    display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-top: 8px;
    font-size: 13px; font-weight: bold;
    color: white; text-decoration: none;
    background: linear-gradient(90deg, #0088cc, #00c6ff);
    padding: 6px 16px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,255,255,0.5);
    transition: all 0.3s ease;
`;

const telegramLogoLeft = document.createElement('img');
telegramLogoLeft.src = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg';
telegramLogoLeft.alt = 'Telegram';
telegramLogoLeft.style.cssText = `
    width: 20px; height: 20px;
    filter: drop-shadow(0 0 6px rgba(0,200,255,0.7));
`;

const telegramText = document.createElement('span');
telegramText.textContent = 'Join Telegram';

const telegramLogoRight = telegramLogoLeft.cloneNode(true);

telegramLink.appendChild(telegramLogoLeft);
telegramLink.appendChild(telegramText);
telegramLink.appendChild(telegramLogoRight);

telegramLink.onmouseover = () => {
    telegramLink.style.transform = 'scale(1.1)';
    telegramLink.style.boxShadow = '0 0 20px rgba(0,255,255,0.8)';
};
telegramLink.onmouseout = () => {
    telegramLink.style.transform = 'scale(1)';
    telegramLink.style.boxShadow = '0 0 15px rgba(0,255,255,0.5)';
};

// ===== ADD ELEMENTS TO BANNER =====
banner.appendChild(nameLabel);
banner.appendChild(freeLtcLabel);
banner.appendChild(dateWrapper);
banner.appendChild(telegramLink);

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.innerHTML = `
@keyframes pulseFloat {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-3px) scale(1.2); }
    100% { transform: translateY(0px) scale(1); }
}
@keyframes psychedelic {
    0% { background: #ff4d4d; }
    16% { background: #ffb84d; }
    33% { background: #ffff4d; }
    50% { background: #4dff4d; }
    66% { background: #4dffff; }
    83% { background: #4d4dff; }
    100% { background: #ff4dff; }
}
@keyframes clickBubble {
    0% {opacity:1; transform:scale(0.5);}
    100% {opacity:0; transform:scale(2);}
}`;
document.head.appendChild(style);

// ===== UPDATE TIME =====
function updateTime() {
    const now = getGreeceTime();
    dateText.textContent = now.toLocaleString('el-GR', {hour12:false});
}
setInterval(updateTime, 1000);
updateTime();

// ===== EFFECTS =====
function bubbleClickEffect(x, y) {
    const b = document.createElement('span');
    b.style.cssText = `
        position: fixed;
        left: ${x - 10}px; top: ${y - 10}px;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: rgba(150,150,150,0.6);
        box-shadow: 0 0 10px rgba(150,150,150,0.8);
        pointer-events: none;
        animation: clickBubble 0.6s ease-out forwards;
        z-index: 999999;
    `;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 600);
}

// ===== CLAIM LOGIC =====
function simulateClick(el) {
    if (!el) return;
    ['mouseover','mousemove','mousedown','mouseup','click'].forEach(evt => {
        el.dispatchEvent(new MouseEvent(evt, {bubbles:true, cancelable:true, view:window}));
    });
}
function claimButtonSafe() {
    if (claimInProgress) return false;
    const btn = document.querySelector('#subbutt');
    if (!btn) return false;
    claimInProgress = true;
    setTimeout(() => {
        btn.scrollIntoView({behavior: "smooth", block: "center"});
        const rect = btn.getBoundingClientRect();
        bubbleClickEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
        simulateClick(btn);
        console.log("👆 Claim button clicked safely!");
        claimInProgress = false;
    }, 1000);
    return true;
}

// ===== CAPTCHA LOGIC =====
function handleCaptcha() {
    const checkbox = document.querySelector('#captcha-checkbox');
    if (checkbox) {
        console.log("🧩 Checkbox found, clicking...");
        checkbox.click();
        const observer = new MutationObserver(() => {
            const passed = document.querySelector('.captcha-result.success.show');
            if (passed) {
                console.log("✅ Captcha passed — clicking claim button");
                claimButtonSafe();
                observer.disconnect();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    } else {
        claimButtonSafe();
    }
}

// ===== ALERT HANDLERS =====
function handleSuspicious() {
    const alertDiv = document.querySelector('.captcha-blocked');
    if (alertDiv) {
        console.log("⚠️ Suspicious activity detected — countdown 5 min");
        suspiciousActive = true;
        const countdownDiv = document.createElement('div');
        countdownDiv.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 999999;
            background: silver; color: black; padding: 6px 12px;
            font-weight: bold; border-radius: 6px; font-family: sans-serif;
        `;
        document.body.appendChild(countdownDiv);
        let timeLeft = 5 * 60;
        const interval = setInterval(() => {
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            countdownDiv.textContent = `⏱ Suspicious countdown ${m}:${s < 10 ? '0' + s : s}`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                location.reload();
            }
            timeLeft--;
        }, 1000);
        return true;
    } else {
        suspiciousActive = false;
        return false;
    }
}

function handleShortlink() {
    const msg = document.querySelector('#swal2-html-container');
    if (msg && msg.innerText.includes('Shortlink')) {
        console.log("🚫 Shortlink alert — freezing page permanently");
        banner.textContent = "SC 🚫 by KukuModZ";
        banner.style.background = "linear-gradient(45deg, #ff4d4d, #ffb84d, #ffff4d, #4dff4d, #4dffff, #4d4dff, #ff4dff)";
        document.body.style.pointerEvents = "none";
        let id = window.setTimeout(() => {}, 0);
        while (id--) { window.clearTimeout(id); }
        return true;
    }
    return false;
}

// ===== MAIN LOOP =====
window.addEventListener('load', () => {
    setTimeout(() => {
        if (handleShortlink()) return;
        if (handleSuspicious()) return;
        handleCaptcha();
    }, 3000);

    setInterval(() => {
        if (!handleShortlink() && !suspiciousActive) {
            console.log("🔄 Refreshing page every 15s");
            location.reload();
        }
    }, 15000);
});

})();
