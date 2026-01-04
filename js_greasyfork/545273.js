// ==UserScript==
// @name         VMA-V2
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Auto Vote for VMA , works across all tabs
// @license      JBT
// @match        https://www.mtv.com/event/vma/vote/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545273/VMA-V2.user.js
// @updateURL https://update.greasyfork.org/scripts/545273/VMA-V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Loop settings
    let totalLoops = 0; // 0 = infinite
    let currentLoop = 0;
    const usedEmails = new Set();

    // Stop flag (kill switch)
    window.__stopVoting = false;

    // Loop gap range per tab
    const loopGapMin = rand(1000, 3000);
    const loopGapMax = loopGapMin + rand(2000, 3000);
    console.log(`🌀 This tab's loop gap range: ${loopGapMin}-${loopGapMax} ms`);

    // Show popup message
    function showPopup(message, bgColor = "red") {
        const div = document.createElement("div");
        div.textContent = message;
        div.style.position = "fixed";
        div.style.top = "20px";
        div.style.right = "20px";
        div.style.padding = "10px 20px";
        div.style.backgroundColor = bgColor;
        div.style.color = "white";
        div.style.fontSize = "16px";
        div.style.fontWeight = "bold";
        div.style.borderRadius = "8px";
        div.style.zIndex = 999999;
        div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    // Hotkey: Shift+S stops instantly
    document.addEventListener('keydown', e => {
        if (e.shiftKey && e.key.toLowerCase() === 's') {
            window.__stopVoting = true;
            console.log("⛔ Kill switch activated — voting stopped.");
            showPopup("⛔ VOTING STOPPED", "darkred");
        }
    });

    function generateUniqueEmail() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const domains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'aol.com', 'icloud.com'];
        let email;
        do {
            let username = '';
            const length = rand(8, 12);
            for (let i = 0; i < length; i++) {
                username += chars.charAt(Math.floor(Math.random() * chars.length));
            }
email = `${username}@${domains[Math.floor(Math.random() * domains.length)]}`; } while (usedEmails.has(email)); usedEmails.add(email); return email; } async function waitForElement(selector, timeout = 15000) { const start = Date.now(); while (Date.now() - start < timeout) { if (window.__stopVoting) return null; const el = document.querySelector(selector); if (el) return el; await delay(200); } return null; } async function login() { if (window.__stopVoting) return false; const addVoteBtn = await waitForElement('button[aria-label="Add Vote"]'); if (!addVoteBtn) return false; await delay(rand(500, 1500)); addVoteBtn.click(); await delay(rand(800, 1500)); const emailInput = document.querySelector('input[id^="field-:"]'); if (!emailInput) return false; const email = generateUniqueEmail(); console.log(`📧 Generated email: ${email}`); const reactProps = Object.values(emailInput).find(x => x?.onChange); const fireEvent = value => ({ target: { value, name: emailInput.name, type: "email" }, currentTarget: { value, name: emailInput.name, type: "email" }, preventDefault: () => {}, stopPropagation: () => {}, persist: () => {}, nativeEvent: new InputEvent("input", { bubbles: true }) }); emailInput.focus(); reactProps?.onChange?.(fireEvent(email)); const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set; setter.call(emailInput, email); ['input', 'change'].forEach(type => emailInput.dispatchEvent(new Event(type, { bubbles: true }))); reactProps?.onBlur?.(fireEvent(email)); await delay(rand(400, 900)); const loginBtn = [...document.querySelectorAll('button.chakra-button')].find(btn => btn.textContent.trim().toLowerCase() === 'log in'); if (loginBtn && emailInput.value === email) { loginBtn.click(); console.log("🔐 Attempting login..."); } await delay(rand(1200, 2000)); return true; } async function openSection() { if (window.__stopVoting) return false; const btn = await waitForElement('#accordion-button-best-k-pop', 5000); if (!btn) return false; btn.scrollIntoView({ behavior: 'smooth', block: 'center' }); await delay(rand(800, 1500)); if (btn.getAttribute('aria-expanded') !== 'true') { btn.click(); await delay(rand(1000, 1500)); } return true; } async function voteJiminAuto() { if (window.__stopVoting) return false; const sectionOpen = await openSection(); if (!sectionOpen) return false; const heading = [...document.querySelectorAll("h3")].find(el => el.textContent.trim().toLowerCase() === "jimin"); if (!heading) return false; let btn = null, node = heading; for (let i = 0; i < 8 && !btn; i++) { node = node.nextElementSibling || node.parentElement; if (!node) break; btn = node.querySelector?.('button[aria-label="Add Vote"]') || (node.matches?.('button[aria-label="Add Vote"]') ? node : null); } if (!btn) return false; const display = btn.parentElement.querySelector('p.chakra-text') || btn.closest('div')?.querySelector?.('p.chakra-text'); let lastCount = -1; let stagnantTicks = 0; for (let i = 0; i < rand(120, 160); i++) { if (window.__stopVoting) return false; if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') break; btn.click(); await delay(rand(90, 160)); if (display) { const m = display.textContent.match(/\d+/); if (m) { const n = parseInt(m[0], 10); if (n === lastCount) { stagnantTicks++; } else { stagnantTicks = 0; lastCount = n; } if (stagnantTicks >= 5) break; } } } const confirm = async sel => { for (let i = 0; i < 50; i++) { if (window.__stopVoting) return null; const b = document.querySelector(sel); if (b && !b.disabled) return b; await delay(150); } }; (await confirm('button[type="button"]:not([disabled])'))?.click(); (await confirm('button.chakra-button.css-ufo2k5:not([disabled])'))?.click(); return true; } async function logoutAndLoopAgain() { if (window.__stopVoting) return; console.log("🔁 Submitting vote..."); await delay(rand(1500, 2500)); let logoutBtn = document.querySelector('button.chakra-button.AuthNav__login-btn.css-ki1yvo'); if (!logoutBtn) { logoutBtn = document.querySelector('#root > div > main > div.chakra-stack.chakra-container.css-8qrqqa > button'); } if (logoutBtn) { logoutBtn.click(); console.log("🚪 Logged out successfully"); } else { console.warn("⚠️ Logout button not found"); } const gap = rand(loopGapMin, loopGapMax); console.log(`⏳ Waiting ${gap}ms before next loop (this tab)...`); await delay(gap); runLoop(); } async function runLoop() { if (window.__stopVoting) { console.log("⛔ Voting stopped manually."); return; } if (!Number.isFinite(totalLoops) || isNaN(totalLoops)) { console.warn("⚠️ Invalid loop count."); return; } if (totalLoops !== 0 && currentLoop >= totalLoops) { console.log("✅ All loops completed."); return; } currentLoop++; console.log(`🔁 Loop ${currentLoop}/${totalLoops || '∞'}`); const loggedIn = await login(); if (!loggedIn) { console.warn("⚠️ Login failed"); return; } const voted = await voteJiminAuto(); if (!voted) { console.warn("⚠️ Vote failed"); return; } await logoutAndLoopAgain(); } window.addEventListener('DOMContentLoaded', () => {
        let loops = localStorage.getItem("vmaLoopCount");
        if (!loops) {
            loops = prompt("Enter number of loops (0 for infinite):", "0");
            loops = parseInt(loops, 10);
            if (isNaN(loops) || loops < 0) loops = 0;
            localStorage.setItem("vmaLoopCount", loops);
        } else {
            loops = parseInt(loops, 10);
        }
        currentLoop = 0;
        window.__stopVoting = false;
        totalLoops = loops;
        runLoop();
    }); })();