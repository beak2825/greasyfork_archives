// ==UserScript==
// @name         Mint
// @namespace    https://forum.blackrussia.online
// @version      1
// @description  Находит ошибки
// @author       Dont_Sorry
// @match        https://forum.blackrussia.online/*
// @grant        GM_xmlhttpRequest
// @connect      qigtnvbixteulqsbekhh.supabase.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547286/Mint.user.js
// @updateURL https://update.greasyfork.org/scripts/547286/Mint.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SUPABASE_FUNCTION_URL = 'https://qigtnvbixteulqsbekhh.supabase.co/functions/v1/gemini-proxy';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ3RudmJpeHRldWxxc2Jla2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDM4ODUsImV4cCI6MjA2ODAxOTg4NX0.E5jcHv-PHpqDijRQ594BegHC7Qt1HVRNj4_VtFlMhfw';
    const EDITOR_SELECTOR = "div.fr-element.fr-view";

    let currentEditor = null;

    function createStyles() {
        const styles = `
            #spell-check-btn {
                background: linear-gradient(145deg, #27ae60, #219a52);
                color: white; border: none; border-radius: 25px; padding: 12px 24px;
                cursor: pointer; font-size: 14px; font-weight: 600; margin-left: 10px;
                transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
            }
            #spell-check-btn:hover {
                background: linear-gradient(145deg, #219a52, #1d8349);
                transform: translateY(-2px); box-shadow: 0 6px 14px rgba(39, 174, 96, 0.4);
            }
            #spell-check-btn:disabled {
                background: #bdc3c7; transform: none; box-shadow: none; cursor: not-allowed;
            }

            #spell-status {
                margin: 12px 0; padding: 15px; border-radius: 12px; font-size: 15px;
                text-align: center; font-weight: 500; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            .status-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .status-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .status-info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }

            #gemini-result-container {
                margin-top: 15px; border: 1px solid #e0e0e0; border-radius: 16px;
                background-color: #f9f9f9; box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                overflow: hidden; max-height: 0; opacity: 0;
                transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out, margin-top 0.5s ease;
            }
            #gemini-result-container.visible { max-height: 1000px; opacity: 1; }
            .gemini-result-header {
                padding: 10px 20px; background-color: #f0f0f0; display: flex;
                justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0;
            }
            .gemini-result-header h3 { margin: 0; font-size: 16px; color: #333; }
            .gemini-result-close-btn {
                background: none; border: none; font-size: 24px;
                cursor: pointer; color: #888; transition: color 0.2s;
            }
            .gemini-result-close-btn:hover { color: #333; }
            .gemini-result-body { padding: 20px; }
            .gemini-explanation {
                line-height: 1.6; color: #34495e; font-size: 15px; white-space: pre-wrap;
            }
            .gemini-explanation h4 { margin: 0 0 10px 0; }
            .gemini-corrected-text-wrapper {
                margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;
            }
            .gemini-corrected-text-wrapper h4 { margin: 0 0 10px 0; color: #27ae60; }
            .gemini-corrected-text {
                background-color: #eef7ee; border: 1px solid #d4e6d4; border-radius: 8px;
                padding: 15px; font-family: 'Courier New', Courier, monospace;
                white-space: pre-wrap; word-wrap: break-word; color: #222;
            }
            .copy-btn {
                display: block; margin: 15px 0 0 auto; padding: 8px 16px;
                background-color: #27ae60; color: white; border: none;
                border-radius: 8px; cursor: pointer; transition: background-color 0.2s, transform 0.2s;
            }
            .copy-btn:hover { background-color: #219a52; transform: scale(1.05); }
            .copy-btn.copied { background-color: #007bff; }
        `;
        document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    }

    function addSpellCheckUI() {
        const editor = document.querySelector(EDITOR_SELECTOR);
        if (!editor) return;
        currentEditor = editor;
        const form = editor.closest('form');
        if (!form) return;
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        document.getElementById('spell-check-btn')?.remove();
        document.getElementById('spell-status')?.remove();
        document.getElementById('gemini-result-container')?.remove();

        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.id = 'spell-check-btn';
        checkBtn.textContent = 'Проверить текст';
        checkBtn.addEventListener('click', startSpellCheck);

        const status = document.createElement('div');
        status.id = 'spell-status';

        const resultContainer = document.createElement('div');
        resultContainer.id = 'gemini-result-container';

        submitButton.parentElement.appendChild(checkBtn);
        form.appendChild(status);
        form.appendChild(resultContainer);
    }

    async function startSpellCheck() {
        const text = currentEditor.textContent || currentEditor.innerText;
        if (!text.trim()) {
            showStatus('Текст для проверки отсутствует!', 'error');
            return;
        }

        const checkBtn = document.getElementById('spell-check-btn');
        checkBtn.disabled = true;
        showStatus('Анализируем текст через защищенный шлюз...', 'info');
        hideInlineResult();

        try {
            const fullResponse = await geminiAnalyze(text);
            const [explanation, correctedText] = parseGeminiResponse(fullResponse);

            if (explanation.trim() === "Ошибок не найдено.") {
                showStatus('Текст проверен - ошибок не найдено! ✅', 'success');
            } else {
                showStatus('Найдены рекомендации по улучшению текста. См. отчет ниже.', 'info');
                showInlineResult(explanation, correctedText);
            }
        } catch (error) {
            console.error('Ошибка при анализе:', error);
            showStatus(`Ошибка: ${error.message}. Подробности в консоли.`, 'error');
        } finally {
            checkBtn.disabled = false;
        }
    }

    function geminiAnalyze(text) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: SUPABASE_FUNCTION_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            data: JSON.stringify({ text: text }),
            onload: (response) => {
                try {
                    const result = JSON.parse(response.responseText);
                    if (response.status >= 400 || result.error) {
                        reject(new Error(result.error || `HTTP-ошибка ${response.status}`));
                    } else {
                        resolve(result.result);
                    }
                } catch (e) {
                    reject(new Error('Не удалось обработать ответ от сервера.'));
                }
            },
            onerror: () => reject(new Error('Сетевая ошибка при обращении к Supabase.')),
            timeout: 45000
        });
    });
}

    function parseGeminiResponse(response) {
        if (response.includes('---')) {
            return response.split('---', 2).map(part => part.trim());
        }
        return [response, ''];
    }

    function showInlineResult(explanation, correctedText) {
        const container = document.getElementById('gemini-result-container');
        if (!container) return;

        container.innerHTML = `
            <div class="gemini-result-header">
                <h3>Анализ текста от Gemini</h3>
                <button type="button" class="gemini-result-close-btn" title="Закрыть">&times;</button>
            </div>
            <div class="gemini-result-body">
                <div class="gemini-explanation">
                    <h4>Объяснение ошибок:</h4>
                    ${explanation}
                </div>
                <div class="gemini-corrected-text-wrapper">
                    <h4>Исправленный вариант:</h4>
                    <div class="gemini-corrected-text">${correctedText}</div>
                    <button type="button" class="copy-btn">Скопировать текст</button>
                </div>
            </div>
        `;

        container.querySelector('.gemini-result-close-btn').addEventListener('click', hideInlineResult);
        const copyBtn = container.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(correctedText).then(() => {
                copyBtn.textContent = 'Скопировано!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Скопировать текст';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
        container.classList.add('visible');
    }

    function hideInlineResult() {
        const container = document.getElementById('gemini-result-container');
        if (container) container.classList.remove('visible');
    }

    function showStatus(message, type) {
        const status = document.getElementById('spell-status');
        if (status) {
            status.textContent = message;
            status.className = `status-${type}`;
        }
    }

    function init() {
        createStyles();
        const observer = new MutationObserver(() => {
            if (document.querySelector(EDITOR_SELECTOR) && !document.getElementById('spell-check-btn')) {
                addSpellCheckUI();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(addSpellCheckUI, 2000);
    }

    init();
})();