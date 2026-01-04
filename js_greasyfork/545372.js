// ==UserScript==
// @name         Endless 自动战斗 + 自动技能（样式修复版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击战斗按钮与技能，带可拖动面板、位置与状态记忆，深色样式避免白色遮挡
// @match        https://www.ghost-team.top/endless*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545372/Endless%20%E8%87%AA%E5%8A%A8%E6%88%98%E6%96%97%20%2B%20%E8%87%AA%E5%8A%A8%E6%8A%80%E8%83%BD%EF%BC%88%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545372/Endless%20%E8%87%AA%E5%8A%A8%E6%88%98%E6%96%97%20%2B%20%E8%87%AA%E5%8A%A8%E6%8A%80%E8%83%BD%EF%BC%88%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // helpers for localStorage keys
    const POS_KEY = 'endlessControlPos_v1';
    const BATTLE_KEY = 'endlessAutoBattle_v1';
    const SKILL_KEY = 'endlessAutoSkill_v1';

    // load saved position & states
    let savedPos = JSON.parse(localStorage.getItem(POS_KEY) || '{}');
    function parseCoord(v, fallback) {
        if (typeof v === 'number') return v;
        if (!v) return fallback;
        const n = parseInt(v);
        return isFinite(n) ? n : fallback;
    }
    let startTop = parseCoord(savedPos.top, 80);
    let startLeft = parseCoord(savedPos.left, 80);
    let autoBattle = localStorage.getItem(BATTLE_KEY) === 'true';
    let autoSkill = localStorage.getItem(SKILL_KEY) === 'true';

    // create container (dark translucent so it won't blend into light pages)
    const container = document.createElement('div');
    container.id = 'endless-control-panel';
    container.style.cssText = [
        `position: fixed`,
        `top: ${startTop}px`,
        `left: ${startLeft}px`,
        `z-index: 999999`,
        `background: rgba(18,18,20,0.86)`,      // 深色半透明背景，修复“全白”问题
        `color: #fff`,
        `padding: 10px`,
        `border-radius: 10px`,
        `border: 1px solid rgba(255,255,255,0.08)`,
        `box-shadow: 0 6px 18px rgba(0,0,0,0.6)`,
        `min-width: 170px`,
        `font-family: Arial, sans-serif`,
        `font-size: 13px`,
        `user-select: none`,
        `display: flex`,
        `flex-direction: column`,
        `gap: 8px`
    ].join(';');
    document.body.appendChild(container);

    // title row
    const title = document.createElement('div');
    title.textContent = '自动控制面板';
    title.style.cssText = 'font-weight:600; color:#fff; opacity:0.95;';
    container.appendChild(title);

    // create a labeled row (text + switch)
    function createRow(labelText, initialChecked) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:8px;';
        const label = document.createElement('div');
        label.textContent = labelText;
        label.style.cssText = 'color:#fff; font-size:13px; white-space:nowrap;';
        // make custom switch
        const sw = document.createElement('label');
        sw.className = 'no-drag'; // 标记为不可拖动区域
        sw.style.cssText = 'position:relative; display:inline-block; width:46px; height:26px;';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = initialChecked;
        input.style.cssText = 'display:none;';

        const slider = document.createElement('span');
        slider.style.cssText = [
            'position:absolute', 'top:0', 'left:0', 'right:0', 'bottom:0',
            `background:${initialChecked ? '#28a745' : '#666'}`,
            'border-radius:16px',
            'transition:background .18s ease',
            'display:block'
        ].join(';');

        const knob = document.createElement('span');
        knob.style.cssText = [
            'position:absolute', 'top:4px',
            `left:${initialChecked ? '24px' : '4px'}`,
            'width:18px', 'height:18px', 'background:#fff',
            'border-radius:50%', 'transition:left .18s ease'
        ].join(';');

        slider.appendChild(knob);
        sw.appendChild(input);
        sw.appendChild(slider);
        row.appendChild(label);
        row.appendChild(sw);

        // change handler updates visuals and returns checked state through event
        input.addEventListener('change', () => {
            const on = input.checked;
            slider.style.background = on ? '#28a745' : '#666';
            knob.style.left = on ? '24px' : '4px';
            const ev = new CustomEvent('switch-change', { detail: on });
            sw.dispatchEvent(ev);
        });

        // clicking label or slider toggles checkbox
        sw.addEventListener('click', (e) => {
            // already protected from drag via no-drag check at mousedown in drag logic
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change'));
        });

        return { row, sw, input };
    }

    // rows
    const battleRow = createRow('自动战斗开关', autoBattle);
    const skillRow = createRow('自动技能开关', autoSkill);

    container.appendChild(battleRow.row);
    container.appendChild(skillRow.row);

    // store switch references
    const battleInput = battleRow.input;
    const skillInput = skillRow.input;

    // update localStorage when change
    battleRow.sw.addEventListener('switch-change', (e) => {
        autoBattle = !!e.detail;
        localStorage.setItem(BATTLE_KEY, String(autoBattle));
    });
    skillRow.sw.addEventListener('switch-change', (e) => {
        autoSkill = !!e.detail;
        localStorage.setItem(SKILL_KEY, String(autoSkill));
    });

    // initialize visuals (in case state came from localStorage)
    (function initVisuals() {
        // trigger manual visuals update without firing events to storage (already loaded)
        const setVisual = (input) => {
            const sl = input.nextSibling;
            if (!sl) return;
            sl.style.background = input.checked ? '#28a745' : '#666';
            const knob = sl.firstChild;
            if (knob) knob.style.left = input.checked ? '24px' : '4px';
        };
        setVisual(battleInput);
        setVisual(skillInput);
    })();

    // dragging logic: avoid starting drag when clicking elements with class 'no-drag'
    (function makeDraggable(el) {
        let dragging = false;
        let offsetX = 0, offsetY = 0;
        let startX = 0, startY = 0;
        el.addEventListener('mousedown', function (e) {
            // if clicked inside a no-drag element (switch), do NOT start drag
            if (e.target.closest('.no-drag')) return;
            e.preventDefault();
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
        function onMove(e) {
            if (!dragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            // keep inside viewport (optional)
            const pad = 8;
            newLeft = Math.max(pad - el.offsetWidth + 30, Math.min(newLeft, window.innerWidth - pad));
            newTop = Math.max(pad - el.offsetHeight + 30, Math.min(newTop, window.innerHeight - pad));
            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
        }
        function onUp() {
            if (!dragging) return;
            dragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            // save position
            localStorage.setItem(POS_KEY, JSON.stringify({
                top: parseInt(container.style.top, 10),
                left: parseInt(container.style.left, 10)
            }));
        }
    })(container);

    // Core auto functions
    function checkBattle() {
        if (!autoBattle) return;
        const btn = document.querySelector('#start-btn');
        if (btn && btn.textContent && btn.textContent.trim() === '战斗') {
            console.log('[自动战斗] 点击战斗按钮');
            btn.click();
        }
    }

    function checkSkills() {
        if (!autoSkill) return;
        // 点击所有不含 active 且 不含 on-cooldown 的 skill-slot
        document.querySelectorAll('.skill-slot').forEach(slot => {
            if (!slot.classList.contains('active') && !slot.classList.contains('on-cooldown')) {
                // 防止误点有特殊绑定的元素，点击自身通常触发技能
                try {
                    slot.click();
                    // debug
                    // console.log('[自动技能] 点击', slot.dataset.skillId || slot);
                } catch (e) {
                    console.warn('[自动技能] 点击失败', e);
                }
            }
        });
    }

    // 轮询检测（200ms）
    setInterval(() => {
        // update local state from inputs (in case toggled visually)
        autoBattle = battleInput.checked;
        autoSkill = skillInput.checked;
        checkBattle();
        checkSkills();
    }, 200);

    // accessibility: allow pressing Esc to hide/show panel
    let visible = true;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            visible = !visible;
            container.style.display = visible ? 'flex' : 'none';
        }
    });

    console.log('Endless 控制面板已加载（深色样式）');
})();
