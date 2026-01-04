// ==UserScript==
// @name         Naurok AI Answer Checker v4.0 (Gemini Custom + Visual Fix)
// @namespace    https://greasyfork.org/ru/users/1438166-endervano
// @version      4.0.0
// @description  Добавлена возможность ручного ввода модели для Google Gemini. Исправлены визуальные баги.
// @author       ENDERVANO
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naurok.ua
// @match        *://naurok.com.ua/test/testing/*
// @match        *://naurok.com.ua/test/realtime-client/*
// @match        *://naurok.ua/test/testing/*
// @match        *://naurok.ua/test/realtime-client/*
// @include      *://naurok.com.ua/*
// @include      *://naurok.ua/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @connect      api.groq.com
// @connect      openrouter.ai
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/528350/Naurok%20AI%20Answer%20Checker%20v40%20%28Gemini%20Custom%20%2B%20Visual%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528350/Naurok%20AI%20Answer%20Checker%20v40%20%28Gemini%20Custom%20%2B%20Visual%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const models = [
        { id: 'groq', name: '🚀 Groq (Llama 3.3)' },
        { id: 'gemini-custom', name: '⚡ Gemini (Custom ID)' }, // Теперь это Custom
        { id: 'custom', name: '🔌 OpenRouter (Custom)' }
    ];

    // --- СТИЛИ ---
    GM_addStyle(`
        .nai-toast-container { position: fixed; top: 80px; right: 20px; z-index: 100000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .nai-toast { background: #fff; color: #444; padding: 12px 20px; border-radius: 8px; font-family: 'Open Sans', Arial, sans-serif; font-size: 14px; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 12px; border-left: 4px solid #F57C00; animation: naiSlideIn 0.3s ease; pointer-events: auto; max-width: 320px; transition: all 0.3s; }
        .nai-toast.success { border-left-color: #4CAF50; }
        .nai-toast.error { border-left-color: #F44336; }
        .nai-toast.loading { border-left-color: #F57C00; }
        @keyframes naiSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .nai-spin { display: inline-block; animation: naiHourglassFlip 2s infinite ease-in-out; }
        @keyframes naiHourglassFlip { 0% { transform: rotate(0); } 45% { transform: rotate(180deg); } 100% { transform: rotate(360deg); } }

        /* Modal Styles */
        .nai-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; }
        .nai-modal { background: #fff; width: 400px; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); font-family: sans-serif; }
        .nai-h1 { font-size: 22px; font-weight: 700; color: #333; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; }
        .nai-field { margin-bottom: 20px; }
        .nai-label { display: block; font-size: 13px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase; }
        .nai-input, .nai-select { width: 100%; padding: 12px; border: 2px solid #eee; border-radius: 8px; font-size: 14px; box-sizing: border-box; color: #333; }
        .nai-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
        .nai-btn { padding: 12px 24px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 14px; }
        .nai-btn-primary { background: #F57C00; color: white; }
        .nai-btn-ghost { background: #f5f5f5; color: #666; }

        /* Controls */
        .ai-controls { margin: 15px 0; display: flex; gap: 10px; animation: naiFadeIn 0.5s; align-items: stretch; position: relative; z-index: 100; }
        @keyframes naiFadeIn { to { opacity: 1; } }
        .ai-btn-check { flex: 1; background: #ffffff; color: #F57C00; border: 2px solid #F57C00; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; }
        .ai-btn-settings { width: 48px; background: #f9f9f9; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 20px; color: #777; }

        /* --- VISUAL FIX --- */
        .ai-highlight {
            box-shadow: inset 0 0 0 4px #4CAF50 !important;
            background-color: rgba(76, 175, 80, 0.15) !important;
            position: relative;
            z-index: 50;
            border-radius: 4px !important;
            box-sizing: border-box !important;
        }
        .ai-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #4CAF50;
            color: white;
            font-size: 11px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 60;
        }
    `);

    const DB = { get: (k, d) => GM_getValue(k, d), set: (k, v) => GM_setValue(k, v) };

    // --- UI ---
    function showToast(msg, type = 'default') {
        let container = document.querySelector('.nai-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'nai-toast-container';
            document.body.appendChild(container);
        }
        while (container.children.length > 2) container.removeChild(container.firstChild);
        const toast = document.createElement('div');
        toast.className = `nai-toast ${type}`;
        let icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : '🤖');
        if (type === 'loading') icon = '<span class="nai-spin">⏳</span>';
        toast.innerHTML = `<span style="font-size:18px">${icon}</span> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
        return toast;
    }

    function openSettings() {
        if (document.querySelector('.nai-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'nai-overlay';
        overlay.innerHTML = `
            <div class="nai-modal">
                <div class="nai-h1">⚙️ Naurok AI <span style="font-size:12px; background:#F57C00; color:white; padding:2px 6px; border-radius:4px; margin-left:auto;">v4.0</span></div>
                <div class="nai-field">
                    <label class="nai-label">Сервис / Модель</label>
                    <select id="nai-model" class="nai-select">
                        ${models.map(m => `<option value="${m.id}" ${DB.get('model', 'groq') === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                </div>
                <div id="nai-key-group" class="nai-field">
                    <label class="nai-label" id="nai-key-label">API Key</label>
                    <input type="password" id="nai-key" class="nai-input" placeholder="Вставьте ключ...">
                </div>

                <div id="nai-custom-model-group" class="nai-field" style="display:none">
                    <label class="nai-label" id="nai-model-label">ID Модели</label>
                    <input type="text" id="nai-custom-model-id" class="nai-input" value="">
                </div>

                <div class="nai-actions">
                    <button id="nai-cancel" class="nai-btn nai-btn-ghost">Закрыть</button>
                    <button id="nai-save" class="nai-btn nai-btn-primary">Сохранить</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const sel = document.getElementById('nai-model');
        const keyIn = document.getElementById('nai-key');
        const custGrp = document.getElementById('nai-custom-model-group');
        const custIn = document.getElementById('nai-custom-model-id');
        const keyLbl = document.getElementById('nai-key-label');
        const modelLbl = document.getElementById('nai-model-label');

        const upd = () => {
            const v = sel.value;
            if (v === 'gemini-custom') {
                keyLbl.textContent = 'Google AI Key';
                keyIn.value = DB.get('gemini_key', '');

                custGrp.style.display = 'block';
                modelLbl.textContent = 'ID Модели Google (напр. gemini-2.0-flash)';
                custIn.value = DB.get('gemini_model_id', 'gemini-2.0-flash');

            } else if (v === 'groq') {
                keyLbl.textContent = 'Groq API Key (gsk_...)';
                keyIn.value = DB.get('groq_key', '');
                custGrp.style.display = 'none';
            } else {
                keyLbl.textContent = 'OpenRouter Key';
                keyIn.value = DB.get('or_key', '');

                custGrp.style.display = 'block';
                modelLbl.textContent = 'ID Модели OpenRouter';
                custIn.value = DB.get('or_model_id', 'google/gemini-2.0-flash-exp:free');
            }
        };
        sel.onchange = upd;
        upd();

        document.getElementById('nai-cancel').onclick = () => overlay.remove();
        document.getElementById('nai-save').onclick = () => {
            const v = sel.value;
            DB.set('model', v);
            if (v === 'gemini-custom') {
                DB.set('gemini_key', keyIn.value);
                DB.set('gemini_model_id', custIn.value);
            }
            else if (v === 'groq') {
                DB.set('groq_key', keyIn.value);
            }
            else {
                DB.set('or_key', keyIn.value);
                DB.set('or_model_id', custIn.value);
            }
            showToast('Сохранено!', 'success');
            overlay.remove();
        };
    }

    function cleanUp() {
        document.querySelectorAll('.ai-highlight').forEach(el => {
            el.classList.remove('ai-highlight');
            el.style.boxShadow = ''; el.style.backgroundColor = '';
            el.querySelector('.ai-badge')?.remove();
        });
    }

    async function processCheck() {
        const loadingToast = showToast('Думаю...', 'loading', 0);
        const checkBtn = document.querySelector('.ai-btn-check');
        if(checkBtn) { checkBtn.disabled = true; checkBtn.innerHTML = '<span class="nai-spin">⏳</span> ...'; }

        try {
            cleanUp();
            const qEl = document.querySelector('.test-content-text-inner, .test-question-content-inner');
            if (!qEl) throw new Error("Нет вопроса");
            const qText = qEl.innerText.trim();
            const options = Array.from(document.querySelectorAll('.test-option, .question-option')).filter(el => el.offsetParent !== null);
            if (!options.length) throw new Error("Нет вариантов");
            const optionsText = options.map((el, i) => `${i + 1}. ${el.innerText.trim()}`).join('\n');

            // Проверка на мультивыбор
            const hasCheckboxes = document.querySelectorAll('.question-option-inner-multiple, .fa-square-o, .fa-check-square-o').length > 0;
            const textImpliesMulti = qText.toLowerCase().includes('варіанти') || qText.toLowerCase().includes('декілька') || qText.toLowerCase().includes('усі правильні');
            const isSingleChoice = !hasCheckboxes && !textImpliesMulti;

            const images = [];
            document.querySelectorAll('.test-content-text-inner img, .question-option img').forEach(img => {
                if (img.src && !img.src.startsWith('data:')) images.push(img.src);
            });

            let resultIndices = await callAI(qText, optionsText, images, isSingleChoice);
            loadingToast.remove();

            if (!resultIndices.length) { showToast('AI не дал ответа', 'error'); return; }

            // Фильтр для одиночных вопросов
            if (isSingleChoice && resultIndices.length > 1) {
                resultIndices = [resultIndices[0]];
            }

            let count = 0;
            resultIndices.forEach(idx => {
                const el = options[idx - 1];
                if (el) {
                    const target = el.querySelector('.question-option-inner, .question-option-inner-content, .test-option-inner');
                    if (target) {
                        target.classList.add('ai-highlight');
                        if(!target.querySelector('.ai-badge')) {
                            const badge = document.createElement('div');
                            badge.className = 'ai-badge'; badge.innerText = 'AI';
                            target.appendChild(badge);
                        }
                        count++;
                    }
                }
            });
            if(count > 0) showToast(`Выбрано: ${count}`, 'success');

        } catch (e) {
            loadingToast.remove();
            showToast(e.message || 'Ошибка', 'error');
        } finally {
            if(checkBtn) { checkBtn.disabled = false; checkBtn.innerHTML = '<span>🧠</span> AI Помощь'; }
        }
    }

    async function callAI(q, opts, imgUrls, isSingle) {
        const model = DB.get('model', 'groq');
        const task = isSingle ? "ВЫБЕРИ ТОЛЬКО ОДИН ВЕРНЫЙ ВАРИАНТ." : "ВЫБЕРИ ВСЕ ВЕРНЫЕ ВАРИАНТЫ (ИХ МОЖЕТ БЫТЬ НЕСКОЛЬКО).";
        const prompt = `ВОПРОС: ${q}\nВАРИАНТЫ:\n${opts}\nЗАДАЧА: ${task} ОТВЕТ - ТОЛЬКО ЦИФРЫ (например: 1 или [1, 2]). НИКАКИХ СЛОВ.`;

        let txt = "";

        // --- GROQ ---
        if (model === 'groq') {
            const key = DB.get('groq_key');
            if (!key) throw new Error("Нужен Groq Key");
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.1
                })
            });
            if(res.status === 429) throw new Error('Лимит Groq, жди 5 сек');
            const data = await res.json();
            if(data.error) throw new Error(data.error.message);
            txt = data.choices?.[0]?.message?.content || "";
        }
        // --- GEMINI (CUSTOM) ---
        else if (model === 'gemini-custom') {
            const key = DB.get('gemini_key');
            // Получаем кастомный ID модели (по умолчанию gemini-2.0-flash)
            const modelID = DB.get('gemini_model_id', 'gemini-2.0-flash');

            if (!key) throw new Error("Нужен Google Key");
            let imageParts = [];
            if (imgUrls.length) imageParts = await Promise.all(imgUrls.map(url => urlToBase64(url)));
            const body = {
                contents: [{ parts: [{ text: prompt }, ...imageParts.map(b => ({ inline_data: { mime_type: "image/jpeg", data: b } }))] }],
                generationConfig: { temperature: 0.1 }
            };
            // Вставляем ID модели в URL
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelID}:generateContent?key=${key}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
            const data = await res.json();
            if(data.error) throw new Error(data.error.message);
            txt = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        // --- OPENROUTER ---
        else {
            const key = DB.get('or_key');
            const modelID = DB.get('or_model_id', 'google/gemini-2.0-flash-exp:free');
            if (!key) throw new Error("Нужен OpenRouter Key");
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://naurok.com.ua' },
                body: JSON.stringify({ model: modelID, messages: [{ role: "user", content: prompt }] })
            });
            const data = await res.json();
            txt = data.choices?.[0]?.message?.content || "";
        }

        console.log("AI Response:", txt);
        return parseNumbers(txt);
    }

    function parseNumbers(t) {
        t = t.replace(/```json|```/g, '').trim();
        try {
            const arr = JSON.parse(t);
            if(Array.isArray(arr)) return arr.map(Number);
            if(typeof arr === 'number') return [arr];
        } catch(e){}
        const m = t.match(/\b\d+\b/g);
        if (m) {
            const validNums = [...new Set(m.map(Number).filter(n => n > 0 && n <= 20))];
            if (validNums.length > 0) return validNums;
        }
        return [];
    }

    function urlToBase64(url) {
        return new Promise(r => { GM_xmlhttpRequest({ method:'GET', url, responseType:'blob', onload:e => { const fr = new FileReader(); fr.onloadend = () => r(fr.result.split(',')[1]); fr.readAsDataURL(e.response); }, onerror:()=>r(null) }); });
    }

    let lastHash = '';
    function checkDOM() {
        const container = document.querySelector('.test-options-grid, .test-question-options');
        if (container && !document.querySelector('.ai-controls')) {
            const wrap = document.createElement('div');
            wrap.className = 'ai-controls';
            const btnRun = document.createElement('button');
            btnRun.className = 'ai-btn-check';
            btnRun.innerHTML = '<span>🧠</span> AI Помощь';
            btnRun.onclick = (e) => { e.preventDefault(); processCheck(); };
            const btnSet = document.createElement('button');
            btnSet.className = 'ai-btn-settings';
            btnSet.innerHTML = '⚙️';
            btnSet.onclick = (e) => { e.preventDefault(); openSettings(); };
            wrap.appendChild(btnRun);
            wrap.appendChild(btnSet);
            container.parentElement.insertBefore(wrap, container);
        }
        const qTextEl = document.querySelector('.test-content-text-inner, .test-question-content-inner');
        if (qTextEl) {
            const h = qTextEl.innerText.substring(0, 50);
            if (h !== lastHash) { lastHash = h; cleanUp(); }
        }
    }

    const obs = new MutationObserver(checkDOM);
    if (document.body) {
        obs.observe(document.body, { childList: true, subtree: true });
        setInterval(checkDOM, 1000);
    }
})();