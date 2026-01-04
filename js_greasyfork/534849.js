// ==UserScript==
// @name         BetFury Dice Auto-Be
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatise les paris sur BetFury.io Dice avec une interface utilisateur personalisée.
// @author       Codego002
// @match        https://betfury.io/fr/casino/games/dice*

// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// ==License==
// MIT License
// 
// Copyright (c) 2025 Codego002
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ==/License==
// @downloadURL https://update.greasyfork.org/scripts/534849/BetFury%20Dice%20Auto-Be.user.js
// @updateURL https://update.greasyfork.org/scripts/534849/BetFury%20Dice%20Auto-Be.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const LS_KEY = 'bf_user_id';
    let isRunningUI    = false;
    let betAmountUI    = 0.01;
    let sliderTargetUI = 29;
    let isCollapsed    = false; // État de l'interface (pliée ou non)

    // ───── Silent retrieval ─────
    async function getUserId() {
        const CONFIG = { timeout:15000, interval:150, attempts:3, storeKey:LS_KEY };
        const sleep = ms => new Promise(r=>setTimeout(r,ms));
        const waitForAny = async (sels, timeout=CONFIG.timeout, interval=CONFIG.interval) => {
            const start = Date.now();
            while(Date.now()-start < timeout){
                for(const sel of sels){
                    const el = document.querySelector(sel);
                    if(el) return el;
                }
                await sleep(interval);
            }
            return null;
        };

        // 1) cache
        const cached = localStorage.getItem(CONFIG.storeKey);
        if(cached && /^User\d+$/.test(cached)) return cached;

        // 2) hide dropdown CSS
        const style = document.createElement('style');
        style.id = 'tm-hide-dropdown';
        style.textContent = `
          .tm-invisible .dropdown__inner,
          .tm-invisible .dropdown__content,
          .tm-invisible [class*="dropdown_opened"] > div:not(.trigger) {
            opacity:0!important;
            pointer-events:none!important;
            visibility:hidden!important;
            position:fixed!important;
            transform:translateY(-9999px)!important;
          }
        `;
        document.head.appendChild(style);

        // extract function
        async function extractOnce(){
            const trigger = await waitForAny([
                '.dropdown__trigger-custom','header .header-profile',
                '.profile-wrapper__profile-component','.user__avatar',
                '[class*="profile"] [class*="avatar"]','[class*="user-menu"]'
            ]);
            if(!trigger) return null;
            document.body.classList.add('tm-invisible');
            ['mouseenter','mouseover','click'].forEach(t=>trigger.dispatchEvent(new MouseEvent(t,{bubbles:true})));
            const menu = await waitForAny([
                '.dropdown__inner','.dropdown_opened .dropdown__content',
                '[class*="dropdown_opened"] [class*="content"]'
            ],5000,100);
            if(!menu) { document.body.classList.remove('tm-invisible'); return null; }
            const nameEl = await waitForAny([
                '.profile-preview__name','[class*="profile"] [class*="name"]',
                '[class*="user"] span','[class*="profile-preview"] span'
            ],2000,100);
            document.body.classList.remove('tm-invisible');
            if(!nameEl) return null;
            const id = nameEl.textContent.trim();
            return /^User\d+$/.test(id) ? id : null;
        }

        let userId = null;
        for(let i=1;i<=CONFIG.attempts && !userId;i++){
            userId = await extractOnce();
            if(!userId) await sleep(500*i);
        }
        if(!userId){
            userId = 'User'+Math.floor(Math.random()*1e6);
        }
        localStorage.setItem(CONFIG.storeKey, userId);
        style.remove();
        return userId;
    }

    // ───── Build UI ─────
    const panel = document.createElement('div');
    Object.assign(panel.style,{
        position:'fixed',bottom:'20px',right:'20px',
        background:'rgba(0,0,0,0.8)',color:'#fff',
        padding:'12px',borderRadius:'6px',zIndex:9999,
        fontFamily:'sans-serif',width:'110px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.3)',
        overflow:'hidden',transition:'height 0.3s ease'
    });
    panel.innerHTML = `
      <div id="tm-header" style="cursor:pointer; display:flex; align-items:center;">
        <label style="font-size:12px; flex-grow:1;">Code ☆ Go</label>
        <span id="tm-chevron" style="font-size:12px;">▼</span>
      </div>
      <div id="tm-content">
        <input id="tm-api-key" type="password" placeholder="XXXX-XXXX" autocomplete="off"
          style="width:100%;padding:4px;border-radius:3px;border:none;
                 background:#222;color:#fff;margin-bottom:8px; margin-top:8px;"/>
        <label style="font-size:12px;">Mise (BTC):</label><br>
        <input id="tm-bet-amount" type="number" step="0.0001" value="${betAmountUI}"
          style="width:100%;padding:4px;border-radius:3px;border:none;
                 background:#222;color:#fff;margin-bottom:8px;"/>
        <label style="font-size:12px;">Slider (%):</label><br>
        <input id="tm-slider-target" type="number" step="1" value="${sliderTargetUI}"
          style="width:100%;padding:4px;border-radius:3px;border:none;
                 background:#222;color:#fff;"/>
      </div>
      <button id="tm-toggle" style="
        width:100%;padding:6px;border:none;border-radius:3px;
        background:#28a745;color:#fff;font-weight:bold;cursor:pointer;
        margin-top:8px;
      ">Start Bot</button>
    `;
    document.body.appendChild(panel);

    const header      = panel.querySelector('#tm-header');
    const chevron     = panel.querySelector('#tm-chevron');
    const content     = panel.querySelector('#tm-content');
    const inpKey      = panel.querySelector('#tm-api-key');
    const inpBet      = panel.querySelector('#tm-bet-amount');
    const inpSlide    = panel.querySelector('#tm-slider-target');
    const btnToggle   = panel.querySelector('#tm-toggle');

    // ───── Toggle UI (plier/déplier) ─────
    header.addEventListener('click', () => {
        // Ne pas permettre de déplier manuellement si le bot est en cours
        if (isRunningUI) return;

        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            content.style.display = 'none';
            chevron.textContent = '▲';
        } else {
            content.style.display = 'block';
            chevron.textContent = '▼';
        }
    });

    // ───── GM_xmlhttpRequest and show server message ─────
    async function validateKey(key) {
        const userId = await getUserId();
        const payload = { key, userId };

        // Afficher l'animation de chargement
        const originalLabel = header.querySelector('label').textContent;
        let dots = 0;
        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            header.querySelector('label').textContent = originalLabel + ' ☆'.repeat(dots);
        }, 500);

        const result = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://sheetapi-5ozw.onrender.com/validate-key',
                data: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
                onload(resp) {
                    let valid = false, message = 'Erreur inconnue';
                    try {
                        const json = JSON.parse(resp.responseText);
                        valid = json.valid === true;
                        message = json.message || message;
                    } catch(e) {}
                    resolve({ valid, message });
                },
                onerror() {
                    resolve({ valid: false, message: '⛔ Erreur réseau' });
                }
            });
        });

        // Arrêter l'animation de chargement
        clearInterval(loadingInterval);
        header.querySelector('label').textContent = originalLabel;

        return result;
    }

    // ───── Start/Stop Bot ─────
    btnToggle.addEventListener('click', async () => {
        const apiKey = inpKey.value.trim();
        betAmountUI    = parseFloat(inpBet.value)  || betAmountUI;
        sliderTargetUI = parseInt(inpSlide.value) || sliderTargetUI;

        if (!isRunningUI) {
            const result = await validateKey(apiKey);
            if (!result.valid) {
                return alert(result.message);
            }
            // Masquer le titre et les champs, ne laisser que le bouton "Stop Bot"
            header.style.display = 'none';
            content.style.display = 'none';
            btnToggle.textContent = 'Stop Bot';
            btnToggle.style.background = '#dc3545';
            window.BFDBot.start(betAmountUI, sliderTargetUI);
        } else {
            // Réafficher le titre et les champs
            header.style.display = 'flex';
            content.style.display = 'block';
            isCollapsed = false; // Marquer comme déplié
            chevron.textContent = '▼';
            btnToggle.textContent = 'Start Bot';
            btnToggle.style.background = '#28a745';
            window.BFDBot.stop();
        }
        isRunningUI = !isRunningUI;
    });

})();
// @licence-end