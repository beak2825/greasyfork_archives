// ==UserScript==
// @name         Doobie BlackJack'n | A Martingale Based Blackjack Script for Torn City
// @namespace    http://tampermonkey.net/Doobie-BlackJack'n
// @version      1.0.0
// @description  A Simple draggable Martingale betting window equipped with customizable multipliers and 8 different betting buttons. Works On PDA
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=blackjack*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545133/Doobie%20BlackJack%27n%20%7C%20A%20Martingale%20Based%20Blackjack%20Script%20for%20Torn%20City.user.js
// @updateURL https://update.greasyfork.org/scripts/545133/Doobie%20BlackJack%27n%20%7C%20A%20Martingale%20Based%20Blackjack%20Script%20for%20Torn%20City.meta.js
// ==/UserScript==

//::::::::::-+#@@@@@@@@#::::::::::::::::::::+@@@@@*::::::::::::::=--:::::::::::::::::::::
//:::::::#@@%-:::::::::-@+:::::::::::::::::#@-::-@*::%@@@@:::::::+::=+:::::::::::::::::::
//::::=@%=:::-+%@@@@#:::%@::=+=:::::::::::*@-::#@-::%@::=@=:::::--=:-::-:::::::::::::::::
//:::@@:::-@@@-:%@@@@:::@@@@+-%@::*@@@@@+*@-::@@@@:@@@-#@@@@@@@-:--::::=:=:::::::::::::::
//::@%::-@@@+::+@@@@+::@*:::-::@@@=::::+@@::-+:::@@*:::@@+::::#@:=::::::=::::::::::::::::
//:-@-:-@@@::+@@@@@+::%-:::#%:=@=:::@*:*@-:::-:::@+::=@+::-%#:*@-=-::::::=:::::::::::::::
//::%@=:::::#@@@@@-::%:::::@-:%:::::@::@-::-@#::++::*@:::%@=:=@+::*-:::--::::::::::::::::
//:::-#@@::#@@@@@:::%+::@-:-:*-::%::::#-::*@#::--::*@-::@+::#@%@::+-:::-:::::::::::::::::
//::::=@=:-@@@*::::-=::#@%::::::*@#::::::#@=::::::+@*:::::*@@:%%::+=::::-::::::::::::::::
//::::+@-=+:--:::*@+#::-::-@@@:::::=@+::::::::*-::=::::@@@#-:@@:::+=::::+::::::::::::::::
//::::@@::#::::=@@::*+:::@@=-@%::+@@@*:-+::-@@@::::#@::::::%@*::::+=::::+-:::::::::::::::
//:::@+::::::#@@%:::=@@@#-::::+@@@@@@@@@@%%*::+@@@@@%@@@@@#=:::--:+=::::-==::::::::::::::
//:::@@:::%@@=*@::::=@=:::::%@@@@@-::::#@::::::::::::::::::::#@=+@::::::-%--=::::::::::::
//:#%:=%%::+@#@+::::=@--*@@#--@@%:::::::%#::::::::::::::::::#@::*@:::-=-%=##=-:::::::::::
//:+@@=+@-:::@@:::::*@@@-:::-@@@#::+@%:-@@@@-:%@@=::*@@@@#:-@::+@@@@%-:%@@#%@@@+%@@%-::::
//:-@*@@@%:::-%::::-@+:::::+@@@@@+::@@@@@::%%@=:*@%@-::::+@@=:-@#:::=@@+:=@@*:**:::-@::::
//::*@--#@+::-=::::+::::::%@@-:-@@+::@%@::-@@*::@@*::*%:::@%::%*::::#@*::@@#:::::::-@--::
//:::%@-::::#*@-:%#+:::-@@@@:::#@@%:::@+::%@#::=@@::-@@-=@@::::::@@@@#::-@@-::*@@::#@%+@-
//::::+@#:::*%=:::**-=***++=::::::::::@:::::::::::::::+*+:::::@-:::::::::::::-@@-:::::@*:
//::::::+@@#:=+-@@-:::::::#@:::::::::*@::::==::::%-::::::=+:::@*:::::=::::-::=@@:::::@*::
//::-@@@%+:::+*+::+###@@@@:=@*:::::-@%%%+*@@@++#@*@%+++%@%@*+@#@#+*@@@*+#@@++@#@%++%@-:::
//:::::-%@@@@%+@@-:-@@@@+::::-%@@@@+:::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::*@#@*:*%@@@*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Made with Love by Doobiesuckin [3255641] | Check out my Other Scripts! o7

