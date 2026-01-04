// ==UserScript==
// @name         RWB ШК Обработчик
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Проверка ШК
// @author       By 13_Th
// @match        https://wms.wbwh.tech/shk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545047/RWB%20%D0%A8%D0%9A%20%D0%9E%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545047/RWB%20%D0%A8%D0%9A%20%D0%9E%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let skuList = [];
    let delay = parseInt(localStorage.getItem('sku_checker_delay')) || 800;
    let isChecking = false;
    let isPaused = false;
    let results = [];
    let errors = [];
    let currentIndex = parseInt(localStorage.getItem('sku_checker_index')) || 0;
    let isDark = true;
    let isLocked = false;

    const createElement = (tag, props = {}, styles = {}) => {
        const el = document.createElement(tag);
        Object.assign(el, props);
        Object.assign(el.style, styles);
        return el;
    };

    const delayMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(`❌ Элемент не найден: ${selector}`);
                }
            }, interval);
        });
    };

    const enterInput = (input, value) => {
        input.focus();
        input.value = value;
        input.dispatchEvent(new InputEvent('input', { bubbles: true }));
        ['keydown', 'keypress', 'keyup'].forEach(type => {
            input.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', bubbles: true }));
        });
    };

    const isInStock = () => {
        try {
            const el = [...document.querySelectorAll('.mdc-list-item__content')]
                .find(el => el.textContent.includes('В продаже'));
            const icon = el?.querySelector('mat-icon')?.textContent.trim() === 'check';
            return icon && el.textContent.includes('Да');
        } catch {
            return false;
        }
    };

    const getWarehouseValue = () => {
        try {
            const el = [...document.querySelectorAll('span.mdc-list-item__primary-text')]
                .find(e => e.querySelector('.title')?.textContent.includes('МХ'));
            return el?.querySelector('.value')?.textContent.trim() || 'Не найдено';
        } catch {
            return 'Не найдено';
        }
    };

    const saveToFile = (content, prefix = 'Результат') => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `${prefix}_${date}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const showNotification = (text, isError = false) => {
        const notif = createElement('div', { textContent: text }, {
            position: 'fixed', bottom: '20px', right: '20px', padding: '10px 20px',
            backgroundColor: isError ? '#e74c3c' : '#2ecc71', color: 'white',
            borderRadius: '8px', zIndex: 10001, boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            transition: 'opacity 0.5s'
        });
        document.body.appendChild(notif);
        setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 500); }, 3000);
    };

    const panel = createElement('div', {}, {
        position: 'fixed',
        top: localStorage.getItem('sku_checker_btn_top') || '20px',
        left: localStorage.getItem('sku_checker_btn_left') || '20px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: '15px',
        borderRadius: '12px',
        zIndex: 9999,
        width: '300px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        display: 'none'
    });

    const title = createElement('div', { textContent: '🧾 WB SKU Checker' }, {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center'
    });

    const delayInput = createElement('input', {
        type: 'number',
        value: delay,
        placeholder: 'Задержка (мс)',
        min: 100
    }, {
        width: '100%', marginBottom: '8px', padding: '6px',
        borderRadius: '6px', border: 'none'
    });
    delayInput.oninput = () => {
        const newVal = parseInt(delayInput.value);
        if (!isNaN(newVal) && newVal >= 100) {
            delay = newVal;
            localStorage.setItem('sku_checker_delay', delay);
        }
    };

    const fileInput = createElement('input', { type: 'file' }, {
        width: '100%', marginBottom: '8px'
    });
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            const content = evt.target.result;
            const sep = content.includes('\n') ? '\n' : ',';
            skuList = content.split(sep).map(s => s.trim()).filter(Boolean);
            if (!skuList.length) {
                showNotification('❗ Файл пуст или не содержит данных', true);
                return;
            }
            showNotification(`📄 Загружено: ${skuList.length} шт.`);
            fileInput.value = ''; // ⬅️ ВОТ ЭТА СТРОКА
        };
        reader.readAsText(file);
    };

    const wbsCheckbox = createElement('input', { type: 'checkbox' }, { marginRight: '6px' });
    const wbsInput = createElement('input', {
        type: 'text',
        placeholder: 'Последние цифры WBS',
        maxLength: 10
    }, {
        width: '100%',
        marginBottom: '8px',
        padding: '6px',
        borderRadius: '6px',
        border: 'none'
    });
    const wbsLabel = createElement('label', {}, { display: 'flex', alignItems: 'center', marginBottom: '8px' });
    wbsLabel.append(wbsCheckbox, createElement('span', { textContent: 'Искать по WBS' }));

    const btn = (text, color = '#3498db') => createElement('button', { textContent: text }, {
        width: '100%', marginBottom: '6px', padding: '8px',
        backgroundColor: color, color: 'white',
        border: 'none', borderRadius: '6px', cursor: 'pointer',
        fontWeight: 'bold'
    });

    const startBtn = btn('▶️ Начать', '#27ae60');
    const stopBtn = btn('⏹ Остановить', '#e74c3c');
    const pauseBtn = btn('⏸ Пауза / Продолжить', '#16a085');
    const resetBtn = btn('🔄 Сбросить прогресс', '#f39c12');
    const resultBtn = btn('📋 Показать результаты', '#2980b9');
    const saveBtn = btn('💾 Сохранить в файл', '#8e44ad');
    const themeBtn = btn('🌙 Тема', '#2c3e50');
    const lockBtn = btn('🔓 Панель', '#7f8c8d');

    const progress = createElement('progress', { max: 100, value: 0 }, { width: '100%' });
    const resultBox = createElement('textarea', { readOnly: true, rows: 5 }, {
        width: '100%', marginTop: '8px', padding: '6px', borderRadius: '6px'
    });
    const currentSkuLabel = createElement('div', { textContent: '' }, { marginTop: '8px', fontSize: '14px' });

    pauseBtn.onclick = () => {
        isPaused = !isPaused;
        showNotification(isPaused ? '⏸ Пауза' : '▶️ Продолжение');
    };

    lockBtn.onclick = () => {
        isLocked = !isLocked;
        panel.style.cursor = isLocked ? 'default' : 'move';
        lockBtn.textContent = isLocked ? '🔒 Панель' : '🔓 Панель';
    };

    themeBtn.onclick = () => {
        isDark = !isDark;
        const bg = isDark ? '#1e1e1e' : '#f0f0f0';
        const fg = isDark ? 'white' : '#000';
        panel.style.backgroundColor = bg;
        panel.style.color = fg;
        themeBtn.textContent = isDark ? '🌙 Тема' : '☀️ Тема';
    };

    panel.append(
        title, delayInput, fileInput,
        wbsLabel, wbsInput,
        startBtn, stopBtn, pauseBtn, resetBtn, lockBtn,
        resultBtn, saveBtn, themeBtn,
        progress, resultBox, currentSkuLabel
    );
    document.body.append(panel);

    let drag = false, offsetX, offsetY;
    panel.onmousedown = e => {
        if (isLocked || ['BUTTON', 'INPUT', 'TEXTAREA', 'LABEL'].includes(e.target.tagName)) return;
        drag = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.body.style.cursor = 'move';
    };
    document.onmouseup = () => {
        drag = false;
        localStorage.setItem('sku_checker_btn_left', panel.style.left);
        localStorage.setItem('sku_checker_btn_top', panel.style.top);
        document.body.style.cursor = 'default';
    };
    document.onmousemove = e => {
        if (drag) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    };

    startBtn.onclick = async () => {
        if (isChecking) return showNotification('⏳ Уже запущено', true);
        if (!skuList.length) return showNotification('❗ Список пуст', true);

        const input = await waitForElement('wb-input-frame input').catch(e => {
            showNotification(String(e), true);
        });
        if (!input) return;

        isChecking = true;
        results = [];
        errors = [];
        resultBox.value = '';

        while (currentIndex < skuList.length && isChecking) {
            if (isPaused) {
                await delayMs(500);
                continue;
            }

            const sku = skuList[currentIndex];
            try {
                enterInput(input, sku);
                const etaSec = Math.ceil(((skuList.length - currentIndex) * delay) / 1000);
                const etaMin = Math.floor(etaSec / 60);
                const etaRemainSec = etaSec % 60;
                const etaText = etaMin > 0 ? `${etaMin}м ${etaRemainSec}с` : `${etaRemainSec}с`;
                currentSkuLabel.textContent = `🔍 SKU (${currentIndex + 1}/${skuList.length}): ${sku} ⏳ ETA: ${etaText}`;
                await delayMs(delay);

                if (wbsCheckbox.checked) {
                    const targetSuffix = wbsInput.value.trim() || sku.slice(-4);
                    const wbsSpans = document.querySelectorAll('app-shk-title span');
                    const span = [...wbsSpans].find(el => el.textContent.includes('ВБ стикер'));
                    if (span) {
                        const match = span.textContent.match(/\d{5,}/);
                        if (match) {
                            const foundWbs = match[0];
                            const suffix = foundWbs.slice(-targetSuffix.length);
                            if (suffix === targetSuffix) {
                                results.push(`✅${sku} - найден WBS: ${foundWbs}`);
                                resultBox.value = [...results, ...errors].join('\n');
                                resultBox.scrollTop = resultBox.scrollHeight;
                                location.href = `https://wms.wbwh.tech/shk/status?shk=${foundWbs}`;
                                isChecking = false;
                                break;
                            } else {
                                errors.push(`❌ ${sku} - WBS ${foundWbs} ≠ ${targetSuffix}`);
                            }
                        } else {
                            errors.push(`❌ ${sku} - не удалось извлечь WBS-код`);
                        }
                    } else {
                        errors.push(`❌ ${sku} - элемент с ВБ стикером не найден`);
                    }
                } else {
                    if (isInStock()) {
                        const mx = getWarehouseValue();
                        if (mx !== 'Не найдено') results.push(`${sku} - ${mx}`);
                    } else {
                        errors.push(`❌ ${sku} - не в продаже`);
                    }
                }
            } catch (e) {
                errors.push(`⚠️ ${sku} - ошибка`);
            }

            currentIndex++;
            localStorage.setItem('sku_checker_index', currentIndex);
            progress.value = (currentIndex / skuList.length) * 100;

            resultBox.value = [...results, ...errors].join('\n');
            resultBox.scrollTop = resultBox.scrollHeight;
        }

        currentIndex = 0;
        localStorage.setItem('sku_checker_index', 0);
        currentSkuLabel.textContent = '';
        showNotification(`✅ Готово. Успешно: ${results.length}, Ошибки: ${errors.length}`);
        resultBtn.onclick();
        isChecking = false;
    };

    stopBtn.onclick = () => {
        isChecking = false;
        currentSkuLabel.textContent = '';
        showNotification('⏹ Остановлено');
    };

    resetBtn.onclick = () => {
        currentIndex = 0;
        localStorage.setItem('sku_checker_index', 0);
        progress.value = 0;
        showNotification('🔄 Прогресс сброшен');
    };

    resultBtn.onclick = () => {
        resultBox.value = [...results, ...errors].join('\n');
        resultBox.scrollTop = resultBox.scrollHeight;
    };

    saveBtn.onclick = () => {
        const full = [...results, ...errors].join('\n');
        saveToFile(full);
    };

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });
})();

