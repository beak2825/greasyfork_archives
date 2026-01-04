// ==UserScript==
// @name         Сортировщик ресурсов (с фильтром и ручной сортировкой)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Сетка, полное убирание рандома, фильтр по ресурсам, ручная сортировка стрелками
// @author       You
// @match        *://*.asteriagame.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546408/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%28%D1%81%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%BC%20%D0%B8%20%D1%80%D1%83%D1%87%D0%BD%D0%BE%D0%B9%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546408/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%28%D1%81%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%BC%20%D0%B8%20%D1%80%D1%83%D1%87%D0%BD%D0%BE%D0%B9%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------------------------------------
    // 1. Настройки сетки (как раньше)
    // ----------------------------------------------------------
    const GRID_CONFIG = {
        startX: 50,
        startY: 75,
        xStep: 35,
        yStep: 45,
        itemsPerRow: 20
    };

    // ----------------------------------------------------------
    // 2. UI-фильтр и ручная сортировка
    // ----------------------------------------------------------
    class ResourceFilterUI {
        constructor() {
            this.order   = [];   // текущий порядок имён
            this.visible = new Set(); // отмеченные ресурсы
            this.createPanel();
            document.body.appendChild(this.panel);
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'hunt-filter-panel';
            Object.assign(this.panel.style, {
                position: 'fixed', top: '10px', right: '10px', zIndex: 9999,
                background: '#fff', border: '1px solid #000', padding: '4px 6px',
                font: '12px/16px Arial', userSelect: 'none', width: '180px'
            });

            // кнопка "Всё"
            this.btn = document.createElement('button');
            this.btn.textContent = 'Всё';
            this.btn.style.marginRight = '4px';
            this.btn.onclick = () => this.toggleList();

            // общая галочка
            this.allChk = document.createElement('input');
            this.allChk.type = 'checkbox';
            this.allChk.checked = true;
            this.allChk.onchange = () => this.onAllChange();

            // контейнер ресурсов
            this.list = document.createElement('div');
            this.list.style.display = 'none';
            this.list.style.maxHeight = '200px';
            this.list.style.overflowY = 'auto';
            this.list.style.borderTop = '1px solid #ccc';
            this.list.style.marginTop = '4px';

            this.panel.append(this.btn, this.allChk, this.list);
        }

        updateResourceList(names) {
            const unique = [...new Set(names)];
            unique.forEach(n => {
                if (!this.order.includes(n)) {
                    this.order.push(n);
                    this.visible.add(n);
                }
            });
            this.render();
        }

        render() {
            this.list.innerHTML = '';
            this.order.forEach((name, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.padding = '2px 0';

                // стрелка вверх
                if (idx > 0) {
                    const up = document.createElement('span');
                    up.innerHTML = '▲';
                    up.style.cursor = 'pointer';
                    up.style.marginRight = '2px';
                    up.onclick = () => this.swap(idx, idx - 1);
                    row.appendChild(up);
                } else {
                    row.appendChild(document.createElement('span')).style.width = '10px';
                }

                // стрелка вниз
                if (idx < this.order.length - 1) {
                    const down = document.createElement('span');
                    down.innerHTML = '▼';
                    down.style.cursor = 'pointer';
                    down.style.marginRight = '4px';
                    down.onclick = () => this.swap(idx, idx + 1);
                    row.appendChild(down);
                } else {
                    row.appendChild(document.createElement('span')).style.width = '10px';
                }

                // галочка
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = this.visible.has(name);
                chk.style.marginRight = '4px';
                chk.onchange = (e) => {
                    e.target.checked ? this.visible.add(name) : this.visible.delete(name);
                };

                // название
                const label = document.createElement('span');
                label.textContent = name;
                label.style.flex = 1;

                row.append(chk, label);
                this.list.appendChild(row);
            });
        }

        swap(i, j) {
            [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
            this.render();
        }

        toggleList() {
            this.list.style.display = this.list.style.display === 'none' ? 'block' : 'none';
        }

        onAllChange() {
            if (this.allChk.checked) {
                this.order.forEach(n => this.visible.add(n));
                this.list.style.display = 'none';
            }
            this.render();
        }

        getOrder()   { return [...this.order]; }
        getVisible() { return new Set(this.visible); }
    }

    // ----------------------------------------------------------
    // 3. Переопределение parse_farm
    // ----------------------------------------------------------
    const origParseFarm = canvas.app.hunt.engine.ObjectsUpdater.prototype.parse_farm;
    canvas.app.hunt.engine.ObjectsUpdater.prototype.parse_farm = function(ar) {
        origParseFarm.call(this, ar);

        const farmItems = [];
        for (let key in this.Objects) {
            const obj = this.Objects[key];
            if (obj.type === 'farm' && !obj.old_flag) farmItems.push(obj);
        }
        if (farmItems.length === 0) return;

        // UI один раз
        if (!window.resourceFilterUI) window.resourceFilterUI = new ResourceFilterUI();
        const ui = window.resourceFilterUI;
        ui.updateResourceList(farmItems.map(o => o.name));

        const order   = ui.getOrder();
        const visible = ui.getVisible();

        // сортировка по order
        farmItems.sort((a, b) => {
            const ia = order.indexOf(a.name);
            const ib = order.indexOf(b.name);
            return ia - ib;
        });

        // раскладываем по сетке
        const { startX, startY, xStep, yStep, itemsPerRow } = GRID_CONFIG;
        let row = 0, col = 0, prevGroupKey = null;

        farmItems.forEach(item => {
            const groupKey = `${item.skill}-${item.name}`;

            if (!visible.has(item.name)) {
                item.x = 0;
                item.y = 0;
                item.old_flag = true;
                return;
            }

            if (prevGroupKey !== null && groupKey !== prevGroupKey) {
                row++; col = 0;
            } else if (col >= itemsPerRow) {
                row++; col = 0;
            }

            item.x = startX + col * xStep;
            item.y = startY + row * yStep;
            item.new_pos = true;

            item.rndX = 0;
            item.rndY = 0;
            item.rndRotation = 0;

            col++;
            prevGroupKey = groupKey;
        });

        console.groupCollapsed(`[Hunt Organizer] Sorted ${farmItems.filter(i => !i.old_flag).length} items`);
        console.table(farmItems.filter(i => !i.old_flag).map(item => ({
            Name: item.name,
            Skill: item.skill,
            'Grid Position': `(${item.x}, ${item.y})`,
            'Original Position': `(${item.origX}, ${item.origY})`
        })));
        console.groupEnd();
    };

    // ----------------------------------------------------------
    // 4. Остальные переопределения (без изменений)
    // ----------------------------------------------------------
    const overrideHuntBehavior = () => {
        if (typeof canvas === 'undefined' || !canvas.app || !canvas.app.hunt) {
            console.error('[Hunt Organizer] Game objects not available');
            return;
        }

        // parse_bots – фильтруем пустые координаты
        const origParseBots = canvas.app.hunt.engine.ObjectsUpdater.prototype.parse_bots;
        canvas.app.hunt.engine.ObjectsUpdater.prototype.parse_bots = function(ar) {
            const validBots = [];
            for (let i = 0; i < ar.length; i++) {
                const node = ar[i];
                if (node.nodeName === 'bot') {
                    const attr = node.attributes;
                    if (attr.x && attr.x.value !== "" && attr.y && attr.y.value !== "") {
                        validBots.push(node);
                    }
                }
            }
            origParseBots.call(this, validBots);
        };

        // FieldObject – убираем рандом
        const origFieldObject = canvas.app.hunt.view.FieldObject;
        const origCompleteObject = origFieldObject.prototype.complete_object;

        canvas.app.hunt.view.FieldObject = function(base_lnk, root_lnk, curObj_lnk) {
            if (!curObj_lnk.origX) {
                curObj_lnk.origX = curObj_lnk.x;
                curObj_lnk.origY = curObj_lnk.y;
            }
            origFieldObject.call(this, base_lnk, root_lnk, curObj_lnk);
            if (this.curObj.type === 'farm') {
                this.curObj.rndRotation = 0;
                this.curObj.rndX = 0;
                this.curObj.rndY = 0;
                if (this.mc) {
                    this.mc.rotation = 0;
                    this.mc.position.set(0, 0);
                }
            }
        };
        canvas.app.hunt.view.FieldObject.prototype = Object.create(origFieldObject.prototype);

        canvas.app.hunt.view.FieldObject.prototype.complete_object = function() {
            origCompleteObject.call(this);
            if (this.curObj.type === 'farm' && this.mc) {
                this.mc.rotation = 0;
                this.mc.position.set(0, 0);
                this.curObj.rndRotation = 0;
                this.curObj.rndX = 0;
                this.curObj.rndY = 0;
            }
        };

        const origCheckObjects = canvas.app.hunt.View.prototype.checkObjects;
        canvas.app.hunt.View.prototype.checkObjects = function(check_old, objectType) {
            origCheckObjects.call(this, check_old, objectType);
            if (!objectType || objectType === 'farm') {
                const conf = canvas.app.hunt.model;
                for (let i in conf.Objects) {
                    const obj = conf.Objects[i];
                    if (obj.type === 'farm' && obj.mc && (obj.mc.x !== obj.x || obj.mc.y !== obj.y)) {
                        obj.mc.position.set(obj.x, obj.y);
                    }
                }
            }
        };
    };

    // ----------------------------------------------------------
    // 5. Запуск
    // ----------------------------------------------------------
    let initAttempts = 0;
    const maxAttempts = 10;

    const initOrganizer = () => {
        if (typeof canvas !== 'undefined' && canvas.app && canvas.app.hunt) {
            try {
                overrideHuntBehavior();
                console.log('[Hunt Organizer] Successfully initialized');
            } catch (e) {
                console.error('[Hunt Organizer] Initialization error:', e);
            }
            return true;
        }
        if (++initAttempts >= maxAttempts) return false;
        return false;
    };

    if (!initOrganizer()) {
        const initInterval = setInterval(() => {
            if (initOrganizer()) clearInterval(initInterval);
        }, 1000);
    }
})();