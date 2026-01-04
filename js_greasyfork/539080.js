// ==UserScript==
// @name         Autonomous bot v0.02
// @namespace    https://tempermonkey.net/
// @version      0.02
// @description  A fully autonomous bot for Gats.io. Patrols, aims, shoots, avoids obstacles, and can escort teammates.
// @author       zeroarcop & AI Assistant
// @license      MIT
// @match        https://gats.io/
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539080/Autonomous%20bot%20v002.user.js
// @updateURL https://update.greasyfork.org/scripts/539080/Autonomous%20bot%20v002.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================================
    // Autonomous Bot Logic - v0.02
    // ===================================================================================
    class AutonomousBot {
        constructor(gatsMod) {
            this.mod = gatsMod;
            this.state = 'IDLE'; // 状態: IDLE, MOVING_TO_ZONE, PATROLLING, EVADING, ESCORTING
            this.patrolZone = { minX: 2500, maxX: 4500, minY: 2500, maxY: 4500 };
            this.targetPosition = null;

            // 護衛モード関連
            this.escortTargetId = null;
            this.escortTargetName = "";
            this.ESCORT_DISTANCE = 200; // 護衛対象との維持距離

            // スタック検出用
            this.stuckCheckHistory = [];
            this.STUCK_CHECK_DURATION = 2000;
            this.STUCK_DISTANCE_THRESHOLD = 30;

            // 障害物回避用
            this.isEvading = false;
            this.evadeStartTime = 0;
            this.EVADE_DURATION = 1000;
            this.lastPatrolTargetTime = 0;
        }

        /**
         * BOTのメインアップデート関数。毎フレーム呼び出される。
         * @param {object} me - プレイヤー自身のオブジェクト
         */
        update(me) {
            if (!me || !me.activated) {
                this.state = 'IDLE';
                this.mod.updateSimulatedKeys([]);
                return;
            }

            // 1. 護衛対象の状態をチェック
            this.checkEscortTargetStatus();

            // 2. スタック状態をチェック
            if (this.isStuck(me)) {
                this.startEvading(me);
            }

            // 3. 回避状態の処理
            if (this.isEvading) {
                if (performance.now() - this.evadeStartTime > this.EVADE_DURATION) {
                    this.isEvading = false;
                    this.targetPosition = null;
                    this.state = 'IDLE';
                }
            }

            // 4. 状態決定（回避中でなければ）
            if (!this.isEvading) {
                if (this.escortTargetId) {
                    this.state = 'ESCORTING';
                } else {
                    this.state = this.isInPatrolZone(me) ? 'PATROLLING' : 'MOVING_TO_ZONE';
                }
            }

            // 5. 状態に基づいた行動
            switch (this.state) {
                case 'ESCORTING':
                    const escortTarget = Player.pool[this.escortTargetId];
                    if (escortTarget) {
                        // 護衛対象から一定距離離れた位置を目標にする
                        const distToTarget = getDistance(me, escortTarget);
                        if (distToTarget > this.ESCORT_DISTANCE) {
                            this.targetPosition = { x: escortTarget.x, y: escortTarget.y };
                        } else {
                            // 近い場合は動きを止めるか、ゆっくり周回する
                            this.targetPosition = null; // nullにするとmoveToTargetが呼ばれず、慣性で停止する
                        }
                    }
                    break;

                case 'MOVING_TO_ZONE':
                    if (!this.targetPosition || this.stateChangedFromPatrol) {
                        this.targetPosition = this.getCenterOfZone();
                        this.stateChangedFromPatrol = false;
                    }
                    break;

                case 'PATROLLING':
                    const arrived = this.targetPosition && getDistance(me, this.targetPosition) < 50;
                    if (!this.targetPosition || arrived || performance.now() - this.lastPatrolTargetTime > 15000) {
                        this.setNewPatrolTarget();
                    }
                    break;
            }

            // 6. ターゲットへの移動
            if (this.targetPosition) {
                this.moveToTarget(me, this.targetPosition);
            } else if (this.state !== 'ESCORTING') {
                 this.mod.updateSimulatedKeys([]); // 移動ターゲットがない場合は停止
            }
        }

        setEscortTarget(playerId, playerName) {
            if (Player.pool[playerId]) {
                this.escortTargetId = playerId;
                this.escortTargetName = playerName;
                this.state = 'ESCORTING';
                this.targetPosition = null; // パトロール目標をクリア
                modLog(`Now escorting: ${playerName}`);
                gatsModInstance.simpleGui.updateEscortStatusDisplay();
            }
        }

        stopEscorting() {
            modLog(`Stopped escorting: ${this.escortTargetName}`);
            this.escortTargetId = null;
            this.escortTargetName = "";
            this.state = 'IDLE'; // 状態をリセットして再評価
            gatsModInstance.simpleGui.updateEscortStatusDisplay();
        }

        checkEscortTargetStatus() {
            if (!this.escortTargetId) return;
            const target = Player.pool[this.escortTargetId];
            if (!target || !target.activated) {
                modLog(`Escort target ${this.escortTargetName} lost. Returning to patrol.`);
                this.stopEscorting();
            }
        }

        isInPatrolZone(player) { return player.x >= this.patrolZone.minX && player.x <= this.patrolZone.maxX && player.y >= this.patrolZone.minY && player.y <= this.patrolZone.maxY; }
        getCenterOfZone() { return { x: (this.patrolZone.minX + this.patrolZone.maxX) / 2, y: (this.patrolZone.minY + this.patrolZone.maxY) / 2 }; }
        setNewPatrolTarget() {
            this.targetPosition = { x: this.patrolZone.minX + Math.random() * (this.patrolZone.maxX - this.patrolZone.minX), y: this.patrolZone.minY + Math.random() * (this.patrolZone.maxY - this.patrolZone.minY) };
            this.lastPatrolTargetTime = performance.now();
            modLog(`New patrol target: {x: ${Math.round(this.targetPosition.x)}, y: ${Math.round(this.targetPosition.y)}}`);
        }

        isStuck(me) {
            const now = performance.now();
            this.stuckCheckHistory.push({ x: me.x, y: me.y, time: now });
            this.stuckCheckHistory = this.stuckCheckHistory.filter(p => now - p.time < this.STUCK_CHECK_DURATION);
            if (this.stuckCheckHistory.length < 10) return false;
            const isTryingToMove = Object.values(this.mod.simulatedKeys).some(k => k === true);
            if (!isTryingToMove) return false;
            const startPoint = this.stuckCheckHistory[0];
            const distanceMoved = getDistance(me, startPoint);
            return distanceMoved < this.STUCK_DISTANCE_THRESHOLD;
        }

        startEvading(me) {
            if (this.isEvading) return;
            this.isEvading = true;
            this.evadeStartTime = performance.now();
            this.state = 'EVADING';
            modLog("Stuck detected! Starting evasion.");
            const vectorToTarget = this.targetPosition ? { x: this.targetPosition.x - me.x, y: this.targetPosition.y - me.y } : { x: 1, y: 0 };
            const rand = Math.random() > 0.5 ? 1 : -1;
            const evadeVector = { x: -vectorToTarget.y, y: vectorToTarget.x };
            const mag = Math.hypot(evadeVector.x, evadeVector.y);
            const normEvadeVector = mag > 0 ? { x: evadeVector.x / mag, y: evadeVector.y / mag } : { x: 1, y: 0};
            this.targetPosition = { x: me.x + normEvadeVector.x * 200 * rand, y: me.y + normEvadeVector.y * 200 * rand };
            this.stuckCheckHistory = [];
        }

        moveToTarget(me, targetPos) {
            const { maxSpeed, ACCELERATION, FRICTION } = this.mod.getBotPhysics(me);
            const dx = targetPos.x - me.x;
            const dy = targetPos.y - me.y;
            const distance = Math.hypot(dx, dy);
            let desiredSpdX = 0, desiredSpdY = 0;
            const stopDistance = 30;
            if (distance > stopDistance) {
                const brakingFactor = 12.0;
                const desiredSpeed = Math.min(maxSpeed, distance / brakingFactor);
                desiredSpdX = (dx / distance) * desiredSpeed;
                desiredSpdY = (dy / distance) * desiredSpeed;
            }
            const requiredAccelX = (desiredSpdX / FRICTION) - this.mod.botSpdX;
            const requiredAccelY = (desiredSpdY / FRICTION) - this.mod.botSpdY;
            let keysToPress = [], isPressingKeyX = 0, isPressingKeyY = 0;
            const keyPressThreshold = ACCELERATION * 0.1;
            if (requiredAccelX > keyPressThreshold) { keysToPress.push('d'); isPressingKeyX = 1; }
            else if (requiredAccelX < -keyPressThreshold) { keysToPress.push('a'); isPressingKeyX = -1; }
            if (requiredAccelY > keyPressThreshold) { keysToPress.push('s'); isPressingKeyY = 1; }
            else if (requiredAccelY < -keyPressThreshold) { keysToPress.push('w'); isPressingKeyY = -1; }
            this.mod.updateSimulatedKeys(keysToPress);
            let appliedAccelX = isPressingKeyX * ACCELERATION;
            let appliedAccelY = isPressingKeyY * ACCELERATION;
            if (isPressingKeyX !== 0 && isPressingKeyY !== 0) {
                appliedAccelX *= GatsModCore.PLAYER_SPEEDS.diagonalCorrection;
                appliedAccelY *= GatsModCore.PLAYER_SPEEDS.diagonalCorrection;
            }
            this.mod.botSpdX = (this.mod.botSpdX + appliedAccelX) * FRICTION;
            this.mod.botSpdY = (this.mod.botSpdY + appliedAccelY) * FRICTION;
            const currentSimulatedSpeed = Math.hypot(this.mod.botSpdX, this.mod.botSpdY);
            if (currentSimulatedSpeed > maxSpeed) {
                const ratio = maxSpeed / currentSimulatedSpeed;
                this.mod.botSpdX *= ratio;
                this.mod.botSpdY *= ratio;
            }
        }
    }

    const SETTINGS_KEY = 'zeroarcop_gats_mod_settings_v2';
    const LOG_PREFIX_MOD = "[zeroarcop-gats-mod]";

    function modLog(message, isError = false) {
        const finalMessage = `${LOG_PREFIX_MOD} ${message}`;
        if (isError) console.error(finalMessage);
        else console.log(finalMessage);
    }

    function getDistance(p1, p2) {
        if (!p1 || !p2) return Infinity;
        return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
    }

    class ColorCustomizerGUI {
        constructor() {
            this.container = document.createElement('div'); this.container.id = 'zeroarcop-gats-color-gui'; this.container.style.display = 'none'; document.body.appendChild(this.container); this.applyStyles(); const head = document.createElement('h4'); head.innerText = 'ESP Color Settings'; this.container.appendChild(head); this.makeDraggable(head, this.container);
            this.addColorPicker('Enemy Box/Line', 'enemyEspColor'); this.addColorPicker('Low HP Enemy Box/Line', 'lowHpEnemyEspColor'); this.addColorPicker('Teammate Box/Line', 'teammateEspColor'); this.addColorPicker('Cloaked Enemy Text', 'cloakedTextColor'); this.addColorPicker('Enemy Name', 'enemyNameColor'); this.addColorPicker('Teammate Name', 'teammateNameColor'); this.addColorPicker('HP Bar (High)', 'hpBarHighColor'); this.addColorPicker('HP Bar (Medium)', 'hpBarMediumColor'); this.addColorPicker('HP Bar (Low)', 'hpBarLowColor'); this.addColorPicker('Facing Line', 'facingLineColor'); this.addColorPicker('Aimbot Target Line', 'aimbotTargetLineColor'); this.addColorPicker('Prediction Line', 'predictionLineColor'); this.addColorPicker('Obstacle Hitbox', 'obstacleEspColor');
            const closeBtn = this.addButton('Close Colors (0)', () => { this.container.style.display = 'none'; }, this.container, 'custom-btn-color-gui'); closeBtn.style.marginTop = '15px';
        }
        applyStyles() { GM_addStyle(`#${this.container.id}{position:fixed;left:calc(20px + 950px + 10px);top:70px;background-color:var(--main-bg,rgba(18,18,18,0.97));color:var(--text-color-light,#fff);padding:12px;border-radius:6px;font-family:"Segoe UI",Arial,sans-serif;font-size:12px;z-index:100001;border:2px solid var(--accent-border,#b00000);box-shadow:0 3px 10px rgba(0,0,0,.5);width:280px;max-height:calc(100vh - 100px);overflow-y:auto;user-select:none}#${this.container.id} h4{text-align:center;color:var(--accent-color,#f00);font-weight:700;font-size:14px;margin-top:0;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--accent-border,#b00000);cursor:move}#${this.container.id} .color-picker-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding:3px}#${this.container.id} .color-picker-row label{color:var(--text-color-dim,#aaa);font-size:11.5px;margin-right:8px}#${this.container.id} input[type=color]{border:1px solid var(--accent-border,#b00000);border-radius:4px;width:70px;height:28px;cursor:pointer;background-color:var(--secondary-bg,#1e1e1e);padding:2px}#${this.container.id} button.custom-btn-color-gui{background-color:var(--btn-profile-bg,#2d2d2d);color:var(--btn-profile-text,#e0e0e0);border:1px solid var(--btn-profile-border,#f00);padding:6px 10px;display:block;width:100%;border-radius:3px;cursor:pointer;font-weight:500;font-size:12px}#${this.container.id} button.custom-btn-color-gui:hover{filter:brightness(var(--hover-brightness,120%))}#${this.container.id}::-webkit-scrollbar{width:8px}#${this.container.id}::-webkit-scrollbar-track{background:var(--scrollbar-track,#2d2d2d);border-radius:4px}#${this.container.id}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb,#aa0000);border-radius:4px}#${this.container.id}::-webkit-scrollbar-thumb:hover{background:var(--scrollbar-thumb-hover,#ff3333)}`); }
        makeDraggable(dragHandle, draggableElement) { let offsetX, offsetY, isDragging = false; const onMouseMove = (ev) => { if (!isDragging) return; draggableElement.style.left = (ev.clientX - offsetX) + 'px'; draggableElement.style.top = (ev.clientY - offsetY) + 'px'; }; const onMouseUp = () => { isDragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }; dragHandle.addEventListener('mousedown', (e) => { if (e.target.closest('button, input, select, a')) return; isDragging = true; offsetX = e.clientX - draggableElement.offsetLeft; offsetY = e.clientY - draggableElement.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); e.preventDefault(); }); }
        addButton(label, onClick, parent, className = 'custom-btn') { const btn = document.createElement('button'); btn.innerText = label; btn.className = className; btn.onclick = onClick; parent.appendChild(btn); return btn; }
        addColorPicker(label, settingKey) { const row = document.createElement('div'); row.className = 'color-picker-row'; const lbl = document.createElement('label'); lbl.htmlFor = `${settingKey}-color-v2`; lbl.innerText = label + ":"; row.appendChild(lbl); const picker = document.createElement('input'); picker.type = 'color'; picker.id = `${settingKey}-color-v2`; picker.value = (GatsModCore.SETTINGS?.espColors?.[settingKey]) || '#FFFFFF'; picker.oninput = () => { if (GatsModCore.SETTINGS?.espColors) GatsModCore.SETTINGS.espColors[settingKey] = picker.value; }; picker.onchange = () => { if (GatsModCore.SETTINGS?.espColors) { GatsModCore.SETTINGS.espColors[settingKey] = picker.value; GatsModCore.saveSettings?.(); } }; row.appendChild(picker); this.container.appendChild(row); }
    }

    class SimpleGUI {
        constructor() {
            this.container = document.createElement('div'); this.container.id = 'zeroarcop-gats-gui'; this.container.style.display = 'none'; document.body.appendChild(this.container);
            const mainContentWrapper = document.createElement('div'); mainContentWrapper.id = 'gui-main-content-wrapper'; this.container.appendChild(mainContentWrapper);
            const guiHead = document.createElement('h3'); guiHead.innerText = 'Autonomous Bot Control Panel'; mainContentWrapper.appendChild(guiHead); this.makeDraggable(guiHead, this.container);
            this.statusDisplay = document.createElement('div'); this.statusDisplay.id = 'gui-status-bar'; mainContentWrapper.appendChild(this.statusDisplay);
            const hotkeyInfo = document.createElement('p'); hotkeyInfo.id = 'gui-hotkey-info'; hotkeyInfo.innerHTML = `This is an autonomous bot. Press 0 to toggle this GUI.`; mainContentWrapper.appendChild(hotkeyInfo);
            const topBarWrapper = document.createElement('div'); topBarWrapper.id = 'gui-top-bar-wrapper'; mainContentWrapper.appendChild(topBarWrapper);
            this.addSearchBox(topBarWrapper); this.addProfileManager(topBarWrapper);
            const mainTogglesWrapper = document.createElement('div'); mainTogglesWrapper.id = 'gui-main-toggles-wrapper'; mainContentWrapper.appendChild(mainTogglesWrapper);
            this.addCheckbox('ESP Enabled', 'espEnabled', mainTogglesWrapper, 'Toggle all visual assistance features.'); this.addCheckbox('Aimbot Enabled', 'aimbotEnabled', mainTogglesWrapper, 'Enable player-targeting aimbot.'); this.addCheckbox('Smart Auto-Attack', 'autoAttackEnabled', mainTogglesWrapper, 'Automatically shoots when target is in range and line of sight is clear.'); this.addCheckbox('Ghost Detect', 'ghostDetectEnabled', mainTogglesWrapper, 'Forces cloaked (Ghillie) enemies to be visible.'); this.addCheckbox('Silencer Detect', 'silencerDetectEnabled', mainTogglesWrapper, 'Forces bullets from silenced weapons to be visible.');
            const columnsWrapper = document.createElement('div'); columnsWrapper.id = 'gui-columns-wrapper'; mainContentWrapper.appendChild(columnsWrapper);
            this.column1 = document.createElement('div'); this.column1.className = 'gui-column'; columnsWrapper.appendChild(this.column1);
            this.column2 = document.createElement('div'); this.column2.className = 'gui-column'; columnsWrapper.appendChild(this.column2);
            this.column3 = document.createElement('div'); this.column3.className = 'gui-column'; columnsWrapper.appendChild(this.column3);
            const footer = document.createElement('div'); footer.id = 'gui-footer'; mainContentWrapper.appendChild(footer); this.addDiscordButton(footer);
        }
        makeDraggable(dragHandle, draggableElement) { let offsetX, offsetY, isDragging = false; const onMouseMove = (ev) => { if (!isDragging) return; draggableElement.style.left = (ev.clientX - offsetX) + 'px'; draggableElement.style.top = (ev.clientY - offsetY) + 'px'; }; const onMouseUp = () => { isDragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }; dragHandle.addEventListener('mousedown', (e) => { if (e.target.closest('button, input, select, a')) return; isDragging = true; offsetX = e.clientX - draggableElement.offsetLeft; offsetY = e.clientY - draggableElement.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); e.preventDefault(); }); }
        addCheckbox(label, settingKey, parent, tooltipText = null) { const div = document.createElement('div'); if (parent.id === 'gui-main-toggles-wrapper') { div.style.cssText = 'display: flex; flex-direction: column; align-items: center; padding: 2px 5px; margin: 0 5px; min-width: 90px; text-align: center;'; } else { div.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 3px 0;'; } div.dataset.settingName = label.toLowerCase().replace(/\s+/g, '-'); const lbl = document.createElement('label'); lbl.htmlFor = `${settingKey}-v2`; lbl.innerText = label; if (parent.id !== 'gui-main-toggles-wrapper') { lbl.style.flexGrow = '1'; } else { lbl.style.marginBottom = '2px'; } const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `${settingKey}-v2`; cb.onchange = () => { if (GatsModCore.SETTINGS) { GatsModCore.SETTINGS[settingKey] = cb.checked; GatsModCore.saveSettings?.(); gatsModInstance?.simpleGui?.updateStatusDisplay?.(); } }; div.appendChild(lbl); if (tooltipText) this.addTooltip(lbl, tooltipText); div.appendChild(cb); parent.appendChild(div); return div; }
        addCollapsibleSection(title, parent, className = '') { const details = document.createElement('details'); if (className) details.className = className; details.dataset.settingName = title.toLowerCase().replace(/\s+/g, '-'); details.open = false; const summary = document.createElement('summary'); summary.innerText = title; details.appendChild(summary); const content = document.createElement('div'); details.appendChild(content); parent.appendChild(details); return content; }
        addSliderInput(label, settingKey, opts, objToUpdate, parent, tooltipText = null) { const wrapper = document.createElement('div'); wrapper.className = 'settings-group-item'; wrapper.dataset.settingName = label.toLowerCase().replace(/\s+/g, '-'); const itemContainer = document.createElement('div'); itemContainer.style.cssText = 'display: flex; flex-direction: column; margin-bottom: 5px;'; const labelContainer = document.createElement('div'); labelContainer.style.display = 'flex'; labelContainer.style.alignItems = 'center'; const labelElement = document.createElement('label'); labelElement.htmlFor = `${settingKey}-slider-v2`; labelElement.innerText = label; labelElement.style.marginBottom = '3px'; labelContainer.appendChild(labelElement); if (tooltipText) this.addTooltip(labelContainer, tooltipText); itemContainer.appendChild(labelContainer); const controlsContainer = document.createElement('div'); controlsContainer.style.cssText = 'display: flex; align-items: center; width: 100%;'; const slider = document.createElement('input'); slider.type = 'range'; slider.id = `${settingKey}-slider-v2`; slider.min = opts.min; slider.max = opts.max; slider.step = opts.step; slider.value = objToUpdate[settingKey] ?? opts.defaultVal ?? opts.min; controlsContainer.appendChild(slider); const valueDisplay = document.createElement('input'); valueDisplay.type = 'number'; valueDisplay.className = 'value-display'; valueDisplay.style.width = '55px'; valueDisplay.min = opts.min; valueDisplay.max = opts.max; valueDisplay.step = opts.step; valueDisplay.value = slider.value; controlsContainer.appendChild(valueDisplay); const updateValue = (newValue, fromSlider = false) => { let numVal = parseFloat(newValue); if (isNaN(numVal)) numVal = opts.defaultVal ?? parseFloat(opts.min); numVal = Math.max(parseFloat(opts.min), Math.min(parseFloat(opts.max), numVal)); const decimals = opts.step.toString().includes('.') ? opts.step.toString().split('.')[1].length : 0; const fixedVal = numVal.toFixed(decimals); if (fromSlider) valueDisplay.value = fixedVal; else slider.value = fixedVal; objToUpdate[settingKey] = parseFloat(fixedVal); GatsModCore.saveSettings?.(); }; slider.oninput = (e) => updateValue(e.target.value, true); valueDisplay.onchange = (e) => updateValue(e.target.value, false); valueDisplay.onfocus = () => { if (GatsModCore) GatsModCore.isInputActive = true; }; valueDisplay.onblur = () => { if (GatsModCore) GatsModCore.isInputActive = false; updateValue(valueDisplay.value, false); }; itemContainer.appendChild(controlsContainer); wrapper.appendChild(itemContainer); parent.appendChild(wrapper); return wrapper; }
        addButton(label, onClickAction, parent, className = 'action-btn') { const button = document.createElement('button'); button.innerText = label; button.className = className; button.onclick = onClickAction; parent.appendChild(button); return button; }
        addTooltip(parentLabelContainer, text) { const tooltipTrigger = document.createElement('span'); tooltipTrigger.className = 'tooltip-trigger'; tooltipTrigger.innerText = '?'; const tooltipTextElement = document.createElement('span'); tooltipTextElement.className = 'tooltip-text'; tooltipTextElement.innerText = text; tooltipTrigger.appendChild(tooltipTextElement); parentLabelContainer.appendChild(tooltipTrigger); }
        addDiscordButton(parent) { const discordBtn = document.createElement('a'); discordBtn.href = 'https://discord.com/users/975535045047648266'; discordBtn.target = '_blank'; discordBtn.rel = 'noopener noreferrer'; discordBtn.id = 'discord-link-btn'; discordBtn.innerText = 'Contact zeroarcop on Discord'; parent.appendChild(discordBtn); }
        applyStyles() { GM_addStyle(`:root{--main-bg:rgba(18,18,18,0.97);--secondary-bg:#1e1e1e;--border-color:#f00;--text-color:#fff;--text-color-light:#fff;--text-color-dim:#aaa;--accent-color:#f00;--accent-border:#b00000;--hover-brightness:130%;--input-accent:#f00;--status-on:#0f0;--status-off:#f00;--status-neutral:#aaa;--tooltip-bg:#101010;--tooltip-text:#fff;--tooltip-border:var(--accent-color);--btn-action-bg:#d00000;--btn-action-border:#a00000;--btn-profile-bg:#2d2d2d;--btn-profile-text:#e0e0e0;--btn-profile-border:var(--accent-color);--btn-alt-bg:#f0f0f0;--btn-alt-text:#1a1a1a;--btn-alt-border:#aaa;--modal-bg:rgba(0,0,0,0.8);--modal-content-bg:#1a1a1a;--modal-content-border:var(--accent-color);--scrollbar-track:#2d2d2d;--scrollbar-thumb:#aa0000;--scrollbar-thumb-hover:#ff3333;--skill-list-bg:rgba(0,0,0,0.2);--skill-item-bg:var(--secondary-bg);--skill-item-border:var(--accent-border);--skill-item-hover-bg:var(--accent-color)}#${this.container.id}{position:fixed;left:20px;top:70px;background-color:var(--main-bg);color:var(--text-color);padding:10px;border-radius:6px;font-family:"Segoe UI",Arial,sans-serif;font-size:12.5px;z-index:100002;border:2px solid var(--accent-color);box-shadow:0 5px 20px rgba(255,0,0,.4);width:950px;max-height:calc(100vh - 90px);overflow-y:auto;user-select:none}#${this.container.id} #gui-main-content-wrapper{display:flex;flex-direction:column}#${this.container.id} h3{margin:0 0 8px;text-align:center;border-bottom:1px solid var(--accent-border);padding-bottom:10px;color:var(--accent-color);font-weight:700;cursor:move;font-size:16px;text-shadow:0 0 5px var(--accent-color)}#${this.container.id} #gui-status-bar{background-color:rgba(10,10,10,0.85);color:#fff;padding:6px 12px;margin-bottom:10px;text-align:center;font-size:12.5px;font-weight:700;border-radius:4px;border:1px solid var(--accent-border)}#${this.container.id} #gui-status-bar .status-on{color:var(--status-on);font-weight:700}#${this.container.id} #gui-status-bar .status-off{color:var(--status-off);font-weight:700}#${this.container.id} #gui-status-bar .status-neutral{color:var(--status-neutral)}#${this.container.id} #gui-hotkey-info{font-size:11px;text-align:center;margin:2px 0 10px;color:var(--text-color-dim)}#${this.container.id} #gui-top-bar-wrapper{display:flex;gap:10px;margin-bottom:10px;border-bottom:1px solid var(--accent-border);padding-bottom:10px}#${this.container.id} #settings-search-box{flex-grow:1;background-color:var(--secondary-bg);color:var(--text-color-light);border:1px solid var(--accent-border);border-radius:3px;padding:5px 8px}#${this.container.id} #profile-manager{display:flex;gap:5px;align-items:center}#${this.container.id} #profile-manager button,#${this.container.id} #profile-manager input,#${this.container.id} #profile-manager select{font-size:11px;padding:4px;background-color:var(--btn-profile-bg);color:var(--btn-profile-text);border:1px solid var(--btn-profile-border);border-radius:3px}#${this.container.id} #profile-manager button{cursor:pointer;background-color:var(--accent-color);border-color:var(--accent-border);color:var(--text-color-light)}#${this.container.id} #profile-manager button:hover{filter:brightness(var(--hover-brightness))}#${this.container.id} #gui-main-toggles-wrapper{display:flex;flex-wrap:wrap;justify-content:space-around;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--accent-border)}#${this.container.id} #gui-main-toggles-wrapper>div{display:flex;flex-direction:column;align-items:center;padding:2px 5px;margin:0 5px;min-width:90px;text-align:center}#${this.container.id} #gui-main-toggles-wrapper label{color:var(--text-color-light);font-size:11.5px;margin-bottom:2px}#${this.container.id} #gui-main-toggles-wrapper input[type=checkbox]{margin-top:1px;accent-color:var(--input-accent)}#${this.container.id} #gui-columns-wrapper{display:flex;flex-direction:row;justify-content:space-between;gap:10px}#${this.container.id} .gui-column{width:calc(33.33% - 7px);display:flex;flex-direction:column;gap:5px}#${this.container.id} details{border:1px solid var(--border-color);border-radius:4px;padding:0;margin:0 0 8px}#${this.container.id} details{background-color:rgba(30,30,30,0.75)}#${this.container.id} summary{cursor:pointer;outline:0;font-weight:600;color:var(--accent-color);padding:6px 8px;font-size:13px;border-radius:3px 3px 0 0;transition:background-color .2s;border-bottom:1px solid transparent}#${this.container.id} details[open]>summary{border-bottom:1px solid var(--accent-border);background-color:rgba(255,0,0,0.05)}#${this.container.id} details>div{padding:10px 8px 8px}#${this.container.id} .settings-group-item{margin-bottom:8px}#${this.container.id} .settings-group-item label{color:var(--text-color-light);margin-left:0;flex-shrink:0;display:block;min-width:100px;font-size:12px;margin-bottom:3px}#${this.container.id} .settings-group-item div[style*="display: flex; align-items: center; justify-content: space-between;"] label{display:inline-block;flex-grow:1;margin-bottom:0}#${this.container.id} .settings-group-item input[type=checkbox]{accent-color:var(--input-accent);border:1px solid var(--accent-border);vertical-align:middle;margin-left:5px}#${this.container.id} input[type=number].value-display{width:55px;background-color:var(--secondary-bg);color:var(--text-color);border:1px solid var(--accent-border);border-radius:3px;padding:4px 5px;text-align:right;font-family:"Segoe UI",Arial,sans-serif;margin:0 4px;font-size:11.5px}#${this.container.id} input[type=range]{flex-grow:1;margin:0 4px;accent-color:var(--input-accent);height:22px}#${this.container.id} .settings-group-item div[style*="display: flex; align-items: center; width: 100%;"]{height:26px}#${this.container.id} input[type=text].general-text-input,#${this.container.id} input[type=text][id^=aimbotExcludeInput-text-v2],#${this.container.id} input[type=text][id^=obstacleEspTypes-text-v2]{width:calc(100% - 0px);box-sizing:border-box;background-color:var(--secondary-bg);color:var(--text-color-light);border:1px solid var(--accent-border);border-radius:3px;padding:5px;margin-bottom:5px}#${this.container.id} button.action-btn,#${this.container.id} button.custom-btn{background-color:var(--btn-action-bg);color:#fff;border:1px solid var(--btn-action-border);margin-top:10px;padding:7px 10px;display:block;width:100%;box-sizing:border-box;border-radius:3px;cursor:pointer;font-weight:500;font-size:12.5px;text-transform:uppercase}#${this.container.id} button.action-btn-small{background-color:var(--btn-action-bg);color:#fff;border:1px solid var(--btn-action-border);padding:4px 8px;font-size:11px;margin-top:5px;width:auto;border-radius:3px;cursor:pointer}#${this.container.id} button.action-btn-third{width:calc(33.33% - 4px);display:inline-block;margin:2px;background-color:var(--btn-alt-bg);color:var(--btn-alt-text);border:1px solid var(--btn-alt-border);padding:5px 8px;font-size:11.5px;text-transform:none;border-radius:3px;cursor:pointer}#${this.container.id} #bot-control-panel button.action-btn{background-color:var(--btn-action-bg);color:#fff;border:1px solid var(--btn-action-border)}#${this.container.id} button.action-btn-half{width:calc(50% - 5px);margin:2px;padding:5px;font-size:11.5px;background-color:var(--btn-action-bg);color:#fff;border:1px solid var(--btn-action-border);border-radius:3px;cursor:pointer}#${this.container.id} button.edit-preset-btn-item,#${this.container.id} button.preset-btn-item{min-width:auto;width:auto;margin:0;padding:4px 7px;display:inline-block;background-color:var(--btn-profile-bg);color:var(--btn-profile-text);font-size:11px;line-height:1.4;border:1px solid var(--btn-profile-border);border-radius:3px;cursor:pointer}#${this.container.id} button.edit-preset-btn-item{padding:3px 6px;font-size:10px;background-color:var(--accent-color);color:#fff}#${this.container.id} button:hover{filter:brightness(var(--hover-brightness))}#${this.container.id} button.action-btn-third:hover{background-color:#e0e0e0;filter:brightness(95%)}#${this.container.id} .tooltip-trigger{display:inline-block;margin-left:6px;color:var(--text-color-dim);background-color:var(--secondary-bg);border:1px solid var(--accent-border);border-radius:50%;width:14px;height:14px;font-size:10px;text-align:center;line-height:14px;cursor:help;position:relative}#${this.container.id} .tooltip-text{visibility:hidden;width:220px;background-color:var(--tooltip-bg);color:var(--tooltip-text);text-align:center;border-radius:6px;padding:8px;position:absolute;z-index:100003;bottom:125%;left:50%;margin-left:-110px;opacity:0;transition:opacity .3s;border:1px solid var(--tooltip-border);font-size:11px;line-height:1.4}#${this.container.id} .tooltip-trigger:hover .tooltip-text{visibility:visible;opacity:1}#player-list-modal{display:none;position:fixed;z-index:100003;left:0;top:0;width:100%;height:100%;background-color:var(--modal-bg);justify-content:center;align-items:center}#player-list-content{background-color:var(--modal-content-bg);padding:20px;border:1px solid var(--modal-content-border);border-radius:8px;width:80%;max-width:500px;max-height:80vh;overflow-y:auto;box-shadow:0 0 15px rgba(255,0,0,0.5)}#player-list-content h4{margin-top:0;color:var(--accent-color);text-align:center;font-size:1.2em}#player-list-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.player-list-button{background-color:var(--secondary-bg);color:var(--text-color-light);border:1px solid var(--accent-border);padding:8px;text-align:center;border-radius:4px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.player-list-button:hover{background-color:var(--accent-color);color:#fff}#${this.container.id} #gui-footer{margin-top:15px;padding-top:10px;border-top:1px solid var(--accent-border);text-align:center;}#${this.container.id} #discord-link-btn{display:inline-block;padding:8px 15px;background-color:#5865F2;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;font-size:13px;transition:background-color .2s}#${this.container.id} #discord-link-btn:hover{background-color:#4752C4}#${this.container.id}::-webkit-scrollbar{width:10px}#${this.container.id}::-webkit-scrollbar-track{background:var(--scrollbar-track);border-radius:4px}#${this.container.id}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:4px}#${this.container.id}::-webkit-scrollbar-thumb:hover{background:var(--scrollbar-thumb-hover)}#${this.container.id} .settings-group-item>div[style*="flex-direction: column"]{margin-bottom:0}`); }
        populateColumn1_ESP() {
            if (!this.column1 || !GatsModCore.SETTINGS) return;
            const espMasterSection = this.addCollapsibleSection('ESP Configuration', this.column1, 'settings-group-master');
            const visualEspOptions = this.addCollapsibleSection('Player ESP Visuals', espMasterSection, 'settings-sub-group');
            this.addCheckbox('Show Enemy HP', 'espShowHP', visualEspOptions, 'Display health bars above players.'); this.addCheckbox('Highlight Low HP Enemies', 'espHighlightLowHP', visualEspOptions, 'Change ESP color for enemies with low health.'); this.addSliderInput('Low HP Threshold (%)', 'lowHPThreshold', {min: 1, max: 99, step: 1, defaultVal: 30}, GatsModCore.SETTINGS, visualEspOptions, 'Health % below which an enemy is considered low HP.'); this.addCheckbox('Show Prediction Line', 'espShowPrediction', visualEspOptions, 'Draws a line from enemies to their predicted position. Requires aimbot prediction to be enabled.'); this.addCheckbox('Show Enemy Facing Line', 'espShowFacingLine', visualEspOptions, 'Draw a line indicating player aim direction.'); this.addCheckbox('Highlight Cloaked Enemies', 'espHighlightCloaked', visualEspOptions, 'Special indicator for cloaked enemies. Works best with Ghost Detect enabled.'); this.addCheckbox('Show Teammates (TDM)', 'espShowTeammates', visualEspOptions, 'Enable ESP for your teammates.');
            const espPositioningSection = this.addCollapsibleSection('ESP Positioning & Visual Scale', espMasterSection, 'settings-sub-group');
            this.addSliderInput('X Offset (Global)', 'espOffsetX', {min: -200, max: 200, step: 1, defaultVal: 0}, GatsModCore.SETTINGS, espPositioningSection, 'Shift all ESP elements horizontally.'); this.addSliderInput('Y Offset (Global)', 'espOffsetY', {min: -200, max: 200, step: 1, defaultVal: 0}, GatsModCore.SETTINGS, espPositioningSection, 'Shift all ESP elements vertically.'); this.addSliderInput('ESP Visual Scale', 'espScale', {min: 0.1, max: 5.0, step: 0.05, defaultVal: 0.89}, GatsModCore.SETTINGS, espPositioningSection, 'Global visual scale for ESP elements (boxes, lines, text).');
            const debugPreviewSection = this.addCollapsibleSection('Debug Previews', espMasterSection, 'settings-sub-group');
            this.addCheckbox('Show Attack Radius', 'autoAttackShowRadius', debugPreviewSection, 'Displays the Smart Auto-Attack engagement radius on screen.'); this.addCheckbox('Show Obstacle Hitboxes', 'obstacleEspEnabled', debugPreviewSection, 'Displays obstacle hitboxes for debugging line-of-sight.'); this.addCheckbox('Show LOS Debug Line', 'losDebugLineEnabled', debugPreviewSection, 'Draws the line used for the line-of-sight check. Green = clear, Red = blocked.'); this.addSliderInput('Obstacle X Offset', 'obstacleOffsetX', {min: -100, max: 100, step: 1, defaultVal: 0}, GatsModCore.SETTINGS, debugPreviewSection, 'Fine-tune the horizontal position of obstacle hitboxes.'); this.addSliderInput('Obstacle Y Offset', 'obstacleOffsetY', {min: -100, max: 100, step: 1, defaultVal: 0}, GatsModCore.SETTINGS, debugPreviewSection, 'Fine-tune the vertical position of obstacle hitboxes.');
        }
        populateColumn2_Aimbot() {
            if (!this.column2 || !GatsModCore.SETTINGS) return;
            const aimbotMasterSection = this.addCollapsibleSection('Aimbot & Auto-Attack', this.column2, 'settings-group-master');
            const autoAttackSection = this.addCollapsibleSection('Smart Auto-Attack', aimbotMasterSection, 'settings-sub-group');
            this.addSliderInput('Attack Radius (px)', 'autoAttackRadius', {min: 0, max: 1000, step: 10, defaultVal: 400}, GatsModCore.SETTINGS, autoAttackSection, 'The bot will only shoot at targets within this screen radius from the center.'); this.addCheckbox('Check Line of Sight', 'autoAttackCheckLOS', autoAttackSection, 'Prevents shooting if an obstacle is between you and the target.'); this.addCheckbox('Check Max Weapon Range', 'autoAttackCheckRange', autoAttackSection, 'Prevents shooting if the predicted target position is outside your weapon\'s maximum range.');
            const generalAimbotOptions = this.addCollapsibleSection('Aimbot - General Targeting', aimbotMasterSection, 'settings-sub-group');
            this.addSliderInput('Aimbot FOV', 'aimbotFov', {min: 10, max: 5000, step: 10, defaultVal: 2250}, GatsModCore.SETTINGS, generalAimbotOptions, 'Field of View for the aimbot.');
            const predictionSettings = this.addCollapsibleSection('Aimbot - Prediction', aimbotMasterSection, 'settings-sub-group');
            this.addCheckbox('Prediction Enabled', 'predictionEnabled', predictionSettings, 'Aimbot will predict enemy movement.'); this.addCheckbox('Use Close-Range Prediction', 'useCloseRangePrediction', predictionSettings, 'Use a separate prediction factor for enemies within a certain radius of the screen center.'); this.addSliderInput('Close-Range Radius (px)', 'predictionCloseRadius', { min: 0, max: 300, step: 5, defaultVal: 100 }, GatsModCore.SETTINGS, predictionSettings, 'If an enemy is within this pixel radius from your screen center, the close-range prediction factor will be used.'); this.addSliderInput('Prediction Factor (Close)', 'predictionFactorClose', {min: 0.0, max: 5.0, step: 0.1, defaultVal: 0.5}, GatsModCore.SETTINGS, predictionSettings, 'Prediction multiplier for close-range targets.'); this.addSliderInput('Prediction Factor (Normal)', 'predictionFactor', {min: 0.0, max: 5.0, step: 0.1, defaultVal: 2.5}, GatsModCore.SETTINGS, predictionSettings, 'Main multiplier for movement prediction (for targets outside the close-range radius).'); this.addCheckbox('Dynamic Prediction Scaling', 'enableDynamicPredictionFactor', predictionSettings, 'Adjust normal prediction factor based on distance to target.'); this.addSliderInput('Min Prediction Dist', 'minPredictionDistance', {min: 0, max: 1000, step: 10, defaultVal: 0}, GatsModCore.SETTINGS, predictionSettings, 'Distance where dynamic prediction scaling starts.'); this.addSliderInput('Max Prediction Dist', 'maxPredictionDistance', {min: 50, max: 2000, step: 10, defaultVal: 200}, GatsModCore.SETTINGS, predictionSettings, 'Distance where prediction factor reaches its max value.'); this.addSliderInput('Factor at Min Dist', 'predictionFactorAtMinDistance', {min: 0.0, max: 2.0, step: 0.1, defaultVal: 0.0}, GatsModCore.SETTINGS, predictionSettings, 'Prediction multiplier used at (or below) the minimum distance.');
            this.addAimbotExclusionListToColumn2(aimbotMasterSection);
        }
        addAimbotExclusionListToColumn2(aimbotMasterSection) { if (!aimbotMasterSection || !GatsModCore.SETTINGS) return; const aimbotExclusionSection = this.addCollapsibleSection('Aimbot - Target Exclusion List', aimbotMasterSection, 'settings-sub-group'); const mainDiv = document.createElement('div'); mainDiv.className = 'settings-group-item'; const inputLabel = document.createElement('label'); inputLabel.htmlFor = 'aimbotExcludeInput-text-v2'; inputLabel.innerText = 'Player Name to Ignore:'; inputLabel.style.display = 'block'; inputLabel.style.marginBottom = '3px'; mainDiv.appendChild(inputLabel); const input = document.createElement('input'); input.type = 'text'; input.id = 'aimbotExcludeInput-text-v2'; input.placeholder = 'Enter exact player name'; input.className = 'general-text-input'; mainDiv.appendChild(input); const addButton = this.addButton("Add to Ignore List", () => { const name = input.value.trim(); if (name && GatsModCore.SETTINGS.aimbotIgnoreList) { if (!GatsModCore.SETTINGS.aimbotIgnoreList.includes(name)) { GatsModCore.SETTINGS.aimbotIgnoreList.push(name); GatsModCore.saveSettings(); this.updateAimbotExclusionListDisplay(); input.value = ''; } else { alert(`Player "${name}" is already on the ignore list.`); } } }, mainDiv, 'action-btn-small'); addButton.style.display = 'inline-block'; addButton.style.marginLeft = '5px'; const listLabel = document.createElement('p'); listLabel.innerText = 'Currently Ignored Players:'; listLabel.style.marginTop = '10px'; listLabel.style.fontWeight = 'bold'; mainDiv.appendChild(listLabel); this.aimbotExclusionListDiv = document.createElement('div'); this.aimbotExclusionListDiv.id = 'aimbot-exclusion-list-display'; this.aimbotExclusionListDiv.style.cssText = 'max-height: 100px; overflow-y: auto; border: 1px solid var(--accent-border, #B00000); padding: 5px; border-radius: 3px; margin-top: 5px; background-color: var(--secondary-bg, #1E1E1E);'; mainDiv.appendChild(this.aimbotExclusionListDiv); aimbotExclusionSection.appendChild(mainDiv); this.updateAimbotExclusionListDisplay(); }
        updateAimbotExclusionListDisplay() { if (!this.aimbotExclusionListDiv || !GatsModCore.SETTINGS?.aimbotIgnoreList) { if (this.aimbotExclusionListDiv) this.aimbotExclusionListDiv.innerHTML = '<span>Not available</span>'; return; } this.aimbotExclusionListDiv.innerHTML = ''; if (GatsModCore.SETTINGS.aimbotIgnoreList.length === 0) { const noItems = document.createElement('span'); noItems.textContent = 'None'; noItems.style.color = 'var(--text-color-dim)'; this.aimbotExclusionListDiv.appendChild(noItems); return; } GatsModCore.SETTINGS.aimbotIgnoreList.forEach(name => { const itemDiv = document.createElement('div'); itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 3px 2px; border-bottom: 1px solid var(--accent-border)'; const nameSpan = document.createElement('span'); nameSpan.textContent = name; nameSpan.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px;'; nameSpan.title = name; const removeBtn = document.createElement('button'); removeBtn.textContent = 'X'; removeBtn.title = `Remove ${name} from ignore list`; removeBtn.style.cssText = 'color: var(--text-color-light, white); background-color: var(--btn-action-bg, #D00000); border: 1px solid var(--btn-action-border, #A00000); padding: 1px 5px; font-size: 10px; cursor: pointer; border-radius: 3px; line-height: 1;'; removeBtn.onclick = () => { GatsModCore.SETTINGS.aimbotIgnoreList = GatsModCore.SETTINGS.aimbotIgnoreList.filter(n => n !== name); GatsModCore.saveSettings(); this.updateAimbotExclusionListDisplay(); }; itemDiv.appendChild(nameSpan); itemDiv.appendChild(removeBtn); this.aimbotExclusionListDiv.appendChild(itemDiv); }); }
        populateColumn3_Utilities() {
            if (!this.column3 || !GatsModCore.SETTINGS) return;
            const utilitiesMasterSection = this.addCollapsibleSection('Utilities', this.column3, 'settings-group-master');

            // --- Escort Mode Panel ---
            const escortPanel = this.addCollapsibleSection('Escort Mode', utilitiesMasterSection, 'settings-sub-group');
            this.escortStatusDisplay = document.createElement('div');
            this.escortStatusDisplay.style.textAlign = 'center';
            this.escortStatusDisplay.style.marginTop = '5px';
            this.escortStatusDisplay.style.marginBottom = '10px';
            escortPanel.appendChild(this.escortStatusDisplay);
            this.updateEscortStatusDisplay();

            const escortButtons = document.createElement('div');
            escortButtons.style.cssText = 'display: flex; justify-content: space-around; margin-top: 5px; flex-wrap: wrap;';
            this.addButton("Select Escort Target", () => GatsModCore.showTeammateList(), escortButtons, 'action-btn-half');
            this.addButton("Stop Escorting", () => gatsModInstance.autonomousBot.stopEscorting(), escortButtons, 'action-btn-half');
            escortPanel.appendChild(escortButtons);
            // --- End Escort Mode Panel ---

            const eventChatSection = this.addCollapsibleSection('Event-Triggered Chat', utilitiesMasterSection, 'settings-sub-group');
            this.addCheckbox('Enable On-Kill Chat', 'onKillChatEnabled', eventChatSection, 'Automatically say "ez" when you get a kill.');
        }
        updateEscortStatusDisplay() {
            if (!this.escortStatusDisplay || !gatsModInstance || !gatsModInstance.autonomousBot) return;
            const bot = gatsModInstance.autonomousBot;
            let statusText;
            if (bot.escortTargetId && bot.escortTargetName) {
                statusText = `Escorting: <span class='status-on'>${bot.escortTargetName}</span>`;
            } else {
                statusText = `Escort Target: <span class='status-off'>None</span>`;
            }
            this.escortStatusDisplay.innerHTML = statusText;
        }
        addSearchBox(parent) { const searchBox = document.createElement('input'); searchBox.type = 'text'; searchBox.id = 'settings-search-box'; searchBox.placeholder = 'Search settings...'; searchBox.oninput = (e) => { const query = e.target.value.toLowerCase().trim(); this.container.querySelectorAll('[data-setting-name]').forEach(el => { let isParentOfVisible = false; if (el.tagName === 'DETAILS' && !el.classList.contains('settings-sub-group')) { el.querySelectorAll('[data-setting-name]').forEach(childEl => { if (childEl.dataset.settingName.includes(query) && childEl.style.display !== 'none') isParentOfVisible = true; }); } const matchesQuery = el.dataset.settingName.includes(query); el.style.display = (matchesQuery || isParentOfVisible) ? '' : 'none'; if (isParentOfVisible && el.tagName === 'DETAILS' && query) el.open = true; }); }; parent.appendChild(searchBox); }
        addProfileManager(parent) { const managerDiv = document.createElement('div'); managerDiv.id = 'profile-manager'; const selectLabel = document.createElement('span'); selectLabel.innerText = 'Profile: '; selectLabel.style.marginRight = '5px'; managerDiv.appendChild(selectLabel); const selectElement = document.createElement('select'); selectElement.id = 'profile-select-v2'; managerDiv.appendChild(selectElement); this.profileSelectElement = selectElement; const nameInput = document.createElement('input'); nameInput.type = 'text'; nameInput.id = 'profile-name-input-v2'; nameInput.placeholder = 'Profile Name'; nameInput.style.width = '100px'; managerDiv.appendChild(nameInput); this.addButton("Save", () => GatsModCore.saveProfile?.(nameInput.value), managerDiv, 'action-btn-small profile-btn'); this.addButton("Load", () => GatsModCore.loadProfile?.(selectElement.value), managerDiv, 'action-btn-small profile-btn'); this.addButton("Delete", () => GatsModCore.deleteProfile?.(selectElement.value), managerDiv, 'action-btn-small profile-btn'); parent.appendChild(managerDiv); }
        updateProfileList() { if (!this.profileSelectElement || !GatsModCore.SETTINGS?.settingProfiles) { if (this.profileSelectElement) this.profileSelectElement.innerHTML = '<option value="">No Profiles</option>'; return; } this.profileSelectElement.innerHTML = ''; const profileNames = Object.keys(GatsModCore.SETTINGS.settingProfiles); if (profileNames.length === 0) { this.profileSelectElement.innerHTML = '<option value="">No Profiles</option>'; return; } profileNames.forEach(name => { const option = document.createElement('option'); option.value = name; option.innerText = name; this.profileSelectElement.appendChild(option); }); }
        addHideButton(parent) { const btn = this.addButton('Hide GUIs (0)', () => { this.container.style.display = 'none'; gatsModInstance?.colorGui?.container && (gatsModInstance.colorGui.container.style.display = 'none'); }, parent, 'custom-btn'); btn.style.backgroundColor = 'var(--secondary-bg)'; btn.style.borderColor = 'var(--accent-border)'; btn.style.marginTop = '15px'; }
        createPlayerListModal() { if (document.getElementById('player-list-modal')) return; const modal = document.createElement('div'); modal.id = 'player-list-modal'; modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; }; const content = document.createElement('div'); content.id = 'player-list-content'; const head = document.createElement('h4'); head.innerText = 'Select Teammate to Escort'; content.appendChild(head); const grid = document.createElement('div'); grid.id = 'player-list-grid'; content.appendChild(grid); modal.appendChild(content); document.body.appendChild(modal); }
        updateStatusDisplay() {
            if (!this.statusDisplay || !GatsModCore.SETTINGS || !gatsModInstance || !gatsModInstance.autonomousBot) return;
            const s = GatsModCore.SETTINGS; const bot = gatsModInstance.autonomousBot;
            const esp = s.espEnabled ? `<span class="status-on">ON</span>` : `<span class.model-"،"status-off">OFF</span>`; const aimbot = s.aimbotEnabled ? `<span class="status-on">ON</span>` : `<span class="status-off">OFF</span>`;
            const botState = bot.state ? `<span class="status-on">${bot.state}</span>` : `<span class="status-off">INACTIVE</span>`;
            this.statusDisplay.innerHTML = `BOT Status: ${botState} | ESP: ${esp} | Aimbot: ${aimbot}`;
        }
        updateAllGUIToReflectSettings() { if (!GatsModCore.SETTINGS) { modLog("Cannot update GUI: GatsModCore.SETTINGS not available.", true); return; } const settings = GatsModCore.SETTINGS; this.container.querySelectorAll('input[type="checkbox"]').forEach(cb => { const key = cb.id.replace('-v2', ''); if (settings.hasOwnProperty(key)) cb.checked = settings[key]; }); this.container.querySelectorAll('input[type="range"]').forEach(slider => { const key = slider.id.replace('-slider-v2', ''); if (settings.hasOwnProperty(key)) { slider.value = settings[key]; const valueDisplay = slider.parentElement.querySelector('input[type="number"].value-display'); if (valueDisplay) { const decimals = slider.step.toString().includes('.') ? slider.step.toString().split('.')[1].length : 0; valueDisplay.value = parseFloat(settings[key]).toFixed(decimals); } } }); this.container.querySelectorAll('input[type="text"][id$="-text-v2"]').forEach(input => { const key = input.id.replace('-text-v2', ''); if (settings.hasOwnProperty(key)) input.value = settings[key]; }); if (gatsModInstance?.colorGui?.container && settings.espColors) { for (const key in settings.espColors) { const picker = document.getElementById(`${key}-color-v2`); if (picker) picker.value = settings.espColors[key]; } } this.updateProfileList(); this.updateStatusDisplay(); this.updateAimbotExclusionListDisplay?.(); this.updateEscortStatusDisplay?.(); modLog("SimpleGUI updated to reflect current settings."); }
    }

    class GatsModCore {
        static SETTINGS = {}; static isInputActive = false; static chatIntervalId = null;
        static PLAYER_SPEEDS = { base: { 'pistol': 8.00, 'smg': 7.45, 'shotgun': 7.30, 'assault': 7.30, 'machine-gun': 6.80, 'lmg': 6.80, 'sniper': 7.50, 'bolt-action-rifle': 7.50 }, armorMultiplier: { 0: 1.00, 1: 0.89, 2: 0.80, 3: 0.70 }, upgradeMultiplier: { 'lightweight': 1.20 }, diagonalCorrection: 1 / Math.sqrt(2) };
        static WEAPON_BULLET_SPEEDS = { 'pistol': 9.0, 'smg': 8.0, 'shotgun': 9.0, 'assault': 9.0, 'bolt-action-rifle': 11.0, 'machine-gun': 9.0, 'sniper': 11.0, 'lmg': 9.0 }; static WEAPON_FORWARD_OFFSETS = { 'pistol': 65, 'smg': 70, 'shotgun': 75, 'assault': 84, 'machine-gun': 80, 'lmg': 80, 'bolt-action-rifle': 95, 'sniper': 95 }; static WEAPON_BASE_RANGES = { 'pistol': 425, 'smg': 280, 'shotgun': 280, 'assault': 400, 'machine-gun': 355, 'lmg': 355, 'bolt-action-rifle': 650, 'sniper': 650 }; static LONG_RANGE_MULTIPLIER = 1.5;

        constructor() {
            modLog("GatsModCore constructor called.");
            this.gameCanvas = document.getElementById('canvas'); if (!this.gameCanvas) { modLog("FATAL: Game canvas not found.", true); return; }
            this.originalUpdateMouseData = null; this.aimTargetScreenCoords = null; this.currentAimAssistTargetCoords = null; this.currentAimbotTarget = null;
            this.predictedTargetWorld = { x: 0, y: 0 }; this.isAutoShooting = false; this.simulatedKeys = { w: false, a: false, s: false, d: false };
            this.tickCounter = 0; this.realMouseButtons = 0; this.realMouseCanvasX = 0; this.realMouseCanvasY = 0; this.lastSelfKills = 0;
            this.botSpdX = 0; this.botSpdY = 0;
            this.initializeSettings();
            this.autonomousBot = new AutonomousBot(this);
            this.simpleGui = new SimpleGUI(); this.colorGui = new ColorCustomizerGUI();
            this.setupGUI(); this.setupOverlay(); this.addEventListeners(); this.hookMouseEvents();
            this.simpleGui.updateAllGUIToReflectSettings();
            GatsModCore.startBotChat();
            modLog(`Autonomous Bot v0.02 initialized successfully.`);
        }

        initializeSettings() {
            let savedSettings = {}; try { const item = localStorage.getItem(SETTINGS_KEY); if (item) savedSettings = JSON.parse(item); } catch (e) { modLog(`Error loading settings: ${e.message}`, true); }
            const defaultSettings = {
                espEnabled: true, espShowHP: true, espHighlightLowHP: true, lowHPThreshold: 30, espShowFacingLine: true, espShowPrediction: true, espHighlightCloaked: true, espShowTeammates: true, espOffsetX: 0, espOffsetY: 0, espScale: 0.89,
                autoAttackShowRadius: true, obstacleEspEnabled: false, losDebugLineEnabled: false, obstacleOffsetX: 0, obstacleOffsetY: 0,
                ghostDetectEnabled: true, silencerDetectEnabled: true,
                aimbotEnabled: true, alwaysAim: true, aimbotOnMousePress: false, aimAtMouseClosest: false, aimbotFov: 5000, aimbotIgnoreList: [],
                autoAttackEnabled: true, autoAttackRadius: 800, autoAttackCheckLOS: true, autoAttackCheckRange: true,
                predictionEnabled: true, useCloseRangePrediction: true, predictionCloseRadius: 100, predictionFactorClose: 0.5, predictionFactor: 2.5, enableDynamicPredictionFactor: true, minPredictionDistance: 0, maxPredictionDistance: 200, predictionFactorAtMinDistance: 0.0,
                onKillChatEnabled: false, onKillMessage: "ez",
                espColors: { enemyEspColor: '#FF0000', lowHpEnemyEspColor: '#FFA500', teammateEspColor: '#0096FF', cloakedTextColor: '#E0E0E0', enemyNameColor: '#000000', teammateNameColor: '#ADD8E6', hpBarHighColor: '#00FF00', hpBarMediumColor: '#FFFF00', hpBarLowColor: '#FF0000', facingLineColor: '#00FFFF', aimbotTargetLineColor: '#00FF00', predictionLineColor: '#FF00FF', obstacleEspColor: '#FFFF00' },
                settingProfiles: {}
            };
            GatsModCore.SETTINGS = { ...defaultSettings, ...savedSettings };
            GatsModCore.SETTINGS.aimbotEnabled = true; GatsModCore.SETTINGS.autoAttackEnabled = true; GatsModCore.SETTINGS.alwaysAim = true; GatsModCore.SETTINGS.aimbotOnMousePress = false; GatsModCore.SETTINGS.aimAtMouseClosest = false; GatsModCore.SETTINGS.spinbotEnabled = false; GatsModCore.SETTINGS.followBotEnabled = false;
            GatsModCore.SETTINGS.espColors = { ...defaultSettings.espColors, ...(savedSettings.espColors || {}) }; GatsModCore.SETTINGS.settingProfiles = savedSettings.settingProfiles || {}; GatsModCore.SETTINGS.aimbotIgnoreList = Array.isArray(savedSettings.aimbotIgnoreList) ? savedSettings.aimbotIgnoreList : [];
        }

        setupGUI() {
            if (!this.simpleGui) return; this.simpleGui.applyStyles(); this.simpleGui.populateColumn1_ESP(); this.simpleGui.populateColumn2_Aimbot(); this.simpleGui.populateColumn3_Utilities(); this.simpleGui.createPlayerListModal();
            const mainWrapper = this.simpleGui.container.querySelector('#gui-main-content-wrapper'); if (mainWrapper) this.simpleGui.addHideButton(mainWrapper);
        }

        setupOverlay() {
            const existingOverlay = document.getElementById('zeroarcop-gats-mod-overlay'); if (existingOverlay) this.overlayCanvas = existingOverlay; else { this.overlayCanvas = document.createElement('canvas'); this.overlayCanvas.id = 'zeroarcop-gats-mod-overlay'; document.body.appendChild(this.overlayCanvas); }
            this.overlayCanvas.width = this.gameCanvas.width; this.overlayCanvas.height = this.gameCanvas.height; this.overlayCanvas.style.position = 'absolute'; this.overlayCanvas.style.left = this.gameCanvas.offsetLeft + 'px'; this.overlayCanvas.style.top = this.gameCanvas.offsetTop + 'px'; this.overlayCanvas.style.pointerEvents = 'none'; this.overlayCanvas.style.zIndex = (parseInt(this.gameCanvas.style.zIndex || '0') + 1).toString(); this.overlayCtx = this.overlayCanvas.getContext('2d');
        }

        addEventListeners() {
            new ResizeObserver(() => { if (this.gameCanvas && this.overlayCanvas) { this.overlayCanvas.width = this.gameCanvas.width; this.overlayCanvas.height = this.gameCanvas.height; this.overlayCanvas.style.left = this.gameCanvas.offsetLeft + 'px'; this.overlayCanvas.style.top = this.gameCanvas.offsetTop + 'px'; } }).observe(this.gameCanvas);
            window.addEventListener('keydown', (e) => {
                if (GatsModCore.isInputActive) { if (e.key === "Escape" && document.activeElement?.blur) document.activeElement.blur(); return; }
                if (e.key === '0') {
                    if (this.simpleGui?.container) { const isVisible = this.simpleGui.container.style.display !== 'none'; this.simpleGui.container.style.display = isVisible ? 'none' : 'block'; if (this.colorGui?.container) this.colorGui.container.style.display = isVisible ? 'none' : 'block'; }
                }
            });
            const guiIdsToIgnore = [this.simpleGui.container.id, this.colorGui?.container.id, 'player-list-modal'].filter(Boolean); document.addEventListener('mousedown', (e) => { if (!e.target.closest(guiIdsToIgnore.map(id => `#${id}`).join(', '))) this.realMouseButtons = e.buttons; }, true); document.addEventListener('mouseup', (e) => { this.realMouseButtons = e.buttons; }, true);
        }

        hookMouseEvents() { const self = this; this.gameCanvas.addEventListener('mousemove', function(event) { const rect = self.gameCanvas.getBoundingClientRect(); self.realMouseCanvasX = event.clientX - rect.left; self.realMouseCanvasY = event.clientY - rect.top; }); }

        mainGameTick() {
            this.tickCounter++; const me = Player.pool?.[selfId];
            if (!me?.activated) { if (this.isAutoShooting) this.stopShooting(); this.currentAimAssistTargetCoords = null; this.currentAimbotTarget = null; this.lastSelfKills = 0; this.overlayCtx?.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height); this.autonomousBot.update(me); return; }
            if (!this.overlayCtx || !camera?.ctx) return;
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            if (GatsModCore.SETTINGS.ghostDetectEnabled) this.performGhostDetection(); if (GatsModCore.SETTINGS.silencerDetectEnabled) this.performSilencerDetection(); if (GatsModCore.SETTINGS.onKillChatEnabled) this.checkOnKillEvent(me);
            this.autonomousBot.update(me);
            const aimbotActive = GatsModCore.SETTINGS.aimbotEnabled; this.currentAimAssistTargetCoords = null; this.currentAimbotTarget = null;
            if (aimbotActive) { this.performAimbotTargeting(me); }
            if (GatsModCore.SETTINGS.autoAttackEnabled) { this.performAutoAttack(me); } else if (this.isAutoShooting) { this.stopShooting(); }
            if (aimbotActive && this.aimTargetScreenCoords) { this.currentAimAssistTargetCoords = this.aimTargetScreenCoords; }
            if (this.currentAimAssistTargetCoords && this.originalUpdateMouseData) { let clientX = this.currentAimAssistTargetCoords.x, clientY = this.currentAimAssistTargetCoords.y; if (this.gameCanvas) { const rect = this.gameCanvas.getBoundingClientRect(); clientX += rect.left; clientY += rect.top; } const fakeEvent = { clientX: clientX, clientY: clientY, target: this.gameCanvas, buttons: 1 }; this.originalUpdateMouseData(fakeEvent); }
            if (GatsModCore.SETTINGS.espEnabled) { this.drawESP(this.overlayCtx, me, !!this.currentAimAssistTargetCoords); }
            if (this.tickCounter % 30 === 0) { this.simpleGui?.updateStatusDisplay(); }
        }

        checkOnKillEvent(me) { if (!me) return; if (this.lastSelfKills === null || this.lastSelfKills === undefined) { this.lastSelfKills = me.kills; return; } if (me.kills > this.lastSelfKills) { modLog("Kill detected, sending on-kill message."); GatsModCore.sendChatMessage(GatsModCore.SETTINGS.onKillMessage); } this.lastSelfKills = me.kills; }
        performGhostDetection() { try { if (!Player || !Player.pool) return; for (const id in Player.pool) { const p = Player.pool[id]; if (p && p.ghillie) p.ghillie = false; } } catch (e) {} }
        performSilencerDetection() { try { if (!Bullet || !Bullet.pool) return; for (const id in Bullet.pool) { const b = Bullet.pool[id]; if (b && b.silenced) b.silenced = false; } } catch (e) {} }
        startShooting() { if (this.isAutoShooting) return; try { Connection.list[0].send(prepareMessage('key-press', { 'inputId': 6, 'state': 1 })); this.isAutoShooting = true; } catch(e) { modLog("Failed to send start shooting command.", true); } }
        stopShooting() { if (!this.isAutoShooting) return; try { Connection.list[0].send(prepareMessage('key-press', { 'inputId': 6, 'state': 0 })); this.isAutoShooting = false; } catch(e) { modLog("Failed to send stop shooting command.", true); } }
        getBulletOrigin(player) { let originX = player.x; let originY = player.y; const weaponClass = player.class || 'pistol'; const forward = this.constructor.WEAPON_FORWARD_OFFSETS[weaponClass] || 45; const sideways = -18; const angleRad = (player.playerAngle || 0) * Math.PI / 180; originX += forward * Math.cos(angleRad) + sideways * Math.cos(angleRad + Math.PI / 2); originY += forward * Math.sin(angleRad) + sideways * Math.sin(angleRad + Math.PI / 2); return { x: originX, y: originY }; }
        hasLineOfSight(p1, p2) { if (typeof MapObject === 'undefined' || !MapObject.pool) return true; for (const id in MapObject.pool) { const obs = MapObject.pool[id]; if (obs?.activated && (obs.type === 'crate' || obs.type === 'longCrate' || obs.type === 'userCrate')) { if (this.isLineIntersectingRotatedRect(p1, p2, obs)) { return false; } } } return true; }
        isLineIntersectingRotatedRect(p1, p2, rect) { const settings = GatsModCore.SETTINGS; const angle = -(rect.angle || 0) * Math.PI / 180; const cos = Math.cos(angle), sin = Math.sin(angle); const cx = rect.x + settings.obstacleOffsetX; const cy = rect.y + settings.obstacleOffsetY; const p1r = { x: cos * (p1.x - cx) - sin * (p1.y - cy), y: sin * (p1.x - cx) + cos * (p1.y - cy) }; const p2r = { x: cos * (p2.x - cx) - sin * (p2.y - cy), y: sin * (p2.x - cx) + cos * (p2.y - cy) }; let w = rect.width, h = rect.height; if (rect.type === 'crate') { w = 100; h = 100; } else if (rect.type === 'userCrate') { w = 40; h = 40; } const halfW = w / 2, halfH = h / 2; const rectMin = { x: -halfW, y: -halfH }; const rectMax = { x: halfW, y: halfH }; const dx = p2r.x - p1r.x; const dy = p2r.y - p1r.y; let t0 = 0, t1 = 1; const p = [-dx, dx, -dy, dy]; const q = [p1r.x - rectMin.x, rectMax.x - p1r.x, p1r.y - rectMin.y, rectMax.y - p1r.y]; for(let i = 0; i < 4; i++) { if (p[i] === 0) { if (q[i] < 0) return true; } else { const t = q[i] / p[i]; if (p[i] < 0) { if (t > t1) return false; t0 = Math.max(t0, t); } else { if (t < t0) return false; t1 = Math.min(t1, t); } } } return t0 < t1; }
        getCurrentMaxRange(player) { if (!player) return 0; const weaponClass = player.class || 'pistol'; let baseRange = GatsModCore.WEAPON_BASE_RANGES[weaponClass] || 425; if (player.levelUpgrades) { const hasLongRange = Object.values(player.levelUpgrades).includes('longRange'); if (hasLongRange) { baseRange *= GatsModCore.LONG_RANGE_MULTIPLIER; } } return baseRange; }
        performAutoAttack(me) { if (!this.currentAimbotTarget || !this.predictedTargetWorld.x) { this.stopShooting(); return; } const screenX = this.aimTargetScreenCoords.x; const screenY = this.aimTargetScreenCoords.y; const canvasCenterX = this.gameCanvas.width / 2; const canvasCenterY = this.gameCanvas.height / 2; const distFromCenterSq = (screenX - canvasCenterX)**2 + (screenY - canvasCenterY)**2; if (distFromCenterSq > GatsModCore.SETTINGS.autoAttackRadius**2) { this.stopShooting(); return; } const bulletOrigin = this.getBulletOrigin(me); if (GatsModCore.SETTINGS.autoAttackCheckLOS) { if (!this.hasLineOfSight(bulletOrigin, this.predictedTargetWorld)) { this.stopShooting(); return; } } if (GatsModCore.SETTINGS.autoAttackCheckRange) { const maxRange = this.getCurrentMaxRange(me); const targetDistance = getDistance(bulletOrigin, this.predictedTargetWorld); if (targetDistance > maxRange) { this.stopShooting(); return; } } this.startShooting(); }
        calculatePredictedPosition(p, me) { const settings = GatsModCore.SETTINGS; if (!settings.predictionEnabled || p.spdX === undefined || p.spdY === undefined) { return { x: p.x, y: p.y }; } const { x: shotOriginX_world, y: shotOriginY_world } = this.getBulletOrigin(me); let basePredictionFactor = settings.predictionFactor; if (settings.useCloseRangePrediction) { const canvasCenterX = this.gameCanvas.width / 2; const canvasCenterY = this.gameCanvas.height / 2; const screenPlayerX = canvasCenterX + (p.x - me.x); const screenPlayerY = canvasCenterY + (p.y - me.y); const distSqFromCenter = (screenPlayerX - canvasCenterX)**2 + (screenPlayerY - canvasCenterY)**2; if (distSqFromCenter < settings.predictionCloseRadius**2) { basePredictionFactor = settings.predictionFactorClose; } } const currentWeaponClass = me.class || 'pistol'; let bulletSpeed = GatsModCore.WEAPON_BULLET_SPEEDS[currentWeaponClass] || 9.0; bulletSpeed = Math.max(0.1, bulletSpeed); let timeToHit = 0; let futureX_intermediate = p.x; let futureY_intermediate = p.y; for (let i = 0; i < 2; i++) { const distanceToFuturePos = getDistance({ x: futureX_intermediate, y: futureY_intermediate }, { x: shotOriginX_world, y: shotOriginY_world }); timeToHit = distanceToFuturePos < 1 ? 0 : distanceToFuturePos / bulletSpeed; timeToHit = Math.min(timeToHit, 5); futureX_intermediate = p.x + (p.spdX * timeToHit); futureY_intermediate = p.y + (p.spdY * timeToHit); } const baseDisplacementX = p.spdX * timeToHit; const baseDisplacementY = p.spdY * timeToHit; let actualPredictionFactor = basePredictionFactor; if (basePredictionFactor === settings.predictionFactor && settings.enableDynamicPredictionFactor) { const distanceToEnemy = getDistance(p, { x: shotOriginX_world, y: shotOriginY_world }); const { predictionFactorAtMinDistance: minF, predictionFactor: maxF, minPredictionDistance: minD, maxPredictionDistance: maxD } = settings; if (distanceToEnemy <= minD) { actualPredictionFactor = minF; } else if (distanceToEnemy >= maxD) { actualPredictionFactor = maxF; } else if (maxD > minD) { const ratio = (distanceToEnemy - minD) / (maxD - minD); actualPredictionFactor = minF + (maxF - minF) * ratio; } else { actualPredictionFactor = maxF; } actualPredictionFactor = Math.max(0, actualPredictionFactor); } if (p.dashing) { actualPredictionFactor /= 3; } const worldTargetX = p.x + (baseDisplacementX * actualPredictionFactor); const worldTargetY = p.y + (baseDisplacementY * actualPredictionFactor); return { x: worldTargetX, y: worldTargetY }; }
        performAimbotTargeting(me) {
            if (!this.gameCanvas) { this.aimTargetScreenCoords = null; this.currentAimbotTarget = null; return; }
            const settings = GatsModCore.SETTINGS; const bot = this.autonomousBot;
            const canvasCenterX = this.gameCanvas.width / 2; const canvasCenterY = this.gameCanvas.height / 2;
            let targetCandidate = null; let finalTargetPlayerObject = null;
            let refX = canvasCenterX; let refY = canvasCenterY;
            let closestPlayerDistSq = settings.aimbotFov**2;
            let escortTarget = bot.escortTargetId ? Player.pool[bot.escortTargetId] : null;

            for (const id in Player.pool) {
                const p = Player.pool[id];
                if (!p?.activated || p.hp <= 0 || id == selfId || (me.teamCode !== 0 && p.teamCode === me.teamCode) || settings.aimbotIgnoreList?.includes(p.username)) continue;
                const { x: worldTargetX, y: worldTargetY } = this.calculatePredictedPosition(p, me);
                const screenTargetXUnscaled = canvasCenterX + (worldTargetX - me.x); const screenTargetYUnscaled = canvasCenterY + (worldTargetY - me.y);
                let distToRefSq = (screenTargetXUnscaled - refX)**2 + (screenTargetYUnscaled - refY)**2;

                // 護衛モードの場合、護衛対象に近い敵を優先
                if (escortTarget) {
                    const distToEscort = getDistance(p, escortTarget);
                    // 距離を優先度スコアに変換（近いほどスコアが低い = 優先度が高い）
                    // 画面中心からの距離も少しだけ考慮に入れる
                    distToRefSq = distToEscort**2 * 0.9 + distToRefSq * 0.1;
                }

                if (distToRefSq < closestPlayerDistSq) {
                    closestPlayerDistSq = distToRefSq; targetCandidate = { x_world: worldTargetX, y_world: worldTargetY }; finalTargetPlayerObject = p;
                }
            }
            if (targetCandidate) {
                this.aimTargetScreenCoords = { x: canvasCenterX + (targetCandidate.x_world - me.x) / (settings.espScale || 1) + settings.espOffsetX, y: canvasCenterY + (targetCandidate.y_world - me.y) / (settings.espScale || 1) + settings.espOffsetY };
                this.currentAimbotTarget = finalTargetPlayerObject; this.predictedTargetWorld = { x: targetCandidate.x_world, y: targetCandidate.y_world };
            } else { this.aimTargetScreenCoords = null; this.currentAimbotTarget = null; this.predictedTargetWorld = { x: 0, y: 0 }; }
        }
        drawESP(ctx, me, hasTarget) {
            const { espColors, espScale, espOffsetX, espOffsetY, obstacleEspColor } = GatsModCore.SETTINGS; if (!this.gameCanvas || !camera?.ctx) return;
            try { if (typeof landMine !== 'undefined' && Array.isArray(landMine) && landMine[0]) { landMine[0].forEach((a, i) => { if (landMine[0][i] && landMine[0][i][1]) { landMine[0][i][1][3] = "#000000"; } }); } } catch (e) {}
            const canvasCenterX = this.gameCanvas.width / 2, canvasCenterY = this.gameCanvas.height / 2; ctx.save(); ctx.textAlign = 'center'; ctx.font = 'bold 10px Arial';
            if (GatsModCore.SETTINGS.autoAttackShowRadius) { ctx.beginPath(); ctx.arc(canvasCenterX, canvasCenterY, GatsModCore.SETTINGS.autoAttackRadius, 0, 2 * Math.PI); ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; ctx.lineWidth = 1; ctx.stroke(); }
            if (GatsModCore.SETTINGS.obstacleEspEnabled && MapObject && MapObject.pool) { ctx.strokeStyle = obstacleEspColor; ctx.lineWidth = 2; for (const id in MapObject.pool) { const obj = MapObject.pool[id]; if (!obj || !obj.activated) continue; let width = obj.width || 50; let height = obj.height || 50; if (obj.type === 'crate') { width = 100; height = 100; } if (obj.type === 'userCrate') { width = 40; height = 40; } const objX = obj.x + GatsModCore.SETTINGS.obstacleOffsetX; const objY = obj.y + GatsModCore.SETTINGS.obstacleOffsetY; const screenX = canvasCenterX + (objX - me.x) / espScale + espOffsetX; const screenY = canvasCenterY + (objY - me.y) / espScale + espOffsetY; ctx.save(); ctx.translate(screenX, screenY); ctx.rotate((obj.angle || 0) * Math.PI / 180); ctx.strokeRect(-width / 2 / espScale, -height / 2 / espScale, width / espScale, height / espScale); ctx.restore(); } }
            if (this.autonomousBot && this.autonomousBot.targetPosition) { const target = this.autonomousBot.targetPosition; const screenX = canvasCenterX + (target.x - me.x) / espScale + espOffsetX; const screenY = canvasCenterY + (target.y - me.y) / espScale + espOffsetY; ctx.beginPath(); ctx.moveTo(screenX - 10, screenY - 10); ctx.lineTo(screenX + 10, screenY + 10); ctx.moveTo(screenX + 10, screenY - 10); ctx.lineTo(screenX - 10, screenY + 10); ctx.strokeStyle = '#00FFFF'; ctx.lineWidth = 2; ctx.stroke(); }
            if (GatsModCore.SETTINGS.losDebugLineEnabled && this.currentAimbotTarget) { const startPoint = this.getBulletOrigin(me); const endPoint = this.predictedTargetWorld; if (startPoint && endPoint.x) { const isClear = this.hasLineOfSight(startPoint, endPoint); ctx.strokeStyle = isClear ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)'; ctx.lineWidth = 3; const startScreenX = canvasCenterX + (startPoint.x - me.x) / espScale + espOffsetX; const startScreenY = canvasCenterY + (startPoint.y - me.y) / espScale + espOffsetY; const endScreenX = canvasCenterX + (endPoint.x - me.x) / espScale + espOffsetX; const endScreenY = canvasCenterY + (endPoint.y - me.y) / espScale + espOffsetY; ctx.beginPath(); ctx.moveTo(startScreenX, startScreenY); ctx.lineTo(endScreenX, endScreenY); ctx.stroke(); } }
            for (const id in Player.pool) {
                const p = Player.pool[id]; if (!p?.activated || p.hp <= 0 || id == selfId) continue;
                const isTeammate = (me.teamCode !== 0 && p.teamCode === me.teamCode);
                if (isTeammate && !GatsModCore.SETTINGS.espShowTeammates) continue;
                const relX = (p.x - me.x) / espScale, relY = (p.y - me.y) / espScale; const screenX = canvasCenterX + relX + espOffsetX, screenY = canvasCenterY + relY + espOffsetY; const radiusOnScreen = (p.radius || 15) / espScale;
                let boxColor = isTeammate ? espColors.teammateEspColor : espColors.enemyEspColor; if (!isTeammate && GatsModCore.SETTINGS.espHighlightLowHP && p.hp < GatsModCore.SETTINGS.lowHPThreshold) { boxColor = espColors.lowHpEnemyEspColor; }
                if (isTeammate && this.autonomousBot.escortTargetId === id) { boxColor = '#FFFF00'; /* 護衛対象は黄色 */ ctx.lineWidth = 3; } else { ctx.lineWidth = 1.5; }
                ctx.strokeStyle = boxColor; ctx.strokeRect(screenX - radiusOnScreen, screenY - radiusOnScreen, radiusOnScreen * 2, radiusOnScreen * 2);
                ctx.beginPath(); ctx.moveTo(canvasCenterX + espOffsetX, canvasCenterY + espOffsetY); ctx.lineTo(screenX, screenY); ctx.stroke();
                let nameYOffset = screenY - radiusOnScreen - 15; if (GatsModCore.SETTINGS.espHighlightCloaked && p.ghillie && !isTeammate) { ctx.font = 'bold 12px Arial'; ctx.fillStyle = espColors.cloakedTextColor; ctx.fillText('CLOAKED', screenX, nameYOffset); nameYOffset -= 14; }
                if (p.username) { ctx.font = 'bold 10px Arial'; ctx.fillStyle = isTeammate ? espColors.teammateNameColor : espColors.enemyNameColor; ctx.fillText(p.username, screenX, nameYOffset); }
                if (GatsModCore.SETTINGS.espShowHP) { const hpPercent = p.hp / (p.hpMax || 100); const barW = radiusOnScreen * 1.8, barH = 4; const barX = screenX - barW / 2, barY = screenY + radiusOnScreen + 4; ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(barX, barY, barW, barH); ctx.fillStyle = hpPercent > 0.6 ? espColors.hpBarHighColor : hpPercent > 0.3 ? espColors.hpBarMediumColor : espColors.hpBarLowColor; ctx.fillRect(barX, barY, barW * hpPercent, barH); }
                if (!isTeammate && GatsModCore.SETTINGS.espShowPrediction && GatsModCore.SETTINGS.predictionEnabled) { const predictedPos = this.calculatePredictedPosition(p, me); if (predictedPos) { const predRelX = (predictedPos.x - me.x) / espScale; const predRelY = (predictedPos.y - me.y) / espScale; const predScreenX = canvasCenterX + predRelX + espOffsetX; const predScreenY = canvasCenterY + predRelY + espOffsetY; ctx.strokeStyle = espColors.predictionLineColor || '#FF00FF'; ctx.lineWidth = 1; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(screenX, screenY); ctx.lineTo(predScreenX, predScreenY); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(predScreenX, predScreenY, 3, 0, 2 * Math.PI); ctx.fillStyle = espColors.predictionLineColor || '#FF00FF'; ctx.fill(); } }
                if (GatsModCore.SETTINGS.espShowFacingLine && p.playerAngle !== undefined) { const angleRad = p.playerAngle * Math.PI / 180; const lineLen = radiusOnScreen * 1.2; ctx.beginPath(); ctx.moveTo(screenX, screenY); ctx.lineTo(screenX + lineLen * Math.cos(angleRad), screenY + lineLen * Math.sin(angleRad)); ctx.strokeStyle = espColors.facingLineColor; ctx.lineWidth = 2; ctx.stroke(); }
            }
            if (hasTarget && this.currentAimAssistTargetCoords) { const { x, y } = this.currentAimAssistTargetCoords; const originWorld = this.getBulletOrigin(me); const originX = canvasCenterX + (originWorld.x - me.x) / espScale + espOffsetX; const originY = canvasCenterY + (originWorld.y - me.y) / espScale + espOffsetY; ctx.strokeStyle = espColors.aimbotTargetLineColor; ctx.lineWidth = 1.0; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 15, 0, 2 * Math.PI); ctx.stroke(); }
            ctx.restore();
        }
        getBotPhysics(player) { const weapon = player.class || 'pistol'; const armor = player.armor || 0; const upgrades = player.levelUpgrades ? Object.values(player.levelUpgrades) : []; const baseSpeed = GatsModCore.PLAYER_SPEEDS.base[weapon] || GatsModCore.PLAYER_SPEEDS.base['pistol']; const armorMod = GatsModCore.PLAYER_SPEEDS.armorMultiplier[armor] || 1.0; const upgradeMod = upgrades.includes('lightweight') ? GatsModCore.PLAYER_SPEEDS.upgradeMultiplier['lightweight'] : 1.0; const maxSpeed = baseSpeed * armorMod * upgradeMod; const ACCELERATION = maxSpeed / 16.0; const FRICTION = 0.94; return { maxSpeed, ACCELERATION, FRICTION }; }
        updateSimulatedKeys(keysToPress) { const allKeys = ['w', 'a', 's', 'd']; allKeys.forEach(key => { const shouldBePressed = keysToPress.includes(key); if (shouldBePressed !== this.simulatedKeys[key]) { this._fireKeyEvent(shouldBePressed ? 'keydown' : 'keyup', key); this.simulatedKeys[key] = shouldBePressed; } });}
        _fireKeyEvent(type, key) { const keyMap = { 'w': 87, 'a': 65, 's': 83, 'd': 68 }; const codeMap = { 'w': 'KeyW', 'a': 'KeyA', 's': 'KeyS', 'd': 'KeyD' }; if (!keyMap[key]) return; document.dispatchEvent(new KeyboardEvent(type, { key: key, code: codeMap[key], keyCode: keyMap[key], bubbles: true, cancelable: true, composed: true })); }
        static saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(GatsModCore.SETTINGS)); } catch (e) { modLog("Error saving settings: " + e.message, true); }};
        static saveProfile(name) { if (!name) { alert("Please enter a profile name."); return; } if (!GatsModCore.SETTINGS.settingProfiles) GatsModCore.SETTINGS.settingProfiles = {}; const settingsToSave = {...GatsModCore.SETTINGS}; delete settingsToSave.settingProfiles; GatsModCore.SETTINGS.settingProfiles[name] = JSON.stringify(settingsToSave); GatsModCore.saveSettings(); gatsModInstance?.simpleGui?.updateProfileList(); alert(`Profile "${name}" saved.`); };
        static loadProfile(name) { if (!name) { alert("Select a profile to load."); return; } const profileDataString = GatsModCore.SETTINGS.settingProfiles?.[name]; if (!profileDataString) { alert(`Profile "${name}" not found.`); return; } try { const loadedProfileSettings = JSON.parse(profileDataString); const preservedProfiles = GatsModCore.SETTINGS.settingProfiles; const preservedEspColors = GatsModCore.SETTINGS.espColors; GatsModCore.SETTINGS = {...GatsModCore.SETTINGS, ...loadedProfileSettings}; GatsModCore.SETTINGS.settingProfiles = preservedProfiles; GatsModCore.SETTINGS.espColors = GatsModCore.SETTINGS.espColors || preservedEspColors; GatsModCore.saveSettings(); gatsModInstance?.simpleGui?.updateAllGUIToReflectSettings(); if (gatsModInstance?.colorGui && GatsModCore.SETTINGS.espColors) { Object.keys(GatsModCore.SETTINGS.espColors).forEach(key => {const picker = document.getElementById(key + '-color-v2'); if(picker) picker.value = GatsModCore.SETTINGS.espColors[key]; });} alert(`Profile "${name}" loaded.`); } catch (e) { alert("Error loading profile. It may be corrupt: " + e.message); } };
        static deleteProfile(name) { if (!name || !confirm(`Are you sure you want to delete the profile "${name}"?`)) return; if (GatsModCore.SETTINGS.settingProfiles?.[name]) { delete GatsModCore.SETTINGS.settingProfiles[name]; GatsModCore.saveSettings(); gatsModInstance?.simpleGui?.updateProfileList(); alert(`Profile "${name}" deleted.`); } };
        static sendChatMessage(message) { if (!message || message.trim().length === 0) return; if (!Connection.list?.[0]?.socket?.send) { modLog("Chat: Connection not available.", true); return; } try { const sanitizedMessage = message.replaceAll(",", "~"); Connection.list[0].socket.send(`c,${sanitizedMessage}\x00`); } catch (e) { modLog(`Chat: Error sending message: ${e.message}`, true); } }
        static startBotChat() { GatsModCore.stopBotChat(); GatsModCore.chatIntervalId = setInterval(() => { GatsModCore.sendChatMessage("Bot"); }, 150); }
        static stopBotChat() { if (GatsModCore.chatIntervalId) { clearInterval(GatsModCore.chatIntervalId); GatsModCore.chatIntervalId = null; } }
        static showTeammateList() {
            const modal = document.getElementById('player-list-modal'); const grid = document.getElementById('player-list-grid'); if (!modal || !grid || typeof Player === 'undefined' || !Player.pool || typeof selfId === 'undefined') { alert("Player data not available yet."); return; }
            grid.innerHTML = '';
            const me = Player.pool[selfId];
            if (!me || me.teamCode === 0) { alert("You are not on a team (or team data is not available)."); return;}
            Object.values(Player.pool).filter(p => p?.activated && p.id !== selfId && p.teamCode === me.teamCode && p.username).forEach(p => {
                const btn = document.createElement('button'); btn.className = 'player-list-button'; btn.innerText = p.username; btn.title = p.username;
                btn.onclick = () => {
                    gatsModInstance.autonomousBot.setEscortTarget(p.id, p.username);
                    modal.style.display = 'none';
                };
                grid.appendChild(btn);
            });
            modal.style.display = 'flex';
        };
    }

    let gatsModInstance = null; let game_original_updateMouseData_ref = null; let modInitializationAttempted = false;
    const gatsModLauncherInterval = setInterval(() => {
        if (modInitializationAttempted) { clearInterval(gatsModLauncherInterval); return; }
        if (typeof updateMouseData === 'function' && typeof Player !== 'undefined' && Player.pool && typeof Connection !== 'undefined' && Connection.list?.[0]?.socket && typeof prepareMessage === 'function' && typeof camera === 'object' && camera?.ctx && typeof selfId !== 'undefined' && document.getElementById('canvas')) {
            modLog(`[Launcher] Game ready. Initializing mod.`); clearInterval(gatsModLauncherInterval); modInitializationAttempted = true;
            game_original_updateMouseData_ref = updateMouseData;
            updateMouseData = function(eventData) {
                if (!gatsModInstance) {
                    try {
                        gatsModInstance = new GatsModCore(); gatsModInstance.originalUpdateMouseData = game_original_updateMouseData_ref;
                        const original_clearRect = CanvasRenderingContext2D.prototype.clearRect;
                        CanvasRenderingContext2D.prototype.clearRect = function(...args) { original_clearRect.apply(this, args); if (gatsModInstance && this.canvas.id === 'canvas' && Player.pool?.[selfId]?.activated) { try { gatsModInstance.mainGameTick(); } catch (e) { modLog(`mainGameTick error: ${e.stack}`, true); } } };
                        modLog(`[Launcher] clearRect hooked for game tick.`);
                    } catch (e) { modLog(`[Launcher] GatsModCore instantiation failed: ${e.stack}`, true); updateMouseData = game_original_updateMouseData_ref; return; }
                } return;
            };
            modLog(`[Launcher] updateMouseData wrapped for autonomous control.`);
        }
    }, 250);
    setTimeout(() => { if (!modInitializationAttempted) { modLog(`[Launcher] Timeout: Game did not initialize required components. Mod will not start.`, true); clearInterval(gatsModLauncherInterval); } }, 20000);
})();
(function() {
    'use strict';
    window.addEventListener ("load", onload);
    function onload() {
        let processMessageTmp = processMessage;
        processMessage = function(event) {
            processMessageTmp(event); let decoded = new TextDecoder().decode(event.data); if (!decoded.includes("a,")) return;
            camera.update = function() { let player = Player.pool[selfId]; if (camera.trackingId) { camera.x = player.x - hudXPosition; camera.y = player.y - hudYPosition; } }
        }
    }
})();