(function () {
    'use strict';

    function parseBet(input) {
        if (!input) return null;
        input = input.toLowerCase().replace(/,/g, '').trim();
        let multiplier = 1;
        if (input.endsWith('k')) {
            multiplier = 1000;
            input = input.slice(0, -1);
        } else if (input.endsWith('m')) {
            multiplier = 1000000;
            input = input.slice(0, -1);
        }
        const value = parseFloat(input);
        if (isNaN(value) || value <= 0) return null;
        return Math.floor(value * multiplier);
    }

    function formatBet(value) {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`.replace('.0M', 'M');
        else if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        else return value.toString();
    }

    function setBetValue(value) {
        const visibleInput = document.querySelector('.bet.input-money:not([type="hidden"])');
        const hiddenInput = document.querySelector('input[name="bet"][type="hidden"]');
        if (!visibleInput || !hiddenInput) return false;
        visibleInput.value = value.toString();
        hiddenInput.value = value.toString();
        visibleInput.dispatchEvent(new Event('input', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        visibleInput.dispatchEvent(new Event('change', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    function calculateBets(baseBet, multiplier) {
        const bets = [];
        for (let i = 0; i < 8; i++) {
            let bet = Math.round(baseBet * Math.pow(multiplier, i));
            if (bet > 100000000) bet = 100000000;
            bets.push(bet);
        }
        return bets;
    }

    function createWindow() {
        let savedLeft = parseInt(localStorage.getItem('martingale_window_left')) || 20;
        let savedTop = parseInt(localStorage.getItem('martingale_window_top')) || 100;
        const maxLeft = window.innerWidth - 280;
        const maxTop = window.innerHeight - 100;
        savedLeft = Math.max(10, Math.min(savedLeft, maxLeft));
        savedTop = Math.max(50, Math.min(savedTop, maxTop));
        const windowEl = document.createElement('div');
        windowEl.id = 'martingale-window';
        windowEl.style.cssText = `position:fixed;top:${savedTop}px;left:${savedLeft}px;width:260px;background:#2a2a2a;border:2px solid #444;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.8);z-index:10000;font-family:Arial,sans-serif;touch-action:none;`;
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `background:#444;padding:8px 12px;border-radius:6px 6px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;color:white;font-size:12px;font-weight:bold;user-select:none;`;
        const title = document.createElement('span');
        title.textContent = 'Doobie Blackjackin';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;gap:4px;';
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-btn';
        toggleBtn.textContent = '_';
        toggleBtn.style.cssText = `background:#f39c12;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;`;
        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-btn';
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `background:#ff4757;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;`;
        buttonContainer.appendChild(toggleBtn);
        buttonContainer.appendChild(closeBtn);
        titleBar.appendChild(title);
        titleBar.appendChild(buttonContainer);
        const content = document.createElement('div');
        content.id = 'window-content';
        content.style.cssText = `padding:12px;transition:all 0.3s ease;`;
        windowEl.appendChild(titleBar);
        windowEl.appendChild(content);
        let isMinimized = localStorage.getItem('martingale_minimized') === 'true';
        function toggleWindow() {
            if (isMinimized) {
                content.style.display = 'block';
                content.style.height = 'auto';
                content.style.opacity = '1';
                windowEl.style.width = '260px';
                toggleBtn.textContent = '_';
                isMinimized = false;
            } else {
                content.style.display = 'none';
                windowEl.style.width = 'auto';
                toggleBtn.textContent = '+';
                isMinimized = true;
            }
            localStorage.setItem('martingale_minimized', isMinimized.toString());
        }
        if (isMinimized) toggleWindow();
        toggleBtn.addEventListener('click', e => { e.stopPropagation(); toggleWindow(); });
        closeBtn.addEventListener('click', e => { e.stopPropagation(); windowEl.remove(); });
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        titleBar.addEventListener('mousedown', startDrag);
        titleBar.addEventListener('touchstart', startDrag, { passive: false });
        function startDrag(e) {
            if (e.target.id === 'close-btn' || e.target.id === 'toggle-btn') return;
            e.preventDefault();
            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            dragOffset.x = clientX - windowEl.offsetLeft;
            dragOffset.y = clientY - windowEl.offsetTop;
            titleBar.style.cursor = 'grabbing';
        }
        function handleDrag(e) {
            if (isDragging) {
                e.preventDefault();
                const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                let newLeft = clientX - dragOffset.x;
                let newTop = clientY - dragOffset.y;
                newLeft = Math.max(10, Math.min(newLeft, window.innerWidth - 280));
                newTop = Math.max(10, Math.min(newTop, window.innerHeight - 100));
                windowEl.style.left = newLeft + 'px';
                windowEl.style.top = newTop + 'px';
                windowEl.style.right = 'auto';
            }
        }
        function endDrag() {
            if (isDragging) {
                localStorage.setItem('martingale_window_left', parseInt(windowEl.style.left).toString());
                localStorage.setItem('martingale_window_top', parseInt(windowEl.style.top).toString());
                isDragging = false;
                titleBar.style.cursor = 'move';
            }
        }
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('touchmove', handleDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        return { window: windowEl, content };
    }

    function createUI(container, settings, onChange) {
        container.innerHTML = '';
        const baseBetBtn = document.createElement('button');
        baseBetBtn.textContent = `Base: ${formatBet(settings.baseBet)}`;
        baseBetBtn.style.cssText = `width:100%;padding:10px;margin-bottom:8px;background:#27AE60;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;`;
        baseBetBtn.addEventListener('click', () => {
            const input = prompt(`Current base bet: ${formatBet(settings.baseBet)}\n\nEnter new base bet (e.g., 100k, 1m):`);
            const newBet = parseBet(input);
            if (newBet) { settings.baseBet = newBet; onChange(); } else if (input) alert('Invalid format. Use: 100k, 1m, etc.');
        });
        container.appendChild(baseBetBtn);
        const playBtn = document.createElement('button');
        playBtn.textContent = 'PLAY';
        playBtn.style.cssText = `width:100%;padding:10px;margin-bottom:12px;background:#E74C3C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;`;
        playBtn.addEventListener('click', () => {
            const realPlayButton = document.querySelector('a.startGame[data-step="startGame"]') || document.querySelector('.startGame') || document.querySelector('a[data-step="startGame"]');
            if (realPlayButton) {
                realPlayButton.click();
                playBtn.style.background = '#C0392B';
                setTimeout(() => { playBtn.style.background = '#E74C3C'; }, 200);
            }
        });
        container.appendChild(playBtn);
        const multLabel = document.createElement('div');
        multLabel.textContent = 'Multiplier';
        multLabel.style.cssText = `color:#ccc;font-size:11px;margin-bottom:6px;text-align:center;`;
        container.appendChild(multLabel);
        const multGrid = document.createElement('div');
        multGrid.style.cssText = `display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;`;
        const multipliers = [1.5, 2, 2.5, 3, 4];
        multipliers.forEach(mult => {
            const btn = document.createElement('button');
            btn.textContent = `${mult}x`;
            btn.style.cssText = `padding:6px 4px;font-size:10px;border:none;border-radius:3px;cursor:pointer;font-weight:bold;${settings.multiplier === mult ? 'background:#3498DB;color:white;' : 'background:#555;color:#ccc;'}`;
            btn.addEventListener('click', () => { settings.multiplier = mult; onChange(); });
            multGrid.appendChild(btn);
        });
        container.appendChild(multGrid);
        const bets = calculateBets(settings.baseBet, settings.multiplier);
        const betGrid = document.createElement('div');
        betGrid.style.cssText = `display:grid;grid-template-columns:repeat(4,1fr);gap:6px;`;
        bets.forEach((bet, index) => {
            const btn = document.createElement('button');
            btn.textContent = `${index + 1}`;
            btn.title = `${formatBet(bet)}${bet === 100000000 ? ' (MAX)' : ''}`;
            btn.style.cssText = `padding:10px 6px;font-size:12px;font-weight:bold;border:none;border-radius:4px;cursor:pointer;transition:all 0.2s;${bet === 100000000 ? 'background:#F39C12;color:white;' : 'background:#2ECC71;color:white;'}`;
            btn.addEventListener('click', () => {
                if (setBetValue(bet)) {
                    const originalBg = btn.style.background;
                    btn.style.background = '#ECF0F1';
                    btn.style.color = '#2C3E50';
                    setTimeout(() => { btn.style.background = originalBg; btn.style.color = 'white'; }, 200);
                }
            });
            betGrid.appendChild(btn);
        });
        container.appendChild(betGrid);
    }

    function init() {
        if (document.getElementById('martingale-window')) return;
        let settings = {
            baseBet: parseInt(localStorage.getItem('martingale_base_bet')) || 100000,
            multiplier: parseFloat(localStorage.getItem('martingale_multiplier')) || 2
        };
        function saveAndUpdate() {
            localStorage.setItem('martingale_base_bet', settings.baseBet.toString());
            localStorage.setItem('martingale_multiplier', settings.multiplier.toString());
            createUI(content, settings, saveAndUpdate);
        }
        const { window, content } = createWindow();
        createUI(content, settings, saveAndUpdate);
        document.body.appendChild(window);
    }

    if (location.href.includes('blackjack')) setTimeout(init, 1000);
    const observer = new MutationObserver(() => {
        if (location.href.includes('blackjack')) setTimeout(init, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
