// ==UserScript==
// @name         Steam Licenses Remover Ultra Enhanced
// @namespace    https://store.steampowered.com/account/licenses/
// @version      3.0
// @description  Улучшенное массовое удаление бесплатных игр из Steam с расширенным UI, автоматическим восстановлением, детальным прогрессом, экспортом логов и защитой от ошибок.
// @author       hycosi
// @match        https://store.steampowered.com/account/licenses/*
// @icon         https://i.imgur.com/OhMAUre.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540603/Steam%20Licenses%20Remover%20Ultra%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/540603/Steam%20Licenses%20Remover%20Ultra%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === КОНФИГ ===
    const CONFIG = {
        BATCH_SIZE: 10,
        REQUEST_DELAY: 1200,
        COOLDOWN_TIME: 30 * 60,
        MAX_RETRIES: 2,
        RETRY_DELAY: 5000,
        FADE_OUT_DELAY: 8000,
        EXPONENTIAL_BACKOFF: true,
        MIN_DELAY: 1200,
        MAX_DELAY: 10000,
        DRY_RUN: false,
    };

    let state = {
        isRunning: false,
        removed: 0,
        errors: [],
        total: 0,
        batch: 0,
        startTime: 0,
        currentDelay: CONFIG.REQUEST_DELAY,
    };

    // ===== STORAGE UTILS =====
    const Storage = {
        save() {
            try {
                localStorage.setItem('steamRemovalState', JSON.stringify({
                    removed: state.removed,
                    errors: state.errors,
                    total: state.total,
                    timestamp: Date.now()
                }));
            } catch(e) {
                console.warn('Не удалось сохранить прогресс:', e);
            }
        },
        
        restore() {
            try {
                const saved = localStorage.getItem('steamRemovalState');
                if (!saved) return false;
                
                const data = JSON.parse(saved);
                const hourAgo = Date.now() - 3600000;
                
                if (data.timestamp > hourAgo) {
                    if (confirm(`Найден несохранённый прогресс (${data.removed}/${data.total} удалено). Продолжить?`)) {
                        state.removed = data.removed;
                        state.errors = data.errors || [];
                        state.total = data.total;
                        return true;
                    }
                }
                localStorage.removeItem('steamRemovalState');
            } catch(e) {
                console.warn('Ошибка восстановления прогресса:', e);
            }
            return false;
        },
        
        clear() {
            localStorage.removeItem('steamRemovalState');
        },
        
        exportLogs() {
            const data = {
                removed: state.removed,
                total: state.total,
                errors: state.errors,
                duration: state.startTime ? (Date.now() - state.startTime) / 1000 : 0,
                timestamp: new Date().toISOString(),
                version: '3.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `steam-removal-log-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // ===== DOM & UI =====
    const DOM = {
        getButton: () => document.getElementById('remove-free-games-btn'),
        getProgress: () => document.getElementById('removal-progress'),
        getExportBtn: () => document.getElementById('export-logs-btn'),

        createButton() {
            if (DOM.getButton()) return;

            const btn = document.createElement('button');
            btn.id = 'remove-free-games-btn';
            btn.textContent = 'Удалить все бесплатные игры';
            btn.style.cssText =
                `margin:5px 10px 5px auto; float:right; position:relative; left:-680px; top:-3px; background:linear-gradient(135deg,#1b2838 0%,#2a475e 100%); color:#fff;
                 border:1px solid #66c0f4;padding:12px 20px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:13px;transition:all 0.3s;box-shadow:0 2px 5px rgba(0,0,0,0.3);`;

            btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) {
                    btn.style.background = 'linear-gradient(135deg,#66c0f4 0%,#417a9b 100%)';
                    btn.style.transform = 'translateY(-1px)';
                    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (!btn.disabled) {
                    btn.style.background = 'linear-gradient(135deg,#1b2838 0%,#2a475e 100%)';
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                }
            });

            btn.onclick = () => {
                if (!state.isRunning) startProcess();
            };

            (document.querySelector('.page_content_ctn') || document.body).insertBefore(btn, document.querySelector('.page_content_ctn').firstChild);
        },
        
        createExportButton() {
            if (DOM.getExportBtn()) return;
            
            const btn = document.createElement('button');
            btn.id = 'export-logs-btn';
            btn.textContent = '📥 Экспорт логов';
            btn.style.cssText =
                `margin:5px 5px 5px auto; float:right; position:relative; left:-850px; top:-3px; background:linear-gradient(135deg,#1b2838 0%,#2a475e 100%); color:#fff;
                 border:1px solid #66c0f4;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;transition:all 0.3s;box-shadow:0 2px 5px rgba(0,0,0,0.3);display:none;`;
            
            btn.onclick = () => Storage.exportLogs();
            
            (document.querySelector('.page_content_ctn') || document.body).insertBefore(btn, document.querySelector('.page_content_ctn').firstChild);
        },

        createProgress() {
            let node = DOM.getProgress();
            if (node) node.remove();

            const div = document.createElement('div');
            div.id = 'removal-progress';
            div.style.cssText =
                'margin:12px 0 4px 0; padding:12px; border:1px solid #66c0f4; border-radius:6px; background:linear-gradient(135deg,#1b2838 0%,#2a475e 100%); color:#fff; font-family:monospace; box-shadow:0 2px 8px rgba(0,0,0,0.4);';
            div.innerHTML = '<div style="text-align:center;">Подготовка к запуску...</div>';
            div.style.display = 'none';
            document.querySelector('.page_content_ctn').insertBefore(div, document.querySelector('.page_content_ctn').firstChild.nextSibling);
            return div;
        },

        updateProgress(msg, err = false) {
            const div = DOM.getProgress();
            if (!div) return;
            div.style.display = 'block';
            
            const elapsed = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
            const speed = elapsed > 0 ? (state.removed / elapsed).toFixed(2) : '0.00';
            const remaining = state.total > state.removed && parseFloat(speed) > 0 
                ? Math.ceil((state.total - state.removed) / parseFloat(speed) / 60) 
                : '?';
            const progress = state.total > 0 ? ((state.removed / state.total) * 100).toFixed(1) : 0;
            
            div.innerHTML =
                `<div style="margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                        <span>Прогресс: ${state.removed}/${state.total} (${progress}%)</span>
                        <span>Батч: ${state.batch}</span>
                    </div>
                    <div style="width:100%;height:6px;background:#2a475e;border-radius:3px;overflow:hidden;">
                        <div style="width:${progress}%;height:100%;background:linear-gradient(90deg,#66c0f4,#417a9b);transition:width .3s;"></div>
                    </div>
                </div>
                <div style="font-size:11px;color:${err ? '#ff6b6b' : '#a8d4ff'};">
                    <div>⏱️ Скорость: ${speed} игр/сек | ⏳ Осталось: ~${remaining} мин</div>
                    <div style="margin-top:4px;">📊 Статус: ${msg}</div>
                    ${state.errors.length ? `<div style="color:#ff5050;margin-top:4px;">⚠️ Ошибок: ${state.errors.length}</div>` : ''}
                </div>`;
        },

        updateButton(text, disable = false) {
            const btn = DOM.getButton();
            if (btn) {
                btn.textContent = text;
                btn.disabled = disable;
                btn.style.opacity = disable ? '.6' : '1';
                btn.style.cursor = disable ? 'not-allowed' : 'pointer';
            }
        },
        
        showExportButton() {
            const btn = DOM.getExportBtn();
            if (btn && state.errors.length > 0) {
                btn.style.display = 'block';
            }
        }
    };

    // ========= УТИЛИТЫ =========
    function extractIdFromLink(link) {
        const match = link.match(/RemoveFreeLicense\(\s*([0-9]+)/);
        return match ? +match[1] : null;
    }

    function getSessionId() {
        if (typeof g_sessionID !== 'undefined' && g_sessionID) return g_sessionID;
        if (window.g_sessionID) return window.g_sessionID;
        let m = document.cookie.match(/sessionid=([0-9a-f]+)/);
        if (m) return m[1];
        for (const s of document.scripts) {
            let ms = s.textContent?.match(/g_sessionID\s*=\s*['"]([^'"]+)['"]/);
            if (ms) return ms[1];
        }
        return null;
    }

    async function sleep(ms) { return new Promise(r=>setTimeout(r, ms)); }
    
    function calculateBackoff(retry) {
        if (!CONFIG.EXPONENTIAL_BACKOFF) return CONFIG.REQUEST_DELAY;
        const delay = CONFIG.MIN_DELAY * Math.pow(2, retry);
        const jitter = Math.random() * 500;
        return Math.min(delay + jitter, CONFIG.MAX_DELAY);
    }
    
    function playSound(success = true) {
        try {
            const audio = new AudioContext();
            const oscillator = audio.createOscillator();
            const gainNode = audio.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audio.destination);
            
            oscillator.frequency.value = success ? 800 : 400;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audio.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.2);
            
            oscillator.start(audio.currentTime);
            oscillator.stop(audio.currentTime + 0.2);
        } catch(e) {
            // Audio API недоступен
        }
    }

    async function removeGame(id, retry=0) {
        const sessionId = getSessionId();
        if (!sessionId) throw new Error('Не удалось получить sessionID');

        if (CONFIG.DRY_RUN) {
            console.log(`[DRY RUN] Would remove: ${id}`);
            await sleep(100);
            return {ok: true};
        }

        try {
            const ctrl = new AbortController();
            const timeoutId = setTimeout(()=>ctrl.abort(), 10000);
            const resp = await fetch('https://store.steampowered.com/account/removelicense', {
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},
                body:`sessionid=${encodeURIComponent(sessionId)}&packageid=${encodeURIComponent(id)}`,
                signal: ctrl.signal
            });
            clearTimeout(timeoutId);

            if (resp.status === 429) {
                const retryAfter = resp.headers.get('Retry-After') || 60;
                return {ok:false, limit:true, retryAfter: parseInt(retryAfter) * 1000};
            }

            if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
            const data = await resp.json();

            if (data.success === 1) return {ok:true};
            if (data.success === 84) return {ok:false, limit:true};
            if (data.success === 15) throw new Error('Доступ запрещён');
            throw new Error('Steam API: ' + (data.error || data.success));
        } catch(err) {
            if (err.name === 'AbortError') throw new Error('Таймаут запроса');
            if (/network/i.test(err.message) && retry < CONFIG.MAX_RETRIES) {
                const backoffDelay = calculateBackoff(retry);
                await sleep(backoffDelay);
                return removeGame(id, retry+1);
            }
            throw err;
        }
    }

    // ==== ГЛАВНЫЙ ПРОЦЕСС ====
    async function processBatch() {
        const freeLinks = Array.from(document.querySelectorAll('a[href^="javascript:RemoveFreeLicense("]'));
        if (!freeLinks.length) return {done:true, limit:false};
        const batch = freeLinks.slice(0, CONFIG.BATCH_SIZE);
        let processed = 0, apiLimit = false;

        state.batch++;
        for(let i=0; i<batch.length && !apiLimit; ++i) {
            const id = extractIdFromLink(batch[i].href);
            if (!id) continue;
            try {
                if (i % 3 === 0) DOM.updateProgress(`Удаление ${id}...`);
                
                let result = await removeGame(id);
                
                if (result.limit) { 
                    apiLimit = true;
                    if (result.retryAfter) {
                        state.currentDelay = Math.max(state.currentDelay, result.retryAfter);
                    }
                    break; 
                }
                
                state.removed++; processed++;
                let row = batch[i].closest('tr'); 
                if(row) {
                    row.style.cssText = 'opacity:.3; text-decoration:line-through; transition:opacity .3s';
                }
                
                Storage.save();
            } catch(e) {
                state.errors.push({id, msg: e?.message, time: new Date().toISOString()});
                DOM.updateProgress(`Ошибка при ${id}: ${e?.message}`, true);
                playSound(false);
                await sleep(800);
            }
            DOM.updateButton(`Удалено: ${state.removed} (Ошибок: ${state.errors.length})`, true);
            if(i < batch.length -1) await sleep(state.currentDelay);
        }
        return {done: freeLinks.length <= processed, limit: apiLimit};
    }

    async function showCooldown(secs, why = 'API лимит') {
        for(let i = secs; i > 0 && state.isRunning; --i) {
            let m = Math.floor(i/60), s = i % 60;
            let t = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            DOM.updateButton(`${why} - ожидание ${t}`, true);
            DOM.updateProgress(`${why}: ожидание ${t}`);
            await sleep(1000);
        }
    }

    async function startProcess() {
        if (state.isRunning) return;
        
        // Проверка восстановления
        const restored = Storage.restore();
        
        if (!restored) {
            state.removed = 0;
            state.errors = [];
            state.batch = 0;
            state.total = document.querySelectorAll('a[href^="javascript:RemoveFreeLicense("]').length;
            
            // Простое подтверждение
            if (!confirm(`Начать удаление ${state.total} бесплатных игр?`)) {
                return;
            }
        }
        
        state.isRunning = true;
        state.startTime = Date.now();
        state.currentDelay = CONFIG.REQUEST_DELAY;
        
        DOM.updateButton('Старт...', true);
        DOM.createProgress();
        DOM.createExportButton();
        DOM.updateProgress('Анализируем страницу...');
        
        if (!state.total) { 
            DOM.updateProgress('Бесплатные игры не найдены', true); 
            reset(); 
            return; 
        }

        try {
            let done = false;
            while (!done && state.isRunning) {
                let {done:complete, limit} = await processBatch();
                if(limit) { 
                    await showCooldown(CONFIG.COOLDOWN_TIME, 'Достигнут лимит API Steam'); 
                    continue; 
                }
                done = complete;
                if (!done && state.isRunning) { 
                    DOM.updateProgress('Пауза между батчами...'); 
                    await sleep(2000); 
                }
            }
            
            // Финальный отчёт
            let msg = `✅ Готово! Удалено: ${state.removed}`;
            if(state.errors.length) msg += ` | ⚠️ Ошибок: ${state.errors.length}`;
            
            DOM.updateButton(msg, false);
            DOM.updateProgress(msg);
            DOM.showExportButton();
            
            playSound(true);
            Storage.clear();
            
        } catch(e) {
            DOM.updateProgress('❌ Критическая ошибка: '+e.message, true);
            console.error(e);
            playSound(false);
        } finally { 
            reset(); 
        }
    }

    function reset() {
        state.isRunning = false;
        DOM.updateButton('Удалить все бесплатные игры', false);
        setTimeout(()=>{
            let prog = DOM.getProgress();
            if(prog && state.removed === state.total) prog.style.display='none';
        }, CONFIG.FADE_OUT_DELAY);
    }

    // ==== ИНИЦИАЛИЗАЦИЯ UI/Events ====
    new MutationObserver((mut)=>{
        if([...mut].some(m=>[...m.addedNodes].some(n=>
            n.nodeType===1 && (n.classList?.contains('page_content_ctn') || n.querySelector?.('.page_content_ctn'))))) {
            setTimeout(() => {
                DOM.createButton();
                DOM.createExportButton();
            }, 100);
        }
    }).observe(document.body, {childList:true,subtree:true});

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            DOM.createButton();
            DOM.createExportButton();
        });
    } else {
        DOM.createButton();
        DOM.createExportButton();
    }

    // Хоткеи
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.altKey && e.key === 'r' && !state.isRunning) { 
            e.preventDefault(); 
            startProcess(); 
        } else if (e.key === 'Escape' && state.isRunning) { 
            state.isRunning = false; 
            reset(); 
            DOM.updateProgress('⏸️ Остановлено пользователем', true); 
            Storage.save();
        } else if (e.ctrlKey && e.altKey && e.key === 'e' && state.errors.length > 0) {
            e.preventDefault();
            Storage.exportLogs();
        }
    });

    console.log('🚀 Steam Licenses Remover Ultra Enhanced v3.0 инициализирован');
    console.log('⌨️ Ctrl+Alt+R — Запуск | Esc — Прервать | Ctrl+Alt+E — Экспорт логов');
})();
